import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WalletConnectButton } from '@/components/WalletConnectButton';
import { GroupCard } from '@/components/GroupCard';
import { CreateGroupForm } from '@/components/CreateGroupForm';
import { JoinGroupForm } from '@/components/JoinGroupForm';
import { ReferralSection } from '@/components/ReferralSection';
import { ContributionModal } from '@/components/ContributionModal';
import { useWallet } from '@/contexts/WalletContext';
import { useGroups } from '@/contexts/GroupContext';
import { Group } from '@shared/schema';
import { Link } from 'wouter';
import { Plus, Users, Coins, Clock, TrendingUp, ArrowRight } from 'lucide-react';

export default function Dashboard() {
  const { isConnected, address } = useWallet();
  const { userGroups } = useGroups();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [contributionGroup, setContributionGroup] = useState<Group | null>(null);

  // Calculate user stats
  const activeGroups = userGroups.filter(g => g.status === 'active').length;
  const totalContributed = 450; // This would be calculated from actual contributions
  const totalEarned = 800; // This would be calculated from actual payouts

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-primary flex items-center justify-center">
              <Users className="mr-2 h-6 w-6" />
              StableCircle
            </CardTitle>
            <p className="text-gray-600">Connect your wallet to get started</p>
          </CardHeader>
          <CardContent className="flex justify-center">
            <WalletConnectButton />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showCreateForm) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="outline" onClick={() => setShowCreateForm(false)}>
            ← Back to Dashboard
          </Button>
        </div>
        <CreateGroupForm onSuccess={() => setShowCreateForm(false)} />
      </div>
    );
  }

  if (showJoinForm) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="outline" onClick={() => setShowJoinForm(false)}>
            ← Back to Dashboard
          </Button>
        </div>
        <JoinGroupForm onSuccess={() => setShowJoinForm(false)} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-3xl font-bold text-gray-900 sm:truncate">
              Welcome back, <span className="text-primary">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage your savings groups and track contributions
            </p>
          </div>
          <div className="mt-4 flex space-x-3 md:mt-0 md:ml-4">
            <Button variant="outline" onClick={() => setShowJoinForm(true)}>
              Join Group
            </Button>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create New Group
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Active Groups</p>
                  <p className="text-2xl font-bold text-gray-900">{activeGroups}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-secondary bg-opacity-10 rounded-lg flex items-center justify-center">
                    <Coins className="h-4 w-4 text-secondary" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Contributed</p>
                  <p className="text-2xl font-bold text-gray-900">{totalContributed} cUSD</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-accent bg-opacity-10 rounded-lg flex items-center justify-center">
                    <Clock className="h-4 w-4 text-accent" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Next Payout</p>
                  <p className="text-2xl font-bold text-gray-900">3 days</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 bg-opacity-10 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Earned</p>
                  <p className="text-2xl font-bold text-gray-900">{totalEarned} cUSD</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Active Groups */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Your Active Groups</h3>
          {userGroups.length > 0 && (
            <Button variant="ghost" className="text-primary hover:text-primary/80">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          )}
        </div>

        {userGroups.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No groups yet</h3>
              <p className="text-gray-500 mb-6">
                Create your first savings group or join an existing one to get started
              </p>
              <div className="flex justify-center space-x-4">
                <Button onClick={() => setShowCreateForm(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Group
                </Button>
                <Button variant="outline" onClick={() => setShowJoinForm(true)}>
                  Join Group
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {userGroups.map((group) => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>
        )}
      </div>

      {/* Referral Section */}
      <ReferralSection />

      {/* Contribution Modal */}
      {contributionGroup && (
        <ContributionModal
          group={contributionGroup}
          isOpen={!!contributionGroup}
          onClose={() => setContributionGroup(null)}
        />
      )}
    </div>
  );
}
