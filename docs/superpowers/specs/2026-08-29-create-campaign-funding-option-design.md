# FundingWala — Multi-Campaign Crowdfunding & '+ CREATE CAMPAIGN' Creator Portal Design

## 1. Overview
FundingWala is a decentralized crowdfunding platform built on Stellar and Soroban featuring 8-bit retro aesthetics, milestone-based escrow tranches, Quadratic Funding matching, transparent spending audit logs, and Soulbound backer badges.

This design introduces a full **Creator Portal (`+ CREATE CAMPAIGN`)** allowing creators to launch new crowdfunding initiatives with custom goals, descriptions, categories, and automated 3-stage milestone escrow governance, coupled with a **Multi-Project Switcher** enabling donors to browse and contribute to various active campaigns.

---

## 2. Architecture & Data Flow

### 2.1 Campaign Data Structure
```typescript
export interface MilestoneTranche {
  id: number;
  title: string;
  targetAmount: number; // in XLM
  percentage: number;   // e.g. 30, 40, 30
  deadline: number;
  approvals: number;
  rejections: number;
  released: boolean;
  disputed: boolean;
}

export interface CampaignRecord {
  id: string;                    // unique slug/id
  title: string;                 // Project name
  category: string;              // "Clean Water" | "Open Source" | "Solar Energy" | "Education" | "Community"
  description: string;           // Project mission story
  admin: string;                 // Creator Stellar address
  goal: number;                  // Goal in XLM
  raised: number;                // Raised in XLM
  progress: number;              // 0 - 100%
  active: boolean;               // Campaign status
  deadline: number;              // Deadline ledger / timestamp
  createdAt: string;
  milestones: MilestoneTranche[];
  spendingLogs: Array<{
    id: number;
    milestoneId: number;
    amount: number;
    recipient: string;
    category: string;
    description: string;
    timestamp: string;
  }>;
  donations: Array<{
    id: string;
    donor: string;
    amount: number;
    timestamp: number;
    txHash: string;
  }>;
}
```

### 2.2 Storage & State Management
- **Pre-populated Catalog**: Initialized with default featured Stellar Soroban project (*"Clean Water for Turkana Well Project"*).
- **Persistent State**: Newly created campaigns stored in `localStorage` under `fundingwala_campaigns` key.
- **Hook Integration (`useCrowdfunding`)**:
  - `campaigns`: Array of all available projects.
  - `selectedCampaignId`: ID of the currently active project.
  - `selectCampaign(id)`: Switches active project and updates progress bar, donations, escrow milestones, audit logs, and quadratic funding metrics.
  - `createCampaign(formData)`: Validates input, constructs default 3-stage escrow tranches (30%, 40%, 30%), prepends to campaign catalog, saves to storage, and navigates to the newly created campaign.

---

## 3. UI & Component Specifications

### 3.1 Navigation Tabs (Desktop & Mobile 3-Bar Drawer)
Update `NAV_TABS` in `src/App.js` with 6 options:
1. `CAMPAIGN & DONATE` (id: `'campaign'`, icon: `'coin'`)
2. `+ CREATE CAMPAIGN` (id: `'create'`, icon: `'sparkle'`)
3. `MILESTONE ESCROW` (id: `'escrow'`, icon: `'lock'`)
4. `SPENDING LOG` (id: `'spending'`, icon: `'chart'`)
5. `QUADRATIC POOL` (id: `'qf'`, icon: `'heart'`)
6. `SBT REPUTATION` (id: `'badges'`, icon: `'star'`)

### 3.2 New Component: `CreateCampaignForm.jsx`
- **Section 1: Basic Information**:
  - Project Title (input, min 3 chars).
  - Category selector chips (*Clean Water*, *Open Source*, *Solar Energy*, *Education*, *Healthcare*, *Community*).
  - Project Mission & Story (textarea, min 10 chars).
- **Section 2: Funding Goal & Timeline**:
  - Target Goal in XLM (input + quick amount chips: `500 XLM`, `1,000 XLM`, `2,500 XLM`, `5,000 XLM`).
  - Duration in days (e.g. 30, 60, 90 days).
- **Section 3: 3-Stage Milestone Escrow Configuration**:
  - Tranche 1 (30%): Survey & Initial Setup.
  - Tranche 2 (40%): Core Execution & Build.
  - Tranche 3 (30%): Final Delivery & Testing.
  - Real-time calculated XLM amount preview for each tranche.
- **Section 4: Actions & Feedback**:
  - Validates required fields and goal > 0.
  - If wallet disconnected, prompts user or connects 1-tap testnet wallet.
  - Submitting creates the campaign, triggers success banner, and opens the new project in the Campaign tab.

### 3.3 Project Selector (Hero & Header)
- In `CrowdfundingHero.jsx` and `App.js`:
  - Displays active campaign switcher: `ACTIVE CAMPAIGN: [ ▼ Project Title ]` with total active projects count badge.
  - `+ NEW CAMPAIGN` shortcut button to jump directly into creation mode.

---

## 4. Verification & Testing Plan
1. **Unit Tests (`src/App.test.js`)**:
   - Verify `+ CREATE CAMPAIGN` tab rendering in desktop navigation and mobile drawer.
   - Test filling out and submitting `CreateCampaignForm` creates a new project in state.
   - Verify project switching updates campaign hero, progress bar, and escrow tranches.
2. **Build Verification**:
   - Execute `npm test` and `npm run build` to confirm zero regressions and clean bundle.
