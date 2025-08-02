import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Group, Member, Contribution, CreateGroup, JoinGroup, MakeContribution } from '@shared/schema';
import { storageService } from '@/lib/storage';
import { useWallet } from './WalletContext';
import { useToast } from '@/hooks/use-toast';
import { nanoid } from 'nanoid';
import dayjs from 'dayjs';

interface GroupContextType {
  groups: Group[];
  userGroups: Group[];
  activeGroup: Group | null;
  isLoading: boolean;
  createGroup: (data: CreateGroup) => Promise<Group>;
  joinGroup: (data: JoinGroup) => Promise<void>;
  makeContribution: (data: MakeContribution) => Promise<void>;
  getGroupMembers: (groupId: string) => Member[];
  getGroupContributions: (groupId: string) => Contribution[];
  setActiveGroup: (group: Group | null) => void;
  refreshGroups: () => void;
}

const GroupContext = createContext<GroupContextType | undefined>(undefined);

export function GroupProvider({ children }: { children: ReactNode }) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [activeGroup, setActiveGroup] = useState<Group | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { address, simulateTransfer } = useWallet();
  const { toast } = useToast();

  const refreshGroups = () => {
    const savedGroups = storageService.getGroups();
    setGroups(savedGroups);
  };

  const userGroups = groups.filter(group => {
    const members = storageService.getMembersByGroupId(group.id);
    return members.some(member => member.walletAddress === address);
  });

  const createGroup = async (data: CreateGroup): Promise<Group> => {
    if (!address) {
      throw new Error('Wallet not connected');
    }

    setIsLoading(true);
    try {
      const inviteCode = storageService.generateInviteCode();
      const totalRounds = data.maxMembers;

      const newGroup: Group = {
        id: nanoid(),
        name: data.name,
        description: data.description || '',
        duration: data.duration,
        contributionAmount: data.contributionAmount,
        maxMembers: data.maxMembers,
        createdBy: address,
        inviteCode,
        status: 'active',
        createdAt: dayjs().toISOString(),
        currentRound: 1,
        totalRounds,
      };

      storageService.addGroup(newGroup);

      // Add creator as first member
      const creatorMember: Member = {
        id: nanoid(),
        walletAddress: address,
        name: 'You',
        joinedAt: dayjs().toISOString(),
        totalContributed: 0,
        isAdmin: true,
        payoutReceived: false,
      };

      storageService.addMember(creatorMember);

      refreshGroups();

      toast({
        title: "Group Created",
        description: `"${data.name}" has been created successfully`,
      });

      return newGroup;
    } catch (error) {
      console.error('Failed to create group:', error);
      toast({
        title: "Creation Failed",
        description: error instanceof Error ? error.message : "Failed to create group",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const joinGroup = async (data: JoinGroup): Promise<void> => {
    if (!address) {
      throw new Error('Wallet not connected');
    }

    setIsLoading(true);
    try {
      const group = storageService.getGroupByInviteCode(data.inviteCode);
      if (!group) {
        throw new Error('Invalid invite code');
      }

      const existingMembers = storageService.getMembersByGroupId(group.id);
      if (existingMembers.length >= group.maxMembers) {
        throw new Error('Group is full');
      }

      if (existingMembers.some(member => member.walletAddress === address)) {
        throw new Error('You are already a member of this group');
      }

      const newMember: Member = {
        id: nanoid(),
        walletAddress: address,
        name: data.name,
        joinedAt: dayjs().toISOString(),
        totalContributed: 0,
        isAdmin: false,
        payoutReceived: false,
      };

      storageService.addMember(newMember);
      refreshGroups();

      toast({
        title: "Joined Group",
        description: `Welcome to "${group.name}"!`,
      });
    } catch (error) {
      console.error('Failed to join group:', error);
      toast({
        title: "Join Failed",
        description: error instanceof Error ? error.message : "Failed to join group",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const makeContribution = async (data: MakeContribution): Promise<void> => {
    if (!address) {
      throw new Error('Wallet not connected');
    }

    setIsLoading(true);
    try {
      const group = groups.find(g => g.id === data.groupId);
      if (!group) {
        throw new Error('Group not found');
      }

      // Simulate blockchain transaction
      const txHash = await simulateTransfer(group.id, data.amount.toString());

      const contribution: Contribution = {
        id: nanoid(),
        groupId: data.groupId,
        memberId: address, // Using address as member ID for simplicity
        amount: data.amount,
        round: group.currentRound,
        transactionHash: txHash,
        createdAt: dayjs().toISOString(),
      };

      storageService.addContribution(contribution);

      // Update member's total contribution
      const members = storageService.getMembers();
      const memberIndex = members.findIndex(m => m.walletAddress === address);
      if (memberIndex !== -1) {
        members[memberIndex].totalContributed += data.amount;
        storageService.saveMembers(members);
      }

      refreshGroups();

      toast({
        title: "Contribution Successful",
        description: `Contributed ${data.amount} cUSD to "${group.name}"`,
      });
    } catch (error) {
      console.error('Failed to make contribution:', error);
      toast({
        title: "Contribution Failed",
        description: error instanceof Error ? error.message : "Failed to make contribution",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getGroupMembers = (groupId: string): Member[] => {
    return storageService.getMembersByGroupId(groupId);
  };

  const getGroupContributions = (groupId: string): Contribution[] => {
    return storageService.getContributionsByGroupId(groupId);
  };

  useEffect(() => {
    refreshGroups();
  }, [address]);

  return (
    <GroupContext.Provider
      value={{
        groups,
        userGroups,
        activeGroup,
        isLoading,
        createGroup,
        joinGroup,
        makeContribution,
        getGroupMembers,
        getGroupContributions,
        setActiveGroup,
        refreshGroups,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
}

export function useGroups() {
  const context = useContext(GroupContext);
  if (context === undefined) {
    throw new Error('useGroups must be used within a GroupProvider');
  }
  return context;
}
