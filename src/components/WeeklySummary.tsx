import { useState, useEffect } from 'react';
import { formatLocalDate } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { CalendarDays, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

const WeeklySummary = ({ userId }: WeeklySummaryProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [data, setData] = useState<DayRow[]>([]);
  const [dismissed, setDismissed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [qazaDone, setQazaDone] = useState<Record<string, boolean>>({});

  const today = new Date();
  const dismissKey = `weekly_summary_dismissed_${formatLocalDate(today)}`;
  const qazaStorageKey = `${QAZA_KEY_PREFIX}${formatLocalDate(today)}`;

  // Load qaza state from localStorage
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

  const toggleQaza = (prayerKey: string) => {
    const updated = { ...qazaDone, [prayerKey]: !qazaDone[prayerKey] };
    setQazaDone(updated);
    localStorage.setItem(qazaStorageKey, JSON.stringify(updated));
    
    if (!qazaDone[prayerKey]) {
      toast({
        title: t('কাযা আদায় করেছেন!', 'Qaza completed!'),
        description: t('মাশাআল্লাহ! আল্লাহ কবুল করুন।', 'MashaAllah! May Allah accept it.'),
      });
    } else {
      toast({
        title: t('কাযা বাতিল করা হয়েছে', 'Qaza undone'),
        description: t('কাযা নামাজ এখনো বাকি আছে।', 'Qaza prayer is still pending.'),
        variant: 'destructive',
      });
    }
  };

  if (dismissed || loading) return null;

  const totalPrayers = data.reduce((sum, d) => sum + fiveWaqt.filter(p => d[p]).length, 0);
  const maxPrayers = 7 * 5;
  const pct = Math.round((totalPrayers / maxPrayers) * 100);
  const perfectDays = data.filter(d => fiveWaqt.every(p => d[p])).length;
  const missedPrayers = maxPrayers - totalPrayers;

  const missedByPrayer = fiveWaqt.map(p => ({
    key: p,
    missed: 7 - data.filter(d => d[p]).length,
  })).filter(p => p.missed > 0);

  const prayerNamesBn: Record<string, string> = {
    fajr: 'ফজর', dhuhr: 'যোহর', asr: 'আসর', maghrib: 'মাগরিব', isha: 'ইশা',
  };

  if (pct === 100) return null;

  const qazaCompleted = missedByPrayer.filter(p => qazaDone[p.key]).length;
  const totalMissedTypes = missedByPrayer.length;

  return (
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

        {missedByPrayer.length > 0 && (
          <div className="pt-1 border-t border-border">
            <p className="text-xs text-muted-foreground mb-1">
              {t('সবচেয়ে বেশি মিস (ট্যাপ করে কাযা আপডেট করুন):', 'Most missed (tap to mark qaza):')}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {missedByPrayer.sort((a, b) => b.missed - a.missed).map(p => (
                <button
                  key={p.key}
                  onClick={() => toggleQaza(p.key)}
                  className={`text-xs px-2.5 py-1 rounded-full transition-all duration-300 flex items-center gap-1 active:scale-95 ${
                    qazaDone[p.key]
                      ? 'bg-primary/15 text-primary border border-primary/30'
                      : 'bg-destructive/10 text-destructive border border-destructive/20'
                  }`}
                >
                  {qazaDone[p.key] && <Check className="h-3 w-3" />}
                  {t(prayerNamesBn[p.key], p.key.charAt(0).toUpperCase() + p.key.slice(1))} ({p.missed})
                </button>
              ))}
            </div>
            {qazaCompleted > 0 && (
              <p className="text-xs text-primary mt-2 font-medium">
                {t(
                  `✅ ${qazaCompleted}/${totalMissedTypes} কাযা আদায় সম্পন্ন`,
                  `✅ ${qazaCompleted}/${totalMissedTypes} qaza completed`
                )}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WeeklySummary;
