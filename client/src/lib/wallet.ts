import { ethers, BrowserProvider, formatEther } from 'ethers';

export interface WalletProvider {
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  on: (event: string, handler: (data: any) => void) => void;
  removeListener: (event: string, handler: (data: any) => void) => void;
}

declare global {
  interface Window {
    ethereum?: WalletProvider;
  }
}

export class WalletService {
  private provider: BrowserProvider | null = null;
  private signer: any | null = null;

  async connectMetaMask(): Promise<string> {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed');
    }

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      this.provider = new BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();

      return accounts[0];
    } catch (error) {
      throw new Error('Failed to connect to MetaMask');
    }
  }

  async getBalance(address: string): Promise<string> {
    if (!this.provider) {
      throw new Error('Wallet not connected');
    }

    try {
      const balance = await this.provider.getBalance(address);
      return formatEther(balance);
    } catch (error) {
      throw new Error('Failed to get balance');
    }
  }

  async simulateTransfer(to: string, amount: string): Promise<string> {
    if (!this.signer) {
      throw new Error('Wallet not connected');
    }

    // Simulate a transaction for demo purposes
    // In production, this would interact with actual smart contracts
    const mockTxHash = `0x${Math.random().toString(16).substring(2)}`;
    
    // Simulate transaction delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log(`Simulated transfer of ${amount} cUSD to ${to}`);
    return mockTxHash;
  }

  async switchToNetwork(chainId: string): Promise<void> {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed');
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId }],
      });
    } catch (error) {
      throw new Error('Failed to switch network');
    }
  }

  disconnect(): void {
    this.provider = null;
    this.signer = null;
  }

  onAccountsChanged(handler: (accounts: string[]) => void): void {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handler);
    }
  }

  onChainChanged(handler: (chainId: string) => void): void {
    if (window.ethereum) {
      window.ethereum.on('chainChanged', handler);
    }
  }

  removeAllListeners(): void {
    if (window.ethereum) {
      window.ethereum.removeListener('accountsChanged', () => {});
      window.ethereum.removeListener('chainChanged', () => {});
    }
  }
}

export const walletService = new WalletService();
