import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { ChevronLeft, ChevronRight, Flame } from 'lucide-react';
import { getLocalSalatDaysInRange } from '@/lib/localSalatStorage';
import { Checkbox } from '@/components/ui/checkbox';

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
  streakData: { currentStreak: number; longestStreak: number; loading: boolean; refresh: () => void };
}

const SalatHistory = ({ userId, streakData }: SalatHistoryProps) => {
  const { lang, t } = useLanguage();
  const { currentStreak, longestStreak, refresh: refreshStreak } = streakData;
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [data, setData] = useState<DayData[]>([]);
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTogglePrayer = useCallback(async (prayer: typeof fiveWaqt[number]) => {
    if (!selectedDay) return;
    const updated = { ...selectedDay, [prayer]: !selectedDay[prayer] };
    setSelectedDay(updated);

    // Update localStorage
    const { date, ...prayerData } = updated;
    localStorage.setItem(`salat_${date}`, JSON.stringify(prayerData));

    // Update in-memory data
    setData(prev => {
      const exists = prev.find(d => d.date === date);
      if (exists) return prev.map(d => d.date === date ? updated : d);
      return [...prev, updated].sort((a, b) => a.date.localeCompare(b.date));
    });

    // Sync to cloud if logged in
    if (userId) {
      await supabase
        .from('salat_tracking')
        .upsert({
          user_id: userId,
          date,
          fajr: updated.fajr,
          dhuhr: updated.dhuhr,
          asr: updated.asr,
          maghrib: updated.maghrib,
          isha: updated.isha,
          taraweeh: updated.taraweeh,
          tahajjud: updated.tahajjud,
        }, { onConflict: 'user_id,date' });
    }

    // Recalculate streak
    refreshStreak();
  }, [selectedDay, userId, refreshStreak]);

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
    setLoading(true);
    const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
    const lastDay = new Date(year, month + 1, 0).getDate();
    const endDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

    if (userId) {
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
    } else {
      const localDays = getLocalSalatDaysInRange(startDate, endDate);
      setData(localDays);
      setLoading(false);
    }
  }, [userId, year, month]);

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

      {/* Streak Card */}
      <Card className="border-primary/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 flex-1">
              <Flame className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-xs text-muted-foreground">{t('বর্তমান স্ট্রিক', 'Current Streak')}</p>
                <p className="text-lg font-bold text-primary font-bengali-num">{currentStreak} {t('দিন', 'days')}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-1">
              <Flame className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">{t('সর্বোচ্চ স্ট্রিক', 'Best Streak')}</p>
                <p className="text-lg font-bold">{longestStreak} {t('দিন', 'days')}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
                  onClick={() => {
                    if (isFuture) return;
                    const existing = dataMap.get(dateStr);
                    setSelectedDay(existing || {
                      date: dateStr, fajr: false, dhuhr: false, asr: false,
                      maghrib: false, isha: false, taraweeh: false, tahajjud: false,
                    });
                  }}
                  disabled={isFuture}
                  className={`aspect-square rounded-md flex flex-col items-center justify-center text-xs transition-all ${bg} ${isSelected ? 'ring-2 ring-primary' : ''} ${!isFuture ? 'cursor-pointer hover:ring-1 hover:ring-primary/50' : ''}`}
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
                <div
                  key={p}
                  className="flex items-center gap-2 text-sm cursor-pointer select-none rounded-md p-1.5 -m-1.5 hover:bg-accent/50 transition-colors"
                  onClick={() => handleTogglePrayer(p)}
                >
                  <Checkbox
                    checked={selectedDay[p]}
                    className="pointer-events-none"
                  />
                  <span>{lang === 'bn' ? prayerLabels[p].bn : prayerLabels[p].en}</span>
                </div>
              ))}
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
