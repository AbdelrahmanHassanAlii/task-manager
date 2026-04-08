import { useDeferredValue, useState } from 'react'
import AppsRoundedIcon from '@mui/icons-material/AppsRounded'
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded'
import {
  closestCorners,
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import { ConfirmDeleteDialog } from '../../components/ConfirmDeleteDialog.jsx'
import { SearchBar } from '../../components/SearchBar.jsx'
import { useTaskUiStore } from '../../store/taskUiStore.js'
import { TASK_COLUMNS } from '../../types/task.js'
import {
  findColumnFromDropTarget,
  groupTasksByColumn,
  matchesTaskSearch,
  moveTask,
} from '../../utils/taskUtils.js'
import {
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useMoveTaskMutation,
  useTasksQuery,
  useUpdateTaskMutation,
} from './hooks/useTasks.js'
import { TaskCardPreview } from './TaskCard.jsx'
import { TaskColumn } from './TaskColumn.jsx'
import { TaskForm } from './TaskForm.jsx'

export function TaskBoard() {
  const queryClient = useQueryClient()
  const { data: tasks = [], isLoading, isError, error, refetch } = useTasksQuery()
  const createTaskMutation = useCreateTaskMutation()
  const updateTaskMutation = useUpdateTaskMutation()
  const deleteTaskMutation = useDeleteTaskMutation()
  const moveTaskMutation = useMoveTaskMutation()

  const searchTerm = useTaskUiStore((state) => state.searchTerm)
  const visibleCounts = useTaskUiStore((state) => state.visibleCounts)
  const formDialog = useTaskUiStore((state) => state.formDialog)
  const deleteDialog = useTaskUiStore((state) => state.deleteDialog)
  const setSearchTerm = useTaskUiStore((state) => state.setSearchTerm)
  const loadMore = useTaskUiStore((state) => state.loadMore)
  const openCreateDialog = useTaskUiStore((state) => state.openCreateDialog)
  const openEditDialog = useTaskUiStore((state) => state.openEditDialog)
  const closeFormDialog = useTaskUiStore((state) => state.closeFormDialog)
  const openDeleteDialog = useTaskUiStore((state) => state.openDeleteDialog)
  const closeDeleteDialog = useTaskUiStore((state) => state.closeDeleteDialog)

  const deferredSearchTerm = useDeferredValue(searchTerm)
  const [previewTasks, setPreviewTasks] = useState(null)
  const [activeTaskId, setActiveTaskId] = useState(null)
  const [activeTaskColumn, setActiveTaskColumn] = useState(null)

  const boardTasks = previewTasks ?? tasks
  const filteredTasks = boardTasks.filter((task) => matchesTaskSearch(task, deferredSearchTerm))
  const groupedTasks = groupTasksByColumn(filteredTasks)
  const totalGroupedTasks = groupTasksByColumn(boardTasks)
  const activeTask = boardTasks.find((task) => String(task.id) === String(activeTaskId)) ?? null
  const totalTasksCount = boardTasks.length

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    }),
  )

  function handleCreateTask(values) {
    createTaskMutation.mutate(values, {
      onSuccess: () => {
        closeFormDialog()
      },
    })
  }

  function handleUpdateTask(values) {
    updateTaskMutation.mutate(
      {
        id: formDialog.task.id,
        updates: values,
      },
      {
        onSuccess: () => {
          closeFormDialog()
        },
      },
    )
  }

  function handleDeleteTask() {
    if (!deleteDialog.task) {
      return
    }

    deleteTaskMutation.mutate(deleteDialog.task.id, {
      onSuccess: () => {
        closeDeleteDialog()
      },
    })
  }

  function resetDragState() {
    setPreviewTasks(null)
    setActiveTaskId(null)
    setActiveTaskColumn(null)
  }

  function handleDragStart(event) {
    const { active } = event
    const task = boardTasks.find((item) => String(item.id) === String(active.id))

    setActiveTaskId(active.id)
    setActiveTaskColumn(task?.column ?? null)
  }

  function handleDragOver(event) {
    const { active, over } = event

    if (!over) {
      return
    }

    const activeId = String(active.id)
    const overId = String(over.id)
    const sourceTasks = previewTasks ?? boardTasks
    const targetColumn = findColumnFromDropTarget(sourceTasks, overId)

    if (!targetColumn) {
      return
    }

    const movedTasks = moveTask(sourceTasks, activeId, overId, targetColumn)

    if (movedTasks !== sourceTasks) {
      setPreviewTasks(movedTasks)
    }
  }

  function handleDragEnd(event) {
    const { active, over } = event

    if (!over) {
      resetDragState()
      return
    }

    const nextTasks = previewTasks ?? boardTasks
    const droppedTask = nextTasks.find((task) => String(task.id) === String(active.id))

    queryClient.setQueryData(['tasks'], nextTasks)

    if (droppedTask && droppedTask.column !== activeTaskColumn) {
      moveTaskMutation.mutate({
        id: droppedTask.id,
        updates: {
          column: droppedTask.column,
        },
      })
    }

    resetDragState()
  }

  return (
    <Stack spacing={0} sx={{ minHeight: '100vh', bgcolor: '#ffffff' }}>
      <Box sx={{ px: { xs: 1.5, md: 2 }, pt: 1.25, pb: 1 }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          spacing={1.5}
          alignItems={{ xs: 'stretch', md: 'center' }}
        >
          <Stack direction="row" spacing={1.25} alignItems="flex-start">
            <Box
              sx={{
                width: 26,
                height: 26,
                borderRadius: '7px',
                bgcolor: '#4f6ef7',
                color: '#ffffff',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                mt: 0.125,
                flexShrink: 0,
              }}
            >
              <AppsRoundedIcon sx={{ fontSize: 16 }} />
            </Box>
            <Box>
              <Typography
                sx={{
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: '#1f2430',
                  fontFamily: '"Roboto Mono", "Consolas", monospace',
                  lineHeight: 1.2,
                }}
              >
                Kanban Board
              </Typography>
              <Typography sx={{ fontSize: 12, color: '#6b7280', mt: 0.25 }}>
                {totalTasksCount} tasks
              </Typography>
            </Box>
          </Stack>

          <SearchBar value={searchTerm} onChange={setSearchTerm} />
        </Stack>
      </Box>
      <Divider />

      {isLoading && (
        <Paper sx={{ p: 6, m: 2 }}>
          <Stack spacing={2} alignItems="center">
            <CircularProgress />
            <Typography color="text.secondary">Loading tasks from the mock API...</Typography>
          </Stack>
        </Paper>
      )}

      {!isLoading && isError && (
        <Alert
          sx={{ m: 2 }}
          severity="error"
          icon={<ErrorOutlineRoundedIcon />}
          action={
            <Button color="inherit" size="small" onClick={() => refetch()}>
              Retry
            </Button>
          }
        >
          {error instanceof Error
            ? error.message
            : 'Something went wrong while loading tasks.'}
        </Alert>
      )}

      {!isLoading && !isError && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          onDragCancel={resetDragState}
        >
          <Grid container spacing={1.5} sx={{ p: { xs: 1.5, md: 2 } }}>
            {TASK_COLUMNS.map((column) => {
              const columnTasks = groupedTasks[column]
              const totalTasks = totalGroupedTasks[column].length
              const visibleTasks = columnTasks.slice(0, visibleCounts[column])

              return (
                <Grid key={column} size={{ xs: 12, sm: 6, lg: 3 }}>
                  <TaskColumn
                    column={column}
                    tasks={visibleTasks}
                    totalTasks={totalTasks}
                    hasMore={columnTasks.length > visibleCounts[column]}
                    isFiltering={Boolean(deferredSearchTerm)}
                    onCreateTask={openCreateDialog}
                    onEditTask={openEditDialog}
                    onDeleteTask={openDeleteDialog}
                    onLoadMore={loadMore}
                  />
                </Grid>
              )
            })}
          </Grid>

          <DragOverlay>
            {activeTask ? (
              <Box sx={{ width: { xs: 280, sm: 320 }, opacity: 0.95 }}>
                <TaskCardPreview
                  task={activeTask}
                  onEdit={() => {}}
                  onDelete={() => {}}
                />
              </Box>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      <TaskForm
        key={`${formDialog.mode}-${formDialog.task?.id ?? formDialog.initialColumn}-${String(formDialog.open)}`}
        open={formDialog.open}
        mode={formDialog.mode}
        task={formDialog.task}
        initialColumn={formDialog.initialColumn}
        isPending={createTaskMutation.isPending || updateTaskMutation.isPending}
        onClose={closeFormDialog}
        onSubmit={formDialog.mode === 'edit' ? handleUpdateTask : handleCreateTask}
      />

      <ConfirmDeleteDialog
        open={deleteDialog.open}
        taskTitle={deleteDialog.task?.title}
        onClose={closeDeleteDialog}
        onConfirm={handleDeleteTask}
        isPending={deleteTaskMutation.isPending}
      />
    </Stack>
  )
}
