// Stellar Network Configuration
export const STELLAR_CONFIG = {
  horizon: 'https://horizon-testnet.stellar.org',
  network: 'Test SDF Network ; September 2015',
  networkPassphrase: 'Test SDF Network ; September 2015',
  explorerUrl: 'https://stellar.expert/explorer/testnet/tx',
  friendbotUrl: 'https://friendbot.stellar.org/',
};

// Crowdfunding dApp Configuration
export const CONFIG = {
  // Network Configuration
  NETWORK: 'TESTNET',
  NETWORK_PASSPHRASE: 'Test SDF Network ; September 2015',
  SOROBAN_RPC_URL: 'https://soroban-testnet.stellar.org',
  HORIZON_URL: 'https://horizon-testnet.stellar.org',

  // Contract Configuration — updated after deployment
  CONTRACT_ADDRESS: process.env.REACT_APP_CONTRACT_ADDRESS || 'CBK6FGJ3DXHYFYUVHUDSLTXANQSSE6XN6LNLGEU6TC5LIWLSYR4OVO5V',

  // Campaign Configuration
  CAMPAIGN_TITLE: 'Community Water Well Fund',
  CAMPAIGN_DESCRIPTION: 'Help us build a clean water well for 500 families in rural Kenya. Every XLM donated brings us closer to life-changing clean water access.',
  CAMPAIGN_GOAL_XLM: 1000,          // Goal in XLM
  CAMPAIGN_GOAL_STROOPS: 1000 * 10_000_000, // 1000 XLM in stroops
  CAMPAIGN_DEADLINE_LEDGER: 9999999,
  MIN_DONATION_XLM: 0.5,

  // Wallet Providers
  SUPPORTED_WALLETS: ['freighter', 'albedo', 'xbull'],

  // Transaction Configuration
  DEFAULT_TIMEOUT: 30,
  TRANSACTION_POLL_INTERVAL: 3000,   // ms between tx status polls
  CAMPAIGN_REFRESH_INTERVAL: 5000,   // ms between campaign data refresh
  STELLAR_EXPERT_URL: 'https://stellar.expert/explorer/testnet',

  // UI Configuration
  TOAST_DURATION: 5000,
  LOADING_TIMEOUT_WARNING: 30000,
};

export const config = CONFIG;
