'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Image as ImageIcon,
  Search,
  Grid,
  List,
  FileCode,
  FileText,
  Database,
  Settings,
  File,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';

interface Artifact {
  id: string;
  fileName: string;
  type: 'code' | 'doc' | 'image' | 'data' | 'config' | 'other';
  language?: string;
  project?: { name: string } | null;
  createdAt: string;
}

const typeConfig = {
  code: { icon: FileCode, color: 'from-cyan/20 to-blue-500/20 border-cyan/30', iconColor: 'text-cyan' },
  doc: { icon: FileText, color: 'from-emerald-500/20 to-green-500/20 border-emerald-500/30', iconColor: 'text-emerald-500' },
  image: { icon: ImageIcon, color: 'from-purple/20 to-pink-500/20 border-purple/30', iconColor: 'text-purple' },
  data: { icon: Database, color: 'from-amber-500/20 to-orange-500/20 border-amber-500/30', iconColor: 'text-amber-500' },
  config: { icon: Settings, color: 'from-gray-500/20 to-slate-500/20 border-gray-500/30', iconColor: 'text-gray-400' },
  other: { icon: File, color: 'from-gray-500/20 to-slate-500/20 border-gray-500/30', iconColor: 'text-gray-400' },
};

export default function GalleryPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArtifacts() {
      try {
        const res = await fetch('/api/artifacts');
        if (res.ok) {
          const data = await res.json();
          setArtifacts(data);
        }
      } catch (error) {
        console.error('Failed to fetch artifacts:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchArtifacts();
  }, []);

  const filteredArtifacts = artifacts.filter((artifact) => {
    const matchesSearch = artifact.fileName.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || artifact.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const typeCounts = {
    all: artifacts.length,
    code: artifacts.filter((a) => a.type === 'code').length,
    doc: artifacts.filter((a) => a.type === 'doc').length,
    image: artifacts.filter((a) => a.type === 'image').length,
    data: artifacts.filter((a) => a.type === 'data').length,
    config: artifacts.filter((a) => a.type === 'config').length,
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="flex gap-4">
          <Skeleton className="h-10 flex-1 max-w-md" />
          <Skeleton className="h-10 w-20" />
        </div>
        <Skeleton className="h-10 w-full max-w-xl" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ImageIcon className="w-7 h-7 text-primary" />
          Artifact Gallery
        </h1>
        <p className="text-muted-foreground mt-1">
          Browse files and artifacts created by Atlas
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search artifacts..."
            className="pl-10 bg-muted border-border"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Type tabs */}
      <Tabs value={typeFilter} onValueChange={setTypeFilter}>
        <TabsList className="bg-muted">
          <TabsTrigger value="all">All ({typeCounts.all})</TabsTrigger>
          <TabsTrigger value="code">Code ({typeCounts.code})</TabsTrigger>
          <TabsTrigger value="doc">Docs ({typeCounts.doc})</TabsTrigger>
          <TabsTrigger value="image">Images ({typeCounts.image})</TabsTrigger>
          <TabsTrigger value="data">Data ({typeCounts.data})</TabsTrigger>
          <TabsTrigger value="config">Config ({typeCounts.config})</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Artifacts */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredArtifacts.map((artifact, index) => {
            const config = typeConfig[artifact.type as keyof typeof typeConfig] || typeConfig.other;
            const Icon = config.icon;
            return (
              <motion.div
                key={artifact.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.03 }}
                className={`rounded-xl border bg-gradient-to-br ${config.color} p-3 cursor-pointer hover:shadow-lg transition-all`}
              >
                <div className="w-full h-20 rounded bg-background/50 flex items-center justify-center mb-2">
                  <Icon className={`w-10 h-10 ${config.iconColor}`} />
                </div>
                <p className="text-sm font-medium truncate">{artifact.fileName}</p>
                <p className="text-xs text-muted-foreground truncate">{artifact.project?.name}</p>
                {artifact.language && (
                  <Badge variant="outline" className="text-xs mt-1">
                    {artifact.language}
                  </Badge>
                )}
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredArtifacts.map((artifact, index) => {
            const config = typeConfig[artifact.type as keyof typeof typeConfig] || typeConfig.other;
            const Icon = config.icon;
            return (
              <motion.div
                key={artifact.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className="glass rounded-lg p-3 flex items-center gap-4 cursor-pointer hover:bg-muted/50 transition-all"
              >
                <Icon className={`w-6 h-6 ${config.iconColor}`} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{artifact.fileName}</p>
                  <p className="text-sm text-muted-foreground">{artifact.project?.name}</p>
                </div>
                {artifact.language && (
                  <Badge variant="outline">{artifact.language}</Badge>
                )}
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(artifact.createdAt), { addSuffix: true })}
                </span>
              </motion.div>
            );
          })}
        </div>
      )}

      {filteredArtifacts.length === 0 && (
        <div className="text-center py-16">
          <ImageIcon className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No artifacts found</h3>
          <p className="text-muted-foreground">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
}
