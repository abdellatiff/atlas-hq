'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { MessageSquare, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

interface Conversation {
  id: string;
  channel: 'whatsapp' | 'telegram' | 'discord' | 'terminal' | 'web';
  preview: string;
  updatedAt: Date;
}

interface RecentConversationsProps {
  conversations: Conversation[];
}

const channelIcons: Record<string, string> = {
  whatsapp: '📱',
  telegram: '✈️',
  discord: '🎮',
  terminal: '💻',
  web: '🌐',
};

const channelColors: Record<string, string> = {
  whatsapp: 'bg-emerald-500/20 text-emerald-500',
  telegram: 'bg-blue-500/20 text-blue-500',
  discord: 'bg-indigo-500/20 text-indigo-500',
  terminal: 'bg-primary/20 text-primary',
  web: 'bg-orange-500/20 text-orange-500',
};

export function RecentConversations({ conversations }: RecentConversationsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass rounded-xl border-glow-hover transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-secondary" />
          <h3 className="font-semibold">Recent Conversations</h3>
        </div>
        <Link href="/comms">
          <Button variant="ghost" size="sm" className="text-secondary">
            View All
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </div>

      {/* Conversation list */}
      <div className="divide-y divide-border">
        {conversations.length === 0 ? (
          <div className="p-8 text-center">
            <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No conversations yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Start chatting with Atlas via terminal or connect a channel
            </p>
          </div>
        ) : (
          conversations.map((conversation) => (
            <Link
              key={conversation.id}
              href={`/comms/${conversation.id}`}
              className="flex items-start gap-3 p-4 hover:bg-muted/50 transition-colors"
            >
              <Badge
                variant="outline"
                className={`${channelColors[conversation.channel]} border-0 px-2`}
              >
                {channelIcons[conversation.channel]}{' '}
                {conversation.channel.charAt(0).toUpperCase() +
                  conversation.channel.slice(1)}
              </Badge>
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{conversation.preview}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDistanceToNow(conversation.updatedAt, { addSuffix: true })}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    </motion.div>
  );
}
