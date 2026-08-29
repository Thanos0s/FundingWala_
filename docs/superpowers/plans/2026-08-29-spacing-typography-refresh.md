# Spacing & Typography Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refresh UI line heights, card paddings, and component element gaps across the application to remove visual clustering and eliminate vertical text overlaps.

**Architecture:** Update global pixel font utilities in `src/App.css` to enforce proper line-height, adjust overall layout grid spacing in `src/App.js`, and enhance internal spacing inside `WalletConnect.jsx`, `DonateForm.jsx`, `CrowdfundingHero.jsx`, and `DonorFeed.jsx`.

**Tech Stack:** React, Tailwind CSS, Custom CSS Pixel Utilities

## Global Constraints
- Do not alter existing logic, state management, or Soroban contract RPC bindings.
- Preserve 8-bit retro theme design language (borders, shadows, fonts).

---

### Task 1: Update Global Typography Line-Height and Base Pixel Styles

**Files:**
- Modify: `src/App.css:135-142`

**Interfaces:**
- Consumes: Tailwind classes and CSS variables in `App.css`.
- Produces: Corrected `.font-pixel-heading` and `.font-pixel-body` classes with explicit line-heights.

- [ ] **Step 1: Update CSS rule in `src/App.css`**

Add `line-height: 1.5;` to `.font-pixel-heading` and `.font-pixel-body` in `src/App.css`.

- [ ] **Step 2: Commit**

```bash
git add src/App.css
git commit -m "style: fix global pixel font line heights"
```

---

### Task 2: Adjust Main Layout Grid and Container Spacing in App.js

**Files:**
- Modify: `src/App.js:80-165`

**Interfaces:**
- Consumes: `App.js` main grid layout.
- Produces: Expanded grid and container spacing.

- [ ] **Step 1: Increase layout gaps in `src/App.js`**

Update grid from `gap-6` to `gap-8`, vertical column stacks to `space-y-8`, header `mb-6` to `mb-8`, and footer to `mt-10 p-6 space-y-2`.

- [ ] **Step 2: Commit**

```bash
git add src/App.js
git commit -m "style: expand main layout grid and header/footer spacing"
```

---

### Task 3: Refresh WalletConnect and DonateForm Component Spacing

**Files:**
- Modify: `src/components/WalletConnect.jsx`
- Modify: `src/components/DonateForm.jsx`

- [ ] **Step 1: Update `src/components/WalletConnect.jsx` spacing**

Increase wallet list gap to `space-y-4`, item padding to `p-4`, add `mb-1` title margin, and `pt-3` on footer text.

- [ ] **Step 2: Update `src/components/DonateForm.jsx` spacing**

Increase form gap to `space-y-6`, quick amount buttons gap to `gap-3` with `px-4 py-2` padding, donate button to `py-4 mt-3`, and alert banner padding to `p-4 mb-4`.

- [ ] **Step 3: Commit**

```bash
git add src/components/WalletConnect.jsx src/components/DonateForm.jsx
git commit -m "style: increase spacing in WalletConnect and DonateForm"
```

---

### Task 4: Refresh Hero and Donor Feed Components

**Files:**
- Modify: `src/components/CrowdfundingHero.jsx`
- Modify: `src/components/DonorFeed.jsx`

- [ ] **Step 1: Update `src/components/CrowdfundingHero.jsx` and `src/components/DonorFeed.jsx`**

Update card padding in `CrowdfundingHero.jsx` and `DonorFeed.jsx`.

- [ ] **Step 2: Run verification**

Run `npm test -- --watchAll=false` to verify tests pass.

- [ ] **Step 3: Commit**

```bash
git add src/components/CrowdfundingHero.jsx src/components/DonorFeed.jsx
git commit -m "style: refresh spacing in Hero and DonorFeed components"
```
