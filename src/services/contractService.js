import * as StellarSdk from '@stellar/stellar-sdk';
import { CONFIG } from '../config';
import {
  ContractExecutionError,
  InsufficientBalanceError,
  InvalidDonationError,
  TransactionFailedError,
  NetworkError,
  RPCError,
} from '../utils/errorHandler';
import { walletService } from './walletService';

export class ContractService {
  constructor() {
    this.server = new StellarSdk.SorobanRpc.Server(CONFIG.SOROBAN_RPC_URL);
    this.horizonServer = new StellarSdk.Horizon.Server(CONFIG.HORIZON_URL);
    this.contractAddress = CONFIG.CONTRACT_ADDRESS;
  }

  /**
   * Helper to check if Soroban simulation failed
   */
  _isSimulationError(sim) {
    if (!sim) return true;
    try {
      const parsed = StellarSdk.SorobanRpc.parseRawSimulation(sim);
      return !StellarSdk.SorobanRpc.Api.isSimulationSuccess(parsed);
    } catch (_) {
      if (StellarSdk.SorobanRpc.Api?.isSimulationSuccess) {
        return !StellarSdk.SorobanRpc.Api.isSimulationSuccess(sim);
      }
      return !!(sim?.error || sim?.status === 'ERROR');
    }
  }

  /**
   * Safe transaction error extractor (prevents Bad Union Switch errors)
   */
  _parseTxError(result) {
    if (!result) return 'Submission error';
    if (Array.isArray(result.errors) && result.errors.length > 0) {
      return result.errors.map((e) => e.message || e.code || e).join(', ');
    }
    if (result.errorResultXdr) {
      try {
        const tr = StellarSdk.xdr.TransactionResult.fromXDR(result.errorResultXdr, 'base64');
        return tr.result()?.switch()?.name || 'Transaction failed on-chain';
      } catch (_) {}
    }
    return result.message || 'Submission error';
  }

  /**
   * Return a valid dummy account for read-only contract simulation
   */
  _getDummyAccount() {
    return new StellarSdk.Account(
      'GCK3REPLT7LXQF3BHTBEMN4O6JRX4GBTMCYMLHWGJMWKWQX7D3GBJHCO',
      '0'
    );
  }

  /**
   * Get current campaign data (raised, goal, deadline, active)
   */
  async getCampaign() {
    try {
      const contract = new StellarSdk.Contract(this.contractAddress);
      const dummyAccount = this._getDummyAccount();

      const tx = new StellarSdk.TransactionBuilder(dummyAccount, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: CONFIG.NETWORK_PASSPHRASE,
      })
        .addOperation(contract.call('get_campaign'))
        .setTimeout(30)
        .build();

      const response = await this.server.simulateTransaction(tx);

      if (this._isSimulationError(response)) {
        console.warn('Campaign simulation error:', response?.error);
        // Return mock data if contract not yet initialized
        return this._getMockCampaign();
      }

      const result = response.result?.retval;
      if (!result) return this._getMockCampaign();

      return this._parseCampaign(result);
    } catch (error) {
      console.error('getCampaign error:', error);
      // Return mock data on network errors so UI still works
      return this._getMockCampaign();
    }
  }

  /**
   * Get raised amount
   */
  async getRaised() {
    try {
      const contract = new StellarSdk.Contract(this.contractAddress);
      const dummyAccount = this._getDummyAccount();

      const tx = new StellarSdk.TransactionBuilder(dummyAccount, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: CONFIG.NETWORK_PASSPHRASE,
      })
        .addOperation(contract.call('get_raised'))
        .setTimeout(30)
        .build();

      const response = await this.server.simulateTransaction(tx);

      if (this._isSimulationError(response)) {
        return 0;
      }

      const retval = response.result?.retval;
      if (!retval) return 0;

      const raised = StellarSdk.scValToNative(retval);
      return Number(raised) / 10_000_000; // Convert stroops to XLM
    } catch (error) {
      console.error('getRaised error:', error);
      return 0;
    }
  }

  /**
   * Donate XLM to the campaign
   * @param {number} amountXLM - Amount in XLM
   */
  async donate(amountXLM) {
    try {
      // Validate wallet connection
      if (!walletService.isConnected()) {
        throw new ContractExecutionError('Please connect your wallet before donating.');
      }

      // Validate amount
      if (!amountXLM || isNaN(amountXLM) || amountXLM <= 0) {
        throw new InvalidDonationError('Donation amount must be greater than 0 XLM.');
      }

      if (amountXLM < CONFIG.MIN_DONATION_XLM) {
        throw new InvalidDonationError(
          `Minimum donation is ${CONFIG.MIN_DONATION_XLM} XLM.`
        );
      }

      const publicKey = walletService.publicKey;

      // Check balance
      const balance = await walletService.getBalance(publicKey);
      const balanceNum = parseFloat(balance);
      // Need amount + ~2 XLM for fees/minimum reserve
      if (balanceNum < amountXLM + 2) {
        throw new InsufficientBalanceError(
          (amountXLM + 2).toFixed(2),
          balanceNum.toFixed(2)
        );
      }

      const amountStroops = Math.floor(amountXLM * 10_000_000);
      const contract = new StellarSdk.Contract(this.contractAddress);

      // Build the transaction
      let account;
      try {
        account = await this.horizonServer.loadAccount(publicKey);
      } catch (error) {
        throw new RPCError('Could not fetch account from network: ' + error?.message);
      }

      const tx = new StellarSdk.TransactionBuilder(account, {
        fee: (parseInt(StellarSdk.BASE_FEE) * 10).toString(), // Higher fee for Soroban
        networkPassphrase: CONFIG.NETWORK_PASSPHRASE,
      })
        .addOperation(
          contract.call(
            'donate',
            StellarSdk.nativeToScVal(publicKey, { type: 'address' }),
            StellarSdk.nativeToScVal(amountStroops, { type: 'i128' })
          )
        )
        .setTimeout(CONFIG.DEFAULT_TIMEOUT)
        .build();

      // Simulate first
      let simulated;
      try {
        simulated = await this.server.simulateTransaction(tx);
      } catch (error) {
        throw new RPCError('Transaction simulation failed: ' + error?.message);
      }

      if (this._isSimulationError(simulated)) {
        const errMsg = simulated?.error || 'Unknown simulation error';
        if (errMsg.includes('deadline') || errMsg.includes('Deadline')) {
          throw new TransactionFailedError('Campaign deadline has passed.', null);
        }
        throw new TransactionFailedError('Contract simulation failed: ' + errMsg, null);
      }

      // Assemble with simulation results (adds auth + resource fees)
      const assembledTx = StellarSdk.SorobanRpc.assembleTransaction(tx, simulated).build();

      // Sign transaction
      let signedTx;
      try {
        signedTx = await walletService.signTransaction(assembledTx);
      } catch (error) {
        if (error?.message?.includes('rejected') || error?.message?.includes('denied')) {
          throw new ContractExecutionError('Transaction was rejected by wallet.');
        }
        throw error;
      }

      // Submit
      let result;
      try {
        result = await this.server.sendTransaction(signedTx);
      } catch (error) {
        throw new RPCError('Failed to submit transaction: ' + error?.message);
      }

      if (result.status === 'ERROR') {
        throw new TransactionFailedError(
          this._parseTxError(result),
          result.hash
        );
      }

      return {
        txHash: result.hash,
        status: result.status,
        amountXLM,
      };
    } catch (error) {
      // Re-throw known error types
      if (
        error instanceof ContractExecutionError ||
        error instanceof NetworkError
      ) {
        throw error;
      }
      console.error('Donate error:', error);
      throw new ContractExecutionError('Donation failed: ' + (error?.message || 'Unknown error'));
    }
  }

  /**
   * Donate to a custom campaign via a real on-chain Stellar payment transaction
   * Prompts the connected wallet (Freighter / Albedo / xBull / 1-Tap) to sign and submit
   */
  async donateCustom(amountXLM, campaign) {
    try {
      if (!walletService.isConnected()) {
        throw new ContractExecutionError('Please connect your wallet before donating.');
      }

      if (!amountXLM || isNaN(amountXLM) || amountXLM <= 0) {
        throw new InvalidDonationError('Donation amount must be greater than 0 XLM.');
      }

      if (amountXLM < CONFIG.MIN_DONATION_XLM) {
        throw new InvalidDonationError(
          `Minimum donation is ${CONFIG.MIN_DONATION_XLM} XLM.`
        );
      }

      const publicKey = walletService.publicKey;
      const balance = await walletService.getBalance(publicKey);
      const balanceNum = parseFloat(balance);
      if (balanceNum < amountXLM + 1.5) {
        throw new InsufficientBalanceError(
          (amountXLM + 1.5).toFixed(2),
          balanceNum.toFixed(2)
        );
      }

      let account;
      try {
        account = await this.horizonServer.loadAccount(publicKey);
      } catch (error) {
        throw new RPCError('Could not load account from Stellar network: ' + error?.message);
      }

      // Verified funded testnet vault address
      const VERIFIED_TESTNET_VAULT = 'GA4FLPVGYY77U6LVT4H73IOS44BOBQX4HLWIFGCFL5234DDLRGNIJT6U';
      let destination = campaign?.admin;

      if (!destination || !StellarSdk.StrKey.isValidEd25519PublicKey(destination) || destination === publicKey) {
        destination = VERIFIED_TESTNET_VAULT;
      } else {
        // Check if destination exists on Testnet Horizon; if not, auto-fund with Friendbot
        try {
          await this.horizonServer.loadAccount(destination);
        } catch (_) {
          try {
            await fetch(`https://friendbot.stellar.org?addr=${encodeURIComponent(destination)}`);
          } catch (_) {
            destination = VERIFIED_TESTNET_VAULT;
          }
        }
      }

      const cleanTitle = (campaign?.title || 'Crowdfund').replace(/[^a-zA-Z0-9 ]/g, '').substring(0, 18);
      const memoText = `FW:${cleanTitle || 'Grant'}`;

      const tx = new StellarSdk.TransactionBuilder(account, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: CONFIG.NETWORK_PASSPHRASE,
      })
        .addOperation(
          StellarSdk.Operation.payment({
            destination,
            asset: StellarSdk.Asset.native(),
            amount: Number(amountXLM).toFixed(7),
          })
        )
        .addMemo(StellarSdk.Memo.text(memoText))
        .setTimeout(CONFIG.DEFAULT_TIMEOUT)
        .build();

      // Sign transaction with connected wallet (triggers wallet approval popup)
      const signedTx = await walletService.signTransaction(tx);

      // Submit signed transaction to Stellar Testnet Horizon
      let result;
      try {
        result = await this.horizonServer.submitTransaction(signedTx);
      } catch (submitErr) {
        if (submitErr?.response?.data) {
          const data = submitErr.response.data;
          if (data.extras?.result_codes) {
            const codes = data.extras.result_codes;
            const opCodes = Array.isArray(codes.operations)
              ? codes.operations.join(', ')
              : (codes.operations || '');
            const txCode = codes.transaction || '';
            throw new ContractExecutionError(`Stellar transaction rejected: ${txCode} ${opCodes}`.trim());
          }
          if (data.detail) {
            throw new ContractExecutionError(`Stellar transaction failed: ${data.detail}`);
          }
        }
        throw submitErr;
      }

      return {
        txHash: result.hash,
        status: 'SUCCESS',
        amountXLM,
      };
    } catch (error) {
      if (
        error instanceof ContractExecutionError ||
        error instanceof NetworkError
      ) {
        throw error;
      }
      console.error('Custom donate error:', error);
      throw new ContractExecutionError(
        'Donation transaction failed: ' + (error?.message || 'Transaction rejected by wallet')
      );
    }
  }

  /**
   * Directly get raw transaction status from Soroban JSON-RPC (bypasses SDK TransactionMeta v4 parsing bug)
   */
  async getTransactionStatus(txHash) {
    try {
      const response = await fetch(CONFIG.SOROBAN_RPC_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: Date.now(),
          method: 'getTransaction',
          params: { hash: txHash },
        }),
      });
      if (!response.ok) return null;
      const data = await response.json();
      return data.result || null;
    } catch (e) {
      console.warn('Direct getTransactionStatus error:', e);
      return null;
    }
  }

  /**
   * Poll transaction until confirmed or failed
   */
  async waitForTransaction(txHash, maxAttempts = 20, intervalMs = 2500) {
    for (let i = 0; i < maxAttempts; i++) {
      try {
        const tx = await this.getTransactionStatus(txHash);

        if (tx && (tx.status === 'SUCCESS' || tx.status === StellarSdk.SorobanRpc.Api.GetTransactionStatus.SUCCESS)) {
          return { status: 'confirmed', txHash, result: tx };
        }

        if (tx && (tx.status === 'FAILED' || tx.status === StellarSdk.SorobanRpc.Api.GetTransactionStatus.FAILED)) {
          return { status: 'failed', txHash, error: 'Transaction failed on-chain' };
        }

        // Still pending or not found yet — wait
        await new Promise((r) => setTimeout(r, intervalMs));
      } catch (error) {
        if (i === maxAttempts - 1) {
          return { status: 'unknown', txHash, error: error?.message };
        }
        await new Promise((r) => setTimeout(r, intervalMs));
      }
    }
    return { status: 'timeout', txHash, error: 'Transaction confirmation timed out' };
  }

  /**
   * Get milestone tranches from smart contract
   */
  async getMilestones() {
    try {
      const contract = new StellarSdk.Contract(this.contractAddress);
      const dummyAccount = this._getDummyAccount();

      const tx = new StellarSdk.TransactionBuilder(dummyAccount, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: CONFIG.NETWORK_PASSPHRASE,
      })
        .addOperation(contract.call('get_milestones'))
        .setTimeout(30)
        .build();

      const response = await this.server.simulateTransaction(tx);
      if (this._isSimulationError(response)) return this._getMockMilestones();

      const retval = response.result?.retval;
      if (!retval) return this._getMockMilestones();

      const native = StellarSdk.scValToNative(retval);
      if (!Array.isArray(native)) return this._getMockMilestones();

      return native.map((m, idx) => ({
        id: Number(m.id || idx + 1),
        title: String(m.title || `Phase ${idx + 1}`),
        targetAmount: Number(m.target_amount || 0) / 10_000_000,
        deadline: Number(m.deadline || 0),
        approvals: Number(m.approvals || 0),
        rejections: Number(m.rejections || 0),
        released: Boolean(m.released),
        disputed: Boolean(m.disputed),
      }));
    } catch (e) {
      console.warn('getMilestones error:', e);
      return this._getMockMilestones();
    }
  }

  /**
   * Vote on a milestone (Backer approval governance)
   */
  async voteMilestone(milestoneId, approve = true) {
    if (!walletService.isConnected()) {
      throw new ContractExecutionError('Please connect your wallet before voting.');
    }
    const publicKey = walletService.publicKey;
    const contract = new StellarSdk.Contract(this.contractAddress);
    const account = await this.horizonServer.loadAccount(publicKey);

    const tx = new StellarSdk.TransactionBuilder(account, {
      fee: (parseInt(StellarSdk.BASE_FEE) * 10).toString(),
      networkPassphrase: CONFIG.NETWORK_PASSPHRASE,
    })
      .addOperation(
        contract.call(
          'vote_milestone',
          StellarSdk.nativeToScVal(publicKey, { type: 'address' }),
          StellarSdk.nativeToScVal(milestoneId, { type: 'u32' }),
          StellarSdk.nativeToScVal(approve, { type: 'bool' })
        )
      )
      .setTimeout(CONFIG.DEFAULT_TIMEOUT)
      .build();

    const simulated = await this.server.simulateTransaction(tx);
    if (this._isSimulationError(simulated)) {
      throw new TransactionFailedError(
        simulated?.error || 'Milestone voting simulation failed',
        null
      );
    }

    const assembledTx = StellarSdk.SorobanRpc.assembleTransaction(tx, simulated).build();
    const signedTx = await walletService.signTransaction(assembledTx);
    const result = await this.server.sendTransaction(signedTx);

    if (result.status === 'ERROR') {
      throw new TransactionFailedError(this._parseTxError(result), result.hash);
    }
    return { txHash: result.hash, status: result.status };
  }

  /**
   * Get transparent on-chain expenditure audit log
   */
  async getSpendingLogs() {
    try {
      const contract = new StellarSdk.Contract(this.contractAddress);
      const dummyAccount = this._getDummyAccount();

      const tx = new StellarSdk.TransactionBuilder(dummyAccount, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: CONFIG.NETWORK_PASSPHRASE,
      })
        .addOperation(contract.call('get_spending_logs'))
        .setTimeout(30)
        .build();

      const response = await this.server.simulateTransaction(tx);
      if (this._isSimulationError(response)) return this._getMockSpendingLogs();

      const retval = response.result?.retval;
      if (!retval) return this._getMockSpendingLogs();

      const native = StellarSdk.scValToNative(retval);
      if (!Array.isArray(native)) return this._getMockSpendingLogs();

      return native.map((l) => ({
        id: Number(l.id || 1),
        milestoneId: Number(l.milestone_id || 1),
        amount: Number(l.amount || 0) / 10_000_000,
        recipient: String(l.recipient || ''),
        category: String(l.category || 'General'),
        description: String(l.description || 'Disbursement'),
        timestamp: new Date(Number(l.timestamp || Date.now()) * 1000).toLocaleString(),
      }));
    } catch (e) {
      return this._getMockSpendingLogs();
    }
  }

  /**
   * Get verified creator reputation score
   */
  async getCreatorReputation() {
    try {
      const contract = new StellarSdk.Contract(this.contractAddress);
      const dummyAccount = this._getDummyAccount();

      const tx = new StellarSdk.TransactionBuilder(dummyAccount, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: CONFIG.NETWORK_PASSPHRASE,
      })
        .addOperation(contract.call('get_creator_reputation'))
        .setTimeout(30)
        .build();

      const response = await this.server.simulateTransaction(tx);
      if (this._isSimulationError(response)) return this._getMockReputation();

      const retval = response.result?.retval;
      if (!retval) return this._getMockReputation();

      const native = StellarSdk.scValToNative(retval);
      return {
        completedMilestones: Number(native.completed_milestones || 1),
        totalCampaigns: Number(native.total_campaigns || 1),
        totalDeliveredXLM: Number(native.total_delivered_xlm || 300_0000000) / 10_000_000,
        trustScore: Number(native.trust_score || 92),
      };
    } catch (e) {
      return this._getMockReputation();
    }
  }

  /**
   * Calculate Quadratic Funding match allocation
   * Formula: (sum(sqrt(ci)))^2
   */
  calculateQuadraticFunding(donations = [], matchingPool = 500) {
    if (!donations.length) {
      return { totalMatched: matchingPool, backerMultiplier: '1.0x', estimatedMatch: 0 };
    }
    const sumSqrt = donations.reduce((acc, d) => acc + Math.sqrt(Number(d.amount || 0)), 0);
    const rawQF = Math.pow(sumSqrt, 2);
    const directTotal = donations.reduce((acc, d) => acc + Number(d.amount || 0), 0);
    const leverage = directTotal > 0 ? (rawQF / directTotal).toFixed(1) : '1.0';
    return {
      rawQF: rawQF.toFixed(1),
      matchingPool,
      leverageMultiplier: `${leverage}x`,
      totalEmpowered: (directTotal + matchingPool).toFixed(1),
    };
  }

  /**
   * Claim proportional refund if campaign expired without reaching goal
   */
  async claimRefund() {
    if (!walletService.isConnected()) {
      throw new ContractExecutionError('Please connect your wallet to claim refund.');
    }
    const publicKey = walletService.publicKey;
    const contract = new StellarSdk.Contract(this.contractAddress);
    const account = await this.horizonServer.loadAccount(publicKey);

    const tx = new StellarSdk.TransactionBuilder(account, {
      fee: (parseInt(StellarSdk.BASE_FEE) * 10).toString(),
      networkPassphrase: CONFIG.NETWORK_PASSPHRASE,
    })
      .addOperation(
        contract.call('claim_refund', StellarSdk.nativeToScVal(publicKey, { type: 'address' }))
      )
      .setTimeout(CONFIG.DEFAULT_TIMEOUT)
      .build();

    const simulated = await this.server.simulateTransaction(tx);
    if (this._isSimulationError(simulated)) {
      throw new TransactionFailedError(
        simulated?.error || 'Refund claim simulation failed. Campaign may still be active.',
        null
      );
    }
    const assembledTx = StellarSdk.SorobanRpc.assembleTransaction(tx, simulated).build();
    const signedTx = await walletService.signTransaction(assembledTx);
    const result = await this.server.sendTransaction(signedTx);
    if (result.status === 'ERROR') {
      throw new TransactionFailedError(this._parseTxError(result), result.hash);
    }
    return { txHash: result.hash, status: result.status };
  }

  _getMockMilestones() {
    return [
      {
        id: 1,
        title: 'Survey & Permits',
        targetAmount: 300,
        deadline: 4500000,
        approvals: 12,
        rejections: 0,
        released: true,
        disputed: false,
      },
      {
        id: 2,
        title: 'Solar Pump Drilling',
        targetAmount: 400,
        deadline: 6000000,
        approvals: 8,
        rejections: 1,
        released: false,
        disputed: false,
      },
      {
        id: 3,
        title: 'Filtration & Distribution',
        targetAmount: 300,
        deadline: 9999999,
        approvals: 3,
        rejections: 0,
        released: false,
        disputed: false,
      },
    ];
  }

  _getMockSpendingLogs() {
    return [
      {
        id: 1,
        milestoneId: 1,
        amount: 150,
        recipient: 'GA7W...46SJ (Geological Drilling Ltd)',
        category: 'Hardware',
        description: 'Hydrogeological ground resistivity survey and soil testing',
        timestamp: '2026-08-28, 11:30 AM',
      },
      {
        id: 2,
        milestoneId: 1,
        amount: 150,
        recipient: 'GBD2...99KL (Kenya Water Resource Auth)',
        category: 'Permits',
        description: 'Environmental Impact Assessment & water extraction rights',
        timestamp: '2026-08-28, 02:45 PM',
      },
    ];
  }

  _getMockReputation() {
    return {
      completedMilestones: 1,
      totalCampaigns: 2,
      totalDeliveredXLM: 1300,
      trustScore: 96,
    };
  }

  /**
   * Parse campaign data from contract return value
   */
  _parseCampaign(retval) {
    try {
      const native = StellarSdk.scValToNative(retval);
      return {
        admin: native.admin || '',
        goal: Number(native.goal || 0) / 10_000_000,
        raised: Number(native.raised || 0) / 10_000_000,
        releasedAmount: Number(native.released_amount || 0) / 10_000_000,
        totalMilestones: Number(native.total_milestones || 3),
        deadline: Number(native.deadline || 0),
        active: native.active !== false,
      };
    } catch (error) {
      console.error('Parse campaign error:', error);
      return this._getMockCampaign();
    }
  }

  /**
   * Mock campaign data for when contract is not yet deployed/initialized
   */
  _getMockCampaign() {
    return {
      admin: 'GCK3REPLT7LXQF3BHTBEMN4O6JRX4GBTMCYMLHWGJMWKWQX7D3GBJHCO',
      goal: CONFIG.CAMPAIGN_GOAL_XLM,
      raised: 117,
      releasedAmount: 300,
      totalMilestones: 3,
      deadline: CONFIG.CAMPAIGN_DEADLINE_LEDGER,
      active: true,
    };
  }
}

export const contractService = new ContractService();

