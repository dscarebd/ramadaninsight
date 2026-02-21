import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocation } from 'react-router-dom';
import { LocateFixed, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import logo from '@/assets/logo.png';

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
  const [locating, setLocating] = useState(false);

  const handleGPS = () => {
    if (!navigator.geolocation) {
      toast.error(t('আপনার ব্রাউজার GPS সাপোর্ট করে না', 'Your browser does not support GPS'));
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        localStorage.setItem('gps_location', JSON.stringify({ latitude, longitude }));
        toast.success(t('GPS অবস্থান পাওয়া গেছে', 'GPS location found'));
        setLocating(false);
        window.dispatchEvent(new Event('gps-location-updated'));
      },
      () => {
        toast.error(t('অবস্থান পাওয়া যায়নি', 'Could not get location'));
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <header className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-lg">
      <div className="flex items-center gap-3 px-4 py-3">
        <img src={logo} alt="Ramadan Insight" className="h-10 w-10 rounded-lg object-cover shadow-md" />
        <div className="flex-1">
          <h1 className="text-lg font-bold leading-tight">
            {isHome ? t('রমজান ইনসাইট', 'Ramadan Insight') : (pageTitle ? t(pageTitle.bn, pageTitle.en) : t('রমজান ইনসাইট', 'Ramadan Insight'))}
          </h1>
          <p className="text-xs opacity-80">
            {t('বাংলাদেশ', 'Bangladesh')} 🇧🇩
          </p>
        </div>
        <button
          onClick={handleGPS}
          disabled={locating}
          className="p-2 rounded-full hover:bg-primary-foreground/10 transition-colors"
          title={t('GPS অবস্থান', 'GPS Location')}
        >
          {locating ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <LocateFixed className="h-5 w-5" />
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
