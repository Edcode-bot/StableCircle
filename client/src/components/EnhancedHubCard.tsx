import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Target, Clock, Users, TrendingUp, Share2, 
  Zap, Gift, ChevronDown, ChevronUp, DollarSign,
  Calendar, Award
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useWallet } from '@/contexts/WalletContext';
import { motion, AnimatePresence } from 'framer-motion';

interface HubCardProps {
  hub: {
    id: string;
    name: string;
    goal: number;
    deadline: string;
    totalSaved: number;
    userContribution: number;
    contributionAmount: number;
    members: number;
    maxMembers: number;
    status: 'active' | 'completed' | 'pending';
    inviteCode: string;
    userStreak?: number;
    badgeEarned?: string;
  };
  onContribute?: (hubId: string) => void;
  onViewHistory?: (hubId: string) => void;
}

export function EnhancedHubCard({ hub, onContribute, onViewHistory }: HubCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isContributing, setIsContributing] = useState(false);
  const { toast } = useToast();
  const { isConnected, transferCUSD } = useWallet();

  const progressPercentage = Math.min((hub.totalSaved / hub.goal) * 100, 100);
  const daysLeft = Math.max(0, Math.ceil((new Date(hub.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
  const isUrgent = daysLeft <= 7;
  const isCompleted = hub.status === 'completed' || progressPercentage >= 100;

  const handleSaveNow = async () => {
    if (!isConnected || !onContribute) return;
    
    setIsContributing(true);
    try {
      // Simulate cUSD transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      onContribute(hub.id);
      
      toast({
        title: "Contribution Successful!",
        description: `Saved $${hub.contributionAmount} to ${hub.name}`,
      });
    } catch (error) {
      toast({
        title: "Contribution Failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsContributing(false);
    }
  };

  const handleShare = async () => {
    const shareText = `Join my savings hub "${hub.name}" on StableCircle! Use invite code: ${hub.inviteCode}`;
    const shareUrl = `${window.location.origin}/join-hub?code=${hub.inviteCode}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join ${hub.name} on StableCircle`,
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        await copyToClipboard(shareUrl);
      }
    } else {
      await copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Invite Link Copied!",
        description: "Share with friends to invite them to your hub",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Please copy the invite code manually: " + hub.inviteCode,
        variant: "destructive",
      });
    }
  };

  const getStatusColor = () => {
    if (isCompleted) return 'bg-green-100 text-green-800 border-green-200';
    if (isUrgent) return 'bg-red-100 text-red-800 border-red-200';
    return 'bg-blue-100 text-blue-800 border-blue-200';
  };

  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      case 'early_bird': return <Zap className="h-3 w-3" />;
      case 'consistent': return <Target className="h-3 w-3" />;
      case 'champion': return <Award className="h-3 w-3" />;
      default: return <Gift className="h-3 w-3" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`
        relative overflow-hidden transition-all duration-300 hover:shadow-lg
        ${isCompleted ? 'border-green-200 bg-green-50/50' : ''}
        ${isUrgent && !isCompleted ? 'border-red-200 bg-red-50/50' : ''}
      `}>
        {/* Header */}
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-semibold truncate">
                {hub.name}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={getStatusColor()}>
                  {isCompleted ? 'Completed' : isUrgent ? 'Urgent' : 'Active'}
                </Badge>
                {hub.userStreak && hub.userStreak > 0 && (
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                    <Zap className="h-3 w-3 mr-1" />
                    {hub.userStreak} day streak
                  </Badge>
                )}
                {hub.badgeEarned && (
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                    {getBadgeIcon(hub.badgeEarned)}
                    <span className="ml-1 capitalize">{hub.badgeEarned}</span>
                  </Badge>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? <ChevronUp /> : <ChevronDown />}
            </Button>
          </div>
        </CardHeader>

        {/* Main Content */}
        <CardContent className="space-y-4">
          {/* Progress Section */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Progress</span>
              <span className="text-gray-600">
                ${hub.totalSaved.toFixed(2)} / ${hub.goal.toFixed(2)}
              </span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{progressPercentage.toFixed(1)}% complete</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {daysLeft} days left
              </span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-lg font-bold text-green-600">
                ${hub.userContribution.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500">Your Total</p>
            </div>
            <div>
              <p className="text-lg font-bold text-blue-600">
                ${hub.contributionAmount.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500">Per Round</p>
            </div>
            <div>
              <p className="text-lg font-bold text-purple-600">
                {hub.members}/{hub.maxMembers}
              </p>
              <p className="text-xs text-gray-500">Members</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={handleSaveNow}
              disabled={isContributing || isCompleted || !isConnected}
              className="flex items-center gap-2"
            >
              <DollarSign className="h-4 w-4" />
              {isContributing ? 'Saving...' : 'Save Now'}
            </Button>
            <Button 
              variant="outline"
              onClick={handleShare}
              className="flex items-center gap-2"
            >
              <Share2 className="h-4 w-4" />
              Invite Friends
            </Button>
          </div>

          {/* Expandable Details */}
          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-3 border-t pt-3"
              >
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="font-medium">Deadline</p>
                      <p className="text-gray-600">
                        {new Date(hub.deadline).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="font-medium">Invite Code</p>
                      <p className="text-gray-600 font-mono">{hub.inviteCode}</p>
                    </div>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onViewHistory?.(hub.id)}
                  className="w-full"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Contribution History
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>

        {/* Completion Celebration */}
        {isCompleted && (
          <div className="absolute top-2 right-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <Award className="h-6 w-6 text-gold-500" />
            </motion.div>
          </div>
        )}
      </Card>
    </motion.div>
  );
}