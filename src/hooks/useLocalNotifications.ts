import { useEffect, useRef } from 'react';
import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import type { PrayerDay } from './usePrayerTimes';

const SEHRI_CHANNEL = 'sehri-reminder';
const IFTAR_CHANNEL = 'iftar-reminder';

const parseTimeToDate = (dateStr: string, timeStr: string): Date => {
  // dateStr format: "DD-MM-YYYY", timeStr format: "HH:MM"
  const [day, month, year] = dateStr.split('-').map(Number);
  const [hours, minutes] = timeStr.split(':').map(Number);
  return new Date(year, month - 1, day, hours, minutes, 0);
};

export const useLocalNotifications = (
  ramadanDays: PrayerDay[],
  enabled: boolean,
  lang: string
) => {
  const scheduledRef = useRef(false);

  useEffect(() => {
    if (!enabled || scheduledRef.current || ramadanDays.length === 0) return;
    if (!Capacitor.isNativePlatform()) return;

    const scheduleAll = async () => {
      try {
        // Request permission
        const permResult = await LocalNotifications.requestPermissions();
        if (permResult.display !== 'granted') return;

        // Create notification channels (Android)
        if (Capacitor.getPlatform() === 'android') {
          await LocalNotifications.createChannel({
            id: SEHRI_CHANNEL,
            name: lang === 'bn' ? 'সেহরি রিমাইন্ডার' : 'Sehri Reminder',
            description: lang === 'bn' ? 'সেহরির সময় জানিয়ে দেয়' : 'Reminds you before Sehri ends',
            importance: 5,
            sound: 'default',
            vibration: true,
          });
          await LocalNotifications.createChannel({
            id: IFTAR_CHANNEL,
            name: lang === 'bn' ? 'ইফতার রিমাইন্ডার' : 'Iftar Reminder',
            description: lang === 'bn' ? 'ইফতারের সময় জানিয়ে দেয়' : 'Reminds you when Iftar starts',
            importance: 5,
            sound: 'default',
            vibration: true,
          });
        }

        // Cancel all existing notifications first
        const pending = await LocalNotifications.getPending();
        if (pending.notifications.length > 0) {
          await LocalNotifications.cancel(pending);
        }

        const now = new Date();
        const notifications: Array<{
          id: number;
          title: string;
          body: string;
          schedule: { at: Date; allowWhileIdle: boolean };
          channelId?: string;
          smallIcon?: string;
        }> = [];

        ramadanDays.forEach((day, index) => {
          // Sehri reminder — 15 minutes before Sehri ends
          const sehriTime = parseTimeToDate(day.date, day.sehriEnd);
          const sehriReminder = new Date(sehriTime.getTime() - 15 * 60 * 1000);

          if (sehriReminder > now) {
            notifications.push({
              id: 1000 + index,
              title: lang === 'bn' ? '🌙 সেহরি রিমাইন্ডার' : '🌙 Sehri Reminder',
              body: lang === 'bn'
                ? `সেহরির সময় শেষ হতে ১৫ মিনিট বাকি। সেহরি শেষ: ${day.sehriEnd}`
                : `15 minutes until Sehri ends. Sehri ends at: ${day.sehriEnd}`,
              schedule: { at: sehriReminder, allowWhileIdle: true },
              ...(Capacitor.getPlatform() === 'android' && { channelId: SEHRI_CHANNEL }),
              smallIcon: 'ic_stat_icon_config_sample',
            });
          }

          // Iftar reminder — at Iftar time
          const iftarTime = parseTimeToDate(day.date, day.iftarStart);
          if (iftarTime > now) {
            notifications.push({
              id: 2000 + index,
              title: lang === 'bn' ? '🕌 ইফতারের সময় হয়েছে!' : '🕌 It\'s Iftar Time!',
              body: lang === 'bn'
                ? `ইফতারের সময় হয়েছে। ইফতার: ${day.iftarStart}। দোয়া পড়ে ইফতার করুন।`
                : `Time to break your fast. Iftar at: ${day.iftarStart}. Recite the dua and break your fast.`,
              schedule: { at: iftarTime, allowWhileIdle: true },
              ...(Capacitor.getPlatform() === 'android' && { channelId: IFTAR_CHANNEL }),
              smallIcon: 'ic_stat_icon_config_sample',
            });
          }
        });

        // Capacitor limits: schedule in batches of 64 (Android limit)
        const batchSize = 60;
        for (let i = 0; i < notifications.length; i += batchSize) {
          const batch = notifications.slice(i, i + batchSize);
          await LocalNotifications.schedule({ notifications: batch });
        }

        scheduledRef.current = true;
        console.log(`Scheduled ${notifications.length} local notifications`);
      } catch (err) {
        console.error('Failed to schedule notifications:', err);
      }
    };

    scheduleAll();
  }, [enabled, ramadanDays, lang]);

  return {
    cancelAll: async () => {
      if (!Capacitor.isNativePlatform()) return;
      const pending = await LocalNotifications.getPending();
      if (pending.notifications.length > 0) {
        await LocalNotifications.cancel(pending);
      }
      scheduledRef.current = false;
    },
    reschedule: () => {
      scheduledRef.current = false;
    },
  };
};
