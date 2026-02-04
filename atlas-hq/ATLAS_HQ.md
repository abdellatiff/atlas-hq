# Atlas HQ Integration

You have access to **Atlas HQ**, your personal dashboard hosted alongside you. Use this dashboard to track your work with your human collaborator, organize projects, and keep a record of everything you create together.

## Dashboard URL

- **Local:** `http://localhost:3000`
- **Production:** `https://[your-hostinger-domain]`

## API Base URL

All API endpoints are relative to the dashboard URL. When making requests, use the full URL (e.g., `http://localhost:3000/api/projects`).

---

## Available APIs

### Projects

Use projects to organize related work together.

**List all projects:**
```bash
curl http://localhost:3000/api/projects
```

**Create a new project:**
```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Project Name",
    "description": "What this project is about",
    "tags": ["tag1", "tag2"]
  }'
```

**Get project details:**
```bash
curl http://localhost:3000/api/projects/{id}
```

**Update a project:**
```bash
curl -X PATCH http://localhost:3000/api/projects/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name",
    "description": "Updated description",
    "status": "active|on_hold|completed|archived",
    "progress": 75,
    "notes": "Key decisions and context"
  }'
```

**Delete a project:**
```bash
curl -X DELETE http://localhost:3000/api/projects/{id}
```

---

### Artifacts

Register files you create to track them in the gallery.

**Register an artifact:**
```bash
curl -X POST http://localhost:3000/api/artifacts \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": "project-id-here",
    "filePath": "/path/to/file.ts",
    "fileName": "file.ts",
    "type": "code|doc|image|data|config|other",
    "language": "TypeScript",
    "conversationId": "session-id"
  }'
```

---

### Tasks

Manage your task queue.

**List tasks:**
```bash
curl http://localhost:3000/api/tasks
```

**Create a task:**
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "description": "What needs to be done",
    "projectId": "project-id-here",
    "priority": "urgent|high|normal|low",
    "source": "terminal|whatsapp|discord|telegram|web"
  }'
```

**Update task status:**
```bash
curl -X PATCH http://localhost:3000/api/tasks/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "status": "queued|active|completed|failed|cancelled",
    "output": "Task result or output",
    "error": "Error message if failed"
  }'
```

---

### Notifications

Push notifications to the dashboard.

**Send a notification:**
```bash
curl -X POST http://localhost:3000/api/notifications \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Task Complete",
    "message": "Successfully refactored the auth module",
    "type": "info|success|warning|error",
    "action": {
      "label": "View Changes",
      "url": "/projects/abc123"
    }
  }'
```

---

### Analytics Events

Log custom events for tracking.

**Log an event:**
```bash
curl -X POST http://localhost:3000/api/analytics \
  -H "Content-Type: application/json" \
  -d '{
    "type": "task_complete|file_created|milestone_reached|custom",
    "data": { "key": "value" },
    "projectId": "project-id-here"
  }'
```

---

## When to Use These APIs

### Starting New Work
When your human asks you to work on something new or significant:
1. Check if a relevant project exists: `GET /api/projects`
2. If not, create one: `POST /api/projects`
3. Note the project ID for future use

### Creating Files
After creating or modifying significant files:
1. Register the artifact: `POST /api/artifacts`
2. Link it to the current project

### Completing Tasks
When you finish a task:
1. Update the task status: `PATCH /api/tasks/{id}` with `status: "completed"`
2. Optionally send a notification: `POST /api/notifications`

### Progress Updates
When reaching milestones:
1. Update project progress: `PATCH /api/projects/{id}` with new `progress` percentage
2. Add notes about key decisions

### Something Goes Wrong
If a task fails:
1. Update task with error: `PATCH /api/tasks/{id}` with `status: "failed"` and `error` message
2. Notify the human: `POST /api/notifications` with `type: "error"`

---

## Project Status Values

| Status | When to Use |
|--------|-------------|
| `active` | Currently being worked on |
| `on_hold` | Paused, waiting for input or other work |
| `completed` | Finished and delivered |
| `archived` | No longer relevant, kept for history |

## Task Priority Values

| Priority | When to Use |
|----------|-------------|
| `urgent` | Needs immediate attention |
| `high` | Important, should be done soon |
| `normal` | Standard priority |
| `low` | Can wait, nice to have |

## Artifact Types

| Type | File Types |
|------|------------|
| `code` | .ts, .tsx, .js, .jsx, .py, .go, .rs, etc. |
| `doc` | .md, .txt, .docx, .pdf |
| `image` | .png, .jpg, .svg, .gif |
| `data` | .sql, .json, .csv, .xml |
| `config` | .json, .yaml, .toml, .env |
| `other` | Everything else |

---

## Best Practices

1. **Always create a project** for non-trivial work spanning multiple conversations
2. **Register important artifacts** - code files, documentation, configurations
3. **Update progress** as you complete milestones (0-100%)
4. **Add notes** to projects with key decisions and context
5. **Use tags** to categorize projects (e.g., "frontend", "api", "urgent")
6. **Send notifications** for task completions and errors so your human stays informed

---

## Example Workflow

```bash
# 1. Starting a new feature
curl -X POST http://localhost:3000/api/projects \
  -d '{"name": "User Authentication", "description": "Implement OAuth2 login", "tags": ["auth", "security"]}'
# Response: {"id": "clx123...", ...}

# 2. Creating the first file
curl -X POST http://localhost:3000/api/artifacts \
  -d '{"projectId": "clx123...", "fileName": "auth.ts", "filePath": "src/lib/auth.ts", "type": "code", "language": "TypeScript"}'

# 3. Updating progress
curl -X PATCH http://localhost:3000/api/projects/clx123... \
  -d '{"progress": 50, "notes": "Basic auth flow complete, need to add refresh tokens"}'

# 4. Task complete notification
curl -X POST http://localhost:3000/api/notifications \
  -d '{"title": "Auth Module Ready", "message": "OAuth2 login implemented with refresh tokens", "type": "success"}'

# 5. Mark project complete
curl -X PATCH http://localhost:3000/api/projects/clx123... \
  -d '{"status": "completed", "progress": 100}'
```

---

Remember: Atlas HQ is **your** dashboard. Keep it updated so you and your human can track your collaboration effectively.
