import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { ChevronLeft, ChevronRight, Flame } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { usePrayerStreak } from '@/hooks/usePrayerStreak';
import { getLocalSalatDaysInRange } from '@/lib/localSalatStorage';

const fiveWaqt = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const;

type DayData = {
  date: string;
  fajr: boolean;
  dhuhr: boolean;
  asr: boolean;
  maghrib: boolean;
  isha: boolean;
};

const shortMonthNames = {
  bn: ['জানু', 'ফেব্রু', 'মার্চ', 'এপ্রি', 'মে', 'জুন', 'জুলা', 'আগ', 'সেপ্টে', 'অক্টো', 'নভে', 'ডিসে'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
};

interface YearlyOverviewProps {
  userId: string | null;
}

const YearlyOverview = ({ userId }: YearlyOverviewProps) => {
  const { lang, t } = useLanguage();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [data, setData] = useState<DayData[]>([]);
  const [loading, setLoading] = useState(false);
  const { currentStreak, longestStreak } = usePrayerStreak(userId);

  const isCurrentYear = year === now.getFullYear();

  useEffect(() => {
    setLoading(true);
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;

    if (userId) {
      supabase
        .from('salat_tracking')
        .select('date,fajr,dhuhr,asr,maghrib,isha')
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
  }, [userId, year]);

  const getCount = (d: DayData) => fiveWaqt.filter(p => d[p]).length;

  // Group by month
  const monthlyData = Array.from({ length: 12 }, (_, m) => {
    const monthRows = data.filter(d => {
      const monthNum = parseInt(d.date.split('-')[1], 10) - 1;
      return monthNum === m;
    });

    const daysInMonth = new Date(year, m + 1, 0).getDate();
    const isCurrentMonth = isCurrentYear && m === now.getMonth();
    const isFutureMonth = isCurrentYear && m > now.getMonth();
    const elapsedDays = isCurrentMonth ? now.getDate() : daysInMonth;
    const maxPrayers = elapsedDays * 5;
    const totalPrayers = monthRows.reduce((sum, d) => sum + getCount(d), 0);
    const pct = maxPrayers > 0 ? Math.round((totalPrayers / maxPrayers) * 100) : 0;
    const perfectDays = monthRows.filter(d => getCount(d) === 5).length;

    return {
      name: shortMonthNames[lang][m],
      pct: isFutureMonth ? 0 : pct,
      totalPrayers,
      maxPrayers: isFutureMonth ? 0 : maxPrayers,
      perfectDays,
      isFuture: isFutureMonth,
      elapsedDays: isFutureMonth ? 0 : elapsedDays,
    };
  });

  // Yearly totals
  const yearTotalPrayers = monthlyData.reduce((s, m) => s + m.totalPrayers, 0);
  const yearMaxPrayers = monthlyData.reduce((s, m) => s + m.maxPrayers, 0);
  const yearPct = yearMaxPrayers > 0 ? Math.round((yearTotalPrayers / yearMaxPrayers) * 100) : 0;
  const yearPerfectDays = monthlyData.reduce((s, m) => s + m.perfectDays, 0);

  const getBarColor = (pct: number, isFuture: boolean) => {
    if (isFuture) return 'hsl(var(--muted))';
    if (pct >= 80) return 'hsl(142, 71%, 45%)';
    if (pct >= 50) return 'hsl(48, 96%, 53%)';
    if (pct > 0) return 'hsl(25, 95%, 53%)';
    return 'hsl(var(--muted))';
  };

  return (
    <div className="space-y-4">
      {/* Year Navigator */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => setYear(y => y - 1)}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h3 className="text-base font-semibold text-primary">{year}</h3>
        <Button variant="ghost" size="icon" onClick={() => setYear(y => y + 1)} disabled={isCurrentYear}>
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

      {/* Yearly Stats */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t('পারফেক্ট দিন', 'Perfect Days')}</span>
            <span className="font-semibold text-primary">{yearPerfectDays}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t('মোট নামাজ', 'Total Prayers')}</span>
            <span className="font-semibold">{yearTotalPrayers}/{yearMaxPrayers}</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{t('বার্ষিক সম্পন্নতা', 'Yearly Completion')}</span>
              <span>{yearPct}%</span>
            </div>
            <Progress value={yearPct} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Bar Chart */}
      <Card>
        <CardContent className="p-4">
          <h4 className="text-sm font-semibold text-foreground mb-3">
            {t('মাসিক সম্পন্নতা %', 'Monthly Completion %')}
          </h4>
          {loading ? (
            <p className="text-center text-sm text-muted-foreground py-8">{t('লোড হচ্ছে...', 'Loading...')}</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  formatter={(value: number) => [`${value}%`, t('সম্পন্নতা', 'Completion')]}
                />
                <Bar dataKey="pct" radius={[4, 4, 0, 0]}>
                  {monthlyData.map((entry, idx) => (
                    <Cell key={idx} fill={getBarColor(entry.pct, entry.isFuture)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Monthly Breakdown List */}
      <Card>
        <CardContent className="p-4 space-y-2">
          <h4 className="text-sm font-semibold text-foreground mb-2">
            {t('মাসভিত্তিক বিবরণ', 'Monthly Breakdown')}
          </h4>
          {monthlyData.filter(m => !m.isFuture && m.maxPrayers > 0).map((m, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground w-10">{m.name}</span>
              <Progress value={m.pct} className="h-2 flex-1" />
              <span className="text-xs font-medium w-10 text-right">{m.pct}%</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default YearlyOverview;
