'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
  Send,
  Paperclip,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useUIStore } from '@/stores/ui-store';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  toolCalls?: { name: string; status: 'running' | 'completed' | 'failed' }[];
}

const quickCommands = [
  { label: '/think high', command: '/think high' },
  { label: '/verbose', command: '/verbose' },
  { label: '/clear', command: '/clear' },
];

export function Terminal() {
  const { terminalOpen, terminalExpanded, toggleTerminal, toggleTerminalExpanded, setTerminalOpen } = useUIStore();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m Atlas, your AI assistant. How can I help you today?',
      timestamp: new Date(),
    },
  ]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput('');

    // Simulate assistant response
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I received your message. This is a demo response. In production, this would connect to Atlas via WebSocket.',
        timestamp: new Date(),
        toolCalls: [
          { name: 'read', status: 'completed' },
        ],
      };
      setMessages((prev) => [...prev, response]);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (!terminalOpen) {
    return (
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        onClick={() => setTerminalOpen(true)}
        className="fixed bottom-4 right-4 z-50 p-4 rounded-full bg-gradient-to-br from-cyan to-purple glow-cyan hover:scale-105 transition-transform"
      >
        <Send className="w-5 h-5 text-background" />
      </motion.button>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className={cn(
          'fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border',
          terminalExpanded ? 'h-[80vh]' : 'h-80',
          'md:left-[72px]'
        )}
        style={{
          marginLeft: 'var(--sidebar-width, 72px)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 pulse-dot" />
              <span className="text-sm font-medium">Terminal</span>
            </div>
            <Badge variant="outline" className="text-xs">
              claude-opus-4-5
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={toggleTerminalExpanded}
            >
              {terminalExpanded ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={toggleTerminal}
            >
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 h-[calc(100%-8rem)]" ref={scrollRef}>
          <div className="p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex gap-3',
                  message.role === 'user' && 'justify-end'
                )}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan to-purple flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-background">A</span>
                  </div>
                )}
                <div
                  className={cn(
                    'max-w-[80%] rounded-lg px-4 py-2',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  )}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  {message.toolCalls && message.toolCalls.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-border/50 flex flex-wrap gap-1">
                      {message.toolCalls.map((tool, i) => (
                        <Badge
                          key={i}
                          variant="outline"
                          className={cn(
                            'text-xs',
                            tool.status === 'completed' && 'border-emerald-500/50 text-emerald-500',
                            tool.status === 'running' && 'border-primary/50 text-primary',
                            tool.status === 'failed' && 'border-destructive/50 text-destructive'
                          )}
                        >
                          {tool.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <span className="text-xs text-muted-foreground mt-1 block">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                {message.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold">U</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Input area */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-background border-t border-border">
          {/* Quick commands */}
          <div className="flex gap-2 mb-2 overflow-x-auto no-scrollbar">
            {quickCommands.map((cmd) => (
              <button
                key={cmd.command}
                onClick={() => setInput(cmd.command)}
                className="px-2 py-1 text-xs rounded bg-muted hover:bg-muted/80 text-muted-foreground whitespace-nowrap"
              >
                {cmd.label}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Atlas anything..."
                className="min-h-[44px] max-h-32 pr-10 resize-none bg-muted border-border"
                rows={1}
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1 h-8 w-8"
              >
                <Paperclip className="w-4 h-4 text-muted-foreground" />
              </Button>
            </div>
            <Button
              onClick={handleSubmit}
              disabled={!input.trim()}
              className="bg-gradient-to-r from-cyan to-purple hover:opacity-90"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
