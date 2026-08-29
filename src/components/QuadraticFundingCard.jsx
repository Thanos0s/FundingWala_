import React, { useState } from 'react';
import { PixelIcon } from './PixelIcon';

export const QuadraticFundingCard = ({ qfMetrics = {}, donorCount = 0 }) => {
  const [simDonors, setSimDonors] = useState(10);
  const [simAmount, setSimAmount] = useState(5);

  const simulatedDirect = simDonors * simAmount;
  const simulatedQF = Math.round(Math.pow(simDonors * Math.sqrt(simAmount), 2));
  const leverageRatio = simulatedDirect > 0 ? (simulatedQF / simulatedDirect).toFixed(1) : '1.0';

  return (
    <div className="pixel-box p-6 md:p-8 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b-3 border-black pb-4 mb-5">
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
          QF FORMULA
        </span>
      </div>

      <p className="font-mono text-xs md:text-sm text-gray-700 font-medium mb-6 leading-relaxed bg-yellow-50 border-2 border-black p-3.5 shadow-[2px_2px_0px_0px_#000]">
        FundingWala implements Quadratic Funding: the total number of unique contributors matters far more than individual whale donations. Broad grassroots participation unlocks amplified matching grants.
      </p>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="border-3 border-black bg-gray-50 p-4 text-center shadow-[3px_3px_0px_0px_#000]">
          <div className="font-pixel-body text-xs text-gray-600 font-bold">MATCH POOL</div>
          <div className="font-pixel-heading text-sm md:text-base font-bold text-black mt-1.5">500 XLM</div>
        </div>
        <div className="border-3 border-black bg-gray-50 p-4 text-center shadow-[3px_3px_0px_0px_#000]">
          <div className="font-pixel-body text-xs text-gray-600 font-bold">LEVERAGE</div>
          <div className="font-pixel-heading text-sm md:text-base font-bold text-green-700 mt-1.5">
            {qfMetrics.leverageMultiplier || '2.4x'}
          </div>
        </div>
        <div className="border-3 border-black bg-gray-50 p-4 text-center shadow-[3px_3px_0px_0px_#000]">
          <div className="font-pixel-body text-xs text-gray-600 font-bold">FORMULA</div>
          <div className="font-pixel-heading text-xs font-bold text-black mt-2">
            (SUM SQRT)²
          </div>
        </div>
      </div>

      {/* Interactive Simulator */}
      <div className="border-3 border-black bg-white p-5 shadow-[4px_4px_0px_0px_#000] space-y-4">
        <div className="flex items-center justify-between border-b-2 border-black pb-3">
          <span className="font-pixel-heading text-xs md:text-sm font-bold text-black uppercase">
            QF IMPACT SIMULATOR
          </span>
          <span className="font-pixel-body text-xs font-bold bg-[#D4E751] text-black border-2 border-black px-2.5 py-1 shadow-[1px_1px_0px_0px_#000]">
            +{leverageRatio}x MATCHED
          </span>
        </div>

        <div className="space-y-4 font-mono text-xs md:text-sm">
          <div>
            <div className="flex items-center justify-between text-gray-700 font-semibold mb-1.5">
              <span>Grassroots Donors:</span>
              <strong className="text-black text-sm">{simDonors} supporters</strong>
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
              <span>Pledge Per Donor:</span>
              <strong className="text-black text-sm">{simAmount} XLM</strong>
            </div>
            <input
              type="range"
              min="1"
              max="25"
              value={simAmount}
              onChange={(e) => setSimAmount(Number(e.target.value))}
              className="w-full accent-black cursor-pointer h-2 bg-gray-200 border border-black"
            />
          </div>
        </div>

        <div className="pt-3 border-t-2 border-black flex flex-wrap items-center justify-between gap-2 font-mono text-xs md:text-sm font-bold">
          <span className="text-gray-700">Direct Contribution: {simulatedDirect} XLM</span>
          <span className="font-pixel-body text-xs bg-black text-[#D4E751] px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
            TOTAL IMPACT: {simulatedQF} XLM
          </span>
        </div>
      </div>
    </div>
  );
};

export default QuadraticFundingCard;
