

## Replace Emoji Flags with Inline SVG Icons

### Problem
Flag emojis (🇧🇩 🇬🇧) don't render properly on some devices (especially older Android), showing as two-letter country codes instead.

### Solution
Create small inline SVG components for the Bangladesh and UK flags, and replace emoji usage in two files.

### Changes

**1. Create `src/components/FlagIcons.tsx`**
- Export two small React components: `BDFlag` and `GBFlag`
- Each renders a simple inline SVG of the respective flag
- Accept `className` prop for sizing (default ~16x12px)

**2. Update `src/pages/Settings.tsx` (line 155)**
- Replace `'🇧🇩 বাংলা → EN'` / `'🇬🇧 English → বাং'` with `<BDFlag />` / `<GBFlag />` + text
- Import `BDFlag` and `GBFlag` from the new component

**3. Update `src/components/Header.tsx` (line 74)**
- Replace `🇧🇩` emoji with `<BDFlag />` inline SVG
- Import `BDFlag` from the new component

This ensures consistent flag rendering across all platforms and devices.
