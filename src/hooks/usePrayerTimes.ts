import { useQuery } from '@tanstack/react-query';

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

export const cleanTime = (time: string) => time.replace(/\s*\(.*\)/, '');

// Subtract minutes from a HH:MM time string
export const subtractMinutes = (time: string, mins: number): string => {
  const [h, m] = time.split(':').map(Number);
  const total = h * 60 + m - mins;
  const adjTotal = ((total % 1440) + 1440) % 1440;
  return `${String(Math.floor(adjTotal / 60)).padStart(2, '0')}:${String(adjTotal % 60).padStart(2, '0')}`;
};

const cacheKey = (lat: number, lng: number, year: number, month: number) =>
  `prayer_cache_${lat.toFixed(2)}_${lng.toFixed(2)}_${year}_${month}`;

const getCached = (lat: number, lng: number, year: number, month: number): PrayerDay[] | undefined => {
  try {
    const raw = localStorage.getItem(cacheKey(lat, lng, year, month));
    if (raw) return JSON.parse(raw);
  } catch {}
  return undefined;
};

const setCache = (lat: number, lng: number, year: number, month: number, data: PrayerDay[]) => {
  try {
    localStorage.setItem(cacheKey(lat, lng, year, month), JSON.stringify(data));
  } catch {}
};

export const fetchMonthTimes = async (lat: number, lng: number, year: number, month: number): Promise<PrayerDay[]> => {
  const res = await fetch(
    `https://api.aladhan.com/v1/calendar/${year}/${month}?latitude=${lat}&longitude=${lng}&method=1&school=1&tune=0,0,0,2,1,3,3,1,0`
  );
  if (!res.ok) throw new Error('Failed to fetch prayer times');
  const json = await res.json();

  const days: PrayerDay[] = json.data.map((day: DayData) => {
    const fajr = cleanTime(day.timings.Fajr);
    const sehriEnd = subtractMinutes(fajr, 3);
    return {
      date: day.date.gregorian.date,
      hijriDate: day.date.hijri.date,
      hijriDay: day.date.hijri.day,
      hijriMonth: `${day.date.hijri.month.en} (${day.date.hijri.month.ar})`,
      hijriYear: day.date.hijri.year,
      gregorianDate: day.date.readable,
      sehriEnd,
      iftarStart: cleanTime(day.timings.Maghrib),
      fajr,
      sunrise: cleanTime(day.timings.Sunrise),
      dhuhr: cleanTime(day.timings.Dhuhr),
      asr: cleanTime(day.timings.Asr),
      maghrib: cleanTime(day.timings.Maghrib),
      isha: cleanTime(day.timings.Isha),
    };
  });

  // Cache after successful fetch
  setCache(lat, lng, year, month, days);
  return days;
};

export const usePrayerTimes = (lat: number, lng: number) => {
  const febCached = getCached(lat, lng, 2026, 2);
  const marCached = getCached(lat, lng, 2026, 3);

  const febQuery = useQuery({
    queryKey: ['prayer-times', lat, lng, 2026, 2],
    queryFn: () => fetchMonthTimes(lat, lng, 2026, 2),
    staleTime: 1000 * 60 * 60,
    enabled: lat !== 0 && lng !== 0,
    placeholderData: (prev) => prev ?? febCached,
  });

  const marQuery = useQuery({
    queryKey: ['prayer-times', lat, lng, 2026, 3],
    queryFn: () => fetchMonthTimes(lat, lng, 2026, 3),
    staleTime: 1000 * 60 * 60,
    enabled: lat !== 0 && lng !== 0,
    placeholderData: (prev) => prev ?? marCached,
  });

  const isLoading = febQuery.isLoading || marQuery.isLoading;
  const isFetching = febQuery.isFetching || marQuery.isFetching;
  const error = febQuery.error || marQuery.error;

  const allDays = [...(febQuery.data || febCached || []), ...(marQuery.data || marCached || [])];
  const apiRamadanDays = allDays.filter(day => {
    const hijriMonth = day.hijriMonth.toLowerCase();
    return hijriMonth.includes('ramadan') || hijriMonth.includes('ramaḍān') || hijriMonth.includes('ramad');
  });
  const ramadanDays = apiRamadanDays.slice(1);

  const today = new Date();
  const todayStr = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;
  const todayData = ramadanDays.find(d => d.date === todayStr) || ramadanDays[0];
  const todayIndex = ramadanDays.findIndex(d => d.date === todayStr);
  const isRamadan = todayIndex >= 0;

  return {
    ramadanDays,
    todayData,
    todayIndex: todayIndex >= 0 ? todayIndex : 0,
    isLoading,
    isFetching,
    error,
    isRamadan,
  };
};
