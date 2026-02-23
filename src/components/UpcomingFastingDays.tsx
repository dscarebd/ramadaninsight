import { useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Star } from 'lucide-react';
import type { PrayerDay } from '@/hooks/usePrayerTimes';

const toBengaliNum = (n: number | string): string => {
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(n).split('').map(d => bengaliDigits[parseInt(d)] || d).join('');
};

const dayNamesBn = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
const dayNamesEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const monthNamesBn = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];

interface UpcomingFast {
  date: Date;
  labelBn: string;
  labelEn: string;
  typeBn: string;
  typeEn: string;
  highlight?: boolean;
}

interface Props {
  todayData: PrayerDay | null;
}

const UpcomingFastingDays = ({ todayData }: Props) => {
  const { lang, t } = useLanguage();

  const upcomingFasts = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const fasts: UpcomingFast[] = [];

    // Next 14 days: find Mondays and Thursdays
    for (let i = 1; i <= 14; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() + i);
      const day = d.getDay();
      if (day === 1) {
        fasts.push({
          date: d,
          labelBn: `${dayNamesBn[day]}, ${toBengaliNum(d.getDate())} ${monthNamesBn[d.getMonth()]}`,
          labelEn: `${dayNamesEn[day]}, ${d.getDate()} ${d.toLocaleString('en', { month: 'short' })}`,
          typeBn: 'সুন্নত রোজা',
          typeEn: 'Sunnah Fast',
        });
      }
      if (day === 4) {
        fasts.push({
          date: d,
          labelBn: `${dayNamesBn[day]}, ${toBengaliNum(d.getDate())} ${monthNamesBn[d.getMonth()]}`,
          labelEn: `${dayNamesEn[day]}, ${d.getDate()} ${d.toLocaleString('en', { month: 'short' })}`,
          typeBn: 'সুন্নত রোজা',
          typeEn: 'Sunnah Fast',
        });
      }
    }

    // Ayyam al-Beed (13, 14, 15 of Hijri month) - check from todayData
    if (todayData) {
      const hijriDay = parseInt(todayData.hijriDay);
      const ayyamDays = [13, 14, 15];
      for (const ad of ayyamDays) {
        if (ad >= hijriDay) {
          const daysUntil = ad - hijriDay;
          const d = new Date(now);
          d.setDate(d.getDate() + daysUntil);
          if (daysUntil > 0 && daysUntil <= 15) {
            fasts.push({
              date: d,
              labelBn: `${toBengaliNum(ad)} ${todayData.hijriMonth.split(' (')[0]} (${dayNamesBn[d.getDay()]})`,
              labelEn: `${ad} ${todayData.hijriMonth.split(' (')[0]} (${dayNamesEn[d.getDay()]})`,
              typeBn: 'আইয়ামে বীজ',
              typeEn: 'Ayyam al-Beed',
              highlight: true,
            });
          }
        }
      }
    }

    // Sort by date and deduplicate (same date)
    fasts.sort((a, b) => a.date.getTime() - b.date.getTime());
    const seen = new Set<string>();
    return fasts.filter(f => {
      const key = f.date.toDateString() + f.typeEn;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).slice(0, 6);
  }, [todayData]);

  if (upcomingFasts.length === 0) return null;

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" />
          <h3 className="font-bold text-primary text-sm">{t('আসন্ন নফল রোজা', 'Upcoming Voluntary Fasts')}</h3>
        </div>
        <div className="space-y-2">
          {upcomingFasts.map((fast, i) => (
            <div
              key={i}
              className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm ${
                fast.highlight ? 'bg-primary/10 border border-primary/20' : 'bg-muted/50'
              }`}
            >
              <span className="text-foreground">
                {lang === 'bn' ? fast.labelBn : fast.labelEn}
              </span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                fast.highlight ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
              }`}>
                {fast.highlight && <Star className="inline h-3 w-3 mr-0.5 -mt-0.5" />}
                {lang === 'bn' ? fast.typeBn : fast.typeEn}
              </span>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground">
          {t(
            '💡 সোমবার ও বৃহস্পতিবার রোজা রাখা সুন্নত। আইয়ামে বীজ হলো প্রতি হিজরি মাসের ১৩, ১৪ ও ১৫ তারিখ।',
            '💡 Fasting on Monday & Thursday is Sunnah. Ayyam al-Beed are the 13th, 14th & 15th of each Hijri month.'
          )}
        </p>
      </CardContent>
    </Card>
  );
};

export default UpcomingFastingDays;
