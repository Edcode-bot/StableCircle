import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { joinHubSchema, JoinHub } from '@shared/schema';
import { useWallet } from '@/contexts/WalletContext';
import { UserPlus, Users, DollarSign, Calendar, Target } from 'lucide-react';

interface JoinHubFormProps {
  onSuccess?: () => void;
}

export function JoinHubForm({ onSuccess }: JoinHubFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewHub, setPreviewHub] = useState<any>(null);
  const [isValidating, setIsValidating] = useState(false);
  const { address, isConnected } = useWallet();

  const form = useForm<JoinHub>({
    resolver: zodResolver(joinHubSchema),
    defaultValues: {
      inviteCode: '',
      name: '',
    },
  });

  const inviteCode = form.watch('inviteCode');

  // Preview hub when invite code is entered
  useEffect(() => {
    const validateInviteCode = async () => {
      if (inviteCode && inviteCode.length >= 6) {
        setIsValidating(true);
        try {
          // In a real app, this would make an API call to validate the invite code
          // For now, we'll simulate a hub preview
          const response = await fetch(`/api/hubs/preview/${inviteCode}`);
          if (response.ok) {
            const hubData = await response.json();
            setPreviewHub(hubData);
          } else {
            setPreviewHub(null);
          }
        } catch (error) {
          console.error('Failed to validate invite code:', error);
          setPreviewHub(null);
        } finally {
          setIsValidating(false);
        }
      } else {
        setPreviewHub(null);
      }
    };

    const debounceTimer = setTimeout(validateInviteCode, 500);
    return () => clearTimeout(debounceTimer);
  }, [inviteCode]);

  const onSubmit = async (data: JoinHub) => {
    if (!isConnected || !address) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/hubs/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, wallet: address }),
      });

      if (response.ok) {
        form.reset();
        setPreviewHub(null);
        onSuccess?.();
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to join hub');
      }
    } catch (error) {
      console.error('Failed to join savings hub:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isConnected) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-gray-500">Please connect your wallet to join a savings hub</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <UserPlus className="h-5 w-5" />
          <span>Join Savings Hub</span>
        </CardTitle>
        <p className="text-sm text-gray-600">
          Enter an invite code to join an existing savings hub
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
                  <FormLabel>Invite Code</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter 6-digit invite code"
                      className="uppercase tracking-widest text-center text-lg font-mono"
                      maxLength={6}
                      {...field}
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isValidating && (
              <div className="text-center text-sm text-gray-500">
                Validating invite code...
              </div>
            )}

            {previewHub && (
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg text-blue-900">{previewHub.name}</h3>
                      {previewHub.description && (
                        <p className="text-sm text-blue-700 mt-1">{previewHub.description}</p>
                      )}
                    </div>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {previewHub.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-blue-600" />
                      <div>
                        <p className="text-blue-700 font-medium">${previewHub.goal}</p>
                        <p className="text-blue-600">Goal</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <div>
                        <p className="text-green-700 font-medium">${previewHub.contributionAmount}</p>
                        <p className="text-green-600">Per Round</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-purple-600" />
                      <div>
                        <p className="text-purple-700 font-medium">{previewHub.memberCount}</p>
                        <p className="text-purple-600">Members</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-orange-600" />
                      <div>
                        <p className="text-orange-700 font-medium">{previewHub.duration}</p>
                        <p className="text-orange-600">Days</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Display Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your name for this hub" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {previewHub && (
              <Alert>
                <UserPlus className="h-4 w-4" />
                <AlertDescription>
                  You're about to join <strong>{previewHub.name}</strong>. 
                  Make sure you can commit to the contribution schedule.
                </AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              disabled={isSubmitting || !previewHub} 
              className="w-full"
            >
              {isSubmitting ? 'Joining Hub...' : 'Join Savings Hub'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}