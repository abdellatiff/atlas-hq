'use client';

import { useState, useEffect } from 'react';
import {
  StatusBanner,
  QuickStats,
  RecentProjects,
  RecentConversations,
  ArtifactCarousel,
} from '@/components/dashboard';
import { Skeleton } from '@/components/ui/skeleton';

interface Project {
  id: string;
  name: string;
  status: 'active' | 'on_hold' | 'completed';
  updatedAt: string;
}

interface Artifact {
  id: string;
  fileName: string;
  type: 'code' | 'doc' | 'image' | 'data' | 'config' | 'other';
  language?: string;
  project?: { name: string } | null;
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [tasks, setTasks] = useState<{ active: unknown; completed: number }>({ active: null, completed: 0 });
  const [stats, setStats] = useState({ messages: 0, toolCalls: 0, tokens: 0 });

  useEffect(() => {
    async function fetchData() {
      try {
        const [projectsRes, artifactsRes, tasksRes] = await Promise.all([
          fetch('/api/projects'),
          fetch('/api/artifacts'),
          fetch('/api/tasks'),
        ]);

        if (projectsRes.ok) {
          const projectsData = await projectsRes.json();
          setProjects(projectsData.slice(0, 4));
        }

        if (artifactsRes.ok) {
          const artifactsData = await artifactsRes.json();
          setArtifacts(artifactsData.slice(0, 8).map((a: Artifact & { project?: { name: string } | null }) => ({
            ...a,
            projectName: a.project?.name,
          })));
        }

        if (tasksRes.ok) {
          const tasksData = await tasksRes.json();
          const activeTask = tasksData.find((t: { status: string }) => t.status === 'active');
          const completedCount = tasksData.filter((t: { status: string }) => t.status === 'completed').length;
          setTasks({ active: activeTask, completed: completedCount });
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Calculate streak (days with activity - placeholder logic)
  const streak = 1; // Would need analytics data to calculate properly

  const recentProjects = projects.map((p) => ({
    id: p.id,
    name: p.name,
    status: p.status,
    updatedAt: new Date(p.updatedAt),
  }));

  const recentArtifacts = artifacts.map((a) => ({
    id: a.id,
    fileName: a.fileName,
    type: a.type,
    language: a.language,
    projectName: a.project?.name,
  }));

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
        <Skeleton className="h-40 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status Banner */}
      <StatusBanner
        atlasStatus="online"
        lastActivity={
          tasks.active
            ? { type: 'task', description: 'Working on a task...' }
            : projects.length > 0
            ? { type: 'project', description: `Last worked on ${projects[0]?.name}` }
            : undefined
        }
      />

      {/* Quick Stats */}
      <QuickStats
        activeTask={
          tasks.active
            ? {
                name: (tasks.active as { description: string }).description,
                progress: 50,
                taskId: (tasks.active as { id: string }).id,
              }
            : undefined
        }
        todayStats={stats}
        streak={streak}
      />

      {/* Two column layout for projects and conversations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentProjects projects={recentProjects} />
        <RecentConversations conversations={[]} />
      </div>

      {/* Artifact Carousel */}
      <ArtifactCarousel artifacts={recentArtifacts} />
    </div>
  );
}
