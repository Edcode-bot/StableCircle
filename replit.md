# StableCircle - Web3 Group Savings dApp

## Overview

StableCircle is a Web3 decentralized application (dApp) that enables users to form rotating savings and credit associations (ROSCAs) using stablecoins. The platform facilitates group savings where members contribute fixed amounts over time, with payouts rotating among participants. Built as a modern React application with Web3 integration, it provides a complete savings circle management system with wallet connectivity, group creation, member management, and contribution tracking.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development practices
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: shadcn/ui component library built on Radix UI primitives for accessible, consistent design
- **Styling**: Tailwind CSS with custom CSS variables for theming and responsive design
- **State Management**: React Context API for global state (WalletContext, GroupContext)
- **Forms**: React Hook Form with Zod validation for type-safe form handling

### Backend Architecture
- **Server Framework**: Express.js with TypeScript
- **Development Setup**: Vite for fast development builds and hot module replacement
- **Storage Strategy**: Currently using localStorage with a migration path to database storage
- **API Structure**: RESTful API endpoints under `/api` prefix (framework in place)

### Data Storage Solutions
- **Current**: LocalStorageService class for client-side persistence
- **Future**: Drizzle ORM configured for PostgreSQL database migration
- **Schema**: Zod schemas for runtime type validation and data integrity
- **Data Models**: Groups, Members, Contributions, and Users with relational structure

### Web3 Integration
- **Wallet Connection**: MetaMask and WalletConnect support via ethers.js
- **Transaction Simulation**: Mock stablecoin transactions for development and testing
- **Provider Management**: Web3Provider abstraction for wallet interactions
- **Balance Tracking**: Real-time wallet balance monitoring

### Authentication and Authorization
- **Web3 Authentication**: Wallet-based authentication using connected wallet addresses
- **Session Management**: Wallet connection state persisted across sessions
- **Authorization**: Role-based access within groups (admin/member permissions)

### Component Architecture
- **Modular Design**: Reusable components for group management, wallet interactions, and forms
- **Context Providers**: Centralized state management for wallet and group data
- **Custom Hooks**: useCountdown for real-time timers, useToast for notifications
- **Modal System**: Dialog-based interactions for contributions, group creation, and joining

## External Dependencies

### Web3 Services
- **MetaMask**: Primary wallet provider for Web3 transactions
- **WalletConnect**: Alternative wallet connection protocol
- **Ethers.js**: Ethereum interaction library for wallet operations and transaction handling

### Database and Storage
- **Neon Database**: PostgreSQL database service (configured via DATABASE_URL)
- **Drizzle ORM**: Type-safe database toolkit for PostgreSQL operations
- **LocalStorage**: Browser storage for development and offline functionality

### UI and Development Tools
- **Radix UI**: Headless UI components for accessibility and customization
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Vite**: Build tool and development server
- **React Query**: Server state management and caching (configured but not actively used)

### Utility Libraries
- **Day.js**: Date manipulation and formatting with duration and relative time plugins
- **Zod**: Runtime type validation and schema definition
- **Nanoid**: Unique ID generation for entities
- **React Hook Form**: Form state management and validation

### Deployment and Infrastructure
- **Vercel**: Deployment platform (Vercel-ready configuration)
- **Replit**: Development environment integration with runtime error overlay
- **Connect PG Simple**: PostgreSQL session store for production deployment