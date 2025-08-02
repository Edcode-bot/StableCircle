import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useWallet } from '@/contexts/WalletContext';
import { storageService } from '@/lib/storage';
import { User } from '@shared/schema';
import { Link } from 'wouter';
import { 
  Trophy, 
  Medal, 
  Award, 
  Users, 
  Coins, 
  ArrowLeft,
  Crown
} from 'lucide-react';

export default function Leaderboard() {
  const [topReferrers, setTopReferrers] = useState<User[]>([]);
  const [topContributors, setTopContributors] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { address } = useWallet();

  useEffect(() => {
    const loadLeaderboardData = () => {
      const users = storageService.getUsers();
      
      // Sort by referrals (top referrers)
      const sortedByReferrals = [...users]
        .sort((a, b) => b.referrals - a.referrals)
        .slice(0, 10);
      
      // Sort by total contributed (top contributors)
      const sortedByContributions = [...users]
        .sort((a, b) => b.totalContributed - a.totalContributed)
        .slice(0, 10);
      
      setTopReferrers(sortedByReferrals);
      setTopContributors(sortedByContributions);
      setLoading(false);
    };

    loadLeaderboardData();
  }, []);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 1:
        return <Trophy className="h-5 w-5 text-gray-400" />;
      case 2:
        return <Medal className="h-5 w-5 text-amber-600" />;
      default:
        return <Award className="h-5 w-5 text-gray-300" />;
    }
  };

  const getUserRank = (users: User[], userAddress: string): number => {
    return users.findIndex(user => user.walletAddress === userAddress) + 1;
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center">
            <Trophy className="mr-3 h-8 w-8 text-yellow-500" />
            StableCircle Leaderboard
          </h1>
          <p className="text-gray-600 mt-2">Top performers in our community</p>
        </div>
        <div className="w-32"></div> {/* Spacer for balance */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Referrers */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Top Referrers
            </CardTitle>
            <p className="text-blue-100 text-sm">Most successful community builders</p>
          </CardHeader>
          <CardContent className="p-0">
            {topReferrers.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Users className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <p>No referral data yet</p>
                <p className="text-sm">Be the first to invite friends!</p>
              </div>
            ) : (
              <div className="space-y-0">
                {topReferrers.map((user, index) => (
                  <div
                    key={user.id}
                    className={`flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      user.walletAddress === address ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        {getRankIcon(index)}
                        <span className="font-bold text-lg text-gray-600">
                          #{index + 1}
                        </span>
                      </div>
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-gradient-to-r from-blue-400 to-purple-500 text-white">
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500 font-mono">
                          {user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="font-bold">
                        {user.referrals} referrals
                      </Badge>
                      <p className="text-sm text-green-600 font-medium mt-1">
                        {user.totalEarned} cUSD earned
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Contributors */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-green-500 to-teal-600 text-white">
            <CardTitle className="flex items-center">
              <Coins className="mr-2 h-5 w-5" />
              Top Contributors
            </CardTitle>
            <p className="text-green-100 text-sm">Highest total savings contributions</p>
          </CardHeader>
          <CardContent className="p-0">
            {topContributors.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Coins className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <p>No contributions yet</p>
                <p className="text-sm">Start contributing to appear here!</p>
              </div>
            ) : (
              <div className="space-y-0">
                {topContributors.map((user, index) => (
                  <div
                    key={user.id}
                    className={`flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      user.walletAddress === address ? 'bg-green-50 border-green-200' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        {getRankIcon(index)}
                        <span className="font-bold text-lg text-gray-600">
                          #{index + 1}
                        </span>
                      </div>
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-gradient-to-r from-green-400 to-teal-500 text-white">
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500 font-mono">
                          {user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="font-bold bg-green-100 text-green-800">
                        {user.totalContributed} cUSD
                      </Badge>
                      <p className="text-sm text-gray-600 mt-1">
                        Total contributed
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* User's Current Rankings */}
      {address && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="mr-2 h-5 w-5" />
              Your Rankings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  #{getUserRank(topReferrers, address) || 'Unranked'}
                </div>
                <p className="text-sm text-gray-600">Referral Ranking</p>
                <p className="text-xs text-gray-500 mt-1">
                  {storageService.getUserByAddress(address)?.referrals || 0} referrals
                </p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  #{getUserRank(topContributors, address) || 'Unranked'}
                </div>
                <p className="text-sm text-gray-600">Contribution Ranking</p>
                <p className="text-xs text-gray-500 mt-1">
                  {storageService.getUserByAddress(address)?.totalContributed || 0} cUSD contributed
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Call to Action */}
      <div className="mt-8 text-center">
        <div className="bg-gradient-to-r from-primary to-secondary text-white p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-2">Want to climb the ranks?</h3>
          <p className="mb-4">Invite friends and make regular contributions to rise up the leaderboard!</p>
          <div className="flex justify-center space-x-4">
            <Link href="/dashboard">
              <Button variant="secondary">
                Start Contributing
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                Invite Friends
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}