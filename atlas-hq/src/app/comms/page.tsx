'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Search, Filter, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatDistanceToNow } from 'date-fns';

interface Conversation {
  id: string;
  channel: string;
  preview: string;
  toolCalls: number;
  filesCreated: number;
  updatedAt: string;
}

const channelConfig: Record<string, { icon: string; color: string }> = {
  whatsapp: { icon: '📱', color: 'bg-emerald-500/20 text-emerald-500' },
  telegram: { icon: '✈️', color: 'bg-blue-500/20 text-blue-500' },
  discord: { icon: '🎮', color: 'bg-indigo-500/20 text-indigo-500' },
  terminal: { icon: '💻', color: 'bg-primary/20 text-primary' },
  web: { icon: '🌐', color: 'bg-orange-500/20 text-orange-500' },
};

export default function CommsPage() {
  const [search, setSearch] = useState('');
  const [channelFilter, setChannelFilter] = useState('all');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchConversations() {
      try {
        // Note: Conversations API not yet implemented
        // Will show empty state until API is available
        const res = await fetch('/api/conversations');
        if (res.ok) {
          const data = await res.json();
          setConversations(data);
        }
      } catch (error) {
        // API not available yet, show empty state
        console.log('Conversations API not available yet');
      } finally {
        setLoading(false);
      }
    }
    fetchConversations();
  }, []);

  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch = conv.preview.toLowerCase().includes(search.toLowerCase());
    const matchesChannel = channelFilter === 'all' || conv.channel === channelFilter;
    return matchesSearch && matchesChannel;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="flex gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-48" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <MessageSquare className="w-7 h-7 text-secondary" />
          Communications
        </h1>
        <p className="text-muted-foreground mt-1">
          Browse your conversation history with Atlas
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conversations..."
            className="pl-10 bg-muted border-border"
          />
        </div>
        <Select value={channelFilter} onValueChange={setChannelFilter}>
          <SelectTrigger className="w-full sm:w-48 bg-muted border-border">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Channel" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Channels</SelectItem>
            <SelectItem value="whatsapp">WhatsApp</SelectItem>
            <SelectItem value="telegram">Telegram</SelectItem>
            <SelectItem value="discord">Discord</SelectItem>
            <SelectItem value="terminal">Terminal</SelectItem>
            <SelectItem value="web">Web</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Conversations */}
      <div className="space-y-3">
        {filteredConversations.map((conv, index) => {
          const channel = channelConfig[conv.channel];
          return (
            <motion.div
              key={conv.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass rounded-xl p-4 border-glow-hover transition-all duration-300 cursor-pointer hover:bg-muted/50"
            >
              <div className="flex items-start gap-4">
                <Badge
                  variant="outline"
                  className={`${channel.color} border-0 px-2 py-1`}
                >
                  {channel.icon} {conv.channel}
                </Badge>
                <div className="flex-1 min-w-0">
                  <p className="text-sm line-clamp-2">{conv.preview}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span>🛠️ {conv.toolCalls} tool calls</span>
                    {conv.filesCreated > 0 && (
                      <span>📄 {conv.filesCreated} files</span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(new Date(conv.updatedAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredConversations.length === 0 && (
        <div className="text-center py-16">
          <MessageSquare className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No conversations found</h3>
          <p className="text-muted-foreground">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
}
