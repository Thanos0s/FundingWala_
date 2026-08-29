import { render, screen, fireEvent, act } from '@testing-library/react';
import App from './App';
import { DonateForm } from './components/DonateForm';
import { ProgressBar } from './components/ProgressBar';
import { WalletConnect } from './components/WalletConnect';

describe('FundingWala Level 3 Test Suite', () => {
  test('1. renders FundingWala header and retro game title', async () => {
    await act(async () => {
      render(<App />);
    });
    const headerElements = screen.getAllByText(/FundingWala/i);
    expect(headerElements.length).toBeGreaterThan(0);
    expect(screen.getByText(/CAMPAIGN PROGRESS/i)).toBeInTheDocument();
  });

  test('2. renders wallet connect panel with supported wallet providers', async () => {
    await act(async () => {
      render(<WalletConnect onConnected={() => {}} />);
    });
    expect(screen.getByText(/CONNECT WALLET/i)).toBeInTheDocument();
    expect(screen.getByText(/FREIGHTER/i)).toBeInTheDocument();
    expect(screen.getByText(/ALBEDO/i)).toBeInTheDocument();
    expect(screen.getByText(/XBULL/i)).toBeInTheDocument();
  });

  test('3. validates donation form inputs and quick amounts', () => {
    const mockOnDonate = jest.fn();
    render(
      <DonateForm
        onDonate={mockOnDonate}
        donationState={{ status: 'idle', txHash: null, error: null }}
        walletConnected={true}
      />
    );
    expect(screen.getByText(/MAKE A DONATION/i)).toBeInTheDocument();
    expect(screen.getByText(/\+10 XLM/i)).toBeInTheDocument();
    expect(screen.getByText(/DONATE NOW/i)).toBeInTheDocument();
  });

  test('4. accurately calculates and renders progress bar stats', () => {
    render(<ProgressBar raised={117} goal={1000} progress={11.7} />);
    expect(screen.getByText(/11.7%/i)).toBeInTheDocument();
    expect(screen.getByText(/117.0 XLM/i)).toBeInTheDocument();
    expect(screen.getByText(/1,000 XLM/i)).toBeInTheDocument();
    expect(screen.getByText(/883.0 XLM/i)).toBeInTheDocument();
  });
});

