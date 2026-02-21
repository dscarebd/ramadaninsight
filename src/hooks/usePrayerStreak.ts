import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { formatLocalDate } from '@/lib/utils';
import { getAllLocalSalatDays } from '@/lib/localSalatStorage';

const fiveWaqt = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const;

type DayRow = {
  date: string;
  fajr: boolean;
  dhuhr: boolean;
  asr: boolean;
  maghrib: boolean;
  isha: boolean;
};

const calculateStreaks = (rows: DayRow[]) => {
  const perfectDates = new Set(
    rows.filter(d => fiveWaqt.every(p => d[p])).map(d => d.date)
  );

  if (perfectDates.size === 0) return { current: 0, longest: 0 };

  const sortedDates = Array.from(perfectDates).sort();
  const startDate = new Date(sortedDates[0] + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let longest = 0;
  let streak = 0;
  const d = new Date(startDate);
  while (d <= today) {
    const dateStr = formatLocalDate(d);
    if (perfectDates.has(dateStr)) {
      streak++;
      if (streak > longest) longest = streak;
    } else {
      streak = 0;
    }
    d.setDate(d.getDate() + 1);
  }

  return { current: streak, longest };
};

export const usePrayerStreak = (userId: string | null) => {
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    if (userId) {
      supabase
        .from('salat_tracking')
        .select('date,fajr,dhuhr,asr,maghrib,isha')
        .eq('user_id', userId)
        .order('date', { ascending: true })
        .then(({ data: rows }) => {
          const { current, longest } = calculateStreaks((rows as DayRow[]) || []);
          setCurrentStreak(current);
          setLongestStreak(longest);
          setLoading(false);
        });
    } else {
      // Use localStorage
      const localDays = getAllLocalSalatDays();
      const { current, longest } = calculateStreaks(localDays);
      setCurrentStreak(current);
      setLongestStreak(longest);
      setLoading(false);
    }
  }, [userId]);

  return { currentStreak, longestStreak, loading };
};
