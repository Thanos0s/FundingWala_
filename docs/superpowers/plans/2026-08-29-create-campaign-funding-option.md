# Multi-Campaign Crowdfunding & '+ CREATE CAMPAIGN' Creator Portal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete "+ CREATE CAMPAIGN" portal and multi-project switcher allowing creators to launch new crowdfunding initiatives with custom goals, descriptions, categories, and automated 3-stage milestone escrow governance, and donors to switch between campaigns.

**Architecture:**
1. Extend `useCrowdfunding.js` to manage a list of active campaigns with `localStorage` persistence, campaign selection, and `createCampaign` dispatch.
2. Build `src/components/CreateCampaignForm.jsx` with 4 interactive sections (Basics, Goal & Duration, 3-Stage Escrow Tranches, and Creator Launch).
3. Update `src/components/CrowdfundingHero.jsx` and `src/App.js` with retro project switcher dropdowns, `+ CREATE CAMPAIGN` navigation tab in desktop tabs and mobile 3-bar drawer.
4. Add comprehensive test cases in `src/App.test.js` and verify with production build.

**Tech Stack:** React 18, Tailwind CSS, Stellar SDK / Soroban RPC, Jest & React Testing Library.

## Global Constraints
- 8-bit retro aesthetic with Press Start 2P / Silkscreen typography, thick black borders (`border-3 border-black`), and sharp box shadows (`shadow-[3px_3px_0px_0px_#000]`).
- Defensive SVG icon sizing (`SIZE_MAP` in `PixelIcon.jsx`).
- Fully responsive with mobile 3-bar drawer and desktop tab navigation.
- Safe touch interactions with `touch-action: manipulation;`.

---

### Task 1: Extend `useCrowdfunding.js` for Multi-Campaign State Management

**Files:**
- Modify: `src/hooks/useCrowdfunding.js`
- Test: `src/App.test.js`

**Interfaces:**
- Produces:
  - `campaigns: CampaignRecord[]`
  - `selectedCampaign: CampaignRecord`
  - `selectCampaign(campaignId: string): void`
  - `createCampaign(data: CreateCampaignData): Promise<CampaignRecord>`

- [ ] **Step 1: Write failing test in `src/App.test.js` for `createCampaign` and project switching**
- [ ] **Step 2: Update `src/hooks/useCrowdfunding.js` to manage `campaigns` array, active campaign selection, and `createCampaign` with default 3-stage escrow tranches**
- [ ] **Step 3: Verify tests pass**
- [ ] **Step 4: Commit changes**

---

### Task 2: Create `CreateCampaignForm.jsx` Component

**Files:**
- Create: `src/components/CreateCampaignForm.jsx`
- Test: `src/App.test.js`

**Interfaces:**
- Consumes:
  - `onCreateCampaign: (formData) => Promise<any>`
  - `connected: boolean`
  - `walletAddress: string`
- Produces:
  - Interactive 4-step creation form with real-time tranche calculation, validation, and success notification.

- [ ] **Step 1: Build `CreateCampaignForm.jsx` with category chips, goal inputs, 3-stage tranche previews (30%/40%/30%), and submission validation**
- [ ] **Step 2: Add component tests in `src/App.test.js`**
- [ ] **Step 3: Run tests and verify**
- [ ] **Step 4: Commit changes**

---

### Task 3: Integrate Multi-Project Switcher into `CrowdfundingHero.jsx` and `App.js`

**Files:**
- Modify: `src/components/CrowdfundingHero.jsx`
- Modify: `src/App.js`

**Interfaces:**
- Consumes:
  - `campaigns`, `selectedCampaign`, `selectCampaign`, `onCreateCampaign`
- Produces:
  - Updated `NAV_TABS` including `+ CREATE CAMPAIGN` tab (`id: 'create'`) in desktop navigation and mobile drawer.
  - Interactive project switcher dropdown on Hero and active campaign badge.

- [ ] **Step 1: Update `CrowdfundingHero.jsx` to render the campaign switcher dropdown and "+ NEW PROJECT" shortcut**
- [ ] **Step 2: Update `App.js` to add the `+ CREATE CAMPAIGN` tab and wire `CreateCampaignForm`**
- [ ] **Step 3: Test switching between campaigns and creating new projects**
- [ ] **Step 4: Commit changes**

---

### Task 4: Automated Testing & Production Build Verification

**Files:**
- Modify: `src/App.test.js`

- [ ] **Step 1: Run `npm test -- --maxWorkers=1` to ensure all 8+ test suites pass**
- [ ] **Step 2: Run `npm run build` to verify zero errors in production bundle**
- [ ] **Step 3: Sync to `my-react-app/src` and push to remote `main`**
