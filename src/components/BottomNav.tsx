import { useLanguage } from '@/contexts/LanguageContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, HandHeart, CheckSquare, Calendar, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const BottomNav = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    { path: '/', icon: Home, labelBn: 'হোম', labelEn: 'Home' },
    { path: '/dua', icon: HandHeart, labelBn: 'দোয়া', labelEn: 'Dua' },
    { path: '/salat', icon: CheckSquare, labelBn: 'নামাজ', labelEn: 'Salat' },
    { path: '/schedule', icon: Calendar, labelBn: 'সময়সূচী', labelEn: 'Schedule' },
    { path: '/settings', icon: Settings, labelBn: 'সেটিংস', labelEn: 'Settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card shadow-[0_-2px_10px_rgba(0,0,0,0.1)] md:hidden">
      <div className="flex items-center justify-around">
        {tabs.map(tab => {
          const isActive = location.pathname === tab.path;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={cn(
                'flex flex-1 flex-col items-center gap-0.5 py-2 transition-all duration-200',
                isActive ? 'text-primary scale-105' : 'text-muted-foreground scale-100'
              )}
            >
              <tab.icon className={cn('h-5 w-5 transition-all duration-200', isActive && 'fill-primary/20')} />
              <span className="text-[10px] font-medium">{t(tab.labelBn, tab.labelEn)}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
