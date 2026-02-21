import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePrayerTimes } from '@/hooks/usePrayerTimes';
import DistrictSelector from '@/components/DistrictSelector';
import CountdownTimer from '@/components/CountdownTimer';
import { sehriNiyat, iftarDua } from '@/data/duas';
import { Card, CardContent } from '@/components/ui/card';
import { Moon, Sun, Loader2 } from 'lucide-react';

const toBengaliNum = (n: number | string): string => {
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(n).split('').map(d => bengaliDigits[parseInt(d)] || d).join('');
};

const Index = () => {
  const { lang, t } = useLanguage();
  const [district, setDistrict] = useState(() => localStorage.getItem('district') || 'dhaka');

  useEffect(() => {
    localStorage.setItem('district', district);
  }, [district]);

  const { ramadanDays, todayData, todayIndex, isLoading } = usePrayerTimes(district);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center pb-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const rozaCount = todayIndex + 1;
  const totalRoza = ramadanDays.length || 30;
  const now = new Date();
  const currentHM = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
  const sehriTime = todayData?.sehriEnd || '04:45';
  const iftarTime = todayData?.iftarStart || '18:10';
  const isFasting = currentHM >= sehriTime && currentHM < iftarTime;

  return (
    <div className="min-h-screen pb-20 px-4 pt-4 space-y-4">
      {/* District Selector */}
      <DistrictSelector value={district} onChange={setDistrict} />

      {/* Status Banner */}
      <div className={`rounded-xl p-3 text-center font-semibold text-sm ${isFasting ? 'bg-primary/10 text-primary' : 'bg-accent/20 text-accent-foreground'}`}>
        {isFasting
          ? t('🌙 রোজা চলছে', '🌙 Fasting in Progress')
          : t('☀️ রোজা শুরু হয়নি / শেষ হয়েছে', '☀️ Fasting not started / ended')}
      </div>

      {/* Roza Count & Hijri Date */}
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="p-4 text-center space-y-1">
          <p className="text-3xl font-bold text-primary">
            {t(`রোজা ${toBengaliNum(rozaCount)}/${toBengaliNum(totalRoza)}`, `Roza ${rozaCount}/${totalRoza}`)}
          </p>
          {todayData && (
            <>
              <p className="text-sm text-muted-foreground">{todayData.hijriMonth} {lang === 'bn' ? toBengaliNum(todayData.hijriDay) : todayData.hijriDay}, {lang === 'bn' ? toBengaliNum(todayData.hijriYear) : todayData.hijriYear}</p>
              <p className="text-xs text-muted-foreground">{todayData.gregorianDate}</p>
            </>
          )}
        </CardContent>
      </Card>

      {/* Today's Times */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="border-primary/30">
          <CardContent className="p-4 text-center">
            <Moon className="h-6 w-6 text-primary mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">{t('সেহরি শেষ', 'Sehri End')}</p>
            <p className="text-2xl font-bold text-primary">{lang === 'bn' ? toBengaliNum(sehriTime) : sehriTime}</p>
          </CardContent>
        </Card>
        <Card className="border-accent/30">
          <CardContent className="p-4 text-center">
            <Sun className="h-6 w-6 text-accent mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">{t('ইফতার', 'Iftar')}</p>
            <p className="text-2xl font-bold text-accent-foreground">{lang === 'bn' ? toBengaliNum(iftarTime) : iftarTime}</p>
          </CardContent>
        </Card>
      </div>

      {/* Countdown */}
      <Card>
        <CardContent className="p-4">
          {isFasting ? (
            <CountdownTimer targetTime={iftarTime} label={t('ইফতার পর্যন্ত বাকি', 'Time until Iftar')} />
          ) : (
            <CountdownTimer targetTime={sehriTime} label={t('সেহরি পর্যন্ত বাকি', 'Time until Sehri')} />
          )}
        </CardContent>
      </Card>

      {/* Sehri Niyat */}
      <Card>
        <CardContent className="p-4 space-y-2">
          <h3 className="font-bold text-primary text-sm">{t('সেহরির নিয়ত', 'Sehri Intention (Niyat)')}</h3>
          <p className="text-right text-lg leading-loose font-arabic" dir="rtl">{sehriNiyat.arabic}</p>
          <p className="text-sm text-muted-foreground italic">
            {lang === 'bn' ? sehriNiyat.transliterationBn : sehriNiyat.transliterationEn}
          </p>
          <p className="text-sm">{lang === 'bn' ? sehriNiyat.meaningBn : sehriNiyat.meaningEn}</p>
        </CardContent>
      </Card>

      {/* Iftar Dua */}
      <Card>
        <CardContent className="p-4 space-y-2">
          <h3 className="font-bold text-primary text-sm">{t('ইফতারের দোয়া', 'Iftar Dua')}</h3>
          <p className="text-right text-lg leading-loose font-arabic" dir="rtl">{iftarDua.arabic}</p>
          <p className="text-sm text-muted-foreground italic">
            {lang === 'bn' ? iftarDua.transliterationBn : iftarDua.transliterationEn}
          </p>
          <p className="text-sm">{lang === 'bn' ? iftarDua.meaningBn : iftarDua.meaningEn}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
