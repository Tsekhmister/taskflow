import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: 'en' | 'uk') => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex gap-1">
      <button
        onClick={() => changeLanguage('en')}
        className={`px-2 py-1 rounded text-xs font-medium transition-all duration-200 border-2 ${
          i18n.language?.startsWith('en')
            ? 'bg-blue-500 text-white shadow-sm border-blue-400'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 hover:text-gray-800 dark:hover:text-gray-200 border-transparent hover:border-gray-400 dark:hover:border-gray-500'
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>
      <button
        onClick={() => changeLanguage('uk')}
        className={`px-2 py-1 rounded text-xs font-medium transition-all duration-200 border-2 ${
          i18n.language?.startsWith('uk')
            ? 'bg-blue-500 text-white shadow-sm border-blue-400'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 hover:text-gray-800 dark:hover:text-gray-200 border-transparent hover:border-gray-400 dark:hover:border-gray-500'
        }`}
        aria-label="Switch to Ukrainian"
      >
        UK
      </button>
    </div>
  );
}
