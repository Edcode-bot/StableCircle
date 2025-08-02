# StableCircle - Web3 Group Savings dApp

StableCircle is a production-ready Web3 group savings dApp that enables users to form rotating savings groups (ROSCAs) using stablecoins. Built with React, Tailwind CSS, and modern Web3 technologies.

## Features

### Core Functionality
- **Wallet Integration**: MetaMask and WalletConnect support for seamless connection
- **Group Creation**: Create savings groups with custom parameters (duration, contribution amount, member limits)
- **Invite System**: Generate unique invite codes for friends to join groups
- **Mock Transactions**: Simulate stablecoin deposits with frontend state management
- **Contribution Tracking**: Real-time tracking of member contributions and progress
- **Countdown Timers**: Live countdown to next payout using Day.js
- **Referral System**: Generate unique referral codes to earn rewards
- **Responsive Design**: Mobile-first design with Tailwind CSS

### Technical Features
- **React 18**: Modern React with hooks and context API
- **TypeScript**: Full type safety throughout the application
- **Local Storage**: Persistent data storage with Firebase migration path
- **Ethers.js**: Web3 wallet interactions and transaction simulation
- **React Router**: Client-side routing with wouter
- **Component Library**: shadcn/ui components for consistent design
- **Real-time Updates**: Live countdown timers and progress tracking

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Web3**: Ethers.js, MetaMask, WalletConnect
- **Routing**: wouter
- **UI Components**: shadcn/ui, Radix UI
- **Time Management**: Day.js with duration and relative time plugins
- **State Management**: React Context API
- **Storage**: localStorage (with Firebase migration path)
- **Build Tool**: Vite
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- MetaMask browser extension or compatible Web3 wallet

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd StableCircle
