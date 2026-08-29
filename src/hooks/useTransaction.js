import { useState, useEffect, useCallback } from 'react';
import { CONFIG } from '../config';

export const useTransaction = () => {
  const [txHash, setTxHash] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, pending, confirmed, failed
  const [error, setError] = useState(null);
  const [tokenId, setTokenId] = useState(null);
  const [pollingInterval, setPollingInterval] = useState(null);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  const trackTransaction = useCallback((hash) => {
    setTxHash(hash);
    setStatus('pending');
    setError(null);
    setTokenId(null);
  }, []);

  const updateStatus = useCallback((newStatus, txTokenId = null, txError = null) => {
    setStatus(newStatus);
    if (txTokenId !== null) {
      setTokenId(txTokenId);
    }
    if (txError) {
      setError(txError);
    }
  }, []);

  const pollTransactionStatus = useCallback(async (hash, getStatusFn) => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
    }

    let attempts = 0;
    const maxAttempts = 60; // 2 minutes max with 2 second intervals

    const interval = setInterval(async () => {
      attempts++;

      try {
        const result = await getStatusFn(hash);

        if (result.status === 'confirmed') {
          setStatus('confirmed');
          clearInterval(interval);
          if (result.tokenId) {
            setTokenId(result.tokenId);
          }
        } else if (result.status === 'failed') {
          setStatus('failed');
          setError(result.error || 'Transaction failed');
          clearInterval(interval);
        } else if (attempts >= maxAttempts) {
          setStatus('timeout');
          setError('Transaction confirmation timeout');
          clearInterval(interval);
        }
      } catch (err) {
        console.error('Error checking transaction status:', err);
        if (attempts >= maxAttempts) {
          setStatus('failed');
          setError('Failed to check transaction status');
          clearInterval(interval);
        }
      }
    }, CONFIG.TRANSACTION_POLL_INTERVAL);

    setPollingInterval(interval);
  }, [pollingInterval]);

  const reset = useCallback(() => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
    }
    setTxHash(null);
    setStatus('idle');
    setError(null);
    setTokenId(null);
  }, [pollingInterval]);

  return {
    txHash,
    status,
    error,
    tokenId,
    trackTransaction,
    updateStatus,
    pollTransactionStatus,
    reset,
  };
};
