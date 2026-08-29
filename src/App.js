import React, { useState } from 'react';
import './App.css';
import { CONFIG } from './config';
import { WalletConnect } from './components/WalletConnect';
import { CrowdfundingHero } from './components/CrowdfundingHero';
import { ProgressBar } from './components/ProgressBar';
import { DonateForm } from './components/DonateForm';
import { DonorFeed } from './components/DonorFeed';
import { TransactionStatus } from './components/TransactionStatus';
import { PixelIcon } from './components/PixelIcon';
import { useCrowdfunding } from './hooks/useCrowdfunding';

function App() {
  const [walletConnected, setWalletConnected] = useState(false);

  const {
    campaign,
    donations,
    loadingCampaign,
    donationState,
    donate,
    resetDonation,
    refreshCampaign,
  } = useCrowdfunding();

  return (
    <div className="min-h-screen p-4 md:p-8 relative overflow-hidden">
      {/* Decorative Pixel Background Elements (matching screenshot style) */}
      <div className="pixel-deco-square top-8 left-12 rotate-12 hidden md:block" />
      <div className="pixel-deco-square top-24 right-16 -rotate-6 hidden md:block" />
      <div className="pixel-deco-square bottom-32 left-8 rotate-45 hidden md:block" />
      <div className="pixel-deco-square bottom-16 right-24 -rotate-12 hidden md:block" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto relative z-10">

        {/* ── Retro Pixel Header Bar ──────────────────────────── */}
        <header className="pixel-box bg-white p-5 md:p-6 mb-8 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center space-x-3">
            {/* Retro Pixel Logo */}
            <div className="w-12 h-12 bg-[#D4E751] border-3 border-black flex items-center justify-center shadow-[3px_3px_0px_0px_#000]">
              <PixelIcon name="bread" className="w-8 h-8 text-black" />
            </div>
            <div>
              <h1 className="font-pixel-heading text-xl md:text-2xl font-extrabold tracking-tight">
                FundingWala
              </h1>
              <p className="font-pixel-body text-xs font-bold text-gray-600 mt-1">
                8-BIT CROWDFUNDING ON STELLAR
              </p>
            </div>
          </div>

          {/* Network Badge */}
          <div className="flex items-center space-x-3 font-pixel-body text-xs">
            <div className="flex items-center space-x-2 bg-[#D4E751] border-2 border-black px-3 py-1.5 shadow-[2px_2px_0px_0px_#000]">
              <span className="w-2.5 h-2.5 bg-black animate-ping" />
              <span className="font-bold">STELLAR TESTNET</span>
            </div>
            <div className="hidden sm:block text-right">
              <span className="font-bold block text-[10px] text-gray-600">CONTRACT</span>
              <code className="bg-black text-[#D4E751] px-2 py-0.5 font-mono text-[10px] font-bold">
                {CONFIG.CONTRACT_ADDRESS.substring(0, 10)}…
              </code>
            </div>
          </div>
        </header>

        {/* ── Hero Section ───────────────────────────────────── */}
        <CrowdfundingHero campaign={campaign} loadingCampaign={loadingCampaign} />

        {/* ── Progress Bar ───────────────────────────────────── */}
        <ProgressBar
          raised={campaign.raised}
          goal={campaign.goal}
          progress={campaign.progress}
        />

        {/* ── Main Layout Grid ───────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column: Wallet Connect & Campaign Info */}
          <div className="lg:col-span-1 space-y-8">
            <div className="pixel-box p-6 md:p-8 bg-white">
              <WalletConnect onConnected={setWalletConnected} />
            </div>

            {/* Campaign Metadata Box */}
            <div className="pixel-box p-6 md:p-8 bg-white font-pixel-body space-y-4">
              <div className="flex items-center space-x-2 border-b-2 border-black pb-3">
                <PixelIcon name="star" className="w-5 h-5" />
                <h4 className="font-pixel-heading text-xs font-bold uppercase">
                  GAME RULES
                </h4>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="font-bold text-gray-600">NETWORK:</span>
                  <span className="font-bold">STELLAR TESTNET</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-gray-600">STATUS:</span>
                  <span className={`font-bold px-1 ${campaign.active !== false ? 'bg-[#D4E751] text-black border border-black' : 'bg-red-500 text-white'}`}>
                    {campaign.active !== false ? '● ACTIVE' : '● CLOSED'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-gray-600">GOAL:</span>
                  <span className="font-bold">
                    {(campaign.goal || CONFIG.CAMPAIGN_GOAL_XLM).toLocaleString()} XLM
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-gray-600">MIN DONATION:</span>
                  <span className="font-bold">{CONFIG.MIN_DONATION_XLM} XLM</span>
                </div>
              </div>

              <button
                onClick={refreshCampaign}
                className="pixel-btn pixel-btn-accent w-full py-3 text-xs mt-4 flex items-center justify-center space-x-2"
              >
                <PixelIcon name="refresh" className="w-4 h-4" />
                <span>REFRESH DATA</span>
              </button>
            </div>
          </div>

          {/* Center Column: Donate Form & Transaction Status */}
          <div className="lg:col-span-1 space-y-8">
            <DonateForm
              connected={walletConnected}
              donationState={donationState}
              onDonate={donate}
              onReset={resetDonation}
            />

            {donationState.status !== 'idle' && donationState.txHash && (
              <TransactionStatus
                txHash={donationState.txHash}
                status={donationState.status}
              />
            )}
          </div>

          {/* Right Column: Donor Feed */}
          <div className="lg:col-span-1">
            <DonorFeed donations={donations} />
          </div>

        </div>

        {/* ── Footer ──────────────────────────────────────────── */}
        <footer className="pixel-box bg-white mt-10 p-6 text-center font-pixel-body text-xs space-y-2">
          <p className="font-bold">
            BUILT WITH ❤️ ON <span className="bg-black text-[#D4E751] px-1.5 py-0.5">STELLAR SOROBAN</span> · 8-BIT RETRO DAPP
          </p>
          <p className="text-[10px] text-gray-600 font-mono">
            CONTRACT: {CONFIG.CONTRACT_ADDRESS}
          </p>
        </footer>

      </div>
    </div>
  );
}

export default App;
