import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import CustomSelect from '../components/CustomSelect';
import type { SelectOption } from '../components/CustomSelect';
import type { Task } from '../types/task';
import { createMockTasks } from '../data/mockTasks';

// Task interface удалён, используем общий тип Task

export default function Tasks() {
  const { t } = useTranslation();

  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

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

  // Mock tasks data (shared)
  const allTasks: Task[] = useMemo(() => createMockTasks(t), [t]);

  // Filtered tasks based on search and filters
  const filteredTasks = useMemo(() => {
    return allTasks.filter(task => {
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
  }, [allTasks, searchQuery, statusFilter, priorityFilter]);

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
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
          {t('tasks.title')}
        </h1>
        <p className="text-gray-600 text-sm sm:text-base lg:text-lg">
          {t('tasks.subtitle')}
        </p>
      </div>

      {/* Task Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700 mb-2 text-left"
            >
              {t('tasks.filters.searchLabel')}
            </label>
            <input
              type="text"
              id="search"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder={t('tasks.filters.searchPlaceholder')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="w-full sm:w-40">
              <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
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
              <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
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
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-600">
                {t('tasks.filters.active')}
              </span>
              {statusFilter !== 'all' && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {t('tasks.filters.status')}:{' '}
                  {statusOptions.find(opt => opt.value === statusFilter)?.label}
                  <button
                    onClick={() => setStatusFilter('all')}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                    aria-label={t('actions.clear')}
                  >
                    ×
                  </button>
                </span>
              )}
              {priorityFilter !== 'all' && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  {t('tasks.filters.priority')}:{' '}
                  {
                    priorityOptions.find(opt => opt.value === priorityFilter)
                      ?.label
                  }
                  <button
                    onClick={() => setPriorityFilter('all')}
                    className="ml-1 text-purple-600 hover:text-purple-800"
                    aria-label={t('actions.clear')}
                  >
                    ×
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {t('tasks.filters.search')}: "{searchQuery}"
                  <button
                    onClick={() => setSearchQuery('')}
                    className="ml-1 text-green-600 hover:text-green-800"
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
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                {t('actions.clearAll')}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Task List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {t('tasks.list.title')}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {t('tasks.list.showing', {
                  count: filteredTasks.length,
                  total: allTasks.length,
                })}
              </p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
              {t('tasks.list.newTask')}
            </button>
          </div>

          {filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {t('tasks.list.emptyTitle')}
              </h3>
              <p className="text-gray-500">{t('tasks.list.emptySubtitle')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTasks.map(task => (
                <div
                  key={task.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
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
                      <h4 className="text-sm font-medium text-gray-900 mb-1">
                        {task.title}
                      </h4>
                      <p className="text-sm text-gray-500 mb-2">
                        {task.description}
                      </p>
                      <div className="flex items-center text-xs text-gray-500 space-x-4">
                        <span>
                          {t('tasks.fields.due')}: {task.dueDate}
                        </span>
                        <span>
                          {t('tasks.fields.assignedTo')}: {task.assignedTo}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <button
                        className="text-gray-400 hover:text-gray-600"
                        aria-label={t('actions.more')}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
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
    </div>
  );
}
