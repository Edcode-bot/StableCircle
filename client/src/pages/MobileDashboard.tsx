import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MobileStats } from '@/components/ui/mobile-stats';
import { BottomNavigation } from '@/components/ui/bottom-navigation';
import { useWallet } from '@/contexts/WalletContext';
import { 
  Users, Plus, MessageCircle, Share2, TrendingUp, 
  Star, Zap, Trophy, Gift, Clock, ArrowRight 
} from 'lucide-react';
import { Link } from 'wouter';

interface RecentActivity {
  id: string;
  type: 'contribution' | 'joined' | 'goal_reached' | 'streak';
  description: string;
  timestamp: string;
  amount?: number;
}

export default function MobileDashboard() {
  const { address, isConnected } = useWallet();
  const [userHubs, setUserHubs] = useState([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [globalStats, setGlobalStats] = useState({
    totalSaved: 0,
    totalHubs: 0,
    totalUsers: 0,
    communityStreak: 0
  });

  // User stats
  const [userStats, setUserStats] = useState({
    totalSaved: 450.50,
    progressToGoal: 75,
    currentStreak: 12,
    badges: ['early_adopter', 'consistent_saver'],
    totalInvites: 3
  });

  useEffect(() => {
    if (isConnected && address) {
      loadUserData();
      loadGlobalStats();
    }
  }, [isConnected, address]);

  const loadUserData = async () => {
    try {
      // Load user hubs
      const hubsResponse = await fetch(`/api/users/${address}/hubs`);
      if (hubsResponse.ok) {
        setUserHubs(await hubsResponse.json());
      }

      // Load recent activity
      setRecentActivity([
        {
          id: '1',
          type: 'contribution',
          description: 'Made contribution to Emergency Fund Hub',
          timestamp: '2 hours ago',
          amount: 50
        },
        {
          id: '2',
          type: 'streak',
          description: 'Achieved 12-day savings streak!',
          timestamp: 'Yesterday'
        },
        {
          id: '3',
          type: 'joined',
          description: 'Joined Vacation Savings Hub',
          timestamp: '3 days ago'
        }
      ]);
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const loadGlobalStats = async () => {
    try {
      const response = await fetch('/api/stats');
      if (response.ok) {
        setGlobalStats(await response.json());
      }
    } catch (error) {
      console.error('Failed to load global stats:', error);
    }
  };

  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      case 'early_adopter': return <Star className="h-4 w-4" />;
      case 'consistent_saver': return <Zap className="h-4 w-4" />;
      case 'goal_crusher': return <Trophy className="h-4 w-4" />;
      default: return <Gift className="h-4 w-4" />;
    }
  };

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'early_adopter': return 'bg-purple-100 text-purple-800';
      case 'consistent_saver': return 'bg-orange-100 text-orange-800';
      case 'goal_crusher': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Welcome back!
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/invite">
                  <Share2 className="h-4 w-4 mr-1" />
                  Invite
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Quick Stats */}
        <MobileStats
          totalSaved={userStats.totalSaved}
          progressToGoal={userStats.progressToGoal}
          currentStreak={userStats.currentStreak}
        />

        {/* Badges */}
        {userStats.badges.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Your Badges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {userStats.badges.map((badge) => (
                  <Badge 
                    key={badge} 
                    variant="secondary" 
                    className={getBadgeColor(badge)}
                  >
                    {getBadgeIcon(badge)}
                    <span className="ml-1 capitalize">{badge.replace('_', ' ')}</span>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Active Hubs */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5" />
                My Savings Hubs ({userHubs.length})
              </CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link href="/create-hub">
                  <Plus className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {userHubs.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                <p className="text-gray-500 mb-3">No savings hubs yet</p>
                <Button asChild>
                  <Link href="/create-hub">Create Your First Hub</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {userHubs.slice(0, 3).map((hub: any) => (
                  <div 
                    key={hub.id}
                    className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{hub.name}</h3>
                      <Badge variant={hub.status === 'active' ? 'default' : 'secondary'}>
                        {hub.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>${hub.totalSaved} / ${hub.goal}</span>
                      <span>{Math.round((hub.totalSaved / hub.goal) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${Math.min((hub.totalSaved / hub.goal) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
                {userHubs.length > 3 && (
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/hubs">
                      View All Hubs
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivity.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No recent activity</p>
            ) : (
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3">
                    <div className={`
                      p-2 rounded-full 
                      ${activity.type === 'contribution' ? 'bg-green-100 text-green-600' : ''}
                      ${activity.type === 'streak' ? 'bg-orange-100 text-orange-600' : ''}
                      ${activity.type === 'joined' ? 'bg-blue-100 text-blue-600' : ''}
                      ${activity.type === 'goal_reached' ? 'bg-yellow-100 text-yellow-600' : ''}
                    `}>
                      {activity.type === 'contribution' && <TrendingUp className="h-4 w-4" />}
                      {activity.type === 'streak' && <Zap className="h-4 w-4" />}
                      {activity.type === 'joined' && <Users className="h-4 w-4" />}
                      {activity.type === 'goal_reached' && <Trophy className="h-4 w-4" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.description}</p>
                      <p className="text-xs text-gray-500">{activity.timestamp}</p>
                    </div>
                    {activity.amount && (
                      <span className="text-sm font-medium text-green-600">
                        +${activity.amount}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Community Impact */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Community Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                  ${globalStats.totalSaved.toLocaleString()}
                </p>
                <p className="text-sm text-blue-600 dark:text-blue-400">Total Saved</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                  {globalStats.totalHubs}
                </p>
                <p className="text-sm text-blue-600 dark:text-blue-400">Active Hubs</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                  {globalStats.totalUsers}
                </p>
                <p className="text-sm text-blue-600 dark:text-blue-400">Community</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                  {globalStats.communityStreak}
                </p>
                <p className="text-sm text-blue-600 dark:text-blue-400">Streak Days</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" asChild>
            <Link href="/join-hub">
              <UserPlus className="h-4 w-4 mr-2" />
              Join Hub
            </Link>
          </Button>
          <Button asChild>
            <Link href="/create-hub">
              <Plus className="h-4 w-4 mr-2" />
              Create Hub
            </Link>
          </Button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}