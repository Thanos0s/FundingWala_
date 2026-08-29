import React from 'react';
import PixelIcon from './PixelIcon';

export const SoulboundBadges = ({
  donorAmount = 0,
  creatorReputation = {},
  userAddress = '',
}) => {
  const badges = [
    {
      id: 'bronze',
      name: 'BRONZE SUPPORTER',
      min: 0.5,
      icon: 'star',
      color: 'amber-600',
      border: 'border-amber-600',
      bg: 'bg-amber-950/40',
      unlocked: donorAmount >= 0.5,
      perk: 'Voting rights on milestone releases',
    },
    {
      id: 'silver',
      name: 'SILVER PATRON',
      min: 10,
      icon: 'wallet',
      color: 'cyan-400',
      border: 'border-cyan-500',
      bg: 'bg-cyan-950/40',
      unlocked: donorAmount >= 10,
      perk: '2x Quadratic matching multiplier',
    },
    {
      id: 'gold',
      name: 'GOLD BENEFACTOR',
      min: 50,
      icon: 'coin',
      color: 'yellow-400',
      border: 'border-yellow-500',
      bg: 'bg-yellow-950/40',
      unlocked: donorAmount >= 50,
      perk: 'Multi-sig audit & dispute jury eligibility',
    },
    {
      id: 'guardian',
      name: 'GENESIS GUARDIAN',
      min: 100,
      icon: 'shield',
      color: 'purple-400',
      border: 'border-purple-500',
      bg: 'bg-purple-950/40',
      unlocked: donorAmount >= 100,
      perk: 'Permanent on-chain donor honor hall',
    },
  ];

  return (
    <div className="bg-slate-900 border-4 border-slate-700 p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.6)]">
      <div className="flex items-center justify-between border-b-2 border-slate-700 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <PixelIcon name="star" size={24} className="text-pink-400" />
          <h3 className="text-xl font-bold font-mono tracking-wider text-pink-400">
            SOULBOUND BADGES & REPUTATION
          </h3>
        </div>
        <span className="text-xs bg-pink-400/20 text-pink-300 font-mono px-2 py-1 border border-pink-400/40">
          NON-TRANSFERABLE SBT
        </span>
      </div>

      {/* Creator Trust Score Card */}
      <div className="border-2 border-emerald-600 bg-emerald-950/30 p-3.5 mb-4 flex items-center justify-between">
        <div>
          <div className="text-[11px] font-mono text-emerald-300 font-bold uppercase tracking-wider">
            Verified Creator Track Record
          </div>
          <div className="text-xs text-slate-300 font-mono mt-0.5">
            {creatorReputation.completedMilestones || 1} Delivered Milestones · 100% Audit Pass
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black font-mono text-emerald-400">
            {creatorReputation.trustScore || 96}%
          </div>
          <div className="text-[10px] font-mono text-emerald-300">TRUST SCORE</div>
        </div>
      </div>

      <p className="text-xs text-slate-400 font-mono mb-3 leading-relaxed">
        Soulbound Tokens (SBTs) are minted to your Stellar account upon donation. They cannot be transferred or sold, proving your decentralized patronage track record.
      </p>

      {/* Donor Badges Grid */}
      <div className="grid grid-cols-2 gap-3">
        {badges.map((b) => (
          <div
            key={b.id}
            className={`border-2 p-2.5 flex flex-col justify-between transition-all ${
              b.unlocked
                ? `${b.border} ${b.bg} shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]`
                : 'border-slate-800 bg-slate-900/60 opacity-50 grayscale'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <PixelIcon name={b.icon} size={18} className={`text-${b.color}`} />
                <span className="text-[10px] font-mono font-bold text-slate-300">
                  {b.unlocked ? '✓ UNLOCKED' : `${b.min} XLM`}
                </span>
              </div>
              <h5 className="font-bold text-xs font-mono text-white tracking-wide">{b.name}</h5>
              <p className="text-[10px] text-slate-400 font-mono mt-1 leading-snug">{b.perk}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SoulboundBadges;
