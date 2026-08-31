import React, { useState } from 'react';
import { PixelIcon } from './PixelIcon';

export const QuadraticFundingCard = ({ qfMetrics = {}, donorCount = 0 }) => {
  const [simDonors, setSimDonors] = useState(18);
  const [simAmount, setSimAmount] = useState(5);
  const MATCHING_POOL = 500;

  // Accurate Gitcoin QF Algorithm
  const simulatedDirect = simDonors * simAmount;
  const rawQFPower = Math.round(Math.pow(simDonors * Math.sqrt(simAmount), 2));
  const rawMatchBonus = Math.max(0, rawQFPower - simulatedDirect);
  const allocatedMatch = Math.min(MATCHING_POOL, Math.round(rawMatchBonus * 0.45));
  const totalImpact = simulatedDirect + allocatedMatch;
  const leverageRatio = simulatedDirect > 0 ? (totalImpact / simulatedDirect).toFixed(1) : '1.0';

  const applyPreset = (donors, amount) => {
    setSimDonors(donors);
    setSimAmount(amount);
  };

  return (
    <div className="pixel-box p-6 md:p-8 bg-white space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b-3 border-black pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-[#D4E751] border-3 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000] flex-shrink-0">
            <PixelIcon name="coin" className="w-7 h-7 text-black" />
          </div>
          <div>
            <h3 className="font-pixel-heading text-base md:text-lg font-bold text-black uppercase tracking-tight">
              QUADRATIC MATCHING POOL
            </h3>
            <p className="font-pixel-body text-xs text-gray-600 font-bold mt-1">
              GITCOIN MATCHING ALGORITHM
            </p>
          </div>
        </div>
        <span className="font-pixel-body text-xs bg-black text-[#D4E751] font-bold px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
          QF ALGORITHM
        </span>
      </div>

      <p className="font-mono text-xs md:text-sm text-gray-700 font-medium leading-relaxed bg-yellow-50 border-2 border-black p-3.5 shadow-[2px_2px_0px_0px_#000]">
        FundingWala implements <strong>Quadratic Funding</strong>: the total number of unique contributors matters far more than individual whale donations. Broad grassroots participation unlocks amplified matching grants from the <strong>500 XLM Match Pool</strong>.
      </p>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="border-3 border-black bg-gray-50 p-4 text-center shadow-[3px_3px_0px_0px_#000]">
          <div className="font-pixel-body text-xs text-gray-600 font-bold">MATCH POOL</div>
          <div className="font-pixel-heading text-sm md:text-base font-bold text-black mt-1.5">
            {MATCHING_POOL} XLM
          </div>
        </div>
        <div className="border-3 border-black bg-gray-50 p-4 text-center shadow-[3px_3px_0px_0px_#000]">
          <div className="font-pixel-body text-xs text-gray-600 font-bold">ACTIVE LEVERAGE</div>
          <div className="font-pixel-heading text-sm md:text-base font-bold text-green-700 mt-1.5">
            {leverageRatio}x
          </div>
        </div>
        <div className="border-3 border-black bg-gray-50 p-4 text-center shadow-[3px_3px_0px_0px_#000]">
          <div className="font-pixel-body text-xs text-gray-600 font-bold">FORMULA</div>
          <div className="font-pixel-heading text-xs font-bold text-black mt-2">
            (Σ √cᵢ)²
          </div>
        </div>
      </div>

      {/* Interactive Simulator */}
      <div className="border-3 border-black bg-white p-5 shadow-[4px_4px_0px_0px_#000] space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-black pb-3">
          <div>
            <span className="font-pixel-heading text-xs md:text-sm font-bold text-black uppercase">
              QF IMPACT SIMULATOR
            </span>
            <p className="text-[10px] text-gray-600 font-mono mt-0.5">Test how donor counts amplify matching grants</p>
          </div>
          <span className="font-pixel-body text-xs font-bold bg-[#D4E751] text-black border-2 border-black px-2.5 py-1 shadow-[1px_1px_0px_0px_#000]">
            +{leverageRatio}x AMPLIFIED
          </span>
        </div>

        {/* Preset Buttons */}
        <div className="flex flex-wrap gap-2 pt-1">
          <span className="text-[10px] font-bold text-gray-600 uppercase flex items-center mr-1">PRESETS:</span>
          <button
            type="button"
            onClick={() => applyPreset(25, 5)}
            className="text-[10px] font-bold bg-yellow-100 hover:bg-yellow-200 border-2 border-black px-2.5 py-1 active:translate-x-0.5 active:translate-y-0.5 shadow-[1px_1px_0px_0px_#000]"
          >
            🌊 Grassroots Wave (25 × 5 XLM)
          </button>
          <button
            type="button"
            onClick={() => applyPreset(1, 125)}
            className="text-[10px] font-bold bg-red-100 hover:bg-red-200 border-2 border-black px-2.5 py-1 active:translate-x-0.5 active:translate-y-0.5 shadow-[1px_1px_0px_0px_#000]"
          >
            🐋 Single Whale (1 × 125 XLM)
          </button>
          <button
            type="button"
            onClick={() => applyPreset(40, 10)}
            className="text-[10px] font-bold bg-[#D4E751] hover:bg-yellow-300 border-2 border-black px-2.5 py-1 active:translate-x-0.5 active:translate-y-0.5 shadow-[1px_1px_0px_0px_#000]"
          >
            🚀 Viral Movement (40 × 10 XLM)
          </button>
        </div>

        {/* Sliders */}
        <div className="space-y-4 font-mono text-xs md:text-sm">
          <div>
            <div className="flex items-center justify-between text-gray-700 font-semibold mb-1.5">
              <span>Grassroots Donors (Unique Contributors):</span>
              <strong className="text-black text-sm bg-yellow-100 px-2 py-0.5 border border-black">{simDonors} supporters</strong>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              value={simDonors}
              onChange={(e) => setSimDonors(Number(e.target.value))}
              className="w-full accent-black cursor-pointer h-2 bg-gray-200 border border-black"
            />
          </div>

          <div>
            <div className="flex items-center justify-between text-gray-700 font-semibold mb-1.5">
              <span>Average Pledge Per Donor:</span>
              <strong className="text-black text-sm bg-yellow-100 px-2 py-0.5 border border-black">{simAmount} XLM</strong>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              value={simAmount}
              onChange={(e) => setSimAmount(Number(e.target.value))}
              className="w-full accent-black cursor-pointer h-2 bg-gray-200 border border-black"
            />
          </div>
        </div>

        {/* Summary Breakdown Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-xs pt-2">
          <div className="p-3 bg-gray-50 border-2 border-black text-center">
            <span className="text-gray-600 block text-[10px] font-bold">DIRECT CONTRIBUTIONS</span>
            <span className="font-bold text-sm text-black">{simulatedDirect} XLM</span>
          </div>
          <div className="p-3 bg-[#D4E751]/30 border-2 border-black text-center">
            <span className="text-gray-600 block text-[10px] font-bold">MATCH SUBSIDY UNLOCKED</span>
            <span className="font-bold text-sm text-green-800">+{allocatedMatch} XLM</span>
          </div>
          <div className="p-3 bg-black text-[#D4E751] border-2 border-black text-center shadow-[2px_2px_0px_0px_#000]">
            <span className="text-gray-300 block text-[10px] font-bold">TOTAL PROJECT IMPACT</span>
            <span className="font-pixel-heading font-bold text-sm text-[#D4E751]">{totalImpact} XLM</span>
          </div>
        </div>
      </div>

      {/* Whale vs Grassroots Educational Matrix */}
      <div className="border-3 border-black bg-yellow-50 p-4 shadow-[3px_3px_0px_0px_#000] font-mono text-xs space-y-3">
        <h4 className="font-pixel-heading text-xs font-bold text-black uppercase flex items-center space-x-2">
          <span>⚖️ WHY QUADRATIC FUNDING MATTERS</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
          <div className="p-3 bg-white border-2 border-black">
            <span className="font-bold text-red-700 block mb-1">❌ 1 Whale (100 XLM Donation):</span>
            <p className="text-gray-600 leading-snug">
              (√100)² = <strong>100 XLM QF Power</strong>.<br />
              Zero match leverage. Democracy is not centralized by capital.
            </p>
          </div>
          <div className="p-3 bg-white border-2 border-black">
            <span className="font-bold text-green-700 block mb-1">✅ 100 Donors (1 XLM Each):</span>
            <p className="text-gray-600 leading-snug">
              (100 × √1)² = <strong>10,000 XLM QF Power</strong>.<br />
              Unlocks maximum match pool subsidy!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuadraticFundingCard;

