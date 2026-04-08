export const TASK_COLUMNS = ['backlog', 'in_progress', 'review', 'done']
export const TASK_PRIORITIES = ['low', 'medium', 'high']

export const INITIAL_PAGE_SIZE = 4

export const COLUMN_DETAILS = {
  backlog: {
    title: 'Backlog',
    accent: '#64748b',
    surface: '#f8fafc',
  },
  in_progress: {
    title: 'In Progress',
    accent: '#0f766e',
    surface: '#ecfdf5',
  },
  review: {
    title: 'Review',
    accent: '#c2410c',
    surface: '#fff7ed',
  },
  done: {
    title: 'Done',
    accent: '#2563eb',
    surface: '#eff6ff',
  },
}

export const EMPTY_VISIBLE_COUNTS = Object.fromEntries(
  TASK_COLUMNS.map((column) => [column, INITIAL_PAGE_SIZE]),
)

export const PRIORITY_DETAILS = {
  low: {
    label: 'LOW',
    color: '#9ca3af',
    background: '#f3f4f6',
  },
  medium: {
    label: 'MEDIUM',
    color: '#f59e0b',
    background: '#fff7dd',
  },
  high: {
    label: 'HIGH',
    color: '#f97316',
    background: '#fff1eb',
  },
}
