import { create } from 'zustand'
import { createVisibleCounts } from '../utils/taskUtils.js'

export const useTaskUiStore = create((set) => ({
  searchTerm: '',
  visibleCounts: createVisibleCounts(),
  formDialog: {
    open: false,
    mode: 'create',
    task: null,
    initialColumn: 'backlog',
  },
  deleteDialog: {
    open: false,
    task: null,
  },
  setSearchTerm: (searchTerm) =>
    set({
      searchTerm,
      visibleCounts: createVisibleCounts(),
    }),
  loadMore: (column) =>
    set((state) => ({
      visibleCounts: {
        ...state.visibleCounts,
        [column]: state.visibleCounts[column] + 4,
      },
    })),
  openCreateDialog: (initialColumn = 'backlog') =>
    set({
      formDialog: {
        open: true,
        mode: 'create',
        task: null,
        initialColumn,
      },
    }),
  openEditDialog: (task) =>
    set({
      formDialog: {
        open: true,
        mode: 'edit',
        task,
        initialColumn: task.column,
      },
    }),
  closeFormDialog: () =>
    set((state) => ({
      formDialog: {
        ...state.formDialog,
        open: false,
        task: null,
      },
    })),
  openDeleteDialog: (task) =>
    set({
      deleteDialog: {
        open: true,
        task,
      },
    }),
  closeDeleteDialog: () =>
    set({
      deleteDialog: {
        open: false,
        task: null,
      },
    }),
}))
