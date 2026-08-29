import { render, screen, fireEvent, act } from '@testing-library/react';
import App from './App';
import { DonateForm } from './components/DonateForm';
import { ProgressBar } from './components/ProgressBar';
import { WalletConnect } from './components/WalletConnect';
import { MilestoneEscrowPanel } from './components/MilestoneEscrowPanel';
import { QuadraticFundingCard } from './components/QuadraticFundingCard';
import { SoulboundBadges } from './components/SoulboundBadges';
import { CreateCampaignForm } from './components/CreateCampaignForm';
import { eventService } from './services/eventService';

describe('FundingWala Advanced Web3 Test Suite', () => {
  let rendered = null;

  afterEach(async () => {
    if (rendered && typeof rendered.unmount === 'function') {
      rendered.unmount();
      rendered = null;
    }
    await eventService.cleanup();
  });

  test('1. renders FundingWala header and navigation tabs', async () => {
    await act(async () => {
      rendered = render(<App />);
    });
    const headerElements = screen.getAllByText(/FundingWala/i);
    expect(headerElements.length).toBeGreaterThan(0);
    expect(screen.getAllByText(/CAMPAIGN & DONATE/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/MILESTONE ESCROW/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/SPENDING LOG/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/QUADRATIC POOL/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/SBT REPUTATION/i).length).toBeGreaterThan(0);
  });

  test('2. switches tabs to Milestone Escrow & displays tranche stages', async () => {
    await act(async () => {
      rendered = render(<App />);
    });

    const escrowTabs = screen.getAllByText(/MILESTONE ESCROW/i);
    await act(async () => {
      fireEvent.click(escrowTabs[0]);
    });

    expect(screen.getByText(/3-STAGE TRANCHE RELEASES/i)).toBeInTheDocument();
    expect(screen.getByText(/BACKER PROTECTION/i)).toBeInTheDocument();
  });

  test('3. switches tabs to Quadratic Pool & renders formula calculator', async () => {
    await act(async () => {
      rendered = render(<App />);
    });

    const qfTabs = screen.getAllByText(/QUADRATIC POOL/i);
    await act(async () => {
      fireEvent.click(qfTabs[0]);
    });

    expect(screen.getByText(/QUADRATIC MATCHING POOL/i)).toBeInTheDocument();
    expect(screen.getByText(/GITCOIN MATCHING ALGORITHM/i)).toBeInTheDocument();
  });

  test('4. switches tabs to SBT Reputation & renders soulbound badges', async () => {
    await act(async () => {
      rendered = render(<App />);
    });

    const badgesTabs = screen.getAllByText(/SBT REPUTATION/i);
    await act(async () => {
      fireEvent.click(badgesTabs[0]);
    });

    expect(screen.getByText(/SOULBOUND BADGES/i)).toBeInTheDocument();
    expect(screen.getByText(/BRONZE SUPPORTER/i)).toBeInTheDocument();
    expect(screen.getByText(/GENESIS GUARDIAN/i)).toBeInTheDocument();
  });

  test('5. opens mobile 3-bar side drawer and switches view', async () => {
    await act(async () => {
      rendered = render(<App />);
    });

    // Click mobile menu button
    const menuBtn = screen.getByLabelText(/Open navigation menu/i);
    await act(async () => {
      fireEvent.click(menuBtn);
    });

    // Drawer header should be present
    expect(screen.getByText(/SELECT A VIEW/i)).toBeInTheDocument();

    // Click Spending Log inside drawer
    const spendingTabs = screen.getAllByText(/SPENDING LOG/i);
    await act(async () => {
      fireEvent.click(spendingTabs[spendingTabs.length - 1]);
    });

    expect(screen.getByText(/ON-CHAIN SPENDING LOG/i)).toBeInTheDocument();
  });

  test('6. validates donation form inputs and quick amounts', () => {
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

  test('8. switches tabs to + CREATE CAMPAIGN & renders creator portal form', async () => {
    await act(async () => {
      rendered = render(<App />);
    });

    const createTabs = screen.getAllByText(/\+ CREATE CAMPAIGN/i);
    await act(async () => {
      fireEvent.click(createTabs[0]);
    });

    expect(screen.getByText(/LAUNCH CROWDFUNDING PROJECT/i)).toBeInTheDocument();
    expect(screen.getByText(/3-STAGE ESCROW TRANCHES/i)).toBeInTheDocument();
    expect(screen.getByText(/LAUNCH CAMPAIGN ON STELLAR/i)).toBeInTheDocument();
  });

  test('9. validates CreateCampaignForm input fields', async () => {
    const mockCreate = jest.fn().mockResolvedValue({});
    render(<CreateCampaignForm onCreateCampaign={mockCreate} connected={true} />);

    expect(screen.getByText(/Project Title/i)).toBeInTheDocument();
    expect(screen.getByText(/Funding Goal \(XLM\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Solar Energy/i)).toBeInTheDocument();
  });
});


