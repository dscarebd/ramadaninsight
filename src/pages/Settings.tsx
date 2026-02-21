import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Globe, LogIn, LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';

const Settings = () => {
  const { lang, toggleLang, t } = useLanguage();
  const navigate = useNavigate();
  const [user, setUser] = useState<{ email: string | null; id: string } | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        setUser({ email: data.session.user.email ?? null, id: data.session.user.id });
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) {
        setUser({ email: session.user.email ?? null, id: session.user.id });
      } else {
        setUser(null);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <div className="min-h-screen pb-20 px-4 pt-4 space-y-4">
      <h2 className="text-xl font-bold text-primary">{t('সেটিংস', 'Settings')}</h2>

      {/* Account Section */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <h3 className="text-sm font-semibold text-foreground">{t('অ্যাকাউন্ট', 'Account')}</h3>
          <Separator />
          {user ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.email}</p>
                  <p className="text-xs text-muted-foreground">{t('লগইন আছে', 'Logged in')}</p>
                </div>
              </div>
              <Button variant="outline" className="w-full gap-2" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                {t('লগআউট', 'Log Out')}
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {t('লগইন করলে আপনার ডেটা সব ডিভাইসে সংরক্ষিত থাকবে।', 'Log in to save your progress across devices.')}
              </p>
              <Button className="w-full gap-2" onClick={() => navigate('/auth')}>
                <LogIn className="h-4 w-4" />
                {t('লগইন / সাইন আপ', 'Login / Sign Up')}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Language Section */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <h3 className="text-sm font-semibold text-foreground">{t('ভাষা', 'Language')}</h3>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{t('বর্তমান ভাষা', 'Current Language')}</span>
            </div>
            <Button variant="outline" size="sm" onClick={toggleLang} className="gap-1.5">
              {lang === 'bn' ? '🇧🇩 বাংলা → EN' : '🇬🇧 English → বাং'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* App Info */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <h3 className="text-sm font-semibold text-foreground">{t('অ্যাপ সম্পর্কে', 'About')}</h3>
          <Separator />
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>{t('রমজান ক্যালেন্ডার ২০২৬', 'Ramadan Calendar 2026')}</p>
            <p>{t('বাংলাদেশ 🇧🇩', 'Bangladesh 🇧🇩')}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
