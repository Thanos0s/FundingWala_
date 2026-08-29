import React, { useState } from 'react';
import { PixelIcon } from './PixelIcon';

export const QuadraticFundingCard = ({ qfMetrics = {}, donorCount = 0 }) => {
  const [simDonors, setSimDonors] = useState(10);
  const [simAmount, setSimAmount] = useState(5);

  const simulatedDirect = simDonors * simAmount;
  const simulatedQF = Math.round(Math.pow(simDonors * Math.sqrt(simAmount), 2));
  const leverageRatio = simulatedDirect > 0 ? (simulatedQF / simulatedDirect).toFixed(1) : '1.0';

  return (
    <div className="pixel-box p-6 md:p-8 bg-white font-pixel-body">
      <div className="flex items-center justify-between border-b-3 border-black pb-4 mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#D4E751] border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
            <PixelIcon name="coin" className="w-6 h-6 text-black" />
          </div>
          <div>
            <h3 className="font-pixel-heading text-sm md:text-base font-bold text-black uppercase">
              QUADRATIC MATCHING POOL
            </h3>
            <p className="text-[10px] text-gray-600 font-bold mt-0.5">GITCOIN MATCHING ALGORITHM</p>
          </div>
        </div>
        <span className="text-[10px] bg-black text-[#D4E751] font-bold px-2 py-1 border border-black">
          QF FORMULA
        </span>
      </div>

      <p className="text-xs text-gray-700 font-bold mb-5 leading-relaxed">
        FundingWala implements Quadratic Funding: the total number of contributors matters more than large whale pledges. Broad community support unlocks amplified matching grants.
      </p>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="border-3 border-black bg-[#F8F9FA] p-3 text-center shadow-[2px_2px_0px_0px_#000]">
          <div className="text-[10px] text-gray-600 font-bold">MATCH POOL</div>
          <div className="text-xs font-pixel-heading text-black mt-1">500 XLM</div>
        </div>
        <div className="border-3 border-black bg-[#F8F9FA] p-3 text-center shadow-[2px_2px_0px_0px_#000]">
          <div className="text-[10px] text-gray-600 font-bold">LEVERAGE</div>
          <div className="text-xs font-pixel-heading text-green-600 mt-1">
            {qfMetrics.leverageMultiplier || '2.4x'}
          </div>
        </div>
        <div className="border-3 border-black bg-[#F8F9FA] p-3 text-center shadow-[2px_2px_0px_0px_#000]">
          <div className="text-[10px] text-gray-600 font-bold">FORMULA</div>
          <div className="text-[10px] font-pixel-heading text-black mt-1">
            (SUM SQRT)²
          </div>
        </div>
      </div>

      {/* Interactive Simulator */}
      <div className="border-3 border-black bg-[#F8F9FA] p-4 shadow-[3px_3px_0px_0px_#000]">
        <div className="flex items-center justify-between mb-3 border-b-2 border-black pb-2">
          <span className="font-pixel-heading text-xs font-bold text-black uppercase">
            QF IMPACT SIMULATOR
          </span>
          <span className="text-[11px] font-bold bg-[#D4E751] text-black border border-black px-2 py-0.5">
            +{leverageRatio}x Matched
          </span>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <div className="flex items-center justify-between text-gray-700 font-bold mb-1">
              <span>Grassroots Donors:</span>
              <span className="text-black font-extrabold">{simDonors} supporters</span>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              value={simDonors}
              onChange={(e) => setSimDonors(Number(e.target.value))}
              className="w-full accent-black cursor-pointer"
            />
          </div>

          <div>
            <div className="flex items-center justify-between text-gray-700 font-bold mb-1">
              <span>Pledge Per Donor:</span>
              <span className="text-black font-extrabold">{simAmount} XLM</span>
            </div>
            <input
              type="range"
              min="1"
              max="25"
              value={simAmount}
              onChange={(e) => setSimAmount(Number(e.target.value))}
              className="w-full accent-black cursor-pointer"
            />
          </div>
        </div>

        <div className="mt-4 pt-3 border-t-2 border-black flex items-center justify-between text-xs font-bold">
          <span className="text-gray-600">Direct: {simulatedDirect} XLM</span>
          <span className="bg-black text-[#D4E751] px-2 py-1 border border-black">
            Total Impact: {simulatedQF} XLM
          </span>
        </div>
      </div>
    </div>
  );
};

export default QuadraticFundingCard;
