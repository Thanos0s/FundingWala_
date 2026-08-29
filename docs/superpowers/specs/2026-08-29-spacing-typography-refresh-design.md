# Spacing and Typography Refresh Design Document

**Date:** 2026-08-29  
**Status:** Approved by User  
**Goal:** Increase UI spacing, fix line heights, and eliminate vertical text overlaps across all retro 8-bit components.

---

## 1. Problem Statement
The current retro 8-bit user interface feels visually clustered:
- Custom pixel fonts (`Press Start 2P`, `Silkscreen`) lack explicit line-heights, causing vertical collisions between titles and subtext in wallet buttons and headers.
- Card padding and component element gaps are overly tight (`p-6` on small screens, `space-y-2.5` between items, `gap-2` on buttons).
- Form inputs, buttons, and alert banners sit too close to card borders and surrounding controls.

---

## 2. Proposed Changes

### 2.1 Global CSS (`src/App.css`)
- Add explicit line-height properties (`line-height: 1.5` / `leading-relaxed`) to `.font-pixel-heading` and `.font-pixel-body`.
- Increase base line spacing for text inside buttons, cards, and input labels.

### 2.2 Main Page Layout (`src/App.js`)
- Increase 3-column grid gap from `gap-6` to `gap-8`.
- Increase stacked column spacing from `space-y-6` to `space-y-8`.
- Increase main header margin bottom from `mb-6` to `mb-8`.
- Increase main footer margin top and padding from `mt-8 p-4` to `mt-10 p-6`, with `space-y-2` between lines.

### 2.3 Component-Level Enhancements

#### `src/components/WalletConnect.jsx`
- Increase wallet option button spacing from `space-y-2.5` to `space-y-4`.
- Increase wallet button inner padding from `p-3` to `p-4`.
- Add vertical margin `mb-1` between provider title ("Freighter") and description ("OFFICIAL STELLAR WALLET").
- Add `pt-3` spacing above security footer text.

#### `src/components/DonateForm.jsx`
- Increase main form spacing from `space-y-5` to `space-y-6`.
- Increase quick amount buttons gap from `gap-2` to `gap-3`, with button padding `px-4 py-2`.
- Add `mt-3` and increase button padding `py-4` for the primary "DONATE NOW" button.
- Increase padding on the "WALLET NOT CONNECTED" alert banner to `p-4` with `mb-4`.

#### `src/components/CrowdfundingHero.jsx`
- Increase bottom spacing between title, description, and stats grid (`mb-6` / `mb-8`).
- Add extra padding `p-4` inside goal, raised, and deadline metric cards.

#### `src/components/DonorFeed.jsx`
- Increase donation feed list item spacing from `space-y-2.5` to `space-y-3.5`.
- Increase donation item inner padding from `p-3` to `p-4`.

---

## 3. Verification Plan
- Verify visually that text no longer collides in wallet buttons or headers.
- Ensure all cards have breathing room and consistent 8-bit border shadows.
- Run build/test to confirm no syntax or React component breakages.
