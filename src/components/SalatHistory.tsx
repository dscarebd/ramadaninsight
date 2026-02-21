import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { ChevronLeft, ChevronRight, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const fiveWaqt = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const;
const prayerLabels: Record<string, { bn: string; en: string }> = {
  fajr: { bn: 'ফজর', en: 'Fajr' },
  dhuhr: { bn: 'যোহর', en: 'Dhuhr' },
  asr: { bn: 'আসর', en: 'Asr' },
  maghrib: { bn: 'মাগরিব', en: 'Maghrib' },
  isha: { bn: 'ইশা', en: 'Isha' },
  taraweeh: { bn: 'তারাবীহ', en: 'Taraweeh' },
  tahajjud: { bn: 'তাহাজ্জুদ', en: 'Tahajjud' },
};

type DayData = {
  date: string;
  fajr: boolean;
  dhuhr: boolean;
  asr: boolean;
  maghrib: boolean;
  isha: boolean;
  taraweeh: boolean;
  tahajjud: boolean;
};

const dayNames = {
  bn: ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহ', 'শুক্র', 'শনি'],
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
};

const monthNames = {
  bn: ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
};

interface SalatHistoryProps {
  userId: string | null;
}

const SalatHistory = ({ userId }: SalatHistoryProps) => {
  const { lang, t } = useLanguage();
  const navigate = useNavigate();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [data, setData] = useState<DayData[]>([]);
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);
  const [loading, setLoading] = useState(false);

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
    setSelectedDay(null);
  };

  const nextMonth = () => {
    const isCurrentMonth = year === now.getFullYear() && month === now.getMonth();
    if (isCurrentMonth) return;
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
    setSelectedDay(null);
  };

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
    const lastDay = new Date(year, month + 1, 0).getDate();
    const endDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

    supabase
      .from('salat_tracking')
      .select('*')
      .eq('user_id', userId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date')
      .then(({ data: rows }) => {
        setData((rows as DayData[]) || []);
        setLoading(false);
      });
  }, [userId, year, month]);

  if (!userId) {
    return (
      <Card>
        <CardContent className="p-6 text-center space-y-3">
          <LogIn className="h-10 w-10 mx-auto text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {t('ইতিহাস দেখতে লগইন করুন।', 'Log in to view your prayer history.')}
          </p>
          <Button size="sm" onClick={() => navigate('/auth')}>
            {t('লগইন', 'Log In')}
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Build calendar grid
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const dataMap = new Map(data.map(d => [d.date, d]));

  const getCount = (d: DayData) => fiveWaqt.filter(p => d[p]).length;

  // Stats
  const totalDaysWithData = data.length;
  const perfectDays = data.filter(d => getCount(d) === 5).length;
  const totalPrayers = data.reduce((sum, d) => sum + getCount(d), 0);
  const todayDate = now.getDate();
  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth();
  const elapsedDays = isCurrentMonth ? todayDate : daysInMonth;
  const maxPrayers = elapsedDays * 5;
  const pct = maxPrayers > 0 ? Math.round((totalPrayers / maxPrayers) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Month Navigator */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={prevMonth}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h3 className="text-base font-semibold text-primary">
          {monthNames[lang][month]} {year}
        </h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={nextMonth}
          disabled={isCurrentMonth}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Stats Card */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t('পারফেক্ট দিন', 'Perfect Days')}</span>
            <span className="font-semibold text-primary">{perfectDays}/{elapsedDays}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t('মোট নামাজ', 'Total Prayers')}</span>
            <span className="font-semibold">{totalPrayers}/{maxPrayers}</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{t('সম্পন্নতা', 'Completion')}</span>
              <span>{pct}%</span>
            </div>
            <Progress value={pct} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Calendar Grid */}
      <Card>
        <CardContent className="p-3">
          <div className="grid grid-cols-7 gap-1 text-center">
            {dayNames[lang].map(d => (
              <div key={d} className="text-[0.65rem] font-medium text-muted-foreground py-1">{d}</div>
            ))}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const dayData = dataMap.get(dateStr);
              const count = dayData ? getCount(dayData) : 0;
              const isFuture = isCurrentMonth && day > todayDate;
              const isSelected = selectedDay?.date === dateStr;

              let bg = 'bg-muted/50';
              if (!isFuture && dayData) {
                if (count === 5) bg = 'bg-green-500/20 text-green-700 dark:text-green-400';
                else if (count > 0) bg = 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400';
              }
              if (isFuture) bg = 'opacity-30';

              return (
                <button
                  key={day}
                  onClick={() => !isFuture && dayData && setSelectedDay(dayData)}
                  disabled={isFuture || !dayData}
                  className={`aspect-square rounded-md flex flex-col items-center justify-center text-xs transition-all ${bg} ${isSelected ? 'ring-2 ring-primary' : ''} ${!isFuture && dayData ? 'cursor-pointer hover:ring-1 hover:ring-primary/50' : ''}`}
                >
                  <span className="font-medium">{day}</span>
                  {!isFuture && dayData && (
                    <span className="text-[0.6rem] leading-none">{count}/5</span>
                  )}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Day Detail */}
      {selectedDay && (
        <Card className="border-primary/30">
          <CardContent className="p-4 space-y-2">
            <h4 className="text-sm font-semibold text-primary">
              {new Date(selectedDay.date + 'T00:00:00').toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US', {
                day: 'numeric', month: 'long', year: 'numeric',
              })}
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {fiveWaqt.map(p => (
                <div key={p} className="flex items-center gap-2 text-sm">
                  <span className={selectedDay[p] ? 'text-green-600' : 'text-destructive'}>
                    {selectedDay[p] ? '✓' : '✗'}
                  </span>
                  <span>{lang === 'bn' ? prayerLabels[p].bn : prayerLabels[p].en}</span>
                </div>
              ))}
              {selectedDay.taraweeh && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-green-600">✓</span>
                  <span>{t('তারাবীহ', 'Taraweeh')}</span>
                </div>
              )}
              {selectedDay.tahajjud && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-green-600">✓</span>
                  <span>{t('তাহাজ্জুদ', 'Tahajjud')}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {loading && (
        <p className="text-center text-sm text-muted-foreground">{t('লোড হচ্ছে...', 'Loading...')}</p>
      )}
    </div>
  );
};

export default SalatHistory;
