import React from 'react';
import { PixelIcon } from './PixelIcon';

export const SoulboundBadges = ({
  donorAmount = 0,
  creatorReputation = {},
}) => {
  const badges = [
    {
      id: 'bronze',
      name: 'BRONZE SUPPORTER',
      min: 0.5,
      icon: 'star',
      unlocked: donorAmount >= 0.5,
      perk: 'Voting rights on milestone releases',
    },
    {
      id: 'silver',
      name: 'SILVER PATRON',
      min: 10,
      icon: 'wallet',
      unlocked: donorAmount >= 10,
      perk: '2x Quadratic matching multiplier',
    },
    {
      id: 'gold',
      name: 'GOLD BENEFACTOR',
      min: 50,
      icon: 'coin',
      unlocked: donorAmount >= 50,
      perk: 'Multi-sig audit and dispute jury eligibility',
    },
    {
      id: 'guardian',
      name: 'GENESIS GUARDIAN',
      min: 100,
      icon: 'shield',
      unlocked: donorAmount >= 100,
      perk: 'Permanent on-chain donor honor hall',
    },
  ];

  return (
    <div className="pixel-box p-6 md:p-8 bg-white font-pixel-body">
      <div className="flex items-center justify-between border-b-3 border-black pb-4 mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#D4E751] border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
            <PixelIcon name="star" className="w-6 h-6 text-black" />
          </div>
          <div>
            <h3 className="font-pixel-heading text-sm md:text-base font-bold text-black uppercase">
              SOULBOUND BADGES
            </h3>
            <p className="text-[10px] text-gray-600 font-bold mt-0.5">NON-TRANSFERABLE REPUTATION</p>
          </div>
        </div>
        <span className="text-[10px] bg-black text-[#D4E751] font-bold px-2 py-1 border border-black">
          STELLAR SBT
        </span>
      </div>

      {/* Creator Trust Score Card */}
      <div className="border-3 border-black bg-[#EBF7A7] p-4 mb-5 shadow-[3px_3px_0px_0px_#000] flex items-center justify-between">
        <div>
          <div className="text-xs font-bold text-black uppercase tracking-wider">
            Verified Creator Track Record
          </div>
          <div className="text-xs text-gray-700 font-bold mt-1">
            {creatorReputation.completedMilestones || 1} Delivered Milestones · 100% Audit Pass
          </div>
        </div>
        <div className="text-right">
          <div className="font-pixel-heading text-xl font-extrabold text-black">
            {creatorReputation.trustScore || 96}%
          </div>
          <div className="text-[10px] font-bold text-gray-800">TRUST SCORE</div>
        </div>
      </div>

      <p className="text-xs text-gray-700 font-bold mb-4 leading-relaxed">
        Soulbound Tokens (SBTs) are minted to your Stellar account upon donation. They cannot be transferred or sold, proving your decentralized patronage track record.
      </p>

      {/* Donor Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {badges.map((b) => (
          <div
            key={b.id}
            className={`border-3 border-black p-4 flex flex-col justify-between transition-all shadow-[3px_3px_0px_0px_#000] ${
              b.unlocked
                ? 'bg-white'
                : 'bg-gray-100 opacity-60'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <PixelIcon name={b.icon} className="w-6 h-6 text-black" />
                <span className="text-[10px] font-bold bg-black text-white px-2 py-0.5">
                  {b.unlocked ? 'UNLOCKED' : `${b.min} XLM`}
                </span>
              </div>
              <h5 className="font-pixel-heading text-xs font-bold text-black">{b.name}</h5>
              <p className="text-xs text-gray-600 font-bold mt-1.5">{b.perk}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SoulboundBadges;
