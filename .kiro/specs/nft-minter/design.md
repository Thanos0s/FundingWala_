# Design Document

## Introduction

This document outlines the technical design for the NFT Minter application - a decentralized application built on Stellar blockchain testnet. The application enables users to mint NFTs with metadata through a React frontend that interacts with Soroban smart contracts, supporting multiple wallet providers and real-time transaction tracking.

## High-Level Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Application                      │
│                      (React + Vite)                         │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │   Wallet     │  │  Metadata    │  │  Transaction    │  │
│  │   Manager    │  │   Handler    │  │    Monitor      │  │
│  └──────────────┘  └──────────────┘  └─────────────────┘  │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │   Contract   │  │    Error     │  │     Event       │  │
│  │   Caller     │  │   Handler    │  │    Listener     │  │
│  └──────────────┘  └──────────────┘  └─────────────────┘  │
└──────────────┬───────────────────────────────────┬──────────┘
               │                                   │
               │  Stellar SDK / Soroban RPC       │
               │                                   │
┌──────────────▼───────────────────────────────────▼──────────┐
│                  Stellar Testnet Network                     │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────┐   │
│  │        NFT Minter Smart Contract (Soroban)          │   │
│  │  - mint(name, desc, uri) -> token_id                │   │
│  │  - get_nft(token_id) -> NFTMetadata                 │   │
│  │  - get_owner(token_id) -> Address                   │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
               ▲                                   ▲
               │                                   │
        ┌──────┴──────┐                    ┌──────┴──────┐
        │  Freighter  │                    │   Albedo    │
        │   Wallet    │                    │   Wallet    │
        └─────────────┘                    └─────────────┘
```

### Data Flow

1. **Wallet Connection Flow**
   - User clicks wallet provider button
   - Wallet Manager detects installed providers
   - User authorizes connection via wallet extension
   - Public key stored in session storage
   - Balance fetched and displayed

2. **NFT Minting Flow**
   - User inputs metadata (name, description, URI)
   - Metadata Handler validates inputs
   - User clicks mint button
   - Contract Caller builds transaction
   - Wallet Provider signs transaction
   - Transaction submitted to Stellar testnet
   - Transaction Monitor polls for status
   - Event Listener receives mint event
   - UI updates with token ID and transaction hash

## Smart Contract Design

### Contract Structure (Soroban/Rust)

**File:** `my-react-app/Anonymous/contracts/nft-minter/src/lib.rs`


```rust
// Data Structures
#[contracttype]
pub struct NFTMetadata {
    pub name: String,
    pub description: String,
    pub uri: String,
    pub owner: Address,
    pub minted_at: u64,
}

#[contracttype]
pub enum DataKey {
    TokenCounter,
    NFT(u64),           // token_id -> NFTMetadata
    Owner(u64),         // token_id -> Address
}

// Contract Methods
#[contract]
pub struct NFTMinterContract;

#[contractimpl]
impl NFTMinterContract {
    /// Mint a new NFT with metadata
    /// Returns: token_id
    pub fn mint(
        env: Env,
        caller: Address,
        name: String,
        description: String,
        uri: String
    ) -> u64;
    
    /// Get NFT metadata by token ID
    /// Returns: NFTMetadata or Error
    pub fn get_nft(env: Env, token_id: u64) -> Result<NFTMetadata, Error>;
    
    /// Get owner address of an NFT
    /// Returns: Address or Error
    pub fn get_owner(env: Env, token_id: u64) -> Result<Address, Error>;
    
    /// Get total number of minted NFTs
    pub fn get_total_supply(env: Env) -> u64;
}
```

### Contract Events

```rust
#[contracttype]
pub enum EventTopic {
    Mint,
    Transfer,
}

// Event emitted when NFT is minted
pub fn emit_mint_event(env: &Env, token_id: u64, owner: Address) {
    env.events().publish((EventTopic::Mint,), (token_id, owner));
}
```

### Error Types

```rust
#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    NFTNotFound = 1,
    InvalidMetadata = 2,
    Unauthorized = 3,
}
```

## Frontend Architecture

### Component Structure

**File Structure:**
```
my-react-app/src/
├── components/
│   ├── WalletConnect.jsx       # Wallet connection UI
│   ├── NFTMintForm.jsx         # Mint form with inputs
│   ├── TransactionStatus.jsx   # Transaction tracking display
│   ├── NFTDisplay.jsx          # Display minted NFT info
│   ├── ErrorNotification.jsx   # Error message display
│   └── LoadingSpinner.jsx      # Loading indicators
├── services/
│   ├── walletService.js        # Wallet integration logic
│   ├── contractService.js      # Contract interaction
│   ├── eventService.js         # Event subscription
│   └── validationService.js    # Input validation
├── hooks/
│   ├── useWallet.js            # Wallet state management
│   ├── useContract.js          # Contract calls
│   ├── useTransaction.js       # Transaction status
│   └── useEventListener.js     # Real-time events
├── utils/
│   ├── errorHandler.js         # Error categorization
│   ├── formatters.js           # Data formatting
│   └── constants.js            # Config constants
├── config.js                   # Contract address, network config
└── App.js                      # Main application component
```

### Core Components Design

#### 1. WalletConnect Component

```javascript
// WalletConnect.jsx
export const WalletConnect = () => {
  const { connected, address, balance, connect, disconnect } = useWallet();
  const [showProviders, setShowProviders] = useState(false);
  
  return (
    <div className="wallet-connect">
      {!connected ? (
        <>
          <button onClick={() => setShowProviders(true)}>
            Connect Wallet
          </button>
          {showProviders && (
            <WalletProviderModal
              providers={['freighter', 'albedo']}
              onSelect={connect}
            />
          )}
        </>
      ) : (
        <div className="wallet-info">
          <span>{formatAddress(address)}</span>
          <span>{balance} XLM</span>
          <button onClick={disconnect}>Disconnect</button>
        </div>
      )}
    </div>
  );
};
```

#### 2. NFTMintForm Component

```javascript
// NFTMintForm.jsx
export const NFTMintForm = () => {
  const { mintNFT, loading } = useContract();
  const [metadata, setMetadata] = useState({ name: '', description: '', uri: '' });
  const [errors, setErrors] = useState({});
  
  const validate = () => {
    const newErrors = {};
    if (!metadata.name || metadata.name.length > 100) {
      newErrors.name = 'Name must be 1-100 characters';
    }
    if (metadata.description.length > 500) {
      newErrors.description = 'Description must be max 500 characters';
    }
    if (!isValidURI(metadata.uri)) {
      newErrors.uri = 'Invalid URI format';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async () => {
    if (!validate()) return;
    await mintNFT(metadata);
  };
  
  return (
    <form className="nft-mint-form">
      <input
        type="text"
        placeholder="NFT Name"
        value={metadata.name}
        onChange={(e) => setMetadata({...metadata, name: e.target.value})}
      />
      {errors.name && <span className="error">{errors.name}</span>}
      
      <textarea
        placeholder="Description"
        value={metadata.description}
        onChange={(e) => setMetadata({...metadata, description: e.target.value})}
      />
      {errors.description && <span className="error">{errors.description}</span>}
      
      <input
        type="text"
        placeholder="Content URI"
        value={metadata.uri}
        onChange={(e) => setMetadata({...metadata, uri: e.target.value})}
      />
      {errors.uri && <span className="error">{errors.uri}</span>}
      
      <button 
        onClick={handleSubmit} 
        disabled={loading || Object.keys(errors).length > 0}
      >
        {loading ? <LoadingSpinner /> : 'Mint NFT'}
      </button>
    </form>
  );
};
```


#### 3. TransactionStatus Component

```javascript
// TransactionStatus.jsx
export const TransactionStatus = () => {
  const { txHash, status, error } = useTransaction();
  
  const getStatusColor = () => {
    switch(status) {
      case 'pending': return 'yellow';
      case 'confirmed': return 'green';
      case 'failed': return 'red';
      default: return 'gray';
    }
  };
  
  return (
    <div className={`tx-status ${getStatusColor()}`}>
      {status === 'pending' && (
        <>
          <LoadingSpinner />
          <span>Transaction pending...</span>
        </>
      )}
      {status === 'confirmed' && (
        <>
          <span>✓ Transaction confirmed!</span>
          <a 
            href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View on Stellar Explorer
          </a>
          <button onClick={() => copyToClipboard(txHash)}>
            Copy Hash
          </button>
        </>
      )}
      {status === 'failed' && (
        <>
          <span>✗ Transaction failed</span>
          <span>{error}</span>
        </>
      )}
    </div>
  );
};
```

### Service Layer Design

#### Wallet Service

```javascript
// services/walletService.js
export class WalletService {
  constructor() {
    this.provider = null;
    this.publicKey = null;
  }
  
  async detectProviders() {
    const providers = [];
    if (window.freighterApi) providers.push('freighter');
    if (window.albedo) providers.push('albedo');
    return providers;
  }
  
  async connectFreighter() {
    try {
      const { publicKey } = await window.freighterApi.getPublicKey();
      this.provider = 'freighter';
      this.publicKey = publicKey;
      sessionStorage.setItem('wallet_provider', 'freighter');
      sessionStorage.setItem('wallet_address', publicKey);
      return { publicKey };
    } catch (error) {
      throw new WalletConnectionError('Freighter connection failed', error);
    }
  }
  
  async connectAlbedo() {
    try {
      const result = await window.albedo.publicKey();
      this.provider = 'albedo';
      this.publicKey = result.pubkey;
      sessionStorage.setItem('wallet_provider', 'albedo');
      sessionStorage.setItem('wallet_address', result.pubkey);
      return { publicKey: result.pubkey };
    } catch (error) {
      throw new WalletConnectionError('Albedo connection failed', error);
    }
  }
  
  async getBalance(publicKey) {
    const server = new SorobanRpc.Server(SOROBAN_RPC_URL);
    const account = await server.getAccount(publicKey);
    return account.balances.find(b => b.asset_type === 'native').balance;
  }
  
  disconnect() {
    this.provider = null;
    this.publicKey = null;
    sessionStorage.removeItem('wallet_provider');
    sessionStorage.removeItem('wallet_address');
  }
}
```

#### Contract Service

```javascript
// services/contractService.js
import * as SorobanClient from '@stellar/stellar-sdk';
import { CONTRACT_ADDRESS, NETWORK_PASSPHRASE } from '../config';

export class ContractService {
  constructor(walletService) {
    this.wallet = walletService;
    this.contract = new SorobanClient.Contract(CONTRACT_ADDRESS);
  }
  
  async mintNFT(name, description, uri) {
    try {
      const account = await this.getAccount();
      
      // Build transaction
      const tx = new SorobanClient.TransactionBuilder(account, {
        fee: SorobanClient.BASE_FEE,
        networkPassphrase: NETWORK_PASSPHRASE
      })
        .addOperation(
          this.contract.call(
            'mint',
            SorobanClient.Address.fromString(this.wallet.publicKey),
            SorobanClient.nativeToScVal(name, { type: 'string' }),
            SorobanClient.nativeToScVal(description, { type: 'string' }),
            SorobanClient.nativeToScVal(uri, { type: 'string' })
          )
        )
        .setTimeout(30)
        .build();
      
      // Simulate to get fee
      const simulated = await this.simulateTransaction(tx);
      
      // Sign with wallet
      const signedTx = await this.signTransaction(tx);
      
      // Submit
      const result = await this.submitTransaction(signedTx);
      
      return {
        tokenId: this.parseTokenId(result),
        txHash: result.hash
      };
    } catch (error) {
      throw this.handleContractError(error);
    }
  }
  
  async getNFT(tokenId) {
    try {
      const result = await this.contract.call('get_nft', 
        SorobanClient.nativeToScVal(tokenId, { type: 'u64' })
      );
      return this.parseNFTMetadata(result);
    } catch (error) {
      if (error.message.includes('NFTNotFound')) {
        throw new NFTNotFoundError(tokenId);
      }
      throw error;
    }
  }
  
  async estimateFee(operation) {
    const account = await this.getAccount();
    const tx = new SorobanClient.TransactionBuilder(account, {
      fee: SorobanClient.BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE
    })
      .addOperation(operation)
      .setTimeout(30)
      .build();
    
    const simulated = await this.simulateTransaction(tx);
    return simulated.minResourceFee;
  }
  
  handleContractError(error) {
    if (error.message.includes('insufficient balance')) {
      return new InsufficientBalanceError();
    }
    if (error.message.includes('invalid')) {
      return new InvalidParametersError();
    }
    return new ContractExecutionError(error.message);
  }
}
```

#### Event Service

```javascript
// services/eventService.js
import { SorobanRpc } from '@stellar/stellar-sdk';
import { SOROBAN_RPC_URL, CONTRACT_ADDRESS } from '../config';

export class EventService {
  constructor() {
    this.server = new SorobanRpc.Server(SOROBAN_RPC_URL);
    this.listeners = new Map();
    this.pollingInterval = null;
  }
  
  subscribeToMintEvents(callback) {
    const listenerId = Date.now().toString();
    this.listeners.set(listenerId, {
      eventType: 'Mint',
      callback
    });
    
    if (!this.pollingInterval) {
      this.startPolling();
    }
    
    return listenerId;
  }
  
  unsubscribe(listenerId) {
    this.listeners.delete(listenerId);
    if (this.listeners.size === 0) {
      this.stopPolling();
    }
  }
  
  async startPolling() {
    let lastLedger = await this.getCurrentLedger();
    
    this.pollingInterval = setInterval(async () => {
      try {
        const events = await this.server.getEvents({
          startLedger: lastLedger,
          filters: [
            {
              type: 'contract',
              contractIds: [CONTRACT_ADDRESS]
            }
          ]
        });
        
        events.forEach(event => {
          this.listeners.forEach(listener => {
            if (this.matchesEventType(event, listener.eventType)) {
              listener.callback(this.parseEvent(event));
            }
          });
        });
        
        lastLedger = await this.getCurrentLedger();
      } catch (error) {
        console.error('Event polling error:', error);
      }
    }, 2000); // Poll every 2 seconds
  }
  
  stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }
}
```

## Data Models

### NFT Metadata Structure

```typescript
interface NFTMetadata {
  name: string;          // 1-100 characters
  description: string;   // 0-500 characters
  uri: string;           // Valid URI format
  owner: string;         // Stellar public key
  minted_at: number;     // Unix timestamp
}
```

### Transaction State

```typescript
interface TransactionState {
  hash: string | null;
  status: 'idle' | 'pending' | 'confirmed' | 'failed';
  error: string | null;
  tokenId: number | null;
}
```

### Wallet State

```typescript
interface WalletState {
  connected: boolean;
  provider: 'freighter' | 'albedo' | null;
  address: string | null;
  balance: string | null;
}
```

## Error Handling Strategy

### Error Types


```javascript
// utils/errorHandler.js

export class AppError extends Error {
  constructor(message, type, details = null) {
    super(message);
    this.type = type;
    this.details = details;
  }
}

// 1. Wallet Connection Errors
export class WalletConnectionError extends AppError {
  constructor(message, details) {
    super(message, 'WALLET_CONNECTION', details);
  }
}

export class WalletNotFoundError extends WalletConnectionError {
  constructor(provider) {
    super(
      `Wallet provider not found. Please install ${provider}`,
      { provider }
    );
  }
}

export class WalletRejectionError extends WalletConnectionError {
  constructor() {
    super('Wallet connection was rejected by user', null);
  }
}

// 2. Contract Execution Errors
export class ContractExecutionError extends AppError {
  constructor(message, details) {
    super(message, 'CONTRACT_EXECUTION', details);
  }
}

export class InsufficientBalanceError extends ContractExecutionError {
  constructor() {
    super('Insufficient XLM balance to complete transaction', null);
  }
}

export class InvalidParametersError extends ContractExecutionError {
  constructor(fieldErrors) {
    super('Invalid input parameters', fieldErrors);
  }
}

export class NFTNotFoundError extends ContractExecutionError {
  constructor(tokenId) {
    super(`NFT with ID ${tokenId} does not exist`, { tokenId });
  }
}

// 3. Network Errors
export class NetworkError extends AppError {
  constructor(message, details) {
    super(message, 'NETWORK', details);
  }
}

export class NetworkTimeoutError extends NetworkError {
  constructor() {
    super('Network request timed out. Please check your connection', null);
  }
}

export class RPCError extends NetworkError {
  constructor(message) {
    super(`RPC error: ${message}`, { message });
  }
}

// Error Handler Utility
export const handleError = (error) => {
  console.error('Application error:', error);
  
  if (error instanceof AppError) {
    return {
      message: error.message,
      type: error.type,
      details: error.details
    };
  }
  
  // Unknown errors
  return {
    message: 'An unexpected error occurred. Please try again.',
    type: 'UNKNOWN',
    details: error.message
  };
};
```

### Error Display Strategy

- Errors displayed in toast notifications (auto-dismiss after 5 seconds)
- Critical errors displayed in modal dialogs (require user acknowledgment)
- Field-level validation errors displayed inline below inputs
- Network errors show retry button
- Console logging for all errors with full stack traces

## Configuration

### Environment Variables

```javascript
// config.js
export const CONFIG = {
  // Network
  NETWORK: 'TESTNET',
  NETWORK_PASSPHRASE: 'Test SDF Network ; September 2015',
  SOROBAN_RPC_URL: 'https://soroban-testnet.stellar.org',
  HORIZON_URL: 'https://horizon-testnet.stellar.org',
  
  // Contract
  CONTRACT_ADDRESS: process.env.REACT_APP_CONTRACT_ADDRESS || '',
  
  // Wallet Providers
  SUPPORTED_WALLETS: ['freighter', 'albedo'],
  
  // Transaction
  DEFAULT_TIMEOUT: 30,
  TRANSACTION_POLL_INTERVAL: 2000,
  
  // Validation
  MAX_NAME_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 500,
  
  // UI
  TOAST_DURATION: 5000,
  LOADING_TIMEOUT_WARNING: 30000
};
```

## Deployment Strategy

### Smart Contract Deployment


**Steps:**
1. Build contract: `cargo build --target wasm32-unknown-unknown --release`
2. Optimize WASM: `soroban contract optimize --wasm target/wasm32-unknown-unknown/release/nft_minter.wasm`
3. Deploy to testnet: `soroban contract deploy --wasm optimized.wasm --source <SECRET_KEY> --network testnet`
4. Save contract address to config.js
5. Initialize contract if needed
6. Verify deployment on Stellar Expert

### Frontend Deployment

**Vercel Deployment:**
1. Connect GitHub repository to Vercel
2. Set environment variables:
   - `REACT_APP_CONTRACT_ADDRESS`: deployed contract address
3. Configure build settings:
   - Build command: `npm run build`
   - Output directory: `build`
4. Deploy and get production URL
5. Test on production environment

**Alternative (Netlify):**
- Similar process with Netlify CLI or GitHub integration
- Environment variables set in Netlify dashboard

## Testing Strategy

### Smart Contract Tests

```rust
// contracts/nft-minter/src/test.rs
#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_mint_nft() {
        let env = Env::default();
        let contract_id = env.register_contract(None, NFTMinterContract);
        let client = NFTMinterContractClient::new(&env, &contract_id);
        
        let caller = Address::generate(&env);
        let token_id = client.mint(
            &caller,
            &String::from_str(&env, "Test NFT"),
            &String::from_str(&env, "Description"),
            &String::from_str(&env, "https://example.com/nft.jpg")
        );
        
        assert_eq!(token_id, 1);
    }
    
    #[test]
    fn test_get_nft() {
        // Test metadata retrieval
    }
    
    #[test]
    #[should_panic(expected = "NFTNotFound")]
    fn test_get_nonexistent_nft() {
        // Test error handling
    }
}
```

### Frontend Tests


```javascript
// __tests__/WalletConnect.test.js
import { render, screen, fireEvent } from '@testing-library/react';
import { WalletConnect } from '../components/WalletConnect';

jest.mock('../hooks/useWallet');

describe('WalletConnect', () => {
  test('displays connect button when not connected', () => {
    useWallet.mockReturnValue({ connected: false });
    render(<WalletConnect />);
    expect(screen.getByText('Connect Wallet')).toBeInTheDocument();
  });
  
  test('displays wallet info when connected', () => {
    useWallet.mockReturnValue({
      connected: true,
      address: 'GABC...XYZ',
      balance: '100.0000000'
    });
    render(<WalletConnect />);
    expect(screen.getByText(/GABC/)).toBeInTheDocument();
  });
});

// __tests__/NFTMintForm.test.js
describe('NFTMintForm', () => {
  test('validates name field', async () => {
    render(<NFTMintForm />);
    const nameInput = screen.getByPlaceholderText('NFT Name');
    fireEvent.blur(nameInput);
    expect(await screen.findByText(/Name must be/)).toBeInTheDocument();
  });
  
  test('disables mint button when form invalid', () => {
    render(<NFTMintForm />);
    const mintButton = screen.getByText('Mint NFT');
    expect(mintButton).toBeDisabled();
  });
});
```

## Security Considerations

1. **Input Validation**
   - Client-side validation for UX
   - Contract-side validation for security
   - Sanitize all user inputs

2. **Transaction Safety**
   - Fee estimation before submission
   - User confirmation for all transactions
   - Clear transaction status feedback

3. **Wallet Security**
   - Never request or store private keys
   - Use session storage (cleared on disconnect)
   - All sensitive operations require wallet signatures

4. **Error Information**
   - Display user-friendly messages
   - Log detailed errors to console only
   - Never expose sensitive data in errors

## Performance Optimization

1. **Component Optimization**
   - Use React.memo for expensive components
   - Lazy load heavy components
   - Debounce input validation

2. **Network Optimization**
   - Cache contract interface
   - Batch RPC requests where possible
   - Implement request timeouts

3. **Event Handling**
   - Efficient polling interval (2 seconds)
   - Cleanup subscriptions on unmount
   - Throttle UI updates


## Folder Structure

```
Stealler_02/
├── my-react-app/
│   ├── Anonymous/
│   │   └── contracts/
│   │       ├── hello-world/          # Existing reference contract
│   │       └── nft-minter/           # New NFT Minter contract
│   │           ├── src/
│   │           │   ├── lib.rs        # Main contract code
│   │           │   └── test.rs       # Contract tests
│   │           ├── Cargo.toml
│   │           └── Makefile
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── src/
│   │   ├── components/
│   │   │   ├── WalletConnect.jsx
│   │   │   ├── NFTMintForm.jsx
│   │   │   ├── TransactionStatus.jsx
│   │   │   ├── NFTDisplay.jsx
│   │   │   ├── ErrorNotification.jsx
│   │   │   └── LoadingSpinner.jsx
│   │   ├── services/
│   │   │   ├── walletService.js
│   │   │   ├── contractService.js
│   │   │   ├── eventService.js
│   │   │   └── validationService.js
│   │   ├── hooks/
│   │   │   ├── useWallet.js
│   │   │   ├── useContract.js
│   │   │   ├── useTransaction.js
│   │   │   └── useEventListener.js
│   │   ├── utils/
│   │   │   ├── errorHandler.js
│   │   │   ├── formatters.js
│   │   │   └── constants.js
│   │   ├── __tests__/
│   │   │   ├── WalletConnect.test.js
│   │   │   ├── NFTMintForm.test.js
│   │   │   └── TransactionStatus.test.js
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── config.js
│   │   ├── index.js
│   │   └── index.css
│   ├── SCREENSHOTS/
│   │   └── wallet-options.png        # Screenshot of wallet selection
│   ├── package.json
│   ├── tailwind.config.js
│   └── README.md
├── .kiro/
│   └── specs/
│       └── nft-minter/
│           ├── .config.kiro
│           ├── requirements.md
│           ├── design.md
│           └── tasks.md
└── README.md                          # Root documentation
```

## API Interface Contracts

### Contract → Frontend

**Mint Function:**
```
Input: (caller: Address, name: String, description: String, uri: String)
Output: u64 (token_id)
Events: Mint(token_id, owner)
```

**Get NFT Function:**
```
Input: (token_id: u64)
Output: NFTMetadata { name, description, uri, owner, minted_at }
Error: NFTNotFound
```

### Frontend → Wallet

**Connection Request:**
```javascript
// Freighter
window.freighterApi.getPublicKey() => { publicKey: string }

// Albedo
window.albedo.publicKey() => { pubkey: string }
```

**Transaction Signing:**
```javascript
// Freighter
window.freighterApi.signTransaction(xdr, network) => { signedXDR: string }

// Albedo
window.albedo.tx({ xdr, network }) => { signed_envelope_xdr: string }
```

## Conclusion

This design provides a comprehensive architecture for the NFT Minter application that meets all Level 2.3 requirements. The modular component structure, clear separation of concerns, and robust error handling ensure a maintainable and user-friendly application. The design supports multi-wallet integration, real-time transaction tracking, and comprehensive error handling across wallet, contract, and network layers.
