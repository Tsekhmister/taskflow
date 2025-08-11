import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import {
  Bell,
  Download,
  Trash2,
  Save,
  CheckCircle,
  AlertTriangle,
  Settings as SettingsIcon,
  Database,
  Clock,
  Filter,
} from 'lucide-react';
import { selectAllTasks } from '../store/selectors/tasksSelectors';
import {
  clearAllTasks,
  initializeWithMockData,
} from '../store/slices/tasksSlice';
import { createMockTasks } from '../data/mockTasks';
import { useTheme } from '../contexts/useTheme';
import ToggleSwitch from '../components/ToggleSwitch';
import type { AppDispatch } from '../store';

interface SettingsState {
  activeTab: string;
  isSaving: boolean;
  showSuccess: boolean;
  showResetConfirm: boolean;
}

export default function Settings() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const tasks = useSelector(selectAllTasks);
  const { theme, setTheme } = useTheme();
  const navRef = useRef<HTMLElement>(null);

  const [settings, setSettings] = useState({
    // Task Management
    autoArchiveCompleted: true,
    deadlineNotifications: true,
    defaultStatusFilter: 'all',
    defaultPriorityFilter: 'all',

    // App Settings
    fontSize: 'medium',
    density: 'comfortable',

    // Notifications
    emailNotifications: true,
    pushNotifications: false,
    taskReminders: true,

    // Data Management
    backupFrequency: 'daily',
    exportFormat: 'json',
  });

  const [state, setState] = useState<SettingsState>({
    activeTab: 'tasks',
    isSaving: false,
    showSuccess: false,
    showResetConfirm: false,
  });

  // Change language
  const changeLanguage = (lang: 'en' | 'uk') => {
    i18n.changeLanguage(lang);
  };

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('taskflow-settings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);

        // Apply settings immediately after loading
        document.documentElement.classList.remove(
          'font-size-small',
          'font-size-medium',
          'font-size-large'
        );
        document.documentElement.classList.add(
          `font-size-${parsedSettings.fontSize}`
        );

        document.documentElement.classList.remove(
          'density-compact',
          'density-comfortable',
          'density-spacious'
        );
        document.documentElement.classList.add(
          `density-${parsedSettings.density}`
        );
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, []);

  // Apply font size to html
  useEffect(() => {
    // Remove existing font size classes
    document.documentElement.classList.remove(
      'font-size-small',
      'font-size-medium',
      'font-size-large'
    );
    // Add current font size class
    document.documentElement.classList.add(`font-size-${settings.fontSize}`);
  }, [settings.fontSize]);

  // Apply interface density to html
  useEffect(() => {
    // Remove existing density classes
    document.documentElement.classList.remove(
      'density-compact',
      'density-comfortable',
      'density-spacious'
    );
    // Add current density class
    document.documentElement.classList.add(`density-${settings.density}`);
  }, [settings.density]);

  // Save settings to localStorage
  const saveSettings = async () => {
    setState(prev => ({ ...prev, isSaving: true }));

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      localStorage.setItem('taskflow-settings', JSON.stringify(settings));

      // Apply settings immediately after saving
      document.documentElement.classList.remove(
        'font-size-small',
        'font-size-medium',
        'font-size-large'
      );
      document.documentElement.classList.add(`font-size-${settings.fontSize}`);

      document.documentElement.classList.remove(
        'density-compact',
        'density-comfortable',
        'density-spacious'
      );
      document.documentElement.classList.add(`density-${settings.density}`);

      setState(prev => ({ ...prev, showSuccess: true, isSaving: false }));
      setTimeout(
        () => setState(prev => ({ ...prev, showSuccess: false })),
        3000
      );
    } catch (error) {
      console.error('Error saving settings:', error);
      setState(prev => ({ ...prev, isSaving: false }));
    }
  };

  // Export tasks
  const exportTasks = () => {
    const dataStr = JSON.stringify(tasks, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `taskflow-tasks-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Reset to mock data
  const resetToMockData = () => {
    dispatch(clearAllTasks());
    const mockTasks = createMockTasks(t);
    dispatch(initializeWithMockData(mockTasks));
    setState(prev => ({ ...prev, showResetConfirm: false }));
  };

  // Touch gesture handlers for JSX
  const handleTouchStart = (e: React.TouchEvent) => {
    const startX = e.touches[0].clientX;
    const nav = navRef.current;
    if (nav) {
      nav.dataset.startX = startX.toString();
      nav.classList.add('nav-swipe-active');
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const nav = navRef.current;
    if (!nav || !nav.dataset.startX) return;

    const startX = parseInt(nav.dataset.startX);
    const currentX = e.touches[0].clientX;
    const diff = startX - currentX;

    if (Math.abs(diff) > 30) {
      if (diff > 0) {
        nav.classList.add('nav-swipe-left');
        nav.classList.remove('nav-swipe-right');
      } else {
        nav.classList.add('nav-swipe-right');
        nav.classList.remove('nav-swipe-left');
      }
    }
  };

  const handleTouchEnd = () => {
    const nav = navRef.current;
    if (!nav) return;

    const startX = nav.dataset.startX;
    if (startX) {
      const diff = parseInt(startX) - (nav.scrollLeft + nav.offsetWidth / 2);

      if (Math.abs(diff) > 50) {
        const currentIndex = tabs.findIndex(tab => tab.id === state.activeTab);
        let newIndex = currentIndex;

        if (diff > 0 && currentIndex < tabs.length - 1) {
          // Swipe left - next tab
          newIndex = currentIndex + 1;
        } else if (diff < 0 && currentIndex > 0) {
          // Swipe right - previous tab
          newIndex = currentIndex - 1;
        }

        if (newIndex !== currentIndex) {
          setState(prev => ({ ...prev, activeTab: tabs[newIndex].id }));
        }
      }

      delete nav.dataset.startX;
    }

    nav.classList.remove(
      'nav-swipe-active',
      'nav-swipe-left',
      'nav-swipe-right'
    );
  };

  // Keyboard navigation handler for JSX
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const currentIndex = tabs.findIndex(tab => tab.id === state.activeTab);
    let newIndex = currentIndex;

    if (e.key === 'ArrowLeft' && currentIndex > 0) {
      newIndex = currentIndex - 1;
    } else if (e.key === 'ArrowRight' && currentIndex < tabs.length - 1) {
      newIndex = currentIndex + 1;
    } else if (e.key === 'Home') {
      newIndex = 0;
    } else if (e.key === 'End') {
      newIndex = tabs.length - 1;
    }

    if (newIndex !== currentIndex) {
      e.preventDefault();
      setState(prev => ({ ...prev, activeTab: tabs[newIndex].id }));

      // Scroll to the new tab
      const nav = navRef.current;
      if (nav) {
        const tabElement = nav.children[newIndex] as HTMLElement;
        if (tabElement) {
          tabElement.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center',
          });
        }
      }
    }
  };

  const tabs = [
    {
      id: 'tasks',
      label: t('settings.tabs.tasks', 'Task Management'),
      icon: Filter,
    },
    {
      id: 'app',
      label: t('settings.tabs.app', 'App Settings'),
      icon: SettingsIcon,
    },
    {
      id: 'notifications',
      label: t('settings.tabs.notifications', 'Notifications'),
      icon: Bell,
    },
    {
      id: 'data',
      label: t('settings.tabs.data', 'Data & Export'),
      icon: Database,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          {t('settings.title', 'Settings')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base lg:text-lg">
          {t(
            'settings.subtitle',
            'Customize your TaskFlow experience and manage preferences'
          )}
        </p>
      </div>

      {/* Success Message */}
      {state.showSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center space-x-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-green-800 font-medium">
            {t('settings.saved', 'Settings saved successfully!')}
          </span>
        </div>
      )}

      {/* Settings Tabs */}
      <div className="bg-white dark:bg-gray-800 dark:shadow-2xl dark:shadow-gray-900/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700 relative">
          {/* Tab Navigation */}
          <nav
            ref={navRef}
            className="flex space-x-4 sm:space-x-6 lg:space-x-8 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 overflow-x-auto nav-scrollable border-b border-gray-200 dark:border-gray-700 settings-tabs"
            role="tablist"
            aria-label={t('settings.tabNavigation', 'Settings navigation tabs')}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onKeyDown={handleKeyDown}
            tabIndex={0} // Ensure focus is on the nav for keyboard navigation
          >
            {tabs.map(tab => {
              const Icon = tab.icon;

              // Smart text shortening for different screen sizes
              const getTabText = (label: string) => {
                if (label === 'Task Management')
                  return { full: label, short: 'Tasks' };
                if (label === 'App Settings')
                  return { full: label, short: 'Settings' };
                if (label === 'Notifications')
                  return { full: label, short: 'Notify' };
                if (label === 'Data & Export')
                  return { full: label, short: 'Data' };
                return { full: label, short: label.split(' ')[0] };
              };

              const tabText = getTabText(tab.label);

              return (
                <button
                  key={tab.id}
                  id={`${tab.id}-tab`}
                  onClick={() =>
                    setState(prev => ({ ...prev, activeTab: tab.id }))
                  }
                  className={`tab-button flex items-center space-x-2 px-2 sm:px-1 py-3 sm:py-4 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 ${
                    state.activeTab === tab.id
                      ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                  } ${
                    navRef.current?.classList.contains('nav-swipe-left')
                      ? 'nav-swipe-left'
                      : navRef.current?.classList.contains('nav-swipe-right')
                        ? 'nav-swipe-right'
                        : ''
                  }`}
                  role="tab"
                  aria-selected={state.activeTab === tab.id}
                  aria-controls={`${tab.id}-panel`}
                  tabIndex={state.activeTab === tab.id ? 0 : -1}
                >
                  <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">{tabText.full}</span>
                  <span className="xs:hidden">{tabText.short}</span>
                </button>
              );
            })}
          </nav>
          {/* Scroll indicator for mobile */}
          <div className="xs:hidden flex justify-center py-1">
            <div className="w-8 h-1 bg-gray-300 dark:bg-gray-600 rounded-full opacity-50"></div>
          </div>

          {/* Active tab indicator for mobile */}
          <div className="xs:hidden flex justify-center py-1">
            <div className="flex space-x-2">
              {tabs.map(tab => (
                <div
                  key={tab.id}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    state.activeTab === tab.id
                      ? 'bg-blue-500 dark:bg-blue-400'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Scroll hint for very small screens */}
          <div className="max-xs:block xs:hidden text-center py-2">
            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center space-x-1">
              <span>←</span>
              <span>Свайп для прокрутки</span>
              <span>→</span>
            </div>
          </div>

          {/* Right scroll indicator for mobile */}
          <div className="xs:hidden absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white dark:from-gray-800 to-transparent pointer-events-none flex items-center justify-center">
            <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full opacity-60"></div>
          </div>
        </div>

        <div className="px-3 sm:px-4 lg:px-6 py-4 sm:py-6 settings-tab-content">
          {/* Task Management Tab */}
          {state.activeTab === 'tasks' && (
            <div
              id="tasks-panel"
              role="tabpanel"
              aria-labelledby="tasks-tab"
              className="block"
            >
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <Filter className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {t('settings.tasks.title', 'Task Management Settings')}
                  </h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Auto-archive completed tasks */}
                  <div className="bg-gray-50 dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-900/50 dark:border dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          {t(
                            'settings.tasks.autoArchive',
                            'Auto-archive completed tasks'
                          )}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {t(
                            'settings.tasks.autoArchiveDesc',
                            'Automatically move completed tasks to archive after 30 days'
                          )}
                        </p>
                      </div>
                      <ToggleSwitch
                        checked={settings.autoArchiveCompleted}
                        onChange={checked =>
                          setSettings(prev => ({
                            ...prev,
                            autoArchiveCompleted: checked,
                          }))
                        }
                      />
                    </div>
                  </div>

                  {/* Deadline notifications */}
                  <div className="bg-gray-50 dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-900/50 dark:border dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          {t(
                            'settings.tasks.deadlineNotifications',
                            'Deadline notifications'
                          )}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {t(
                            'settings.tasks.deadlineNotificationsDesc',
                            'Get notified when tasks are approaching deadline'
                          )}
                        </p>
                      </div>
                      <ToggleSwitch
                        checked={settings.deadlineNotifications}
                        onChange={checked =>
                          setSettings(prev => ({
                            ...prev,
                            deadlineNotifications: checked,
                          }))
                        }
                      />
                    </div>
                  </div>

                  {/* Default filters */}
                  <div className="bg-gray-50 dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-900/50 dark:border dark:border-gray-700 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                      {t('settings.tasks.defaultFilters', 'Default filters')}
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                          {t(
                            'settings.tasks.defaultStatus',
                            'Default status filter'
                          )}
                        </label>
                        <select
                          value={settings.defaultStatusFilter}
                          onChange={e =>
                            setSettings(prev => ({
                              ...prev,
                              defaultStatusFilter: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="all">
                            {t('tasks.filters.allStatus', 'All Status')}
                          </option>
                          <option value="pending">
                            {t('tasks.status.pending', 'Pending')}
                          </option>
                          <option value="in-progress">
                            {t('tasks.status.inProgress', 'In Progress')}
                          </option>
                          <option value="completed">
                            {t('tasks.status.completed', 'Completed')}
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Task statistics */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 dark:shadow-lg dark:shadow-blue-900/30 dark:border dark:border-blue-800/50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-3">
                      {t('settings.tasks.statistics', 'Task Statistics')}
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-blue-700 dark:text-blue-300">
                          {t('settings.tasks.totalTasks', 'Total tasks')}:
                        </span>
                        <span className="font-medium text-blue-900 dark:text-blue-200">
                          {tasks.length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700 dark:text-blue-300">
                          {t('settings.tasks.completedTasks', 'Completed')}:
                        </span>
                        <span className="font-medium text-blue-900 dark:text-blue-200">
                          {tasks.filter(t => t.status === 'completed').length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700 dark:text-blue-300">
                          {t('settings.tasks.pendingTasks', 'Pending')}:
                        </span>
                        <span className="font-medium text-blue-900 dark:text-blue-200">
                          {tasks.filter(t => t.status === 'pending').length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* App Settings Tab */}
          {state.activeTab === 'app' && (
            <div
              id="app-panel"
              role="tabpanel"
              aria-labelledby="app-tab"
              className="block"
            >
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <SettingsIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {t('settings.app.title', 'Application Settings')}
                  </h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Language Settings */}
                  <div className="bg-gray-50 dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-900/50 dark:border dark:border-gray-700 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                      {t('settings.app.language', 'Language')}
                    </h4>
                    <div className="space-y-2">
                      <button
                        onClick={() => changeLanguage('en')}
                        className={`w-full px-3 py-2 text-sm rounded-md transition-colors ${
                          i18n.language?.startsWith('en')
                            ? 'bg-blue-600 text-white'
                            : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-300 dark:border-white'
                        }`}
                      >
                        🇺🇸 English
                      </button>
                      <button
                        onClick={() => changeLanguage('uk')}
                        className={`w-full px-3 py-2 text-sm rounded-md transition-colors ${
                          i18n.language?.startsWith('uk')
                            ? 'bg-blue-600 text-white'
                            : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-300 dark:border-white'
                        }`}
                      >
                        🇺🇦 Українська
                      </button>
                    </div>
                  </div>

                  {/* Theme Settings */}
                  <div className="bg-gray-50 dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-900/50 dark:border dark:border-gray-700 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                      {t('settings.app.theme', 'Theme')}
                    </h4>
                    <div className="space-y-2">
                      <button
                        onClick={() => setTheme('light')}
                        className={`w-full px-3 py-2 text-sm rounded-md transition-colors ${
                          theme === 'light'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-300 dark:border-white'
                        }`}
                      >
                        ☀️ {t('settings.app.lightTheme', 'Light Theme')}
                      </button>
                      <button
                        onClick={() => setTheme('dark')}
                        className={`w-full px-3 py-2 text-sm rounded-md transition-colors ${
                          theme === 'dark'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-300 dark:border-white'
                        }`}
                      >
                        🌙 {t('settings.app.darkTheme', 'Dark Theme')}
                      </button>
                    </div>
                  </div>

                  {/* Font Size */}
                  <div className="bg-gray-50 dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-900/50 dark:border dark:border-gray-700 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                      {t('settings.app.fontSize', 'Font Size')}
                    </h4>
                    <div className="space-y-2">
                      {['small', 'medium', 'large'].map(size => (
                        <button
                          key={size}
                          onClick={() => {
                            setSettings(prev => ({ ...prev, fontSize: size }));
                            // Apply immediately
                            document.documentElement.classList.remove(
                              'font-size-small',
                              'font-size-medium',
                              'font-size-large'
                            );
                            document.documentElement.classList.add(
                              `font-size-${size}`
                            );
                          }}
                          className={`w-full px-3 py-2 text-sm rounded-md transition-colors ${
                            settings.fontSize === size
                              ? 'bg-blue-600 text-white'
                              : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-300 dark:border-white'
                          }`}
                        >
                          {size === 'small' && '🔤'}
                          {size === 'medium' && '🔤🔤'}
                          {size === 'large' && '🔤🔤🔤'}
                          {t(
                            `settings.app.${size}`,
                            size.charAt(0).toUpperCase() + size.slice(1)
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Interface Density */}
                  <div className="bg-gray-50 dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-900/50 dark:border dark:border-gray-700 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                      {t('settings.app.density', 'Interface Density')}
                    </h4>
                    <div className="space-y-2">
                      {['compact', 'comfortable', 'spacious'].map(density => (
                        <button
                          key={density}
                          onClick={() => {
                            setSettings(prev => ({ ...prev, density }));
                            // Apply immediately
                            document.documentElement.classList.remove(
                              'density-compact',
                              'density-comfortable',
                              'density-spacious'
                            );
                            document.documentElement.classList.add(
                              `density-${density}`
                            );
                          }}
                          className={`w-full px-3 py-2 text-sm rounded-md transition-colors ${
                            settings.density === density
                              ? 'bg-blue-600 text-white'
                              : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-300 dark:border-white'
                          }`}
                        >
                          {density === 'compact' && '📱'}
                          {density === 'comfortable' && '💻'}
                          {density === 'spacious' && '🖥️'}
                          {t(
                            `settings.app.${density}`,
                            density.charAt(0).toUpperCase() + density.slice(1)
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {state.activeTab === 'notifications' && (
            <div
              id="notifications-panel"
              role="tabpanel"
              aria-labelledby="notifications-tab"
              className="block"
            >
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <Bell className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {t(
                      'settings.notifications.title',
                      'Notification Preferences'
                    )}
                  </h3>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      key: 'emailNotifications',
                      label: t(
                        'settings.notifications.email',
                        'Email notifications'
                      ),
                      desc: t(
                        'settings.notifications.emailDesc',
                        'Receive important updates via email'
                      ),
                    },
                    {
                      key: 'pushNotifications',
                      label: t(
                        'settings.notifications.push',
                        'Push notifications'
                      ),
                      desc: t(
                        'settings.notifications.pushDesc',
                        'Get browser push notifications'
                      ),
                    },
                    {
                      key: 'taskReminders',
                      label: t(
                        'settings.notifications.taskReminders',
                        'Task reminders'
                      ),
                      desc: t(
                        'settings.notifications.taskRemindersDesc',
                        'Daily reminders for pending tasks'
                      ),
                    },
                  ].map(({ key, label, desc }) => (
                    <div
                      key={key}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-900/50 dark:border dark:border-gray-700 rounded-lg"
                    >
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          {label}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {desc}
                        </p>
                      </div>
                      <ToggleSwitch
                        checked={
                          settings[key as keyof typeof settings] as boolean
                        }
                        onChange={checked =>
                          setSettings(prev => ({ ...prev, [key]: checked }))
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Data & Export Tab */}
          {state.activeTab === 'data' && (
            <div
              id="data-panel"
              role="tabpanel"
              aria-labelledby="data-tab"
              className="block"
            >
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <Database className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {t('settings.data.title', 'Data Management & Export')}
                  </h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Export Tasks */}
                  <div className="bg-gray-50 dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-900/50 dark:border dark:border-gray-700 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                      {t('settings.data.export', 'Export Tasks')}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      {t(
                        'settings.data.exportDesc',
                        'Download your tasks in various formats'
                      )}
                    </p>
                    <div className="space-y-2">
                      <button
                        onClick={exportTasks}
                        className="w-full px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white text-sm rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
                      >
                        <Download className="w-4 h-4" />
                        <span>
                          {t('settings.data.exportJSON', 'Export as JSON')}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Data Management */}
                  <div className="bg-gray-50 dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-900/50 dark:border dark:border-gray-700 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                      {t('settings.data.management', 'Data Management')}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      {t(
                        'settings.data.managementDesc',
                        'Manage your data and reset to defaults'
                      )}
                    </p>
                    <div className="space-y-2">
                      <button
                        onClick={() =>
                          setState(prev => ({
                            ...prev,
                            showResetConfirm: true,
                          }))
                        }
                        className="w-full px-4 py-2 bg-red-600 dark:bg-red-500 text-white text-sm rounded-md hover:bg-red-700 dark:hover:bg-red-600 transition-colors flex items-center justify-center space-x-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>
                          {t('settings.data.resetToMock', 'Reset to Mock Data')}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Backup Settings */}
                  <div className="bg-gray-50 dark:bg-gray-800 dark:shadow-lg dark:shadow-gray-900/50 dark:border dark:border-gray-700 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                      {t('settings.data.backup', 'Backup Settings')}
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                          {t(
                            'settings.data.backupFrequency',
                            'Backup frequency'
                          )}
                        </label>
                        <select
                          value={settings.backupFrequency}
                          onChange={e =>
                            setSettings(prev => ({
                              ...prev,
                              backupFrequency: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="daily">
                            {t('settings.data.daily', 'Daily')}
                          </option>
                          <option value="weekly">
                            {t('settings.data.weekly', 'Weekly')}
                          </option>
                          <option value="monthly">
                            {t('settings.data.monthly', 'Monthly')}
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Storage Info */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 dark:shadow-lg dark:shadow-blue-900/30 dark:border dark:border-blue-800/50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-3">
                      {t('settings.data.storage', 'Storage Information')}
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-blue-700 dark:text-blue-300">
                          {t('settings.data.totalTasks', 'Total tasks')}:
                        </span>
                        <span className="font-medium text-blue-900 dark:text-blue-200">
                          {tasks.length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700 dark:text-blue-300">
                          {t('settings.data.storageUsed', 'Storage used')}:
                        </span>
                        <span className="font-medium text-blue-900 dark:text-blue-200">
                          {Math.round(JSON.stringify(tasks).length / 1024)} KB
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={saveSettings}
          disabled={state.isSaving}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {state.isSaving ? (
            <>
              <Clock className="w-4 h-4 animate-spin" />
              <span>{t('settings.saving', 'Saving...')}</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>{t('settings.save', 'Save Settings')}</span>
            </>
          )}
        </button>
      </div>

      {/* Reset Confirmation Modal */}
      {state.showResetConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
            <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6">
              <div className="flex items-center space-x-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t('settings.reset.title', 'Reset to Mock Data')}
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {t(
                  'settings.reset.message',
                  'This will clear all your current tasks and replace them with mock data. This action cannot be undone.'
                )}
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() =>
                    setState(prev => ({ ...prev, showResetConfirm: false }))
                  }
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  {t('settings.reset.cancel', 'Cancel')}
                </button>
                <button
                  onClick={resetToMockData}
                  className="flex-1 px-4 py-2 bg-red-600 dark:bg-red-500 text-white rounded-md hover:bg-red-700 dark:hover:bg-red-600 transition-colors"
                >
                  {t('settings.reset.confirm', 'Reset Data')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
