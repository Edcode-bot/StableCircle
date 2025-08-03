# StableCircle dApp Development

## Project Overview
StableCircle is a production-ready Web3 decentralized application (dApp) that enables users to form collaborative savings hubs using cUSD stablecoins on the Celo blockchain. The application combines traditional group savings with modern blockchain technology, gamification features, and real-time collaboration tools.

## User Preferences
- Keep existing LandingPage and ChatBot components intact - do not overwrite them
- Use MongoDB for production data persistence with backup localStorage support
- Support MetaMask, WalletConnect, and Valora mobile wallets on Celo network
- Mobile-first design with PWA capabilities for app-like experience
- USE_MOCK_TX flag to toggle between real and mock transactions for development

## Recent Changes (Latest First)

### August 2025 - Complete Migration & Enhancement
- ✓ Migrated from Replit Agent to standard Replit environment
- ✓ Fixed mobile wallet connection with enhanced fallback support for Chrome, Brave, Safari, in-app browsers
- ✓ Enhanced mobile dashboard with comprehensive EnhancedHubCard components
- ✓ Added Smart Suggestions engine with personalized recommendations and dismissible actions
- ✓ Implemented Global Impact Tracker with live statistics, activity feed, and real-time updates
- ✓ Redesigned landing page with animated hero section, live impact counter, and trust elements
- ✓ Integrated MongoDB with comprehensive data models and real-time chat
- ✓ Updated terminology from "Groups" to "Savings Hubs" throughout application
- ✓ Implemented mobile-first UI with bottom navigation and responsive components
- ✓ Added comprehensive gamification system with streaks, badges, and rewards
- ✓ Built smart suggestions engine with progress tracking and goal optimization
- ✓ Created global impact tracker showing community statistics and growth
- ✓ Implemented real-time hub chat with Socket.IO integration
- ✓ Added PWA capabilities with manifest, service worker, and offline support
- ✓ Enhanced WalletConnect integration for mobile wallet support

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
- **Express.js** server with comprehensive API endpoints
- **MongoDB** with custom collections for production data persistence
- **Socket.IO** for real-time chat and notifications
- **WebSocket** integration for wallet connectivity

### Web3 Configuration
- **Celo Networks**: Alfajores testnet and mainnet support
- **Wallet Integration**: MetaMask, Valora, WalletConnect Mobile
- **Token Support**: cUSD (Celo USD) stablecoin
- **Mock Transactions**: Configurable for development/testing

### Key Components
- `WalletContext`: Enhanced wallet connection and transaction management
- `MobileDashboard`: Mobile-first dashboard with bottom navigation
- `HubChat`: Real-time chat for each savings hub
- `GamificationBadges`: Achievement system with progress tracking
- `SmartSuggestions`: AI-powered savings optimization recommendations
- `GlobalImpactTracker`: Community statistics and growth metrics
- `CreateHubForm/JoinHubForm`: Enhanced hub creation and joining flows
- `BottomNavigation`: Mobile navigation with PWA support
- `ChatBot`: AI-powered user assistance (OpenAI integration)

### Data Models
- **User**: Enhanced profile with badges, streaks, and social features
- **SavingsHub**: Collaborative savings groups with goals and deadlines
- **Contribution**: Individual savings transactions with streak tracking
- **Referral**: Referral tracking and reward distribution
- **Message**: Real-time chat messages for hub communication
- **Leaderboard**: Community rankings and achievements
- **GlobalStats**: Platform-wide metrics and growth tracking

### Database Collections (MongoDB)
- `users`: User profiles and wallet information
- `savingsHubs`: Savings hub configurations and metadata
- `contributions`: Individual contribution records
- `referrals`: Referral tracking and rewards
- `messages`: Real-time chat messages
- `leaderboard`: Community rankings
- `globalStats`: Platform statistics

### Environment Variables
```
VITE_CELO_NETWORK=alfajores
VITE_CUSD_ADDRESS=0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1
VITE_USE_MOCK_TX=true
OPENAI_API_KEY=your_openai_api_key
MONGODB_URI=mongodb+srv://techalaxy_1:3ppBZjfsdcjt25zl@clusterlunaai.rdxe7vj.mongodb.net/
```

## Development Guidelines
- Use TypeScript throughout the application
- Follow React best practices with hooks and context
- Implement comprehensive error handling
- Maintain responsive mobile-first design with PWA support
- Use environment variables for configuration
- Test with mock transactions before mainnet deployment
- Leverage MongoDB for production data with localStorage fallback

## Mobile-First Features
- Bottom navigation for mobile users
- PWA capabilities with offline support
- Touch-optimized interface components
- Real-time notifications and updates
- Swipe navigation and mobile gestures

## Gamification System
- Daily and weekly streak tracking
- Achievement badges for milestones
- Community leaderboards and rankings
- Smart suggestions for goal optimization
- Social features and referral rewards

## Testing Strategy
- Mock transaction simulation for development
- Unit tests for core business logic
- Integration tests for wallet connectivity
- Real-time features testing with Socket.IO
- PWA functionality and offline mode testing
- Mobile wallet integration testing

## Future Enhancements
- Smart contract deployment for automated payouts
- Enhanced push notification system
- Multi-language support with i18n
- Advanced analytics and reporting dashboard
- Native mobile app development (React Native)
- Integration with additional DeFi protocols