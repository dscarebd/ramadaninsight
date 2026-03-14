import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getAllLocalSalatDays, type SalatDayData } from '@/lib/localSalatStorage';

const LAST_SYNC_KEY = 'salat_last_sync';

/**
 * Auto-syncs localStorage salat data with cloud when user is logged in.
 * Runs once per session on login, then periodically.
 */
export const useSalatSync = (userId: string | null) => {
  const hasSynced = useRef(false);

  useEffect(() => {
    if (!userId) {
      hasSynced.current = false;
      return;
    }

    // Don't re-sync in the same session
    if (hasSynced.current) return;

    const sync = async () => {
      try {
        // 1. Get all local data
        const localDays = getAllLocalSalatDays();

        // 2. Get all cloud data
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

        // 3. Upload local-only entries to cloud
        const toUpload: any[] = [];
        for (const local of localDays) {
          const cloud = cloudMap.get(local.date);
          if (!cloud) {
            // Local-only: upload to cloud
            toUpload.push({
              user_id: userId,
              date: local.date,
              fajr: local.fajr,
              dhuhr: local.dhuhr,
              asr: local.asr,
              maghrib: local.maghrib,
              isha: local.isha,
              taraweeh: local.taraweeh,
              tahajjud: local.tahajjud,
            });
          } else {
            // Both exist: merge (keep true if either is true)
            const merged = {
              fajr: local.fajr || cloud.fajr,
              dhuhr: local.dhuhr || cloud.dhuhr,
              asr: local.asr || cloud.asr,
              maghrib: local.maghrib || cloud.maghrib,
              isha: local.isha || cloud.isha,
              taraweeh: local.taraweeh || cloud.taraweeh,
              tahajjud: local.tahajjud || cloud.tahajjud,
            };

            // Check if merge differs from cloud
            const needsCloudUpdate = Object.keys(merged).some(
              k => merged[k as keyof typeof merged] !== cloud[k as keyof typeof merged]
            );

            if (needsCloudUpdate) {
              toUpload.push({
                user_id: userId,
                date: local.date,
                ...merged,
              });
            }

            // Update localStorage with merged data
            localStorage.setItem(`salat_${local.date}`, JSON.stringify(merged));
          }
        }

        // 4. Download cloud-only entries to localStorage
        for (const [date, cloud] of cloudMap) {
          if (!localMap.has(date)) {
            localStorage.setItem(`salat_${date}`, JSON.stringify({
              fajr: cloud.fajr,
              dhuhr: cloud.dhuhr,
              asr: cloud.asr,
              maghrib: cloud.maghrib,
              isha: cloud.isha,
              taraweeh: cloud.taraweeh,
              tahajjud: cloud.tahajjud,
            }));
          }
        }

        // 5. Batch upsert to cloud
        if (toUpload.length > 0) {
          await supabase
            .from('salat_tracking')
            .upsert(toUpload, { onConflict: 'user_id,date' });
        }

        localStorage.setItem(LAST_SYNC_KEY, new Date().toISOString());
        hasSynced.current = true;
        console.log(`Salat sync complete: ${toUpload.length} uploaded, ${cloudMap.size - localMap.size > 0 ? cloudMap.size - localMap.size : 0} downloaded`);
      } catch (err) {
        console.error('Salat sync failed:', err);
      }
    };

    sync();
  }, [userId]);
};
