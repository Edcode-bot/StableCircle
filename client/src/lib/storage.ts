import { Group, Member, Contribution, User, Referral } from '@shared/schema';
import { nanoid } from 'nanoid';
import dayjs from 'dayjs';

const STORAGE_KEYS = {
  USER: 'stablecircle_user',
  USERS: 'stablecircle_users',
  GROUPS: 'stablecircle_groups',
  MEMBERS: 'stablecircle_members',
  CONTRIBUTIONS: 'stablecircle_contributions',
  REFERRALS: 'stablecircle_referrals',
} as const;

export class LocalStorageService {
  // User operations
  saveUser(user: User): void {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }

  getUser(): User | null {
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : null;
  }

  // Users operations (for referrals and leaderboard)
  saveUsers(users: User[]): void {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }

  getUsers(): User[] {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : [];
  }

  addUser(user: User): void {
    const users = this.getUsers();
    const existingIndex = users.findIndex(u => u.walletAddress === user.walletAddress);
    if (existingIndex === -1) {
      users.push(user);
      this.saveUsers(users);
    }
  }

  getUserByAddress(address: string): User | null {
    const users = this.getUsers();
    return users.find(u => u.walletAddress === address) || null;
  }

  getUserByReferralCode(referralCode: string): User | null {
    const users = this.getUsers();
    return users.find(u => u.referralCode === referralCode) || null;
  }

  updateUser(address: string, updates: Partial<User>): void {
    const users = this.getUsers();
    const index = users.findIndex(u => u.walletAddress === address);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      this.saveUsers(users);
    }
  }

  // Group operations
  saveGroups(groups: Group[]): void {
    localStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(groups));
  }

  getGroups(): Group[] {
    const data = localStorage.getItem(STORAGE_KEYS.GROUPS);
    return data ? JSON.parse(data) : [];
  }

  addGroup(group: Group): void {
    const groups = this.getGroups();
    groups.push(group);
    this.saveGroups(groups);
  }

  updateGroup(groupId: string, updates: Partial<Group>): void {
    const groups = this.getGroups();
    const index = groups.findIndex(g => g.id === groupId);
    if (index !== -1) {
      groups[index] = { ...groups[index], ...updates };
      this.saveGroups(groups);
    }
  }

  getGroupByInviteCode(inviteCode: string): Group | null {
    const groups = this.getGroups();
    return groups.find(g => g.inviteCode === inviteCode) || null;
  }

  // Member operations
  saveMembers(members: Member[]): void {
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
  }

  getMembers(): Member[] {
    const data = localStorage.getItem(STORAGE_KEYS.MEMBERS);
    return data ? JSON.parse(data) : [];
  }

  addMember(member: Member): void {
    const members = this.getMembers();
    members.push(member);
    this.saveMembers(members);
  }

  getMembersByGroupId(groupId: string): Member[] {
    return this.getMembers().filter(m => 
      this.getContributions().some(c => c.groupId === groupId && c.memberId === m.id)
    );
  }

  updateMember(memberId: string, updates: Partial<Member>): void {
    const members = this.getMembers();
    const index = members.findIndex(m => m.id === memberId);
    if (index !== -1) {
      members[index] = { ...members[index], ...updates };
      this.saveMembers(members);
    }
  }

  // Contribution operations
  saveContributions(contributions: Contribution[]): void {
    localStorage.setItem(STORAGE_KEYS.CONTRIBUTIONS, JSON.stringify(contributions));
  }

  getContributions(): Contribution[] {
    const data = localStorage.getItem(STORAGE_KEYS.CONTRIBUTIONS);
    return data ? JSON.parse(data) : [];
  }

  addContribution(contribution: Contribution): void {
    const contributions = this.getContributions();
    contributions.push(contribution);
    this.saveContributions(contributions);
  }

  getContributionsByGroupId(groupId: string): Contribution[] {
    return this.getContributions().filter(c => c.groupId === groupId);
  }

  getContributionsByMemberId(memberId: string): Contribution[] {
    return this.getContributions().filter(c => c.memberId === memberId);
  }

  // Utility functions
  generateInviteCode(): string {
    return `SC-${nanoid(4).toUpperCase()}-${nanoid(4).toUpperCase()}`;
  }

  generateReferralCode(): string {
    return `REF-${nanoid(5).toUpperCase()}`;
  }

  // Referral operations
  saveReferrals(referrals: Referral[]): void {
    localStorage.setItem(STORAGE_KEYS.REFERRALS, JSON.stringify(referrals));
  }

  getReferrals(): Referral[] {
    const data = localStorage.getItem(STORAGE_KEYS.REFERRALS);
    return data ? JSON.parse(data) : [];
  }

  addReferral(referral: Referral): void {
    const referrals = this.getReferrals();
    referrals.push(referral);
    this.saveReferrals(referrals);
  }

  getReferralsByReferrer(referrerAddress: string): Referral[] {
    return this.getReferrals().filter(r => r.referrerAddress === referrerAddress);
  }

  processReferral(referralCode: string, newUserAddress: string): boolean {
    const referringUser = this.getUserByReferralCode(referralCode);
    if (!referringUser) return false;

    // Create referral record
    const referral: Referral = {
      id: nanoid(),
      referrerAddress: referringUser.walletAddress,
      referredAddress: newUserAddress,
      referralCode,
      rewardAmount: 5, // 5 cUSD reward
      status: 'completed',
      createdAt: dayjs().toISOString(),
    };

    this.addReferral(referral);

    // Update referrer's stats
    this.updateUser(referringUser.walletAddress, {
      referrals: referringUser.referrals + 1,
      totalEarned: referringUser.totalEarned + 5,
    });

    return true;
  }

  generateReferralLink(referralCode: string): string {
    const baseUrl = window.location.origin;
    return `${baseUrl}?ref=${referralCode}`;
  }

  clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }

  // Create or get user with referral tracking
  createOrGetUser(walletAddress: string, name?: string, referralCode?: string): User {
    let user = this.getUserByAddress(walletAddress);
    
    if (!user) {
      user = {
        id: nanoid(),
        walletAddress,
        name: name || `User ${walletAddress.slice(0, 6)}`,
        referralCode: this.generateReferralCode(),
        totalEarned: 0,
        totalContributed: 0,
        referrals: 0,
        referredBy: referralCode,
        createdAt: dayjs().toISOString(),
      };
      
      this.addUser(user);
      
      // Process referral if provided
      if (referralCode) {
        this.processReferral(referralCode, walletAddress);
      }
    }
    
    return user;
  }

  // Migration helper for Firebase
  exportData() {
    return {
      user: this.getUser(),
      users: this.getUsers(),
      groups: this.getGroups(),
      members: this.getMembers(),
      contributions: this.getContributions(),
      referrals: this.getReferrals(),
    };
  }

  importData(data: any) {
    if (data.user) this.saveUser(data.user);
    if (data.users) this.saveUsers(data.users);
    if (data.groups) this.saveGroups(data.groups);
    if (data.members) this.saveMembers(data.members);
    if (data.contributions) this.saveContributions(data.contributions);
    if (data.referrals) this.saveReferrals(data.referrals);
  }
}

export const storageService = new LocalStorageService();
