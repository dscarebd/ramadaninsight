

## User Profile Page

### Overview
Create a dedicated profile page where logged-in users can view and update their name, email, and profile photo. The Account card on the Settings page will be redesigned to show user avatar (left) + name/email (right) as a clickable card that navigates to the profile page.

### Database Changes

The existing `profiles` table needs two new columns:
- `display_name` (text, nullable) -- user's display name
- `avatar_url` (text, nullable) -- URL to profile photo in storage

A new storage bucket `avatars` will be created (public) with RLS policies so users can upload/update their own avatar.

### New Page: `/profile`

A new page `src/pages/Profile.tsx` will be created with:
- Avatar upload (click to change photo, stored in the `avatars` bucket)
- Display name input field
- Email display (read-only, from auth)
- Save button to update profile data
- Back navigation

### Settings Page Update

The Account section in `src/pages/Settings.tsx` will be changed:
- When logged in: show a clickable card with avatar image on the left, name + email on the right, navigates to `/profile`
- Keep the logout button below
- When not logged in: keep existing login prompt

### Routing

Add `/profile` route in `App.tsx`.

---

### Technical Details

**Migration SQL:**
```sql
ALTER TABLE public.profiles
  ADD COLUMN display_name text,
  ADD COLUMN avatar_url text;

INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true);

CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'avatars');
```

**New file: `src/pages/Profile.tsx`**
- Form with avatar upload, display name input, email (read-only)
- Upload avatar to `avatars/{user_id}/avatar.png`
- Update `profiles` table with `display_name` and `avatar_url`
- Uses existing UI components (Card, Input, Button, Avatar)

**Modified: `src/pages/Settings.tsx`**
- Fetch profile data (display_name, avatar_url) for logged-in user
- Render clickable card: Avatar on left, name + email on right
- `onClick` navigates to `/profile`

**Modified: `src/App.tsx`**
- Add `<Route path="/profile" element={<Profile />} />`

