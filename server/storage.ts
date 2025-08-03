import { randomUUID } from "crypto";
import { mongodb } from "./mongodb";
import type { 
  User, SavingsHub, Contribution, Referral, 
  Leaderboard, Message, GlobalStats,
  CreateHub, JoinHub, MakeContribution, SendMessage
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(wallet: string): Promise<User | undefined>;
  createUser(user: Omit<User, 'wallet'> & { wallet: string }): Promise<User>;
  updateUser(wallet: string, updates: Partial<User>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;

  // Savings Hub operations
  getSavingsHub(id: string): Promise<SavingsHub | undefined>;
  createSavingsHub(hub: CreateHub & { creator: string }): Promise<SavingsHub>;
  updateSavingsHub(id: string, updates: Partial<SavingsHub>): Promise<SavingsHub | undefined>;
  getUserHubs(wallet: string): Promise<SavingsHub[]>;
  getHubByInviteCode(code: string): Promise<SavingsHub | undefined>;
  joinHub(hubId: string, wallet: string): Promise<boolean>;

  // Contribution operations
  createContribution(contribution: MakeContribution & { user: string }): Promise<Contribution>;
  getHubContributions(hubId: string): Promise<Contribution[]>;
  getUserContributions(wallet: string): Promise<Contribution[]>;

  // Referral operations
  createReferral(referral: Omit<Referral, 'id' | 'date'>): Promise<Referral>;
  getUserReferrals(wallet: string): Promise<Referral[]>;

  // Leaderboard operations
  getLeaderboard(): Promise<Leaderboard[]>;
  updateLeaderboard(wallet: string, data: Partial<Leaderboard>): Promise<void>;

  // Message operations
  createMessage(message: SendMessage & { sender: string; senderName: string }): Promise<Message>;
  getHubMessages(hubId: string, limit?: number): Promise<Message[]>;

  // Global stats
  getGlobalStats(): Promise<GlobalStats>;
  updateGlobalStats(updates: Partial<GlobalStats>): Promise<void>;
}

export class MongoStorage implements IStorage {
  // User operations
  async getUser(wallet: string): Promise<User | undefined> {
    const user = await mongodb.users.findOne({ wallet });
    return user || undefined;
  }

  async createUser(userData: Omit<User, 'wallet'> & { wallet: string }): Promise<User> {
    const user: User = {
      ...userData,
      createdAt: new Date().toISOString(),
      referrals: 0,
      totalEarned: 0,
      totalContributed: 0,
      totalSaved: 0,
      streak: 0,
      badges: [],
      anonymousMode: false,
    };
    
    await mongodb.users.insertOne(user);
    return user;
  }

  async updateUser(wallet: string, updates: Partial<User>): Promise<User | undefined> {
    const result = await mongodb.users.findOneAndUpdate(
      { wallet },
      { $set: updates },
      { returnDocument: 'after' }
    );
    return result || undefined;
  }

  async getAllUsers(): Promise<User[]> {
    return await mongodb.users.find({}).toArray();
  }

  // Savings Hub operations
  async getSavingsHub(id: string): Promise<SavingsHub | undefined> {
    const hub = await mongodb.savingsHubs.findOne({ id });
    return hub || undefined;
  }

  async createSavingsHub(hubData: CreateHub & { creator: string }): Promise<SavingsHub> {
    const id = randomUUID();
    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const hub: SavingsHub = {
      id,
      ...hubData,
      inviteCode,
      members: [hubData.creator],
      status: 'active' as const,
      createdAt: new Date().toISOString(),
      currentRound: 1,
      totalRounds: hubData.duration,
      totalSaved: 0,
      isAnonymous: false,
    };

    await mongodb.savingsHubs.insertOne(hub);
    return hub;
  }

  async updateSavingsHub(id: string, updates: Partial<SavingsHub>): Promise<SavingsHub | undefined> {
    const result = await mongodb.savingsHubs.findOneAndUpdate(
      { id },
      { $set: updates },
      { returnDocument: 'after' }
    );
    return result || undefined;
  }

  async getUserHubs(wallet: string): Promise<SavingsHub[]> {
    return await mongodb.savingsHubs.find({ 
      $or: [
        { creator: wallet },
        { members: wallet }
      ]
    }).toArray();
  }

  async getHubByInviteCode(code: string): Promise<SavingsHub | undefined> {
    const hub = await mongodb.savingsHubs.findOne({ inviteCode: code });
    return hub || undefined;
  }

  async joinHub(hubId: string, wallet: string): Promise<boolean> {
    const result = await mongodb.savingsHubs.updateOne(
      { id: hubId, members: { $ne: wallet } },
      { $push: { members: wallet } }
    );
    return result.modifiedCount > 0;
  }

  // Contribution operations
  async createContribution(contributionData: MakeContribution & { user: string }): Promise<Contribution> {
    const id = randomUUID();
    const contribution: Contribution = {
      id,
      user: contributionData.user,
      hub: contributionData.hubId,
      amount: contributionData.amount,
      date: new Date().toISOString(),
      round: 1, // Will be calculated based on hub logic
      isStreak: false, // Will be calculated based on user activity
    };

    await mongodb.contributions.insertOne(contribution);
    return contribution;
  }

  async getHubContributions(hubId: string): Promise<Contribution[]> {
    return await mongodb.contributions.find({ hub: hubId }).sort({ date: -1 }).toArray();
  }

  async getUserContributions(wallet: string): Promise<Contribution[]> {
    return await mongodb.contributions.find({ user: wallet }).sort({ date: -1 }).toArray();
  }

  // Referral operations
  async createReferral(referralData: Omit<Referral, 'id' | 'date'>): Promise<Referral> {
    const id = randomUUID();
    const referral: Referral = {
      id,
      ...referralData,
      date: new Date().toISOString(),
    };

    await mongodb.referrals.insertOne(referral);
    return referral;
  }

  async getUserReferrals(wallet: string): Promise<Referral[]> {
    return await mongodb.referrals.find({ referrer: wallet }).toArray();
  }

  // Leaderboard operations
  async getLeaderboard(): Promise<Leaderboard[]> {
    return await mongodb.leaderboard.find({}).sort({ totalSaved: -1 }).limit(50).toArray();
  }

  async updateLeaderboard(wallet: string, data: Partial<Leaderboard>): Promise<void> {
    await mongodb.leaderboard.updateOne(
      { wallet },
      { $set: data },
      { upsert: true }
    );
  }

  // Message operations
  async createMessage(messageData: SendMessage & { sender: string; senderName: string }): Promise<Message> {
    const id = randomUUID();
    const message: Message = {
      id,
      hubId: messageData.hubId,
      sender: messageData.sender,
      senderName: messageData.senderName,
      content: messageData.content,
      timestamp: new Date().toISOString(),
      type: 'message',
    };

    await mongodb.messages.insertOne(message);
    return message;
  }

  async getHubMessages(hubId: string, limit: number = 50): Promise<Message[]> {
    return await mongodb.messages
      .find({ hubId })
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray();
  }

  // Global stats
  async getGlobalStats(): Promise<GlobalStats> {
    const stats = await mongodb.globalStats.findOne({});
    if (!stats) {
      const defaultStats: GlobalStats = {
        totalSaved: 0,
        totalHubs: 0,
        totalUsers: 0,
        communityStreak: 0,
        lastUpdated: new Date().toISOString(),
      };
      await mongodb.globalStats.insertOne(defaultStats);
      return defaultStats;
    }
    return stats;
  }

  async updateGlobalStats(updates: Partial<GlobalStats>): Promise<void> {
    await mongodb.globalStats.updateOne(
      {},
      { $set: { ...updates, lastUpdated: new Date().toISOString() } },
      { upsert: true }
    );
  }
}

// For backward compatibility
export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private hubs: Map<string, SavingsHub> = new Map();
  private contributions: Map<string, Contribution> = new Map();
  private referrals: Map<string, Referral> = new Map();
  private leaderboard: Map<string, Leaderboard> = new Map();
  private messages: Map<string, Message[]> = new Map();
  private globalStats: GlobalStats = {
    totalSaved: 0,
    totalHubs: 0,
    totalUsers: 0,
    communityStreak: 0,
    lastUpdated: new Date().toISOString(),
  };

  async getUser(wallet: string): Promise<User | undefined> {
    return this.users.get(wallet);
  }

  async createUser(userData: Omit<User, 'wallet'> & { wallet: string }): Promise<User> {
    const user: User = {
      ...userData,
      createdAt: new Date().toISOString(),
      referrals: 0,
      totalEarned: 0,
      totalContributed: 0,
      totalSaved: 0,
      streak: 0,
      badges: [],
      anonymousMode: false,
    };
    this.users.set(user.wallet, user);
    return user;
  }

  async updateUser(wallet: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(wallet);
    if (user) {
      const updated = { ...user, ...updates };
      this.users.set(wallet, updated);
      return updated;
    }
    return undefined;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getSavingsHub(id: string): Promise<SavingsHub | undefined> {
    return this.hubs.get(id);
  }

  async createSavingsHub(hubData: CreateHub & { creator: string }): Promise<SavingsHub> {
    const id = randomUUID();
    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const hub: SavingsHub = {
      id,
      ...hubData,
      inviteCode,
      members: [hubData.creator],
      status: 'active' as const,
      createdAt: new Date().toISOString(),
      currentRound: 1,
      totalRounds: hubData.duration,
      totalSaved: 0,
      isAnonymous: false,
    };

    this.hubs.set(id, hub);
    return hub;
  }

  async updateSavingsHub(id: string, updates: Partial<SavingsHub>): Promise<SavingsHub | undefined> {
    const hub = this.hubs.get(id);
    if (hub) {
      const updated = { ...hub, ...updates };
      this.hubs.set(id, updated);
      return updated;
    }
    return undefined;
  }

  async getUserHubs(wallet: string): Promise<SavingsHub[]> {
    return Array.from(this.hubs.values()).filter(
      hub => hub.creator === wallet || hub.members.includes(wallet)
    );
  }

  async getHubByInviteCode(code: string): Promise<SavingsHub | undefined> {
    return Array.from(this.hubs.values()).find(hub => hub.inviteCode === code);
  }

  async joinHub(hubId: string, wallet: string): Promise<boolean> {
    const hub = this.hubs.get(hubId);
    if (hub && !hub.members.includes(wallet)) {
      hub.members.push(wallet);
      this.hubs.set(hubId, hub);
      return true;
    }
    return false;
  }

  async createContribution(contributionData: MakeContribution & { user: string }): Promise<Contribution> {
    const id = randomUUID();
    const contribution: Contribution = {
      id,
      user: contributionData.user,
      hub: contributionData.hubId,
      amount: contributionData.amount,
      date: new Date().toISOString(),
      round: 1,
      isStreak: false,
    };

    this.contributions.set(id, contribution);
    return contribution;
  }

  async getHubContributions(hubId: string): Promise<Contribution[]> {
    return Array.from(this.contributions.values()).filter(c => c.hub === hubId);
  }

  async getUserContributions(wallet: string): Promise<Contribution[]> {
    return Array.from(this.contributions.values()).filter(c => c.user === wallet);
  }

  async createReferral(referralData: Omit<Referral, 'id' | 'date'>): Promise<Referral> {
    const id = randomUUID();
    const referral: Referral = {
      id,
      ...referralData,
      date: new Date().toISOString(),
    };

    this.referrals.set(id, referral);
    return referral;
  }

  async getUserReferrals(wallet: string): Promise<Referral[]> {
    return Array.from(this.referrals.values()).filter(r => r.referrer === wallet);
  }

  async getLeaderboard(): Promise<Leaderboard[]> {
    return Array.from(this.leaderboard.values()).sort((a, b) => b.totalSaved - a.totalSaved);
  }

  async updateLeaderboard(wallet: string, data: Partial<Leaderboard>): Promise<void> {
    const existing = this.leaderboard.get(wallet);
    const updated = existing ? { ...existing, ...data } : { wallet, totalInvites: 0, totalSaved: 0, ...data };
    this.leaderboard.set(wallet, updated);
  }

  async createMessage(messageData: SendMessage & { sender: string; senderName: string }): Promise<Message> {
    const id = randomUUID();
    const message: Message = {
      id,
      hubId: messageData.hubId,
      sender: messageData.sender,
      senderName: messageData.senderName,
      content: messageData.content,
      timestamp: new Date().toISOString(),
      type: 'message',
    };

    const hubMessages = this.messages.get(messageData.hubId) || [];
    hubMessages.push(message);
    this.messages.set(messageData.hubId, hubMessages);
    return message;
  }

  async getHubMessages(hubId: string, limit: number = 50): Promise<Message[]> {
    const hubMessages = this.messages.get(hubId) || [];
    return hubMessages.slice(-limit).reverse();
  }

  async getGlobalStats(): Promise<GlobalStats> {
    return this.globalStats;
  }

  async updateGlobalStats(updates: Partial<GlobalStats>): Promise<void> {
    this.globalStats = { ...this.globalStats, ...updates, lastUpdated: new Date().toISOString() };
  }
}

// Use MongoDB in production, MemStorage for development
export const storage = process.env.NODE_ENV === 'production' 
  ? new MongoStorage() 
  : new MemStorage();
