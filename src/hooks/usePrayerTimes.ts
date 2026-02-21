import { useQuery } from '@tanstack/react-query';
import { districts } from '@/data/districts';

interface PrayerTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  Imsak: string;
}

interface DayData {
  timings: PrayerTimings;
  date: {
    readable: string;
    hijri: {
      date: string;
      day: string;
      month: { number: number; en: string; ar: string };
      year: string;
    };
    gregorian: {
      date: string;
      day: string;
      month: { number: number; en: string };
      year: string;
    };
  };
}

export interface PrayerDay {
  date: string;
  hijriDate: string;
  hijriDay: string;
  hijriMonth: string;
  hijriYear: string;
  gregorianDate: string;
  sehriEnd: string;
  iftarStart: string;
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

const cleanTime = (time: string) => time.replace(/\s*\(.*\)/, '');

const fetchMonthTimes = async (districtId: string, year: number, month: number): Promise<PrayerDay[]> => {
  const district = districts.find(d => d.id === districtId) || districts[0];
  // Use adjustment=-1 to align Hijri date with Bangladesh local moon sighting
  const res = await fetch(
    `https://api.aladhan.com/v1/calendar/${year}/${month}?latitude=${district.lat}&longitude=${district.lng}&method=1&school=1&adjustment=-1`
  );
  if (!res.ok) throw new Error('Failed to fetch prayer times');
  const json = await res.json();

  return json.data.map((day: DayData) => ({
    date: day.date.gregorian.date,
    hijriDate: day.date.hijri.date,
    hijriDay: day.date.hijri.day,
    hijriMonth: `${day.date.hijri.month.en} (${day.date.hijri.month.ar})`,
    hijriYear: day.date.hijri.year,
    gregorianDate: day.date.readable,
    sehriEnd: cleanTime(day.timings.Imsak),
    iftarStart: cleanTime(day.timings.Maghrib),
    fajr: cleanTime(day.timings.Fajr),
    sunrise: cleanTime(day.timings.Sunrise),
    dhuhr: cleanTime(day.timings.Dhuhr),
    asr: cleanTime(day.timings.Asr),
    maghrib: cleanTime(day.timings.Maghrib),
    isha: cleanTime(day.timings.Isha),
  }));
};

export const usePrayerTimes = (districtId: string) => {
  // Ramadan 2026 spans roughly Feb 18 - Mar 19, 2026
  const febQuery = useQuery({
    queryKey: ['prayer-times', districtId, 2026, 2],
    queryFn: () => fetchMonthTimes(districtId, 2026, 2),
    staleTime: 1000 * 60 * 60,
  });

  const marQuery = useQuery({
    queryKey: ['prayer-times', districtId, 2026, 3],
    queryFn: () => fetchMonthTimes(districtId, 2026, 3),
    staleTime: 1000 * 60 * 60,
  });

  const isLoading = febQuery.isLoading || marQuery.isLoading;
  const error = febQuery.error || marQuery.error;

  // Filter to Ramadan days (approx Feb 18 - Mar 19)
  const allDays = [...(febQuery.data || []), ...(marQuery.data || [])];
  const ramadanDays = allDays.filter(day => {
    const hijriMonth = day.hijriMonth.toLowerCase();
    return hijriMonth.includes('ramadan') || hijriMonth.includes('ramaḍān') || hijriMonth.includes('ramad');
  });

  // Get today's data
  const today = new Date();
  const todayStr = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;
  const todayData = ramadanDays.find(d => d.date === todayStr) || ramadanDays[0];
  const todayIndex = ramadanDays.findIndex(d => d.date === todayStr);

  return {
    ramadanDays,
    todayData,
    todayIndex: todayIndex >= 0 ? todayIndex : 0,
    isLoading,
    error,
  };
};
