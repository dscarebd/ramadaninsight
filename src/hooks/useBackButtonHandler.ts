import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';
import { App } from '@capacitor/app';

export const useBackButtonHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const lastBackPress = useRef<number>(0);

  useEffect(() => {
    const handler = (ev?: { canGoBack: boolean }) => {
      if (location.pathname !== '/') {
        navigate(-1);
      } else {
        const now = Date.now();
        if (now - lastBackPress.current < 2000) {
          try { App.exitApp(); } catch {}
        } else {
          lastBackPress.current = now;
          toast({
            description: t('অ্যাপ থেকে বের হতে আবার ব্যাক বাটন চাপুন', 'Press back again to exit'),
          });
        }
      }
    };

    let removeListener: (() => void) | undefined;

    App.addListener('backButton', handler).then(l => {
      removeListener = () => l.remove();
    }).catch(() => {});

    return () => {
      removeListener?.();
    };
  }, [location.pathname, navigate, t]);
};
