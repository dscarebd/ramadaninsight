import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { useLanguage } from '@/contexts/LanguageContext';
import { WifiOff } from 'lucide-react';

const OfflineBanner = () => {
  const { isOnline } = useNetworkStatus();
  const { t } = useLanguage();

  if (isOnline) return null;

  return (
    <div className="bg-destructive/10 text-destructive text-xs font-medium px-3 py-2 flex items-center justify-center gap-2">
      <WifiOff className="h-3.5 w-3.5" />
      <span>{t('আপনি অফলাইন আছেন — ক্যাশ করা ডেটা দেখানো হচ্ছে', "You're offline — showing cached data")}</span>
    </div>
  );
};

export default OfflineBanner;
