import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Lightbulb, 
  TrendingUp, 
  Users, 
  Target, 
  Clock, 
  Zap,
  X,
  CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Suggestion {
  id: string;
  type: 'increase_contribution' | 'join_hub' | 'create_hub' | 'streak' | 'referral';
  title: string;
  description: string;
  impact: string;
  priority: 'high' | 'medium' | 'low';
  actionText: string;
}

interface SmartSuggestionsProps {
  userStats: {
    totalSaved: number;
    currentStreak: number;
    hubsJoined: number;
    referrals: number;
  };
}

export function SmartSuggestions({ userStats }: SmartSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([
    {
      id: '1',
      type: 'increase_contribution',
      title: 'Boost Your Monthly Savings',
      description: 'You\'re saving $50/month. Increase to $75 to reach goals 33% faster.',
      impact: '+$300 per year',
      priority: 'high',
      actionText: 'Increase Amount'
    },
    {
      id: '2',
      type: 'streak',
      title: 'Maintain Your Streak',
      description: `You have a ${userStats.currentStreak}-day streak! Don't break it.`,
      impact: 'Unlock streak rewards',
      priority: 'medium',
      actionText: 'Set Reminder'
    },
    {
      id: '3',
      type: 'join_hub',
      title: 'Join "Emergency Fund"',
      description: 'Perfect match for your savings goals. 6 members, $200 target.',
      impact: 'Build emergency fund',
      priority: 'medium',
      actionText: 'Join Hub'
    },
    {
      id: '4',
      type: 'referral',
      title: 'Invite Friends for Rewards',
      description: 'Earn $10 in cUSD for each friend who joins and makes their first contribution.',
      impact: 'Earn while helping friends',
      priority: 'low',
      actionText: 'Share Link'
    }
  ]);

  const [dismissedSuggestions, setDismissedSuggestions] = useState<string[]>([]);

  const activeSuggestions = suggestions.filter(s => !dismissedSuggestions.includes(s.id));

  const dismissSuggestion = (id: string) => {
    setDismissedSuggestions(prev => [...prev, id]);
  };

  const takeSuggestionAction = (suggestion: Suggestion) => {
    switch (suggestion.type) {
      case 'increase_contribution':
        // Navigate to contribution settings
        console.log('Opening contribution settings');
        break;
      case 'join_hub':
        // Navigate to hub joining
        console.log('Opening hub join flow');
        break;
      case 'create_hub':
        // Navigate to hub creation
        console.log('Opening hub creation');
        break;
      case 'streak':
        // Set up reminder/notification
        console.log('Setting up streak reminder');
        break;
      case 'referral':
        // Open referral sharing
        console.log('Opening referral sharing');
        break;
    }
    dismissSuggestion(suggestion.id);
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'increase_contribution': return <TrendingUp className="h-5 w-5 text-green-500" />;
      case 'join_hub': return <Users className="h-5 w-5 text-blue-500" />;
      case 'create_hub': return <Target className="h-5 w-5 text-purple-500" />;
      case 'streak': return <Zap className="h-5 w-5 text-orange-500" />;
      case 'referral': return <Users className="h-5 w-5 text-pink-500" />;
      default: return <Lightbulb className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (activeSuggestions.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-3" />
          <h3 className="font-medium mb-2">You're all caught up!</h3>
          <p className="text-gray-600 text-sm">
            Keep up the great savings habits. New suggestions will appear as you progress.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          Smart Suggestions ({activeSuggestions.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AnimatePresence>
          <div className="space-y-3">
            {activeSuggestions.slice(0, 3).map((suggestion) => (
              <motion.div
                key={suggestion.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
                className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2 flex-1">
                    {getSuggestionIcon(suggestion.type)}
                    <h4 className="font-medium text-sm">{suggestion.title}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getPriorityColor(suggestion.priority)}>
                      {suggestion.priority}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => dismissSuggestion(suggestion.id)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">
                  {suggestion.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-green-600 font-medium">
                    💡 {suggestion.impact}
                  </span>
                  <Button
                    size="sm"
                    onClick={() => takeSuggestionAction(suggestion)}
                    className="h-7 text-xs"
                  >
                    {suggestion.actionText}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>

        {activeSuggestions.length > 3 && (
          <div className="mt-3 text-center">
            <Button variant="outline" size="sm">
              View All Suggestions ({activeSuggestions.length - 3} more)
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}