// Error classes for different error types
export class AppError extends Error {
  constructor(message, type, details = null) {
    super(message);
    this.type = type;
    this.details = details;
    this.name = this.constructor.name;
  }
}

// ─── 1. Wallet Connection Errors ─────────────────────────────────────────────
export class WalletConnectionError extends AppError {
  constructor(message, details) {
    super(message, 'WALLET_CONNECTION', details);
  }
}

export class WalletNotFoundError extends WalletConnectionError {
  constructor(provider) {
    super(
      `${provider} wallet not found. Please install the ${provider} browser extension.`,
      { provider }
    );
  }
}

export class WalletRejectionError extends WalletConnectionError {
  constructor() {
    super('Wallet connection was rejected. Please approve the connection request.', null);
  }
}

// ─── 2. Contract Execution Errors ────────────────────────────────────────────
export class ContractExecutionError extends AppError {
  constructor(message, details) {
    super(message, 'CONTRACT_EXECUTION', details);
  }
}

export class InsufficientBalanceError extends ContractExecutionError {
  constructor(required, available) {
    super(
      `Insufficient XLM balance. Need ${required} XLM but only have ${available} XLM.`,
      { required, available }
    );
  }
}

export class InvalidDonationError extends ContractExecutionError {
  constructor(message) {
    super(message || 'Invalid donation amount.', null);
  }
}

export class TransactionFailedError extends ContractExecutionError {
  constructor(reason, txHash) {
    super(`Transaction failed: ${reason}`, { txHash });
    this.txHash = txHash;
  }
}

// ─── 3. Network Errors ───────────────────────────────────────────────────────
export class NetworkError extends AppError {
  constructor(message, details) {
    super(message, 'NETWORK', details);
  }
}

export class NetworkTimeoutError extends NetworkError {
  constructor() {
    super('Network request timed out. Please check your connection and try again.', null);
  }
}

export class RPCError extends NetworkError {
  constructor(message) {
    super(`RPC error: ${message}`, { message });
  }
}

export class HorizonError extends NetworkError {
  constructor(message) {
    super(`Horizon API error: ${message}`, { message });
  }
}

// ─── Error Handler Utility ───────────────────────────────────────────────────
export const handleError = (error) => {
  console.error('Application error:', error);

  if (error instanceof AppError) {
    return {
      message: error.message,
      type: error.type,
      details: error.details,
      name: error.name,
    };
  }

  // Map generic network errors
  if (error?.message?.includes('timeout') || error?.message?.includes('TIMEOUT')) {
    return {
      message: 'Network request timed out. Please check your connection and try again.',
      type: 'NETWORK',
      details: error.message,
      name: 'NetworkTimeoutError',
    };
  }

  if (error?.message?.includes('fetch') || error?.message?.includes('network')) {
    return {
      message: 'Network error. Please check your internet connection.',
      type: 'NETWORK',
      details: error.message,
      name: 'NetworkError',
    };
  }

  // Unknown errors
  return {
    message: 'An unexpected error occurred. Please try again.',
    type: 'UNKNOWN',
    details: error?.message || 'Unknown error',
    name: 'UnknownError',
  };
};

export const getErrorMessage = (error) => {
  const handled = handleError(error);
  return handled.message;
};
