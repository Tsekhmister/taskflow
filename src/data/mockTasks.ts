import type { Task } from '../types/task';

export function createMockTasks(t: (key: string) => string): Task[] {
  return [
    {
      id: '1',
      title: t('tasks.mock.updateWebsiteTitle'),
      description: t('tasks.mock.updateWebsiteDesc'),
      status: 'completed',
      priority: 'high',
      dueDate: 'Dec 15, 2024',
      assignedTo: 'John Doe',
    },
    {
      id: '2',
      title: t('tasks.mock.reviewFeedbackTitle'),
      description: t('tasks.mock.reviewFeedbackDesc'),
      status: 'in-progress',
      priority: 'medium',
      dueDate: 'Dec 20, 2024',
      assignedTo: 'Jane Smith',
    },
    {
      id: '3',
      title: t('tasks.mock.updateDocsTitle'),
      description: t('tasks.mock.updateDocsDesc'),
      status: 'pending',
      priority: 'low',
      dueDate: 'Dec 25, 2024',
      assignedTo: 'Mike Johnson',
    },
    {
      id: '4',
      title: t('tasks.mock.fixLoginBugTitle'),
      description: t('tasks.mock.fixLoginBugDesc'),
      status: 'pending',
      priority: 'high',
      dueDate: 'Dec 18, 2024',
      assignedTo: 'Sarah Wilson',
    },
    {
      id: '5',
      title: t('tasks.mock.optimizePerfTitle'),
      description: t('tasks.mock.optimizePerfDesc'),
      status: 'in-progress',
      priority: 'medium',
      dueDate: 'Dec 22, 2024',
      assignedTo: 'Alex Brown',
    },
  ];
}

export function calculateTaskStats(tasks: Task[]) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'completed').length;
  const pending = tasks.filter(t => t.status === 'pending').length;
  const inProgress = tasks.filter(t => t.status === 'in-progress').length;
  return { total, completed, pending, inProgress };
}
