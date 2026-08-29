import React from 'react';
import { CONFIG } from '../config';
import { PixelIcon } from './PixelIcon';

export const TransactionStatus = ({ txHash, status }) => {
  if (!txHash && !status) return null;

  const configs = {
    submitting: {
      icon: 'refresh',
      label: 'SUBMITTING TRANSACTION...',
      bg: 'bg-yellow-100 border-yellow-600',
      textColor: 'text-yellow-900',
    },
    pending: {
      icon: 'refresh',
      label: 'PENDING CONFIRMATION...',
      bg: 'bg-yellow-100 border-yellow-600',
      textColor: 'text-yellow-900',
    },
    confirmed: {
      icon: 'check',
      label: 'TRANSACTION CONFIRMED!',
      bg: 'bg-green-100 border-green-600',
      textColor: 'text-green-900',
    },
    failed: {
      icon: 'alert',
      label: 'TRANSACTION FAILED!',
      bg: 'bg-red-100 border-red-600',
      textColor: 'text-red-900',
    },
    timeout: {
      icon: 'alert',
      label: 'TRANSACTION TIMEOUT',
      bg: 'bg-orange-100 border-orange-600',
      textColor: 'text-orange-900',
    },
    unknown: {
      icon: 'alert',
      label: 'UNKNOWN STATUS',
      bg: 'bg-gray-100 border-gray-600',
      textColor: 'text-gray-900',
    },
  };

  const cfg = configs[status] || configs.pending;

  return (
    <div className={`border-3 border-black p-4 shadow-[4px_4px_0px_0px_#000] ${cfg.bg} font-pixel-body`}>
      <div className="flex items-start space-x-3">
        <div className="w-8 h-8 bg-black text-white border border-black flex items-center justify-center flex-shrink-0 shadow-[1px_1px_0px_0px_#000]">
          <PixelIcon name={cfg.icon} className="w-5 h-5 text-[#D4E751]" />
        </div>

        <div className="flex-1 min-w-0">
          <p className={`font-pixel-heading text-xs font-bold ${cfg.textColor}`}>
            {cfg.label}
          </p>

          {txHash && (
            <div className="mt-2 space-y-1.5 text-xs">
              <p className="font-bold text-gray-700">HASH:</p>
              <div className="flex items-center space-x-2">
                <code className="bg-white px-2 py-1 border-2 border-black font-mono text-[10px] truncate max-w-xs font-bold">
                  {txHash}
                </code>
                <button
                  onClick={() => navigator.clipboard.writeText(txHash)}
                  className="bg-black text-white text-[10px] font-bold px-2 py-1 hover:bg-gray-800"
                >
                  COPY
                </button>
              </div>

              <a
                href={`${CONFIG.STELLAR_EXPERT_URL}/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-1 font-bold text-xs bg-black text-[#D4E751] px-2 py-1 underline hover:bg-gray-800"
              >
                VIEW ON STELLAR EXPERT ↗
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
