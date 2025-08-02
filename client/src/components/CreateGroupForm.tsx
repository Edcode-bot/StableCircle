import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { createGroupSchema, CreateGroup } from '@shared/schema';
import { useGroups } from '@/contexts/GroupContext';
import { useWallet } from '@/contexts/WalletContext';
import { Plus, Info } from 'lucide-react';

interface CreateGroupFormProps {
  onSuccess?: (group: any) => void;
}

export function CreateGroupForm({ onSuccess }: CreateGroupFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createGroup } = useGroups();
  const { isConnected } = useWallet();

  const form = useForm<CreateGroup>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: {
      name: '',
      description: '',
      duration: 90,
      contributionAmount: 100,
      maxMembers: 10,
    },
  });

  const onSubmit = async (data: CreateGroup) => {
    if (!isConnected) {
      return;
    }

    setIsSubmitting(true);
    try {
      const group = await createGroup(data);
      form.reset();
      onSuccess?.(group);
    } catch (error) {
      console.error('Failed to create group:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isConnected) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-gray-500">Please connect your wallet to create a group</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>Create New Savings Group</span>
        </CardTitle>
        <p className="text-sm text-gray-600">
          Set up a rotating savings group and invite friends to join
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Group Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter group name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (Days) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="30"
                        max="365"
                        placeholder="e.g. 90"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contributionAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contribution Amount (cUSD) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="10"
                        step="0.01"
                        placeholder="e.g. 100"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxMembers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Members</FormLabel>
                    <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue="10">
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select max members" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="5">5 members</SelectItem>
                        <SelectItem value="10">10 members</SelectItem>
                        <SelectItem value="15">15 members</SelectItem>
                        <SelectItem value="20">20 members</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the purpose of this savings group..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>How it works:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                  <li>Members contribute the set amount regularly</li>
                  <li>Each round, one member receives the total pool</li>
                  <li>Rotation continues until everyone has received a payout</li>
                </ul>
              </AlertDescription>
            </Alert>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Group'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
