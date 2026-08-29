import React from 'react';
import { CONFIG } from '../config';
import { PixelIcon } from './PixelIcon';

/**
 * Campaign hero section — Retro Pixel Art Theme inspired by Streamline Pixel Icons
 */
export const CrowdfundingHero = ({ campaign, loadingCampaign }) => {
  const deadlineLedger = campaign?.deadline || CONFIG.CAMPAIGN_DEADLINE_LEDGER;

  return (
    <div className="pixel-box p-6 md:p-8 bg-white text-black mb-8 relative overflow-hidden">
      {/* Retro Pixel Stickers in top right corner */}
      <div className="absolute top-3 right-4 flex space-x-2 pointer-events-none opacity-90 hidden sm:flex">
        <div className="w-10 h-10 bg-[#D4E751] border-2 border-black flex items-center justify-center rotate-6 shadow-[2px_2px_0px_0px_#000]">
          <PixelIcon name="bread" className="w-6 h-6" />
        </div>
        <div className="w-10 h-10 bg-white border-2 border-black flex items-center justify-center -rotate-6 shadow-[2px_2px_0px_0px_#000]">
          <PixelIcon name="peace" className="w-6 h-6" />
        </div>
        <div className="w-10 h-10 bg-[#FACC15] border-2 border-black flex items-center justify-center rotate-12 shadow-[2px_2px_0px_0px_#000]">
          <PixelIcon name="diamond" className="w-6 h-6" />
        </div>
      </div>

      {/* Retro Badge */}
      <div className="inline-flex items-center space-x-2 bg-[#D4E751] border-2 border-black px-3 py-1 mb-5 shadow-[2px_2px_0px_0px_#000]">
        <span className="w-3 h-3 bg-black animate-ping"></span>
        <span className="text-xs font-bold font-pixel-body uppercase tracking-wider">
          LIVE CAMPAIGN · STELLAR TESTNET
        </span>
      </div>

      {/* Main Title */}
      <h1 className="text-2xl md:text-3xl font-extrabold font-pixel-heading mb-5 tracking-tight leading-relaxed">
        {CONFIG.CAMPAIGN_TITLE}
      </h1>

      {/* Description */}
      <p className="text-sm md:text-base font-pixel-body mb-7 max-w-3xl leading-relaxed text-gray-800 border-l-4 border-black pl-4 py-2 bg-yellow-50">
        {CONFIG.CAMPAIGN_DESCRIPTION}
      </p>

      {/* Stats Row — Retro Pixel Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
        {/* Goal Card */}
        <div className="bg-[#D4E751] border-3 border-black p-4 md:p-5 shadow-[4px_4px_0px_0px_#000]">
          <div className="flex items-center space-x-2 mb-2">
            <PixelIcon name="diamond" className="w-4 h-4" />
            <p className="text-xs font-bold font-pixel-body uppercase">Goal</p>
          </div>
          <p className="text-xl md:text-2xl font-bold font-pixel-heading">
            {loadingCampaign ? "..." : `${(campaign?.goal || CONFIG.CAMPAIGN_GOAL_XLM).toLocaleString()} XLM`}
          </p>
        </div>

        {/* Raised Card */}
        <div className="bg-green-300 border-3 border-black p-4 md:p-5 shadow-[4px_4px_0px_0px_#000]">
          <div className="flex items-center space-x-2 mb-2">
            <PixelIcon name="coin" className="w-4 h-4" />
            <p className="text-xs font-bold font-pixel-body uppercase">Raised</p>
          </div>
          <p className="text-xl md:text-2xl font-bold font-pixel-heading">
            {loadingCampaign ? "..." : `${(campaign?.raised || 0).toFixed(2)} XLM`}
          </p>
        </div>

        {/* Deadline Card */}
        <div className="bg-blue-200 border-3 border-black p-4 md:p-5 shadow-[4px_4px_0px_0px_#000] col-span-1 sm:col-span-2 md:col-span-1">
          <div className="flex items-center space-x-2 mb-2">
            <PixelIcon name="star" className="w-4 h-4" />
            <p className="text-xs font-bold font-pixel-body uppercase">Deadline Ledger</p>
          </div>
          <p className="text-base md:text-lg font-bold font-pixel-heading">
            #{deadlineLedger.toLocaleString()}
          </p>
          <div className="mt-2 flex items-center space-x-1">
            <span className="text-xs font-bold">STATUS:</span>
            <span className={`text-xs font-bold px-1.5 py-0.5 ${campaign?.active !== false ? 'bg-black text-green-400' : 'bg-red-500 text-white'}`}>
              {campaign?.active !== false ? 'ACTIVE' : 'CLOSED'}
            </span>
          </div>
        </div>
      </div>

      {/* Contract link */}
      <div className="mt-6 md:mt-8 pt-4 md:pt-5 border-t-2 border-black flex flex-wrap justify-between items-center gap-2 text-xs font-pixel-body">
        <span className="font-bold">CONTRACT ADDRESS:</span>
        <a
          href={`${CONFIG.STELLAR_EXPERT_URL}/contract/${CONFIG.CONTRACT_ADDRESS}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono bg-black text-[#D4E751] px-2.5 py-1 font-bold hover:underline shadow-[2px_2px_0px_0px_#000] truncate max-w-full sm:max-w-none"
        >
          {CONFIG.CONTRACT_ADDRESS.substring(0, 10)}...{CONFIG.CONTRACT_ADDRESS.slice(-6)} ↗
        </a>
      </div>
    </div>
  );
};
