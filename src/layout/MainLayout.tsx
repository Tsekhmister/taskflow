import { NavLink, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';

export default function MainLayout() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow p-4 flex items-center justify-between">
        <nav className="flex gap-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? 'text-blue-600 font-semibold' : 'text-gray-700'
            }
          >
            {t('dashboard.navigation.dashboard')}
          </NavLink>
          <NavLink
            to="/tasks"
            className={({ isActive }) =>
              isActive ? 'text-blue-600 font-semibold' : 'text-gray-700'
            }
          >
            {t('dashboard.navigation.tasks')}
          </NavLink>
          <NavLink
            to="/analytics"
            className={({ isActive }) =>
              isActive ? 'text-blue-600 font-semibold' : 'text-gray-700'
            }
          >
            {t('dashboard.navigation.analytics')}
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              isActive ? 'text-blue-600 font-semibold' : 'text-gray-700'
            }
          >
            {t('dashboard.navigation.settings')}
          </NavLink>
        </nav>
        <LanguageSwitcher />
      </header>
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}
