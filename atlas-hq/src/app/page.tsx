'use client';

import {
  StatusBanner,
  QuickStats,
  RecentProjects,
  RecentConversations,
  ArtifactCarousel,
} from '@/components/dashboard';

// Demo data - in production this would come from API/database
const demoData = {
  atlasStatus: 'online' as const,
  lastActivity: {
    type: 'task',
    description: 'Ready to continue work on the auth refactor?',
  },
  activeTask: {
    name: 'Auth module refactor',
    progress: 60,
    taskId: '47',
  },
  todayStats: {
    messages: 12,
    toolCalls: 24,
    tokens: 2400,
  },
  streak: 14,
  recentProjects: [
    {
      id: '1',
      name: 'Atlas HQ Dashboard',
      status: 'active' as const,
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
    {
      id: '2',
      name: 'API Integration',
      status: 'on_hold' as const,
      updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    },
    {
      id: '3',
      name: 'Landing Page',
      status: 'completed' as const,
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    },
  ],
  recentConversations: [
    {
      id: '1',
      channel: 'whatsapp' as const,
      preview: "Here's the updated authentication flow...",
      updatedAt: new Date(Date.now() - 10 * 60 * 1000), // 10 min ago
    },
    {
      id: '2',
      channel: 'terminal' as const,
      preview: 'All 47 tests passing. Coverage at 84%.',
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
    {
      id: '3',
      channel: 'discord' as const,
      preview: 'The tests are now passing after the fix.',
      updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    },
  ],
  recentArtifacts: [
    {
      id: '1',
      fileName: 'Dashboard.tsx',
      type: 'code' as const,
      language: 'TypeScript',
      projectName: 'Atlas HQ',
    },
    {
      id: '2',
      fileName: 'api_client.py',
      type: 'code' as const,
      language: 'Python',
      projectName: 'API Layer',
    },
    {
      id: '3',
      fileName: 'README.md',
      type: 'doc' as const,
      projectName: 'Atlas HQ',
    },
    {
      id: '4',
      fileName: 'diagram.png',
      type: 'image' as const,
      projectName: 'Atlas HQ',
    },
    {
      id: '5',
      fileName: 'migration_001.sql',
      type: 'data' as const,
      projectName: 'DB Migration',
    },
  ],
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Status Banner */}
      <StatusBanner
        atlasStatus={demoData.atlasStatus}
        lastActivity={demoData.lastActivity}
      />

      {/* Quick Stats */}
      <QuickStats
        activeTask={demoData.activeTask}
        todayStats={demoData.todayStats}
        streak={demoData.streak}
      />

      {/* Two column layout for projects and conversations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentProjects projects={demoData.recentProjects} />
        <RecentConversations conversations={demoData.recentConversations} />
      </div>

      {/* Artifact Carousel */}
      <ArtifactCarousel artifacts={demoData.recentArtifacts} />
    </div>
  );
}
