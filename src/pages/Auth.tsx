import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import PageMeta from '@/components/PageMeta';

const Auth = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { data: signUpData, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        if (signUpData.user && name.trim()) {
          await supabase.from('profiles').update({ display_name: name.trim() }).eq('user_id', signUpData.user.id);
        }
        toast({ title: t('সফল!', 'Success!'), description: t('ইমেইল চেক করুন', 'Check your email') });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/');
      }
    } catch (err: any) {
      toast({ title: t('ত্রুটি', 'Error'), description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pb-28">
      <PageMeta
        title="লগইন - Login"
        description="Sign in or create an account on Ramadan Insight."
        keywords="login, sign up, লগইন, registration"
      />
      <Card className="w-full max-w-sm">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-bold text-primary text-center">
            {isSignUp ? t('অ্যাকাউন্ট তৈরি করুন', 'Create Account') : t('লগইন', 'Login')}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            {isSignUp && (
              <Input
                type="text"
                placeholder={t('আপনার নাম', 'Your Name')}
                value={name}
                onChange={e => setName(e.target.value)}
              />
            )}
            <Input
              type="email"
              placeholder={t('ইমেইল', 'Email')}
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder={t('পাসওয়ার্ড', 'Password')}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? '...' : isSignUp ? t('সাইন আপ', 'Sign Up') : t('লগইন', 'Login')}
            </Button>
          </form>
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm text-primary underline w-full text-center"
          >
            {isSignUp
              ? t('ইতোমধ্যে অ্যাকাউন্ট আছে? লগইন করুন', 'Already have an account? Login')
              : t('অ্যাকাউন্ট নেই? সাইন আপ করুন', "Don't have an account? Sign Up")}
          </button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
