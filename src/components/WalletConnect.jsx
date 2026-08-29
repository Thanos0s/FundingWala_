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
    if (key === 'freighter') return 'rocket';
    if (key === 'albedo') return 'key';
    if (key === 'xbull') return 'flash';
    return 'wallet';
  };

  // ── Connected State ──────────────────────────────────────────────────────
  if (connected) {
    return (
      <div className="space-y-4 font-pixel-body">
        <div className="bg-[#D4E751] border-3 border-black p-4 shadow-[4px_4px_0px_0px_#000]">
          <div className="flex items-center justify-between mb-3 border-b-2 border-black pb-2">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 bg-black animate-ping" />
              <span className="font-pixel-heading text-xs font-bold text-black uppercase">
                CONNECTED
              </span>
            </div>
            <button
              onClick={disconnect}
              className="text-xs bg-black text-white font-bold px-2 py-1 hover:bg-red-600"
            >
              DISCONNECT
            </button>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="font-bold text-gray-700">WALLET:</span>
              <span className="font-bold bg-white px-2 py-0.5 border border-black uppercase flex items-center space-x-1">
                <PixelIcon name={getProviderIconName(provider)} className="w-4 h-4" />
                <span>{provider}</span>
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-bold text-gray-700">ADDRESS:</span>
              <code className="font-mono bg-white px-2 py-0.5 border border-black text-xs font-bold">
                {formatAddress(address)}
              </code>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-bold text-gray-700">BALANCE:</span>
              <span className="font-pixel-heading text-xs font-bold bg-black text-white px-2.5 py-1">
                {parseFloat(balance).toFixed(2)} XLM
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Disconnected State ───────────────────────────────────────────────────
  return (
    <div className="space-y-5 font-pixel-body">
      <div className="border-b-3 border-black pb-3 flex items-center space-x-3">
        <PixelIcon name="wallet" className="w-6 h-6 flex-shrink-0" />
        <div>
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

      <div className="space-y-4">
        {Object.entries(walletProviders).map(([key, info]) => {
          const installed = isProviderInstalled(key);
          const iconName = getProviderIconName(key);

          return (
            <button
              key={key}
              onClick={() => handleConnect(key)}
              disabled={loading}
              className={`w-full flex items-center justify-between p-4 border-3 border-black shadow-[3px_3px_0px_0px_#000] transition-all text-left ${
                installed
                  ? 'bg-white hover:bg-yellow-100 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_0px_#000]'
                  : 'bg-gray-100 opacity-80'
              }`}
            >
              <div className="flex items-center space-x-3 min-w-0">
                <div className="w-9 h-9 bg-black text-white border border-black flex items-center justify-center flex-shrink-0 shadow-[1px_1px_0px_0px_#000]">
                  <PixelIcon name={iconName} className="w-5 h-5 text-[#D4E751]" />
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
                ) : installed ? (
                  <span className="text-[10px] font-bold bg-[#D4E751] text-black px-2.5 py-1 border border-black">
                    READY
                  </span>
                ) : (
                  <a
                    href={info.installUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-[10px] font-bold bg-black text-white px-2.5 py-1 underline hover:bg-gray-800 inline-block"
                  >
                    INSTALL ↗
                  </a>
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
