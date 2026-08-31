import React from 'react';
import { useWallet } from '../hooks/useWallet';
import { PixelIcon } from './PixelIcon';

export const WalletConnect = ({ onConnected }) => {
  const {
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
    walletProviders,
    clearError,
  } = useWallet();

  React.useEffect(() => {
    if (onConnected) onConnected(connected);
  }, [connected, onConnected]);

  const handleConnect = async (walletProvider) => {
    clearError();
    try {
      await connect(walletProvider);
    } catch (err) {
      // hook manages error state
    }
  };

  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  const getProviderIconName = (key) => {
    if (key === 'demo') return 'flash';
    if (key === 'freighter') return 'rocket';
    if (key === 'albedo') return 'key';
    if (key === 'xbull') return 'wallet';
    return 'wallet';
  };

  // ── Connected State ──────────────────────────────────────────────────────
  if (connected) {
    return (
      <div id="wallet-connect-box" className="space-y-4 font-pixel-body">
        <div className="bg-[#D4E751] border-3 border-black p-4 shadow-[4px_4px_0px_0px_#000]">
          <div className="flex items-center justify-between mb-3 border-b-2 border-black pb-2">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 bg-black animate-ping" />
              <span className="font-pixel-heading text-xs font-bold text-black uppercase">
                LIVE ON-CHAIN
              </span>
            </div>
            <button
              onClick={disconnect}
              className="text-xs bg-black text-white font-bold px-2 py-1 hover:bg-red-600 active:translate-x-0.5 active:translate-y-0.5"
            >
              DISCONNECT
            </button>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between items-center">
              <span className="font-bold text-gray-700">WALLET:</span>
              <span className="font-bold bg-white px-2 py-0.5 border border-black uppercase flex items-center space-x-1">
                <PixelIcon name={getProviderIconName(provider)} className="w-4 h-4" />
                <span>{provider === 'demo' ? '1-TAP TESTNET' : `${provider} (LIVE)`}</span>
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-bold text-gray-700">ADDRESS:</span>
              <a
                href={`https://stellar.expert/explorer/testnet/account/${address}`}
                target="_blank"
                rel="noopener noreferrer"
                title="View on Stellar Expert Explorer"
                className="font-mono bg-white px-2 py-0.5 border border-black text-xs font-bold underline hover:bg-yellow-100"
              >
                {formatAddress(address)} ↗
              </a>
            </div>

            <div className="flex justify-between items-center pt-1 border-t border-black/20">
              <span className="font-bold text-gray-700">BALANCE:</span>
              <div className="flex items-center space-x-1.5">
                <span className="font-pixel-heading text-xs font-bold bg-black text-white px-2.5 py-1">
                  {parseFloat(balance).toFixed(2)} XLM
                </span>
                <button
                  onClick={refreshBalance}
                  title="Refresh on-chain balance"
                  className="bg-white border border-black p-1 hover:bg-yellow-200 active:translate-x-0.5 active:translate-y-0.5"
                >
                  <PixelIcon name="refresh" className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Disconnected State ───────────────────────────────────────────────────
  return (
    <div id="wallet-connect-box" className="space-y-5 font-pixel-body">
      <div className="border-b-3 border-black pb-3 flex items-center space-x-3">
        <PixelIcon name="wallet" className="w-6 h-6 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <h3 className="font-pixel-heading text-sm font-bold uppercase">CONNECT WALLET</h3>
          <p className="text-[10px] text-gray-600 mt-1">SELECT YOUR STELLAR WALLET</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border-2 border-black p-4 text-xs shadow-[2px_2px_0px_0px_#000]">
          <div className="flex justify-between items-start">
            <span className="font-bold font-pixel-heading text-[10px] text-red-900">
              ERROR
            </span>
            <button onClick={clearError} className="font-bold hover:opacity-70">
              ✕
            </button>
          </div>
          <p className="mt-2 font-bold text-red-800">{error.message}</p>
        </div>
      )}

      <div className="space-y-3">
        {Object.entries(walletProviders).map(([key, info]) => {
          const iconName = getProviderIconName(key);
          const isDemo = key === 'demo';

          return (
            <button
              key={key}
              type="button"
              onClick={() => handleConnect(key)}
              disabled={loading}
              className={`w-full flex items-center justify-between p-3.5 border-3 border-black shadow-[3px_3px_0px_0px_#000] transition-all text-left active:translate-x-0.5 active:translate-y-0.5 ${
                isDemo
                  ? 'bg-[#FEF9C3] hover:bg-[#FDE047]'
                  : 'bg-white hover:bg-yellow-100 hover:translate-x-[-2px] hover:translate-y-[-2px]'
              }`}
            >
              <div className="flex items-center space-x-3 min-w-0">
                <div
                  className={`w-9 h-9 border border-black flex items-center justify-center flex-shrink-0 shadow-[1px_1px_0px_0px_#000] ${
                    isDemo ? 'bg-[#D4E751] text-black' : 'bg-black text-white'
                  }`}
                >
                  <PixelIcon
                    name={iconName}
                    className={`w-5 h-5 ${isDemo ? 'text-black' : 'text-[#D4E751]'}`}
                  />
                </div>
                <div className="min-w-0">
                  <p className="font-pixel-heading text-xs font-bold mb-1 truncate">{info.name}</p>
                  <p className="text-[10px] text-gray-600 uppercase leading-snug">{info.description}</p>
                </div>
              </div>

              <div className="text-right flex-shrink-0 ml-3">
                {loading ? (
                  <span className="text-[10px] font-bold bg-yellow-300 px-2 py-1 border border-black">
                    CONNECTING...
                  </span>
                ) : isDemo ? (
                  <span className="text-[10px] font-bold bg-black text-[#D4E751] px-2.5 py-1 border border-black">
                    1-TAP ⚡
                  </span>
                ) : (
                  <span className="text-[10px] font-bold bg-[#D4E751] text-black px-2.5 py-1 border border-black flex items-center space-x-1">
                    <span>CONNECT</span>
                    <span>➔</span>
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <p className="text-[10px] text-center font-bold text-gray-600 pt-3 border-t border-dashed border-gray-300 mt-2">
        YOUR KEYS STAY SAFE IN YOUR WALLET
      </p>
    </div>
  );
};
