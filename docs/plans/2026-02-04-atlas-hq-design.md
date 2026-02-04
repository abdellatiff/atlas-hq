# Atlas HQ - Design Document

**Date:** February 4, 2026
**Status:** Approved
**Author:** Collaborative design between User and Claude

---

## Overview

Atlas HQ is a unified dashboard for collaborating with Atlas (an OpenClaw AI assistant hosted on Hostinger). It serves as a command center combining conversation history, project management, artifact gallery, task queue, and analytics.

---

## Core Decisions

| Aspect | Decision |
|--------|----------|
| **Name** | Atlas HQ |
| **Purpose** | Unified workspace: history + command center + portfolio |
| **Tech Stack** | Next.js 15, TypeScript, Tailwind CSS, shadcn/ui, Prisma/SQLite, Framer Motion |
| **Hosting** | Same Hostinger server as Atlas (localhost WebSocket connection) |
| **Style** | Dark & Futuristic (cyber/sci-fi command center) |
| **Design Priority** | Desktop-first, mobile-friendly |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         ATLAS HQ                                │
│                    (Next.js 15 App)                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────────┐     ┌─────────────┐     ┌─────────────┐      │
│   │   Frontend  │────▶│  API Routes │────▶│   Prisma    │      │
│   │   (React)   │     │  (Next.js)  │     │  (SQLite)   │      │
│   └─────────────┘     └─────────────┘     └─────────────┘      │
│          │                   │                                  │
│          │                   │                                  │
│          ▼                   ▼                                  │
│   ┌─────────────────────────────────────────┐                  │
│   │     WebSocket Connection (Real-time)    │                  │
│   │        ws://localhost:18789             │                  │
│   └─────────────────────────────────────────┘                  │
│                         │                                       │
│                         ▼                                       │
│   ┌─────────────────────────────────────────┐                  │
│   │         ATLAS (OpenClaw Gateway)        │                  │
│   │    Sessions | Tools | Channels | Cron   │                  │
│   └─────────────────────────────────────────┘                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Data Flow:**
- Atlas HQ connects to Atlas's Gateway via WebSocket on localhost:18789
- Real-time events (messages, tool calls, status) stream to the dashboard
- Prisma + SQLite stores additional metadata: projects, tags, notes, custom organization
- API routes handle CRUD for projects and bridge to Atlas's RPC methods

---

## Visual Theme

| Element | Value |
|---------|-------|
| Background | Deep space black (#0a0a0f) with subtle grid pattern |
| Primary Accent | Cyan (#00f0ff) |
| Secondary Accent | Electric purple (#a855f7) |
| Cards | Glass-morphism with blur, glowing borders on hover |
| Typography | Monospace for code/data, clean sans-serif for UI |
| Animations | Subtle pulses, smooth transitions, typing effects |

---

## Features

### 1. Dashboard (Home)

The landing page - command center at a glance.

**Components:**
- Status Banner - Atlas connection status, contextual greeting, smart suggestion
- Quick Stats - Active task, today's metrics, engagement streak
- Recent Projects - Quick access to ongoing work
- Recent Conversations - Latest exchanges across all channels
- Artifact Carousel - Visual preview of recently created files

### 2. Conversation Timeline (Comms)

Searchable archive of all communication with Atlas across every channel.

**Features:**
- Full-text search across all messages, code snippets, file names
- Channel filter (WhatsApp, Telegram, Discord, Terminal, Web UI)
- Date range (quick presets + custom date picker)
- Content filters (has code, has images, has files, has tool calls)
- Project association (link conversations to projects)
- Conversation cards with metadata (tool calls, files, tags)
- Quick actions (open full thread, archive, add to project, tag)

### 3. Project Tracker

Organize work into discrete projects with full context.

**Features:**
- Status tracking (Active, On Hold, Completed, Archived)
- Progress bar (manual or auto-calculated from tasks)
- Linked conversations (auto-associated or manually linked)
- File registry (all files created/modified within project)
- Task checklist (subtasks within the project)
- Notes section (decisions, context)
- Tags (categorize by tech, type, priority)
- Timeline (visual milestone tracker)
- Stats (aggregated metrics for the project)

### 4. Artifact Gallery

Visual showcase of everything Atlas has created.

**Features:**
- Type filtering (Code, Docs, Images, Data, Config, Other)
- Smart thumbnails (syntax-highlighted preview for code, actual preview for images)
- Grid/List toggle
- Project grouping
- Version history (diff view)
- Quick actions (copy, download, open source conversation)
- Search (full-text across file names and contents)

### 5. Task Queue

See what Atlas is working on, queue new tasks, manage workflow.

**Features:**
- Live progress (real-time streaming output from active task)
- Queue management (reorder, pause, cancel)
- Priority levels (Urgent, High, Normal, Low)
- Source tracking (which channel the task came from)
- Project association
- Scheduled tasks (one-time or recurring via cron)
- History (completed tasks with duration and status)
- Retry failed tasks
- Push notifications when task completes

### 6. Analytics & Metrics

Track productivity, usage patterns, and collaboration stats.

**Features:**
- Overview cards (key metrics with week-over-week comparison)
- Activity timeline (daily/weekly/monthly graph)
- Tool breakdown (which tools Atlas uses most)
- Channel distribution (where conversations happen)
- Project activity (time/effort distribution)
- Peak hours (when you're most active)
- Task metrics (average completion time, success rate)
- AI insights (smart observations about patterns)
- Gamification (streaks, achievements, goals)
- Export (CSV/PDF reports)

### 7. Live Terminal

Always-accessible command line to communicate with Atlas.

**Features:**
- Persistent access (collapsible panel at bottom)
- Full-screen mode (with context panel)
- Project context (set which project Atlas works within)
- Tool call display (inline expandable with syntax highlighting)
- Quick commands (/think, /verbose, /clear)
- File attachments (drag & drop)
- Session info (model, thinking level, token usage)
- Streaming output (real-time with typing animation)
- History navigation (arrow up/down)

### 8. Settings

**Sections:**
- Connection (Gateway URL, default model, thinking level)
- Appearance (theme, accent colors, fonts, animations)
- Notifications (desktop alerts, sounds, daily digest)
- Projects (defaults, auto-linking, archival rules)
- Privacy (data retention, local storage)
- Integrations (GitHub, Notion, Linear, webhooks)
- Export/Import (backup & restore)

---

## Self-Integration API

Atlas can interact with his own dashboard via REST API.

**Endpoints:**
- `/api/projects` - CRUD projects
- `/api/artifacts` - Register created files
- `/api/tasks` - Manage task queue
- `/api/notes` - Add notes to projects
- `/api/tags` - Organize with tags
- `/api/analytics` - Log custom events
- `/api/notifications` - Push alerts to dashboard
- `/api/widgets` - Create custom dashboard widgets
- `/api/commands` - Register custom terminal commands

**Example Usage:**
```typescript
// Atlas creates a project when starting new work
await fetch('/api/projects', {
  method: 'POST',
  body: JSON.stringify({
    name: 'New Authentication System',
    description: 'Implementing OAuth2 with refresh tokens',
    tags: ['auth', 'security', 'backend']
  })
});

// Atlas registers an artifact he created
await fetch('/api/artifacts', {
  method: 'POST',
  body: JSON.stringify({
    projectId: 'proj_123',
    filePath: 'src/lib/auth.ts',
    type: 'code',
    language: 'typescript',
    conversationId: 'conv_456'
  })
});

// Atlas pushes a notification
await fetch('/api/notifications', {
  method: 'POST',
  body: JSON.stringify({
    title: 'Task Complete',
    message: 'Auth module refactored successfully',
    type: 'success'
  })
});
```

---

## Database Schema

```prisma
model Project {
  id          String     @id @default(cuid())
  name        String
  description String?
  status      String     @default("active")
  progress    Int        @default(0)
  notes       String?
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  artifacts   Artifact[]
  tasks       Task[]
  tags        Tag[]
}

model Artifact {
  id             String   @id @default(cuid())
  projectId      String?
  project        Project? @relation(fields: [projectId], references: [id])
  filePath       String
  fileName       String
  type           String
  language       String?
  size           Int?
  conversationId String?
  createdAt      DateTime @default(now())
}

model Task {
  id          String   @id @default(cuid())
  projectId   String?
  project     Project? @relation(fields: [projectId], references: [id])
  description String
  status      String   @default("queued")
  priority    String   @default("normal")
  source      String?
  scheduledAt DateTime?
  completedAt DateTime?
  duration    Int?
  createdAt   DateTime @default(now())
}

model Tag {
  id       String    @id @default(cuid())
  name     String    @unique
  projects Project[]
}

model Widget {
  id       String @id @default(cuid())
  name     String
  type     String
  position String
  config   Json
}

model Notification {
  id        String   @id @default(cuid())
  title     String
  message   String
  type      String
  read      Boolean  @default(false)
  action    Json?
  createdAt DateTime @default(now())
}
```

---

## File Structure

```
atlas-hq/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                 # Dashboard
│   │   ├── comms/page.tsx           # Conversation Timeline
│   │   ├── projects/
│   │   │   ├── page.tsx             # Project List
│   │   │   └── [id]/page.tsx        # Project Detail
│   │   ├── gallery/page.tsx         # Artifact Gallery
│   │   ├── tasks/page.tsx           # Task Queue
│   │   ├── analytics/page.tsx       # Analytics
│   │   ├── settings/page.tsx        # Settings
│   │   └── api/
│   │       ├── projects/route.ts
│   │       ├── artifacts/route.ts
│   │       ├── tasks/route.ts
│   │       ├── notifications/route.ts
│   │       ├── widgets/route.ts
│   │       ├── analytics/route.ts
│   │       └── atlas/
│   │           ├── sessions/route.ts
│   │           └── send/route.ts
│   ├── components/
│   │   ├── ui/                      # shadcn components
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── TopBar.tsx
│   │   │   └── Terminal.tsx
│   │   ├── dashboard/
│   │   ├── comms/
│   │   ├── projects/
│   │   ├── gallery/
│   │   ├── tasks/
│   │   └── analytics/
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── atlas-client.ts          # WebSocket connection to Atlas
│   │   └── utils.ts
│   └── styles/
│       └── globals.css
├── prisma/
│   └── schema.prisma
├── public/
├── package.json
├── tailwind.config.ts
└── next.config.ts
```

---

## Responsive Design

**Priority:** Desktop-first, mobile-friendly

**Desktop (1024px+):** Full experience, sidebar visible, terminal docked at bottom
**Tablet (768px):** Condensed sidebar, still full-featured
**Mobile (<640px):** Bottom navigation bar, hamburger menu for sidebar, terminal as overlay

**Mobile-Friendly Features:**
- Responsive breakpoints that reorganize (not just shrink)
- Touch-friendly tap targets (min 44px)
- Bottom sheet modals
- PWA installable
- Quick actions for common tasks

---

## Implementation Phases

### Phase 1: Foundation
- Next.js 15 project setup
- Tailwind + shadcn/ui configuration
- Prisma + SQLite setup
- Basic layout (sidebar, topbar, terminal shell)
- Dark theme with accent colors

### Phase 2: Core Features
- Dashboard page
- Projects CRUD
- Artifacts gallery
- Task queue

### Phase 3: Atlas Integration
- WebSocket client for Atlas Gateway
- Conversation timeline (pulling from Atlas sessions)
- Live terminal implementation
- Real-time event streaming

### Phase 4: Analytics & Polish
- Analytics dashboard
- Settings page
- Notifications system
- Animations and polish

### Phase 5: Self-Integration
- API endpoints for Atlas
- Skill file for Atlas
- Widget system
- Custom commands

---

## Success Criteria

1. Dashboard loads and displays Atlas connection status
2. Can browse all conversations with Atlas across channels
3. Can organize work into projects with progress tracking
4. Can view all artifacts Atlas has created
5. Can queue and monitor tasks
6. Can see usage analytics and insights
7. Can send commands to Atlas via terminal
8. Atlas can create projects/artifacts via API
9. Responsive on desktop and mobile
10. Dark futuristic theme with smooth animations
