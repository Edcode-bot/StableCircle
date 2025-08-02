import { Group } from '@shared/schema';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useGroups } from '@/contexts/GroupContext';
import { useCountdown } from '@/hooks/useCountdown';
import { Users, Coins, Eye, Plus } from 'lucide-react';
import { Link } from 'wouter';

interface GroupCardProps {
  group: Group;
}

export function GroupCard({ group }: GroupCardProps) {
  const { getGroupMembers, getGroupContributions } = useGroups();
  const members = getGroupMembers(group.id);
  const contributions = getGroupContributions(group.id);
  
  // Calculate next payout date (simplified - in production this would be more complex)
  const nextPayoutDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // 3 days from now
  const countdown = useCountdown(nextPayoutDate);

  const totalContributed = contributions.reduce((sum, c) => sum + c.amount, 0);
  const progress = Math.min((members.length / group.maxMembers) * 100, 100);
  const yourContribution = contributions
    .filter(c => c.memberId === members.find(m => m.isAdmin)?.id)
    .reduce((sum, c) => sum + c.amount, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-lg font-semibold text-gray-900">{group.name}</h4>
            <p className="text-sm text-gray-500">
              {members.length} members • Created {new Date(group.createdAt).toLocaleDateString()}
            </p>
          </div>
          <Badge className={getStatusColor(group.status)}>
            {group.status.charAt(0).toUpperCase() + group.status.slice(1)}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500">Your Contribution</p>
            <p className="text-lg font-semibold text-gray-900">{yourContribution} cUSD</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Pool</p>
            <p className="text-lg font-semibold text-gray-900">{totalContributed} cUSD</p>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-500">Round Progress</span>
            <span className="text-gray-900 font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="w-full h-2" />
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Next Payout In</p>
              <p className="text-xl font-bold text-gray-900">{countdown.formatted}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Next Recipient</p>
              <p className="text-sm font-medium text-gray-900">
                {members[group.currentRound % members.length]?.name || 'TBD'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          <Button className="flex-1" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Contribute
          </Button>
          <Button variant="outline" className="flex-1" size="sm" asChild>
            <Link href={`/group/${group.id}`}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
