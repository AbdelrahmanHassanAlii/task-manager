# Task Management Kanban Board

A React + Vite Kanban-style task dashboard with a mock `json-server` backend. The app supports task creation, editing, deletion, drag-and-drop between columns, responsive search, per-column pagination, and real editable task priority.

## Features

- Four workflow columns: `backlog`, `in_progress`, `review`, and `done`
- Create, edit, and delete tasks
- Drag and drop tasks between columns
- Search tasks by title or description
- Per-column pagination with a lightweight "Load more" flow
- Real task priority: `low`, `medium`, `high`
- Optimistic updates with React Query
- Responsive Material UI interface styled like a compact Kanban board

## Tech Stack

- React 19
- Vite
- Material UI
- Zustand
- `@tanstack/react-query`
- `@dnd-kit`
- `json-server`

## Task Shape

Each task is stored as:

```json
{
  "id": "1",
  "title": "Draft onboarding checklist",
  "description": "Outline the first-week setup tasks for new team members.",
  "column": "backlog",
  "priority": "medium"
}
```

## Getting Started

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env
```

If you are on Windows PowerShell, create `.env` manually and add:

```env
VITE_API_URL=http://localhost:4000/tasks
```

## Available Scripts

Start the Vite development server:

```bash
npm run dev
```

Start the mock API on port `4000`:

```bash
npm run server
```

Start both the frontend and the mock API together:

```bash
npm run dev:all
```

Create a production build:

```bash
npm run build
```

Run ESLint:

```bash
npm run lint
```

Preview the production build:

```bash
npm run preview
```

## Local URLs

- App: `http://localhost:5173`
- Mock API: `http://localhost:4000/tasks`

## Environment Variables

The frontend reads the API endpoint from `VITE_API_URL`.

Local development:

```env
VITE_API_URL=http://localhost:4000/tasks
```

Production:

```env
VITE_API_URL=https://your-deployed-api.example.com/tasks
```

## Mock API Notes

- The project uses `json-server` v1 syntax through:

```bash
json-server db.json --port 4000
```

- If you change `db.json` while the server is already running, restart `npm run server` or `npm run dev:all` if the new data is not reflected immediately.

## Netlify Deployment

Netlify only deploys your frontend. It cannot access your local `http://localhost:4000` after deployment, because `localhost` on Netlify points to Netlify's own environment, not your machine.

To make production work:

1. Deploy your API somewhere public.
2. Set `VITE_API_URL` in Netlify to that public `/tasks` endpoint.
3. Trigger a new Netlify deploy.

Examples of where you can host the mock API:

- Render
- Railway
- Glitch
- A small Express/json-server service on your own server

If you keep using `json-server`, production needs a hosted version of it or another real backend. Without that, create/update/delete cannot work on Netlify.

## Project Structure

```text
src/
  api/              API helpers for tasks
  components/       Shared UI components
  features/tasks/   Task board, columns, cards, form, and hooks
  store/            Zustand UI state
  types/            Shared constants and metadata
  utils/            Task grouping and drag helpers
```

## Architecture Overview

### Server state

React Query manages:

- task fetching
- create/update/delete mutations
- optimistic cache updates
- refetch and cache reconciliation

### UI state

Zustand manages:

- search term
- create/edit dialog state
- delete confirmation dialog state
- per-column visible item counts

### Presentation

Material UI provides the layout, dialogs, inputs, cards, and responsive board styling. `@dnd-kit` powers the drag-and-drop interactions.

## Main Files

- `src/main.jsx`: app bootstrap, React Query provider, MUI theme provider
- `src/theme.js`: theme tokens and component overrides
- `src/api/tasks.js`: mock API requests
- `src/features/tasks/TaskBoard.jsx`: main Kanban board behavior
- `src/features/tasks/TaskForm.jsx`: create/edit dialog
- `src/features/tasks/hooks/useTasks.js`: query and mutation hooks
- `db.json`: mock dataset served by `json-server`

## Current Behavior

- Search is client-side for fast filtering against cached data
- Dragging a task to another column updates the UI immediately and persists the new `column`
- Priority is selected in the form and can be changed any time by editing a task
- The board keeps pagination independent for each column

## Validation

Required fields:

- title
- column
- priority

## Development Notes

- `json-server` is only used as a mock backend for local development
- The project currently uses JavaScript/JSX rather than TypeScript
- The production build may show a Vite chunk-size warning, but the app still builds successfully
