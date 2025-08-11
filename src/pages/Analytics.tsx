import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectAllTasks } from '../store/selectors/tasksSelectors';
import { useState, useEffect } from 'react';
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Target,
  Zap,
} from 'lucide-react';

export default function Analytics() {
  const { t } = useTranslation();
  const tasks = useSelector(selectAllTasks);

  // Animation states
  const [animateMetrics, setAnimateMetrics] = useState(false);
  const [animateCharts, setAnimateCharts] = useState(false);

  // Trigger animations
  useEffect(() => {
    const timer1 = setTimeout(() => setAnimateMetrics(true), 300);
    const timer2 = setTimeout(() => setAnimateCharts(true), 600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  // Calculate additional metrics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
  const pendingTasks = tasks.filter(t => t.status === 'pending').length;

  const highPriorityTasks = tasks.filter(t => t.priority === 'high').length;
  const mediumPriorityTasks = tasks.filter(t => t.priority === 'medium').length;
  const lowPriorityTasks = tasks.filter(t => t.priority === 'low').length;

  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const overdueTasks = tasks.filter(
    t => new Date(t.dueDate) < new Date()
  ).length;

  // Status distribution for pie chart
  const statusData = [
    {
      name: 'Completed',
      value: completedTasks,
      color: 'bg-green-500',
      textColor: 'text-green-600',
    },
    {
      name: 'In Progress',
      value: inProgressTasks,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
    },
    {
      name: 'Pending',
      value: pendingTasks,
      color: 'bg-gray-500',
      textColor: 'text-gray-600',
    },
  ];

  // Priority distribution for bar chart
  const priorityData = [
    {
      name: 'High',
      value: highPriorityTasks,
      color: 'bg-red-500',
      height: 'h-32',
    },
    {
      name: 'Medium',
      value: mediumPriorityTasks,
      color: 'bg-orange-500',
      height: 'h-24',
    },
    {
      name: 'Low',
      value: lowPriorityTasks,
      color: 'bg-green-500',
      height: 'h-16',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          {t('analytics.title', 'Task Analytics')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base lg:text-lg">
          {t(
            'analytics.subtitle',
            'Track your team performance and task insights'
          )}
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Tasks */}
        <div
          className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 transition-all duration-700 transform ${
            animateMetrics
              ? 'translate-y-0 opacity-100'
              : 'translate-y-8 opacity-0'
          }`}
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
                <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="ml-4 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  {t('analytics.metrics.totalTasks', 'Total Tasks')}
                </dt>
                <dd className="text-2xl font-bold text-gray-900 dark:text-white">
                  {animateMetrics ? totalTasks : 0}
                </dd>
                <dd className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                  {t('analytics.metrics.active', 'Active')}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        {/* Completed Tasks */}
        <div
          className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 transition-all duration-700 delay-100 transform ${
            animateMetrics
              ? 'translate-y-0 opacity-100'
              : 'translate-y-8 opacity-0'
          }`}
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="ml-4 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  {t('analytics.metrics.completed', 'Completed')}
                </dt>
                <dd className="text-2xl font-bold text-gray-900 dark:text-white">
                  {animateMetrics ? completedTasks : 0}
                </dd>
                <dd className="text-sm text-green-600 dark:text-green-400 font-medium">
                  {completionRate}%{' '}
                  {t('analytics.metrics.completionRate', 'completion')}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        {/* In Progress Tasks */}
        <div
          className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 transition-all duration-700 delay-200 transform ${
            animateMetrics
              ? 'translate-y-0 opacity-100'
              : 'translate-y-8 opacity-0'
          }`}
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
            <div className="ml-4 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  {t('analytics.metrics.inProgress', 'In Progress')}
                </dt>
                <dd className="text-2xl font-bold text-gray-900 dark:text-white">
                  {animateMetrics ? inProgressTasks : 0}
                </dd>
                <dd className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">
                  {t('analytics.metrics.working', 'Working')}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        {/* Overdue Tasks */}
        <div
          className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 transition-all duration-700 delay-300 transform ${
            animateMetrics
              ? 'translate-y-0 opacity-100'
              : 'translate-y-8 opacity-0'
          }`}
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <div className="ml-4 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  {t('analytics.metrics.overdue', 'Overdue')}
                </dt>
                <dd className="text-2xl font-bold text-gray-900 dark:text-white">
                  {animateMetrics ? overdueTasks : 0}
                </dd>
                <dd className="text-sm text-red-600 dark:text-red-400 font-medium">
                  {t('analytics.metrics.attention', 'Needs attention')}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution Pie Chart */}
        <div
          className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-700 transform ${
            animateCharts
              ? 'translate-y-0 opacity-100'
              : 'translate-y-8 opacity-0'
          }`}
        >
          <div className="px-6 py-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
              {t('analytics.charts.statusDistribution', 'Status Distribution')}
            </h3>

            {/* Simple Pie Chart */}
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-48 h-48">
                {/* Pie Chart using CSS */}
                <div className="absolute inset-0 rounded-full border-8 border-gray-200"></div>

                {statusData.map((item, index) => {
                  if (item.value === 0) return null;

                  const percentage = (item.value / totalTasks) * 100;
                  const rotation = statusData
                    .slice(0, index)
                    .reduce(
                      (acc, prev) => acc + (prev.value / totalTasks) * 360,
                      0
                    );

                  return (
                    <div
                      key={item.name}
                      className="absolute inset-0 rounded-full border-8 border-transparent"
                      style={{
                        borderTopColor: item.color.replace('bg-', ''),
                        borderRightColor: item.color.replace('bg-', ''),
                        transform: `rotate(${rotation}deg)`,
                        clipPath: `polygon(50% 50%, 50% 0%, ${50 + Math.cos((percentage * Math.PI) / 180) * 50}% ${50 + Math.sin((percentage * Math.PI) / 180) * 50}%)`,
                      }}
                    />
                  );
                })}

                {/* Center text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {totalTasks}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {t('analytics.charts.total', 'Total')}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-3">
              {statusData.map(item => (
                <div
                  key={item.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <div
                      className={`w-4 h-4 rounded-full ${item.color} mr-3`}
                    ></div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {item.name}
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    {item.value} ({Math.round((item.value / totalTasks) * 100)}
                    %)
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Priority Distribution Bar Chart */}
        <div
          className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-700 delay-200 transform ${
            animateCharts
              ? 'translate-y-0 opacity-100'
              : 'translate-y-8 opacity-0'
          }`}
        >
          <div className="px-6 py-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <Zap className="w-5 h-5 text-orange-600 dark:text-orange-400 mr-2" />
              {t(
                'analytics.charts.priorityDistribution',
                'Priority Distribution'
              )}
            </h3>

            {/* Bar Chart */}
            <div className="flex items-end justify-center space-x-8 h-48 mb-6">
              {priorityData.map(item => (
                <div key={item.name} className="flex flex-col items-center">
                  <div
                    className={`w-16 ${item.color} rounded-t-lg transition-all duration-1000 ease-out ${
                      animateCharts ? item.height : 'h-0'
                    }`}
                  ></div>
                  <div className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    {item.name}
                  </div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Priority Insights */}
            <div className="space-y-2">
              {highPriorityTasks > 0 && (
                <div className="flex items-center text-sm text-red-600">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  {highPriorityTasks}{' '}
                  {t(
                    'analytics.insights.highPriority',
                    'high priority tasks need attention'
                  )}
                </div>
              )}
              {completionRate > 80 && (
                <div className="flex items-center text-sm text-green-600">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {t(
                    'analytics.insights.greatProgress',
                    'Great progress! Keep it up!'
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div
        className={`bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 transition-all duration-700 delay-300 transform ${
          animateCharts
            ? 'translate-y-0 opacity-100'
            : 'translate-y-8 opacity-0'
        }`}
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
          {t('analytics.quickStats.title', 'Quick Insights')}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {completionRate}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {t('analytics.quickStats.completionRate', 'Completion Rate')}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {pendingTasks}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {t('analytics.quickStats.pending', 'Pending Tasks')}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {mediumPriorityTasks + highPriorityTasks}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {t('analytics.quickStats.important', 'Important Tasks')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
