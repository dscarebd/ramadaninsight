import { useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';

const quotes = [
  {
    arabic: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا',
    bn: 'নিশ্চয়ই কষ্টের সাথে স্বস্তি আছে।',
    en: 'Indeed, with hardship comes ease.',
    ref: { bn: 'সূরা আশ-শারহ ৯৪:৬', en: 'Surah Ash-Sharh 94:6' },
  },
  {
    arabic: 'وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ',
    bn: 'যে আল্লাহর উপর ভরসা করে, তিনিই তার জন্য যথেষ্ট।',
    en: 'Whoever puts their trust in Allah, He is sufficient for them.',
    ref: { bn: 'সূরা আত-তালাক ৬৫:৩', en: 'Surah At-Talaq 65:3' },
  },
  {
    arabic: 'فَاذْكُرُونِي أَذْكُرْكُمْ',
    bn: 'তোমরা আমাকে স্মরণ করো, আমি তোমাদের স্মরণ করব।',
    en: 'Remember Me, and I will remember you.',
    ref: { bn: 'সূরা আল-বাকারা ২:১৫২', en: 'Surah Al-Baqarah 2:152' },
  },
  {
    arabic: 'وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ',
    bn: 'আর অচিরেই তোমার রব তোমাকে এত দেবেন যে তুমি সন্তুষ্ট হয়ে যাবে।',
    en: 'And your Lord will give you so much that you will be pleased.',
    ref: { bn: 'সূরা আদ-দুহা ৯৩:৫', en: 'Surah Ad-Duha 93:5' },
  },
  {
    arabic: 'ادْعُونِي أَسْتَجِبْ لَكُمْ',
    bn: 'তোমরা আমাকে ডাকো, আমি তোমাদের ডাকে সাড়া দেব।',
    en: 'Call upon Me, I will respond to you.',
    ref: { bn: 'সূরা গাফির ৪০:৬০', en: 'Surah Ghafir 40:60' },
  },
  {
    arabic: 'وَاللَّهُ يُحِبُّ الصَّابِرِينَ',
    bn: 'আর আল্লাহ ধৈর্যশীলদের ভালোবাসেন।',
    en: 'And Allah loves the patient.',
    ref: { bn: 'সূরা আলে ইমরান ৩:১৪৬', en: 'Surah Ali Imran 3:146' },
  },
  {
    arabic: 'إِنَّ اللَّهَ لَا يُضِيعُ أَجْرَ الْمُحْسِنِينَ',
    bn: 'নিশ্চয়ই আল্লাহ সৎকর্মশীলদের প্রতিদান নষ্ট করেন না।',
    en: 'Indeed, Allah does not waste the reward of those who do good.',
    ref: { bn: 'সূরা ইউসুফ ১২:৯০', en: 'Surah Yusuf 12:90' },
  },
  {
    arabic: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ',
    bn: 'তোমাদের মধ্যে সর্বোত্তম সে যে কুরআন শিখে এবং শেখায়।',
    en: 'The best among you are those who learn the Quran and teach it.',
    ref: { bn: 'সহীহ বুখারী ৫০২৭', en: 'Sahih Bukhari 5027' },
  },
  {
    arabic: 'الدُّعَاءُ هُوَ الْعِبَادَةُ',
    bn: 'দোয়াই হলো ইবাদত।',
    en: 'Supplication is the essence of worship.',
    ref: { bn: 'সুনানে তিরমিযী ৩৩৭১', en: 'Sunan Tirmidhi 3371' },
  },
  {
    arabic: 'مَنْ صَلَّى الْفَجْرَ فَهُوَ فِي ذِمَّةِ اللَّهِ',
    bn: 'যে ফজরের নামাজ পড়ে সে আল্লাহর জিম্মায় থাকে।',
    en: 'Whoever prays Fajr is under the protection of Allah.',
    ref: { bn: 'সহীহ মুসলিম ৬৫৭', en: 'Sahih Muslim 657' },
  },
  {
    arabic: 'إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ',
    bn: 'নিশ্চয়ই প্রতিটি কাজ নিয়তের উপর নির্ভরশীল।',
    en: 'Actions are judged by intentions.',
    ref: { bn: 'সহীহ বুখারী ১', en: 'Sahih Bukhari 1' },
  },
  {
    arabic: 'الصَّلَاةُ نُورٌ',
    bn: 'নামাজ হলো নূর (আলো)।',
    en: 'Prayer is light.',
    ref: { bn: 'সহীহ মুসলিম ২২৩', en: 'Sahih Muslim 223' },
  },
  {
    arabic: 'أَقْرَبُ مَا يَكُونُ الْعَبْدُ مِنْ رَبِّهِ وَهُوَ سَاجِدٌ',
    bn: 'বান্দা তার রবের সবচেয়ে নিকটে থাকে সিজদায়।',
    en: 'The closest a servant is to his Lord is during prostration.',
    ref: { bn: 'সহীহ মুসলিম ৪৮২', en: 'Sahih Muslim 482' },
  },
  {
    arabic: 'مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ',
    bn: 'যে ব্যক্তি জ্ঞান অন্বেষণের পথে চলে, আল্লাহ তার জন্য জান্নাতের পথ সহজ করে দেন।',
    en: 'Whoever treads a path seeking knowledge, Allah will ease for them a path to Paradise.',
    ref: { bn: 'সহীহ মুসলিম ২৬৯৯', en: 'Sahih Muslim 2699' },
  },
];

const DailyQuote = () => {
  const { lang, t } = useLanguage();

  const todayQuote = useMemo(() => {
    // Use day of year as index for daily rotation
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const dayOfYear = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return quotes[dayOfYear % quotes.length];
  }, []);

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardContent className="p-4 space-y-2">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-primary" />
          <h3 className="text-xs font-semibold text-primary">{t('আজকের বাণী', "Today's Wisdom")}</h3>
        </div>
        <p className="text-right text-lg leading-loose font-arabic text-foreground" dir="rtl">
          {todayQuote.arabic}
        </p>
        <p className="text-sm text-foreground/90">
          {lang === 'bn' ? todayQuote.bn : todayQuote.en}
        </p>
        <p className="text-[0.65rem] text-muted-foreground text-right">
          — {lang === 'bn' ? todayQuote.ref.bn : todayQuote.ref.en}
        </p>
      </CardContent>
    </Card>
  );
};

export default DailyQuote;
