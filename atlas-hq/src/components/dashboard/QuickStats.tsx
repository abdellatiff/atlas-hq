'use client';

import { motion } from 'framer-motion';
import { Zap, MessageSquare, Wrench, Flame } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface QuickStatsProps {
  activeTask?: {
    name: string;
    progress: number;
    taskId: string;
  };
  todayStats: {
    messages: number;
    toolCalls: number;
    tokens: number;
  };
  streak: number;
}

export function QuickStats({ activeTask, todayStats, streak }: QuickStatsProps) {
  const stats = [
    {
      label: 'Active Task',
      icon: Zap,
      content: activeTask ? (
        <div>
          <p className="text-sm font-medium truncate">{activeTask.name}</p>
          <p className="text-xs text-muted-foreground">Task #{activeTask.taskId}</p>
          <Progress value={activeTask.progress} className="mt-2 h-1.5" />
          <p className="text-xs text-muted-foreground mt-1">{activeTask.progress}%</p>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No active task</p>
      ),
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Today',
      icon: MessageSquare,
      content: (
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Messages</span>
            <span className="font-medium">{todayStats.messages}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tools used</span>
            <span className="font-medium">{todayStats.toolCalls}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tokens</span>
            <span className="font-medium">{(todayStats.tokens / 1000).toFixed(1)}k</span>
          </div>
        </div>
      ),
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
    {
      label: 'Streak',
      icon: Flame,
      content: (
        <div>
          <p className="text-3xl font-bold">{streak}</p>
          <p className="text-xs text-muted-foreground">days</p>
          <div className="flex gap-0.5 mt-2">
            {[...Array(14)].map((_, i) => (
              <div
                key={i}
                className={`w-2 h-4 rounded-sm ${
                  i < streak % 14 ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>
      ),
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="glass rounded-xl p-4 border-glow-hover transition-all duration-300"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              {stat.label}
            </span>
          </div>
          {stat.content}
        </motion.div>
      ))}
    </div>
  );
}
