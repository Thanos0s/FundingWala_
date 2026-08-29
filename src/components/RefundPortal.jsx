import React, { useState } from 'react';
import PixelIcon from './PixelIcon';

export const RefundPortal = ({
  campaign = {},
  onClaimRefund,
  isConnected = false,
}) => {
  const [claiming, setClaiming] = useState(false);
  const [claimStatus, setClaimStatus] = useState(null);

  const isExpired = campaign.deadline < 4300000;
  const isFailed = campaign.raised < campaign.goal && isExpired;

  const handleRefund = async () => {
    if (!onClaimRefund) return;
    setClaiming(true);
    setClaimStatus(null);
    try {
      const res = await onClaimRefund();
      setClaimStatus({ success: true, txHash: res?.txHash });
    } catch (err) {
      setClaimStatus({ success: false, error: err.message || 'Refund claim failed' });
    } finally {
      setClaiming(false);
    }
  };

  return (
    <div className="bg-slate-900 border-4 border-slate-700 p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.6)]">
      <div className="flex items-center justify-between border-b-2 border-slate-700 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <PixelIcon name="shield" size={24} className="text-emerald-400" />
          <h3 className="text-xl font-bold font-mono tracking-wider text-emerald-400">
            RISK MANAGEMENT & REFUND VAULT
          </h3>
        </div>
        <span className="text-xs bg-emerald-400/20 text-emerald-300 font-mono px-2 py-1 border border-emerald-400/40">
          SMART CONTRACT GUARANTEE
        </span>
      </div>

      <p className="text-xs text-slate-400 font-mono mb-4 leading-relaxed">
        FundingWala contracts enforce automatic refund rights. If a campaign misses its funding goal or unreleased milestone deadlines expire, backers can immediately claim their proportional unspent XLM.
      </p>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="border border-slate-700 bg-slate-800/40 p-3">
          <div className="text-[11px] font-mono text-slate-400">ESCROW PROTECTION</div>
          <div className="text-sm font-bold text-white font-mono mt-0.5">100% On-Chain Vault</div>
        </div>
        <div className="border border-slate-700 bg-slate-800/40 p-3">
          <div className="text-[11px] font-mono text-slate-400">DISPUTE JURY DAO</div>
          <div className="text-sm font-bold text-green-400 font-mono mt-0.5">Community Governed</div>
        </div>
      </div>

      <div className="border border-slate-700 bg-slate-800/60 p-3.5 flex items-center justify-between">
        <div>
          <div className="text-xs font-bold text-white font-mono">
            {isFailed ? '⚠️ CAMPAIGN REFUND AVAILABLE' : '🛡️ ACTIVE PROTECTION STATUS'}
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-0.5">
            {isFailed
              ? 'Campaign goal was not reached before deadline.'
              : 'Funds are securely locked. Refunds activate if milestones fail.'}
          </div>
        </div>

        <button
          onClick={handleRefund}
          disabled={!isConnected || claiming}
          className={`px-3 py-2 text-xs font-bold font-mono border transition-all ${
            isFailed
              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 border-amber-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] active:translate-y-0.5'
              : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-white'
          } disabled:opacity-50`}
        >
          {claiming ? 'CLAIMING...' : 'CLAIM REFUND'}
        </button>
      </div>

      {claimStatus && (
        <div
          className={`mt-3 p-2 text-xs font-mono border ${
            claimStatus.success
              ? 'bg-green-950/40 border-green-500 text-green-300'
              : 'bg-red-950/40 border-red-500 text-red-300'
          }`}
        >
          {claimStatus.success
            ? '✓ Refund successfully claimed from escrow vault!'
            : `⚠️ ${claimStatus.error}`}
        </div>
      )}
    </div>
  );
};

export default RefundPortal;
