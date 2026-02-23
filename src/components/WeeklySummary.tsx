import { useState, useEffect } from 'react';
import { formatLocalDate } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { CalendarDays, X, Check, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { getLocalSalatDaysInRange } from '@/lib/localSalatStorage';
import { useToast } from '@/hooks/use-toast';

const fiveWaqt = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const;

type DayRow = {
  date: string;
  fajr: boolean;
  dhuhr: boolean;
  asr: boolean;
  maghrib: boolean;
  isha: boolean;
};

interface WeeklySummaryProps {
  userId: string | null;
}

const QAZA_KEY_PREFIX = 'qaza_weekly_';

const prayerNamesBn: Record<string, string> = {
  fajr: 'ফজর', dhuhr: 'যোহর', asr: 'আসর', maghrib: 'মাগরিব', isha: 'ইশা',
};

const formatDateShort = (dateStr: string, lang: string) => {
  const d = new Date(dateStr + 'T00:00:00');
  const day = d.getDate();
  const monthEn = d.toLocaleString('en', { month: 'short' });
  const monthBn = d.toLocaleString('bn', { month: 'short' });
  return lang === 'bn' ? `${day} ${monthBn}` : `${day} ${monthEn}`;
};

const WeeklySummary = ({ userId }: WeeklySummaryProps) => {
  const { lang, t } = useLanguage();
  const { toast } = useToast();
  const [data, setData] = useState<DayRow[]>([]);
  const [dismissed, setDismissed] = useState(false);
  const [loading, setLoading] = useState(true);
  // Keys are "prayer_date" e.g. "fajr_2026-02-17"
  const [qazaDone, setQazaDone] = useState<Record<string, boolean>>({});

  const today = new Date();
  const dismissKey = `weekly_summary_dismissed_${formatLocalDate(today)}`;
  const qazaStorageKey = `${QAZA_KEY_PREFIX}${formatLocalDate(today)}`;

  useEffect(() => {
    const saved = localStorage.getItem(qazaStorageKey);
    if (saved) {
      try { setQazaDone(JSON.parse(saved)); } catch {}
    }
  }, [qazaStorageKey]);

  useEffect(() => {
    if (localStorage.getItem(dismissKey)) {
      setDismissed(true);
      setLoading(false);
      return;
    }

    const end = new Date(today);
    end.setDate(end.getDate() - 1);
    const start = new Date(end);
    start.setDate(start.getDate() - 6);

    const startStr = formatLocalDate(start);
    const endStr = formatLocalDate(end);

    if (userId) {
      supabase
        .from('salat_tracking')
        .select('date,fajr,dhuhr,asr,maghrib,isha')
        .eq('user_id', userId)
        .gte('date', startStr)
        .lte('date', endStr)
        .order('date')
        .then(({ data: rows }) => {
          setData((rows as DayRow[]) || []);
          setLoading(false);
        });
    } else {
      const localDays = getLocalSalatDaysInRange(startStr, endStr);
      setData(localDays);
      setLoading(false);
    }
  }, [userId]);

  const handleDismiss = () => {
    localStorage.setItem(dismissKey, 'true');
    setDismissed(true);
  };

  const markAllDone = (prayer: string, dates: string[]) => {
    const updated = { ...qazaDone };
    dates.forEach(d => { updated[`${prayer}_${d}`] = true; });
    setQazaDone(updated);
    localStorage.setItem(qazaStorageKey, JSON.stringify(updated));
    toast({
      title: t('সব কাযা আদায় করেছেন!', 'All qaza completed!'),
      description: t(prayerNamesBn[prayer], prayer.charAt(0).toUpperCase() + prayer.slice(1)),
    });
  };

  const toggleQazaDate = (prayer: string, date: string) => {
    const key = `${prayer}_${date}`;
    const wasDone = qazaDone[key];
    const updated = { ...qazaDone, [key]: !wasDone };
    setQazaDone(updated);
    localStorage.setItem(qazaStorageKey, JSON.stringify(updated));

    if (!wasDone) {
      toast({
        title: t('কাযা আদায় করেছেন!', 'Qaza completed!'),
        description: t(
          `${prayerNamesBn[prayer]} - ${formatDateShort(date, 'bn')}`,
          `${prayer.charAt(0).toUpperCase() + prayer.slice(1)} - ${formatDateShort(date, 'en')}`
        ),
      });
    } else {
      toast({
        title: t('কাযা বাতিল করা হয়েছে', 'Qaza undone'),
        description: t(
          `${prayerNamesBn[prayer]} - ${formatDateShort(date, 'bn')}`,
          `${prayer.charAt(0).toUpperCase() + prayer.slice(1)} - ${formatDateShort(date, 'en')}`
        ),
        variant: 'destructive',
      });
    }
  };
  // Compute stats (must be before hooks that depend on them)
  const totalPrayedOnTime = data.reduce((sum, d) => sum + fiveWaqt.filter(p => d[p]).length, 0);
  const maxPrayers = 7 * 5;
  const perfectDays = data.filter(d => fiveWaqt.every(p => d[p])).length;

  const allDates: string[] = [];
  {
    const end = new Date(today);
    end.setDate(end.getDate() - 1);
    for (let i = 6; i >= 0; i--) {
      const d = new Date(end);
      d.setDate(d.getDate() - i);
      allDates.push(formatLocalDate(d));
    }
  }
  const dataByDate = Object.fromEntries(data.map(d => [d.date, d]));

  const missedByPrayer = fiveWaqt.map(p => {
    const missedDates = allDates.filter(date => {
      const row = dataByDate[date];
      return !row || !row[p];
    });
    return { key: p, missedDates, total: missedDates.length };
  }).filter(p => p.total > 0);

  const totalQazaCount = missedByPrayer.reduce((s, p) =>
    s + p.missedDates.filter(d => qazaDone[`${p.key}_${d}`]).length, 0);
  const totalCompleted = totalPrayedOnTime + totalQazaCount;
  const pct = Math.round((totalCompleted / maxPrayers) * 100);
  const missedPrayers = maxPrayers - totalCompleted;
  const allQazaDone = pct === 100 && totalPrayedOnTime < maxPrayers;
  const totalMissedDates = missedByPrayer.reduce((s, p) => s + p.total, 0);
  const totalQazaCompleted = totalQazaCount;

  // Auto-dismiss 3s after all qaza completed
  useEffect(() => {
    if (allQazaDone && !dismissed) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [allQazaDone, dismissed]);

  if (dismissed || loading) return null;

  return (
    <>
    <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-primary" />
            <h4 className="text-sm font-semibold text-primary">
              {t('গত সপ্তাহের সারাংশ', 'Last Week Summary')}
            </h4>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleDismiss}>
            <X className="h-3 w-3" />
          </Button>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{t('সম্পন্নতা', 'Completion')}</span>
            <span>{pct}%</span>
          </div>
          <Progress value={pct} className="h-2" />
        </div>

        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">
            {t(`পারফেক্ট দিন: ${perfectDays}/৭`, `Perfect days: ${perfectDays}/7`)}
          </span>
          <span className="text-muted-foreground">
            {t(`মিস: ${missedPrayers} নামাজ`, `Missed: ${missedPrayers} prayers`)}
          </span>
        </div>

        
      </CardContent>
    </Card>

    {missedByPrayer.length > 0 && (
      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-full flex items-center justify-center gap-1 text-xs text-muted-foreground h-7">
            {t('কাযা ট্র্যাকিং', 'Qaza Tracking')}
            {totalQazaCompleted > 0 && ` (${totalQazaCompleted}/${totalMissedDates})`}
            <ChevronDown className="h-3 w-3 transition-transform [[data-state=open]_&]:rotate-180" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Card className="border-primary/20">
            <CardContent className="p-3 space-y-2">
              <p className="text-xs text-muted-foreground">
                {t('ট্যাপ করে কাযা আপডেট করুন:', 'Tap to mark qaza:')}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {missedByPrayer.sort((a, b) => b.total - a.total).map(p => {
                  const doneCount = p.missedDates.filter(d => qazaDone[`${p.key}_${d}`]).length;
                  const allDone = doneCount === p.total;
                  const partial = doneCount > 0 && !allDone;

                  return (
                    <Popover key={p.key}>
                      <PopoverTrigger asChild>
                        <button
                          className={`text-xs px-2.5 py-1 rounded-full transition-all duration-300 flex items-center gap-1 active:scale-95 ${
                            allDone
                              ? 'bg-primary/15 text-primary border border-primary/30'
                              : partial
                                ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30'
                                : 'bg-destructive/10 text-destructive border border-destructive/20'
                          }`}
                        >
                          {allDone && <Check className="h-3 w-3" />}
                          {t(prayerNamesBn[p.key], p.key.charAt(0).toUpperCase() + p.key.slice(1))}
                          {' '}({doneCount}/{p.total})
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-56 p-3 z-50 bg-popover" align="start">
                        <p className="text-xs font-semibold mb-2">
                          {t(
                            `${prayerNamesBn[p.key]} কাযা`,
                            `${p.key.charAt(0).toUpperCase() + p.key.slice(1)} Qaza`
                          )}
                        </p>
                        <div className="space-y-2">
                          {p.missedDates.map(date => {
                            const qKey = `${p.key}_${date}`;
                            const done = !!qazaDone[qKey];
                            return (
                              <label key={date} className="flex items-center gap-2 cursor-pointer">
                                <Checkbox
                                  checked={done}
                                  onCheckedChange={() => toggleQazaDate(p.key, date)}
                                  className="h-4 w-4"
                                />
                                <span className={`text-xs ${done ? 'text-primary line-through' : 'text-foreground'}`}>
                                  {formatDateShort(date, lang)}
                                </span>
                                {done && <Check className="h-3 w-3 text-primary" />}
                              </label>
                            );
                          })}
                        </div>
                        {doneCount < p.total && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full mt-2 text-xs h-7"
                            onClick={() => markAllDone(p.key, p.missedDates)}
                          >
                            {t('সব কাযা আদায়', 'Mark all as done')}
                          </Button>
                        )}
                      </PopoverContent>
                    </Popover>
                  );
                })}
              </div>
              {totalQazaCompleted > 0 && (
                <p className="text-xs text-primary font-medium">
                  {t(
                    `✅ ${totalQazaCompleted}/${totalMissedDates} কাযা আদায় সম্পন্ন`,
                    `✅ ${totalQazaCompleted}/${totalMissedDates} qaza completed`
                  )}
                </p>
              )}
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    )}
  </>
  );
};

export default WeeklySummary;
