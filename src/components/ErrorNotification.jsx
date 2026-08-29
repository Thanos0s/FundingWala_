import React from 'react';

/**
 * Error notification component — type-aware display
 */
export const ErrorNotification = ({ message, type, onDismiss }) => {
  const configs = {
    WALLET_CONNECTION: {
      emoji: '🔴',
      label: 'Wallet Error',
      bg: 'bg-red-50 border-red-200',
      text: 'text-red-800',
    },
    CONTRACT_EXECUTION: {
      emoji: '🟠',
      label: 'Transaction Error',
      bg: 'bg-orange-50 border-orange-200',
      text: 'text-orange-800',
    },
    NETWORK: {
      emoji: '🟡',
      label: 'Network Error',
      bg: 'bg-yellow-50 border-yellow-200',
      text: 'text-yellow-800',
    },
    UNKNOWN: {
      emoji: '⚠️',
      label: 'Error',
      bg: 'bg-gray-50 border-gray-200',
      text: 'text-gray-800',
    },
  };

  const cfg = configs[type] || configs.UNKNOWN;

  return (
    <div className={`border rounded-xl p-3 ${cfg.bg}`} role="alert">
      <div className="flex items-start justify-between space-x-2">
        <div className="flex items-start space-x-2">
          <span>{cfg.emoji}</span>
          <div>
            <p className={`text-xs font-bold ${cfg.text}`}>{cfg.label}</p>
            <p className={`text-xs mt-0.5 ${cfg.text} opacity-90`}>{message}</p>
          </div>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-gray-400 hover:text-gray-700 flex-shrink-0"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};
