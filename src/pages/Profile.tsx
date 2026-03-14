import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, Camera, Loader2, LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageMeta from '@/components/PageMeta';
import { toast } from '@/hooks/use-toast';

const Profile = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState<{ email: string | null; id: string } | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        const u = { email: data.session.user.email ?? null, id: data.session.user.id };
        setUser(u);
        loadProfile(u.id);
      } else {
        navigate('/auth');
      }
    });
  }, []);

  const loadProfile = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('display_name, avatar_url')
      .eq('user_id', userId)
      .maybeSingle();
    if (data) {
      setDisplayName(data.display_name ?? '');
      setAvatarUrl(data.avatar_url ?? null);
    }
    setLoading(false);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    const filePath = `${user.id}/avatar.png`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      toast({ title: t('আপলোড ব্যর্থ', 'Upload failed'), variant: 'destructive' });
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);
    const urlWithCacheBust = `${publicUrl}?t=${Date.now()}`;
    setAvatarUrl(urlWithCacheBust);

    await supabase
      .from('profiles')
      .update({ avatar_url: urlWithCacheBust } as any)
      .eq('user_id', user.id);

    setUploading(false);
    toast({ title: t('ছবি আপলোড হয়েছে', 'Photo uploaded') });
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    const { error } = await supabase
      .from('profiles')
      .update({ display_name: displayName } as any)
      .eq('user_id', user.id);

    setSaving(false);
    if (error) {
      toast({ title: t('সেভ ব্যর্থ', 'Save failed'), variant: 'destructive' });
    } else {
      toast({ title: t('প্রোফাইল আপডেট হয়েছে', 'Profile updated') });
      navigate('/settings');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-28 md:pb-2 px-4 pt-4 space-y-4 animate-fade-in">
      <PageMeta
        title="প্রোফাইল - Profile"
        description="Manage your profile and account settings."
        keywords="profile, প্রোফাইল, account, user"
      />
      <div className="flex items-center gap-2 mb-2">
        <Button variant="ghost" size="icon" onClick={() => navigate('/settings')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-lg font-semibold">{t('প্রোফাইল', 'Profile')}</h2>
      </div>

      <Card>
        <CardContent className="p-6 space-y-6">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-3">
            <div
              className="relative cursor-pointer group"
              onClick={() => fileInputRef.current?.click()}
            >
              <Avatar className="h-24 w-24">
                {avatarUrl ? (
                  <AvatarImage src={avatarUrl} alt="Avatar" />
                ) : null}
                <AvatarFallback className="bg-primary/10">
                  <User className="h-10 w-10 text-primary" />
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                {uploading ? (
                  <Loader2 className="h-6 w-6 text-white animate-spin" />
                ) : (
                  <Camera className="h-6 w-6 text-white" />
                )}
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
            />
            <p className="text-xs text-muted-foreground">
              {t('ছবি পরিবর্তন করতে ট্যাপ করুন', 'Tap to change photo')}
            </p>
          </div>

          {/* Display Name */}
          <div className="space-y-2">
            <Label>{t('নাম', 'Name')}</Label>
            <Input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder={t('আপনার নাম লিখুন', 'Enter your name')}
            />
          </div>

          {/* Email (read-only) */}
          <div className="space-y-2">
            <Label>{t('ইমেইল', 'Email')}</Label>
            <Input value={user?.email ?? ''} disabled className="opacity-60" />
          </div>

          {/* Save */}
          <Button className="w-full" onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            {t('সেভ করুন', 'Save')}
          </Button>

          {/* Logout */}
          <Button variant="outline" className="w-full gap-2" onClick={async () => { await supabase.auth.signOut(); navigate('/settings'); }}>
            <LogOut className="h-4 w-4" />
            {t('লগআউট', 'Log Out')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
