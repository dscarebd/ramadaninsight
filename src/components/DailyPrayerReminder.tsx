import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Bell, BellOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

const prayerSchedule = [
  { key: 'fajr', bn: 'ফজর', en: 'Fajr', hourAfter: 7 },
  { key: 'dhuhr', bn: 'যোহর', en: 'Dhuhr', hourAfter: 14 },
  { key: 'asr', bn: 'আসর', en: 'Asr', hourAfter: 17 },
  { key: 'maghrib', bn: 'মাগরিব', en: 'Maghrib', hourAfter: 19 },
  { key: 'isha', bn: 'ইশা', en: 'Isha', hourAfter: 21 },
];

interface DailyPrayerReminderProps {
  checked: Record<string, boolean>;
  notificationsEnabled: boolean;
  onToggleNotifications: () => void;
  permissionState: string;
  onRequestPermission: () => void;
}

const DailyPrayerReminder = ({
  checked,
  notificationsEnabled,
  onToggleNotifications,
  permissionState,
  onRequestPermission,
}: DailyPrayerReminderProps) => {
  const { t } = useLanguage();
  const hour = new Date().getHours();

  // Find prayers that are overdue (past their expected time) and not completed
  const missedToday = prayerSchedule.filter(
    (p) => hour >= p.hourAfter && !checked[p.key]
  );

  if (missedToday.length === 0) return null;

  return (
    <Card className="border-destructive/30 bg-destructive/5">
      <CardContent className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-destructive" />
            <h4 className="text-sm font-semibold text-destructive">
              {t('আজকের বাকি নামাজ', "Today's Missed Prayers")}
            </h4>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={() => {
              if (permissionState === 'default') {
                onRequestPermission();
              }
              onToggleNotifications();
            }}
          >
            {notificationsEnabled ? (
              <>
                <Bell className="h-3 w-3 mr-1" />
                {t('নোটিফিকেশন চালু', 'Notifications On')}
              </>
            ) : (
              <>
                <BellOff className="h-3 w-3 mr-1" />
                {t('নোটিফিকেশন বন্ধ', 'Notifications Off')}
              </>
            )}
          </Button>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {missedToday.map((p) => (
            <span
              key={p.key}
              className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded-full font-medium"
            >
              {t(p.bn, p.en)}
            </span>
          ))}
        </div>

        <p className="text-xs text-muted-foreground">
          {t(
            'এখনও সময় আছে! এখনই নামাজ আদায় করুন।',
            "There's still time! Pray now."
          )}
        </p>
      </CardContent>
    </Card>
  );
};

export default DailyPrayerReminder;
