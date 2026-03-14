import { useState, useEffect } from 'react';
import { formatLocalDate } from '@/lib/utils';
import { hapticImpact, hapticNotification } from '@/hooks/useHaptics';
import { ImpactStyle } from '@capacitor/haptics';
import { NotificationType } from '@capacitor/haptics';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import SalatHistory from '@/components/SalatHistory';
import YearlyOverview from '@/components/YearlyOverview';

import StreakBadge from '@/components/StreakBadge';
import DailyPrayerReminder from '@/components/DailyPrayerReminder';
import { usePrayerReminder } from '@/hooks/usePrayerReminder';
import { useSalatSync, markPendingSync } from '@/hooks/useSalatSync';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { usePrayerStreak } from '@/hooks/usePrayerStreak';
import PageMeta from '@/components/PageMeta';

const fiveWaqt = [
  { key: 'fajr', bn: 'ফজর', en: 'Fajr' },
  { key: 'dhuhr', bn: 'যোহর', en: 'Dhuhr' },
  { key: 'asr', bn: 'আসর', en: 'Asr' },
  { key: 'maghrib', bn: 'মাগরিব', en: 'Maghrib' },
  { key: 'isha', bn: 'ইশা', en: 'Isha' },
] as const;

type PrayerKey = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha' | 'taraweeh' | 'tahajjud';

const isRamadan = () => {
  const now = new Date();
  const y = now.getFullYear();
  const start = new Date(y, 1, 17);
  const end = new Date(y, 2, 20);
  return now >= start && now <= end;
};

const SalatTracker = () => {
  const { lang, t } = useLanguage();
  const { toast } = useToast();
  const { isOnline } = useNetworkStatus();
  const ramadan = isRamadan();

  const [checked, setChecked] = useState<Record<PrayerKey, boolean>>({
    fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false, taraweeh: false, tahajjud: false,
  });
  const [user, setUser] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    () => localStorage.getItem('prayer_notifications') === 'true'
  );

  const streakData = usePrayerStreak(user);

  // Auto-sync localStorage ↔ cloud when logged in
  useSalatSync(user);

  const { permissionState, requestPermission } = usePrayerReminder(checked, notificationsEnabled);

  const toggleNotifications = () => {
    const next = !notificationsEnabled;
    setNotificationsEnabled(next);
    localStorage.setItem('prayer_notifications', String(next));
  };

  const todayStr = formatLocalDate(new Date());

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user?.id || null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user?.id || null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      supabase
        .from('salat_tracking')
        .select('*')
        .eq('user_id', user)
        .eq('date', todayStr)
        .maybeSingle()
        .then(({ data }) => {
          if (data) {
            setChecked({
              fajr: data.fajr, dhuhr: data.dhuhr, asr: data.asr,
              maghrib: data.maghrib, isha: data.isha, taraweeh: data.taraweeh,
              tahajjud: data.tahajjud,
            });
          }
        });
    } else {
      const saved = localStorage.getItem(`salat_${todayStr}`);
      if (saved) setChecked(JSON.parse(saved));
    }
  }, [user, todayStr]);

  const updatePrayer = async (key: PrayerKey, val: boolean) => {
    const updated = { ...checked, [key]: val };
    setChecked(updated);
    hapticImpact(ImpactStyle.Light);

    const allFive = fiveWaqt.every(p => updated[p.key]);
    const extraDone = ramadan ? (updated.taraweeh && updated.tahajjud) : updated.tahajjud;
    if (allFive && extraDone) {
      setShowCelebration(true);
      hapticNotification(NotificationType.Success);
    }

    // Always save to localStorage
    localStorage.setItem(`salat_${todayStr}`, JSON.stringify(updated));

    if (user && isOnline) {
      await supabase
        .from('salat_tracking')
        .upsert({ user_id: user, date: todayStr, ...updated }, { onConflict: 'user_id,date' });
    } else if (user && !isOnline) {
      markPendingSync();
    }
    streakData.refresh();
  };

  const resetAll = async () => {
    const reset: Record<PrayerKey, boolean> = {
      fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false, taraweeh: false, tahajjud: false,
    };
    setChecked(reset);
    setShowCelebration(false);
    hapticImpact(ImpactStyle.Medium);
    localStorage.setItem(`salat_${todayStr}`, JSON.stringify(reset));

    if (user && isOnline) {
      await supabase
        .from('salat_tracking')
        .upsert({ user_id: user, date: todayStr, ...reset }, { onConflict: 'user_id,date' });
    } else if (user && !isOnline) {
      markPendingSync();
    }
    streakData.refresh();
  };

  const fiveCount = fiveWaqt.filter(p => checked[p.key]).length;

  return (
    <div className="min-h-screen pb-28 md:pb-2 px-4 pt-4 space-y-4 animate-fade-in">
      <PageMeta
        title="নামাজ ট্র্যাকার - Salat Tracker"
        description="Track your daily prayers and streaks during Ramadan."
        keywords="salat tracker, নামাজ ট্র্যাকার, prayer tracking, daily prayers, streak"
      />
      <Tabs defaultValue="today" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="today" className="flex-1">{t('আজকে', 'Today')}</TabsTrigger>
          <TabsTrigger value="history" className="flex-1">{t('মাসিক', 'Monthly')}</TabsTrigger>
          <TabsTrigger value="yearly" className="flex-1">{t('বার্ষিক', 'Yearly')}</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4 mt-4">
          <StreakBadge streakData={streakData} />
          <DailyPrayerReminder
            checked={checked}
            notificationsEnabled={notificationsEnabled}
            onToggleNotifications={toggleNotifications}
            permissionState={permissionState}
            onRequestPermission={requestPermission}
          />
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-primary">{t('৫ ওয়াক্ত নামাজ', '5 Waqt Salat')}</h2>
            <Button variant="ghost" size="sm" onClick={resetAll} className="text-muted-foreground">
              <RotateCcw className="h-4 w-4 mr-1" />
              {t('রিসেট', 'Reset')}
            </Button>
          </div>

          <p className="text-xs text-destructive font-medium">
            {t('⚠️ নামাজ না পড়ে টিক দিবেন না!', "⚠️ Don't check without praying!")}
          </p>

          <Card>
            <CardContent className="p-4 space-y-3">
              {fiveWaqt.map(p => (
                <label key={p.key} className="flex items-center gap-3 cursor-pointer">
                  <Checkbox
                    checked={checked[p.key]}
                    onCheckedChange={(val) => updatePrayer(p.key, !!val)}
                    className="h-5 w-5"
                  />
                  <span className={`text-sm font-medium ${checked[p.key] ? 'text-primary line-through' : ''}`}>
                    {lang === 'bn' ? p.bn : p.en}
                  </span>
                  {checked[p.key] && <span className="text-primary text-xs">✓</span>}
                </label>
              ))}
            </CardContent>
          </Card>

          <div className="text-center text-sm text-muted-foreground">
            {t(`${fiveCount}/৫ ওয়াক্ত সম্পন্ন`, `${fiveCount}/5 prayers completed`)}
          </div>

          <Card className="border-primary/30">
            <CardContent className="p-4 space-y-3">
              <h3 className="font-bold text-primary text-sm">
                {ramadan
                  ? t('🌙 তারাবীহ ও তাহাজ্জুদ', '🌙 Taraweeh & Tahajjud')
                  : t('🌙 তাহাজ্জুদ', '🌙 Tahajjud')}
              </h3>
              {ramadan && (
                <label className="flex items-center gap-3 cursor-pointer">
                  <Checkbox
                    checked={checked.taraweeh}
                    onCheckedChange={(val) => updatePrayer('taraweeh', !!val)}
                    className="h-5 w-5"
                  />
                  <span className={`text-sm font-medium ${checked.taraweeh ? 'text-primary line-through' : ''}`}>
                    {t('তারাবীহ', 'Taraweeh')}
                  </span>
                  {checked.taraweeh && <span className="text-primary text-xs">✓</span>}
                </label>
              )}
              <label className="flex items-center gap-3 cursor-pointer">
                <Checkbox
                  checked={checked.tahajjud}
                  onCheckedChange={(val) => updatePrayer('tahajjud', !!val)}
                  className="h-5 w-5"
                />
                <span className={`text-sm font-medium ${checked.tahajjud ? 'text-primary line-through' : ''}`}>
                  {t('তাহাজ্জুদ', 'Tahajjud')}
                </span>
                {checked.tahajjud && <span className="text-primary text-xs">✓</span>}
              </label>
            </CardContent>
          </Card>

          {showCelebration && (
            <Card className="bg-gradient-to-br from-primary/20 to-accent/20 border-primary/30">
              <CardContent className="p-6 text-center">
                <p className="text-4xl mb-2">🎉</p>
                <p className="text-xl font-bold text-primary">
                  {t('মাশাআল্লাহ!', 'MashaAllah!')}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t('আজকের সব নামাজ আদায় করেছেন!', "You've completed all prayers today!")}
                </p>
              </CardContent>
            </Card>
          )}

          {!user && (
            <p className="text-xs text-muted-foreground bg-muted rounded-lg p-2">
              {t('⚠️ লগইন করলে আপনার ডেটা সব ডিভাইসে সংরক্ষিত থাকবে।', '⚠️ Log in to save your progress across devices.')}
            </p>
          )}
        </TabsContent>

        <TabsContent value="history" className="mt-4 space-y-4">
          
          <SalatHistory userId={user} streakData={streakData} />
        </TabsContent>

        <TabsContent value="yearly" className="mt-4">
          <YearlyOverview userId={user} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SalatTracker;
