import * as StellarSdk from '@stellar/stellar-sdk';
import { CONFIG } from '../config';

export class EventService {
  constructor() {
    this.server = new StellarSdk.SorobanRpc.Server(CONFIG.SOROBAN_RPC_URL);
    this.listeners = new Map();
    this.pollingInterval = null;
    this.lastLedger = null;
    this.contractId = CONFIG.CONTRACT_ADDRESS;
    this.recentDonations = [];
  }

  /**
   * Subscribe to donation events
   * @param {function} callback - Called with { donor, amount, ledger, timestamp }
   * @returns {string} listenerId for unsubscribing
   */
  subscribeToDonations(callback) {
    const listenerId = `donation_${Date.now()}`;
    this.listeners.set(listenerId, { eventType: 'donated', callback });

    if (!this.pollingInterval) {
      this.startPolling();
    }

    // Immediately deliver cached donations to new subscribers
    if (this.recentDonations.length > 0) {
      this.recentDonations.forEach((d) => {
        try {
          callback(d);
        } catch (e) {
          console.error('Error delivering cached donation:', e);
        }
      });
    }

    return listenerId;
  }

  /**
   * Unsubscribe from events
   */
  unsubscribe(listenerId) {
    this.listeners.delete(listenerId);
    if (this.listeners.size === 0) {
      this.stopPolling();
    }
  }

  /**
   * Start polling for events
   */
  async startPolling() {
    try {
      const ledger = await this.server.getLatestLedger();
      // Start from a few ledgers back to catch recent events
      this.lastLedger = Math.max(1, ledger.sequence - 100);
    } catch (error) {
      console.error('Failed to get initial ledger for event polling:', error);
      this.lastLedger = 1;
    }

    this.pollingInterval = setInterval(async () => {
      try {
        await this.pollForEvents();
      } catch (error) {
        console.error('Event polling error:', error);
      }
    }, CONFIG.CAMPAIGN_REFRESH_INTERVAL);

    // Also poll immediately
    this.pollForEvents().catch(console.error);
  }

  /**
   * Stop polling for events
   */
  stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  /**
   * Poll for new contract events
   */
  async pollForEvents() {
    try {
      const currentLedger = await this.server.getLatestLedger();

      if (!this.lastLedger) {
        this.lastLedger = currentLedger.sequence;
        return;
      }

      const startLedger = this.lastLedger;

      // Don't re-poll old ledgers
      if (currentLedger.sequence <= startLedger) return;

      const eventsResponse = await this.server.getEvents({
        startLedger,
        filters: [
          {
            type: 'contract',
            contractIds: [this.contractId],
          },
        ],
        limit: 50,
      });

      if (eventsResponse?.events?.length > 0) {
        eventsResponse.events.forEach((event) => {
          this.handleEvent(event);
        });
      }

      this.lastLedger = currentLedger.sequence;
    } catch (error) {
      // Silently handle — getEvents may not be available on all RPC nodes
      if (!error?.message?.includes('not found') && !error?.message?.includes('404')) {
        console.debug('Event polling:', error?.message);
      }
    }
  }

  /**
   * Handle a single contract event
   */
  handleEvent(event) {
    try {
      const parsed = this.parseEvent(event);
      if (!parsed) return;

      // Cache recent donations (keep last 20)
      if (parsed.type === 'donated') {
        this.recentDonations = [parsed, ...this.recentDonations].slice(0, 20);
      }

      // Notify listeners
      this.listeners.forEach((listener) => {
        if (listener.eventType === parsed.type || listener.eventType === 'all') {
          try {
            listener.callback(parsed);
          } catch (e) {
            console.error('Listener callback error:', e);
          }
        }
      });
    } catch (error) {
      console.error('handleEvent error:', error);
    }
  }

  /**
   * Parse raw contract event
   */
  parseEvent(event) {
    try {
      const topics = event.topic || [];
      let eventType = 'unknown';
      let donor = null;

      // Topics[0] is usually the event name symbol
      if (topics.length > 0) {
        try {
          const topicVal = StellarSdk.scValToNative(topics[0]);
          eventType = String(topicVal);
        } catch (e) {
          // Topic may already be a string
          eventType = topics[0]?.toString() || 'unknown';
        }
      }

      // Topics[1] is usually the address for donated events
      if (topics.length > 1) {
        try {
          donor = StellarSdk.scValToNative(topics[1]);
        } catch (e) {
          donor = null;
        }
      }

      // Value is the amount
      let amount = 0;
      if (event.value) {
        try {
          const rawAmount = StellarSdk.scValToNative(event.value);
          amount = Number(rawAmount) / 10_000_000; // stroops to XLM
        } catch (e) {
          amount = 0;
        }
      }

      return {
        id: event.id || `${event.ledger}_${Date.now()}`,
        type: eventType,
        donor: donor ? String(donor) : null,
        amount,
        ledger: event.ledger,
        timestamp: event.ledgerClosedAt || new Date().toISOString(),
        txHash: event.txHash || null,
      };
    } catch (error) {
      console.error('parseEvent error:', error);
      return null;
    }
  }

  /**
   * Add a local donation event (for immediate UI feedback after a tx)
   */
  addLocalDonation(donor, amountXLM, txHash) {
    const localEvent = {
      id: `local_${Date.now()}`,
      type: 'donated',
      donor,
      amount: amountXLM,
      ledger: 'pending',
      timestamp: new Date().toISOString(),
      txHash,
      isLocal: true,
    };

    this.recentDonations = [localEvent, ...this.recentDonations].slice(0, 20);

    this.listeners.forEach((listener) => {
      if (listener.eventType === 'donated' || listener.eventType === 'all') {
        try {
          listener.callback(localEvent);
        } catch (e) {
          console.error('Local donation callback error:', e);
        }
      }
    });
  }

  /**
   * Clear all listeners
   */
  clearAllListeners() {
    this.listeners.clear();
    this.stopPolling();
  }

  /**
   * Get cached recent donations
   */
  getRecentDonations() {
    return this.recentDonations;
  }
}

export const eventService = new EventService();
