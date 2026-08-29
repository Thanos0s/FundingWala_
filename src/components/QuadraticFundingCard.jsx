import React, { useState } from 'react';
import { PixelIcon } from './PixelIcon';

export const QuadraticFundingCard = ({ qfMetrics = {}, donorCount = 0 }) => {
  const [simDonors, setSimDonors] = useState(10);
  const [simAmount, setSimAmount] = useState(5);

  // Real-time formula simulation: (N * sqrt(amt))^2
  const simulatedDirect = simDonors * simAmount;
  const simulatedQF = Math.round(Math.pow(simDonors * Math.sqrt(simAmount), 2));
  const leverageRatio = simulatedDirect > 0 ? (simulatedQF / simulatedDirect).toFixed(1) : '1.0';

  return (
    <div className="bg-slate-900 border-4 border-slate-700 p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.6)]">
      <div className="flex items-center justify-between border-b-2 border-slate-700 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <PixelIcon name="coin" size={24} className="text-purple-400" />
          <h3 className="text-xl font-bold font-mono tracking-wider text-purple-400">
            QUADRATIC MATCHING POOL
          </h3>
        </div>
        <span className="text-xs bg-purple-400/20 text-purple-300 font-mono px-2 py-1 border border-purple-400/40">
          GITCOIN ALGORITHM
        </span>
      </div>

      <p className="text-xs text-slate-400 font-mono mb-4 leading-relaxed">
        FundingWala uses Quadratic Funding (QF): the number of contributors matters more than the amount. Broad small-donor support unlocks amplified matching grants!
      </p>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="border border-slate-700 bg-slate-800/60 p-2 text-center">
          <div className="text-[11px] text-slate-400 font-mono">MATCH POOL</div>
          <div className="text-sm font-bold text-purple-300 font-mono">500 XLM</div>
        </div>
        <div className="border border-slate-700 bg-slate-800/60 p-2 text-center">
          <div className="text-[11px] text-slate-400 font-mono">LEVERAGE</div>
          <div className="text-sm font-bold text-green-400 font-mono">
            {qfMetrics.leverageMultiplier || '2.4x'}
          </div>
        </div>
        <div className="border border-slate-700 bg-slate-800/60 p-2 text-center">
          <div className="text-[11px] text-slate-400 font-mono">FORMULA</div>
          <div className="text-[10px] font-bold text-yellow-300 font-mono mt-0.5">
            (Σ√cᵢ)²
          </div>
        </div>
      </div>

      {/* Interactive Simulator */}
      <div className="border border-purple-800/50 bg-purple-950/20 p-3">
        <h4 className="text-xs font-bold text-purple-300 font-mono mb-2 flex items-center justify-between">
          <span>⚡ QF IMPACT CALCULATOR</span>
          <span className="text-green-400 font-bold">+{leverageRatio}x Matched</span>
        </h4>

        <div className="space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between">
            <label className="text-slate-400">Grassroots Donors:</label>
            <span className="text-white font-bold">{simDonors} supporters</span>
          </div>
          <input
            type="range"
            min="1"
            max="50"
            value={simDonors}
            onChange={(e) => setSimDonors(Number(e.target.value))}
            className="w-full accent-purple-500 cursor-pointer"
          />

          <div className="flex items-center justify-between">
            <label className="text-slate-400">Pledge Per Donor:</label>
            <span className="text-white font-bold">{simAmount} XLM</span>
          </div>
          <input
            type="range"
            min="1"
            max="25"
            value={simAmount}
            onChange={(e) => setSimAmount(Number(e.target.value))}
            className="w-full accent-purple-500 cursor-pointer"
          />
        </div>

        <div className="mt-3 pt-2 border-t border-purple-800/40 flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400">Direct: {simulatedDirect} XLM</span>
          <span className="text-yellow-300 font-bold">
            Total Impact: {simulatedQF} XLM
          </span>
        </div>
      </div>
    </div>
  );
};

export default QuadraticFundingCard;
