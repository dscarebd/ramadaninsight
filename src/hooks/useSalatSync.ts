import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getAllLocalSalatDays, type SalatDayData } from '@/lib/localSalatStorage';

const LAST_SYNC_KEY = 'salat_last_sync';
const PENDING_SYNC_KEY = 'salat_pending_sync';

/** Mark that there are offline changes needing sync */
export const markPendingSync = () => {
  localStorage.setItem(PENDING_SYNC_KEY, 'true');
};

/**
 * Auto-syncs localStorage salat data with cloud when user is logged in.
 * Runs once per session on login, then on reconnect if there are pending changes.
 */
export const useSalatSync = (userId: string | null) => {
  const hasSynced = useRef(false);

  useEffect(() => {
    if (!userId) {
      hasSynced.current = false;
      return;
    }

    const sync = async () => {
      try {
        const localDays = getAllLocalSalatDays();

        const { data: cloudRows } = await supabase
          .from('salat_tracking')
          .select('*')
          .eq('user_id', userId)
          .order('date');

        const cloudMap = new Map(
          (cloudRows || []).map(r => [r.date, r])
        );
        const localMap = new Map(
          localDays.map(d => [d.date, d])
        );

        const toUpload: any[] = [];
        for (const local of localDays) {
          const cloud = cloudMap.get(local.date);
          if (!cloud) {
            toUpload.push({
              user_id: userId,
              date: local.date,
              fajr: local.fajr, dhuhr: local.dhuhr, asr: local.asr,
              maghrib: local.maghrib, isha: local.isha,
              taraweeh: local.taraweeh, tahajjud: local.tahajjud,
            });
          } else {
            const merged = {
              fajr: local.fajr || cloud.fajr,
              dhuhr: local.dhuhr || cloud.dhuhr,
              asr: local.asr || cloud.asr,
              maghrib: local.maghrib || cloud.maghrib,
              isha: local.isha || cloud.isha,
              taraweeh: local.taraweeh || cloud.taraweeh,
              tahajjud: local.tahajjud || cloud.tahajjud,
            };

            const needsCloudUpdate = Object.keys(merged).some(
              k => merged[k as keyof typeof merged] !== cloud[k as keyof typeof merged]
            );

            if (needsCloudUpdate) {
              toUpload.push({ user_id: userId, date: local.date, ...merged });
            }

            localStorage.setItem(`salat_${local.date}`, JSON.stringify(merged));
          }
        }

        for (const [date, cloud] of cloudMap) {
          if (!localMap.has(date)) {
            localStorage.setItem(`salat_${date}`, JSON.stringify({
              fajr: cloud.fajr, dhuhr: cloud.dhuhr, asr: cloud.asr,
              maghrib: cloud.maghrib, isha: cloud.isha,
              taraweeh: cloud.taraweeh, tahajjud: cloud.tahajjud,
            }));
          }
        }

        if (toUpload.length > 0) {
          await supabase
            .from('salat_tracking')
            .upsert(toUpload, { onConflict: 'user_id,date' });
        }

        localStorage.setItem(LAST_SYNC_KEY, new Date().toISOString());
        localStorage.removeItem(PENDING_SYNC_KEY);
        hasSynced.current = true;
        console.log(`Salat sync complete: ${toUpload.length} uploaded`);
      } catch (err) {
        console.error('Salat sync failed:', err);
      }
    };

    // Initial sync
    if (!hasSynced.current) {
      sync();
    }

    // Re-sync on reconnect if there are pending offline changes
    const handleOnline = () => {
      if (localStorage.getItem(PENDING_SYNC_KEY) === 'true') {
        console.log('Back online — syncing pending salat data');
        sync();
      }
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [userId]);
};
