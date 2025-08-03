import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Lightbulb, TrendingUp, Clock, Target, AlertTriangle, 
  CheckCircle, ArrowRight, Calculator, Calendar, DollarSign 
} from 'lucide-react';

interface SuggestionData {
  id: string;
  type: 'goal_adjustment' | 'contribution_increase' | 'streak_warning' | 'milestone_celebration' | 'efficiency_tip';
  priority: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  action?: string;
  actionLabel?: string;
  calculation?: {
    current: number;
    suggested: number;
    impact: string;
  };
}

interface SmartSuggestionsProps {
  userStats: {
    totalSaved: number;
    currentGoal: number;
    dailyAverage: number;
    streak: number;
    lastContribution: string;
    targetDate?: string;
  };
  onActionTaken?: (suggestionId: string) => void;
}

export function SmartSuggestions({ userStats, onActionTaken }: SmartSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<SuggestionData[]>([]);
  const [dismissedSuggestions, setDismissedSuggestions] = useState<Set<string>>(new Set());

  useEffect(() => {
    generateSuggestions();
  }, [userStats]);

  const generateSuggestions = () => {
    const newSuggestions: SuggestionData[] = [];
    const today = new Date();
    const lastContribution = new Date(userStats.lastContribution);
    const daysSinceLastContribution = Math.floor((today.getTime() - lastContribution.getTime()) / (1000 * 60 * 60 * 24));

    // Streak warning
    if (daysSinceLastContribution >= 1 && userStats.streak > 0) {
      newSuggestions.push({
        id: 'streak_warning',
        type: 'streak_warning',
        priority: 'high',
        title: 'Streak at Risk!',
        description: `You haven't contributed in ${daysSinceLastContribution} day(s). Don't break your ${userStats.streak}-day streak!`,
        action: 'contribute',
        actionLabel: 'Make Contribution Now'
      });
    }

    // Goal progress analysis
    const progressToGoal = (userStats.totalSaved / userStats.currentGoal) * 100;
    const targetDate = userStats.targetDate ? new Date(userStats.targetDate) : null;
    
    if (targetDate && progressToGoal < 70) {
      const daysRemaining = Math.floor((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      const remainingAmount = userStats.currentGoal - userStats.totalSaved;
      const requiredDailyAmount = remainingAmount / daysRemaining;
      
      if (requiredDailyAmount > userStats.dailyAverage * 1.5) {
        newSuggestions.push({
          id: 'goal_adjustment',
          type: 'goal_adjustment',
          priority: 'medium',
          title: 'Goal May Be Ambitious',
          description: `To reach your goal on time, you'd need to save $${requiredDailyAmount.toFixed(2)} daily, which is ${Math.round(((requiredDailyAmount / userStats.dailyAverage) - 1) * 100)}% more than your current pace.`,
          calculation: {
            current: userStats.dailyAverage,
            suggested: requiredDailyAmount,
            impact: `${daysRemaining} days remaining`
          }
        });
      }
    }

    // Contribution increase suggestion
    if (userStats.streak >= 7 && userStats.dailyAverage > 0) {
      const suggestedIncrease = userStats.dailyAverage * 1.2;
      newSuggestions.push({
        id: 'contribution_increase',
        type: 'contribution_increase',
        priority: 'low',
        title: 'Ready to Level Up?',
        description: `Your consistent 7+ day streak shows great discipline! Consider increasing your daily goal by 20%.`,
        calculation: {
          current: userStats.dailyAverage,
          suggested: suggestedIncrease,
          impact: `+$${((suggestedIncrease - userStats.dailyAverage) * 30).toFixed(2)} per month`
        },
        actionLabel: 'Adjust Goal'
      });
    }

    // Milestone celebration
    if (progressToGoal >= 25 && progressToGoal < 30) {
      newSuggestions.push({
        id: 'milestone_25',
        type: 'milestone_celebration',
        priority: 'low',
        title: '🎉 Quarter Way There!',
        description: `Congratulations! You've saved 25% toward your goal. Keep up the momentum!`,
        actionLabel: 'Share Achievement'
      });
    }

    if (progressToGoal >= 50 && progressToGoal < 55) {
      newSuggestions.push({
        id: 'milestone_50',
        type: 'milestone_celebration',
        priority: 'medium',
        title: '🎯 Halfway Milestone!',
        description: `Amazing progress! You're halfway to your savings goal. The finish line is in sight!`,
        actionLabel: 'Celebrate & Share'
      });
    }

    // Efficiency tips
    if (userStats.streak >= 14) {
      newSuggestions.push({
        id: 'efficiency_tip',
        type: 'efficiency_tip',
        priority: 'low',
        title: 'Automation Suggestion',
        description: 'With your 14+ day streak, consider setting up automatic contributions to maintain consistency effortlessly.',
        actionLabel: 'Learn More'
      });
    }

    // Filter out dismissed suggestions
    const filteredSuggestions = newSuggestions.filter(s => !dismissedSuggestions.has(s.id));
    setSuggestions(filteredSuggestions);
  };

  const handleActionClick = (suggestion: SuggestionData) => {
    onActionTaken?.(suggestion.id);
    setDismissedSuggestions(prev => new Set([...prev, suggestion.id]));
  };

  const handleDismiss = (suggestionId: string) => {
    setDismissedSuggestions(prev => new Set([...prev, suggestionId]));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50 dark:border-red-700 dark:bg-red-900/20';
      case 'medium': return 'border-yellow-200 bg-yellow-50 dark:border-yellow-700 dark:bg-yellow-900/20';
      case 'low': return 'border-blue-200 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20';
      default: return 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/20';
    }
  };

  const getPriorityIcon = (type: string) => {
    switch (type) {
      case 'streak_warning': return AlertTriangle;
      case 'goal_adjustment': return Target;
      case 'contribution_increase': return TrendingUp;
      case 'milestone_celebration': return CheckCircle;
      case 'efficiency_tip': return Lightbulb;
      default: return Lightbulb;
    }
  };

  if (suggestions.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Lightbulb className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <p className="text-gray-500">No suggestions at the moment. Keep saving!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          Smart Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestions.map((suggestion) => {
          const Icon = getPriorityIcon(suggestion.type);
          return (
            <Alert key={suggestion.id} className={getPriorityColor(suggestion.priority)}>
              <Icon className="h-4 w-4" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <AlertDescription className="font-medium">
                    {suggestion.title}
                  </AlertDescription>
                  <Badge variant="outline" className="text-xs">
                    {suggestion.priority}
                  </Badge>
                </div>
                <AlertDescription className="text-sm mb-3">
                  {suggestion.description}
                </AlertDescription>

                {suggestion.calculation && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3 mb-3 text-sm">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="font-medium">${suggestion.calculation.current.toFixed(2)}</p>
                        <p className="text-xs text-gray-500">Current</p>
                      </div>
                      <div>
                        <ArrowRight className="h-4 w-4 mx-auto text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium">${suggestion.calculation.suggested.toFixed(2)}</p>
                        <p className="text-xs text-gray-500">Suggested</p>
                      </div>
                    </div>
                    <p className="text-center text-xs text-gray-600 mt-2">
                      {suggestion.calculation.impact}
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  {suggestion.actionLabel && (
                    <Button 
                      size="sm" 
                      onClick={() => handleActionClick(suggestion)}
                    >
                      {suggestion.actionLabel}
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDismiss(suggestion.id)}
                  >
                    Dismiss
                  </Button>
                </div>
              </div>
            </Alert>
          );
        })}
      </CardContent>
    </Card>
  );
}