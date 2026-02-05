import { create } from 'zustand';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  model?: string;
  isStreaming?: boolean;
}

interface GatewayState {
  model: string;
  sessionKey: string;
  isConnected: boolean;
  isConnecting: boolean;
  lastUpdate: Date | null;
  messages: Message[];
  setModel: (model: string) => void;
  setSessionKey: (sessionKey: string) => void;
  setIsConnected: (isConnected: boolean) => void;
  setIsConnecting: (isConnecting: boolean) => void;
  setLastUpdate: (lastUpdate: Date) => void;
  addMessage: (message: Message) => void;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  clearMessages: () => void;
  setMessages: (messages: Message[]) => void;
}

export const useGatewayStore = create<GatewayState>((set) => ({
  model: 'connecting...',
  sessionKey: 'agent:main:main',
  isConnected: false,
  isConnecting: false,
  lastUpdate: null,
  messages: [],
  setModel: (model) => set({ model }),
  setSessionKey: (sessionKey) => set({ sessionKey }),
  setIsConnected: (isConnected) => set({ isConnected }),
  setIsConnecting: (isConnecting) => set({ isConnecting }),
  setLastUpdate: (lastUpdate) => set({ lastUpdate }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  updateMessage: (id, updates) => set((state) => ({
    messages: state.messages.map(msg => 
      msg.id === id ? { ...msg, ...updates } : msg
    )
  })),
  clearMessages: () => set({ messages: [] }),
  setMessages: (messages) => set({ messages }),
}));