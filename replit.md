# StableCircle dApp Development

## Project Overview
StableCircle is a production-ready Web3 decentralized application (dApp) that enables users to form rotating savings and credit associations (ROSCAs) using cUSD stablecoins on the Celo blockchain. The application combines traditional savings circles with modern blockchain technology for transparency and security.

## User Preferences
- Keep existing LandingPage and ChatBot components intact - do not overwrite them
- Use localStorage for now, but prepare Firebase structure for future scaling
- Support MetaMask, WalletConnect, and Valora wallets on Celo network
- USE_MOCK_TX flag to toggle between real and mock transactions for development

## Recent Changes (Latest First)

### December 2024 - Core Web3 Implementation
- ✓ Enhanced environment variable configuration with .env.example
- ✓ Added comprehensive referral system with tracking and rewards
- ✓ Created Leaderboard page for community rankings
- ✓ Implemented ContributionModal with transaction status tracking  
- ✓ Added mock transaction testing framework
- ✓ Enhanced WalletContext with referral integration
- ✓ Fixed ethers.js v6 compatibility issues
- ✓ Added comprehensive storage service for referrals and user management

## Project Architecture

### Frontend Stack
- **React 18** with TypeScript for type safety
- **Tailwind CSS** with shadcn/ui components for styling
- **Wouter** for client-side routing
- **React Query** for server state management
- **Ethers.js v6** for Celo blockchain interaction

### Backend Services
- **Express.js** server for API endpoints
- **Local Storage** for development data persistence
- **Firebase** ready for production scaling

### Web3 Configuration
- **Celo Networks**: Alfajores testnet and mainnet support
- **Wallet Integration**: MetaMask, Valora, WalletConnect
- **Token Support**: cUSD (Celo USD) stablecoin
- **Mock Transactions**: Configurable for development/testing

### Key Components
- `WalletContext`: Wallet connection and transaction management
- `GroupContext`: Group savings logic and state management
- `ContributionModal`: Transaction interface with status tracking
- `ReferralSection`: Referral system with rewards tracking
- `Leaderboard`: Community rankings and statistics
- `ChatBot`: AI-powered user assistance (OpenAI integration)

### Data Models
- **User**: Wallet address, referral codes, earnings, contributions
- **Group**: Savings circle configuration and metadata
- **Contribution**: Individual savings transactions
- **Referral**: Referral tracking and reward distribution

### Environment Variables
```
VITE_CELO_NETWORK=alfajores
VITE_CUSD_ADDRESS=0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1
VITE_USE_MOCK_TX=true
OPENAI_API_KEY=your_openai_api_key
```

## Development Guidelines
- Use TypeScript throughout the application
- Follow React best practices with hooks and context
- Implement comprehensive error handling
- Maintain responsive mobile-first design
- Use environment variables for configuration
- Test with mock transactions before mainnet deployment

## Testing Strategy
- Mock transaction simulation for development
- Unit tests for core business logic
- Integration tests for wallet connectivity
- End-to-end testing for user flows

## Future Enhancements
- Smart contract deployment for automated payouts
- Firebase integration for production data persistence
- Multi-language support
- Advanced analytics and reporting
- Mobile app development (React Native)