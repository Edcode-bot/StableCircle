import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { celoWalletService } from '@/lib/celo';
import { useToast } from '@/hooks/use-toast';
import { APP_CONFIG } from '@/config/constants';
import { storageService } from '@/lib/storage';
import { MobileWalletGuide } from '@/components/MobileWalletGuide';

interface WalletContextType {
  isConnected: boolean;
  address: string | null;
  cUSDBalance: string | null;
  celoBalance: string | null;
  isLoading: boolean;
  networkInfo: any;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  transferCUSD: (to: string, amount: string) => Promise<string>;
  simulateTransfer: (to: string, amount: string) => Promise<string>;
  refreshBalances: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [cUSDBalance, setCUSDBalance] = useState<string | null>(null);
  const [celoBalance, setCeloBalance] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [networkInfo] = useState(celoWalletService.getCurrentNetwork());
  const { toast } = useToast();

  const refreshBalances = async () => {
    if (!address) return;
    
    try {
      const [cUSD, celo] = await Promise.all([
        celoWalletService.getCUSDBalance(address),
        celoWalletService.getCELOBalance(address)
      ]);
      setCUSDBalance(cUSD);
      setCeloBalance(celo);
    } catch (error) {
      console.error('Failed to refresh balances:', error);
    }
  };

  const connectWallet = async () => {
    setIsLoading(true);
    try {
      const walletAddress = await celoWalletService.connectWallet();
      setAddress(walletAddress);
      setIsConnected(true);
      
      // Get balances
      await refreshBalances();
      
      // Handle referral tracking
      const pendingReferral = localStorage.getItem('pendingReferral');
      storageService.createOrGetUser(walletAddress, undefined, pendingReferral || undefined);
      if (pendingReferral) {
        localStorage.removeItem('pendingReferral');
      }
      
      toast({
        title: "Wallet Connected",
        description: `Connected to ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`,
      });
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      
      // Check if mobile browser issue
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (isMobile && (!window.celo && !window.ethereum)) {
        toast({
          title: "Mobile Wallet Required",
          description: "Please use Valora's built-in browser or install MetaMask mobile",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Connection Failed",
          description: error instanceof Error ? error.message : "Failed to connect wallet",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    celoWalletService.disconnect();
    setIsConnected(false);
    setAddress(null);
    setCUSDBalance(null);
    setCeloBalance(null);
    
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
  };

  const transferCUSD = async (to: string, amount: string): Promise<string> => {
    if (!isConnected) {
      throw new Error('Wallet not connected');
    }
    
    setIsLoading(true);
    try {
      const txHash = await celoWalletService.transferCUSD(to, amount);
      
      // Refresh balances after transfer
      await refreshBalances();
      
      toast({
        title: "Transaction Successful",
        description: `Transferred ${amount} cUSD`,
      });
      
      return txHash;
    } catch (error) {
      console.error('Transfer failed:', error);
      toast({
        title: "Transaction Failed",
        description: error instanceof Error ? error.message : "Transfer failed",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const simulateTransfer = async (to: string, amount: string): Promise<string> => {
    if (!isConnected) {
      throw new Error('Wallet not connected');
    }
    
    try {
      // Use mock transactions in development, real transactions in production
      const useMockTx = APP_CONFIG.USE_MOCK_TX;
      
      if (useMockTx) {
        // Simulate transaction delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        const mockTxHash = `0x${Math.random().toString(16).substring(2, 66)}`;
        console.log(`Simulated transfer of ${amount} cUSD to ${to}`);
        return mockTxHash;
      } else {
        return await transferCUSD(to, amount);
      }
    } catch (error) {
      console.error('Simulate transfer failed:', error);
      throw error;
    }
  };

  useEffect(() => {
    // Check if wallet is already connected
    const checkConnection = async () => {
      if (window.ethereum || window.celo) {
        try {
          const walletProvider = window.celo || window.ethereum;
          const accounts = await walletProvider.request({ method: 'eth_accounts' });
          if (accounts && accounts.length > 0) {
            setAddress(accounts[0]);
            setIsConnected(true);
            await refreshBalances();
          }
        } catch (error) {
          console.error('Failed to check wallet connection:', error);
        }
      }
    };

    checkConnection();

    // Set up event listeners
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        setAddress(accounts[0]);
        setIsConnected(true);
        refreshBalances();
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    celoWalletService.onAccountsChanged(handleAccountsChanged);
    celoWalletService.onChainChanged(handleChainChanged);

    return () => {
      celoWalletService.removeAllListeners();
    };
  }, []);

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        address,
        cUSDBalance,
        celoBalance,
        isLoading,
        networkInfo,
        connectWallet,
        disconnectWallet,
        transferCUSD,
        simulateTransfer,
        refreshBalances,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
