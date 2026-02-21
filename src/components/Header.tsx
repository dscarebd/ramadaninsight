import { useLanguage } from '@/contexts/LanguageContext';
import { useLocation } from 'react-router-dom';

const pageTitles: Record<string, { bn: string; en: string }> = {
  '/dua': { bn: 'দোয়া ও হাদিস', en: 'Dua & Hadith' },
  '/salat': { bn: 'নামাজ ট্র্যাকার', en: 'Salat Tracker' },
  '/schedule': { bn: 'সময়সূচী', en: 'Schedule' },
  '/settings': { bn: 'সেটিংস', en: 'Settings' },
};

const Header = () => {
  const { t } = useLanguage();
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const pageTitle = pageTitles[pathname];

  return (
    <header className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-lg">
      <div className="flex items-center justify-between px-4 py-3">
        <div>
          <h1 className="text-lg font-bold leading-tight">
            {isHome ? t('রমজান ইনসাইট', 'Ramadan Insight') : (pageTitle ? t(pageTitle.bn, pageTitle.en) : t('রমজান ইনসাইট', 'Ramadan Insight'))}
          </h1>
          <p className="text-xs opacity-80">
            {t('বাংলাদেশ', 'Bangladesh')} 🇧🇩
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
