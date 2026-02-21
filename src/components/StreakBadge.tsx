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

// Motivational messages based on streak ranges
const motivationalMessages = [
  // Streak = 0 (lost or not started)
  { min: 0, max: 0, messages: [
    { bn: '"নিশ্চয়ই আল্লাহ তওবা কবুলকারী।" আবার শুরু করুন!', en: '"Indeed, Allah is Accepting of repentance." Start again!' },
    { bn: 'প্রতিটি নতুন দিন নতুন সুযোগ। আজকে শুরু করুন!', en: 'Every new day is a fresh chance. Start today!' },
    { bn: 'হাল ছাড়বেন না। আল্লাহ আপনার চেষ্টা দেখছেন।', en: "Don't give up. Allah sees your effort." },
  ]},
  // Streak 1-2
  { min: 1, max: 2, messages: [
    { bn: 'শুরুটা হয়েছে! ধারাবাহিকতা বজায় রাখুন।', en: "You've started! Keep the momentum going." },
    { bn: '"যে ব্যক্তি ফজর পড়ে সে আল্লাহর জিম্মায়।" চালিয়ে যান!', en: '"Whoever prays Fajr is under Allah\'s protection." Keep going!' },
    { bn: 'ছোট পদক্ষেপেই বড় পরিবর্তন আসে।', en: 'Small steps lead to great change.' },
  ]},
  // Streak 3-6
  { min: 3, max: 6, messages: [
    { bn: 'অভ্যাস গড়ে উঠছে! আরেকটু ধৈর্য ধরুন।', en: "A habit is forming! Stay patient a bit more." },
    { bn: '"আল্লাহর কাছে সবচেয়ে প্রিয় আমল যা নিয়মিত করা হয়।"', en: '"The most beloved deed to Allah is the most consistent one."' },
    { bn: 'মাশাআল্লাহ! আপনি সঠিক পথে আছেন।', en: 'MashaAllah! You are on the right path.' },
  ]},
  // Streak 7-13
  { min: 7, max: 13, messages: [
    { bn: 'এক সপ্তাহ পূর্ণ! আপনার ঈমান শক্তিশালী হচ্ছে।', en: 'One week done! Your faith is growing stronger.' },
    { bn: '"নামাজ মুমিনের মেরাজ।" আপনি উপরে উঠছেন!', en: '"Prayer is the believer\'s ascension." You are rising!' },
    { bn: 'আলহামদুলিল্লাহ! চালিয়ে যান, জান্নাত কাছে।', en: 'Alhamdulillah! Keep going, Jannah is near.' },
  ]},
  // Streak 14-29
  { min: 14, max: 29, messages: [
    { bn: 'দুই সপ্তাহ! আপনি একজন প্রকৃত মুসল্লি।', en: 'Two weeks! You are a true worshipper.' },
    { bn: '"যে পাঁচ ওয়াক্ত নামাজ রক্ষা করে, তার জন্য নূর আছে।"', en: '"Whoever guards the five prayers, will have light on the Day of Judgment."' },
    { bn: 'সুবহানাল্লাহ! আপনার ধারাবাহিকতা অনুপ্রেরণাদায়ক।', en: 'SubhanAllah! Your consistency is inspirational.' },
  ]},
  // Streak 30+
  { min: 30, max: Infinity, messages: [
    { bn: '"ধৈর্যশীলদের অগণিত পুরস্কার দেওয়া হবে।" আপনি তাদের একজন!', en: '"The patient will be given their reward without account." You are one of them!' },
    { bn: 'আল্লাহ আপনাকে কবুল করুন। আপনি একটি উদাহরণ।', en: 'May Allah accept you. You are an example for others.' },
    { bn: 'মাশাআল্লাহ! আপনার নামাজের অভ্যাস অটুট।', en: 'MashaAllah! Your prayer habit is unbreakable.' },
  ]},
];

const getMotivationalMessage = (streak: number): { bn: string; en: string } => {
  const range = motivationalMessages.find(r => streak >= r.min && streak <= r.max) || motivationalMessages[0];
  // Pick a daily-rotating message
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const idx = dayOfYear % range.messages.length;
  return range.messages[idx];
};

interface StreakBadgeProps {
  userId: string;
}

const StreakBadge = ({ userId }: StreakBadgeProps) => {
  const { t } = useLanguage();
  const { currentStreak, longestStreak, loading } = usePrayerStreak(userId);

  if (loading) return null;
  if (currentStreak === 0 && longestStreak === 0) return null;

  // Find the highest milestone achieved (or null if streak < 3)
  const achieved = milestones.find(m => currentStreak >= m.days);

  // Determine next milestone
  const currentIdx = achieved ? milestones.indexOf(achieved) : milestones.length - 1;
  const nextMilestone = achieved && currentIdx > 0 ? milestones[currentIdx - 1] : (!achieved ? milestones[milestones.length - 1] : null);
  const daysToNext = nextMilestone ? nextMilestone.days - currentStreak : null;

  const gradientClass = achieved ? achieved.color : 'from-muted/50 to-muted/30 border-border';
  const motivation = getMotivationalMessage(currentStreak);

  return (
    <Card className={`bg-gradient-to-br ${gradientClass} border`}>
      <CardContent className="p-4">
        <div className="text-center space-y-1.5">
          <p className="text-3xl">{achieved ? achieved.emoji : '🕌'}</p>
          <p className="text-base font-bold text-primary">
            {currentStreak > 0
              ? `${currentStreak} ${t('দিনের স্ট্রিক!', 'Day Streak!')}`
              : t('আজকে শুরু করুন!', 'Start today!')}
          </p>
          {achieved && (
            <p className="text-sm text-foreground/80">
              {t(achieved.bn, achieved.en)}
            </p>
          )}
          {longestStreak > currentStreak && longestStreak > 0 && (
            <p className="text-xs text-muted-foreground pt-1">
              {t(
                `🏅 সর্বোচ্চ স্ট্রিক: ${longestStreak} দিন`,
                `🏅 Longest streak: ${longestStreak} days`
              )}
            </p>
          )}
          {nextMilestone && daysToNext && daysToNext > 0 && (
            <p className="text-xs text-muted-foreground pt-1">
              {t(
                `পরবর্তী ব্যাজ: ${nextMilestone.emoji} ${nextMilestone.days} দিন (আর ${daysToNext} দিন)`,
                `Next badge: ${nextMilestone.emoji} ${nextMilestone.days} days (${daysToNext} more)`
              )}
            </p>
          )}
          <p className="text-xs italic text-foreground/60 pt-2 border-t border-border/50 mt-2">
            "{t(motivation.bn, motivation.en)}"
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StreakBadge;
