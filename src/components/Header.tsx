import { useLanguage } from '@/contexts/LanguageContext';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const { lang, toggleLang, t } = useLanguage();

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
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleLang}
          className="text-primary-foreground hover:bg-primary-foreground/20 gap-1 text-sm font-semibold"
        >
          <Globe className="h-4 w-4" />
          {lang === 'bn' ? 'EN' : 'বাং'}
        </Button>
      </div>
    </header>
  );
};

export default Header;
