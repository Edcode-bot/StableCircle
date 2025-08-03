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
import { Checkbox } from '@/components/ui/checkbox';
import { createHubSchema, CreateHub } from '@shared/schema';
import { useWallet } from '@/contexts/WalletContext';
import { Plus, Info, Target, Calendar, Users, DollarSign } from 'lucide-react';

interface CreateHubFormProps {
  onSuccess?: (hub: any) => void;
}

export function CreateHubForm({ onSuccess }: CreateHubFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { address, isConnected } = useWallet();

  const form = useForm<CreateHub>({
    resolver: zodResolver(createHubSchema),
    defaultValues: {
      name: '',
      description: '',
      goal: 1000,
      deadline: '',
      duration: 30,
      contributionAmount: 50,
      maxMembers: 8,
    },
  });

  const onSubmit = async (data: CreateHub) => {
    if (!isConnected || !address) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/hubs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, wallet: address }),
      });

      if (response.ok) {
        const hub = await response.json();
        form.reset();
        onSuccess?.(hub);
      } else {
        throw new Error('Failed to create hub');
      }
    } catch (error) {
      console.error('Failed to create savings hub:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isConnected) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-gray-500">Please connect your wallet to create a savings hub</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>Create New Savings Hub</span>
        </CardTitle>
        <p className="text-sm text-gray-600">
          Set up a collaborative savings hub and invite friends to reach your goals together
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Hub Name
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Emergency Fund Hub" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe the purpose of this savings hub..."
                        className="min-h-[80px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Financial Goals */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Financial Goals</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="goal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Total Savings Goal (cUSD)
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01"
                          placeholder="1000"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="deadline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Target Deadline
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="date"
                          min={new Date().toISOString().split('T')[0]}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="contributionAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Regular Contribution (cUSD)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01"
                          placeholder="50"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
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
                      <FormLabel>Duration (Days)</FormLabel>
                      <Select onValueChange={(value) => field.onChange(parseInt(value))}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="30">30 days</SelectItem>
                          <SelectItem value="60">60 days</SelectItem>
                          <SelectItem value="90">90 days</SelectItem>
                          <SelectItem value="180">6 months</SelectItem>
                          <SelectItem value="365">1 year</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Hub Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Hub Settings</h3>
              
              <FormField
                control={form.control}
                name="maxMembers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Maximum Members
                    </FormLabel>
                    <Select onValueChange={(value) => field.onChange(parseInt(value))}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select max members" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="4">4 members</SelectItem>
                        <SelectItem value="6">6 members</SelectItem>
                        <SelectItem value="8">8 members</SelectItem>
                        <SelectItem value="10">10 members</SelectItem>
                        <SelectItem value="12">12 members</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Creating a savings hub generates a unique invite code you can share with friends.
                Members contribute regularly toward the shared goal, building savings discipline together.
              </AlertDescription>
            </Alert>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Creating Hub...' : 'Create Savings Hub'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}