import { ethers, JsonRpcProvider, Contract, BrowserProvider } from 'ethers';
import { APP_CONFIG } from '@/config/constants';

// Celo network configuration
const NETWORK_CONFIG = APP_CONFIG.CELO_NETWORKS[APP_CONFIG.CURRENT_NETWORK];

// cUSD Token ABI (minimal for transfers)
const CUSD_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function decimals() view returns (uint8)',
];

export interface CeloWalletProvider {
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  on: (event: string, handler: (data: any) => void) => void;
  removeListener: (event: string, handler: (data: any) => void) => void;
}

declare global {
  interface Window {
    ethereum?: CeloWalletProvider;
    celo?: CeloWalletProvider;
  }
}

export class CeloWalletService {
  private provider: BrowserProvider | null = null;
  private signer: any | null = null;
  private cUSDContract: Contract | null = null;

  async connectWallet(): Promise<string> {
    try {
      // Try Celo extension first, then fallback to MetaMask
      const walletProvider = window.celo || window.ethereum;
      
      if (!walletProvider) {
        throw new Error('Please install MetaMask or Celo Extension Wallet');
      }

      // Request account access
      const accounts = await walletProvider.request({
        method: 'eth_requestAccounts',
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found');
      }

      // Initialize provider and signer
      this.provider = new BrowserProvider(walletProvider);
      this.signer = await this.provider.getSigner();

      // Check if we're on the correct network
      await this.switchToCorrectNetwork();

      // Initialize cUSD contract
      this.cUSDContract = new Contract(
        NETWORK_CONFIG.cUSD,
        CUSD_ABI,
        this.signer
      );

      return accounts[0];
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw new Error(
        error instanceof Error 
          ? error.message 
          : 'Failed to connect to wallet'
      );
    }
  }

  async switchToCorrectNetwork(): Promise<void> {
    if (!this.provider) {
      throw new Error('Wallet not connected');
    }

    const network = await this.provider.getNetwork();
    
    if (network.chainId !== NETWORK_CONFIG.chainId) {
      try {
        await window.ethereum?.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${NETWORK_CONFIG.chainId.toString(16)}` }],
        });
      } catch (switchError: any) {
        // If the network doesn't exist, add it
        if (switchError.code === 4902) {
          await this.addCeloNetwork();
        } else {
          throw new Error(`Please switch to ${NETWORK_CONFIG.name}`);
        }
      }
    }
  }

  private async addCeloNetwork(): Promise<void> {
    try {
      await window.ethereum?.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: `0x${NETWORK_CONFIG.chainId.toString(16)}`,
          chainName: NETWORK_CONFIG.name,
          nativeCurrency: NETWORK_CONFIG.nativeCurrency,
          rpcUrls: [NETWORK_CONFIG.rpcUrl],
          blockExplorerUrls: [NETWORK_CONFIG.explorerUrl],
        }],
      });
    } catch (error) {
      throw new Error('Failed to add Celo network to wallet');
    }
  }

  async getCUSDBalance(address: string): Promise<string> {
    if (!this.cUSDContract) {
      throw new Error('cUSD contract not initialized');
    }

    try {
      const balance = await this.cUSDContract.balanceOf(address);
      return ethers.formatUnits(balance, 18);
    } catch (error) {
      console.error('Failed to get cUSD balance:', error);
      return '0';
    }
  }

  async getCELOBalance(address: string): Promise<string> {
    if (!this.provider) {
      throw new Error('Wallet not connected');
    }

    try {
      const balance = await this.provider.getBalance(address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Failed to get CELO balance:', error);
      return '0';
    }
  }

  async transferCUSD(to: string, amount: string): Promise<string> {
    if (APP_CONFIG.USE_MOCK_TX) {
      return this.simulateTransfer(to, amount);
    }

    if (!this.cUSDContract || !this.signer) {
      throw new Error('Wallet not connected or contract not initialized');
    }

    try {
      const amountWei = ethers.parseUnits(amount, 18);
      
      // Check balance first
      const senderAddress = await this.signer.getAddress();
      const balance = await this.cUSDContract.balanceOf(senderAddress);
      
      if (balance < amountWei) {
        throw new Error('Insufficient cUSD balance');
      }

      // Execute transfer
      const tx = await this.cUSDContract.transfer(to, amountWei);
      
      // Wait for confirmation
      const receipt = await tx.wait();
      
      return receipt.transactionHash;
    } catch (error) {
      console.error('Transfer failed:', error);
      throw new Error(
        error instanceof Error 
          ? error.message 
          : 'Transfer failed'
      );
    }
  }

  private async simulateTransfer(to: string, amount: string): Promise<string> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate mock transaction hash
    const mockTxHash = `0x${Math.random().toString(16).substring(2).padStart(64, '0')}`;
    
    console.log(`[MOCK] Transferred ${amount} cUSD to ${to}`);
    console.log(`[MOCK] Transaction hash: ${mockTxHash}`);
    
    return mockTxHash;
  }

  async approveContract(spender: string, amount: string): Promise<string> {
    if (APP_CONFIG.USE_MOCK_TX) {
      return this.simulateTransfer(spender, '0');
    }

    if (!this.cUSDContract) {
      throw new Error('cUSD contract not initialized');
    }

    try {
      const amountWei = ethers.parseUnits(amount, 18);
      const tx = await this.cUSDContract.approve(spender, amountWei);
      const receipt = await tx.wait();
      
      return receipt.transactionHash;
    } catch (error) {
      console.error('Approval failed:', error);
      throw new Error('Failed to approve contract');
    }
  }

  disconnect(): void {
    this.provider = null;
    this.signer = null;
    this.cUSDContract = null;
  }

  onAccountsChanged(handler: (accounts: string[]) => void): void {
    const walletProvider = window.celo || window.ethereum;
    if (walletProvider) {
      walletProvider.on('accountsChanged', handler);
    }
  }

  onChainChanged(handler: (chainId: string) => void): void {
    const walletProvider = window.celo || window.ethereum;
    if (walletProvider) {
      walletProvider.on('chainChanged', handler);
    }
  }

  removeAllListeners(): void {
    const walletProvider = window.celo || window.ethereum;
    if (walletProvider) {
      walletProvider.removeListener('accountsChanged', () => {});
      walletProvider.removeListener('chainChanged', () => {});
    }
  }

  getExplorerUrl(txHash: string): string {
    return `${NETWORK_CONFIG.explorerUrl}/tx/${txHash}`;
  }

  getCurrentNetwork() {
    return NETWORK_CONFIG;
  }
}

export const celoWalletService = new CeloWalletService();