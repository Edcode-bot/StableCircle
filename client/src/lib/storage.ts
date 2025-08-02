import { Group, Member, Contribution, User } from '@shared/schema';
import { nanoid } from 'nanoid';

const STORAGE_KEYS = {
  USER: 'stablecircle_user',
  GROUPS: 'stablecircle_groups',
  MEMBERS: 'stablecircle_members',
  CONTRIBUTIONS: 'stablecircle_contributions',
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

  clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }

  // Migration helper for Firebase
  exportData() {
    return {
      user: this.getUser(),
      groups: this.getGroups(),
      members: this.getMembers(),
      contributions: this.getContributions(),
    };
  }

  importData(data: any) {
    if (data.user) this.saveUser(data.user);
    if (data.groups) this.saveGroups(data.groups);
    if (data.members) this.saveMembers(data.members);
    if (data.contributions) this.saveContributions(data.contributions);
  }
}

export const storageService = new LocalStorageService();
