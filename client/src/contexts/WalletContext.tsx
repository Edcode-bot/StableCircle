import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { walletService } from '@/lib/wallet';
import { useToast } from '@/hooks/use-toast';

interface WalletContextType {
  isConnected: boolean;
  address: string | null;
  balance: string | null;
  isLoading: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  simulateTransfer: (to: string, amount: string) => Promise<string>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const connectWallet = async () => {
    setIsLoading(true);
    try {
      const walletAddress = await walletService.connectMetaMask();
      setAddress(walletAddress);
      setIsConnected(true);
      
      // Get balance (mock balance for demo)
      setBalance('1250.50');
      
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
    walletService.disconnect();
    setIsConnected(false);
    setAddress(null);
    setBalance(null);
    
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
  };

  const simulateTransfer = async (to: string, amount: string): Promise<string> => {
    if (!isConnected) {
      throw new Error('Wallet not connected');
    }
    
    setIsLoading(true);
    try {
      const txHash = await walletService.simulateTransfer(to, amount);
      
      // Update balance after transfer (mock)
      const currentBalance = parseFloat(balance || '0');
      const transferAmount = parseFloat(amount);
      setBalance((currentBalance - transferAmount).toString());
      
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
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setAddress(accounts[0]);
            setIsConnected(true);
            setBalance('1250.50'); // Mock balance
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
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    walletService.onAccountsChanged(handleAccountsChanged);
    walletService.onChainChanged(handleChainChanged);

    return () => {
      walletService.removeAllListeners();
    };
  }, []);

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        address,
        balance,
        isLoading,
        connectWallet,
        disconnectWallet,
        simulateTransfer,
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
