'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  Link,
  Palette,
  Bell,
  FolderKanban,
  Shield,
  Plug,
  Download,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const settingsSections = [
  { id: 'connection', label: 'Connection', icon: Link },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'privacy', label: 'Privacy', icon: Shield },
  { id: 'integrations', label: 'Integrations', icon: Plug },
  { id: 'export', label: 'Export/Import', icon: Download },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('connection');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="w-7 h-7 text-muted-foreground" />
          Settings
        </h1>
        <p className="text-muted-foreground mt-1">
          Configure Atlas HQ to your preferences
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <nav className="md:w-56 flex-shrink-0">
          <div className="glass rounded-xl p-2">
            {settingsSections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                    activeSection === section.id
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{section.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Content */}
        <div className="flex-1">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-xl p-6"
          >
            {activeSection === 'connection' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Connection</h3>
                  <p className="text-sm text-muted-foreground">
                    Configure your connection to Atlas
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-emerald-500 pulse-dot" />
                      <div>
                        <p className="font-medium">Status</p>
                        <p className="text-sm text-muted-foreground">Connected</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Reconnect
                    </Button>
                  </div>

                  <div className="grid gap-2">
                    <Label>Gateway URL</Label>
                    <Input
                      defaultValue="ws://localhost:18789"
                      className="bg-muted border-border"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label>Default Model</Label>
                    <Select defaultValue="claude-opus-4-5">
                      <SelectTrigger className="bg-muted border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="claude-opus-4-5">claude-opus-4-5</SelectItem>
                        <SelectItem value="claude-sonnet-4">claude-sonnet-4</SelectItem>
                        <SelectItem value="gpt-4o">gpt-4o</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label>Default Thinking Level</Label>
                    <div className="flex gap-4">
                      {['Off', 'Low', 'High'].map((level) => (
                        <label key={level} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="thinking"
                            value={level.toLowerCase()}
                            defaultChecked={level === 'High'}
                            className="accent-primary"
                          />
                          <span className="text-sm">{level}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <Button className="bg-gradient-to-r from-cyan to-purple hover:opacity-90">
                  Save Changes
                </Button>
              </div>
            )}

            {activeSection === 'appearance' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Appearance</h3>
                  <p className="text-sm text-muted-foreground">
                    Customize the look and feel
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label>Theme</Label>
                    <Select defaultValue="dark-cyber">
                      <SelectTrigger className="bg-muted border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dark-cyber">Dark Cyber</SelectItem>
                        <SelectItem value="midnight">Midnight</SelectItem>
                        <SelectItem value="light">Light</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label>Accent Color</Label>
                    <div className="flex gap-3">
                      {[
                        { color: 'bg-cyan', name: 'Cyan' },
                        { color: 'bg-purple', name: 'Purple' },
                        { color: 'bg-emerald-500', name: 'Green' },
                        { color: 'bg-orange-500', name: 'Orange' },
                      ].map((accent) => (
                        <button
                          key={accent.name}
                          className={`w-8 h-8 rounded-full ${accent.color} ring-2 ring-offset-2 ring-offset-background ${
                            accent.name === 'Cyan' ? 'ring-primary' : 'ring-transparent'
                          }`}
                          title={accent.name}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Animations</Label>
                      <p className="text-sm text-muted-foreground">Enable motion effects</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Notifications</h3>
                  <p className="text-sm text-muted-foreground">
                    Manage your notification preferences
                  </p>
                </div>

                <div className="space-y-4">
                  {[
                    { label: 'Desktop Notifications', desc: 'Show system notifications', defaultChecked: true },
                    { label: 'Task Completed', desc: 'Notify when tasks finish', defaultChecked: true },
                    { label: 'Task Failed', desc: 'Notify when tasks fail', defaultChecked: true },
                    { label: 'New Message', desc: 'Notify for new messages when in background', defaultChecked: true },
                    { label: 'Sound Effects', desc: 'Play sounds for notifications', defaultChecked: false },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between">
                      <div>
                        <Label>{item.label}</Label>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                      <Switch defaultChecked={item.defaultChecked} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'privacy' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Privacy</h3>
                  <p className="text-sm text-muted-foreground">
                    Control your data and privacy settings
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Store Conversation History</Label>
                      <p className="text-sm text-muted-foreground">Keep a local copy of conversations</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="grid gap-2">
                    <Label>Retention Period</Label>
                    <Select defaultValue="forever">
                      <SelectTrigger className="bg-muted border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="365">1 year</SelectItem>
                        <SelectItem value="forever">Forever</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button variant="destructive" className="mt-4">
                    Clear All Local Data
                  </Button>
                </div>
              </div>
            )}

            {activeSection === 'integrations' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Integrations</h3>
                  <p className="text-sm text-muted-foreground">
                    Connect to external services
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    { name: 'GitHub', connected: true },
                    { name: 'Notion', connected: false },
                    { name: 'Linear', connected: false },
                  ].map((integration) => (
                    <div
                      key={integration.name}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${integration.connected ? 'bg-emerald-500' : 'bg-gray-500'}`} />
                        <span className="font-medium">{integration.name}</span>
                      </div>
                      <Button variant="outline" size="sm">
                        {integration.connected ? 'Disconnect' : 'Connect'}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'export' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Export / Import</h3>
                  <p className="text-sm text-muted-foreground">
                    Backup and restore your data
                  </p>
                </div>

                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Export All Data (JSON)
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Export Projects (ZIP)
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2 rotate-180" />
                    Import Data
                  </Button>
                </div>
              </div>
            )}

            {activeSection === 'projects' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Projects</h3>
                  <p className="text-sm text-muted-foreground">
                    Configure project settings
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label>Default Project</Label>
                    <Select defaultValue="none">
                      <SelectTrigger className="bg-muted border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="atlas-hq">Atlas HQ</SelectItem>
                        <SelectItem value="api-layer">API Layer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Auto-link Conversations</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically link conversations to active project
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="grid gap-2">
                    <Label>Archive After (days)</Label>
                    <Input
                      type="number"
                      defaultValue="30"
                      className="bg-muted border-border w-32"
                    />
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
