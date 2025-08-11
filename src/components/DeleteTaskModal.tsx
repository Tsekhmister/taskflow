import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Trash2, AlertTriangle } from 'lucide-react';
import type { Task } from '../types/task';

interface DeleteTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (taskId: string) => void;
  task: Task | null;
}

export default function DeleteTaskModal({
  isOpen,
  onClose,
  onConfirm,
  task,
}: DeleteTaskModalProps) {
  const { t } = useTranslation();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    if (!task) return;

    setIsDeleting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      onConfirm(task.id);
      onClose();
    } catch (error) {
      console.error('Error deleting task:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-xl shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-xl flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t('tasks.delete.title')}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
              aria-label={t('actions.close')}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-5">
            {/* Primary Warning */}
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 leading-tight">
                {t('tasks.delete.confirmation')}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {t('tasks.delete.description')}
              </p>
            </div>

            {/* Task Info */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-5 mb-6 border border-gray-100 dark:border-gray-600 text-center">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-base">
                {task.title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                {task.description}
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center justify-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">
                    {t('tasks.fields.status')}:
                  </span>
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-md text-xs font-medium">
                    {t(
                      `tasks.status.${task.status === 'in-progress' ? 'inProgress' : task.status}`
                    )}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-md text-xs font-medium">
                    {t(`tasks.priority.${task.priority}`)}
                  </span>
                </div>
              </div>
            </div>

            {/* Secondary Warning */}
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-5 mb-6 text-center">
              <div className="flex justify-center items-center space-x-3">
                <div className="flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-red-500 dark:text-red-400" />
                </div>
                <p className="text-sm font-medium text-red-800 dark:text-red-200 leading-relaxed">
                  {t('tasks.delete.warning')}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 px-6 py-5 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 rounded-b-xl">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-500 hover:border-gray-400 dark:hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-200"
            >
              {t('actions.cancel')}
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isDeleting}
              className="px-5 py-2.5 text-sm font-medium text-white bg-red-600 dark:bg-red-500 border border-transparent rounded-lg hover:bg-red-700 dark:hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isDeleting ? t('actions.deleting') : t('actions.delete')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
