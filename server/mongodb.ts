import { MongoClient, Db, Collection, Document } from 'mongodb';
import type { User, SavingsHub, Contribution, Referral, Leaderboard, Message, GlobalStats } from '@shared/schema';

const MONGODB_URI = 'mongodb+srv://techalaxy_1:3ppBZjfsdcjt25zl@clusterlunaai.rdxe7vj.mongodb.net/?retryWrites=true&w=majority&appName=ClusterLunaAI';

class MongoDB {
  private client: MongoClient;
  private db: Db | null = null;

  constructor() {
    this.client = new MongoClient(MONGODB_URI);
  }

  async connect(): Promise<void> {
    try {
      await this.client.connect();
      this.db = this.client.db('stablecircle');
      console.log('✅ Connected to MongoDB');
    } catch (error) {
      console.error('❌ MongoDB connection error:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    await this.client.close();
  }

  getCollection<T extends Document = Document>(name: string): Collection<T> {
    if (!this.db) {
      throw new Error('Database not connected');
    }
    return this.db.collection<T>(name);
  }

  // Collections
  get users() { return this.getCollection<User>('users'); }
  get savingsHubs() { return this.getCollection<SavingsHub>('savingsHubs'); }
  get contributions() { return this.getCollection<Contribution>('contributions'); }
  get referrals() { return this.getCollection<Referral>('referrals'); }
  get leaderboard() { return this.getCollection<Leaderboard>('leaderboard'); }
  get messages() { return this.getCollection<Message>('messages'); }
  get globalStats() { return this.getCollection<GlobalStats>('globalStats'); }
}

export const mongodb = new MongoDB();

// Initialize connection
export const initializeDatabase = async () => {
  await mongodb.connect();
  
  // Create indexes for better performance
  await mongodb.users.createIndex({ wallet: 1 }, { unique: true });
  await mongodb.savingsHubs.createIndex({ inviteCode: 1 }, { unique: true });
  await mongodb.contributions.createIndex({ hub: 1, user: 1 });
  await mongodb.referrals.createIndex({ referrer: 1 });
  await mongodb.messages.createIndex({ hubId: 1, timestamp: -1 });
  
  // Initialize global stats if not exists
  const stats = await mongodb.globalStats.findOne({});
  if (!stats) {
    await mongodb.globalStats.insertOne({
      totalSaved: 0,
      totalHubs: 0,
      totalUsers: 0,
      communityStreak: 0,
      lastUpdated: new Date().toISOString(),
    });
  }
};