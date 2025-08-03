import { z } from "zod";

// Updated terminology: Group -> Savings Hub
export const savingsHubSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  goal: z.number(), // Total savings goal
  deadline: z.string(), // Target completion date
  duration: z.number(),
  contributionAmount: z.number(),
  maxMembers: z.number(),
  creator: z.string(), // Updated from createdBy
  members: z.array(z.string()), // Array of wallet addresses
  inviteCode: z.string(),
  status: z.enum(['active', 'completed', 'cancelled']),
  createdAt: z.string(),
  currentRound: z.number(),
  totalRounds: z.number(),
  totalSaved: z.number().default(0),
  isAnonymous: z.boolean().default(false),
  customWithdrawalAddress: z.string().optional(),
});

export const memberSchema = z.object({
  id: z.string(),
  walletAddress: z.string(),
  name: z.string(),
  joinedAt: z.string(),
  totalContributed: z.number(),
  isAdmin: z.boolean(),
  payoutReceived: z.boolean(),
  payoutRound: z.number().optional(),
  streak: z.number().default(0),
  lastContribution: z.string().optional(),
  badges: z.array(z.string()).default([]),
});

export const contributionSchema = z.object({
  id: z.string(),
  user: z.string(), // Updated field name
  hub: z.string(), // Updated from groupId
  amount: z.number(),
  date: z.string(), // Updated from createdAt
  round: z.number(),
  transactionHash: z.string().optional(),
  isStreak: z.boolean().default(false),
});

export const userSchema = z.object({
  wallet: z.string(), // Primary identifier (wallet address)
  name: z.string(),
  referrals: z.number().default(0),
  referralCode: z.string(),
  totalEarned: z.number().default(0),
  totalContributed: z.number().default(0),
  totalSaved: z.number().default(0),
  referredBy: z.string().optional(),
  createdAt: z.string(),
  streak: z.number().default(0),
  badges: z.array(z.string()).default([]),
  anonymousMode: z.boolean().default(false),
  lastActivity: z.string().optional(),
});

export const referralSchema = z.object({
  id: z.string(),
  referrer: z.string(), // Updated field name
  referee: z.string(), // Updated field name  
  date: z.string(), // Updated from createdAt
  referralCode: z.string(),
  rewardAmount: z.number(),
  status: z.enum(['pending', 'completed']),
});

export const leaderboardSchema = z.object({
  wallet: z.string(),
  totalInvites: z.number(),
  totalSaved: z.number(),
  rank: z.number().optional(),
  badges: z.array(z.string()).default([]),
  streak: z.number().default(0),
});

export const messageSchema = z.object({
  id: z.string(),
  hubId: z.string(),
  sender: z.string(), // wallet address
  senderName: z.string(),
  content: z.string(),
  timestamp: z.string(),
  type: z.enum(['message', 'system']).default('message'),
});

export const globalStatsSchema = z.object({
  totalSaved: z.number(),
  totalHubs: z.number(),
  totalUsers: z.number(),
  communityStreak: z.number(),
  lastUpdated: z.string(),
});

// Type exports
export type SavingsHub = z.infer<typeof savingsHubSchema>;
export type Member = z.infer<typeof memberSchema>;
export type Contribution = z.infer<typeof contributionSchema>;
export type User = z.infer<typeof userSchema>;
export type Referral = z.infer<typeof referralSchema>;
export type Leaderboard = z.infer<typeof leaderboardSchema>;
export type Message = z.infer<typeof messageSchema>;
export type GlobalStats = z.infer<typeof globalStatsSchema>;

// Form schemas
export const createHubSchema = savingsHubSchema.pick({
  name: true,
  description: true,
  goal: true,
  deadline: true,
  duration: true,
  contributionAmount: true,
  maxMembers: true,
});

export const joinHubSchema = z.object({
  inviteCode: z.string(),
  name: z.string(),
});

export const makeContributionSchema = z.object({
  hubId: z.string(),
  amount: z.number(),
});

export const sendMessageSchema = z.object({
  hubId: z.string(),
  content: z.string().min(1).max(500),
});

export type CreateHub = z.infer<typeof createHubSchema>;
export type JoinHub = z.infer<typeof joinHubSchema>;
export type MakeContribution = z.infer<typeof makeContributionSchema>;
export type SendMessage = z.infer<typeof sendMessageSchema>;

// Legacy exports for backward compatibility
export const groupSchema = savingsHubSchema;
export type Group = SavingsHub;
export const createGroupSchema = createHubSchema;
export const joinGroupSchema = joinHubSchema;
export type CreateGroup = CreateHub;
export type JoinGroup = JoinHub;
