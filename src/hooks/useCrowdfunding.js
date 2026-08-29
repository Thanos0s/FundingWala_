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

  const [milestones, setMilestones] = useState([]);
  const [spendingLogs, setSpendingLogs] = useState([]);
  const [creatorReputation, setCreatorReputation] = useState({
    completedMilestones: 1,
    totalCampaigns: 1,
    totalDeliveredXLM: 300,
    trustScore: 94,
  });
  const [votingState, setVotingState] = useState({ status: 'idle', error: null });

  const refreshIntervalRef = useRef(null);

  /**
   * Fetch campaign & milestone data from contract
   */
  const fetchCampaign = useCallback(async () => {
    try {
      const [campData, milesData, logsData, repData] = await Promise.all([
        contractService.getCampaign(),
        contractService.getMilestones(),
        contractService.getSpendingLogs(),
        contractService.getCreatorReputation(),
      ]);

      const progress =
        campData.goal > 0 ? Math.min(100, (campData.raised / campData.goal) * 100) : 0;
      setCampaign({ ...campData, progress });
      setMilestones(milesData);
      setSpendingLogs(logsData);
      setCreatorReputation(repData);
    } catch (error) {
      console.error('Failed to fetch campaign data:', error);
    } finally {
      setLoadingCampaign(false);
    }
  }, []);

  /**
   * Vote on a milestone
   */
  const voteMilestone = useCallback(async (milestoneId, approve = true) => {
    setVotingState({ status: 'voting', error: null });
    try {
      const res = await contractService.voteMilestone(milestoneId, approve);
      setVotingState({ status: 'voted', error: null });
      await fetchCampaign();
      return res;
    } catch (err) {
      setVotingState({ status: 'error', error: err.message || 'Voting failed' });
      throw err;
    }
  }, [fetchCampaign]);

  /**
   * Claim automated refund
   */
  const claimRefund = useCallback(async () => {
    try {
      const res = await contractService.claimRefund();
      await fetchCampaign();
      return res;
    } catch (err) {
      throw err;
    }
  }, [fetchCampaign]);

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

  // Compute Quadratic Funding metrics dynamically
  const qfMetrics = contractService.calculateQuadraticFunding(donations, 500);

  return {
    campaign,
    donations,
    milestones,
    spendingLogs,
    creatorReputation,
    qfMetrics,
    loadingCampaign,
    donationState,
    votingState,
    donate,
    voteMilestone,
    claimRefund,
    resetDonation,
    refreshCampaign: fetchCampaign,
  };
};
