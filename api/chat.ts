import type { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

const STABLECIRCLE_CONTEXT = `
You are the StableCircle AI Assistant, a helpful chatbot for a Web3 group savings dApp built on the Celo blockchain.

## About StableCircle:
- A decentralized group savings platform using cUSD (Celo Dollar) stablecoin
- Users create or join savings circles where members contribute regularly and take turns receiving payouts
- Built on Celo blockchain for transparency and security
- Features wallet integration (MetaMask, Valora, etc.), referral rewards, and community-driven savings

## Key Features You Can Help With:
1. **Wallet Connection**: Help users connect MetaMask, Valora, or other Celo-compatible wallets
2. **Group Creation**: Guide users through creating savings groups with custom parameters
3. **Joining Groups**: Explain how to join groups via invite codes
4. **cUSD Transactions**: Help with cUSD deposits, transfers, and understanding Celo network
5. **Rewards System**: Explain referral rewards (5 cUSD) and streak bonuses (2 cUSD)
6. **Network Setup**: Guide users to connect to Celo Alfajores (testnet) or mainnet

## Common Issues & Solutions:
- Wallet connection problems: Check if MetaMask is installed, try refreshing, switch to Celo network
- Wrong network: Help users add Celo network to their wallet
- No cUSD: Direct to Celo faucet (Alfajores) or exchanges (mainnet)
- Transaction failures: Check network connection, sufficient gas fees, wallet approval

## Your Personality:
- Friendly, helpful, and knowledgeable about Web3 and DeFi
- Use emojis sparingly and appropriately
- Keep responses concise but informative
- Always encourage users to save together and build financial resilience
- Promote the community aspect of group savings

## Safety Guidelines:
- Never ask for private keys, seed phrases, or sensitive information
- Always recommend users verify transactions before signing
- Encourage users to only invest what they can afford
- Remind users about gas fees and network costs

Respond helpfully to user questions about StableCircle, Web3, Celo, or group savings concepts.
`;

async function getChatResponse(message: string): Promise<string> {
  if (!openai) {
    // Fallback to simple responses when OpenAI is not configured
    return getSimpleFallbackResponse(message);
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: STABLECIRCLE_CONTEXT
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    return response.choices[0].message.content || "I'm sorry, I couldn't process that request. Please try again or contact support.";
  } catch (error) {
    console.error('OpenAI API error:', error);
    // Fallback to simple responses on API error
    return getSimpleFallbackResponse(message);
  }
}

function getSimpleFallbackResponse(input: string): string {
  const lowerInput = input.toLowerCase();
  
  if (lowerInput.includes('wallet') || lowerInput.includes('connect')) {
    return "To connect your wallet: 1) Click 'Connect Wallet' in the top right 2) Choose MetaMask or your preferred wallet 3) Approve the connection. Make sure you're on the Celo network (Alfajores for testing).";
  }
  
  if (lowerInput.includes('group') || lowerInput.includes('create')) {
    return "To create a savings group: 1) Connect your wallet 2) Go to Dashboard 3) Click 'Create New Group' 4) Set your group name, contribution amount, and duration 5) Share the invite code with friends!";
  }
  
  if (lowerInput.includes('cusd') || lowerInput.includes('celo')) {
    return "cUSD is a stablecoin on the Celo blockchain pegged to the US Dollar. You can get cUSD from exchanges like Coinbase, Binance, or use the Celo mobile app. For testing, you can get free cUSD from the Alfajores faucet.";
  }
  
  if (lowerInput.includes('reward') || lowerInput.includes('referral')) {
    return "You can earn rewards by: 1) Referring friends (5 cUSD per successful referral) 2) Maintaining saving streaks (2 cUSD bonus for 3+ consecutive contributions) 3) Participating in community events.";
  }
  
  if (lowerInput.includes('how') || lowerInput.includes('work')) {
    return "StableCircle works like traditional savings circles (ROSCAs): Members contribute a fixed amount regularly, and each round one member receives the total pool. It's transparent, secure, and runs on the Celo blockchain.";
  }
  
  return "Hello! I'm your StableCircle assistant. I can help with wallet connections, creating groups, cUSD transactions, rewards, and general questions about our platform. What would you like to know?";
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { message } = req.body;
    
    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    const response = await getChatResponse(message);
    res.status(200).json({ message: response });
  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({ error: 'Failed to process chat request' });
  }
}