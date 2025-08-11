import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../index';
import type { TaskStatus, TaskPriority } from '../../types/task';

// Basic selectors
export const selectTasksState = (state: RootState) => state.tasks;
export const selectAllTasks = (state: RootState) => state.tasks.tasks;
export const selectTasksLoading = (state: RootState) => state.tasks.loading;
export const selectTasksError = (state: RootState) => state.tasks.error;

// Selector for filtering tasks
export const selectFilteredTasks = createSelector(
  [
    selectAllTasks,
    (
      state: RootState,
      filters: {
        search?: string;
        status?: TaskStatus | 'all';
        priority?: TaskPriority | 'all';
      }
    ) => filters,
  ],
  (tasks, filters) => {
    return tasks.filter(task => {
      const matchesSearch =
        !filters.search ||
        task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        task.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        task.assignedTo.toLowerCase().includes(filters.search.toLowerCase());

      const matchesStatus =
        !filters.status ||
        filters.status === 'all' ||
        task.status === filters.status;
      const matchesPriority =
        !filters.priority ||
        filters.priority === 'all' ||
        task.priority === filters.priority;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }
);

// Selector for task statistics
export const selectTasksStats = createSelector([selectAllTasks], tasks => {
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'completed').length;
  const pending = tasks.filter(t => t.status === 'pending').length;
  const inProgress = tasks.filter(t => t.status === 'in-progress').length;

  return { total, completed, pending, inProgress };
});

// Selector for getting task by ID
export const selectTaskById = createSelector(
  [selectAllTasks, (state: RootState, taskId: string) => taskId],
  (tasks, taskId) => tasks.find(task => task.id === taskId)
);

// Selector for number of tasks by status
export const selectTasksByStatus = createSelector(
  [selectAllTasks, (state: RootState, status: TaskStatus) => status],
  (tasks, status) => tasks.filter(task => task.status === status)
);

// Selector for number of tasks by priority
export const selectTasksByPriority = createSelector(
  [selectAllTasks, (state: RootState, priority: TaskPriority) => priority],
  (tasks, priority) => tasks.filter(task => task.priority === priority)
);
