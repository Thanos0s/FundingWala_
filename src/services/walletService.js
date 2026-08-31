import { CONFIG } from '../config';
import {
  WalletConnectionError,
  WalletNotFoundError,
  WalletRejectionError,
} from '../utils/errorHandler';
import * as StellarSdk from '@stellar/stellar-sdk';
import albedo from '@albedo-link/intent';
import {
  isConnected as isFreighterConnected,
  requestAccess as requestFreighterAccess,
  getAddress as getFreighterAddress,
  signTransaction as signFreighterTransaction,
} from '@stellar/freighter-api';

// Wallet provider metadata
export const WALLET_PROVIDERS = {
  freighter: {
    name: 'Freighter',
    icon: 'rocket',
    color: 'from-blue-500 to-blue-700',
    installUrl: 'https://www.freighter.app/',
    description: 'Official browser extension (Live on-chain)',
  },
  albedo: {
    name: 'Albedo',
    icon: 'key',
    color: 'from-purple-500 to-purple-700',
    installUrl: 'https://albedo.link/',
    description: 'Live Web & Mobile Signer (No extension needed)',
  },
  xbull: {
    name: 'xBull',
    icon: 'wallet',
    color: 'from-yellow-500 to-orange-600',
    installUrl: 'https://xbull.app/',
    description: 'Stellar web & mobile wallet',
  },
};

export class WalletService {
  constructor() {
    this.provider = null;
    this.publicKey = null;
    this.server = new StellarSdk.SorobanRpc.Server(CONFIG.SOROBAN_RPC_URL);
  }

  /**
   * Detect installed wallet providers
   */
  detectProviders() {
    const providers = [];
    if (this.isProviderInstalled('freighter')) providers.push('freighter');
    if (this.isProviderInstalled('albedo')) providers.push('albedo');
    if (this.isProviderInstalled('xbull')) providers.push('xbull');
    return providers;
  }

  /**
   * Check if a specific provider is installed (synchronous)
   */
  isProviderInstalled(provider) {
    switch (provider) {
      case 'demo':
        return true;
      case 'albedo':
        return true; // Albedo is web-based via CDN and always works everywhere
      case 'freighter':
        return !!(
          typeof window !== 'undefined' &&
          (window.freighterApi || window.freighter || window.stellar)
        );
      case 'xbull':
        return !!(typeof window !== 'undefined' && (window.xBullSDK || window.xbull));
      default:
        return false;
    }
  }

  /**
   * Check if a specific provider is installed (asynchronous, works for extension delay)
   */
  async isProviderInstalledAsync(provider) {
    if (provider === 'freighter') {
      if (this.isProviderInstalled('freighter')) return true;
      try {
        const conn = await isFreighterConnected();
        return !!(conn && (conn.isConnected || conn === true));
      } catch (_) {
        return false;
      }
    }
    return this.isProviderInstalled(provider);
  }

  /**
   * Connect to Freighter wallet
   */
  async connectFreighter() {
    try {
      let publicKey = null;

      // 1. Try official @stellar/freighter-api requestAccess
      try {
        const accessObj = await requestFreighterAccess();
        if (accessObj) {
          if (typeof accessObj === 'string' && !accessObj.includes('error')) {
            publicKey = accessObj;
          } else if (accessObj.address) {
            publicKey = accessObj.address;
          } else if (accessObj.publicKey) {
            publicKey = accessObj.publicKey;
          } else if (accessObj.error) {
            if (
              accessObj.error.includes('User declined') ||
              accessObj.error.includes('rejected') ||
              accessObj.error.includes('denied')
            ) {
              throw new WalletRejectionError();
            }
          }
        }
      } catch (e) {
        if (e instanceof WalletRejectionError) throw e;
      }

      // 2. Try getFreighterAddress
      if (!publicKey) {
        try {
          const addrObj = await getFreighterAddress();
          if (addrObj) {
            if (typeof addrObj === 'string' && !addrObj.includes('error')) {
              publicKey = addrObj;
            } else if (addrObj.address) {
              publicKey = addrObj.address;
            } else if (addrObj.publicKey) {
              publicKey = addrObj.publicKey;
            }
          }
        } catch (_) {}
      }

      // 3. Fallback to window.freighterApi or window.freighter
      if (!publicKey && typeof window !== 'undefined') {
        const api = window.freighterApi || window.freighter;
        if (api) {
          try {
            if (typeof api.requestAccess === 'function') {
              const res = await api.requestAccess();
              publicKey = res?.address || res?.publicKey || (typeof res === 'string' ? res : null);
            }
            if (!publicKey && typeof api.getPublicKey === 'function') {
              const res = await api.getPublicKey();
              publicKey = res?.address || res?.publicKey || (typeof res === 'string' ? res : null);
            }
            if (!publicKey && typeof api.getAddress === 'function') {
              const res = await api.getAddress();
              publicKey = res?.address || res?.publicKey || (typeof res === 'string' ? res : null);
            }
          } catch (e) {
            if (
              e?.message?.includes('User declined') ||
              e?.message?.includes('rejected') ||
              e?.message?.includes('denied')
            ) {
              throw new WalletRejectionError();
            }
          }
        }
      }

      // 4. Fallback to window.stellar
      if (!publicKey && typeof window !== 'undefined' && window.stellar) {
        try {
          if (typeof window.stellar.request === 'function') {
            const res = await window.stellar.request({ method: 'getPublicKey' });
            publicKey = res?.address || res?.publicKey || (typeof res === 'string' ? res : null);
          }
        } catch (_) {}
      }

      if (!publicKey) {
        const isInstalled = await this.isProviderInstalledAsync('freighter');
        if (!isInstalled) {
          throw new WalletNotFoundError('Freighter');
        }
        throw new WalletConnectionError(
          'Could not retrieve account from Freighter. Please unlock your Freighter extension, switch to Testnet, and approve connection.'
        );
      }

      this.provider = 'freighter';
      this.publicKey = publicKey.trim();
      sessionStorage.setItem('wallet_provider', 'freighter');
      sessionStorage.setItem('wallet_address', this.publicKey);

      return { publicKey: this.publicKey };
    } catch (error) {
      if (
        error instanceof WalletConnectionError ||
        error instanceof WalletNotFoundError ||
        error instanceof WalletRejectionError
      ) {
        throw error;
      }
      if (
        error?.message?.includes('rejected') ||
        error?.message?.includes('denied') ||
        error?.message?.includes('User declined')
      ) {
        throw new WalletRejectionError();
      }
      throw new WalletConnectionError(
        'Freighter connection failed: ' + (error?.message || 'Wallet not responding')
      );
    }
  }

  /**
   * Connect to Albedo wallet
   */
  async connectAlbedo() {
    try {
      const signer = typeof window !== 'undefined' && window.albedo ? window.albedo : albedo;
      if (!signer || typeof signer.publicKey !== 'function') {
        throw new WalletNotFoundError('Albedo');
      }

      const result = await signer.publicKey({
        require_existing: false,
      });

      if (!result || !result.pubkey) {
        throw new WalletRejectionError();
      }

      this.provider = 'albedo';
      this.publicKey = result.pubkey;
      sessionStorage.setItem('wallet_provider', 'albedo');
      sessionStorage.setItem('wallet_address', result.pubkey);

      return { publicKey: result.pubkey };
    } catch (error) {
      if (
        error instanceof WalletConnectionError ||
        error instanceof WalletNotFoundError ||
        error instanceof WalletRejectionError
      ) {
        throw error;
      }
      if (error?.message?.includes('rejected') || error?.code === -1) {
        throw new WalletRejectionError();
      }
      throw new WalletConnectionError('Albedo connection failed: ' + error?.message);
    }
  }

  /**
   * Connect to xBull wallet
   */
  async connectXBull() {
    try {
      const xbullSDK = window.xBullSDK || window.xbull;
      if (!xbullSDK) {
        throw new WalletNotFoundError('xBull');
      }

      const result = await xbullSDK.connect();
      const publicKey = result?.publicKey || result;

      if (!publicKey) {
        throw new WalletRejectionError();
      }

      this.provider = 'xbull';
      this.publicKey = publicKey;
      sessionStorage.setItem('wallet_provider', 'xbull');
      sessionStorage.setItem('wallet_address', publicKey);

      return { publicKey };
    } catch (error) {
      if (error instanceof WalletConnectionError) throw error;
      if (error?.message?.includes('rejected')) {
        throw new WalletRejectionError();
      }
      throw new WalletConnectionError('xBull connection failed: ' + error?.message);
    }
  }

  /**
   * Connect with a specific Stellar address (e.g. user Freighter public key)
   */
  async connectAddress(publicKey, provider = 'freighter') {
    const trimmed = (publicKey || '').trim();
    if (!StellarSdk.StrKey.isValidEd25519PublicKey(trimmed)) {
      throw new WalletConnectionError('Invalid Stellar Public Key (must be 56 chars starting with G)');
    }
    this.provider = provider;
    this.publicKey = trimmed;
    sessionStorage.setItem('wallet_provider', provider);
    sessionStorage.setItem('wallet_address', trimmed);
    return { publicKey: trimmed };
  }

  /**
   * Connect wallet by provider name
   */
  async connect(provider) {
    switch (provider) {
      case 'freighter':
        return this.connectFreighter();
      case 'albedo':
        return this.connectAlbedo();
      case 'xbull':
        return this.connectXBull();
      default:
        throw new WalletConnectionError(`Unknown wallet provider: ${provider}`);
    }
  }

  /**
   * Sign a transaction with the connected wallet
   */
  async signTransaction(tx) {
    const xdr = tx.toXDR();

    if (this.provider === 'freighter') {
      let signedXdr = null;

      try {
        const res = await signFreighterTransaction(xdr, {
          networkPassphrase: CONFIG.NETWORK_PASSPHRASE,
          network: 'TESTNET',
        });
        if (res && res.signedTxXdr) {
          signedXdr = res.signedTxXdr;
        } else if (typeof res === 'string') {
          signedXdr = res;
        }
      } catch (e) {
        console.warn('freighter-api signTransaction fallback:', e);
      }

      if (!signedXdr && typeof window !== 'undefined') {
        const freighterApi = window.freighterApi || window.freighter;
        if (freighterApi && typeof freighterApi.signTransaction === 'function') {
          const result = await freighterApi.signTransaction(xdr, {
            networkPassphrase: CONFIG.NETWORK_PASSPHRASE,
            network: 'TESTNET',
          });
          signedXdr = typeof result === 'string' ? result : result?.signedTxXdr || result;
        }
      }

      if (!signedXdr) {
        throw new WalletConnectionError('Freighter transaction signing failed or was rejected');
      }

      return StellarSdk.TransactionBuilder.fromXDR(signedXdr, CONFIG.NETWORK_PASSPHRASE);

    } else if (this.provider === 'albedo') {
      const signer = typeof window !== 'undefined' && window.albedo ? window.albedo : albedo;
      const result = await signer.tx({
        xdr,
        network: 'testnet',
        submit: false,
      });
      return StellarSdk.TransactionBuilder.fromXDR(
        result.signed_envelope_xdr,
        CONFIG.NETWORK_PASSPHRASE
      );

    } else if (this.provider === 'xbull') {
      const xbullSDK = window.xBullSDK || window.xbull;
      const result = await xbullSDK.signXDR(xdr, {
        network: 'TESTNET',
      });
      const signedXdr = typeof result === 'string' ? result : result?.signedXDR || result;
      return StellarSdk.TransactionBuilder.fromXDR(signedXdr, CONFIG.NETWORK_PASSPHRASE);

    } else {
      throw new WalletConnectionError('No wallet connected');
    }
  }

  /**
   * Get wallet balance in XLM from Stellar Horizon REST API
   */
  async getBalance(publicKey) {
    if (!publicKey) return '0';
    try {
      const response = await fetch(`${CONFIG.HORIZON_URL}/accounts/${publicKey}`);
      if (!response.ok) {
        console.warn(`Horizon account lookup status ${response.status} for ${publicKey}`);
        return '0';
      }
      const data = await response.json();
      const nativeBalance = data.balances?.find((b) => b.asset_type === 'native');
      return nativeBalance ? nativeBalance.balance : '0';
    } catch (error) {
      console.error('Error fetching balance:', error);
      return '0';
    }
  }

  /**
   * Try to reconnect to previous wallet
   */
  async tryReconnect() {
    const savedProvider = sessionStorage.getItem('wallet_provider');
    const savedAddress = sessionStorage.getItem('wallet_address');

    if (!savedProvider || !savedAddress) return null;

    // Never auto-reconnect demo wallet so dummy account never overrides real wallet
    if (savedProvider === 'demo') {
      this.disconnect();
      return null;
    }

    try {
      if (!this.isProviderInstalled(savedProvider)) return null;
      await this.connect(savedProvider);
      return { provider: savedProvider, publicKey: this.publicKey };
    } catch (error) {
      console.warn('Failed to reconnect to wallet:', error);
      this.disconnect();
      return null;
    }
  }

  /**
   * Disconnect wallet
   */
  disconnect() {
    this.provider = null;
    this.publicKey = null;
    this.demoKeypair = null;
    sessionStorage.removeItem('wallet_provider');
    sessionStorage.removeItem('wallet_address');
    sessionStorage.removeItem('demo_wallet_secret');
    try {
      localStorage.removeItem('wallet_provider');
      localStorage.removeItem('wallet_address');
      localStorage.removeItem('demo_wallet_secret');
    } catch (_) {}
  }

  isConnected() {
    return !!this.publicKey;
  }

  getWalletInfo() {
    return {
      connected: this.isConnected(),
      provider: this.provider,
      publicKey: this.publicKey,
    };
  }
}

export const walletService = new WalletService();
