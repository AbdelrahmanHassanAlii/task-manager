import { EMPTY_VISIBLE_COUNTS, TASK_COLUMNS } from '../types/task.js'

export function getEmptyColumns() {
  return TASK_COLUMNS.reduce((columns, column) => {
    columns[column] = []
    return columns
  }, {})
}

export function groupTasksByColumn(tasks) {
  const grouped = getEmptyColumns()

  for (const task of tasks) {
    if (grouped[task.column]) {
      grouped[task.column].push(task)
    }
  }

  return grouped
}

export function matchesTaskSearch(task, searchTerm) {
  if (!searchTerm) {
    return true
  }

  const normalizedSearch = searchTerm.trim().toLowerCase()
  const haystack = `${task.title} ${task.description}`.toLowerCase()

  return haystack.includes(normalizedSearch)
}

export function createVisibleCounts() {
  return { ...EMPTY_VISIBLE_COUNTS }
}

export function getColumnDropId(column) {
  return `column:${column}`
}

export function findColumnFromDropTarget(tasks, overId) {
  if (!overId) {
    return null
  }

  const targetId = String(overId)

  if (targetId.startsWith('column:')) {
    return targetId.replace('column:', '')
  }

  return tasks.find((task) => String(task.id) === targetId)?.column ?? null
}

export function moveTask(tasks, activeId, overId, targetColumn) {
  const activeIndex = tasks.findIndex((task) => String(task.id) === String(activeId))

  if (activeIndex === -1) {
    return tasks
  }

  const activeTask = tasks[activeIndex]
  const normalizedTargetColumn = targetColumn ?? activeTask.column
  const overIndexBeforeMove = overId
    ? tasks.findIndex((task) => String(task.id) === String(overId))
    : -1

  if (
    activeTask.column === normalizedTargetColumn &&
    (String(overId) === String(activeId) || overIndexBeforeMove === activeIndex)
  ) {
    return tasks
  }

  const nextTasks = [...tasks]
  const [removedTask] = nextTasks.splice(activeIndex, 1)
  const movedTask = { ...removedTask, column: normalizedTargetColumn }

  const overIndex = overId
    ? nextTasks.findIndex((task) => String(task.id) === String(overId))
    : -1

  let insertIndex = overIndex

  if (insertIndex === -1) {
    insertIndex = nextTasks.reduce((lastMatch, task, index) => {
      if (task.column === movedTask.column) {
        return index + 1
      }

      return lastMatch
    }, 0)
  }

  nextTasks.splice(insertIndex, 0, movedTask)
  return nextTasks
}
