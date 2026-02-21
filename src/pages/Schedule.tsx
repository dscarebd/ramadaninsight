import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePrayerTimes } from '@/hooks/usePrayerTimes';
import DistrictSelector from '@/components/DistrictSelector';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Loader2 } from 'lucide-react';

const toBengaliNum = (n: number | string): string => {
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(n).split('').map(d => bengaliDigits[parseInt(d)] || d).join('');
};

const Schedule = () => {
  const { lang, t } = useLanguage();
  const [district, setDistrict] = useState(() => localStorage.getItem('district') || 'dhaka');

  useEffect(() => {
    localStorage.setItem('district', district);
  }, [district]);

  const { ramadanDays, todayIndex, isLoading } = usePrayerTimes(district);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center pb-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const fmt = (s: string) => lang === 'bn' ? toBengaliNum(s) : s;

  return (
    <div className="min-h-screen pb-20 px-2 pt-4 space-y-3">
      <h2 className="text-xl font-bold text-primary px-2">{t('সম্পূর্ণ সময়সূচী', 'Full Schedule')}</h2>
      <div className="px-2">
        <DistrictSelector value={district} onChange={setDistrict} />
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
                <TableCell className="text-xs py-2">{fmt(day.sehriEnd)}</TableCell>
                <TableCell className="text-xs py-2">{fmt(day.iftarStart)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Schedule;
