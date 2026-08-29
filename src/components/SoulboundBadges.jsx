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
    <div className="pixel-box p-6 md:p-8 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b-3 border-black pb-4 mb-5">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-[#D4E751] border-3 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000] flex-shrink-0">
            <PixelIcon name="star" className="w-7 h-7 text-black" />
          </div>
          <div>
            <h3 className="font-pixel-heading text-base md:text-lg font-bold text-black uppercase tracking-tight">
              SOULBOUND BADGES
            </h3>
            <p className="font-pixel-body text-xs text-gray-600 font-bold mt-1">
              NON-TRANSFERABLE REPUTATION
            </p>
          </div>
        </div>
        <span className="font-pixel-body text-xs bg-black text-[#D4E751] font-bold px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
          STELLAR SBT
        </span>
      </div>

      {/* Creator Trust Score Card */}
      <div className="border-3 border-black bg-[#F4FBE4] p-5 mb-6 shadow-[4px_4px_0px_0px_#000] flex items-center justify-between">
        <div className="space-y-1">
          <div className="font-pixel-body text-xs md:text-sm font-bold text-black uppercase tracking-wider">
            Verified Creator Track Record
          </div>
          <div className="font-mono text-xs md:text-sm text-gray-700 font-medium">
            {creatorReputation.completedMilestones || 1} Delivered Milestones · 100% Audit Pass
          </div>
        </div>
        <div className="text-right flex-shrink-0 ml-4">
          <div className="font-pixel-heading text-xl md:text-2xl font-extrabold text-black">
            {creatorReputation.trustScore || 96}%
          </div>
          <div className="font-pixel-body text-[10px] font-bold text-gray-700 mt-0.5">TRUST SCORE</div>
        </div>
      </div>

      <p className="font-mono text-xs md:text-sm text-gray-700 font-medium mb-6 leading-relaxed bg-yellow-50 border-2 border-black p-3.5 shadow-[2px_2px_0px_0px_#000]">
        Soulbound Tokens (SBTs) are minted to your Stellar account upon donation. They cannot be transferred or sold, establishing a verifiable public track record of your patronage.
      </p>

      {/* Donor Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {badges.map((b) => (
          <div
            key={b.id}
            className={`border-3 border-black p-4 md:p-5 flex flex-col justify-between transition-all shadow-[4px_4px_0px_0px_#000] space-y-3 ${
              b.unlocked ? 'bg-white' : 'bg-gray-50 opacity-70'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <div className="w-9 h-9 bg-[#D4E751] border-2 border-black flex items-center justify-center shadow-[1px_1px_0px_0px_#000]">
                  <PixelIcon name={b.icon} className="w-5 h-5 text-black" />
                </div>
                <span className="font-pixel-body text-[10px] font-bold bg-black text-white px-2.5 py-1">
                  {b.unlocked ? 'UNLOCKED' : `MIN ${b.min} XLM`}
                </span>
              </div>
              <h5 className="font-pixel-heading text-xs font-bold text-black mt-2">{b.name}</h5>
              <p className="font-mono text-xs text-gray-600 font-medium mt-1.5 leading-normal">{b.perk}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SoulboundBadges;
