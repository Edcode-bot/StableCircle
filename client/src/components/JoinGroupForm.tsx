import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { joinGroupSchema, JoinGroup } from '@shared/schema';
import { useGroups } from '@/contexts/GroupContext';
import { useWallet } from '@/contexts/WalletContext';
import { storageService } from '@/lib/storage';
import { UserPlus } from 'lucide-react';

interface JoinGroupFormProps {
  onSuccess?: () => void;
}

export function JoinGroupForm({ onSuccess }: JoinGroupFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewGroup, setPreviewGroup] = useState<any>(null);
  const { joinGroup } = useGroups();
  const { isConnected } = useWallet();

  const form = useForm<JoinGroup>({
    resolver: zodResolver(joinGroupSchema),
    defaultValues: {
      inviteCode: '',
      name: '',
    },
  });

  const inviteCode = form.watch('inviteCode');

  // Preview group when invite code is entered
  useState(() => {
    if (inviteCode && inviteCode.length >= 10) {
      const group = storageService.getGroupByInviteCode(inviteCode);
      if (group) {
        const members = storageService.getMembersByGroupId(group.id);
        setPreviewGroup({
          groupName: group.name,
          contributionAmount: group.contributionAmount,
          duration: group.duration,
          memberCount: `${members.length} / ${group.maxMembers}`,
        });
      } else {
        setPreviewGroup(null);
      }
    } else {
      setPreviewGroup(null);
    }
  });

  const onSubmit = async (data: JoinGroup) => {
    if (!isConnected) {
      return;
    }

    setIsSubmitting(true);
    try {
      await joinGroup(data);
      form.reset();
      setPreviewGroup(null);
      onSuccess?.();
    } catch (error) {
      console.error('Failed to join group:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isConnected) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-gray-500">Please connect your wallet to join a group</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <UserPlus className="h-5 w-5" />
          <span>Join Savings Group</span>
        </CardTitle>
        <p className="text-sm text-gray-600">
          Enter an invite code to join an existing savings group
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="inviteCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invite Code *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="SC-XXXX-XXXX"
                      className="text-center font-mono text-lg"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Display Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {previewGroup && (
              <Alert className="border-blue-200 bg-blue-50">
                <AlertDescription>
                  <h4 className="font-semibold text-blue-900 mb-4">Group Preview</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-blue-600">Group Name</p>
                      <p className="font-medium text-blue-900">{previewGroup.groupName}</p>
                    </div>
                    <div>
                      <p className="text-blue-600">Contribution Amount</p>
                      <p className="font-medium text-blue-900">{previewGroup.contributionAmount} cUSD</p>
                    </div>
                    <div>
                      <p className="text-blue-600">Duration</p>
                      <p className="font-medium text-blue-900">{previewGroup.duration} days</p>
                    </div>
                    <div>
                      <p className="text-blue-600">Current Members</p>
                      <p className="font-medium text-blue-900">{previewGroup.memberCount}</p>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline">
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting || !previewGroup}
                className="bg-secondary hover:bg-secondary/90"
              >
                {isSubmitting ? 'Joining...' : 'Join Group'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
