import { render, screen, fireEvent, act } from '@testing-library/react';
import App from './App';
import { DonateForm } from './components/DonateForm';
import { ProgressBar } from './components/ProgressBar';
import { WalletConnect } from './components/WalletConnect';
import { MilestoneEscrowPanel } from './components/MilestoneEscrowPanel';
import { QuadraticFundingCard } from './components/QuadraticFundingCard';
import { SoulboundBadges } from './components/SoulboundBadges';
import { eventService } from './services/eventService';

describe('FundingWala Advanced Web3 Test Suite', () => {
  afterEach(async () => {
    await eventService.cleanup();
  });
  test('1. renders FundingWala header and navigation tabs', async () => {
    await act(async () => {
      render(<App />);
    });
    const headerElements = screen.getAllByText(/FundingWala/i);
    expect(headerElements.length).toBeGreaterThan(0);
    expect(screen.getByText(/CAMPAIGN & DONATE/i)).toBeInTheDocument();
    expect(screen.getByText(/MILESTONE ESCROW/i)).toBeInTheDocument();
    expect(screen.getByText(/SPENDING LOG/i)).toBeInTheDocument();
    expect(screen.getByText(/QUADRATIC POOL/i)).toBeInTheDocument();
    expect(screen.getByText(/SBT REPUTATION/i)).toBeInTheDocument();
  });

  test('2. switches tabs to Milestone Escrow & displays tranche stages', async () => {
    await act(async () => {
      render(<App />);
    });

    const escrowTab = screen.getByText(/MILESTONE ESCROW/i);
    await act(async () => {
      fireEvent.click(escrowTab);
    });

    expect(screen.getByText(/MILESTONE ESCROW VAULT/i)).toBeInTheDocument();
    expect(screen.getByText(/RISK MANAGEMENT & REFUND VAULT/i)).toBeInTheDocument();
  });

  test('3. switches tabs to Quadratic Pool & renders formula calculator', async () => {
    await act(async () => {
      render(<App />);
    });

    const qfTab = screen.getByText(/QUADRATIC POOL/i);
    await act(async () => {
      fireEvent.click(qfTab);
    });

    expect(screen.getByText(/QUADRATIC MATCHING POOL/i)).toBeInTheDocument();
    expect(screen.getByText(/GITCOIN ALGORITHM/i)).toBeInTheDocument();
  });

  test('4. switches tabs to SBT Reputation & renders soulbound badges', async () => {
    await act(async () => {
      render(<App />);
    });

    const badgesTab = screen.getByText(/SBT REPUTATION/i);
    await act(async () => {
      fireEvent.click(badgesTab);
    });

    expect(screen.getByText(/SOULBOUND BADGES & REPUTATION/i)).toBeInTheDocument();
    expect(screen.getByText(/BRONZE SUPPORTER/i)).toBeInTheDocument();
    expect(screen.getByText(/GENESIS GUARDIAN/i)).toBeInTheDocument();
  });

  test('5. validates donation form inputs and quick amounts', () => {
    const mockOnDonate = jest.fn();
    render(
      <DonateForm
        onDonate={mockOnDonate}
        donationState={{ status: 'idle', txHash: null, error: null }}
        connected={true}
      />
    );
    expect(screen.getByText(/MAKE A DONATION/i)).toBeInTheDocument();
    expect(screen.getByText(/\+10 XLM/i)).toBeInTheDocument();
    expect(screen.getByText(/DONATE NOW/i)).toBeInTheDocument();
  });

  test('6. accurately calculates and renders progress bar stats', () => {
    render(<ProgressBar raised={117} goal={1000} progress={11.7} />);
    expect(screen.getByText(/11.7%/i)).toBeInTheDocument();
    expect(screen.getByText(/117.0 XLM/i)).toBeInTheDocument();
    expect(screen.getByText(/1,000 XLM/i)).toBeInTheDocument();
    expect(screen.getByText(/883.0 XLM/i)).toBeInTheDocument();
  });
});


