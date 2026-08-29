import React, { useState, useCallback } from 'react';
import { CONFIG } from '../config';
import { PixelIcon } from './PixelIcon';

/**
 * 3 Error types display config for Pixel theme
 */
const ERROR_DISPLAY = {
  WALLET_CONNECTION: {
    icon: 'alert',
    label: 'WALLET CONNECTION ERROR',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-600',
    titleColor: 'text-red-900',
    textColor: 'text-red-800',
  },
  CONTRACT_EXECUTION: {
    icon: 'alert',
    label: 'CONTRACT EXECUTION ERROR',
    bgColor: 'bg-orange-100',
    borderColor: 'border-orange-600',
    titleColor: 'text-orange-900',
    textColor: 'text-orange-800',
  },
  NETWORK: {
    icon: 'alert',
    label: 'NETWORK RPC ERROR',
    bgColor: 'bg-yellow-100',
    borderColor: 'border-yellow-600',
    titleColor: 'text-yellow-900',
    textColor: 'text-yellow-800',
  },
  UNKNOWN: {
    icon: 'alert',
    label: 'GENERAL ERROR',
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-600',
    titleColor: 'text-gray-900',
    textColor: 'text-gray-800',
  },
};

export const DonateForm = ({ connected, donationState, onDonate, onReset }) => {
  const [amount, setAmount] = useState('');
  const [fieldError, setFieldError] = useState('');

  const validate = useCallback((val) => {
    const num = parseFloat(val);
    if (!val || isNaN(num)) return 'ENTER A DONATION AMOUNT.';
    if (num <= 0) return 'AMOUNT MUST BE GREATER THAN 0.';
    if (num < CONFIG.MIN_DONATION_XLM)
      return `MINIMUM DONATION IS ${CONFIG.MIN_DONATION_XLM} XLM.`;
    if (num > 100000) return 'MAXIMUM DONATION IS 100,000 XLM.';
    return '';
  }, []);

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
    if (fieldError) setFieldError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate(amount);
    if (err) {
      setFieldError(err);
      return;
    }
    if (!connected) {
      setFieldError('PLEASE CONNECT A WALLET ON THE LEFT TO CONFIRM DONATION.');
      const walletEl = document.getElementById('wallet-connect-box');
      if (walletEl) {
        walletEl.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }
    try {
      await onDonate(parseFloat(amount));
      setAmount('');
    } catch (_) {
      // handled by parent hook
    }
  };

  const handleReset = () => {
    setAmount('');
    setFieldError('');
    onReset();
  };

  const isSubmitting =
    donationState.status === 'submitting' || donationState.status === 'pending';
  const isConfirmed = donationState.status === 'confirmed';
  const hasFailed = donationState.status === 'failed';
  const error = donationState.error;

  // ── Error Banner ──────────────────────────────────────────────────────────
  const renderError = () => {
    if (!error) return null;
    const display = ERROR_DISPLAY[error.type] || ERROR_DISPLAY.UNKNOWN;

    return (
      <div
        className={`${display.bgColor} border-3 ${display.borderColor} p-4 shadow-[4px_4px_0px_0px_#000] text-xs font-pixel-body mb-4`}
        role="alert"
      >
        <div className="flex items-start justify-between space-x-2">
          <div className="flex items-start space-x-2">
            <PixelIcon name={display.icon} className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className={`font-bold font-pixel-heading text-xs ${display.titleColor}`}>
                {display.label}
              </p>
              <p className={`mt-1 font-bold ${display.textColor}`}>{error.message}</p>

              {/* Wallet connection error help */}
              {error.type === 'WALLET_CONNECTION' && (
                <div className="mt-2 flex flex-wrap gap-2">
                  <a
                    href="https://www.freighter.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-black text-white px-2 py-1 font-bold underline hover:bg-gray-800"
                  >
                    INSTALL FREIGHTER ↗
                  </a>
                </div>
              )}

              {/* Network error retry */}
              {error.type === 'NETWORK' && (
                <button
                  onClick={handleReset}
                  className="mt-2 bg-black text-yellow-300 px-2 py-1 font-bold hover:bg-gray-800"
                >
                  RETRY CONNECTION
                </button>
              )}
            </div>
          </div>

          <button
            onClick={handleReset}
            className="font-bold text-lg hover:opacity-70 px-1 border border-black bg-white"
          >
            ✕
          </button>
        </div>
      </div>
    );
  };

  // ── Confirmed Success State ────────────────────────────────────────────────
  if (isConfirmed) {
    return (
      <div className="pixel-box p-6 bg-white space-y-4 text-center">
        <div className="w-16 h-16 bg-[#D4E751] border-3 border-black shadow-[3px_3px_0px_0px_#000] mx-auto flex items-center justify-center">
          <PixelIcon name="check" className="w-10 h-10 text-black" />
        </div>
        <h3 className="font-pixel-heading text-lg font-bold">DONATION CONFIRMED!</h3>
        <p className="font-pixel-body text-sm bg-green-100 border-2 border-black p-3">
          THANK YOU FOR DONATING <strong>{donationState.amountXLM} XLM</strong> TO THE CAMPAIGN!
        </p>
        {donationState.txHash && (
          <a
            href={`${CONFIG.STELLAR_EXPERT_URL}/tx/${donationState.txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block font-pixel-body text-xs bg-black text-[#D4E751] px-3 py-2 border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:underline"
          >
            VIEW ON STELLAR EXPERT ↗
          </a>
        )}
        <button
          onClick={handleReset}
          className="pixel-btn pixel-btn-primary w-full py-3 text-sm mt-3"
        >
          DONATE AGAIN
        </button>
      </div>
    );
  }

  // ── Donate Form ───────────────────────────────────────────────────────────
  return (
    <div className="pixel-box p-6 md:p-8 bg-white space-y-6">
      <div className="flex items-center space-x-3 border-b-3 border-black pb-4">
        <PixelIcon name="coin" className="w-6 h-6 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <h2 className="font-pixel-heading text-base font-bold">MAKE A DONATION</h2>
          <p className="text-xs font-pixel-body text-gray-600 mt-1">
            MINIMUM: {CONFIG.MIN_DONATION_XLM} XLM
          </p>
        </div>
      </div>

      {hasFailed && renderError()}

      {!connected && (
        <div className="bg-yellow-200 border-3 border-black p-4 flex items-center space-x-3 shadow-[3px_3px_0px_0px_#000]">
          <PixelIcon name="alert" className="w-6 h-6 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-pixel-heading text-xs font-bold">WALLET NOT CONNECTED</p>
            <p className="font-pixel-body text-xs mt-1 leading-relaxed">
              Connect a wallet using the panel on the left to donate.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-pixel-body text-xs font-bold uppercase mb-3">
            Donation Amount (XLM)
          </label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={handleAmountChange}
              placeholder={`Min ${CONFIG.MIN_DONATION_XLM} XLM`}
              min={CONFIG.MIN_DONATION_XLM}
              step="0.1"
              disabled={isSubmitting}
              className="pixel-input w-full pr-16 text-sm"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 font-pixel-heading text-xs font-bold bg-black text-white px-2 py-1">
              XLM
            </span>
          </div>
          {fieldError && (
            <p className="text-xs font-pixel-body font-bold text-red-600 mt-2 bg-red-50 p-2 border border-red-400">
              {fieldError}
            </p>
          )}
        </div>

        {/* Quick Amount Buttons */}
        <div>
          <p className="font-pixel-body text-xs font-bold uppercase mb-3">QUICK AMOUNTS:</p>
          <div className="flex flex-wrap gap-3">
            {[1, 5, 10, 25, 50].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  setAmount(String(preset));
                  setFieldError('');
                }}
                disabled={isSubmitting}
                className={`pixel-btn px-4 py-2 text-xs active:translate-x-0.5 active:translate-y-0.5 ${
                  amount === String(preset)
                    ? 'bg-black text-white'
                    : 'bg-white text-black hover:bg-yellow-200'
                }`}
              >
                +{preset} XLM
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={isSubmitting || !amount}
          className={`pixel-btn w-full py-4 text-sm md:text-base flex items-center justify-center space-x-2 mt-4 active:translate-x-0.5 active:translate-y-0.5 ${
            connected
              ? 'pixel-btn-success'
              : 'pixel-btn-accent'
          }`}
        >
          <PixelIcon name="heart" className="w-5 h-5" />
          <span>
            {isSubmitting
              ? 'PROCESSING...'
              : !connected
              ? `CONNECT & DONATE ${amount ? `${amount} XLM` : ''}`
              : `DONATE ${amount ? `${amount} XLM` : 'NOW'}`}
          </span>
        </button>
      </form>
    </div>
  );
};
