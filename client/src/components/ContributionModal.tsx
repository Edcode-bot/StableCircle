import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { makeContributionSchema, MakeContribution, Group } from '@shared/schema';
import { useGroups } from '@/contexts/GroupContext';
import { useWallet } from '@/contexts/WalletContext';
import { Coins, Info } from 'lucide-react';

interface ContributionModalProps {
  group: Group;
  isOpen: boolean;
  onClose: () => void;
}

export function ContributionModal({ group, isOpen, onClose }: ContributionModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { makeContribution } = useGroups();
  const { balance } = useWallet();

  const form = useForm<MakeContribution>({
    resolver: zodResolver(makeContributionSchema),
    defaultValues: {
      groupId: group.id,
      amount: group.contributionAmount,
    },
  });

  const contributionAmount = form.watch('amount');

  const onSubmit = async (data: MakeContribution) => {
    setIsSubmitting(true);
    try {
      await makeContribution(data);
      form.reset();
      onClose();
    } catch (error) {
      console.error('Failed to make contribution:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Coins className="h-5 w-5" />
            <span>Make Contribution</span>
          </DialogTitle>
          <p className="text-sm text-gray-600">Contribute to {group.name}</p>
        </DialogHeader>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Required contribution: <span className="font-semibold">{group.contributionAmount} cUSD</span> for this round
          </AlertDescription>
        </Alert>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contribution Amount (cUSD)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="number"
                        min={group.contributionAmount}
                        step="0.01"
                        className="pr-16 text-lg font-semibold"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 font-medium">cUSD</span>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Wallet Balance</span>
                <span className="text-lg font-semibold text-gray-900">{balance} cUSD</span>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Transaction Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Contribution Amount</span>
                  <span className="font-medium">{contributionAmount?.toFixed(2)} cUSD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Network Fee (Est.)</span>
                  <span className="font-medium">~0.01 CELO</span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-900">Total</span>
                    <span className="font-semibold text-gray-900">
                      {contributionAmount?.toFixed(2)} cUSD + gas
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Contributing...' : 'Contribute Now'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
