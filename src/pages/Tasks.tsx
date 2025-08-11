import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import CustomSelect from '../components/CustomSelect';
import type { SelectOption } from '../components/CustomSelect';
import type { Task } from '../types/task';
import { createMockTasks } from '../data/mockTasks';
import AddTaskModal from '../components/AddTaskModal';
import EditTaskModal from '../components/EditTaskModal';
import DeleteTaskModal from '../components/DeleteTaskModal';
import {
  addTask,
  updateTask,
  deleteTask,
  initializeWithMockData,
} from '../store/slices/tasksSlice';
import {
  selectAllTasks,
  selectTasksLoading,
} from '../store/selectors/tasksSelectors';
import type { AppDispatch } from '../store';

export default function Tasks() {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Redux state
  const tasks = useSelector(selectAllTasks);
  const loading = useSelector(selectTasksLoading);

  // Initialize and update mock data when language changes
  useEffect(() => {
    if (tasks.length === 0) {
      // Only load mock data if no tasks exist
      const mockTasks = createMockTasks(t);
      dispatch(initializeWithMockData(mockTasks));
    }
    // Remove the else block that was overwriting existing tasks
  }, [dispatch, t, tasks.length]);

  // Status options
  const statusOptions: SelectOption[] = [
    { value: 'all', label: t('tasks.filters.allStatus') },
    { value: 'pending', label: t('tasks.status.pending') },
    { value: 'in-progress', label: t('tasks.status.inProgress') },
    { value: 'completed', label: t('tasks.status.completed') },
  ];

  // Priority options
  const priorityOptions: SelectOption[] = [
    { value: 'all', label: t('tasks.filters.allPriority') },
    { value: 'low', label: t('tasks.priority.low') },
    { value: 'medium', label: t('tasks.priority.medium') },
    { value: 'high', label: t('tasks.priority.high') },
  ];

  // Filtered tasks based on search and filters
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch =
        searchQuery === '' ||
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.assignedTo.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' || task.status === statusFilter;
      const matchesPriority =
        priorityFilter === 'all' || task.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, searchQuery, statusFilter, priorityFilter]);

  // Filter handlers
  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
  };

  const handlePriorityChange = (value: string) => {
    setPriorityFilter(value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Task handlers
  const handleAddTask = (taskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };

    dispatch(addTask(newTask));

    // Reset filters to show the new task
    setStatusFilter('all');
    setPriorityFilter('all');
    setSearchQuery('');

    closeAddModal();
  };

  const handleEditTask = (taskId: string, taskData: Partial<Task>) => {
    dispatch(updateTask({ id: taskId, updates: taskData }));
    closeModals();
  };

  const handleDeleteTask = (taskId: string) => {
    dispatch(deleteTask(taskId));
    closeModals();
  };

  // Modal handlers
  const openEditModal = (task: Task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (task: Task) => {
    setSelectedTask(task);
    setIsDeleteModalOpen(true);
  };

  const closeAddModal = () => setIsAddModalOpen(false);

  const closeModals = () => {
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedTask(null);
  };

  // Get status badge styles
  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get priority badge styles
  const getPriorityBadgeStyle = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-blue-100 text-blue-800';
      case 'medium':
        return 'bg-orange-100 text-orange-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-green-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          {t('tasks.title')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base lg:text-lg">
          {t('tasks.subtitle')}
        </p>
      </div>

      {/* Task Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left"
            >
              {t('tasks.filters.searchLabel')}
            </label>
            <input
              type="text"
              id="search"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder={t('tasks.filters.searchPlaceholder')}
              className="w-full h-10 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="w-full sm:w-40">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">
                {t('tasks.filters.status')}
              </label>
              <CustomSelect
                options={statusOptions}
                value={statusFilter}
                onChange={handleStatusChange}
                placeholder={t('tasks.filters.statusPlaceholder')}
                size="md"
              />
            </div>
            <div className="w-full sm:w-40">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">
                {t('tasks.filters.priority')}
              </label>
              <CustomSelect
                options={priorityOptions}
                value={priorityFilter}
                onChange={handlePriorityChange}
                placeholder={t('tasks.filters.priorityPlaceholder')}
                size="md"
              />
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        {(statusFilter !== 'all' ||
          priorityFilter !== 'all' ||
          searchQuery) && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {t('tasks.filters.active')}
              </span>
              {statusFilter !== 'all' && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                  {t('tasks.filters.status')}:{' '}
                  {statusOptions.find(opt => opt.value === statusFilter)?.label}
                  <button
                    onClick={() => setStatusFilter('all')}
                    className="ml-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    aria-label={t('actions.clear')}
                  >
                    ×
                  </button>
                </span>
              )}
              {priorityFilter !== 'all' && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                  {t('tasks.filters.priority')}:{' '}
                  {
                    priorityOptions.find(opt => opt.value === priorityFilter)
                      ?.label
                  }
                  <button
                    onClick={() => setPriorityFilter('all')}
                    className="ml-1 text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300"
                    aria-label={t('actions.clear')}
                  >
                    ×
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                  {t('tasks.filters.search')}: "{searchQuery}"
                  <button
                    onClick={() => setSearchQuery('')}
                    className="ml-1 text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
                    aria-label={t('actions.clear')}
                  >
                    ×
                  </button>
                </span>
              )}
              <button
                onClick={() => {
                  setStatusFilter('all');
                  setPriorityFilter('all');
                  setSearchQuery('');
                }}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 underline"
              >
                {t('actions.clearAll')}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Task List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                {t('tasks.list.title')}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {t('tasks.list.showing', {
                  count: filteredTasks.length,
                  total: tasks.length,
                })}
              </p>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors"
            >
              {t('tasks.list.newTask')}
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <svg
                  className="mx-auto h-8 w-8 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </div>
              <p className="text-gray-500 dark:text-gray-400">
                {t('tasks.list.loading')}
              </p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <svg
                  className="mx-auto h-12 w-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {t('tasks.list.emptyTitle')}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {t('tasks.list.emptySubtitle')}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTasks.map(task => (
                <div
                  key={task.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow bg-white dark:bg-gray-700"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeStyle(task.status)}`}
                        >
                          {t(
                            `tasks.status.${task.status === 'in-progress' ? 'inProgress' : task.status}`
                          )}
                        </span>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadgeStyle(task.priority)}`}
                        >
                          {t(`tasks.priority.${task.priority}`)}
                        </span>
                      </div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                        {task.title}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        {task.description}
                      </p>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-4">
                        <span>
                          {t('tasks.fields.due')}: {task.dueDate}
                        </span>
                        <span>
                          {t('tasks.fields.assignedTo')}: {task.assignedTo}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex items-center space-x-2">
                      <button
                        onClick={() => openEditModal(task)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors"
                        aria-label={t('actions.edit')}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => openDeleteModal(task)}
                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900 transition-colors"
                        aria-label={t('actions.delete')}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddTask}
      />

      {/* Edit Task Modal */}
      {selectedTask && (
        <EditTaskModal
          isOpen={isEditModalOpen}
          onClose={closeModals}
          onSubmit={(taskId, taskData) => handleEditTask(taskId, taskData)}
          task={selectedTask}
        />
      )}

      {/* Delete Task Modal */}
      {selectedTask && (
        <DeleteTaskModal
          isOpen={isDeleteModalOpen}
          onClose={closeModals}
          onConfirm={() => {
            handleDeleteTask(selectedTask.id);
            closeModals();
          }}
          task={selectedTask}
        />
      )}
    </div>
  );
}
