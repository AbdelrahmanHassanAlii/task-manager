import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createTask as createTaskRequest,
  deleteTask as deleteTaskRequest,
  fetchTasks,
  updateTask as updateTaskRequest,
} from '../../../api/tasks.js'

const TASKS_QUERY_KEY = ['tasks']

function createTempId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }

  return `temp-${Date.now()}`
}

export function useTasksQuery() {
  return useQuery({
    queryKey: TASKS_QUERY_KEY,
    queryFn: fetchTasks,
  })
}

export function useCreateTaskMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createTaskRequest,
    onMutate: async (task) => {
      await queryClient.cancelQueries({ queryKey: TASKS_QUERY_KEY })
      const previousTasks = queryClient.getQueryData(TASKS_QUERY_KEY) ?? []
      const optimisticTask = { ...task, id: createTempId() }

      queryClient.setQueryData(TASKS_QUERY_KEY, [optimisticTask, ...previousTasks])

      return {
        previousTasks,
        optimisticId: optimisticTask.id,
      }
    },
    onError: (_error, _task, context) => {
      queryClient.setQueryData(TASKS_QUERY_KEY, context?.previousTasks ?? [])
    },
    onSuccess: (createdTask, _task, context) => {
      queryClient.setQueryData(TASKS_QUERY_KEY, (tasks = []) =>
        tasks.map((task) =>
          task.id === context?.optimisticId ? createdTask : task,
        ),
      )
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY })
    },
  })
}

export function useUpdateTaskMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateTaskRequest,
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey: TASKS_QUERY_KEY })
      const previousTasks = queryClient.getQueryData(TASKS_QUERY_KEY) ?? []

      queryClient.setQueryData(TASKS_QUERY_KEY, (tasks = []) =>
        tasks.map((task) => (task.id === id ? { ...task, ...updates } : task)),
      )

      return { previousTasks }
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(TASKS_QUERY_KEY, context?.previousTasks ?? [])
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY })
    },
  })
}

export function useDeleteTaskMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteTaskRequest,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: TASKS_QUERY_KEY })
      const previousTasks = queryClient.getQueryData(TASKS_QUERY_KEY) ?? []

      queryClient.setQueryData(TASKS_QUERY_KEY, (tasks = []) =>
        tasks.filter((task) => task.id !== id),
      )

      return { previousTasks }
    },
    onError: (_error, _id, context) => {
      queryClient.setQueryData(TASKS_QUERY_KEY, context?.previousTasks ?? [])
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY })
    },
  })
}

export function useMoveTaskMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateTaskRequest,
    onError: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY })
    },
  })
}
