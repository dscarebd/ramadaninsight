import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Globe, LogIn, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

const Header = () => {
  const { lang, toggleLang, t } = useLanguage();
  const navigate = useNavigate();
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user?.email || null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user?.email || null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-lg">
      <div className="flex items-center justify-between px-4 py-3">
        <div>
          <h1 className="text-lg font-bold leading-tight">
            {t('রমজান ক্যালেন্ডার ২০২৬', 'Ramadan Calendar 2026')}
          </h1>
          <p className="text-xs opacity-80">
            {t('বাংলাদেশ', 'Bangladesh')} 🇧🇩
          </p>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLang}
            className="text-primary-foreground hover:bg-primary-foreground/20 gap-1 text-sm font-semibold"
          >
            <Globe className="h-4 w-4" />
            {lang === 'bn' ? 'EN' : 'বাং'}
          </Button>
          {user ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-primary-foreground hover:bg-primary-foreground/20 gap-1 text-xs"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/auth')}
              className="text-primary-foreground hover:bg-primary-foreground/20 gap-1 text-xs"
            >
              <LogIn className="h-4 w-4" />
              {t('লগইন', 'Login')}
            </Button>
          )}
        </div>
      </div>
      {user && (
        <div className="px-4 pb-2 text-xs opacity-70 truncate">
          {user}
        </div>
      )}
    </header>
  );
};

export default Header;
