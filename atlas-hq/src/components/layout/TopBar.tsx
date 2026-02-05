'use client';

import { Bell, Terminal, Zap, Menu, Bot } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useUIStore } from '@/stores/ui-store';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface TopBarProps {
  title?: string;
}

export function TopBar({ title }: TopBarProps) {
  const { toggleTerminal, terminalOpen, toggleSidebar, sidebarCollapsed } = useUIStore();

  return (
    <header className="h-16 border-b border-border bg-background/50 backdrop-blur-sm sticky top-0 z-30">
      <div className="h-full flex items-center justify-between px-4 md:px-6">
        {/* Left section */}
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleSidebar}
          >
            <Menu className="w-5 h-5" />
          </Button>

          {/* Page title */}
          {title && (
            <h1 className="text-lg font-semibold text-foreground">{title}</h1>
          )}
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2">
          {/* Connection status & Model */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border">
              <div className="relative">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-500 animate-ping opacity-75" />
              </div>
              <span className="text-xs font-medium text-muted-foreground">
                Atlas Online
              </span>
            </div>
            
            {/* Model badge */}
            <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-gradient-to-r from-cyan/20 to-purple/20 border border-cyan/30">
              <Bot className="w-3 h-3 text-cyan-600" />
              <span className="text-xs font-medium text-cyan-600">
                Claude Opus 4.5
              </span>
            </div>
          </div>

          {/* Terminal toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTerminal}
            className={cn(
              'relative',
              terminalOpen && 'text-primary'
            )}
          >
            <Terminal className="w-5 h-5" />
            {terminalOpen && (
              <motion.div
                layoutId="terminalIndicator"
                className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
              />
            )}
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                {/* Notification badge */}
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 bg-popover border-border">
              <div className="px-4 py-3 border-b border-border">
                <h3 className="font-semibold">Notifications</h3>
              </div>
              <div className="py-2">
                <DropdownMenuItem className="px-4 py-3 cursor-pointer">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <Zap className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">Task Completed</p>
                      <p className="text-xs text-muted-foreground truncate">
                        Auth module refactored successfully
                      </p>
                    </div>
                  </div>
                </DropdownMenuItem>
              </div>
              <div className="px-4 py-2 border-t border-border">
                <Button variant="ghost" size="sm" className="w-full text-primary">
                  View all notifications
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User avatar */}
          <Button variant="ghost" size="icon" className="rounded-full">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan to-purple flex items-center justify-center">
              <span className="text-xs font-bold text-background">U</span>
            </div>
          </Button>
        </div>
      </div>
    </header>
  );
}
