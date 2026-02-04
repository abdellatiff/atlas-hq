'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Image as ImageIcon, ChevronRight, FileCode, FileText, Database, Settings, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface Artifact {
  id: string;
  fileName: string;
  type: 'code' | 'doc' | 'image' | 'data' | 'config' | 'other';
  language?: string;
  projectName?: string;
}

interface ArtifactCarouselProps {
  artifacts: Artifact[];
}

const typeIcons = {
  code: FileCode,
  doc: FileText,
  image: ImageIcon,
  data: Database,
  config: Settings,
  other: File,
};

const typeColors = {
  code: 'from-cyan/20 to-blue-500/20 border-cyan/30',
  doc: 'from-emerald-500/20 to-green-500/20 border-emerald-500/30',
  image: 'from-purple/20 to-pink-500/20 border-purple/30',
  data: 'from-amber-500/20 to-orange-500/20 border-amber-500/30',
  config: 'from-gray-500/20 to-slate-500/20 border-gray-500/30',
  other: 'from-gray-500/20 to-slate-500/20 border-gray-500/30',
};

const typeIconColors = {
  code: 'text-cyan',
  doc: 'text-emerald-500',
  image: 'text-purple',
  data: 'text-amber-500',
  config: 'text-gray-400',
  other: 'text-gray-400',
};

export function ArtifactCarousel({ artifacts }: ArtifactCarouselProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass rounded-xl border-glow-hover transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Recent Artifacts</h3>
        </div>
        <Link href="/gallery">
          <Button variant="ghost" size="sm" className="text-primary">
            View All
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </div>

      {/* Artifact carousel */}
      {artifacts.length === 0 ? (
        <div className="p-8 text-center">
          <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">No artifacts yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Files created by Atlas will appear here
          </p>
        </div>
      ) : (
        <ScrollArea className="w-full">
          <div className="flex gap-4 p-4">
            {artifacts.map((artifact) => {
              const Icon = typeIcons[artifact.type];
              return (
                <Link
                  key={artifact.id}
                  href={`/gallery?artifact=${artifact.id}`}
                  className="flex-shrink-0"
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`w-32 rounded-lg border bg-gradient-to-br ${typeColors[artifact.type]} p-3 transition-all hover:shadow-lg`}
                  >
                    <div className="w-full h-16 rounded bg-background/50 flex items-center justify-center mb-2">
                      <Icon className={`w-8 h-8 ${typeIconColors[artifact.type]}`} />
                    </div>
                    <p className="text-xs font-medium truncate">{artifact.fileName}</p>
                    {artifact.projectName && (
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {artifact.projectName}
                      </p>
                    )}
                    {artifact.language && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {artifact.language}
                      </p>
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      )}
    </motion.div>
  );
}
