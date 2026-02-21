import { useLanguage } from '@/contexts/LanguageContext';

const Header = () => {
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-lg">
      <div className="flex items-center justify-between px-4 py-3">
        <div>
          <h1 className="text-lg font-bold leading-tight">
            {t('রমজান ক্যালেন্ডার ২০২৬', 'Ramadan Calendar 2026')}
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
