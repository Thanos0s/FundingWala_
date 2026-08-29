import React from 'react';
import { PixelIcon } from './PixelIcon';

/**
 * Pixel Retro Progress Bar
 */
export const ProgressBar = ({ raised, goal, progress }) => {
  const pct = Math.min(100, Math.max(0, progress || 0));
  const isComplete = pct >= 100;

  return (
    <div className="pixel-box p-6 bg-white mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <PixelIcon name="dino" className="w-6 h-6" />
          <div>
            <h3 className="font-pixel-heading text-sm md:text-base font-bold uppercase">
              Campaign Progress
            </h3>
            <p className="text-xs text-gray-600 mt-1 font-pixel-body">
              Real-time Stellar Soroban State
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="font-pixel-heading text-xl md:text-2xl font-extrabold text-black bg-[#D4E751] px-2 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
            {pct.toFixed(1)}%
          </span>
          {isComplete && (
            <p className="text-xs font-bold font-pixel-body text-green-700 mt-1">
              🎉 GOAL COMPLETED!
            </p>
          )}
        </div>
      </div>

      {/* Retro Pixel Progress Track */}
      <div className="pixel-progress-track h-8 relative mb-3">
        <div
          className="pixel-progress-fill transition-all duration-700 ease-out flex items-center justify-end pr-2"
          style={{ width: `${pct}%` }}
        >
          {pct > 15 && (
            <span className="font-pixel-body text-xs font-bold text-black bg-white px-1 border border-black">
              {pct.toFixed(0)}%
            </span>
          )}
        </div>
      </div>

      {/* Milestone markers */}
      <div className="flex justify-between text-xs font-pixel-body font-bold text-gray-700 px-1 mb-4">
        <span>0%</span>
        <span>25%</span>
        <span>50%</span>
        <span>75%</span>
        <span>100%</span>
      </div>

      {/* Stats Breakdown */}
      <div className="grid grid-cols-3 gap-3 pt-4 border-t-2 border-black text-center font-pixel-body">
        <div className="bg-gray-100 p-2 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
          <p className="text-xs font-bold text-gray-600 uppercase">Raised</p>
          <p className="text-sm font-bold font-pixel-heading text-black mt-1">
            {(raised || 0).toFixed(1)} XLM
          </p>
        </div>

        <div className="bg-gray-100 p-2 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
          <p className="text-xs font-bold text-gray-600 uppercase">Goal</p>
          <p className="text-sm font-bold font-pixel-heading text-black mt-1">
            {(goal || 0).toLocaleString()} XLM
          </p>
        </div>

        <div className="bg-yellow-100 p-2 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
          <p className="text-xs font-bold text-gray-600 uppercase">Needed</p>
          <p className="text-sm font-bold font-pixel-heading text-black mt-1">
            {Math.max(0, (goal || 0) - (raised || 0)).toFixed(1)} XLM
          </p>
        </div>
      </div>
    </div>
  );
};
