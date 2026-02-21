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

const cleanTime = (time: string) => time.replace(/\s*\(.*\)/, '');

const fetchMonthTimes = async (lat: number, lng: number, year: number, month: number): Promise<PrayerDay[]> => {
  const res = await fetch(
    // tune offsets (Imsak,Fajr,Sunrise,Dhuhr,Asr,Maghrib,Sunset,Isha,Midnight) to align with Bangladesh Islamic Foundation
    `https://api.aladhan.com/v1/calendar/${year}/${month}?latitude=${lat}&longitude=${lng}&method=1&school=1&tune=-2,0,0,2,1,3,3,1,0`
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

export const usePrayerTimes = (lat: number, lng: number) => {
  // Ramadan 2026 spans roughly Feb 18 - Mar 19, 2026
  const febQuery = useQuery({
    queryKey: ['prayer-times', lat, lng, 2026, 2],
    queryFn: () => fetchMonthTimes(lat, lng, 2026, 2),
    staleTime: 1000 * 60 * 60,
    enabled: lat !== 0 && lng !== 0,
  });

  const marQuery = useQuery({
    queryKey: ['prayer-times', lat, lng, 2026, 3],
    queryFn: () => fetchMonthTimes(lat, lng, 2026, 3),
    staleTime: 1000 * 60 * 60,
    enabled: lat !== 0 && lng !== 0,
  });

  const isLoading = febQuery.isLoading || marQuery.isLoading;
  const error = febQuery.error || marQuery.error;

  // Filter to Ramadan days and skip first day to align with Bangladesh moon sighting
  const allDays = [...(febQuery.data || []), ...(marQuery.data || [])];
  const apiRamadanDays = allDays.filter(day => {
    const hijriMonth = day.hijriMonth.toLowerCase();
    return hijriMonth.includes('ramadan') || hijriMonth.includes('ramaḍān') || hijriMonth.includes('ramad');
  });
  // Bangladesh starts Ramadan 1 day after the API's calculation
  const ramadanDays = apiRamadanDays.slice(1);

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
