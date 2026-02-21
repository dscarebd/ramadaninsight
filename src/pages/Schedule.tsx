import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePrayerTimes } from '@/hooks/usePrayerTimes';
import { getCoordinates } from '@/data/locations';
import LocationPicker from '@/components/DistrictSelector';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Loader2 } from 'lucide-react';

const toBengaliNum = (n: number | string): string => {
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(n).split('').map(d => bengaliDigits[parseInt(d)] || d).join('');
};

const to12Hour = (time24: string): string => {
  const [h, m] = time24.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, '0')} ${period}`;
};

const defaultLocation = { division: 'dhaka', zilla: 'dhaka', upazila: 'savar' };

const loadLocation = () => {
  try {
    const stored = localStorage.getItem('location');
    if (stored) return JSON.parse(stored);
  } catch {}
  return defaultLocation;
};

const Schedule = () => {
  const { lang, t } = useLanguage();
  const [location, setLocation] = useState(loadLocation);

  useEffect(() => {
    localStorage.setItem('location', JSON.stringify(location));
  }, [location]);

  const coords = getCoordinates(location.division, location.zilla, location.upazila);
  const lat = coords?.lat || 23.8103;
  const lng = coords?.lng || 90.4125;

  const { ramadanDays, todayIndex, isLoading, isFetching } = usePrayerTimes(lat, lng);

  if (isLoading && ramadanDays.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center pb-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const fmt = (s: string) => lang === 'bn' ? toBengaliNum(s) : s;

  return (
    <div className={`min-h-screen pb-20 px-2 pt-4 space-y-3 animate-fade-in transition-opacity duration-300 ${isFetching ? 'opacity-70' : 'opacity-100'}`}>
      <h2 className="text-xl font-bold text-primary px-2">{t('সম্পূর্ণ সময়সূচী', 'Full Schedule')}</h2>
      <div className="px-2">
        <LocationPicker value={location} onChange={setLocation} />
      </div>

      <div className="overflow-auto rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow className="bg-primary/10">
              <TableHead className="text-xs font-bold text-primary">{t('রোজা', 'Day')}</TableHead>
              <TableHead className="text-xs font-bold text-primary">{t('তারিখ', 'Date')}</TableHead>
              <TableHead className="text-xs font-bold text-primary">{t('সেহরি', 'Sehri')}</TableHead>
              <TableHead className="text-xs font-bold text-primary">{t('ইফতার', 'Iftar')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ramadanDays.map((day, i) => (
              <TableRow
                key={i}
                className={i === todayIndex ? 'bg-primary/10 font-semibold' : ''}
              >
                <TableCell className="text-xs py-2">{fmt(String(i + 1))}</TableCell>
                <TableCell className="text-xs py-2">{day.gregorianDate}</TableCell>
                <TableCell className="text-xs py-2">{fmt(to12Hour(day.sehriEnd))}</TableCell>
                <TableCell className="text-xs py-2">{fmt(to12Hour(day.iftarStart))}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Schedule;
