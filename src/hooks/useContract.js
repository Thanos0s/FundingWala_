import { useState, useCallback } from 'react';
import { contractService } from '../services/contractService';
import { handleError } from '../utils/errorHandler';

export const useContract = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const mintNFT = useCallback(async (name, description, uri) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const result = await contractService.mintNFT(name, description, uri);
      setResult(result);
      return result;
    } catch (err) {
      const errorInfo = handleError(err);
      setError(errorInfo);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getNFT = useCallback(async (tokenId) => {
    setLoading(true);
    setError(null);

    try {
      const nft = await contractService.getNFT(tokenId);
      setResult(nft);
      return nft;
    } catch (err) {
      const errorInfo = handleError(err);
      setError(errorInfo);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getNFTOwner = useCallback(async (tokenId) => {
    setLoading(true);
    setError(null);

    try {
      const owner = await contractService.getNFTOwner(tokenId);
      setResult(owner);
      return owner;
    } catch (err) {
      const errorInfo = handleError(err);
      setError(errorInfo);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getTotalSupply = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const supply = await contractService.getTotalSupply();
      setResult(supply);
      return supply;
    } catch (err) {
      const errorInfo = handleError(err);
      setError(errorInfo);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getTransactionStatus = useCallback(async (txHash) => {
    setLoading(true);
    setError(null);

    try {
      const status = await contractService.getTransactionStatus(txHash);
      setResult(status);
      return status;
    } catch (err) {
      const errorInfo = handleError(err);
      setError(errorInfo);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    result,
    mintNFT,
    getNFT,
    getNFTOwner,
    getTotalSupply,
    getTransactionStatus,
    clearError,
  };
};
