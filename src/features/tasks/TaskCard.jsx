import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import DragIndicatorRoundedIcon from '@mui/icons-material/DragIndicatorRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import {
  Card,
  CardContent,
  Chip,
  IconButton,
  Stack,
  Typography,
} from '@mui/material'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { PRIORITY_DETAILS } from '../../types/task.js'

function TaskCardBody({
  task,
  onEdit,
  onDelete,
  dragHandleProps,
  isDragging = false,
  isDragOverlay = false,
  setNodeRef,
  transform,
  transition,
}) {
  const priority = PRIORITY_DETAILS[task.priority] ?? PRIORITY_DETAILS.medium

  return (
    <Card
      ref={setNodeRef}
      sx={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.65 : 1,
        border: '1px solid',
        borderColor: isDragging || isDragOverlay ? '#d7dcea' : '#eceef5',
        boxShadow: isDragging || isDragOverlay ? '0 10px 30px rgba(15, 23, 42, 0.08)' : 'none',
        position: 'relative',
        bgcolor: '#ffffff',
      }}
    >
      <CardContent sx={{ p: 1.75 }}>
        <Stack spacing={1.25}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={1}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 700,
                lineHeight: 1.35,
                color: '#2a2e39',
                fontFamily: '"Roboto Mono", "Consolas", monospace',
                fontSize: 13,
                letterSpacing: '-0.02em',
                pr: 1,
              }}
            >
              {task.title}
            </Typography>

            <IconButton
              size="small"
              {...dragHandleProps}
              aria-label={`Drag ${task.title}`}
              sx={{
                alignSelf: 'flex-start',
                cursor: isDragOverlay ? 'grabbing' : 'grab',
                color: '#b2b8c7',
                opacity: isDragOverlay ? 1 : 0,
                transition: 'opacity 120ms ease',
                '.MuiCard-root:hover &, .MuiCard-root:focus-within &': {
                  opacity: 1,
                },
              }}
            >
              <DragIndicatorRoundedIcon fontSize="small" />
            </IconButton>
          </Stack>

          <Typography
            variant="body2"
            sx={{
              color: '#6b7280',
              fontSize: 12,
              lineHeight: 1.55,
            }}
          >
            {task.description || 'No description provided.'}
          </Typography>

          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
            <Chip
              label={priority.label}
              size="small"
              sx={{
                height: 20,
                borderRadius: '5px',
                bgcolor: priority.background,
                color: priority.color,
                fontWeight: 700,
                fontSize: 10,
                fontFamily: '"Roboto Mono", "Consolas", monospace',
                letterSpacing: 0.3,
                '& .MuiChip-label': {
                  px: 0.75,
                },
              }}
            />

            <Stack
              direction="row"
              spacing={0.25}
              sx={{
                opacity: isDragOverlay ? 1 : 0,
                transition: 'opacity 120ms ease',
                '.MuiCard-root:hover &, .MuiCard-root:focus-within &': {
                  opacity: 1,
                },
              }}
            >
              <IconButton size="small" aria-label={`Edit ${task.title}`} onClick={() => onEdit(task)}>
                <EditRoundedIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                color="error"
                aria-label={`Delete ${task.title}`}
                onClick={() => onDelete(task)}
              >
                <DeleteOutlineRoundedIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  )
}

export function TaskCard({ task, onEdit, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: String(task.id),
    data: {
      type: 'task',
      task,
      column: task.column,
    },
  })

  return (
    <TaskCardBody
      task={task}
      onEdit={onEdit}
      onDelete={onDelete}
      dragHandleProps={{ ...attributes, ...listeners }}
      isDragging={isDragging}
      setNodeRef={setNodeRef}
      transform={transform}
      transition={transition}
    />
  )
}

export function TaskCardPreview({ task, onEdit, onDelete }) {
  return (
    <TaskCardBody
      task={task}
      onEdit={onEdit}
      onDelete={onDelete}
      dragHandleProps={{}}
      isDragOverlay
    />
  )
}
