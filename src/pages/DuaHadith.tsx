import { useLanguage } from '@/contexts/LanguageContext';
import { ramadanDuas, dailyHadiths } from '@/data/duas';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share2, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import PageMeta from '@/components/PageMeta';
import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';

const DuaHadith = () => {
  const { lang, t } = useLanguage();
  const { toast } = useToast();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const hadithIndex = new Date().getDate() % dailyHadiths.length;
  const hadith = dailyHadiths[hadithIndex];

  const handleShare = async (id: string, text: string) => {
    // Use native share on Capacitor
    if (Capacitor.isNativePlatform()) {
      try {
        await Share.share({ text });
        return;
      } catch {
        // User cancelled
        return;
      }
    }
    // Web fallback
    if (navigator.share) {
      try {
        await navigator.share({ text });
        return;
      } catch (e) {
        if ((e as DOMException).name === 'AbortError') return;
      }
    }
    // Final fallback: copy to clipboard
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast({ title: t('কপি হয়েছে!', 'Copied to clipboard!'), duration: 1500 });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const hadithText = `${lang === 'bn' ? hadith.arabicBn : hadith.arabicEn}\n\n${lang === 'bn' ? hadith.sourceBn : hadith.sourceEn}`;

  const duaText = (dua: typeof ramadanDuas[0]) =>
    `${lang === 'bn' ? dua.titleBn : dua.titleEn}\n\n${dua.arabic}\n\n${lang === 'bn' ? dua.meaningBn : dua.meaningEn}`;

  return (
    <div className="min-h-screen pb-28 md:pb-8 px-4 pt-4 space-y-4 animate-fade-in">
      <PageMeta
        title="দোয়া ও হাদিস - Dua & Hadith"
        description="রমজানের দোয়া ও হাদিস সংকলন। Collection of Ramadan duas and hadiths."
        keywords="dua, hadith, দোয়া, হাদিস, ramadan dua, islamic prayers"
      />
      

      {/* Daily Hadith */}
      <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-primary text-sm">{t('📖 আজকের হাদিস', "📖 Today's Hadith")}</h3>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors"
              onClick={() => handleShare('hadith', hadithText)}
            >
              {copiedId === 'hadith' ? <Check className="h-4 w-4 text-primary" /> : <Share2 className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-sm leading-relaxed">
            {lang === 'bn' ? hadith.arabicBn : hadith.arabicEn}
          </p>
          <p className="text-xs text-muted-foreground font-medium">
            {lang === 'bn' ? hadith.sourceBn : hadith.sourceEn}
          </p>
        </CardContent>
      </Card>

      {/* Ramadan Duas */}
      <h3 className="font-bold text-sm text-primary">{t('🤲 রামাদানের দোয়াসমূহ', '🤲 Ramadan Duas')}</h3>
      <div className="md:grid md:grid-cols-2 md:gap-4 space-y-4 md:space-y-0">
      {ramadanDuas.map((dua, i) => (
        <Card key={i}>
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-sm">{lang === 'bn' ? dua.titleBn : dua.titleEn}</h4>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors"
                onClick={() => handleShare(`dua-${i}`, duaText(dua))}
              >
                {copiedId === `dua-${i}` ? <Check className="h-4 w-4 text-primary" /> : <Share2 className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-right text-2xl leading-loose font-arabic" dir="rtl">{dua.arabic}</p>
            <p className="text-sm">{lang === 'bn' ? dua.meaningBn : dua.meaningEn}</p>
          </CardContent>
        </Card>
      ))}
      </div>
    </div>
  );
};

export default DuaHadith;
