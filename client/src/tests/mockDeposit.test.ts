import { describe, it, expect, beforeEach } from 'vitest';
import { storageService } from '../lib/storage';
import { APP_CONFIG } from '../config/constants';
import dayjs from 'dayjs';

describe('Mock Deposit Functionality', () => {
  beforeEach(() => {
    // Clear storage before each test
    storageService.clearAllData();
  });

  it('should simulate a successful cUSD contribution', async () => {
    // Create a mock user and group
    const testAddress = '0x742d35cc6681c4d6e0dc2ad7c5e3e8a2a2b8f1a8';
    const user = storageService.createOrGetUser(testAddress, 'Test User');
    
    const mockGroup = {
      id: 'test-group-1',
      name: 'Test Savings Circle',
      description: 'A test group for mock deposits',
      duration: 30,
      contributionAmount: 50,
      maxMembers: 5,
      createdBy: testAddress,
      inviteCode: 'SC-TEST-1234',
      status: 'active' as const,
      createdAt: dayjs().toISOString(),
      currentRound: 1,
      totalRounds: 5,
    };
    
    storageService.addGroup(mockGroup);
    
    // Add user as member
    const mockMember = {
      id: 'test-member-1',
      walletAddress: testAddress,
      name: 'Test User',
      joinedAt: dayjs().toISOString(),
      totalContributed: 0,
      isAdmin: true,
      payoutReceived: false,
    };
    
    storageService.addMember(mockMember);
    
    // Simulate a mock contribution
    const contributionAmount = 50;
    const mockTxHash = `0x${Math.random().toString(16).substring(2, 66)}`;
    
    const contribution = {
      id: 'test-contribution-1',
      groupId: mockGroup.id,
      memberId: testAddress,
      amount: contributionAmount,
      round: mockGroup.currentRound,
      transactionHash: mockTxHash,
      createdAt: dayjs().toISOString(),
    };
    
    storageService.addContribution(contribution);
    
    // Verify the contribution was recorded
    const savedContributions = storageService.getContributionsByGroupId(mockGroup.id);
    expect(savedContributions).toHaveLength(1);
    expect(savedContributions[0].amount).toBe(contributionAmount);
    expect(savedContributions[0].transactionHash).toBe(mockTxHash);
  });

  it('should handle referral rewards correctly', () => {
    const referrerAddress = '0x123456789abcdef123456789abcdef1234567890';
    const referredAddress = '0x987654321fedcba987654321fedcba9876543210';
    
    // Create referrer with a specific referral code
    const referrer = storageService.createOrGetUser(referrerAddress, 'Referrer User');
    const initialEarnings = referrer.totalEarned;
    const initialReferrals = referrer.referrals;
    
    // Create referred user with referral code
    const referredUser = storageService.createOrGetUser(
      referredAddress,
      'Referred User',
      referrer.referralCode
    );
    
    // Verify referral was processed
    const updatedReferrer = storageService.getUserByAddress(referrerAddress);
    expect(updatedReferrer?.referrals).toBe(initialReferrals + 1);
    expect(updatedReferrer?.totalEarned).toBe(initialEarnings + APP_CONFIG.REFERRAL_REWARD);
    
    // Verify referral record was created
    const referrals = storageService.getReferralsByReferrer(referrerAddress);
    expect(referrals).toHaveLength(1);
    expect(referrals[0].referredAddress).toBe(referredAddress);
    expect(referrals[0].rewardAmount).toBe(APP_CONFIG.REFERRAL_REWARD);
  });

  it('should generate unique referral codes and invite codes', () => {
    const user1 = storageService.createOrGetUser('0xaddress1', 'User 1');
    const user2 = storageService.createOrGetUser('0xaddress2', 'User 2');
    
    expect(user1.referralCode).not.toBe(user2.referralCode);
    expect(user1.referralCode).toMatch(/^REF-[A-Z0-9]{5}$/);
    
    const invite1 = storageService.generateInviteCode();
    const invite2 = storageService.generateInviteCode();
    
    expect(invite1).not.toBe(invite2);
    expect(invite1).toMatch(/^SC-[A-Z0-9]{4}-[A-Z0-9]{4}$/);
  });

  it('should properly calculate group statistics', () => {
    const testAddress = '0x742d35cc6681c4d6e0dc2ad7c5e3e8a2a2b8f1a8';
    const groupId = 'stats-test-group';
    
    // Create multiple contributions
    const contributions = [
      { amount: 50, round: 1 },
      { amount: 50, round: 2 },
      { amount: 75, round: 3 },
    ];
    
    contributions.forEach((contrib, index) => {
      storageService.addContribution({
        id: `contrib-${index}`,
        groupId,
        memberId: testAddress,
        amount: contrib.amount,
        round: contrib.round,
        transactionHash: `0x${index.toString().padStart(64, '0')}`,
        createdAt: dayjs().toISOString(),
      });
    });
    
    const groupContributions = storageService.getContributionsByGroupId(groupId);
    const totalAmount = groupContributions.reduce((sum, c) => sum + c.amount, 0);
    
    expect(groupContributions).toHaveLength(3);
    expect(totalAmount).toBe(175);
  });

  it('should validate mock transaction configuration', () => {
    // Verify that USE_MOCK_TX is properly configured for testing
    expect(APP_CONFIG.USE_MOCK_TX).toBeDefined();
    
    // Test referral reward amount
    expect(APP_CONFIG.REFERRAL_REWARD).toBe(5);
    
    // Test minimum contribution
    expect(APP_CONFIG.MIN_CONTRIBUTION).toBeGreaterThan(0);
    
    // Test network configuration
    expect(APP_CONFIG.CELO_NETWORKS.ALFAJORES.chainId).toBe(44787);
    expect(APP_CONFIG.CELO_NETWORKS.ALFAJORES.cUSD).toBeTruthy();
  });
});