import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { celoWalletService } from '@/lib/celo';
import { useToast } from '@/hooks/use-toast';
import { APP_CONFIG } from '@/config/constants';

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
      
      toast({
        title: "Wallet Connected",
        description: `Connected to ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`,
      });
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to connect wallet",
        variant: "destructive",
      });
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
