import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Star, Zap, Trophy, Target, Users, Clock, 
  TrendingUp, Gift, Award, Crown, Shield, Flame 
} from 'lucide-react';

interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  requirement: string;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
}

interface GamificationBadgesProps {
  userBadges: string[];
  userStats: {
    streak: number;
    totalContributions: number;
    totalSaved: number;
    referrals: number;
    hubsCreated: number;
    daysActive: number;
  };
}

export function GamificationBadges({ userBadges, userStats }: GamificationBadgesProps) {
  const badges: BadgeDefinition[] = [
    {
      id: 'early_adopter',
      name: 'Early Adopter',
      description: 'One of the first 100 users',
      icon: Star,
      color: 'text-purple-600',
      requirement: 'Be among first 100 users',
      unlocked: userBadges.includes('early_adopter'),
    },
    {
      id: 'streak_starter',
      name: 'Streak Starter',
      description: 'Maintain a 3-day savings streak',
      icon: Flame,
      color: 'text-orange-600',
      requirement: '3-day streak',
      unlocked: userBadges.includes('streak_starter'),
      progress: Math.min(userStats.streak, 3),
      maxProgress: 3,
    },
    {
      id: 'consistent_saver',
      name: 'Consistent Saver',
      description: 'Maintain a 7-day savings streak',
      icon: Zap,
      color: 'text-yellow-600',
      requirement: '7-day streak',
      unlocked: userBadges.includes('consistent_saver'),
      progress: Math.min(userStats.streak, 7),
      maxProgress: 7,
    },
    {
      id: 'streak_master',
      name: 'Streak Master',
      description: 'Maintain a 30-day savings streak',
      icon: Crown,
      color: 'text-gold-600',
      requirement: '30-day streak',
      unlocked: userBadges.includes('streak_master'),
      progress: Math.min(userStats.streak, 30),
      maxProgress: 30,
    },
    {
      id: 'goal_crusher',
      name: 'Goal Crusher',
      description: 'Reach 5 savings goals',
      icon: Trophy,
      color: 'text-blue-600',
      requirement: 'Complete 5 goals',
      unlocked: userBadges.includes('goal_crusher'),
      progress: Math.min(userStats.totalContributions / 10, 5),
      maxProgress: 5,
    },
    {
      id: 'community_builder',
      name: 'Community Builder',
      description: 'Invite 5 friends to join',
      icon: Users,
      color: 'text-green-600',
      requirement: '5 successful referrals',
      unlocked: userBadges.includes('community_builder'),
      progress: Math.min(userStats.referrals, 5),
      maxProgress: 5,
    },
    {
      id: 'hub_creator',
      name: 'Hub Creator',
      description: 'Create your first savings hub',
      icon: Target,
      color: 'text-indigo-600',
      requirement: 'Create 1 hub',
      unlocked: userBadges.includes('hub_creator'),
      progress: Math.min(userStats.hubsCreated, 1),
      maxProgress: 1,
    },
    {
      id: 'savings_hero',
      name: 'Savings Hero',
      description: 'Save over $1000 total',
      icon: Shield,
      color: 'text-red-600',
      requirement: 'Save $1000+',
      unlocked: userBadges.includes('savings_hero'),
      progress: Math.min(userStats.totalSaved / 1000, 1),
      maxProgress: 1,
    },
    {
      id: 'active_member',
      name: 'Active Member',
      description: 'Stay active for 30 days',
      icon: Clock,
      color: 'text-gray-600',
      requirement: '30 days active',
      unlocked: userBadges.includes('active_member'),
      progress: Math.min(userStats.daysActive, 30),
      maxProgress: 30,
    },
    {
      id: 'milestone_master',
      name: 'Milestone Master',
      description: 'Reach 10 contribution milestones',
      icon: Award,
      color: 'text-pink-600',
      requirement: '10 milestones',
      unlocked: userBadges.includes('milestone_master'),
      progress: Math.min(userStats.totalContributions, 10),
      maxProgress: 10,
    }
  ];

  const unlockedBadges = badges.filter(b => b.unlocked);
  const availableBadges = badges.filter(b => !b.unlocked);

  return (
    <div className="space-y-6">
      {/* Unlocked Badges */}
      {unlockedBadges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Your Badges ({unlockedBadges.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {unlockedBadges.map((badge) => {
                const Icon = badge.icon;
                return (
                  <div
                    key={badge.id}
                    className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg border-2 border-yellow-200 dark:border-yellow-700"
                  >
                    <div className="text-center">
                      <div className={`mx-auto mb-2 p-3 rounded-full bg-white dark:bg-gray-800 shadow-sm`}>
                        <Icon className={`h-6 w-6 ${badge.color}`} />
                      </div>
                      <h3 className="font-semibold text-sm mb-1">{badge.name}</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {badge.description}
                      </p>
                      <Badge variant="secondary" className="mt-2 text-xs">
                        Unlocked
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Badges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Available Badges
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableBadges.map((badge) => {
              const Icon = badge.icon;
              const hasProgress = badge.progress !== undefined && badge.maxProgress !== undefined;
              const progressPercentage = hasProgress 
                ? Math.round((badge.progress! / badge.maxProgress!) * 100) 
                : 0;

              return (
                <div
                  key={badge.id}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700">
                      <Icon className={`h-5 w-5 ${badge.color} opacity-60`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm mb-1">{badge.name}</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                        {badge.description}
                      </p>
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        {badge.requirement}
                      </p>
                      
                      {hasProgress && (
                        <div className="mt-3">
                          <div className="flex justify-between text-xs mb-1">
                            <span>Progress</span>
                            <span>{badge.progress}/{badge.maxProgress}</span>
                          </div>
                          <Progress value={progressPercentage} className="h-2" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Badge Stats */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Badge Collection</h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-2xl font-bold text-blue-600">{unlockedBadges.length}</p>
                <p className="text-blue-500">Earned</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-600">{availableBadges.length}</p>
                <p className="text-gray-500">Available</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">
                  {Math.round((unlockedBadges.length / badges.length) * 100)}%
                </p>
                <p className="text-purple-500">Complete</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}