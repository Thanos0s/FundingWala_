import { useState, useEffect, useCallback, useRef } from 'react';
import { contractService } from '../services/contractService';
import { eventService } from '../services/eventService';
import { CONFIG } from '../config';
import { handleError } from '../utils/errorHandler';
import { walletService } from '../services/walletService';

export const useCrowdfunding = () => {
  const [campaign, setCampaign] = useState({
    goal: CONFIG.CAMPAIGN_GOAL_XLM,
    raised: 0,
    deadline: CONFIG.CAMPAIGN_DEADLINE_LEDGER,
    active: true,
    progress: 0,
  });
  const [donations, setDonations] = useState([]);
  const [loadingCampaign, setLoadingCampaign] = useState(true);

  // Donation transaction state
  const [donationState, setDonationState] = useState({
    status: 'idle', // idle | submitting | pending | confirmed | failed
    txHash: null,
    error: null,
    amountXLM: null,
  });

  const refreshIntervalRef = useRef(null);

  /**
   * Fetch campaign data from contract
   */
  const fetchCampaign = useCallback(async () => {
    try {
      const data = await contractService.getCampaign();
      const progress =
        data.goal > 0 ? Math.min(100, (data.raised / data.goal) * 100) : 0;
      setCampaign({ ...data, progress });
    } catch (error) {
      console.error('Failed to fetch campaign:', error);
    } finally {
      setLoadingCampaign(false);
    }
  }, []);

  /**
   * Start auto-refresh polling
   */
  const startRefreshing = useCallback(() => {
    if (refreshIntervalRef.current) return;
    refreshIntervalRef.current = setInterval(() => {
      fetchCampaign();
    }, CONFIG.CAMPAIGN_REFRESH_INTERVAL);
  }, [fetchCampaign]);

  /**
   * Stop auto-refresh polling
   */
  const stopRefreshing = useCallback(() => {
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }
  }, []);

  // Initial load + start polling
  useEffect(() => {
    fetchCampaign();
    startRefreshing();

    // Subscribe to donation events
    const listenerId = eventService.subscribeToDonations((donationEvent) => {
      setDonations((prev) => {
        // Avoid duplicates
        if (prev.some((d) => d.id === donationEvent.id)) return prev;
        return [donationEvent, ...prev].slice(0, 20);
      });

      // Update campaign raised amount optimistically
      if (donationEvent.amount > 0) {
        setCampaign((prev) => {
          const newRaised = prev.raised + donationEvent.amount;
          const progress =
            prev.goal > 0 ? Math.min(100, (newRaised / prev.goal) * 100) : 0;
          return { ...prev, raised: newRaised, progress };
        });
      }
    });

    return () => {
      stopRefreshing();
      eventService.unsubscribe(listenerId);
    };
  }, [fetchCampaign, startRefreshing, stopRefreshing]);

  /**
   * Submit a donation
   * @param {number} amountXLM
   */
  const donate = useCallback(async (amountXLM) => {
    setDonationState({
      status: 'submitting',
      txHash: null,
      error: null,
      amountXLM,
    });

    try {
      // Submit donation transaction
      const result = await contractService.donate(amountXLM);

      setDonationState((prev) => ({
        ...prev,
        status: 'pending',
        txHash: result.txHash,
      }));

      // Add local donation event for immediate UI feedback
      eventService.addLocalDonation(
        walletService.publicKey,
        amountXLM,
        result.txHash
      );

      // Wait for confirmation
      const confirmation = await contractService.waitForTransaction(result.txHash);

      if (confirmation.status === 'confirmed') {
        setDonationState((prev) => ({
          ...prev,
          status: 'confirmed',
          txHash: result.txHash,
        }));
        // Refresh campaign data after confirmation
        await fetchCampaign();
      } else {
        setDonationState((prev) => ({
          ...prev,
          status: 'failed',
          error: {
            message: confirmation.error || 'Transaction failed on-chain',
            type: 'CONTRACT_EXECUTION',
          },
        }));
      }

      return result;
    } catch (error) {
      const errorInfo = handleError(error);
      setDonationState({
        status: 'failed',
        txHash: null,
        error: errorInfo,
        amountXLM,
      });
      throw error;
    }
  }, [fetchCampaign]);

  /**
   * Reset donation state to idle
   */
  const resetDonation = useCallback(() => {
    setDonationState({
      status: 'idle',
      txHash: null,
      error: null,
      amountXLM: null,
    });
  }, []);

  return {
    campaign,
    donations,
    loadingCampaign,
    donationState,
    donate,
    resetDonation,
    refreshCampaign: fetchCampaign,
  };
};
