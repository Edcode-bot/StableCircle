import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useWallet } from '@/contexts/WalletContext';
import { Wallet, Loader2, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

export function WalletConnectButton() {
  const { 
    isConnected, 
    address, 
    cUSDBalance, 
    celoBalance, 
    isLoading, 
    networkInfo, 
    connectWallet, 
    disconnectWallet 
  } = useWallet();

  if (isLoading) {
    return (
      <Button disabled size="lg" className="min-w-[180px]">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Connecting...
      </Button>
    );
  }

  if (!isConnected) {
    return (
      <Button onClick={connectWallet} size="lg" className="min-w-[180px]">
        <Wallet className="mr-2 h-4 w-4" />
        Connect Wallet
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="lg" className="min-w-[180px]">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="font-mono">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </span>
            <ChevronDown className="h-4 w-4" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-64">
        <div className="p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Network</span>
            <Badge variant="secondary" className="text-xs">
              {networkInfo.name}
            </Badge>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">cUSD Balance</span>
              <span className="text-sm font-mono">
                {cUSDBalance ? parseFloat(cUSDBalance).toFixed(2) : '0.00'}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">CELO Balance</span>
              <span className="text-sm font-mono">
                {celoBalance ? parseFloat(celoBalance).toFixed(4) : '0.0000'}
              </span>
            </div>
          </div>
        </div>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem
          onClick={() => {
            if (address) {
              navigator.clipboard.writeText(address);
            }
          }}
          className="cursor-pointer"
        >
          Copy Address
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <a
            href={`${networkInfo.explorerUrl}/address/${address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer"
          >
            View on Explorer
          </a>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem
          onClick={disconnectWallet}
          className="cursor-pointer text-red-600 focus:text-red-600"
        >
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}