import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const fiveWaqt = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const;

type DayRow = {
  date: string;
  fajr: boolean;
  dhuhr: boolean;
  asr: boolean;
  maghrib: boolean;
  isha: boolean;
};

export const usePrayerStreak = (userId: string | null) => {
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) {
      setCurrentStreak(0);
      setLongestStreak(0);
      return;
    }

    setLoading(true);
    supabase
      .from('salat_tracking')
      .select('date,fajr,dhuhr,asr,maghrib,isha')
      .eq('user_id', userId)
      .order('date', { ascending: true })
      .then(({ data: rows }) => {
        if (!rows || rows.length === 0) {
          setCurrentStreak(0);
          setLongestStreak(0);
          setLoading(false);
          return;
        }

        const perfectDates = new Set(
          (rows as DayRow[])
            .filter(d => fiveWaqt.every(p => d[p]))
            .map(d => d.date)
        );

        // Calculate streaks by walking dates
        let longest = 0;
        let current = 0;
        let streak = 0;

        // Get date range
        const sortedDates = Array.from(perfectDates).sort();
        if (sortedDates.length === 0) {
          setCurrentStreak(0);
          setLongestStreak(0);
          setLoading(false);
          return;
        }

        // Walk from first perfect day to today
        const startDate = new Date(sortedDates[0] + 'T00:00:00');
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const d = new Date(startDate);
        while (d <= today) {
          const dateStr = d.toISOString().split('T')[0];
          if (perfectDates.has(dateStr)) {
            streak++;
            if (streak > longest) longest = streak;
          } else {
            streak = 0;
          }
          d.setDate(d.getDate() + 1);
        }
        current = streak; // streak at today = current streak

        setCurrentStreak(current);
        setLongestStreak(longest);
        setLoading(false);
      });
  }, [userId]);

  return { currentStreak, longestStreak, loading };
};
