import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, DollarSign, Award, Globe, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface GlobalStats {
  totalSaved: number;
  totalUsers: number;
  totalHubs: number;
  totalCountries: number;
  topContributor: string;
  recentActivity: Array<{
    id: string;
    type: 'contribution' | 'hub_created' | 'milestone';
    message: string;
    timestamp: string;
    amount?: number;
  }>;
}

export function GlobalImpactTracker() {
  const [stats, setStats] = useState<GlobalStats>({
    totalSaved: 125847,
    totalUsers: 1843,
    totalHubs: 247,
    totalCountries: 12,
    topContributor: 'CeloBuilder',
    recentActivity: [
      {
        id: '1',
        type: 'contribution',
        message: 'Alex saved $50 in "Emergency Fund Hub"',
        timestamp: '2 minutes ago',
        amount: 50
      },
      {
        id: '2',
        type: 'hub_created',
        message: 'New hub "Vacation Squad" created by Maria',
        timestamp: '5 minutes ago'
      },
      {
        id: '3',
        type: 'milestone',
        message: 'Family Savings reached their $2,000 goal!',
        timestamp: '12 minutes ago'
      },
      {
        id: '4',
        type: 'contribution',
        message: 'Sam saved $25 in "Dream Car Fund"',
        timestamp: '18 minutes ago',
        amount: 25
      }
    ]
  });

  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setIsAnimating(true);
      setStats(prev => ({
        ...prev,
        totalSaved: prev.totalSaved + Math.floor(Math.random() * 100) + 25,
        totalUsers: prev.totalUsers + Math.floor(Math.random() * 3),
        recentActivity: [
          {
            id: Date.now().toString(),
            type: 'contribution',
            message: `Someone saved $${25 + Math.floor(Math.random() * 75)} in a savings hub`,
            timestamp: 'Just now',
            amount: 25 + Math.floor(Math.random() * 75)
          },
          ...prev.recentActivity.slice(0, 3)
        ]
      }));

      setTimeout(() => setIsAnimating(false), 1000);
    }, 15000); // Update every 15 seconds

    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'contribution': return <DollarSign className="h-4 w-4 text-green-500" />;
      case 'hub_created': return <Users className="h-4 w-4 text-blue-500" />;
      case 'milestone': return <Award className="h-4 w-4 text-purple-500" />;
      default: return <Zap className="h-4 w-4 text-orange-500" />;
    }
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <Globe className="h-5 w-5" />
          Global Impact Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <motion.div 
              className="text-2xl font-bold text-green-600"
              animate={isAnimating ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.5 }}
            >
              ${formatNumber(stats.totalSaved)}
            </motion.div>
            <p className="text-sm text-gray-600">Total Saved</p>
          </div>
          <div className="text-center">
            <motion.div 
              className="text-2xl font-bold text-blue-600"
              animate={isAnimating ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {formatNumber(stats.totalUsers)}
            </motion.div>
            <p className="text-sm text-gray-600">Active Savers</p>
          </div>
          <div className="text-center">
            <motion.div 
              className="text-2xl font-bold text-purple-600"
              animate={isAnimating ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {stats.totalHubs}
            </motion.div>
            <p className="text-sm text-gray-600">Savings Hubs</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {stats.totalCountries}
            </div>
            <p className="text-sm text-gray-600">Countries</p>
          </div>
        </div>

        {/* Top Contributor */}
        <div className="text-center p-3 bg-white/60 rounded-lg">
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 mb-2">
            <Award className="h-3 w-3 mr-1" />
            Top Contributor
          </Badge>
          <p className="font-medium text-gray-800">{stats.topContributor}</p>
        </div>

        {/* Live Activity Feed */}
        <div>
          <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Live Activity
          </h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            <AnimatePresence>
              {stats.recentActivity.map((activity) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-start gap-2 p-2 bg-white/40 rounded text-sm"
                >
                  {getActivityIcon(activity.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-700 truncate">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.timestamp}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Growth Indicator */}
        <div className="flex items-center justify-center gap-2 text-sm text-green-600">
          <TrendingUp className="h-4 w-4" />
          <span>Growing by 12% this month</span>
        </div>
      </CardContent>
    </Card>
  );
}