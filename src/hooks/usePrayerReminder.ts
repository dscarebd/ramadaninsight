import { useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const prayerSchedule: { key: string; bn: string; en: string; hourAfter: number }[] = [
  { key: 'fajr', bn: 'ফজর', en: 'Fajr', hourAfter: 7 },
  { key: 'dhuhr', bn: 'যোহর', en: 'Dhuhr', hourAfter: 14 },
  { key: 'asr', bn: 'আসর', en: 'Asr', hourAfter: 17 },
  { key: 'maghrib', bn: 'মাগরিব', en: 'Maghrib', hourAfter: 19 },
  { key: 'isha', bn: 'ইশা', en: 'Isha', hourAfter: 21 },
];

type PrayerChecked = Record<string, boolean>;

export const usePrayerReminder = (checked: PrayerChecked, enabled: boolean) => {
  const { t } = useLanguage();
  const notifiedRef = useRef<Set<string>>(new Set());

  // Request notification permission on mount
  useEffect(() => {
    if (!enabled) return;
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, [enabled]);

  // Check for missed prayers periodically
  useEffect(() => {
    if (!enabled) return;
    if (!('Notification' in window) || Notification.permission !== 'granted') return;

    const checkMissed = () => {
      const hour = new Date().getHours();
      prayerSchedule.forEach((prayer) => {
        if (
          hour >= prayer.hourAfter &&
          !checked[prayer.key] &&
          !notifiedRef.current.has(prayer.key)
        ) {
          notifiedRef.current.add(prayer.key);
          new Notification(
            t('নামাজের রিমাইন্ডার', 'Prayer Reminder'),
            {
              body: t(
                `${prayer.bn} নামাজ এখনও পড়া হয়নি। এখনই আদায় করুন।`,
                `You haven't prayed ${prayer.en} yet. Pray now.`
              ),
              icon: '/favicon.ico',
              tag: `prayer-${prayer.key}`,
            }
          );
        }
      });
    };

    checkMissed();
    const interval = setInterval(checkMissed, 5 * 60 * 1000); // every 5 min
    return () => clearInterval(interval);
  }, [enabled, checked, t]);

  // Reset notifications daily
  useEffect(() => {
    const resetAtMidnight = () => {
      const now = new Date();
      const ms = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime();
      return setTimeout(() => {
        notifiedRef.current.clear();
      }, ms);
    };
    const timeout = resetAtMidnight();
    return () => clearTimeout(timeout);
  }, []);

  return {
    permissionState: 'Notification' in window ? Notification.permission : 'unsupported',
    requestPermission: () => {
      if ('Notification' in window) {
        return Notification.requestPermission();
      }
      return Promise.resolve('denied' as NotificationPermission);
    },
  };
};
