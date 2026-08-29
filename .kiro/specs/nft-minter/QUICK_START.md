# NFT Minter - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### What You're Building

A **NFT Minting dApp** on Stellar blockchain with:
- 🔐 Multi-wallet support (Freighter + Albedo)
- 🎨 Simple NFT minting with metadata
- ⏱️ Real-time transaction tracking
- ⚠️ Comprehensive error handling
- 📱 Responsive UI with Tailwind CSS

### 📚 Your Spec Documents

All documents are in `.kiro/specs/nft-minter/`:

| Document | Purpose | When to Use |
|----------|---------|-------------|
| **PRD.md** | Product overview | Start here for big picture |
| **requirements.md** | Detailed requirements | When clarifying what to build |
| **design.md** | Technical architecture | When implementing features |
| **tasks.md** | Step-by-step tasks | Your daily development guide |
| **SUMMARY.md** | Complete overview | Quick reference |
| **FOLDER_STRUCTURE.md** | File organization | When creating files |
| **QUICK_START.md** | This guide | Getting started |

## ⚡ 3-Step Quick Start

### Step 1: Read the Docs (10 min)

```bash
# Open in your editor
code .kiro/specs/nft-minter/PRD.md         # Product overview
code .kiro/specs/nft-minter/tasks.md       # Your roadmap
```

**Read in this order:**
1. PRD.md - Sections: "Executive Summary" and "Feature Requirements"
2. tasks.md - Phase 1 tasks (1.1 - 1.5)

### Step 2: Set Up Environment (15 min)

```bash
# Install Stellar/Soroban CLI
# Windows (with winget):
winget install --id Stellar.StellarCLI

# OR download from: https://soroban.stellar.org/docs/getting-started/setup

# Install Rust target for WASM
rustup target add wasm32-unknown-unknown

# Install Node dependencies
cd my-react-app
npm install

# Install new dependencies
npm install @stellar/stellar-sdk
```

### Step 3: Create Contract Structure (5 min)

```bash
# Navigate to contracts folder
cd Anonymous/contracts

# Create nft-minter folder
mkdir nft-minter
cd nft-minter

# Create basic structure
mkdir src
```

Now follow **Task 1.1** in tasks.md!

## 📋 Level 2.3 Checklist

Your project must have:

- [ ] **3+ Error Types** - Wallet, Contract, Network
- [ ] **Testnet Contract** - Deployed Soroban contract
- [ ] **Frontend Calls** - React → Contract integration
- [ ] **Tx Status** - Real-time transaction tracking
- [ ] **2+ Commits** - Meaningful git commits
- [ ] **Multi-Wallet** - Freighter + Albedo
- [ ] **Real-Time Events** - Event subscriptions
- [ ] **Public Repo** - GitHub repository
- [ ] **README** - Full documentation
- [ ] **Screenshot** - Wallet options visible
- [ ] **Contract Address** - Documented
- [ ] **Tx Hash** - Verifiable on Stellar Explorer

## 🎯 Development Phases

### Phase 1: Smart Contract (Days 1-3)
**Goal:** Working contract on testnet

```rust
// You'll build:
mint(name, desc, uri) -> token_id
get_nft(token_id) -> NFTMetadata
```

**Tasks:** 1.1 → 1.2 → 1.3 → 1.4 → 1.5

**Output:** 
- Deployed contract address
- Transaction hash
- Contract tests passing

### Phase 2: Frontend Foundation (Days 4-7)
**Goal:** Service layer ready

```javascript
// You'll build:
walletService.js    // Connect wallets
contractService.js  // Call contract
eventService.js     // Listen to events
```

**Tasks:** 2.1 → 2.2 → 2.3 → 2.4 → 2.5 → 2.6

**Output:**
- Services working
- Configuration complete

### Phase 3: UI Components (Days 8-12)
**Goal:** Working interface

```jsx
// You'll build:
<WalletConnect />     // Connect UI
<NFTMintForm />       // Minting form
<TransactionStatus /> // Status display
```

**Tasks:** 3.1 → 3.2 → 3.3 → 3.4 → 3.5 → 3.6 → 3.7

**Output:**
- Full UI working
- Wallet connection
- NFT minting functional

### Phase 4: Testing (Days 13-14)
**Goal:** Tests passing

**Tasks:** 4.1 → 4.2 → 4.3

**Output:**
- Component tests
- Service tests
- Integration tests

### Phase 5: Deploy (Days 15-16)
**Goal:** Live and documented

**Tasks:** 5.1 → 5.2 → 5.3 → 5.4 → 5.5

**Output:**
- README complete
- Screenshots captured
- Live demo URL
- All requirements verified

## 🛠️ Tools You Need

### Required
- ✅ **Node.js** 18+ - [Download](https://nodejs.org/)
- ✅ **Rust** - [Install](https://rustup.rs/)
- ✅ **Stellar CLI** - [Install](https://soroban.stellar.org/docs/getting-started/setup)
- ✅ **Freighter Wallet** - [Install](https://www.freighter.app/)

### Optional
- 🔵 **Albedo Wallet** - [Install](https://albedo.link/)
- 🔵 **VS Code** - Recommended editor
- 🔵 **Rust Analyzer** - VS Code extension

## 📖 Key Concepts

### Smart Contract
```rust
// NFT structure
struct NFTMetadata {
    name: String,          // "My First NFT"
    description: String,   // "Cool NFT"
    uri: String,          // "ipfs://..."
    owner: Address,        // "GABC...XYZ"
    minted_at: u64        // 1234567890
}
```

### Frontend Flow
```
1. User clicks "Connect Wallet"
   ↓
2. Selects Freighter/Albedo
   ↓
3. Fills NFT form
   ↓
4. Clicks "Mint NFT"
   ↓
5. Signs transaction
   ↓
6. Sees "Pending..." status
   ↓
7. Receives token ID
   ↓
8. Views on Stellar Explorer
```

### Error Handling
```javascript
try {
  await contractService.mintNFT(name, desc, uri);
} catch (error) {
  if (error instanceof WalletConnectionError) {
    // "Please connect wallet"
  } else if (error instanceof InsufficientBalanceError) {
    // "Insufficient XLM"
  } else if (error instanceof NetworkError) {
    // "Network timeout"
  }
}
```

## 🎓 Learning Path

### Day 1: Understanding
- Read PRD.md
- Review design.md architecture diagram
- Study hello-world contract (reference)

### Day 2-3: Contract
- Follow tasks 1.1-1.5
- Test locally
- Deploy to testnet

### Day 4-5: Services
- Build wallet service
- Build contract service
- Test wallet connection

### Day 6-10: UI
- Create components
- Wire up to services
- Test minting flow

### Day 11-12: Testing
- Write component tests
- Write service tests
- Fix bugs

### Day 13-14: Documentation
- Write README
- Capture screenshots
- Deploy to Vercel

### Day 15: Verification
- Check all requirements
- Test everything
- Submit project

## 💡 Pro Tips

1. **Start Small** - Get contract working first
2. **Test Early** - Don't wait until the end
3. **Use References** - Study hello-world contract
4. **Read Errors** - Error messages help debug
5. **Commit Often** - Make meaningful commits
6. **Ask Questions** - Use Stellar Discord
7. **Document Now** - Update README as you build

## 🆘 Common Issues

### "Contract not found"
- Check contract address in config.js
- Verify deployment on Stellar Explorer

### "Wallet not connecting"
- Install Freighter/Albedo extension
- Check browser console for errors
- Try refreshing page

### "Transaction failed"
- Check XLM balance (need testnet funds)
- Use [Testnet Faucet](https://laboratory.stellar.org/#account-creator?network=test)
- Verify contract is deployed

### "Build errors"
- Run `rustup update`
- Check Rust version
- Verify soroban-cli installed

## 📚 Essential Resources

**Stellar/Soroban:**
- [Soroban Docs](https://soroban.stellar.org/)
- [Stellar Docs](https://developers.stellar.org/)
- [Example Contracts](https://github.com/stellar/soroban-examples)

**React:**
- [React Docs](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

**Tools:**
- [Stellar Explorer](https://stellar.expert/)
- [Stellar Laboratory](https://laboratory.stellar.org/)
- [Testnet Faucet](https://laboratory.stellar.org/#account-creator?network=test)

**Community:**
- [Stellar Discord](https://discord.gg/stellar)
- [Soroban Discord Channel](https://discord.gg/stellar)

## ✅ Next Steps

1. **Right Now:**
   ```bash
   # Open your task list
   code .kiro/specs/nft-minter/tasks.md
   ```

2. **Start Task 1.1:**
   - Create contract folder structure
   - Set up Cargo.toml
   - Create basic files

3. **Follow the Guide:**
   - Complete each task
   - Check acceptance criteria
   - Move to next task

4. **Track Progress:**
   - Update task status in tasks.md
   - Make git commits
   - Update README

## 🎉 Success!

When you finish, you'll have:
- ✅ Working NFT minter on Stellar testnet
- ✅ Multi-wallet support
- ✅ Real-time transaction tracking
- ✅ Comprehensive error handling
- ✅ Live demo (optional)
- ✅ Complete documentation
- ✅ Level 2.3 certification ready!

---

**Ready?** Open `tasks.md` and start with Task 1.1! 🚀

**Questions?** Everything you need is in the spec documents! 📚

**Good luck!** You've got this! 💪
