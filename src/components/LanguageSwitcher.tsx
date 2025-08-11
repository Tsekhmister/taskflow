import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: 'en' | 'uk') => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex gap-1 sm:gap-2">
      <button
        onClick={() => changeLanguage('en')}
        className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded text-xs sm:text-sm font-medium transition-all duration-200 ${
          i18n.language?.startsWith('en')
            ? 'bg-blue-500 text-white shadow-sm'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-800'
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>
      <button
        onClick={() => changeLanguage('uk')}
        className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded text-xs sm:text-sm font-medium transition-all duration-200 ${
          i18n.language?.startsWith('uk')
            ? 'bg-blue-500 text-white shadow-sm'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-800'
        }`}
        aria-label="Switch to Ukrainian"
      >
        UK
      </button>
    </div>
  );
}
