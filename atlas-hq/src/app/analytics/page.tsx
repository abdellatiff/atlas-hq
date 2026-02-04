'use client';

import { motion } from 'framer-motion';
import {
  BarChart3,
  MessageSquare,
  Wrench,
  Coins,
  FileCode,
  TrendingUp,
  TrendingDown,
  Flame,
  Trophy,
  Zap,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

const stats = [
  { label: 'Messages', value: '127', change: '+23%', trend: 'up', icon: MessageSquare },
  { label: 'Tool Calls', value: '842', change: '+15%', trend: 'up', icon: Wrench },
  { label: 'Tokens', value: '24.6k', change: '+31%', trend: 'up', icon: Coins },
  { label: 'Files Created', value: '18', change: '+8%', trend: 'up', icon: FileCode },
];

const toolUsage = [
  { name: 'bash', count: 312, percentage: 37 },
  { name: 'edit', count: 245, percentage: 29 },
  { name: 'read', count: 198, percentage: 24 },
  { name: 'write', count: 87, percentage: 10 },
];

const channelDistribution = [
  { name: 'Terminal', percentage: 42, color: 'bg-primary' },
  { name: 'Web', percentage: 28, color: 'bg-secondary' },
  { name: 'WhatsApp', percentage: 18, color: 'bg-emerald-500' },
  { name: 'Discord', percentage: 12, color: 'bg-indigo-500' },
];

const projectActivity = [
  { name: 'Atlas HQ', percentage: 48 },
  { name: 'API Layer', percentage: 28 },
  { name: 'Landing Page', percentage: 14 },
  { name: 'Other', percentage: 10 },
];

const achievements = [
  { icon: Flame, label: '14-day streak', color: 'text-orange-500' },
  { icon: Trophy, label: '100 tasks completed', color: 'text-amber-500' },
  { icon: Zap, label: 'Power user', color: 'text-primary' },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-primary" />
            Analytics
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your productivity and collaboration with Atlas
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          This Week
        </Badge>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className="w-5 h-5 text-muted-foreground" />
                <div className={`flex items-center gap-1 text-xs ${stat.trend === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
                  {stat.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {stat.change}
                </div>
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tool Usage */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-xl p-5"
        >
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Wrench className="w-5 h-5 text-primary" />
            Tools Used
          </h3>
          <div className="space-y-4">
            {toolUsage.map((tool) => (
              <div key={tool.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{tool.name}</span>
                  <span className="text-muted-foreground">{tool.count}</span>
                </div>
                <Progress value={tool.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Channel Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-xl p-5"
        >
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-secondary" />
            Channel Distribution
          </h3>
          <div className="flex items-center justify-center mb-4">
            {/* Simple pie chart representation */}
            <div className="relative w-32 h-32">
              <svg viewBox="0 0 100 100" className="transform -rotate-90">
                {channelDistribution.reduce(
                  (acc, channel, i) => {
                    const startAngle = acc.offset;
                    const endAngle = startAngle + (channel.percentage / 100) * 360;
                    const largeArc = channel.percentage > 50 ? 1 : 0;
                    const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
                    const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
                    const x2 = 50 + 40 * Math.cos((endAngle * Math.PI) / 180);
                    const y2 = 50 + 40 * Math.sin((endAngle * Math.PI) / 180);
                    acc.paths.push(
                      <path
                        key={channel.name}
                        d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
                        className={channel.color}
                        fill="currentColor"
                        opacity={0.8}
                      />
                    );
                    acc.offset = endAngle;
                    return acc;
                  },
                  { offset: 0, paths: [] as React.ReactNode[] }
                ).paths}
              </svg>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {channelDistribution.map((channel) => (
              <div key={channel.name} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${channel.color}`} />
                <span className="text-sm">{channel.name}</span>
                <span className="text-sm text-muted-foreground ml-auto">{channel.percentage}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Project Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-xl p-5"
        >
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <FileCode className="w-5 h-5 text-emerald-500" />
            Project Activity
          </h3>
          <div className="space-y-4">
            {projectActivity.map((project) => (
              <div key={project.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{project.name}</span>
                  <span className="text-muted-foreground">{project.percentage}%</span>
                </div>
                <Progress value={project.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-xl p-5"
        >
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            Streaks & Achievements
          </h3>
          <div className="space-y-4">
            {achievements.map((achievement) => {
              const Icon = achievement.icon;
              return (
                <div
                  key={achievement.label}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                >
                  <Icon className={`w-6 h-6 ${achievement.color}`} />
                  <span className="font-medium">{achievement.label}</span>
                </div>
              );
            })}
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Goal: 30-day streak</span>
                <span className="text-muted-foreground">14/30</span>
              </div>
              <Progress value={(14 / 30) * 100} className="h-2" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
