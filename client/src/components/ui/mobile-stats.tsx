import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Target, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileStatsProps {
  totalSaved: number;
  progressToGoal: number;
  currentStreak: number;
  className?: string;
}

export function MobileStats({ 
  totalSaved, 
  progressToGoal, 
  currentStreak, 
  className 
}: MobileStatsProps) {
  return (
    <div className={cn("grid grid-cols-3 gap-3", className)}>
      <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <div className="text-lg font-bold text-green-700 dark:text-green-300">
            ${totalSaved.toFixed(2)}
          </div>
          <div className="text-xs text-green-600 dark:text-green-400">
            Total Saved
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-lg font-bold text-blue-700 dark:text-blue-300">
            {progressToGoal}%
          </div>
          <div className="text-xs text-blue-600 dark:text-blue-400">
            Goal Progress
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-700">
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Zap className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          </div>
          <div className="text-lg font-bold text-orange-700 dark:text-orange-300">
            {currentStreak}
          </div>
          <div className="text-xs text-orange-600 dark:text-orange-400">
            Day Streak
          </div>
        </CardContent>
      </Card>
    </div>
  );
}