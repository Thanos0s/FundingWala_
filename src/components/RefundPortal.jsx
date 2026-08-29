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
    <div className="pixel-box p-6 md:p-8 bg-white font-pixel-body">
      <div className="flex items-center justify-between border-b-3 border-black pb-4 mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#D4E751] border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
            <PixelIcon name="shield" className="w-6 h-6 text-black" />
          </div>
          <div>
            <h3 className="font-pixel-heading text-sm md:text-base font-bold text-black uppercase">
              REFUND VAULT
            </h3>
            <p className="text-[10px] text-gray-600 font-bold mt-0.5">BACKER PROTECTION</p>
          </div>
        </div>
        <span className="text-[10px] bg-black text-[#D4E751] font-bold px-2 py-1 border border-black">
          SMART GUARANTEE
        </span>
      </div>

      <p className="text-xs text-gray-700 font-bold mb-5 leading-relaxed">
        FundingWala contracts enforce automatic refund rights. If a campaign misses its funding goal or unreleased milestone deadlines expire, backers can immediately claim their proportional unspent XLM.
      </p>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="border-3 border-black bg-[#F8F9FA] p-3 shadow-[2px_2px_0px_0px_#000]">
          <div className="text-[10px] text-gray-600 font-bold uppercase">ESCROW PROTECTION</div>
          <div className="text-xs font-bold text-black mt-1">100% On-Chain Vault</div>
        </div>
        <div className="border-3 border-black bg-[#F8F9FA] p-3 shadow-[2px_2px_0px_0px_#000]">
          <div className="text-[10px] text-gray-600 font-bold uppercase">DISPUTE JURY DAO</div>
          <div className="text-xs font-bold text-black mt-1">Community Governed</div>
        </div>
      </div>

      <div className="border-3 border-black bg-white p-4 shadow-[3px_3px_0px_0px_#000] flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="font-pixel-heading text-xs font-bold text-black">
            {isFailed ? 'CAMPAIGN REFUND AVAILABLE' : 'ACTIVE PROTECTION STATUS'}
          </div>
          <div className="text-[11px] text-gray-600 font-bold mt-1">
            {isFailed
              ? 'Campaign goal was not reached before deadline.'
              : 'Funds are securely locked. Refunds activate if milestones fail.'}
          </div>
        </div>

        <button
          onClick={handleRefund}
          disabled={!isConnected || claiming}
          className={`pixel-btn px-4 py-2.5 text-xs font-bold ${
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
          className={`mt-4 p-3 text-xs font-bold border-2 border-black shadow-[2px_2px_0px_0px_#000] ${
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
