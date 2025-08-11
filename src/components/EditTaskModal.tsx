import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { X, Edit2 } from 'lucide-react';
import type { Task, TaskStatus, TaskPriority } from '../types/task';

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskId: string, updatedTask: Omit<Task, 'id'>) => void;
  task: Task | null;
}

interface EditTaskFormData {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  assignedTo: string;
}

const schema = yup.object({
  title: yup
    .string()
    .required('Title is required')
    .min(3, 'Title must be at least 3 characters'),
  description: yup
    .string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters'),
  status: yup
    .string()
    .oneOf(['pending', 'in-progress', 'completed'] as const)
    .required('Status is required'),
  priority: yup
    .string()
    .oneOf(['low', 'medium', 'high'] as const)
    .required('Priority is required'),
  dueDate: yup.string().required('Due date is required'),
  assignedTo: yup
    .string()
    .required('Assignee is required')
    .min(2, 'Assignee must be at least 2 characters'),
});

export default function EditTaskModal({
  isOpen,
  onClose,
  onSubmit,
  task,
}: EditTaskModalProps) {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
    setValue,
  } = useForm<EditTaskFormData>({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  // Reset form when task changes
  useEffect(() => {
    if (task) {
      setValue('title', task.title);
      setValue('description', task.description);
      setValue('status', task.status);
      setValue('priority', task.priority);
      setValue('dueDate', task.dueDate);
      setValue('assignedTo', task.assignedTo);
    }
  }, [task, setValue]);

  const handleFormSubmit = async (data: EditTaskFormData) => {
    if (!isValid || !task) return;

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      onSubmit(task.id, data);
      onClose();
    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
                <Edit2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t('tasks.edit.title')}
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
              aria-label={t('actions.close')}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="px-6 py-5 space-y-6"
          >
            {/* Title */}
            <div>
              <label
                htmlFor="edit-title"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 text-left"
              >
                {t('tasks.fields.title')} *
              </label>
              <input
                {...register('title')}
                type="text"
                id="edit-title"
                className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                  errors.title
                    ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                }`}
                placeholder={t('tasks.edit.titlePlaceholder')}
              />
              {errors.title && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                  <span className="mr-1">⚠️</span>
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="edit-description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left"
              >
                {t('tasks.fields.description')} *
              </label>
              <textarea
                {...register('description')}
                id="edit-description"
                rows={3}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                  errors.description
                    ? 'border-red-300 dark:border-red-600'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder={t('tasks.edit.descriptionPlaceholder')}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Status and Priority Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Status */}
              <div>
                <label
                  htmlFor="edit-status"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left"
                >
                  {t('tasks.fields.status')} *
                </label>
                <select
                  {...register('status')}
                  id="edit-status"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    errors.status
                      ? 'border-red-300 dark:border-red-600'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <option value="pending">{t('tasks.status.pending')}</option>
                  <option value="in-progress">
                    {t('tasks.status.inProgress')}
                  </option>
                  <option value="completed">
                    {t('tasks.status.completed')}
                  </option>
                </select>
                {errors.status && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.status.message}
                  </p>
                )}
              </div>

              {/* Priority */}
              <div>
                <label
                  htmlFor="edit-priority"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left"
                >
                  {t('tasks.fields.priority')} *
                </label>
                <select
                  {...register('priority')}
                  id="edit-priority"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    errors.priority
                      ? 'border-red-300 dark:border-red-600'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <option value="low">{t('tasks.priority.low')}</option>
                  <option value="medium">{t('tasks.priority.medium')}</option>
                  <option value="high">{t('tasks.priority.high')}</option>
                </select>
                {errors.priority && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.priority.message}
                  </p>
                )}
              </div>
            </div>

            {/* Due Date and Assignee Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Due Date */}
              <div>
                <label
                  htmlFor="edit-dueDate"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left"
                >
                  {t('tasks.fields.due')} *
                </label>
                <input
                  {...register('dueDate')}
                  type="date"
                  id="edit-dueDate"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    errors.dueDate
                      ? 'border-red-300 dark:border-red-600'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                {errors.dueDate && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.dueDate.message}
                  </p>
                )}
              </div>

              {/* Assignee */}
              <div>
                <label
                  htmlFor="edit-assignedTo"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left"
                >
                  {t('tasks.fields.assignedTo')} *
                </label>
                <input
                  {...register('assignedTo')}
                  type="text"
                  id="edit-assignedTo"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                    errors.assignedTo
                      ? 'border-red-300 dark:border-red-600'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder={t('tasks.edit.assigneePlaceholder')}
                />
                {errors.assignedTo && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.assignedTo.message}
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 -mx-6 -mb-5 px-6 py-5 rounded-b-xl">
              <button
                type="button"
                onClick={handleClose}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-500 hover:border-gray-400 dark:hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-200"
              >
                {t('actions.cancel')}
              </button>
              <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 border border-transparent rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isSubmitting
                  ? t('tasks.edit.updating')
                  : t('tasks.edit.update')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
