import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { CalendarDays, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  userId: string;
}

const WeeklySummary = ({ userId }: WeeklySummaryProps) => {
  const { t } = useLanguage();
  const [data, setData] = useState<DayRow[]>([]);
  const [dismissed, setDismissed] = useState(false);
  const [loading, setLoading] = useState(true);

  const today = new Date();
  const dismissKey = `weekly_summary_dismissed_${today.toISOString().split('T')[0]}`;

  useEffect(() => {
    if (localStorage.getItem(dismissKey)) {
      setDismissed(true);
      setLoading(false);
      return;
    }

    // Get last 7 days
    const end = new Date(today);
    end.setDate(end.getDate() - 1); // yesterday
    const start = new Date(end);
    start.setDate(start.getDate() - 6); // 7 days ending yesterday

    const startStr = start.toISOString().split('T')[0];
    const endStr = end.toISOString().split('T')[0];

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
  }, [userId]);

  const handleDismiss = () => {
    localStorage.setItem(dismissKey, 'true');
    setDismissed(true);
  };

  if (dismissed || loading) return null;

  const totalPrayers = data.reduce((sum, d) => sum + fiveWaqt.filter(p => d[p]).length, 0);
  const maxPrayers = 7 * 5; // 7 days × 5 prayers
  const pct = Math.round((totalPrayers / maxPrayers) * 100);
  const perfectDays = data.filter(d => fiveWaqt.every(p => d[p])).length;
  const missedPrayers = maxPrayers - totalPrayers;

  // Count missed per prayer
  const missedByPrayer = fiveWaqt.map(p => ({
    key: p,
    missed: 7 - data.filter(d => d[p]).length,
  })).filter(p => p.missed > 0);

  const prayerNamesBn: Record<string, string> = {
    fajr: 'ফজর', dhuhr: 'যোহর', asr: 'আসর', maghrib: 'মাগরিব', isha: 'ইশা',
  };

  // Don't show if perfect week
  if (pct === 100) return null;

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
              {t('সবচেয়ে বেশি মিস:', 'Most missed:')}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {missedByPrayer.sort((a, b) => b.missed - a.missed).map(p => (
                <span key={p.key} className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded-full">
                  {t(prayerNamesBn[p.key], p.key.charAt(0).toUpperCase() + p.key.slice(1))} ({p.missed})
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WeeklySummary;
