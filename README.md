# StableCircle - Decentralized Group Savings dApp

A production-ready Web3 decentralized application (dApp) that enables users to form rotating savings and credit associations (ROSCAs) using cUSD stablecoins on the Celo blockchain.

## 🌟 Features

### Core Functionality
- **Group Savings Circles**: Create and join rotating savings groups with customizable parameters
- **Real Celo Integration**: Actual cUSD transactions on Celo Alfajores (testnet) and mainnet
- **Wallet Support**: MetaMask, Valora, and other Celo-compatible wallets
- **Transparent Payouts**: All transactions recorded on-chain for full transparency

### Production-Ready Features
- **SEO Optimized**: Complete meta tags, Open Graph, Twitter Cards, and structured data
- **Mobile-First Design**: Responsive UI optimized for mobile and desktop
- **AI Chatbot**: OpenAI-powered assistant for user support and guidance
- **Referral System**: Earn 5 cUSD for successful referrals
- **Streak Rewards**: 2 cUSD bonus for consistent saving patterns
- **Landing Page**: Professional marketing page with FAQ and video integration

### Technical Features
- **Real Blockchain Transactions**: Integrated with Celo network for actual cUSD transfers
- **Network Auto-Detection**: Automatically switches to correct Celo network
- **Balance Tracking**: Real-time cUSD and CELO balance display
- **Transaction History**: Explorer links for all blockchain transactions
- **Error Handling**: Comprehensive error management and user feedback

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MetaMask or Celo-compatible wallet
- Some CELO for gas fees (free from Alfajores faucet for testnet)

### Installation
```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5000`

### Wallet Setup
1. Install MetaMask or Valora wallet
2. Add Celo Alfajores testnet:
   - Network Name: Celo Alfajores Testnet
   - RPC URL: https://alfajores-forno.celo-testnet.org
   - Chain ID: 44787
   - Currency: CELO
   - Explorer: https://explorer.celo.org/alfajores

3. Get test tokens from [Celo Faucet](https://faucet.celo.org/alfajores)

## 🏗️ Architecture

### Frontend
- **React 18** with TypeScript for type safety
- **Tailwind CSS** for responsive styling
- **Radix UI** components for accessibility
- **Wouter** for client-side routing
- **React Query** for server state management

### Blockchain Integration
- **Ethers.js v6** for Ethereum/Celo interactions
- **Celo ContractKit** for Celo-specific functionality
- **cUSD Token Contract** for stablecoin transactions
- **Real Wallet Integration** with MetaMask and Valora

### Backend
- **Express.js** REST API
- **OpenAI Integration** for chatbot functionality
- **TypeScript** throughout the stack
- **Vite** for fast development and building

### Storage & Data
- **LocalStorage** for client-side persistence
- **Zod** for runtime type validation
- **Database Ready** with Drizzle ORM setup
- **Session Management** for wallet connections

## 📱 Usage

### Creating a Savings Group
1. Connect your wallet on the landing page
2. Navigate to "Create Group"
3. Set group parameters:
   - Group name and description
   - Contribution amount (minimum 10 cUSD)
   - Payment frequency (weekly/monthly)
   - Group duration (7-365 days)
4. Share the generated invite code with friends

### Joining a Group
1. Get an invite code from a group creator
2. Click "Join Group" and enter the code
3. Review group details and confirm participation
4. Make your first contribution to activate membership

### Making Contributions
1. Go to your group's detail page
2. Click "Make Contribution"
3. Confirm the transaction in your wallet
4. Track your progress on the dashboard

## 🎯 Rewards System

### Referral Rewards
- Earn **5 cUSD** for each successful referral
- Friends must join a group and make first contribution
- Rewards credited automatically

### Streak Bonuses
- Earn **2 cUSD** for maintaining 3+ consecutive contributions
- Bonus awarded automatically
- Encourages consistent saving habits

## 🔧 Configuration

### Environment Variables
```bash
# Optional: OpenAI API key for enhanced chatbot
OPENAI_API_KEY=your_openai_api_key_here

# Optional: Database URL for persistent storage
DATABASE_URL=your_postgresql_url_here
```

### Network Configuration
Edit `client/src/config/constants.ts` to switch between:
- **Alfajores** (testnet) - Default for development
- **Mainnet** - For production deployment

## 🛠️ Development

### Project Structure
```
├── client/
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/         # Route components
│   │   ├── contexts/      # React contexts
│   │   ├── lib/           # Utilities and services
│   │   └── config/        # Configuration files
├── server/                # Express backend
├── shared/               # Shared types and schemas
└── docs/                # Documentation
```

### Key Components
- **WalletProvider**: Manages Celo wallet connections
- **CeloWalletService**: Handles blockchain interactions
- **ChatBot**: AI-powered user assistance
- **LandingPage**: SEO-optimized marketing page

### Testing
```bash
# Run type checking
npm run typecheck

# Check for linting issues
npm run lint

# Build for production
npm run build
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy with automatic CI/CD

### Manual Deployment
```bash
# Build the application
npm run build

# Deploy the dist folder
# Configure your server to serve the static files
```

## 🤖 AI Chatbot

The integrated chatbot provides:
- Wallet connection guidance
- Group creation help
- cUSD and Celo blockchain education
- Troubleshooting support
- Platform feature explanations

## 🔒 Security

### Smart Contract Security
- Uses established cUSD token contract on Celo
- No custom smart contracts reduce attack surface
- All transactions verified on-chain

### Wallet Security
- Never stores private keys or seed phrases
- Uses secure wallet connection protocols
- Encourages hardware wallet usage

### Data Privacy
- Minimal data collection
- Wallet addresses are public blockchain data
- No personal information required

## 📚 Learn More

### Resources
- [Celo Documentation](https://docs.celo.org/)
- [cUSD Stablecoin](https://celo.org/developers/cusd)
- [MetaMask Setup](https://metamask.io/)
- [Valora Wallet](https://valoraapp.com/)

### Community
- [Discord](https://discord.gg/stablecircle)
- [Twitter](https://twitter.com/stablecircle)
- [GitHub](https://github.com/stablecircle/stablecircle)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 👥 Team

Built with ❤️ by **Edcode and Bruno Maa**

---

**StableCircle** - Empowering communities through decentralized group savings on Celo 🌍