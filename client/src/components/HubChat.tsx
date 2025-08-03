import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, MessageCircle } from "lucide-react";
import { io, Socket } from "socket.io-client";
import { useWallet } from "@/contexts/WalletContext";
import type { Message } from "@shared/schema";

interface HubChatProps {
  hubId: string;
  hubName: string;
}

export function HubChat({ hubId, hubName }: HubChatProps) {
  const { address, userName } = useWallet();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize socket connection
    const socketInstance = io({
      transports: ['websocket', 'polling']
    });

    socketInstance.on('connect', () => {
      setIsConnected(true);
      socketInstance.emit('join-hub', hubId);
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
    });

    socketInstance.on('new-message', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    socketInstance.on('message-error', (error: string) => {
      console.error('Message error:', error);
    });

    setSocket(socketInstance);

    // Load initial messages
    loadMessages();

    return () => {
      socketInstance.disconnect();
    };
  }, [hubId]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const loadMessages = async () => {
    try {
      const response = await fetch(`/api/hubs/${hubId}/messages`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.reverse()); // Reverse to show oldest first
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !socket || !address || !userName) return;

    socket.emit('send-message', {
      hubId,
      content: newMessage.trim(),
      sender: address,
      senderName: userName
    });

    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MessageCircle className="h-5 w-5" />
          {hubName} Chat
          <div className={`ml-auto h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-4 space-y-4">
        <ScrollArea 
          ref={scrollAreaRef}
          className="flex-1 h-80 md:h-96 pr-4"
        >
          <div className="space-y-3">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === address ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 ${
                      message.sender === address
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                    }`}
                  >
                    {message.sender !== address && (
                      <div className="text-xs font-medium mb-1 opacity-70">
                        {message.senderName}
                      </div>
                    )}
                    <div className="text-sm">{message.content}</div>
                    <div className="text-xs opacity-70 mt-1">
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            disabled={!isConnected || !address}
            className="flex-1"
          />
          <Button
            onClick={sendMessage}
            disabled={!newMessage.trim() || !isConnected || !address}
            size="sm"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        {!address && (
          <p className="text-sm text-yellow-600 dark:text-yellow-400 text-center">
            Connect your wallet to participate in chat
          </p>
        )}
      </CardContent>
    </Card>
  );
}