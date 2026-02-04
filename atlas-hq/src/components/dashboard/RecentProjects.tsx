'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FolderKanban, ChevronRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

interface Project {
  id: string;
  name: string;
  status: 'active' | 'on_hold' | 'completed';
  updatedAt: Date;
}

interface RecentProjectsProps {
  projects: Project[];
}

export function RecentProjects({ projects }: RecentProjectsProps) {
  const statusColors = {
    active: 'bg-emerald-500',
    on_hold: 'bg-amber-500',
    completed: 'bg-primary',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass rounded-xl border-glow-hover transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <FolderKanban className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Recent Projects</h3>
        </div>
        <Link href="/projects">
          <Button variant="ghost" size="sm" className="text-primary">
            View All
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </div>

      {/* Project list */}
      <div className="divide-y divide-border">
        {projects.length === 0 ? (
          <div className="p-8 text-center">
            <FolderKanban className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No projects yet</p>
            <Link href="/projects/new">
              <Button variant="outline" size="sm" className="mt-3">
                Create your first project
              </Button>
            </Link>
          </div>
        ) : (
          projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-2 h-2 rounded-full ${statusColors[project.status]}`}
                />
                <span className="font-medium">{project.name}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>
                  {formatDistanceToNow(project.updatedAt, { addSuffix: true })}
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
    </motion.div>
  );
}
