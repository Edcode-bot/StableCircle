import type { Express } from "express";
import { createServer, type Server } from "http";
import { Server as SocketIOServer } from "socket.io";
import { WebSocketServer } from "ws";
import { storage } from "./storage";
import { getChatResponse } from "./chatbot";
import { 
  createHubSchema, joinHubSchema, makeContributionSchema, 
  sendMessageSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Chatbot endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { message } = req.body;
      
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message is required' });
      }

      const response = await getChatResponse(message);
      res.json({ message: response });
    } catch (error) {
      console.error('Chat API error:', error);
      res.status(500).json({ error: 'Failed to process chat request' });
    }
  });

  // User operations
  app.get("/api/users/:wallet", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.wallet);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ error: 'Failed to get user' });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const user = await storage.createUser(req.body);
      res.json(user);
    } catch (error) {
      console.error('Create user error:', error);
      res.status(500).json({ error: 'Failed to create user' });
    }
  });

  // Savings Hub operations
  app.get("/api/hubs/:id", async (req, res) => {
    try {
      const hub = await storage.getSavingsHub(req.params.id);
      if (!hub) {
        return res.status(404).json({ error: 'Hub not found' });
      }
      res.json(hub);
    } catch (error) {
      console.error('Get hub error:', error);
      res.status(500).json({ error: 'Failed to get hub' });
    }
  });

  app.post("/api/hubs", async (req, res) => {
    try {
      const validatedData = createHubSchema.parse(req.body);
      const { wallet } = req.body;
      
      if (!wallet) {
        return res.status(400).json({ error: 'Wallet address required' });
      }

      const hub = await storage.createSavingsHub({ ...validatedData, creator: wallet });
      res.json(hub);
    } catch (error) {
      console.error('Create hub error:', error);
      res.status(500).json({ error: 'Failed to create hub' });
    }
  });

  app.post("/api/hubs/join", async (req, res) => {
    try {
      const validatedData = joinHubSchema.parse(req.body);
      const { wallet } = req.body;
      
      if (!wallet) {
        return res.status(400).json({ error: 'Wallet address required' });
      }

      const hub = await storage.getHubByInviteCode(validatedData.inviteCode);
      if (!hub) {
        return res.status(404).json({ error: 'Invalid invite code' });
      }

      const joined = await storage.joinHub(hub.id, wallet);
      if (!joined) {
        return res.status(400).json({ error: 'Failed to join hub' });
      }

      res.json({ success: true, hubId: hub.id });
    } catch (error) {
      console.error('Join hub error:', error);
      res.status(500).json({ error: 'Failed to join hub' });
    }
  });

  app.get("/api/users/:wallet/hubs", async (req, res) => {
    try {
      const hubs = await storage.getUserHubs(req.params.wallet);
      res.json(hubs);
    } catch (error) {
      console.error('Get user hubs error:', error);
      res.status(500).json({ error: 'Failed to get user hubs' });
    }
  });

  // Contribution operations
  app.post("/api/contributions", async (req, res) => {
    try {
      const validatedData = makeContributionSchema.parse(req.body);
      const { wallet } = req.body;
      
      if (!wallet) {
        return res.status(400).json({ error: 'Wallet address required' });
      }

      const contribution = await storage.createContribution({ ...validatedData, user: wallet });
      res.json(contribution);
    } catch (error) {
      console.error('Create contribution error:', error);
      res.status(500).json({ error: 'Failed to create contribution' });
    }
  });

  app.get("/api/hubs/:id/contributions", async (req, res) => {
    try {
      const contributions = await storage.getHubContributions(req.params.id);
      res.json(contributions);
    } catch (error) {
      console.error('Get hub contributions error:', error);
      res.status(500).json({ error: 'Failed to get contributions' });
    }
  });

  // Leaderboard operations
  app.get("/api/leaderboard", async (req, res) => {
    try {
      const leaderboard = await storage.getLeaderboard();
      res.json(leaderboard);
    } catch (error) {
      console.error('Get leaderboard error:', error);
      res.status(500).json({ error: 'Failed to get leaderboard' });
    }
  });

  // Global stats
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getGlobalStats();
      res.json(stats);
    } catch (error) {
      console.error('Get stats error:', error);
      res.status(500).json({ error: 'Failed to get stats' });
    }
  });

  // Messages operations
  app.get("/api/hubs/:id/messages", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const messages = await storage.getHubMessages(req.params.id, limit);
      res.json(messages);
    } catch (error) {
      console.error('Get messages error:', error);
      res.status(500).json({ error: 'Failed to get messages' });
    }
  });

  const httpServer = createServer(app);

  // Socket.IO setup for real-time chat
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join-hub', (hubId: string) => {
      socket.join(hubId);
      console.log(`User ${socket.id} joined hub ${hubId}`);
    });

    socket.on('send-message', async (data) => {
      try {
        const validatedData = sendMessageSchema.parse(data);
        const message = await storage.createMessage({
          ...validatedData,
          sender: data.sender,
          senderName: data.senderName
        });
        
        io.to(data.hubId).emit('new-message', message);
      } catch (error) {
        console.error('Send message error:', error);
        socket.emit('message-error', 'Failed to send message');
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  // WebSocket setup for wallet integration
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws) => {
    console.log('WebSocket connected');
    
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        // Handle wallet-related WebSocket messages
        console.log('WebSocket message:', data);
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      console.log('WebSocket disconnected');
    });
  });

  return httpServer;
}
