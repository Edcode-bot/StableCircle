import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useWallet } from '@/contexts/WalletContext';
import { Wallet, ChevronDown, Copy, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function WalletConnectButton() {
  const { isConnected, address, balance, isLoading, connectWallet, disconnectWallet } = useWallet();
  const { toast } = useToast();

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      });
    }
  };

  if (!isConnected) {
    return (
      <Button
        onClick={connectWallet}
        disabled={isLoading}
        className="bg-primary text-primary-foreground hover:bg-primary/90"
      >
        <Wallet className="mr-2 h-4 w-4" />
        {isLoading ? 'Connecting...' : 'Connect Wallet'}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="wallet-connected flex items-center space-x-2"
        >
          <Wallet className="h-4 w-4" />
          <span className="font-mono">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <div className="p-3 border-b">
          <div className="text-sm text-muted-foreground">Balance</div>
          <div className="text-lg font-semibold">{balance} cUSD</div>
          <div className="text-xs text-muted-foreground font-mono">
            {address}
          </div>
        </div>
        <DropdownMenuItem onClick={copyAddress}>
          <Copy className="mr-2 h-4 w-4" />
          Copy Address
        </DropdownMenuItem>
        <DropdownMenuItem onClick={disconnectWallet}>
          <LogOut className="mr-2 h-4 w-4" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
