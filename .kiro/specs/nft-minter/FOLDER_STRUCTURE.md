# NFT Minter - Folder Structure Reference

## Current vs. Target Structure

### 📂 Current Project Structure (Existing)

```
Stealler_02/
├── .git/
├── .github/
├── my-react-app/
│   ├── .git/
│   ├── .gitignore
│   ├── Anonymous/
│   │   ├── .gitignore
│   │   ├── Cargo.lock
│   │   ├── Cargo.toml
│   │   ├── README.md
│   │   ├── contracts/
│   │   │   └── hello-world/        # Reference contract
│   │   │       ├── Cargo.toml
│   │   │       ├── Makefile
│   │   │       └── src/
│   │   │           ├── lib.rs
│   │   │           └── test.rs
│   │   └── target/
│   ├── node_modules/
│   ├── package.json
│   ├── package-lock.json
│   ├── public/
│   │   ├── favicon.ico
│   │   ├── index.html
│   │   ├── logo192.png
│   │   ├── logo512.png
│   │   ├── manifest.json
│   │   └── robots.txt
│   ├── README.md
│   ├── SCREENSHOTS/
│   │   ├── Screenshot 2026-07-16 223406.png
│   │   ├── Screenshot 2026-07-16 223456.png
│   │   ├── Screenshot 2026-07-16 223557.png
│   │   └── Screenshot 2026-07-16 223654.png
│   ├── src/
│   │   ├── App.css
│   │   ├── App.js
│   │   ├── App.test.js
│   │   ├── config.js
│   │   ├── index.css
│   │   ├── index.js
│   │   ├── logo.svg
│   │   ├── reportWebVitals.js
│   │   └── setupTests.js
│   └── tailwind.config.js
├── node_modules/
├── package.json
├── package-lock.json
└── README.md
```

### 🆕 Target Structure (After Implementation)

```
Stealler_02/
├── .git/
├── .github/
│
├── .kiro/                             # ✅ ALREADY CREATED
│   └── specs/
│       └── nft-minter/
│           ├── .config.kiro
│           ├── PRD.md
│           ├── requirements.md
│           ├── design.md
│           ├── tasks.md
│           ├── SUMMARY.md
│           └── FOLDER_STRUCTURE.md
│
├── my-react-app/
│   ├── .git/
│   ├── .gitignore
│   │
│   ├── Anonymous/
│   │   ├── .gitignore
│   │   ├── Cargo.lock
│   │   ├── Cargo.toml
│   │   ├── README.md
│   │   ├── contracts/
│   │   │   ├── hello-world/         # Existing reference
│   │   │   │   ├── Cargo.toml
│   │   │   │   ├── Makefile
│   │   │   │   └── src/
│   │   │   │       ├── lib.rs
│   │   │   │       └── test.rs
│   │   │   │
│   │   │   └── nft-minter/          # 🆕 NEW CONTRACT
│   │   │       ├── Cargo.toml       # 🆕 Dependencies
│   │   │       ├── Makefile         # 🆕 Build commands
│   │   │       └── src/
│   │   │           ├── lib.rs       # 🆕 Contract code
│   │   │           └── test.rs      # 🆕 Contract tests
│   │   └── target/
│   │
│   ├── node_modules/
│   ├── package.json                 # ✏️ UPDATE: Add new deps
│   ├── package-lock.json
│   │
│   ├── public/
│   │   ├── favicon.ico
│   │   ├── index.html
│   │   ├── logo192.png
│   │   ├── logo512.png
│   │   ├── manifest.json
│   │   └── robots.txt
│   │
│   ├── README.md                    # ✏️ UPDATE: Full docs
│   │
│   ├── SCREENSHOTS/
│   │   ├── Screenshot 2026-07-16 223406.png
│   │   ├── Screenshot 2026-07-16 223456.png
│   │   ├── Screenshot 2026-07-16 223557.png
│   │   ├── Screenshot 2026-07-16 223654.png
│   │   ├── wallet-options.png       # 🆕 Required screenshot
│   │   ├── mint-form.png            # 🆕 UI screenshot
│   │   └── transaction-status.png   # 🆕 Status screenshot
│   │
│   ├── src/
│   │   ├── components/              # 🆕 NEW FOLDER
│   │   │   ├── WalletConnect.jsx    # 🆕 Wallet UI
│   │   │   ├── NFTMintForm.jsx      # 🆕 Mint form
│   │   │   ├── TransactionStatus.jsx # 🆕 Tx tracker
│   │   │   ├── NFTDisplay.jsx       # 🆕 NFT viewer
│   │   │   ├── ErrorNotification.jsx # 🆕 Error display
│   │   │   └── LoadingSpinner.jsx   # 🆕 Loading UI
│   │   │
│   │   ├── services/                # 🆕 NEW FOLDER
│   │   │   ├── walletService.js     # 🆕 Wallet logic
│   │   │   ├── contractService.js   # 🆕 Contract calls
│   │   │   ├── eventService.js      # 🆕 Event handling
│   │   │   └── validationService.js # 🆕 Validation
│   │   │
│   │   ├── hooks/                   # 🆕 NEW FOLDER
│   │   │   ├── useWallet.js         # 🆕 Wallet hook
│   │   │   ├── useContract.js       # 🆕 Contract hook
│   │   │   ├── useTransaction.js    # 🆕 Tx hook
│   │   │   └── useEventListener.js  # 🆕 Event hook
│   │   │
│   │   ├── utils/                   # 🆕 NEW FOLDER
│   │   │   ├── errorHandler.js      # 🆕 Error handling
│   │   │   ├── formatters.js        # 🆕 Formatting utils
│   │   │   └── constants.js         # 🆕 Constants
│   │   │
│   │   ├── __tests__/               # 🆕 NEW FOLDER
│   │   │   ├── WalletConnect.test.js # 🆕 Component test
│   │   │   ├── NFTMintForm.test.js   # 🆕 Component test
│   │   │   ├── TransactionStatus.test.js # 🆕 Component test
│   │   │   ├── services/             # 🆕 Service tests
│   │   │   │   ├── walletService.test.js
│   │   │   │   └── contractService.test.js
│   │   │   └── hooks/                # 🆕 Hook tests
│   │   │       └── useWallet.test.js
│   │   │
│   │   ├── App.css                  # ✏️ UPDATE: Styles
│   │   ├── App.js                   # ✏️ UPDATE: Main app
│   │   ├── App.test.js
│   │   ├── config.js                # ✏️ UPDATE: Add contract addr
│   │   ├── index.css
│   │   ├── index.js
│   │   ├── logo.svg
│   │   ├── reportWebVitals.js
│   │   └── setupTests.js
│   │
│   └── tailwind.config.js
│
├── node_modules/
├── package.json
├── package-lock.json
└── README.md                        # ✏️ UPDATE: Root docs
```

## 📝 Legend

- ✅ **Already Created** - Files/folders that exist now
- 🆕 **New** - Files/folders to create
- ✏️ **Update** - Existing files to modify
- 📁 **Existing** - Current files, no changes needed

## 🗂️ Files to Create (26 new files)

### Smart Contract (5 files)
```
Anonymous/contracts/nft-minter/
├── Cargo.toml
├── Makefile
└── src/
    ├── lib.rs
    └── test.rs
```

### Components (6 files)
```
src/components/
├── WalletConnect.jsx
├── NFTMintForm.jsx
├── TransactionStatus.jsx
├── NFTDisplay.jsx
├── ErrorNotification.jsx
└── LoadingSpinner.jsx
```

### Services (4 files)
```
src/services/
├── walletService.js
├── contractService.js
├── eventService.js
└── validationService.js
```

### Hooks (4 files)
```
src/hooks/
├── useWallet.js
├── useContract.js
├── useTransaction.js
└── useEventListener.js
```

### Utils (3 files)
```
src/utils/
├── errorHandler.js
├── formatters.js
└── constants.js
```

### Tests (7 files minimum)
```
src/__tests__/
├── WalletConnect.test.js
├── NFTMintForm.test.js
├── TransactionStatus.test.js
├── services/
│   ├── walletService.test.js
│   └── contractService.test.js
└── hooks/
    └── useWallet.test.js
```

### Screenshots (3 files)
```
SCREENSHOTS/
├── wallet-options.png
├── mint-form.png
└── transaction-status.png
```

## ✏️ Files to Update (5 files)

1. **my-react-app/package.json**
   - Add @stellar/stellar-sdk
   - Add testing dependencies

2. **my-react-app/src/App.js**
   - Import and integrate all components
   - Add wallet context
   - Implement layout

3. **my-react-app/src/config.js**
   - Add CONTRACT_ADDRESS
   - Add network configuration
   - Add RPC URLs

4. **my-react-app/README.md**
   - Complete documentation
   - Setup instructions
   - Contract address
   - Transaction hash
   - Screenshots

5. **README.md** (root)
   - Project overview
   - Link to my-react-app README

## 📦 Dependencies to Add

### package.json additions:
```json
{
  "dependencies": {
    "@stellar/stellar-sdk": "^11.0.0"
  },
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "@testing-library/user-event": "^14.0.0"
  }
}
```

### Cargo.toml (for nft-minter):
```toml
[package]
name = "nft-minter"
version = "0.1.0"
edition = "2021"

[dependencies]
soroban-sdk = "20.0.0"

[dev-dependencies]
soroban-sdk = { version = "20.0.0", features = ["testutils"] }
```

## 🎯 Implementation Order

### Phase 1: Contract Structure
1. Create `Anonymous/contracts/nft-minter/` folder
2. Create `Cargo.toml`
3. Create `Makefile`
4. Create `src/lib.rs` and `src/test.rs`

### Phase 2: Contract Code
1. Implement contract in `lib.rs`
2. Write tests in `test.rs`
3. Build and test locally
4. Deploy to testnet

### Phase 3: Frontend Structure
1. Create folder structure (components/, services/, hooks/, utils/)
2. Update package.json
3. Install dependencies

### Phase 4: Service Layer
1. Create all 4 services
2. Create all 4 hooks
3. Create all 3 utilities

### Phase 5: Components
1. Create all 6 components
2. Update App.js
3. Update config.js

### Phase 6: Testing
1. Create test files
2. Write tests for components
3. Write tests for services

### Phase 7: Documentation
1. Update README.md
2. Capture screenshots
3. Document contract address and tx hash

## 🔄 Migration Path

Your existing project already has:
- ✅ React setup with Tailwind
- ✅ Soroban contract structure (hello-world as reference)
- ✅ Basic configuration (config.js)
- ✅ SCREENSHOTS folder

You need to add:
- 🆕 NFT minter contract
- 🆕 Component architecture
- 🆕 Service layer
- 🆕 Custom hooks
- 🆕 Comprehensive tests
- 🆕 Updated documentation

## 💾 Disk Space Estimate

- Smart contract files: ~50 KB
- Frontend source files: ~200 KB
- Tests: ~100 KB
- Screenshots: ~3 MB
- node_modules (new deps): ~50 MB
- Compiled contract: ~500 KB

**Total new files:** ~53-54 MB

---

**Ready to start?** Begin with Task 1.1 in tasks.md to create the contract structure! 🚀
