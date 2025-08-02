import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useWallet } from '@/contexts/WalletContext';
import { useGroups } from '@/contexts/GroupContext';
import { useToast } from '@/hooks/use-toast';
import { Group } from '@shared/schema';
import { APP_CONFIG } from '@/config/constants';
import { Loader2, Coins, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ContributionModalProps {
  group: Group | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ContributionModal({ group, isOpen, onClose }: ContributionModalProps) {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [txStatus, setTxStatus] = useState<'idle' | 'signing' | 'confirming' | 'success' | 'error'>('idle');
  const [txHash, setTxHash] = useState('');
  
  const { cUSDBalance, simulateTransfer } = useWallet();
  const { makeContribution } = useGroups();
  const { toast } = useToast();

  const handleContribute = async () => {
    if (!group || !amount) return;
    
    const contributionAmount = parseFloat(amount);
    
    // Validation
    if (contributionAmount < APP_CONFIG.MIN_CONTRIBUTION) {
      toast({
        title: "Invalid Amount",
        description: `Minimum contribution is ${APP_CONFIG.MIN_CONTRIBUTION} cUSD`,
        variant: "destructive",
      });
      return;
    }
    
    const currentBalance = parseFloat(cUSDBalance || '0');
    if (contributionAmount > currentBalance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough cUSD for this contribution",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setTxStatus('signing');
    
    try {
      // Step 1: Sign transaction
      setTxStatus('signing');
      const hash = await simulateTransfer(group.id, amount);
      setTxHash(hash);
      
      // Step 2: Confirm transaction (simulate network confirmation)
      setTxStatus('confirming');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Step 3: Record contribution
      await makeContribution({
        groupId: group.id,
        amount: contributionAmount,
      });
      
      setTxStatus('success');
      
      // Auto-close after success
      setTimeout(() => {
        handleClose();
      }, 2000);
      
    } catch (error) {
      console.error('Contribution failed:', error);
      setTxStatus('error');
      toast({
        title: "Contribution Failed",
        description: error instanceof Error ? error.message : "Failed to process contribution",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setAmount('');
    setTxStatus('idle');
    setTxHash('');
    onClose();
  };

  const getExplorerUrl = (hash: string) => {
    const network = APP_CONFIG.CELO_NETWORKS[APP_CONFIG.CURRENT_NETWORK];
    return `${network.explorerUrl}/tx/${hash}`;
  };

  if (!group) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Coins className="mr-2 h-5 w-5" />
            Contribute to {group.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Group Info */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Target Amount:</span>
              <span className="font-medium">{group.contributionAmount} cUSD per round</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Current Round:</span>
              <span className="font-medium">{group.currentRound}/{group.totalRounds}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Your Balance:</span>
              <span className="font-medium">{parseFloat(cUSDBalance || '0').toFixed(2)} cUSD</span>
            </div>
          </div>

          {/* Transaction Status */}
          {txStatus !== 'idle' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                {txStatus === 'signing' && (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-900">Sign Transaction</p>
                      <p className="text-sm text-blue-700">Please confirm in your wallet</p>
                    </div>
                  </>
                )}
                
                {txStatus === 'confirming' && (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-900">Confirming Transaction</p>
                      <p className="text-sm text-blue-700">Waiting for network confirmation</p>
                    </div>
                  </>
                )}
                
                {txStatus === 'success' && (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-900">Success!</p>
                      <p className="text-sm text-green-700">Contribution recorded successfully</p>
                    </div>
                  </>
                )}
                
                {txStatus === 'error' && (
                  <>
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="font-medium text-red-900">Transaction Failed</p>
                      <p className="text-sm text-red-700">Please try again</p>
                    </div>
                  </>
                )}
              </div>
              
              {txHash && (
                <div className="mt-3 pt-3 border-t border-blue-200">
                  <p className="text-xs text-blue-600 font-mono break-all">{txHash}</p>
                  {!APP_CONFIG.USE_MOCK_TX && (
                    <a
                      href={getExplorerUrl(txHash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline"
                    >
                      View in Explorer →
                    </a>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount">Contribution Amount (cUSD)</Label>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={isLoading}
                min={APP_CONFIG.MIN_CONTRIBUTION}
                step="0.01"
                className="pr-16"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-sm text-gray-500">cUSD</span>
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-600">
              <span>Min: {APP_CONFIG.MIN_CONTRIBUTION} cUSD</span>
              <span>Suggested: {group.contributionAmount} cUSD</span>
            </div>
          </div>

          {/* Quick Amount Buttons */}
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAmount(group.contributionAmount.toString())}
              disabled={isLoading}
            >
              Suggested
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAmount(APP_CONFIG.MIN_CONTRIBUTION.toString())}
              disabled={isLoading}
            >
              Minimum
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAmount((parseFloat(cUSDBalance || '0') * 0.1).toFixed(2))}
              disabled={isLoading}
            >
              10% Balance
            </Button>
          </div>
        </div>

        <DialogFooter className="flex-col space-y-2">
          {txStatus === 'success' ? (
            <Button onClick={handleClose} className="w-full">
              Close
            </Button>
          ) : (
            <>
              <Button
                onClick={handleContribute}
                disabled={!amount || isLoading || parseFloat(amount) < APP_CONFIG.MIN_CONTRIBUTION}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Contributing...
                  </>
                ) : (
                  <>
                    <Coins className="mr-2 h-4 w-4" />
                    Contribute {amount || '0'} cUSD
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
                className="w-full"
              >
                Cancel
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}