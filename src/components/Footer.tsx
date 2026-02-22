import { useLanguage } from '@/contexts/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="hidden md:block border-t border-border bg-card mt-8">
      <div className="flex items-center justify-between px-6 py-4">
        <p className="text-sm text-muted-foreground">
          {t('© ২০২৫ - ২০২৬ রামাদান ইনসাইট। সর্বস্বত্ব সংরক্ষিত।', '© 2025 - 2026 Ramadan Insight. All rights reserved.')}
        </p>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">{t('ডাউনলোড করুন:', 'Download:')}</span>
          <a href="https://apps.apple.com" target="_blank" rel="noopener noreferrer">
            <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="App Store" className="h-10" />
          </a>
          <a href="https://play.google.com" target="_blank" rel="noopener noreferrer">
            <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" className="h-10" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
