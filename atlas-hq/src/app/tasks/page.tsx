'use client';

import { useState, useEffect } from 'react';
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
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';

interface Task {
  id: string;
  description: string;
  status: 'queued' | 'active' | 'completed' | 'failed' | 'cancelled';
  priority: 'urgent' | 'high' | 'normal' | 'low';
  source?: string;
  progress?: number;
  output?: string;
  error?: string;
  duration?: number;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
}

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
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const res = await fetch('/api/tasks');
        if (res.ok) {
          const data = await res.json();
          setTasks(data);
        }
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchTasks();
  }, []);

  const activeTask = tasks.find((t) => t.status === 'active');
  const queuedTasks = tasks.filter((t) => t.status === 'queued');
  const completedTasks = tasks.filter((t) => t.status === 'completed' || t.status === 'failed');

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-48 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

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
      {activeTask && (
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
                <p className="font-medium">{activeTask.description}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {sourceIcons[activeTask.source || 'web']} Started{' '}
                  {activeTask.startedAt && formatDistanceToNow(new Date(activeTask.startedAt), { addSuffix: true })}
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
                <span>{activeTask.progress || 0}%</span>
              </div>
              <Progress value={activeTask.progress || 0} className="h-2" />
            </div>
            {activeTask.output && (
              <div className="bg-background/50 rounded-lg p-3 font-mono text-xs">
                {activeTask.output.split('\n').map((line, i) => (
                  <div key={i} className="text-muted-foreground">
                    {line}
                  </div>
                ))}
                <div className="text-primary typing-cursor">█</div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Queued */}
      <div className="glass rounded-xl">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="font-semibold">Queued ({queuedTasks.length})</h3>
          <span className="text-sm text-muted-foreground">Drag to reorder</span>
        </div>
        <div className="divide-y divide-border">
          {queuedTasks.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No queued tasks</p>
            </div>
          ) : (
            queuedTasks.map((task, index) => (
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
                    {sourceIcons[task.source || 'web']} Queued{' '}
                    {formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}
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
            ))
          )}
        </div>
      </div>

      {/* Completed */}
      <div className="glass rounded-xl">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold">Recently Completed</h3>
        </div>
        <div className="divide-y divide-border">
          {completedTasks.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No completed tasks yet</p>
            </div>
          ) : (
            completedTasks.map((task, index) => (
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
                {task.duration && (
                  <span className="text-sm text-muted-foreground">
                    {formatDuration(task.duration)}
                  </span>
                )}
                {task.completedAt && (
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(task.completedAt), { addSuffix: true })}
                  </span>
                )}
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
