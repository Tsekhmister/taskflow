import { NavLink, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import LanguageSwitcher from '../LanguageSwitcher';
import ThemeToggle from '../ThemeToggle';

export default function MainLayout() {
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header
        className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700"
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white header-logo">
                TaskFlow Dashboard
              </h1>
            </div>

            {/* Desktop Navigation */}
            <nav
              className="hidden md:flex items-center space-x-8"
              role="navigation"
              aria-label="Main navigation"
            >
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors border-2 ${
                    isActive
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-600'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                  }`
                }
                aria-label="Go to dashboard"
              >
                {t('dashboard.navigation.dashboard')}
              </NavLink>
              <NavLink
                to="/tasks"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors border-2 ${
                    isActive
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-600'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                  }`
                }
                aria-label="Manage tasks"
              >
                {t('dashboard.navigation.tasks')}
              </NavLink>
              <NavLink
                to="/analytics"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors border-2 ${
                    isActive
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-600'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                  }`
                }
                aria-label="View analytics"
              >
                {t('dashboard.navigation.analytics')}
              </NavLink>
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors border-2 ${
                    isActive
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-600'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                  }`
                }
                aria-label="Configure settings"
              >
                {t('dashboard.navigation.settings')}
              </NavLink>
            </nav>

            {/* Language Switcher - Desktop */}
            <div
              className="hidden md:flex items-center space-x-4"
              role="toolbar"
              aria-label="User preferences"
            >
              <ThemeToggle />
              <LanguageSwitcher />
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-4">
              <ThemeToggle />
              <LanguageSwitcher />
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                aria-label="Toggle mobile menu"
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav
            className="md:hidden"
            role="navigation"
            aria-label="Mobile navigation"
            id="mobile-menu"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium border-2 ${
                    isActive
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-600'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                  }`
                }
                onClick={closeMobileMenu}
                aria-label="Go to dashboard"
              >
                {t('dashboard.navigation.dashboard')}
              </NavLink>
              <NavLink
                to="/tasks"
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium border-2 ${
                    isActive
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-600'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                  }`
                }
                onClick={closeMobileMenu}
                aria-label="Manage tasks"
              >
                {t('dashboard.navigation.tasks')}
              </NavLink>
              <NavLink
                to="/analytics"
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium border-2 ${
                    isActive
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-600'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                  }`
                }
                onClick={closeMobileMenu}
                aria-label="View analytics"
              >
                {t('dashboard.navigation.analytics')}
              </NavLink>
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium border-2 ${
                    isActive
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-600'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                  }`
                }
                onClick={closeMobileMenu}
                aria-label="Configure settings"
              >
                {t('dashboard.navigation.settings')}
              </NavLink>
            </div>
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1" role="main">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
