'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ListTodo,
  Plus,
  Play,
  Pause,
  X,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { formatDistanceToNow } from 'date-fns';

const demoTasks = {
  active: {
    id: '1',
    description: 'Refactoring auth module with repository pattern',
    progress: 60,
    source: 'terminal',
    startedAt: new Date(Date.now() - 2 * 60 * 1000),
    output: [
      '> Reading src/lib/auth.ts',
      '> Found 3 authentication functions',
      '> Creating repository interface...',
    ],
  },
  queued: [
    { id: '2', description: 'Write unit tests for auth repository', source: 'whatsapp', priority: 'high', createdAt: new Date(Date.now() - 1 * 60 * 1000) },
    { id: '3', description: 'Update API documentation', source: 'discord', priority: 'normal', createdAt: new Date(Date.now() - 10 * 60 * 1000) },
    { id: '4', description: 'Review PR #42 comments', source: 'telegram', priority: 'low', createdAt: new Date(Date.now() - 25 * 60 * 1000) },
  ],
  completed: [
    { id: '5', description: 'Set up Prisma schema', status: 'completed', duration: 204, completedAt: new Date(Date.now() - 15 * 60 * 1000) },
    { id: '6', description: 'Create Dashboard component', status: 'completed', duration: 492, completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000) },
    { id: '7', description: 'Deploy to staging', status: 'failed', duration: 105, completedAt: new Date(Date.now() - 3 * 60 * 60 * 1000), error: 'Build failed: Missing environment variable' },
    { id: '8', description: 'Fix TypeScript errors', status: 'completed', duration: 128, completedAt: new Date(Date.now() - 4 * 60 * 60 * 1000) },
  ],
};

const priorityConfig = {
  urgent: { color: 'bg-red-500/20 text-red-500 border-red-500/30' },
  high: { color: 'bg-orange-500/20 text-orange-500 border-orange-500/30' },
  normal: { color: 'bg-blue-500/20 text-blue-500 border-blue-500/30' },
  low: { color: 'bg-gray-500/20 text-gray-500 border-gray-500/30' },
};

const sourceIcons: Record<string, string> = {
  terminal: '💻',
  whatsapp: '📱',
  discord: '🎮',
  telegram: '✈️',
  web: '🌐',
};

function formatDuration(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}

export default function TasksPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ListTodo className="w-7 h-7 text-secondary" />
            Task Queue
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage and monitor tasks for Atlas
          </p>
        </div>
        <Button className="bg-gradient-to-r from-cyan to-purple hover:opacity-90">
          <Plus className="w-4 h-4 mr-2" />
          New Task
        </Button>
      </div>

      {/* Active Task */}
      {demoTasks.active && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-5 border-primary/30"
        >
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Currently Active</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium">{demoTasks.active.description}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {sourceIcons[demoTasks.active.source]} Started{' '}
                  {formatDistanceToNow(demoTasks.active.startedAt, { addSuffix: true })}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Pause className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" className="text-destructive">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Progress</span>
                <span>{demoTasks.active.progress}%</span>
              </div>
              <Progress value={demoTasks.active.progress} className="h-2" />
            </div>
            <div className="bg-background/50 rounded-lg p-3 font-mono text-xs">
              {demoTasks.active.output.map((line, i) => (
                <div key={i} className="text-muted-foreground">
                  {line}
                </div>
              ))}
              <div className="text-primary typing-cursor">█</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Queued */}
      <div className="glass rounded-xl">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="font-semibold">Queued ({demoTasks.queued.length})</h3>
          <span className="text-sm text-muted-foreground">Drag to reorder</span>
        </div>
        <div className="divide-y divide-border">
          {demoTasks.queued.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 flex items-center gap-4 hover:bg-muted/30 transition-colors"
            >
              <span className="text-muted-foreground font-mono text-sm w-6">
                {index + 1}
              </span>
              <Clock className="w-4 h-4 text-muted-foreground" />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{task.description}</p>
                <p className="text-xs text-muted-foreground">
                  {sourceIcons[task.source]} Queued{' '}
                  {formatDistanceToNow(task.createdAt, { addSuffix: true })}
                </p>
              </div>
              <Badge
                variant="outline"
                className={priorityConfig[task.priority as keyof typeof priorityConfig].color}
              >
                {task.priority}
              </Badge>
              <Button variant="ghost" size="sm">
                <Play className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-destructive">
                <X className="w-4 h-4" />
              </Button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Completed */}
      <div className="glass rounded-xl">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold">Recently Completed</h3>
        </div>
        <div className="divide-y divide-border">
          {demoTasks.completed.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 flex items-center gap-4"
            >
              {task.status === 'completed' ? (
                <CheckCircle className="w-5 h-5 text-emerald-500" />
              ) : (
                <XCircle className="w-5 h-5 text-destructive" />
              )}
              <div className="flex-1 min-w-0">
                <p className={`font-medium truncate ${task.status === 'failed' ? 'text-muted-foreground' : ''}`}>
                  {task.description}
                </p>
                {task.error && (
                  <p className="text-xs text-destructive">{task.error}</p>
                )}
              </div>
              <span className="text-sm text-muted-foreground">
                {formatDuration(task.duration)}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(task.completedAt, { addSuffix: true })}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
