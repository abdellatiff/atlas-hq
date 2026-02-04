'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  FileCode,
  ListTodo,
  MessageSquare,
  Clock,
  Edit,
  MoreHorizontal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow, format } from 'date-fns';

interface Project {
  id: string;
  name: string;
  description: string | null;
  status: string;
  progress: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  tags: { tag: { id: string; name: string; color: string | null } }[];
  artifacts: {
    id: string;
    fileName: string;
    type: string;
    language: string | null;
    createdAt: string;
  }[];
  tasks: {
    id: string;
    description: string;
    status: string;
    priority: string;
    createdAt: string;
  }[];
}

const statusConfig = {
  active: { label: 'Active', color: 'bg-emerald-500', textColor: 'text-emerald-500' },
  on_hold: { label: 'On Hold', color: 'bg-amber-500', textColor: 'text-amber-500' },
  completed: { label: 'Completed', color: 'bg-primary', textColor: 'text-primary' },
  archived: { label: 'Archived', color: 'bg-gray-500', textColor: 'text-gray-500' },
};

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState('');
  const [editingNotes, setEditingNotes] = useState(false);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${id}`);
      if (response.ok) {
        const data = await response.json();
        setProject(data);
        setNotes(data.notes || '');
      }
    } catch (error) {
      console.error('Failed to fetch project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotes = async () => {
    try {
      await fetch(`/api/projects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });
      setEditingNotes(false);
      if (project) {
        setProject({ ...project, notes });
      }
    } catch (error) {
      console.error('Failed to save notes:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-semibold mb-2">Project not found</h2>
        <Link href="/projects">
          <Button variant="outline">Back to Projects</Button>
        </Link>
      </div>
    );
  }

  const status = statusConfig[project.status as keyof typeof statusConfig] || statusConfig.active;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/projects">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{project.name}</h1>
            <Badge
              variant="outline"
              className={`${status.textColor} border-current`}
            >
              {status.label}
            </Badge>
          </div>
          {project.description && (
            <p className="text-muted-foreground mt-1">{project.description}</p>
          )}
        </div>
        <Button variant="outline">
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-4"
        >
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <FileCode className="w-4 h-4" />
            <span className="text-sm">Files</span>
          </div>
          <p className="text-2xl font-bold">{project.artifacts.length}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-xl p-4"
        >
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <ListTodo className="w-4 h-4" />
            <span className="text-sm">Tasks</span>
          </div>
          <p className="text-2xl font-bold">{project.tasks.length}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-xl p-4"
        >
          <div className="text-muted-foreground text-sm mb-2">Progress</div>
          <div className="flex items-center gap-2">
            <Progress value={project.progress} className="flex-1 h-2" />
            <span className="text-lg font-bold">{project.progress}%</span>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-xl p-4"
        >
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Clock className="w-4 h-4" />
            <span className="text-sm">Updated</span>
          </div>
          <p className="text-sm font-medium">
            {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
          </p>
        </motion.div>
      </div>

      {/* Tags */}
      {project.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {project.tags.map(({ tag }) => (
            <Badge key={tag.id} variant="outline">
              {tag.name}
            </Badge>
          ))}
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-muted">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4 space-y-4">
          {/* Notes */}
          <div className="glass rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Notes</h3>
              {editingNotes ? (
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingNotes(false);
                      setNotes(project.notes || '');
                    }}
                  >
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSaveNotes}>
                    Save
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingNotes(true)}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
              )}
            </div>
            {editingNotes ? (
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes about this project..."
                className="min-h-32 bg-muted border-border"
              />
            ) : (
              <p className="text-muted-foreground">
                {project.notes || 'No notes yet. Click edit to add some.'}
              </p>
            )}
          </div>

          {/* Timeline placeholder */}
          <div className="glass rounded-xl p-5">
            <h3 className="font-semibold mb-3">Timeline</h3>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Started {format(new Date(project.createdAt), 'MMM d, yyyy')}</span>
              <span>·</span>
              <span>Last updated {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}</span>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="files" className="mt-4">
          <div className="glass rounded-xl p-5">
            {project.artifacts.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No files in this project yet
              </p>
            ) : (
              <div className="space-y-2">
                {project.artifacts.map((artifact) => (
                  <div
                    key={artifact.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileCode className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">{artifact.fileName}</p>
                        <p className="text-xs text-muted-foreground">
                          {artifact.language || artifact.type}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(artifact.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="mt-4">
          <div className="glass rounded-xl p-5">
            {project.tasks.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No tasks in this project yet
              </p>
            ) : (
              <div className="space-y-2">
                {project.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <ListTodo className="w-5 h-5 text-secondary" />
                      <div>
                        <p className="font-medium">{task.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {task.status} · {task.priority}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
