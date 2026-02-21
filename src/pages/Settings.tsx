import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Globe, LogIn, LogOut, User, Moon, Sun, ExternalLink } from 'lucide-react';
import appQuran from '@/assets/app-quran.png';
import appQuiz from '@/assets/app-quiz.png';
import appExpense from '@/assets/app-expense.png';
import { useNavigate } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useTheme } from 'next-themes';
import LocationPicker from '@/components/DistrictSelector';

const defaultLocation = { division: 'dhaka', zilla: 'dhaka', upazila: 'savar' };

const loadLocation = () => {
  try {
    const stored = localStorage.getItem('location');
    if (stored) return JSON.parse(stored);
  } catch {}
  return defaultLocation;
};

const Settings = () => {
  const { lang, toggleLang, t } = useLanguage();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [user, setUser] = useState<{ email: string | null; id: string } | null>(null);
  const [location, setLocation] = useState(loadLocation);

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

  // Load location from DB for logged-in users
  useEffect(() => {
    if (!user) return;
    supabase
      .from('profiles')
      .select('district_preference')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.district_preference) {
          try {
            const parsed = JSON.parse(data.district_preference);
            setLocation(parsed);
            localStorage.setItem('location', JSON.stringify(parsed));
          } catch {
            // Legacy string format, ignore
          }
        }
      });
  }, [user]);

  const handleLocationChange = async (val: { division: string; zilla: string; upazila: string }) => {
    setLocation(val);
    localStorage.setItem('location', JSON.stringify(val));
    if (user) {
      await supabase
        .from('profiles')
        .update({ district_preference: JSON.stringify(val) })
        .eq('user_id', user.id);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <div className="min-h-screen pb-20 px-4 pt-4 space-y-4 animate-fade-in">
      

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

      {/* Location Preference */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <h3 className="text-sm font-semibold text-foreground">{t('অবস্থান', 'Location')}</h3>
          <Separator />
          <LocationPicker value={location} onChange={handleLocationChange} />
          {user && (
            <p className="text-xs text-muted-foreground">
              {t('আপনার অবস্থান সব ডিভাইসে সংরক্ষিত থাকবে।', 'Your location will be saved across devices.')}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Dark Mode */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <h3 className="text-sm font-semibold text-foreground">{t('থিম', 'Theme')}</h3>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {theme === 'dark' ? (
                <Moon className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Sun className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="text-sm">{t('ডার্ক মোড', 'Dark Mode')}</span>
            </div>
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Our Other Apps */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <h3 className="text-sm font-semibold text-foreground">{t('আমাদের অন্যান্য অ্যাপ', 'Our Other Apps')}</h3>
          <Separator />
          <div className="grid grid-cols-4 gap-4 px-6">
            {[
              { icon: appQuran, name: 'Quran Insight', url: 'https://play.google.com/store/apps/details?id=com.annur.quraninsight' },
              { icon: appQuiz, name: 'Quiz Insight', url: 'https://play.google.com/store/apps/details?id=com.annur.quizinsight' },
              { icon: appExpense, name: 'Expense Tracker', url: 'https://play.google.com/store/apps/details?id=com.annur.expensetracker' },
            ].map((app) => (
              <a
                key={app.name}
                href={app.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 group"
              >
                <div className="w-full aspect-square rounded-xl shadow-md overflow-hidden group-hover:scale-105 transition-transform">
                  <img src={app.icon} alt={app.name} className="h-full w-full object-cover" />
                </div>
                <span className="text-xs text-muted-foreground text-center leading-tight font-medium">{app.name}</span>
              </a>
            ))}
            <div className="flex flex-col items-center gap-2 group cursor-default">
              <div className="w-full aspect-square rounded-xl shadow-md bg-muted overflow-hidden group-hover:scale-105 transition-transform">
                <img src={appQuran} alt="Upcoming" className="h-full w-full object-cover blur-md opacity-50" />
              </div>
              <span className="text-xs text-muted-foreground text-center leading-tight font-medium">{t('শীঘ্রই আসছে', 'Upcoming')}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
