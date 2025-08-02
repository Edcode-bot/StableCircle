import { useState, useEffect } from 'react';
import { User } from '@shared/schema';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useWallet } from '@/contexts/WalletContext';
import { storageService } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { Users, Coins, Copy, ExternalLink, Trophy } from 'lucide-react';
import { Link } from 'wouter';

export function ReferralSection() {
  const { address } = useWallet();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [referralLink, setReferralLink] = useState('');

  useEffect(() => {
    if (address) {
      // Get or create user
      const userData = storageService.createOrGetUser(address);
      setUser(userData);
      setReferralLink(storageService.generateReferralLink(userData.referralCode));
    }
  }, [address]);

  const copyReferralLink = async () => {
    await navigator.clipboard.writeText(referralLink);
    toast({
      title: "Referral Link Copied",
      description: "Share this link with friends to earn 5 cUSD per successful referral",
    });
  };

  const copyReferralCode = async () => {
    await navigator.clipboard.writeText(user?.referralCode || '');
    toast({
      title: "Referral Code Copied",
      description: "Share this code with friends to earn rewards",
    });
  };

  if (!address || !user) {
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
                <span>{user.referrals} Referrals</span>
              </div>
              <div className="flex items-center">
                <Coins className="mr-2 h-4 w-4" />
                <span>{user.totalEarned} cUSD Earned</span>
              </div>
            </div>
          </div>
          <div className="flex-shrink-0">
            <div className="bg-white bg-opacity-10 rounded-lg p-6 text-center backdrop-blur-sm">
              <p className="text-sm text-blue-100 mb-2">Your Referral Code</p>
              <p className="text-xl font-mono font-bold mb-4">{user.referralCode}</p>
              <div className="space-y-2">
                <Button
                  onClick={copyReferralLink}
                  variant="secondary"
                  className="bg-white text-primary hover:bg-gray-100 w-full"
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Link
                </Button>
                <div className="flex space-x-2">
                  <Button
                    onClick={copyReferralCode}
                    variant="outline"
                    size="sm"
                    className="border-white text-white hover:bg-white hover:text-primary"
                  >
                    <Copy className="mr-2 h-3 w-3" />
                    Code
                  </Button>
                  <Link href="/leaderboard">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-white text-white hover:bg-white hover:text-primary"
                    >
                      <Trophy className="mr-2 h-3 w-3" />
                      Rankings
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
