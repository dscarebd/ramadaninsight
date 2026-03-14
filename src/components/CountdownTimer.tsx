import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Props {
  targetTime: string; // "HH:MM" format
  label: string;
  nextDay?: boolean; // target is tomorrow
}

const toBengaliNum = (n: number): string => {
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(n).split('').map(d => bengaliDigits[parseInt(d)] || d).join('');
};

const CountdownTimer = ({ targetTime, label, nextDay = false }: Props) => {
  const { lang } = useLanguage();
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const [h, m] = targetTime.split(':').map(Number);
      const target = new Date(now);
      target.setHours(h, m, 0, 0);

      if (nextDay) {
        target.setDate(target.getDate() + 1);
      }

      let diff = target.getTime() - now.getTime();
      if (diff <= 0) diff = 0;

      setTimeLeft({
        hours: Math.floor(diff / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetTime, nextDay]);

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="text-center">
      <p className="text-xs text-muted-foreground mb-1 font-medium">{label}</p>
      <div className="flex items-center justify-center gap-1">
        {[
          { val: timeLeft.hours, labelBn: 'ঘন্টা', labelEn: 'hr' },
          { val: timeLeft.minutes, labelBn: 'মিনিট', labelEn: 'min' },
          { val: timeLeft.seconds, labelBn: 'সেকেন্ড', labelEn: 'sec' },
        ].map((unit, i) => (
          <div key={i} className="flex flex-col items-center">
            <span className="bg-primary text-primary-foreground rounded-lg px-2 py-1 text-xl font-bold tabular-nums min-w-[3rem] transition-all duration-300 font-bengali-num">
              {lang === 'bn' ? toBengaliNum(Number(pad(unit.val))) : pad(unit.val)}
            </span>
            <span className="text-[9px] text-muted-foreground mt-0.5">
              {lang === 'bn' ? unit.labelBn : unit.labelEn}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountdownTimer;
