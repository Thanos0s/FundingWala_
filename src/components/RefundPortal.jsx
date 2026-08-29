import React, { useState } from 'react';
import { PixelIcon } from './PixelIcon';

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
    <div className="pixel-box p-6 md:p-8 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b-3 border-black pb-4 mb-5">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-[#D4E751] border-3 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000] flex-shrink-0">
            <PixelIcon name="shield" className="w-7 h-7 text-black" />
          </div>
          <div>
            <h3 className="font-pixel-heading text-base md:text-lg font-bold text-black uppercase tracking-tight">
              REFUND VAULT
            </h3>
            <p className="font-pixel-body text-xs text-gray-600 font-bold mt-1">
              BACKER PROTECTION GUARANTEE
            </p>
          </div>
        </div>
        <span className="font-pixel-body text-xs bg-black text-[#D4E751] font-bold px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
          SMART GUARANTEE
        </span>
      </div>

      <p className="font-mono text-xs md:text-sm text-gray-700 font-medium mb-6 leading-relaxed bg-yellow-50 border-2 border-black p-3.5 shadow-[2px_2px_0px_0px_#000]">
        FundingWala contracts enforce automatic refund rights. If a campaign misses its funding goal or milestone deadlines expire, backers can immediately claim their proportional unspent XLM.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
        <div className="border-3 border-black bg-gray-50 p-4 shadow-[3px_3px_0px_0px_#000]">
          <div className="font-pixel-body text-xs text-gray-600 font-bold uppercase">ESCROW PROTECTION</div>
          <div className="font-mono text-sm md:text-base font-extrabold text-black mt-1">100% On-Chain Vault</div>
        </div>
        <div className="border-3 border-black bg-gray-50 p-4 shadow-[3px_3px_0px_0px_#000]">
          <div className="font-pixel-body text-xs text-gray-600 font-bold uppercase">DISPUTE JURY DAO</div>
          <div className="font-mono text-sm md:text-base font-extrabold text-black mt-1">Community Governed</div>
        </div>
      </div>

      <div className="border-3 border-black bg-white p-5 shadow-[4px_4px_0px_0px_#000] flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="font-pixel-heading text-xs md:text-sm font-bold text-black">
            {isFailed ? 'CAMPAIGN REFUND AVAILABLE' : 'ACTIVE PROTECTION STATUS'}
          </div>
          <div className="font-mono text-xs text-gray-600 font-medium">
            {isFailed
              ? 'Campaign goal was not reached before deadline.'
              : 'Funds are securely locked. Refunds activate if milestones fail.'}
          </div>
        </div>

        <button
          onClick={handleRefund}
          disabled={!isConnected || claiming}
          className={`pixel-btn px-5 py-3 text-xs md:text-sm font-bold ${
            isFailed
              ? 'bg-[#FACC15] text-black hover:bg-[#FDE047]'
              : 'bg-black text-[#D4E751]'
          } disabled:opacity-50`}
        >
          {claiming ? 'CLAIMING...' : 'CLAIM REFUND'}
        </button>
      </div>

      {claimStatus && (
        <div
          className={`mt-5 p-4 text-xs md:text-sm font-mono font-bold border-3 border-black shadow-[3px_3px_0px_0px_#000] ${
            claimStatus.success
              ? 'bg-[#D4E751] text-black'
              : 'bg-[#EF4444] text-white'
          }`}
        >
          {claimStatus.success
            ? 'Refund successfully claimed from escrow vault'
            : `Error: ${claimStatus.error}`}
        </div>
      )}
    </div>
  );
};

export default RefundPortal;
