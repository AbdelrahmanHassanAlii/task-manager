import AddRoundedIcon from '@mui/icons-material/AddRounded'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import {
  Box,
  Button,
  Paper,
  Stack,
  Typography,
  alpha,
} from '@mui/material'
import { COLUMN_DETAILS } from '../../types/task.js'
import { getColumnDropId } from '../../utils/taskUtils.js'
import { TaskCard } from './TaskCard.jsx'

export function TaskColumn({
  column,
  tasks,
  totalTasks,
  hasMore,
  isFiltering,
  onCreateTask,
  onEditTask,
  onDeleteTask,
  onLoadMore,
}) {
  const details = COLUMN_DETAILS[column]
  const { isOver, setNodeRef } = useDroppable({
    id: getColumnDropId(column),
    data: {
      type: 'column',
      column,
    },
  })

  return (
    <Paper
      sx={{
        p: 1.5,
        minHeight: 560,
        bgcolor: '#f5f6fa',
        border: '1px solid',
        borderColor: isOver ? alpha(details.accent, 0.28) : '#f0f2f7',
        borderRadius: '14px',
      }}
    >
      <Stack spacing={1.5} sx={{ height: '100%' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1} sx={{ px: 0.5, pt: 0.25 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: details.accent,
              }}
            />
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#374151',
                fontFamily: '"Roboto Mono", "Consolas", monospace',
              }}
            >
              {details.title}
            </Typography>
            <Box
              sx={{
                minWidth: 20,
                px: 0.75,
                height: 18,
                borderRadius: '999px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: '#eceff5',
                color: '#8a91a3',
                fontSize: 10,
                fontWeight: 700,
                fontFamily: '"Roboto Mono", "Consolas", monospace',
              }}
            >
              {totalTasks}
            </Box>
          </Stack>
        </Stack>

        <Stack
          ref={setNodeRef}
          spacing={1}
          sx={{
            flex: 1,
            minHeight: 220,
            p: 0.25,
            borderRadius: 2,
            bgcolor: isOver ? alpha(details.accent, 0.05) : 'transparent',
            transition: 'background-color 160ms ease',
          }}
        >
          <SortableContext
            items={tasks.map((task) => String(task.id))}
            strategy={verticalListSortingStrategy}
          >
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} onEdit={onEditTask} onDelete={onDeleteTask} />
            ))}
          </SortableContext>

          {!tasks.length && (
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                borderStyle: 'dashed',
                borderColor: '#d9deea',
                bgcolor: '#f8f9fc',
              }}
            >
              <Typography variant="subtitle2" sx={{ mb: 0.5, fontSize: 13 }}>
                {isFiltering ? 'No matching tasks' : 'No tasks yet'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12 }}>
                {isFiltering
                  ? 'Try a different keyword or clear the search.'
                  : 'Create a task here or drag one in from another column.'}
              </Typography>
            </Paper>
          )}
        </Stack>

        <Button
          variant="text"
          startIcon={<AddRoundedIcon sx={{ fontSize: 14 }} />}
          onClick={() => (hasMore ? onLoadMore(column) : onCreateTask(column))}
          sx={{
            height: 28,
            borderRadius: '8px',
            border: '1px dashed #d8dce8',
            color: '#6b7280',
            fontSize: 12,
            bgcolor: 'transparent',
            justifyContent: 'center',
            '&:hover': {
              bgcolor: '#fafbff',
              borderColor: '#cfd5e4',
            },
          }}
        >
          {hasMore ? 'Load more' : 'Add task'}
        </Button>
      </Stack>
    </Paper>
  )
}
