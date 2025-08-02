// Production configuration constants
export const APP_CONFIG = {
  // Toggle between mock and real transactions
  USE_MOCK_TX: process.env.NODE_ENV === 'development' ? true : false,
  
  // Celo Network Configuration
  CELO_NETWORKS: {
    ALFAJORES: {
      chainId: 44787,
      name: 'Celo Alfajores Testnet',
      rpcUrl: 'https://alfajores-forno.celo-testnet.org',
      explorerUrl: 'https://explorer.celo.org/alfajores',
      cUSD: '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1',
      nativeCurrency: {
        name: 'Celo',
        symbol: 'CELO',
        decimals: 18,
      },
    },
    MAINNET: {
      chainId: 42220,
      name: 'Celo Mainnet',
      rpcUrl: 'https://forno.celo.org',
      explorerUrl: 'https://explorer.celo.org/mainnet',
      cUSD: '0x765DE816845861e75A25fCA122bb6898B8B1282a',
      nativeCurrency: {
        name: 'Celo',
        symbol: 'CELO',
        decimals: 18,
      },
    },
  },
  
  // Current network (use ALFAJORES for development)
  CURRENT_NETWORK: 'ALFAJORES' as 'ALFAJORES' | 'MAINNET',
  
  // App URLs
  BASE_URL: 'https://stablecircle.vercel.app',
  
  // Social Links
  SOCIAL_LINKS: {
    discord: 'https://discord.gg/stablecircle',
    twitter: 'https://twitter.com/stablecircle',
    github: 'https://github.com/edcode/stablecircle',
  },
  
  // Rewards and Referrals
  REFERRAL_REWARD: 5, // cUSD
  STREAK_BONUS: 2, // cUSD for 3+ consistent deposits
  
  // Group Settings
  MIN_CONTRIBUTION: 10, // cUSD
  MAX_GROUP_SIZE: 20,
  MIN_GROUP_DURATION: 7, // days
  MAX_GROUP_DURATION: 365, // days
} as const;

// FAQ Data
export const FAQ_DATA = [
  {
    question: "What is StableCircle?",
    answer: "StableCircle is a decentralized group savings application built on the Celo blockchain. It allows friends and communities to create savings circles where members contribute cUSD regularly and take turns receiving payouts."
  },
  {
    question: "How do group savings circles work?",
    answer: "Members contribute a fixed amount of cUSD at regular intervals. Each round, one member receives the total pool amount. The rotation continues until everyone has received a payout, ensuring fair distribution."
  },
  {
    question: "Is StableCircle secure?",
    answer: "Yes! StableCircle operates on the Celo blockchain, providing transparency and security. All transactions are recorded on-chain, and smart contracts manage fund distribution automatically."
  },
  {
    question: "What is cUSD?",
    answer: "cUSD (Celo Dollar) is a stable cryptocurrency pegged to the US Dollar, running on the Celo blockchain. It maintains price stability while offering the benefits of blockchain technology."
  },
  {
    question: "How do I earn rewards?",
    answer: "You can earn rewards through: 1) Referring friends (5 cUSD per successful referral), 2) Maintaining saving streaks (2 cUSD for 3+ consecutive contributions), and 3) Participating in community events."
  },
  {
    question: "Can I join multiple groups?",
    answer: "Yes! You can create or join multiple savings groups simultaneously. Each group operates independently with its own schedule and members."
  },
];

// Development/Testing wallet addresses (for testing purposes only)
export const TEST_ADDRESSES = {
  DEMO_GROUP_CREATOR: '0x742d35cc6681c4d6e0dc2ad7c5e3e8a2a2b8f1a8',
  DEMO_MEMBERS: [
    '0x8ba1f109551bD432803012645Hac136c',
    '0x4b0897b0513fdC7C541B6d9D7E929C4e5364D2dB',
    '0x583031D1113aD414F02576BD6afaBfb302140225',
  ],
} as const;