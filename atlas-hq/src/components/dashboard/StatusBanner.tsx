'use client';

import { motion } from 'framer-motion';
import { Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface StatusBannerProps {
  atlasStatus: 'online' | 'offline' | 'busy';
  lastActivity?: {
    type: string;
    description: string;
  };
}

export function StatusBanner({ atlasStatus, lastActivity }: StatusBannerProps) {
  const statusColors = {
    online: 'from-emerald-500/20 to-cyan/20 border-emerald-500/30',
    offline: 'from-gray-500/20 to-gray-600/20 border-gray-500/30',
    busy: 'from-amber-500/20 to-orange-500/20 border-amber-500/30',
  };

  const statusText = {
    online: 'Atlas is online',
    offline: 'Atlas is offline',
    busy: 'Atlas is working',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass rounded-xl p-6 border bg-gradient-to-r ${statusColors[atlasStatus]}`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          {/* Status indicator */}
          <div className="relative">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                atlasStatus === 'online'
                  ? 'bg-emerald-500/20'
                  : atlasStatus === 'busy'
                  ? 'bg-amber-500/20'
                  : 'bg-gray-500/20'
              }`}
            >
              <Zap
                className={`w-6 h-6 ${
                  atlasStatus === 'online'
                    ? 'text-emerald-500'
                    : atlasStatus === 'busy'
                    ? 'text-amber-500'
                    : 'text-gray-500'
                }`}
              />
            </div>
            <span
              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background ${
                atlasStatus === 'online'
                  ? 'bg-emerald-500 pulse-dot'
                  : atlasStatus === 'busy'
                  ? 'bg-amber-500'
                  : 'bg-gray-500'
              }`}
            />
          </div>

          {/* Greeting and status */}
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-xl font-semibold">
                Welcome back
              </h2>
              <span className="text-sm text-muted-foreground">
                {format(new Date(), 'EEEE, MMMM d, yyyy')}
              </span>
            </div>
            <p className="text-muted-foreground">
              {statusText[atlasStatus]}.{' '}
              {lastActivity && (
                <span className="text-foreground">
                  {lastActivity.description}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          {lastActivity && (
            <Button variant="outline" className="border-border">
              Resume
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
          <Button className="bg-gradient-to-r from-cyan to-purple hover:opacity-90">
            New Task
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
