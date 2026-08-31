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
import { CreateCampaignForm } from './components/CreateCampaignForm';
import { useCrowdfunding } from './hooks/useCrowdfunding';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('FundingWala UI Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-100 border-3 border-black max-w-lg mx-auto my-8 shadow-[4px_4px_0px_0px_#000] font-pixel-body">
          <h2 className="font-pixel-heading text-sm font-bold text-red-900 mb-2">SOMETHING WENT WRONG</h2>
          <p className="text-xs text-red-800 mb-4">{this.state.error?.message || 'Unexpected application state.'}</p>
          <button
            onClick={() => {
              sessionStorage.clear();
              window.location.reload();
            }}
            className="font-pixel-heading text-xs font-bold bg-black text-[#D4E751] px-4 py-2 border-2 border-black hover:bg-gray-800"
          >
            RESET & REFRESH ↻
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const NAV_TABS = [
  { id: 'campaign', label: 'CAMPAIGN & DONATE', icon: 'coin' },
  { id: 'create', label: '+ CREATE CAMPAIGN', icon: 'sparkle' },
  { id: 'escrow', label: 'MILESTONE ESCROW', icon: 'lock' },
  { id: 'spending', label: 'SPENDING LOG', icon: 'chart' },
  { id: 'qf', label: 'QUADRATIC POOL', icon: 'heart' },
  { id: 'badges', label: 'SBT REPUTATION', icon: 'star' },
];

function App() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [activeTab, setActiveTab] = useState('campaign'); // campaign | create | escrow | spending | qf | badges
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const {
    campaign,
    campaigns,
    selectedCampaignId,
    selectCampaign,
    createCampaign,
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

  const currentTab = NAV_TABS.find((t) => t.id === activeTab) || NAV_TABS[0];

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
        <header className="pixel-box bg-white p-4 md:p-6 mb-6 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-[#D4E751] border-3 border-black flex items-center justify-center shadow-[3px_3px_0px_0px_#000] flex-shrink-0">
              <PixelIcon name="bread" className="w-8 h-8 text-black" />
            </div>
            <div>
              <h1 className="font-pixel-heading text-lg md:text-2xl font-extrabold tracking-tight">
                FundingWala
              </h1>
              <p className="font-pixel-body text-[10px] md:text-xs font-bold text-gray-600 mt-0.5 md:mt-1">
                DECENTRALIZED PATRONAGE & ESCROW ON STELLAR
              </p>
            </div>
          </div>

          {/* Right Header Section: Network Badge & Mobile 3-Bar Button */}
          <div className="flex items-center space-x-2 md:space-x-3 font-pixel-body text-xs">
            <div className="flex items-center space-x-2 bg-[#D4E751] border-2 border-black px-2.5 md:px-3 py-1.5 shadow-[2px_2px_0px_0px_#000]">
              <span className="w-2.5 h-2.5 bg-black animate-ping" />
              <span className="font-bold text-[10px] md:text-xs">STELLAR TESTNET</span>
            </div>
            <div className="hidden sm:block text-right">
              <span className="font-bold block text-[10px] text-gray-600">CONTRACT</span>
              <code className="bg-black text-[#D4E751] px-2 py-0.5 font-mono text-[10px] font-bold">
                {CONFIG.CONTRACT_ADDRESS.substring(0, 10)}…
              </code>
            </div>

            {/* Mobile 3-Bar (Hamburger) Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              className="md:hidden pixel-btn bg-black text-[#D4E751] px-2.5 py-1.5 text-xs flex items-center space-x-1.5 shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5"
            >
              <PixelIcon name="menu" className="w-4 h-4 text-[#D4E751]" />
              <span className="font-bold text-[10px]">MENU</span>
            </button>
          </div>
        </header>

        {/* ── Mobile Active Tab Bar (Mobile Only View) ────────── */}
        <div className="md:hidden flex items-center justify-between bg-white border-3 border-black p-3 mb-6 shadow-[3px_3px_0px_0px_#000] font-pixel-body">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-7 h-7 bg-[#D4E751] border-2 border-black flex items-center justify-center flex-shrink-0 shadow-[1px_1px_0px_0px_#000]">
              <PixelIcon name={currentTab.icon} className="w-4 h-4 text-black" />
            </div>
            <span className="font-bold text-xs truncate uppercase tracking-tight">
              {currentTab.label}
            </span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Select navigation tab"
            className="pixel-btn pixel-btn-accent px-2.5 py-1 text-[11px] font-bold flex items-center space-x-1 flex-shrink-0"
          >
            <PixelIcon name="menu" className="w-3.5 h-3.5 text-black" />
            <span>SWITCH</span>
          </button>
        </div>

        {/* ── Desktop Navigation Tabs (PC View Only) ──────────── */}
        <nav className="hidden md:flex flex-wrap gap-2 md:gap-2.5 mb-6 font-pixel-body text-xs">
          {NAV_TABS.map((tab) => (
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

        {/* ── Mobile Side 3-Bar Drawer (Mobile Only) ──────────── */}
        {isMobileMenuOpen && (
          <div
            className="mobile-drawer-backdrop md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
            role="presentation"
          />
        )}

        <aside
          className={`mobile-drawer md:hidden ${isMobileMenuOpen ? 'open' : ''}`}
          aria-label="Mobile Navigation Drawer"
        >
          {/* Drawer Header */}
          <div className="bg-[#D4E751] border-b-4 border-black p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 bg-white border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000] flex-shrink-0">
                <PixelIcon name="bread" className="w-5 h-5 text-black" />
              </div>
              <div>
                <h2 className="font-pixel-heading text-xs font-bold text-black">NAVIGATION</h2>
                <p className="font-pixel-body text-[10px] text-gray-700 font-bold">SELECT A VIEW</p>
              </div>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close navigation"
              className="pixel-btn bg-black text-white w-8 h-8 flex items-center justify-center text-sm font-bold shadow-[2px_2px_0px_0px_#000] hover:bg-red-600 active:translate-x-0.5 active:translate-y-0.5"
            >
              ✕
            </button>
          </div>

          {/* Drawer Navigation List */}
          <div className="p-4 space-y-3 flex-1 overflow-y-auto font-pixel-body">
            {NAV_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 p-3.5 border-3 border-black text-left transition-all active:translate-x-0.5 active:translate-y-0.5 ${
                    isActive
                      ? 'bg-black text-[#D4E751] shadow-[4px_4px_0px_0px_#000] translate-x-[-1px]'
                      : 'bg-white text-black hover:bg-yellow-100 shadow-[3px_3px_0px_0px_#000]'
                  }`}
                >
                  <div
                    className={`w-8 h-8 border-2 border-black flex items-center justify-center flex-shrink-0 shadow-[1px_1px_0px_0px_#000] ${
                      isActive ? 'bg-[#D4E751] text-black' : 'bg-gray-100 text-black'
                    }`}
                  >
                    <PixelIcon name={tab.icon} className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-xs truncate">{tab.label}</p>
                    {isActive && (
                      <span className="text-[9px] bg-[#D4E751] text-black font-bold px-1.5 py-0.5 inline-block mt-1 border border-black">
                        CURRENT VIEW
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Drawer Footer */}
          <div className="p-4 border-t-3 border-black bg-gray-50 font-pixel-body text-[10px] text-center space-y-1">
            <p className="font-bold text-black">STELLAR TESTNET PROTOCOL</p>
            <p className="text-gray-600 font-mono">8-BIT PATRONAGE</p>
          </div>
        </aside>

        {/* ── Tab Content ─────────────────────────────────────── */}
        {activeTab === 'campaign' && (
          <div className="space-y-6">
            <CrowdfundingHero
              campaign={campaign}
              campaigns={campaigns}
              onSelectCampaign={selectCampaign}
              onOpenCreate={() => setActiveTab('create')}
              loadingCampaign={loadingCampaign}
            />
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

        {activeTab === 'create' && (
          <CreateCampaignForm
            onCreateCampaign={createCampaign}
            onSuccess={() => setActiveTab('campaign')}
            connected={walletConnected}
          />
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
            <QuadraticFundingCard
              qfMetrics={qfMetrics}
              donorCount={donations.length}
              onNavigateTab={setActiveTab}
            />
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

export default function RootApp() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}

