# NFT Minter - Application Startup Guide

## ✅ Dependency Installation Complete!

All npm packages have been successfully installed. You can now run the frontend application locally.

## 🚀 Quick Start

### Option 1: Start Development Server (Automatic)

```bash
cd my-react-app
npm start
```

**What will happen:**
1. React development server will start
2. Browser will open automatically at `https://localhost:3000`
3. HTTPS is required for wallet extensions to work
4. You'll see the NFT Minter UI

### Option 2: Manual Build & Run

```bash
cd my-react-app

# Build for production
npm run build

# This creates optimized files in the 'build' folder
```

## 🎨 What You'll See

When you start the app, you'll see:

```
┌─────────────────────────────────┐
│   NFT Minter - Stellar       │
│   Blockchain                 │
├─────────────────────────────────┤
│                                 │
│  ☑ Wallet (Left Sidebar)       │
│    • Connect Wallet button     │
│    • Shows: Address, Balance   │
│    • Event Activity log        │
│                                 │
│  ☑ Main Content (Center)       │
│    • Tabs: Mint NFT / Query NFT│
│    • Mint Form or Query UI     │
│    • Transaction Status        │
│                                 │
│  ☑ Network Info (Bottom Card)  │
│    • Network: Stellar Testnet  │
│    • Status: Not Connected     │
│    • Contract Address          │
│                                 │
└─────────────────────────────────┘
```

## 🔧 Features Available Now

### 1. **Wallet Connection UI**
- Button to connect wallet
- Shows installed wallet providers
- Installation instructions for missing wallets
- Display connected address & balance

### 2. **NFT Minting Form**
- Input fields: Name, Description, URI
- Real-time validation
- Character counters
- Error messages
- Disabled until wallet connected

### 3. **NFT Query Interface**
- Search by token ID
- Display NFT metadata
- Show owner information

### 4. **Transaction Tracking**
- Real-time status display
- Link to Stellar Explorer
- Copy transaction hash

### 5. **Error Handling**
- Toast notifications
- Clear error messages
- Auto-dismiss after 5 seconds

## ⚠️ Important Notes

### What Won't Work Yet (Requires Contract Deployment)

❌ **Actual wallet connection** - Needs contract address configured
❌ **Minting NFTs** - Needs deployed contract
❌ **Transaction submission** - Needs contract and wallet connection
❌ **Event reception** - Needs active contract

### Why?

The contract needs to be:
1. Built on a Linux/Mac/WSL2 system
2. Deployed to Stellar testnet
3. Contract address added to `src/config.js`

### What WILL Work

✅ **UI/UX Testing** - All buttons, forms, and navigation
✅ **Form Validation** - Input validation in real-time
✅ **Component Display** - All UI elements render correctly
✅ **Error Messages** - See how errors look and behave
✅ **Layout & Responsiveness** - Test on different screen sizes

## 📱 Testing the UI

Without wallet connection, you can:

1. **Click "Connect Wallet"** - See wallet provider options
2. **Try minting without connecting** - See warning message
3. **Fill mint form** - See validation in action
4. **Switch between tabs** - Navigate Mint/Query interface
5. **Trigger error scenarios** - See error toast notifications
6. **Test responsive design** - Resize browser window

## 🛠️ Troubleshooting

### Issue: "Cannot find module '@stellar/stellar-sdk'"

**Solution:**
```bash
cd my-react-app
npm install
npm start
```

### Issue: HTTPS certificate warning

**Expected behavior** - Localhost HTTPS uses self-signed cert

**Solution:** Click "Advanced" and proceed (safe for local testing)

### Issue: Port 3000 already in use

**Solution:**
```bash
# Kill process on port 3000
Get-Process | Where-Object {$_.ProcessName -like "*node*"} | Stop-Process -Force

# Then run npm start again
npm start
```

### Issue: "Wallet providers not detected"

**Expected** - Freighter/Albedo extensions must be installed in browser

**To test:**
1. Install [Freighter](https://www.freighter.app/)
2. Create test account on testnet
3. Refresh NFT Minter app
4. Wallet option will appear

## 📊 Development Workflow

### Current Status

```
Smart Contract    : ✅ Written, needs build environment
Frontend Code     : ✅ Complete & running
Styling          : ✅ Tailwind CSS configured
Components       : ✅ All 6 components ready
Services         : ✅ All 4 services implemented
Hooks            : ✅ All 4 custom hooks ready
Configuration    : ✅ Ready for contract address
```

### Next Steps (After Contract Deployment)

1. Get deployed contract address
2. Update `src/config.js` with CONTRACT_ADDRESS
3. Install Freighter wallet in browser
4. Get testnet XLM from faucet
5. Refresh app and test end-to-end

## 💻 Available Commands

```bash
# Start development server (uses HTTPS)
npm start

# Build for production
npm run build

# Run tests
npm test

# Eject configuration (⚠️ not reversible)
npm run eject
```

## 🎯 Next Milestone: Contract Deployment

To make the app fully functional:

1. **Build contract** (needs Linux/Mac/WSL2)
   ```bash
   cd Anonymous/contracts/nft-minter
   cargo build --target wasm32-unknown-unknown --release
   ```

2. **Deploy to testnet**
   ```bash
   soroban contract deploy --wasm optimized.wasm --network testnet
   ```

3. **Update config**
   ```javascript
   CONTRACT_ADDRESS: 'CA...' // From deployment
   ```

4. **Restart app**
   ```bash
   npm start
   ```

## 📚 File Locations

| File | Purpose |
|------|---------|
| `src/App.js` | Main application component |
| `src/components/` | 6 React components |
| `src/services/` | 4 service modules |
| `src/hooks/` | 4 custom hooks |
| `src/config.js` | Configuration (update CONTRACT_ADDRESS here) |
| `src/utils/errorHandler.js` | Error handling |

## ✨ What's Working

- ✅ Responsive UI with Tailwind CSS
- ✅ Multi-tab navigation
- ✅ Form validation
- ✅ Error notifications
- ✅ Loading states
- ✅ Wallet connection UI
- ✅ Event activity display
- ✅ Network information display

## 🎉 You're Ready to Test!

Run `npm start` and explore the NFT Minter interface!

All code is production-ready and waiting for contract integration.

---

**Questions?** Check the specification documents in `.kiro/specs/nft-minter/`
