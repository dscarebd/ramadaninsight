import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { usePrayerStreak } from '@/hooks/usePrayerStreak';

const milestones = [
  { days: 365, emoji: '👑', bn: 'আল্লাহর প্রিয় বান্দা!', en: "Allah's Beloved Servant!", color: 'from-yellow-500/20 to-amber-500/20 border-yellow-500/40' },
  { days: 100, emoji: '🏆', bn: 'অবিশ্বাসনীয় ধারাবাহিকতা!', en: 'Incredible Consistency!', color: 'from-purple-500/20 to-pink-500/20 border-purple-500/40' },
  { days: 60, emoji: '💎', bn: 'দৃঢ় ঈমানের পরিচয়!', en: 'Sign of Strong Faith!', color: 'from-blue-500/20 to-cyan-500/20 border-blue-500/40' },
  { days: 30, emoji: '⭐', bn: 'এক মাস পূর্ণ! সুবহানাল্লাহ!', en: 'One Month Complete! SubhanAllah!', color: 'from-primary/20 to-accent/20 border-primary/40' },
  { days: 14, emoji: '🌟', bn: 'দুই সপ্তাহ! চালিয়ে যান!', en: 'Two Weeks! Keep Going!', color: 'from-emerald-500/20 to-green-500/20 border-emerald-500/40' },
  { days: 7, emoji: '🔥', bn: 'এক সপ্তাহ! মাশাআল্লাহ!', en: 'One Week! MashaAllah!', color: 'from-orange-500/20 to-red-500/20 border-orange-500/40' },
  { days: 3, emoji: '🌱', bn: 'ভালো শুরু! থামবেন না!', en: 'Great Start! Keep It Up!', color: 'from-green-500/10 to-emerald-500/10 border-green-500/30' },
];

interface StreakBadgeProps {
  userId: string;
}

const StreakBadge = ({ userId }: StreakBadgeProps) => {
  const { t } = useLanguage();
  const { currentStreak, longestStreak, loading } = usePrayerStreak(userId);

  if (loading || currentStreak < 3) return null;

  // Find the highest milestone achieved
  const achieved = milestones.find(m => currentStreak >= m.days);
  if (!achieved) return null;

  // Determine next milestone
  const currentIdx = milestones.indexOf(achieved);
  const nextMilestone = currentIdx > 0 ? milestones[currentIdx - 1] : null;
  const daysToNext = nextMilestone ? nextMilestone.days - currentStreak : null;

  return (
    <Card className={`bg-gradient-to-br ${achieved.color} border`}>
      <CardContent className="p-4">
        <div className="text-center space-y-1.5">
          <p className="text-3xl">{achieved.emoji}</p>
          <p className="text-base font-bold text-primary">
            {currentStreak} {t('দিনের স্ট্রিক!', 'Day Streak!')}
          </p>
          <p className="text-sm text-foreground/80">
            {t(achieved.bn, achieved.en)}
          </p>
          {longestStreak > currentStreak && (
            <p className="text-xs text-muted-foreground pt-1">
              {t(
                `🏅 সর্বোচ্চ স্ট্রিক: ${longestStreak} দিন`,
                `🏅 Longest streak: ${longestStreak} days`
              )}
            </p>
          )}
          {nextMilestone && daysToNext && (
            <p className="text-xs text-muted-foreground pt-1">
              {t(
                `পরবর্তী ব্যাজ: ${nextMilestone.emoji} ${nextMilestone.days} দিন (আর ${daysToNext} দিন)`,
                `Next badge: ${nextMilestone.emoji} ${nextMilestone.days} days (${daysToNext} more)`
              )}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StreakBadge;
