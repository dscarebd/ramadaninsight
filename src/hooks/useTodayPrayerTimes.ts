import { useQuery } from '@tanstack/react-query';
import { fetchMonthTimes, type PrayerDay } from './usePrayerTimes';

export const useTodayPrayerTimes = (lat: number, lng: number) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const { data, isLoading, error } = useQuery({
    queryKey: ['today-prayer-times', lat, lng, year, month],
    queryFn: () => fetchMonthTimes(lat, lng, year, month),
    staleTime: 1000 * 60 * 60,
    enabled: lat !== 0 && lng !== 0,
    placeholderData: (prev) => prev,
  });

  const todayStr = `${String(now.getDate()).padStart(2, '0')}-${String(month).padStart(2, '0')}-${year}`;
  const todayData = data?.find(d => d.date === todayStr) || data?.[0] || null;

  return { todayData, isLoading, error };
};
