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
import { MilestoneEscrowPanel } from './components/MilestoneEscrowPanel';
import { SpendingAuditLog } from './components/SpendingAuditLog';
import { QuadraticFundingCard } from './components/QuadraticFundingCard';
import { SoulboundBadges } from './components/SoulboundBadges';
import { RefundPortal } from './components/RefundPortal';
import { useCrowdfunding } from './hooks/useCrowdfunding';

function App() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [activeTab, setActiveTab] = useState('campaign'); // campaign | escrow | spending | qf | badges

  const {
    campaign,
    donations,
    milestones,
    spendingLogs,
    creatorReputation,
    qfMetrics,
    loadingCampaign,
    donationState,
    votingState,
    donate,
    voteMilestone,
    claimRefund,
    resetDonation,
    refreshCampaign,
  } = useCrowdfunding();

  return (
    <div className="min-h-screen p-4 md:p-8 relative overflow-hidden">
      {/* Decorative Pixel Background Elements */}
      <div className="pixel-deco-square top-8 left-12 rotate-12 hidden md:block" />
      <div className="pixel-deco-square top-24 right-16 -rotate-6 hidden md:block" />
      <div className="pixel-deco-square bottom-32 left-8 rotate-45 hidden md:block" />
      <div className="pixel-deco-square bottom-16 right-24 -rotate-12 hidden md:block" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto relative z-10">

        {/* ── Retro Pixel Header Bar ──────────────────────────── */}
        <header className="pixel-box bg-white p-5 md:p-6 mb-6 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-[#D4E751] border-3 border-black flex items-center justify-center shadow-[3px_3px_0px_0px_#000]">
              <PixelIcon name="bread" className="w-8 h-8 text-black" />
            </div>
            <div>
              <h1 className="font-pixel-heading text-xl md:text-2xl font-extrabold tracking-tight">
                FundingWala
              </h1>
              <p className="font-pixel-body text-xs font-bold text-gray-600 mt-1">
                DECENTRALIZED PATRONAGE & ESCROW ON STELLAR
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

        {/* ── Navigation Tabs ─────────────────────────────────── */}
        <nav className="flex overflow-x-auto pb-2 sm:pb-0 sm:flex-wrap gap-2 md:gap-2.5 mb-6 font-pixel-body text-xs">
          {[
            { id: 'campaign', label: 'CAMPAIGN & DONATE', icon: 'coin' },
            { id: 'escrow', label: 'MILESTONE ESCROW', icon: 'lock' },
            { id: 'spending', label: 'SPENDING LOG', icon: 'chart' },
            { id: 'qf', label: 'QUADRATIC POOL', icon: 'sparkle' },
            { id: 'badges', label: 'SBT REPUTATION', icon: 'star' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 md:px-4 py-2.5 md:py-3 font-bold border-3 border-black transition-all shadow-[3px_3px_0px_0px_#000] md:shadow-[4px_4px_0px_0px_#000] whitespace-nowrap flex-shrink-0 active:translate-x-0.5 active:translate-y-0.5 ${
                activeTab === tab.id
                  ? 'bg-black text-[#D4E751] translate-x-[-2px] translate-y-[-2px] shadow-[5px_5px_0px_0px_#000]'
                  : 'bg-white text-black hover:bg-[#F3F4F6]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* ── Tab Content ─────────────────────────────────────── */}
        {activeTab === 'campaign' && (
          <div className="space-y-6">
            <CrowdfundingHero campaign={campaign} loadingCampaign={loadingCampaign} />
            <ProgressBar
              raised={campaign.raised}
              goal={campaign.goal}
              progress={campaign.progress}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column */}
              <div className="lg:col-span-1 space-y-6">
                <div className="pixel-box p-6 bg-white">
                  <WalletConnect onConnected={setWalletConnected} />
                </div>

                <div className="pixel-box p-6 bg-white font-pixel-body space-y-4">
                  <div className="flex items-center space-x-2 border-b-2 border-black pb-3">
                    <PixelIcon name="star" className="w-5 h-5" />
                    <h4 className="font-pixel-heading text-xs font-bold uppercase">
                      PROTOCOL SPECS
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
                        {campaign.active !== false ? 'ACTIVE' : 'CLOSED'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold text-gray-600">GOAL:</span>
                      <span className="font-bold">
                        {(campaign.goal || CONFIG.CAMPAIGN_GOAL_XLM).toLocaleString()} XLM
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold text-gray-600">ESCROW TRANCHES:</span>
                      <span className="font-bold">3 Milestones</span>
                    </div>
                  </div>

                  <button
                    onClick={refreshCampaign}
                    className="pixel-btn pixel-btn-accent w-full py-3 text-xs mt-4 flex items-center justify-center space-x-2"
                  >
                    <PixelIcon name="refresh" className="w-4 h-4" />
                    <span>SYNC ON-CHAIN DATA</span>
                  </button>
                </div>
              </div>

              {/* Center Column */}
              <div className="lg:col-span-1 space-y-6">
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

              {/* Right Column */}
              <div className="lg:col-span-1">
                <DonorFeed donations={donations} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'escrow' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <MilestoneEscrowPanel
              milestones={milestones}
              onVote={voteMilestone}
              votingState={votingState}
            />
            <RefundPortal
              campaign={campaign}
              onClaimRefund={claimRefund}
              isConnected={walletConnected}
            />
          </div>
        )}

        {activeTab === 'spending' && (
          <div className="max-w-4xl mx-auto">
            <SpendingAuditLog spendingLogs={spendingLogs} />
          </div>
        )}

        {activeTab === 'qf' && (
          <div className="max-w-3xl mx-auto">
            <QuadraticFundingCard qfMetrics={qfMetrics} donorCount={donations.length} />
          </div>
        )}

        {activeTab === 'badges' && (
          <div className="max-w-4xl mx-auto">
            <SoulboundBadges
              donorAmount={campaign.raised > 0 ? 25 : 0}
              creatorReputation={creatorReputation}
            />
          </div>
        )}

        {/* ── Footer ──────────────────────────────────────────── */}
        <footer className="pixel-box bg-white mt-10 p-6 text-center font-pixel-body text-xs space-y-2">
          <p className="font-bold">
            BUILT ON <span className="bg-black text-[#D4E751] px-1.5 py-0.5">STELLAR SOROBAN</span> · 8-BIT RETRO DAPP
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

