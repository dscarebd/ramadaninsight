import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const prayers = [
  { key: 'fajr', bn: 'ফজর', en: 'Fajr' },
  { key: 'dhuhr', bn: 'যোহর', en: 'Dhuhr' },
  { key: 'asr', bn: 'আসর', en: 'Asr' },
  { key: 'maghrib', bn: 'মাগরিব', en: 'Maghrib' },
  { key: 'isha', bn: 'ইশা', en: 'Isha' },
  { key: 'taraweeh', bn: 'তারাবীহ', en: 'Taraweeh' },
] as const;

type PrayerKey = typeof prayers[number]['key'];

const SalatTracker = () => {
  const { lang, t } = useLanguage();
  const { toast } = useToast();
  const [checked, setChecked] = useState<Record<PrayerKey, boolean>>({
    fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false, taraweeh: false,
  });
  const [user, setUser] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user?.id || null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user?.id || null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Load from DB or localStorage
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

    // Check celebration
    const allDone = Object.values(updated).every(Boolean);
    if (allDone) setShowCelebration(true);

    if (user) {
      await supabase
        .from('salat_tracking')
        .upsert({ user_id: user, date: todayStr, ...updated }, { onConflict: 'user_id,date' });
    } else {
      localStorage.setItem(`salat_${todayStr}`, JSON.stringify(updated));
    }
  };

  const resetAll = async () => {
    const reset = { fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false, taraweeh: false };
    setChecked(reset);
    setShowCelebration(false);
    if (user) {
      await supabase
        .from('salat_tracking')
        .upsert({ user_id: user, date: todayStr, ...reset }, { onConflict: 'user_id,date' });
    } else {
      localStorage.removeItem(`salat_${todayStr}`);
    }
  };

  const checkedCount = Object.values(checked).filter(Boolean).length;

  return (
    <div className="min-h-screen pb-20 px-4 pt-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-primary">{t('৫ ওয়াক্ত নামাজ', '5 Waqt Salat')}</h2>
        <Button variant="ghost" size="sm" onClick={resetAll} className="text-muted-foreground">
          <RotateCcw className="h-4 w-4 mr-1" />
          {t('রিসেট', 'Reset')}
        </Button>
      </div>

      {!user && (
        <p className="text-xs text-muted-foreground bg-muted rounded-lg p-2">
          {t('⚠️ লগইন করলে আপনার ডেটা সব ডিভাইসে সংরক্ষিত থাকবে।', '⚠️ Log in to save your progress across devices.')}
        </p>
      )}

      <p className="text-xs text-destructive font-medium">
        {t('⚠️ নামাজ না পড়ে টিক দিবেন না!', "⚠️ Don't check without praying!")}
      </p>

      <Card>
        <CardContent className="p-4 space-y-3">
          {prayers.map(p => (
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

      {/* Progress */}
      <div className="text-center text-sm text-muted-foreground">
        {t(`${checkedCount}/৬ ওয়াক্ত সম্পন্ন`, `${checkedCount}/6 prayers completed`)}
      </div>

      {/* Celebration */}
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
    </div>
  );
};

export default SalatTracker;
