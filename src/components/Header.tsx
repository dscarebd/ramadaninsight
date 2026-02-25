import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { LocateFixed, Loader2, Home, HandHeart, CheckSquare, Calendar, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { findNearestLocation, findUpazila, findZilla, findDivision } from '@/data/locations';
import { cn } from '@/lib/utils';
import logo from '@/assets/logo.png';
import { BDFlag } from '@/components/FlagIcons';
import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';

const pageTitles: Record<string, { bn: string; en: string }> = {
  '/dua': { bn: 'দোয়া ও হাদিস', en: 'Dua & Hadith' },
  '/salat': { bn: 'নামাজ ট্র্যাকার', en: 'Salat Tracker' },
  '/schedule': { bn: 'সময়সূচী', en: 'Schedule' },
  '/settings': { bn: 'সেটিংস', en: 'Settings' },
  '/policies': { bn: 'নীতিমালা', en: 'Policies' },
};

const navTabs = [
  { path: '/', icon: Home, labelBn: 'হোম', labelEn: 'Home' },
  { path: '/dua', icon: HandHeart, labelBn: 'দোয়া', labelEn: 'Dua' },
  { path: '/salat', icon: CheckSquare, labelBn: 'নামাজ', labelEn: 'Salat' },
  { path: '/schedule', icon: Calendar, labelBn: 'সময়সূচী', labelEn: 'Schedule' },
  { path: '/settings', icon: Settings, labelBn: 'সেটিংস', labelEn: 'Settings' },
];

const Header = () => {
  const { lang, t } = useLanguage();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isHome = pathname === '/';
  const pageTitle = pageTitles[pathname];
  const [locating, setLocating] = useState(false);

  const processPosition = (latitude: number, longitude: number) => {
    const nearest = findNearestLocation(latitude, longitude);
    localStorage.setItem('location', JSON.stringify(nearest));
    localStorage.setItem('gps_location', JSON.stringify({ latitude, longitude }));

    const upazila = findUpazila(nearest.division, nearest.zilla, nearest.upazila);
    const zilla = findZilla(nearest.division, nearest.zilla);
    const upazilaName = upazila ? (lang === 'bn' ? upazila.nameBn : upazila.nameEn) : '';
    const zillaName = zilla ? (lang === 'bn' ? zilla.nameBn : zilla.nameEn) : '';
    toast.success(`${t('অবস্থান পাওয়া গেছে', 'Location found')}: ${upazilaName}, ${zillaName}`);

    setLocating(false);
    window.dispatchEvent(new Event('gps-location-updated'));
  };

  const handleGPS = async () => {
    setLocating(true);

    if (Capacitor.isNativePlatform()) {
      // Native: use @capacitor/geolocation
      try {
        const permResult = await Geolocation.requestPermissions();
        if (permResult.location === 'denied') {
          setLocating(false);
          toast.error(t(
            'লোকেশন অনুমতি দেওয়া হয়নি। অ্যাপ সেটিংস থেকে অনুমতি দিন অথবা ম্যানুয়ালি লোকেশন সিলেক্ট করুন।',
            'Location permission denied. Please allow location access in app settings or select location manually.'
          ), { duration: 6000 });
          return;
        }

        const position = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 15000,
        });
        processPosition(position.coords.latitude, position.coords.longitude);
      } catch (err: any) {
        setLocating(false);
        if (err?.message?.includes('denied') || err?.code === 1) {
          toast.error(t(
            'লোকেশন অনুমতি দেওয়া হয়নি। অ্যাপ সেটিংস থেকে অনুমতি দিন।',
            'Location permission denied. Please allow in app settings.'
          ), { duration: 6000 });
        } else {
          toast.error(t(
            'GPS সিগন্যাল পাওয়া যাচ্ছে না। ম্যানুয়ালি লোকেশন সিলেক্ট করুন।',
            'GPS signal unavailable. Please select location manually.'
          ), { duration: 5000 });
        }
      }
      return;
    }

    // Web: use navigator.geolocation with existing fallback logic
    if (!navigator.geolocation) {
      setLocating(false);
      toast.error(t('আপনার ব্রাউজার GPS সাপোর্ট করে না', 'Your browser does not support GPS'));
      return;
    }

    const isIframe = window.self !== window.top;
    if (isIframe) {
      toast.info(t(
        'প্রিভিউ মোডে GPS কাজ নাও করতে পারে। পাবলিশড URL ব্যবহার করুন অথবা ম্যানুয়ালি লোকেশন সিলেক্ট করুন।',
        'GPS may not work in preview mode. Use the published URL or select location manually.'
      ), { duration: 5000 });
    }

    const onSuccess = (pos: GeolocationPosition) => {
      processPosition(pos.coords.latitude, pos.coords.longitude);
    };

    const onError = (error: GeolocationPositionError, wasHighAccuracy: boolean) => {
      if (wasHighAccuracy && (error.code === error.TIMEOUT || error.code === error.POSITION_UNAVAILABLE)) {
        toast.info(t('উচ্চ নির্ভুলতায় ব্যর্থ, পুনরায় চেষ্টা করা হচ্ছে...', 'High accuracy failed, retrying...'));
        tryGPS(false);
        return;
      }

      setLocating(false);
      switch (error.code) {
        case error.PERMISSION_DENIED:
          toast.error(t(
            'লোকেশন অনুমতি দেওয়া হয়নি। ব্রাউজার সেটিংস থেকে অনুমতি দিন অথবা ম্যানুয়ালি লোকেশন সিলেক্ট করুন।',
            'Location permission denied. Please allow location access in browser settings or select location manually.'
          ), { duration: 6000 });
          break;
        case error.POSITION_UNAVAILABLE:
          toast.error(t(
            'GPS সিগন্যাল পাওয়া যাচ্ছে না। ম্যানুয়ালি লোকেশন সিলেক্ট করুন।',
            'GPS signal unavailable. Please select location manually.'
          ), { duration: 5000 });
          break;
        case error.TIMEOUT:
          toast.error(t(
            'GPS সময়সীমা শেষ হয়ে গেছে। ম্যানুয়ালি লোকেশন সিলেক্ট করুন।',
            'GPS timed out. Please select location manually.'
          ), { duration: 5000 });
          break;
        default:
          toast.error(t('অবস্থান পাওয়া যায়নি', 'Could not get location'));
      }
    };

    const tryGPS = (highAccuracy: boolean) => {
      navigator.geolocation.getCurrentPosition(
        onSuccess,
        (err) => onError(err, highAccuracy),
        { enableHighAccuracy: highAccuracy, timeout: 15000, maximumAge: 60000 }
      );
    };

    tryGPS(true);
  };

  return (
    <header className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-lg md:bg-background md:text-foreground md:shadow-sm md:border-b md:border-border" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="flex items-center gap-3 flex-1 md:cursor-pointer" onClick={() => navigate('/')}>
          <img src={logo} alt="Ramadan Insight" className="h-10 w-10 rounded-lg object-cover shadow-md" />
          <div>
            <h1 className="text-lg font-bold leading-tight md:text-primary">
              {isHome ? t('রামাদান ইনসাইট', 'Ramadan Insight') : (pageTitle ? t(pageTitle.bn, pageTitle.en) : t('রামাদান ইনসাইট', 'Ramadan Insight'))}
            </h1>
            <p className="text-xs opacity-80 md:hidden">
              {t('বাংলাদেশ', 'Bangladesh')} <BDFlag className="ml-0.5" />
            </p>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navTabs.map(tab => {
            const isActive = pathname === tab.path;
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <tab.icon className="h-4 w-4" />
                <span>{t(tab.labelBn, tab.labelEn)}</span>
              </button>
            );
          })}
        </nav>

        <button
          onClick={handleGPS}
          disabled={locating}
          className="p-2 rounded-full hover:bg-primary-foreground/10 md:hover:bg-muted transition-colors md:text-foreground"
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
