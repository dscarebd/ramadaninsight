import { useLanguage } from '@/contexts/LanguageContext';
import { ramadanDuas, dailyHadiths } from '@/data/duas';
import { Card, CardContent } from '@/components/ui/card';

const DuaHadith = () => {
  const { lang, t } = useLanguage();

  // Pick hadith based on day of month
  const hadithIndex = new Date().getDate() % dailyHadiths.length;
  const hadith = dailyHadiths[hadithIndex];

  return (
    <div className="min-h-screen pb-20 px-4 pt-4 space-y-4">
      <h2 className="text-xl font-bold text-primary">{t('দোয়া ও হাদিস', 'Dua & Hadith')}</h2>

      {/* Daily Hadith */}
      <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
        <CardContent className="p-4 space-y-2">
          <h3 className="font-bold text-primary text-sm">{t('📖 আজকের হাদিস', "📖 Today's Hadith")}</h3>
          <p className="text-sm leading-relaxed">
            {lang === 'bn' ? hadith.arabicBn : hadith.arabicEn}
          </p>
          <p className="text-xs text-muted-foreground font-medium">
            {lang === 'bn' ? hadith.sourceBn : hadith.sourceEn}
          </p>
        </CardContent>
      </Card>

      {/* Ramadan Duas */}
      <h3 className="font-bold text-sm text-primary">{t('🤲 রমজানের দোয়াসমূহ', '🤲 Ramadan Duas')}</h3>
      {ramadanDuas.map((dua, i) => (
        <Card key={i}>
          <CardContent className="p-4 space-y-2">
            <h4 className="font-semibold text-sm">{lang === 'bn' ? dua.titleBn : dua.titleEn}</h4>
            <p className="text-right text-lg leading-loose" dir="rtl">{dua.arabic}</p>
            <p className="text-sm">{lang === 'bn' ? dua.meaningBn : dua.meaningEn}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DuaHadith;
