import { useState, useEffect, useCallback, useRef } from 'react';
import { contractService } from '../services/contractService';
import { eventService } from '../services/eventService';
import { CONFIG } from '../config';
import { handleError } from '../utils/errorHandler';
import { walletService } from '../services/walletService';

const DEFAULT_CAMPAIGN_ID = 'default';

const getInitialCustomCampaigns = () => {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem('fundingwala_custom_campaigns');
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    console.warn('Failed to load custom campaigns:', e);
    return [];
  }
};

export const useCrowdfunding = () => {
  const [customCampaigns, setCustomCampaigns] = useState(getInitialCustomCampaigns);
  const [selectedCampaignId, setSelectedCampaignId] = useState(DEFAULT_CAMPAIGN_ID);

  const [onChainCampaign, setOnChainCampaign] = useState({
    id: DEFAULT_CAMPAIGN_ID,
    title: CONFIG.CAMPAIGN_TITLE,
    category: 'Clean Water',
    description: CONFIG.CAMPAIGN_DESCRIPTION,
    admin: 'GCK3REPLT7LXQF3BHTBEMN4O6JRX4GBTMCYMLHWGJMWKWQX7D3GBJHCO',
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

  // Combine default on-chain campaign with custom created campaigns
  const campaigns = [onChainCampaign, ...customCampaigns];
  const selectedCampaign =
    campaigns.find((c) => c.id === selectedCampaignId) || onChainCampaign;

  /**
   * Select active campaign by ID
   */
  const selectCampaign = useCallback((id) => {
    setSelectedCampaignId(id);
  }, []);

  /**
   * Create a new crowdfunding campaign
   */
  const createCampaign = useCallback(
    async ({
      title,
      category = 'Community',
      description,
      goal,
      durationDays = 30,
    }) => {
      const goalNum = Number(goal);
      if (!title || !description || isNaN(goalNum) || goalNum <= 0) {
        throw new Error('Please provide valid title, description, and goal amount.');
      }

      const creatorAddress =
        walletService.publicKey || 'G_CREATOR_TESTNET_' + Math.random().toString(36).substring(2, 8).toUpperCase();

      const m1Amt = Math.round((goalNum * 30) / 100);
      const m2Amt = Math.round((goalNum * 40) / 100);
      const m3Amt = goalNum - m1Amt - m2Amt;

      const newId = 'camp_' + Date.now();
      const currentLedger = onChainCampaign.deadline - 50000;
      const targetDeadline = currentLedger + durationDays * 17280;

      const newCampaign = {
        id: newId,
        title: title.trim(),
        category,
        description: description.trim(),
        admin: creatorAddress,
        goal: goalNum,
        raised: 0,
        deadline: targetDeadline,
        active: true,
        progress: 0,
        createdAt: new Date().toLocaleDateString(),
        milestones: [
          {
            id: 1,
            title: 'Phase 1: Planning & Setup',
            targetAmount: m1Amt,
            deadline: Math.round(targetDeadline / 3),
            approvals: 0,
            rejections: 0,
            released: false,
            disputed: false,
          },
          {
            id: 2,
            title: 'Phase 2: Core Execution',
            targetAmount: m2Amt,
            deadline: Math.round((targetDeadline * 2) / 3),
            approvals: 0,
            rejections: 0,
            released: false,
            disputed: false,
          },
          {
            id: 3,
            title: 'Phase 3: Final Delivery',
            targetAmount: m3Amt,
            deadline: targetDeadline,
            approvals: 0,
            rejections: 0,
            released: false,
            disputed: false,
          },
        ],
        spendingLogs: [],
        donations: [],
      };

      setCustomCampaigns((prev) => {
        const updated = [newCampaign, ...prev];
        try {
          localStorage.setItem('fundingwala_custom_campaigns', JSON.stringify(updated));
        } catch (e) {
          console.warn('LocalStorage save error:', e);
        }
        return updated;
      });

      setSelectedCampaignId(newId);
      return newCampaign;
    },
    [onChainCampaign.deadline]
  );

  /**
   * Fetch campaign & milestone data from contract (for on-chain campaign)
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

      setOnChainCampaign((prev) => ({
        ...prev,
        ...campData,
        progress,
      }));

      setMilestones(milesData);
      setSpendingLogs(logsData);
      setCreatorReputation(repData);
    } catch (error) {
      console.error('Failed to fetch campaign data:', error);
    } finally {
      setLoadingCampaign(false);
    }
  }, []);

  // Effective milestones and logs for currently selected campaign
  const effectiveMilestones =
    selectedCampaign.id === DEFAULT_CAMPAIGN_ID
      ? milestones
      : selectedCampaign.milestones || [];

  const effectiveSpendingLogs =
    selectedCampaign.id === DEFAULT_CAMPAIGN_ID
      ? spendingLogs
      : selectedCampaign.spendingLogs || [];

  /**
   * Vote on a milestone
   */
  const voteMilestone = useCallback(
    async (milestoneId, approve = true) => {
      setVotingState({ status: 'voting', error: null });
      try {
        if (selectedCampaign.id === DEFAULT_CAMPAIGN_ID) {
          const res = await contractService.voteMilestone(milestoneId, approve);
          setVotingState({ status: 'voted', error: null });
          await fetchCampaign();
          return res;
        } else {
          // Custom campaign local milestone voting
          setCustomCampaigns((prev) =>
            prev.map((c) => {
              if (c.id !== selectedCampaign.id) return c;
              const updatedMilestones = (c.milestones || []).map((m) => {
                if (m.id === milestoneId) {
                  return {
                    ...m,
                    approvals: approve ? m.approvals + 1 : m.approvals,
                    rejections: !approve ? m.rejections + 1 : m.rejections,
                  };
                }
                return m;
              });
              return { ...c, milestones: updatedMilestones };
            })
          );
          setVotingState({ status: 'voted', error: null });
          return { status: 'SUCCESS' };
        }
      } catch (err) {
        setVotingState({ status: 'error', error: err.message || 'Voting failed' });
        throw err;
      }
    },
    [selectedCampaign.id, fetchCampaign]
  );

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
        if (prev.some((d) => d.id === donationEvent.id)) return prev;
        return [donationEvent, ...prev].slice(0, 20);
      });

      // Update on-chain campaign raised amount optimistically
      if (donationEvent.amount > 0) {
        setOnChainCampaign((prev) => {
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
  const donate = useCallback(
    async (amountXLM) => {
      setDonationState({
        status: 'submitting',
        txHash: null,
        error: null,
        amountXLM,
      });

      try {
        if (selectedCampaign.id === DEFAULT_CAMPAIGN_ID) {
          // Submit on-chain donation transaction to Soroban
          const result = await contractService.donate(amountXLM);

          setDonationState((prev) => ({
            ...prev,
            status: 'pending',
            txHash: result.txHash,
          }));

          eventService.addLocalDonation(
            walletService.publicKey,
            amountXLM,
            result.txHash
          );

          const confirmation = await contractService.waitForTransaction(result.txHash);

          if (confirmation.status === 'confirmed') {
            setDonationState((prev) => ({
              ...prev,
              status: 'confirmed',
              txHash: result.txHash,
            }));
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
        } else {
          // Real on-chain payment via user's connected wallet for custom campaign
          const result = await contractService.donateCustom(amountXLM, selectedCampaign);

          setDonationState({
            status: 'confirmed',
            txHash: result.txHash,
            error: null,
            amountXLM,
          });

          eventService.addLocalDonation(
            walletService.publicKey || 'G_DONOR_WALLET',
            amountXLM,
            result.txHash
          );

          setCustomCampaigns((prev) => {
            const updated = prev.map((c) => {
              if (c.id !== selectedCampaign.id) return c;
              const newRaised = (c.raised || 0) + amountXLM;
              const progress = c.goal > 0 ? Math.min(100, (newRaised / c.goal) * 100) : 0;
              return { ...c, raised: newRaised, progress };
            });
            try {
              localStorage.setItem('fundingwala_custom_campaigns', JSON.stringify(updated));
            } catch (_) {}
            return updated;
          });

          return result;
        }
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
    },
    [selectedCampaign.id, fetchCampaign]
  );

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
    campaign: selectedCampaign,
    campaigns,
    selectedCampaignId,
    selectCampaign,
    createCampaign,
    donations,
    milestones: effectiveMilestones,
    spendingLogs: effectiveSpendingLogs,
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
