'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { Terminal } from './Terminal';
import { useUIStore } from '@/stores/ui-store';

interface MainLayoutProps {
  children: ReactNode;
  title?: string;
}

export function MainLayout({ children, title }: MainLayoutProps) {
  const { sidebarCollapsed, terminalOpen } = useUIStore();

  return (
    <div className="min-h-screen bg-background bg-grid">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <motion.div
        initial={false}
        animate={{
          marginLeft: sidebarCollapsed ? 72 : 240,
        }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="min-h-screen flex flex-col"
        style={{
          ['--sidebar-width' as string]: sidebarCollapsed ? '72px' : '240px',
        }}
      >
        {/* Top bar */}
        <TopBar title={title} />

        {/* Page content */}
        <main
          className="flex-1 p-4 md:p-6"
          style={{
            paddingBottom: terminalOpen ? '320px' : '24px',
          }}
        >
          {children}
        </main>
      </motion.div>

      {/* Terminal */}
      <Terminal />
    </div>
  );
}
