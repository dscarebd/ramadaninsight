/**
 * Helper to read/write salat tracking data from localStorage.
 * Keys are stored as `salat_YYYY-MM-DD` with JSON value of prayer booleans.
 */

export type SalatDayData = {
  date: string;
  fajr: boolean;
  dhuhr: boolean;
  asr: boolean;
  maghrib: boolean;
  isha: boolean;
  taraweeh: boolean;
  tahajjud: boolean;
};

const SALAT_PREFIX = 'salat_';

export const getLocalSalatDay = (dateStr: string): SalatDayData | null => {
  const raw = localStorage.getItem(`${SALAT_PREFIX}${dateStr}`);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return {
      date: dateStr,
      fajr: !!parsed.fajr,
      dhuhr: !!parsed.dhuhr,
      asr: !!parsed.asr,
      maghrib: !!parsed.maghrib,
      isha: !!parsed.isha,
      taraweeh: !!parsed.taraweeh,
      tahajjud: !!parsed.tahajjud,
    };
  } catch {
    return null;
  }
};

export const getAllLocalSalatDays = (): SalatDayData[] => {
  const days: SalatDayData[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(SALAT_PREFIX)) {
      const dateStr = key.slice(SALAT_PREFIX.length);
      const day = getLocalSalatDay(dateStr);
      if (day) days.push(day);
    }
  }
  return days.sort((a, b) => a.date.localeCompare(b.date));
};

export const getLocalSalatDaysInRange = (startDate: string, endDate: string): SalatDayData[] => {
  return getAllLocalSalatDays().filter(d => d.date >= startDate && d.date <= endDate);
};
