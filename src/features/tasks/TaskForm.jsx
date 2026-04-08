import { useState } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material'
import {
  COLUMN_DETAILS,
  PRIORITY_DETAILS,
  TASK_COLUMNS,
  TASK_PRIORITIES,
} from '../../types/task.js'

function getInitialValues(task, initialColumn) {
  return {
    title: task?.title ?? '',
    description: task?.description ?? '',
    column: task?.column ?? initialColumn ?? 'backlog',
    priority: task?.priority ?? 'medium',
  }
}

export function TaskForm({
  open,
  mode,
  task,
  initialColumn,
  isPending,
  onClose,
  onSubmit,
}) {
  const [values, setValues] = useState(getInitialValues(task, initialColumn))
  const [errors, setErrors] = useState({})

  function handleChange(field) {
    return (event) => {
      const nextValue = event.target.value

      setValues((currentValues) => ({
        ...currentValues,
        [field]: nextValue,
      }))

      setErrors((currentErrors) => ({
        ...currentErrors,
        [field]: '',
      }))
    }
  }

  function handleSubmit(event) {
    event.preventDefault()

    const nextErrors = {
      title: values.title.trim() ? '' : 'Title is required.',
      column: values.column ? '' : 'Column is required.',
      priority: values.priority ? '' : 'Priority is required.',
    }

    setErrors(nextErrors)

    if (nextErrors.title || nextErrors.column || nextErrors.priority) {
      return
    }

    onSubmit({
      title: values.title.trim(),
      description: values.description.trim(),
      column: values.column,
      priority: values.priority,
    })
  }

  return (
    <Dialog open={open} onClose={isPending ? undefined : onClose} fullWidth maxWidth="sm">
      <DialogTitle>{mode === 'edit' ? 'Edit task' : 'Create task'}</DialogTitle>

      <DialogContent dividers>
        <Stack component="form" spacing={2} onSubmit={handleSubmit} sx={{ pt: 1 }}>
          <TextField
            label="Title"
            value={values.title}
            onChange={handleChange('title')}
            error={Boolean(errors.title)}
            helperText={errors.title || ' '}
            required
            autoFocus
          />

          <TextField
            label="Description"
            value={values.description}
            onChange={handleChange('description')}
            multiline
            minRows={4}
            helperText="Optional, but helpful for context."
          />

          <TextField
            select
            label="Column"
            value={values.column}
            onChange={handleChange('column')}
            error={Boolean(errors.column)}
            helperText={errors.column || ' '}
            required
          >
            {TASK_COLUMNS.map((column) => (
              <MenuItem key={column} value={column}>
                {COLUMN_DETAILS[column].title}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Priority"
            value={values.priority}
            onChange={handleChange('priority')}
            error={Boolean(errors.priority)}
            helperText={errors.priority || ' '}
            required
          >
            {TASK_PRIORITIES.map((priority) => (
              <MenuItem key={priority} value={priority}>
                {PRIORITY_DETAILS[priority].label}
              </MenuItem>
            ))}
          </TextField>

          <DialogActions sx={{ px: 0, pb: 0 }}>
            <Button onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={isPending}>
              {mode === 'edit' ? 'Save changes' : 'Create task'}
            </Button>
          </DialogActions>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
