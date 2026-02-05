'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
  Send,
  Loader2,
  Wifi,
  WifiOff,
  Zap,
  Trash2,
  RotateCcw,
  Bot,
  User,
  Settings,
  Circle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useUIStore } from '@/stores/ui-store';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  model?: string;
  isStreaming?: boolean;
}

interface SessionInfo {
  model: string;
  sessionKey: string;
  agentId?: string;
  contextTokens?: number;
  maxTokens?: number;
}

const quickCommands = [
  { label: '🧠 Think High', command: '/think high', description: 'Enable deep thinking' },
  { label: '📊 Status', command: '/status', description: 'Show session status' },
  { label: '🔄 Model', command: '/model', description: 'Switch model' },
  { label: '🗑️ Clear', command: '/clear', description: 'Clear chat' },
];

export function Terminal() {
  const { terminalOpen, terminalExpanded, toggleTerminal, toggleTerminalExpanded, setTerminalOpen } = useUIStore();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [sessionInfo, setSessionInfo] = useState<SessionInfo>({
    model: 'connecting...',
    sessionKey: 'agent:main:main',
  });
  const wsRef = useRef<WebSocket | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentRunIdRef = useRef<string | null>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      const scrollElement = scrollRef.current;
      scrollElement.scrollTop = scrollElement.scrollHeight;
    }
  }, [messages, isThinking]);

  // Connect to WebSocket
  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;
    
    setIsConnecting(true);
    
    try {
      const wsHost = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
      const wsUrl = process.env.NEXT_PUBLIC_ATLAS_WS_URL || `ws://${wsHost}:63362/ws`;
      const wsUrlWithAuth = `${wsUrl}?token=${process.env.NEXT_PUBLIC_ATLAS_GATEWAY_TOKEN || ''}`;
      const ws = new WebSocket(wsUrlWithAuth);
      
      ws.onopen = () => {
        console.log('WebSocket opened, waiting for connect challenge...');
      };
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          // Handle Gateway protocol handshake
          if (data.type === 'event' && data.event === 'connect.challenge') {
            const connectReq = {
              type: 'req',
              id: `connect-${Date.now()}`,
              method: 'connect',
              params: {
                minProtocol: 3,
                maxProtocol: 3,
                client: {
                  id: 'webchat-ui',
                  version: '0.1.0',
                  platform: 'web',
                  mode: 'webchat'
                },
                role: 'operator',
                scopes: ['operator.read', 'operator.write'],
                caps: [],
                commands: [],
                permissions: {},
                auth: { token: process.env.NEXT_PUBLIC_ATLAS_GATEWAY_TOKEN || '' },
                locale: 'en-US',
                userAgent: 'atlas-hq-terminal/1.0.0'
              }
            };
            ws.send(JSON.stringify(connectReq));
            return;
          }
          
          // Handle connect response - extract session info
          if (data.type === 'res' && data.payload?.type === 'hello-ok') {
            setIsConnected(true);
            setIsConnecting(false);
            
            // Extract model and session info from snapshot
            const snapshot = data.payload?.snapshot;
            const sessions = snapshot?.sessions || [];
            const mainSession = sessions.find((s: { key: string }) => s.key === 'agent:main:main');
            
            if (mainSession) {
              setSessionInfo({
                model: mainSession.model || 'unknown',
                sessionKey: mainSession.key,
                agentId: mainSession.agentId,
                contextTokens: mainSession.contextTokens,
                maxTokens: mainSession.maxContextTokens,
              });
            } else if (snapshot?.sessionDefaults) {
              setSessionInfo(prev => ({
                ...prev,
                model: snapshot.sessionDefaults.defaultModel || prev.model,
              }));
            }
            
            // Request session status to get current model
            ws.send(JSON.stringify({
              type: 'req',
              id: `status-${Date.now()}`,
              method: 'sessions.list',
              params: {}
            }));
            
            // Welcome message
            setMessages([{
              id: 'welcome',
              role: 'system',
              content: '🟢 Connected to Atlas Gateway. Ready to chat.',
              timestamp: new Date(),
            }]);
            return;
          }
          
          // Handle sessions.list response to get model info
          if (data.type === 'res' && data.ok && Array.isArray(data.payload?.sessions)) {
            const mainSession = data.payload.sessions.find((s: { key: string }) => s.key === 'agent:main:main');
            if (mainSession?.model) {
              setSessionInfo(prev => ({
                ...prev,
                model: mainSession.model,
                contextTokens: mainSession.contextTokens,
                maxTokens: mainSession.maxContextTokens,
              }));
            }
            return;
          }
          
          // Handle errors
          if (data.type === 'res' && data.error) {
            console.error('Gateway error:', data.error);
            setMessages((prev) => [
              ...prev,
              {
                id: Date.now().toString(),
                role: 'system',
                content: `⚠️ ${data.error.message || 'Connection error'}`,
                timestamp: new Date(),
              },
            ]);
            setIsThinking(false);
            return;
          }
          
          // Handle agent lifecycle events (thinking indicator)
          if (data.type === 'event' && data.event === 'agent') {
            const payload = data.payload;
            if (payload?.stream === 'lifecycle') {
              if (payload.data?.phase === 'start') {
                setIsThinking(true);
                currentRunIdRef.current = payload.runId;
              } else if (payload.data?.phase === 'end') {
                setIsThinking(false);
                currentRunIdRef.current = null;
              }
            }
            // Extract model from agent events
            if (payload?.data?.model) {
              setSessionInfo(prev => ({ ...prev, model: payload.data.model }));
            }
          }
          
          // Handle chat events (final responses)
          if (data.type === 'event' && data.event === 'chat') {
            const payload = data.payload;
            
            if (payload?.state === 'final' && payload?.message) {
              const msg = payload.message;
              let textContent = '';
              
              if (Array.isArray(msg.content)) {
                textContent = msg.content
                  .filter((c: { type: string; text?: string }) => c.type === 'text')
                  .map((c: { text?: string }) => c.text || '')
                  .join('\n');
              } else if (typeof msg.content === 'string') {
                textContent = msg.content;
              }
              
              if (textContent) {
                setMessages((prev) => [
                  ...prev,
                  {
                    id: payload.runId || Date.now().toString(),
                    role: 'assistant',
                    content: textContent,
                    timestamp: new Date(msg.timestamp || Date.now()),
                    model: sessionInfo.model,
                  },
                ]);
              }
              setIsThinking(false);
            }
          }
        } catch (err) {
          console.error('Failed to parse WebSocket message:', err);
        }
      };
      
      ws.onclose = () => {
        setIsConnected(false);
        setIsConnecting(false);
        setIsThinking(false);
        
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, 5000);
      };
      
      ws.onerror = () => {
        setIsConnected(false);
        setIsConnecting(false);
      };
      
      wsRef.current = ws;
    } catch (err) {
      console.error('Failed to connect:', err);
      setIsConnecting(false);
    }
  }, [sessionInfo.model]);

  useEffect(() => {
    if (terminalOpen) {
      connect();
    }
    
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      wsRef.current?.close();
    };
  }, [terminalOpen, connect]);

  const handleSubmit = () => {
    if (!input.trim() || !isConnected) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    
    const chatId = `chat-${Date.now()}`;
    const chatRequest = {
      type: 'req',
      id: chatId,
      method: 'chat.send',
      params: {
        sessionKey: sessionInfo.sessionKey,
        message: input.trim(),
        idempotencyKey: chatId,
        deliver: false
      }
    };
    
    wsRef.current?.send(JSON.stringify(chatRequest));
    setInput('');
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const clearMessages = () => {
    setMessages([{
      id: 'cleared',
      role: 'system',
      content: '🗑️ Chat cleared.',
      timestamp: new Date(),
    }]);
  };

  const handleQuickCommand = (cmd: string) => {
    if (cmd === '/clear') {
      clearMessages();
    } else {
      setInput(cmd + ' ');
      textareaRef.current?.focus();
    }
  };

  // Floating button when closed
  if (!terminalOpen) {
    return (
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setTerminalOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-gradient-to-br from-cyan to-purple shadow-lg shadow-cyan/25 hover:shadow-cyan/40 transition-shadow"
      >
        <Bot className="w-6 h-6 text-white" />
      </motion.button>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className={cn(
          'fixed bottom-0 left-0 right-0 z-50 flex flex-col',
          'bg-gradient-to-b from-background to-background/95 backdrop-blur-xl',
          'border-t border-border/50 shadow-2xl shadow-black/20',
          terminalExpanded ? 'h-[85vh]' : 'h-96',
          'md:left-[72px]'
        )}
        style={{ marginLeft: 'var(--sidebar-width, 72px)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-muted/20">
          <div className="flex items-center gap-4">
            {/* Connection Status */}
            <div className="flex items-center gap-2">
              <div className={cn(
                'w-2 h-2 rounded-full',
                isConnected ? 'bg-emerald-500 shadow-lg shadow-emerald-500/50' : 'bg-red-500'
              )} />
              <span className="text-sm font-medium text-foreground">Atlas Terminal</span>
            </div>
            
            {/* Model Badge */}
            <Badge 
              variant="secondary" 
              className="font-mono text-xs bg-muted/50 hover:bg-muted transition-colors"
            >
              <Zap className="w-3 h-3 mr-1 text-amber-500" />
              {sessionInfo.model.split('/').pop() || sessionInfo.model}
            </Badge>
            
            {/* Thinking Indicator */}
            {isThinking && (
              <Badge variant="outline" className="animate-pulse border-cyan/50 text-cyan">
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                Thinking...
              </Badge>
            )}
          </div>
          
          {/* Controls */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={clearMessages}
              title="Clear chat"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={toggleTerminalExpanded}
              title={terminalExpanded ? 'Minimize' : 'Expand'}
            >
              {terminalExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={toggleTerminal}
              title="Close"
            >
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full" ref={scrollRef}>
            <div className="p-4 space-y-4">
              {messages.length === 0 && !isConnecting && (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Bot className="w-12 h-12 mb-4 opacity-50" />
                  <p className="text-sm">Start a conversation with Atlas</p>
                </div>
              )}
              
              {isConnecting && (
                <div className="flex items-center justify-center py-8 text-muted-foreground">
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  <span className="text-sm">Connecting to Gateway...</span>
                </div>
              )}
              
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    'flex gap-3',
                    message.role === 'user' && 'flex-row-reverse'
                  )}
                >
                  {/* Avatar */}
                  <div className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                    message.role === 'assistant' && 'bg-gradient-to-br from-cyan to-purple',
                    message.role === 'user' && 'bg-primary',
                    message.role === 'system' && 'bg-muted'
                  )}>
                    {message.role === 'assistant' && <Bot className="w-4 h-4 text-white" />}
                    {message.role === 'user' && <User className="w-4 h-4 text-primary-foreground" />}
                    {message.role === 'system' && <Settings className="w-4 h-4 text-muted-foreground" />}
                  </div>
                  
                  {/* Message Bubble */}
                  <div className={cn(
                    'max-w-[75%] rounded-2xl px-4 py-3',
                    message.role === 'user' && 'bg-primary text-primary-foreground rounded-tr-sm',
                    message.role === 'assistant' && 'bg-muted/70 text-foreground rounded-tl-sm',
                    message.role === 'system' && 'bg-muted/30 text-muted-foreground text-sm italic'
                  )}>
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    <div className={cn(
                      'flex items-center gap-2 mt-2 text-xs',
                      message.role === 'user' ? 'text-primary-foreground/60' : 'text-muted-foreground'
                    )}>
                      <span>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {message.model && (
                        <>
                          <span>•</span>
                          <span className="font-mono">{message.model.split('/').pop()}</span>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {/* Thinking Animation */}
              {isThinking && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan to-purple flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-muted/70 rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex gap-1.5">
                      <motion.div
                        className="w-2 h-2 bg-cyan rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-cyan rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-cyan rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-border/50 bg-muted/10">
          {/* Quick Commands */}
          <div className="flex gap-2 mb-3 overflow-x-auto no-scrollbar pb-1">
            {quickCommands.map((cmd) => (
              <button
                key={cmd.command}
                onClick={() => handleQuickCommand(cmd.command)}
                className="px-3 py-1.5 text-xs rounded-full bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground whitespace-nowrap transition-colors border border-transparent hover:border-border/50"
                title={cmd.description}
              >
                {cmd.label}
              </button>
            ))}
          </div>

          {/* Input Field */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isConnected ? "Message Atlas..." : "Connecting..."}
                disabled={!isConnected || isThinking}
                className={cn(
                  "min-h-[48px] max-h-32 resize-none rounded-xl",
                  "bg-muted/30 border-border/50 focus:border-cyan/50",
                  "placeholder:text-muted-foreground/50",
                  "transition-all duration-200"
                )}
                rows={1}
              />
            </div>
            <Button
              onClick={handleSubmit}
              disabled={!input.trim() || !isConnected || isThinking}
              className={cn(
                "h-12 w-12 rounded-xl",
                "bg-gradient-to-r from-cyan to-purple",
                "hover:opacity-90 hover:shadow-lg hover:shadow-cyan/25",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "transition-all duration-200"
              )}
            >
              {isThinking ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
          
          {/* Status Bar */}
          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground/60">
            <span>Session: {sessionInfo.sessionKey}</span>
            <span>Press Enter to send, Shift+Enter for new line</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
