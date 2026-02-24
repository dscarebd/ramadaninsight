import { useQuery } from '@tanstack/react-query';
import { fetchMonthTimes, type PrayerDay } from './usePrayerTimes';

const cacheKey = (lat: number, lng: number, year: number, month: number) =>
  `prayer_cache_${lat.toFixed(2)}_${lng.toFixed(2)}_${year}_${month}`;

const getCached = (lat: number, lng: number, year: number, month: number): PrayerDay[] | undefined => {
  try {
    const raw = localStorage.getItem(cacheKey(lat, lng, year, month));
    if (raw) return JSON.parse(raw);
  } catch {}
  return undefined;
};

export const useTodayPrayerTimes = (lat: number, lng: number) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const cached = getCached(lat, lng, year, month);

  const { data, isLoading, error } = useQuery({
    queryKey: ['today-prayer-times', lat, lng, year, month],
    queryFn: () => fetchMonthTimes(lat, lng, year, month),
    staleTime: 1000 * 60 * 60,
    enabled: lat !== 0 && lng !== 0,
    placeholderData: (prev) => prev ?? cached,
  });

  const todayStr = `${String(now.getDate()).padStart(2, '0')}-${String(month).padStart(2, '0')}-${year}`;
  const allData = data || cached;
  const todayData = allData?.find(d => d.date === todayStr) || allData?.[0] || null;

  return { todayData, isLoading, error };
};
