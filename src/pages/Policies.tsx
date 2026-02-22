import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Policies = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen pb-20 px-4 pt-4 space-y-4 animate-fade-in">
      <Card>
        <CardContent className="p-4 space-y-3">
          <h2 className="text-lg font-bold text-foreground">{t('গোপনীয়তা নীতি', 'Privacy Policy')}</h2>
          <Separator />
          <div className="text-sm text-muted-foreground space-y-2 leading-relaxed">
            <p>{t(
              'আমরা আপনার গোপনীয়তাকে সম্মান করি। এই অ্যাপ ব্যবহার করার সময় আমরা শুধুমাত্র আপনার অ্যাকাউন্ট ও নামাজ ট্র্যাকিং সম্পর্কিত তথ্য সংরক্ষণ করি।',
              'We respect your privacy. This app only stores data related to your account and salat tracking.'
            )}</p>
            <p>{t(
              'আমরা আপনার ব্যক্তিগত তথ্য তৃতীয় পক্ষের সাথে শেয়ার করি না।',
              'We do not share your personal information with third parties.'
            )}</p>
            <p>{t(
              'আপনার অবস্থান তথ্য শুধুমাত্র নামাজের সময়সূচী নির্ধারণে ব্যবহৃত হয় এবং ডিভাইসে স্থানীয়ভাবে সংরক্ষিত থাকে।',
              'Your location data is used solely for determining prayer times and is stored locally on your device.'
            )}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-3">
          <h2 className="text-lg font-bold text-foreground">{t('ব্যবহারের শর্তাবলী', 'Terms of Use')}</h2>
          <Separator />
          <div className="text-sm text-muted-foreground space-y-2 leading-relaxed">
            <p>{t(
              'এই অ্যাপটি ব্যবহার করে আপনি নিম্নলিখিত শর্তাবলীতে সম্মত হচ্ছেন:',
              'By using this app, you agree to the following terms:'
            )}</p>
            <ul className="list-disc list-inside space-y-1">
              <li>{t(
                'এই অ্যাপটি শুধুমাত্র ব্যক্তিগত ধর্মীয় অনুশীলনের জন্য।',
                'This app is intended for personal religious practice only.'
              )}</li>
              <li>{t(
                'নামাজের সময়সূচী আনুমানিক এবং স্থানীয় মসজিদের সাথে যাচাই করা উচিত।',
                'Prayer times are approximate and should be verified with your local mosque.'
              )}</li>
              <li>{t(
                'আমরা অ্যাপের নিরবচ্ছিন্ন পরিষেবার গ্যারান্টি দিই না।',
                'We do not guarantee uninterrupted service of the app.'
              )}</li>
              <li>{t(
                'অ্যাপের বিষয়বস্তু কপি বা পুনরায় বিতরণ করা নিষিদ্ধ।',
                'Copying or redistributing app content is prohibited.'
              )}</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-3">
          <h2 className="text-lg font-bold text-foreground">{t('যোগাযোগ', 'Contact')}</h2>
          <Separator />
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t(
              'কোনো প্রশ্ন বা পরামর্শ থাকলে আমাদের সাথে যোগাযোগ করুন: support@annurdigital.com',
              'For questions or suggestions, contact us at: support@annurdigital.com'
            )}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-3">
          <h2 className="text-lg font-bold text-foreground">{t('প্রজেক্ট সার্ভিস', 'Project Service')}</h2>
          <Separator />
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t(
              'আপনার প্রজেক্টের জন্য কিছু প্রয়োজন হলে সরাসরি যোগাযোগ করুন।',
              'If you need any for your project, directly contact here.'
            )}
          </p>
          <Button asChild variant="outline" className="w-full gap-2">
            <a href="https://t.me/nuralamin_official" target="_blank" rel="noopener noreferrer">
              <Send className="h-4 w-4" />
              @nuralamin_official
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Policies;
