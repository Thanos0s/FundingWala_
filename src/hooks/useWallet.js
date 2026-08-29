import { useState, useEffect, useCallback } from 'react';
import { walletService, WALLET_PROVIDERS } from '../services/walletService';
import { handleError } from '../utils/errorHandler';

export const useWallet = () => {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState(null);
  const [balance, setBalance] = useState('0');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [provider, setProvider] = useState(null);
  const [installedProviders, setInstalledProviders] = useState({
    freighter: walletService.isProviderInstalled('freighter'),
    albedo: walletService.isProviderInstalled('albedo'),
    xbull: walletService.isProviderInstalled('xbull'),
  });

  const checkInstalledProviders = useCallback(async () => {
    const freighterInstalled = await walletService.isProviderInstalledAsync('freighter');
    const albedoInstalled = walletService.isProviderInstalled('albedo');
    const xbullInstalled = walletService.isProviderInstalled('xbull');

    setInstalledProviders({
      freighter: freighterInstalled,
      albedo: albedoInstalled,
      xbull: xbullInstalled,
    });
  }, []);

  const fetchBalance = useCallback(async (publicKey) => {
    try {
      const bal = await walletService.getBalance(publicKey);
      setBalance(bal);
    } catch (err) {
      console.error('Error fetching balance:', err);
      setBalance('0');
    }
  }, []);

  // Async detect installed wallet extensions (handles injection delay)
  useEffect(() => {
    checkInstalledProviders();

    const handleLoadOrFocus = () => {
      checkInstalledProviders();
    };

    window.addEventListener('load', handleLoadOrFocus);
    window.addEventListener('focus', handleLoadOrFocus);
    const timer1 = setTimeout(checkInstalledProviders, 300);
    const timer2 = setTimeout(checkInstalledProviders, 1000);

    return () => {
      window.removeEventListener('load', handleLoadOrFocus);
      window.removeEventListener('focus', handleLoadOrFocus);
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [checkInstalledProviders]);

  // Auto-reconnect from session storage on mount
  useEffect(() => {
    const initializeWallet = async () => {
      setLoading(true);
      try {
        const reconnected = await walletService.tryReconnect();
        if (reconnected) {
          setConnected(true);
          setAddress(walletService.publicKey);
          setProvider(walletService.provider);
          await fetchBalance(walletService.publicKey);
        }
      } catch (err) {
        console.warn('Auto-reconnect failed:', err);
      } finally {
        setLoading(false);
      }
    };
    initializeWallet();
  }, [fetchBalance]);

  const connect = useCallback(
    async (walletProvider) => {
      setLoading(true);
      setError(null);
      try {
        const result = await walletService.connect(walletProvider);
        setConnected(true);
        setAddress(result.publicKey);
        setProvider(walletProvider);
        await fetchBalance(result.publicKey);
        return result;
      } catch (err) {
        const errorInfo = handleError(err);
        setError(errorInfo);
        setConnected(false);
        setAddress(null);
        throw err;
      } finally {
        setLoading(false);
        checkInstalledProviders();
      }
    },
    [fetchBalance, checkInstalledProviders]
  );

  const disconnect = useCallback(() => {
    walletService.disconnect();
    setConnected(false);
    setAddress(null);
    setBalance('0');
    setProvider(null);
    setError(null);
  }, []);

  const refreshBalance = useCallback(async () => {
    if (address) {
      await fetchBalance(address);
    }
  }, [address, fetchBalance]);

  const isProviderInstalled = useCallback(
    (walletProvider) => {
      return (
        installedProviders[walletProvider] ||
        walletService.isProviderInstalled(walletProvider)
      );
    },
    [installedProviders]
  );

  const clearError = useCallback(() => setError(null), []);

  return {
    connected,
    address,
    balance,
    loading,
    error,
    provider,
    connect,
    disconnect,
    refreshBalance,
    isProviderInstalled,
    clearError,
    walletProviders: WALLET_PROVIDERS,
  };
};
