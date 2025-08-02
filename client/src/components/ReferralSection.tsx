import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useWallet } from '@/contexts/WalletContext';
import { storageService } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { Users, Coins, Copy } from 'lucide-react';

export function ReferralSection() {
  const { address } = useWallet();
  const { toast } = useToast();
  const [referralCode] = useState(() => storageService.generateReferralCode());

  const copyReferralCode = async () => {
    await navigator.clipboard.writeText(referralCode);
    toast({
      title: "Referral Code Copied",
      description: "Share this code with friends to earn rewards",
    });
  };

  if (!address) {
    return null;
  }

  return (
    <Card className="gradient-card text-white overflow-hidden">
      <CardContent className="p-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0 md:mr-8">
            <h3 className="text-2xl font-bold mb-2">Refer Friends & Earn Rewards</h3>
            <p className="text-blue-100 mb-4">
              Invite friends to join StableCircle and earn 5 cUSD for each successful referral
            </p>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                <span>0 Referrals</span>
              </div>
              <div className="flex items-center">
                <Coins className="mr-2 h-4 w-4" />
                <span>0 cUSD Earned</span>
              </div>
            </div>
          </div>
          <div className="flex-shrink-0">
            <div className="bg-white bg-opacity-10 rounded-lg p-6 text-center backdrop-blur-sm">
              <p className="text-sm text-blue-100 mb-2">Your Referral Code</p>
              <p className="text-xl font-mono font-bold mb-4">{referralCode}</p>
              <Button
                onClick={copyReferralCode}
                variant="secondary"
                className="bg-white text-primary hover:bg-gray-100"
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy Code
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
