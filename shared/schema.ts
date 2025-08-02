import { z } from "zod";

export const groupSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  duration: z.number(),
  contributionAmount: z.number(),
  maxMembers: z.number(),
  createdBy: z.string(),
  inviteCode: z.string(),
  status: z.enum(['active', 'completed', 'cancelled']),
  createdAt: z.string(),
  currentRound: z.number(),
  totalRounds: z.number(),
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
});

export const contributionSchema = z.object({
  id: z.string(),
  groupId: z.string(),
  memberId: z.string(),
  amount: z.number(),
  round: z.number(),
  transactionHash: z.string().optional(),
  createdAt: z.string(),
});

export const userSchema = z.object({
  id: z.string(),
  walletAddress: z.string(),
  name: z.string(),
  referralCode: z.string(),
  totalEarned: z.number(),
  totalContributed: z.number(),
  referrals: z.number(),
  referredBy: z.string().optional(),
  createdAt: z.string(),
});

export const referralSchema = z.object({
  id: z.string(),
  referrerAddress: z.string(),
  referredAddress: z.string(),
  referralCode: z.string(),
  rewardAmount: z.number(),
  status: z.enum(['pending', 'completed']),
  createdAt: z.string(),
});

export type Group = z.infer<typeof groupSchema>;
export type Member = z.infer<typeof memberSchema>;
export type Contribution = z.infer<typeof contributionSchema>;
export type User = z.infer<typeof userSchema>;
export type Referral = z.infer<typeof referralSchema>;

export const createGroupSchema = groupSchema.pick({
  name: true,
  description: true,
  duration: true,
  contributionAmount: true,
  maxMembers: true,
});

export const joinGroupSchema = z.object({
  inviteCode: z.string(),
  name: z.string(),
});

export const makeContributionSchema = z.object({
  groupId: z.string(),
  amount: z.number(),
});

export type CreateGroup = z.infer<typeof createGroupSchema>;
export type JoinGroup = z.infer<typeof joinGroupSchema>;
export type MakeContribution = z.infer<typeof makeContributionSchema>;
