import { useEffect, useState } from 'react';
import { useParams, Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ContributionModal } from '@/components/ContributionModal';
import { useGroups } from '@/contexts/GroupContext';
import { useWallet } from '@/contexts/WalletContext';
import { useCountdown } from '@/hooks/useCountdown';
import { useToast } from '@/hooks/use-toast';
import { Group } from '@shared/schema';
import { ArrowLeft, Plus, Share, History, Copy, CheckCircle, Clock } from 'lucide-react';

export default function GroupDetail() {
  const { id } = useParams<{ id: string }>();
  const { groups, getGroupMembers, getGroupContributions } = useGroups();
  const { address } = useWallet();
  const { toast } = useToast();
  const [group, setGroup] = useState<Group | null>(null);
  const [showContributionModal, setShowContributionModal] = useState(false);

  useEffect(() => {
    const foundGroup = groups.find(g => g.id === id);
    setGroup(foundGroup || null);
  }, [id, groups]);

  if (!group) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">Group not found</p>
            <Button asChild className="mt-4">
              <Link href="/">Back to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const members = getGroupMembers(group.id);
  const contributions = getGroupContributions(group.id);
  const nextPayoutDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
  const countdown = useCountdown(nextPayoutDate);

  const totalContributed = contributions.reduce((sum, c) => sum + c.amount, 0);
  const progress = Math.min((members.length / group.maxMembers) * 100, 100);

  const copyInviteCode = async () => {
    await navigator.clipboard.writeText(group.inviteCode);
    toast({
      title: "Invite Code Copied",
      description: "Share this code with friends to join the group",
    });
  };

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
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <Card className="mb-8">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">{group.name}</h1>
              <p className="text-gray-600 mt-1">{group.description}</p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className={getStatusColor(group.status)}>
                {group.status.charAt(0).toUpperCase() + group.status.slice(1)}
              </Badge>
              <Button variant="outline" size="sm" onClick={copyInviteCode}>
                <Share className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Group Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">{totalContributed}</div>
              <div className="text-sm text-gray-500">Total Pool (cUSD)</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">{members.length}</div>
              <div className="text-sm text-gray-500">Members</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">{group.totalRounds - group.currentRound}</div>
              <div className="text-sm text-gray-500">Rounds Left</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">{countdown.days}</div>
              <div className="text-sm text-gray-500">Days to Payout</div>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold text-gray-900">Current Round Progress</h4>
              <span className="text-sm text-gray-500">Round {group.currentRound} of {group.totalRounds}</span>
            </div>
            <Progress value={progress} className="w-full h-3 mb-2" />
            <div className="flex justify-between text-sm text-gray-600">
              <span>{members.length} of {group.maxMembers} members</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
          </div>

          {/* Countdown */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <div className="text-center">
              <h4 className="font-semibold text-gray-900 mb-2">Next Payout In</h4>
              <div className="text-3xl font-bold text-gray-900 mb-2">{countdown.formatted}</div>
              <p className="text-sm text-gray-500">
                Next recipient: {members[group.currentRound % members.length]?.name || 'TBD'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              className="flex-1"
              onClick={() => setShowContributionModal(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Make Contribution
            </Button>
            <Button variant="outline" className="flex-1" onClick={copyInviteCode}>
              <Share className="mr-2 h-4 w-4" />
              Share Invite Code
            </Button>
            <Button variant="outline" className="flex-1">
              <History className="mr-2 h-4 w-4" />
              Transaction History
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Members List */}
      <Card>
        <CardContent className="p-8">
          <h4 className="text-lg font-semibold text-gray-900 mb-6">Members & Contributions</h4>
          
          {members.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No members yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {members.map((member) => {
                const memberContributions = contributions.filter(c => c.memberId === member.id);
                const totalContribution = memberContributions.reduce((sum, c) => sum + c.amount, 0);
                const hasContributed = memberContributions.length > 0;

                return (
                  <div key={member.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary bg-opacity-10 rounded-full flex items-center justify-center">
                        <span className="text-primary font-semibold text-sm">
                          {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{member.name}</p>
                        <p className="text-sm text-gray-500">{member.walletAddress.slice(0, 6)}...{member.walletAddress.slice(-4)}</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        {member.walletAddress === address && (
                          <Badge variant="secondary">You</Badge>
                        )}
                        {member.isAdmin && (
                          <Badge variant="outline">Admin</Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{totalContribution} cUSD</p>
                      <div className="flex items-center space-x-1">
                        {hasContributed ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-green-600">Contributed</span>
                          </>
                        ) : (
                          <>
                            <Clock className="h-4 w-4 text-amber-500" />
                            <span className="text-sm text-amber-600">Pending</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Invite Code Display */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Invite Code</p>
                <p className="text-lg font-mono font-bold text-blue-900">{group.inviteCode}</p>
              </div>
              <Button variant="outline" size="sm" onClick={copyInviteCode}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contribution Modal */}
      {showContributionModal && (
        <ContributionModal
          group={group}
          isOpen={showContributionModal}
          onClose={() => setShowContributionModal(false)}
        />
      )}
    </div>
  );
}
