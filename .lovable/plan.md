

## Switch Arabic Font to KFGQPC Uthmanic Script HAFS

### What Changes
Replace the current Noto Sans Arabic font with KFGQPC Uthmanic Script HAFS -- the authentic Uthmanic calligraphy font used in the 604-page Medina Mushaf, created by the King Fahd Quran Printing Complex.

### Steps

1. **Download and add the font file** to `public/fonts/`:
   - Download `hafs.18.woff2` from the `thetruetruth/quran-data-kfgqpc` GitHub repository (CDN: `https://cdn.jsdelivr.net/gh/thetruetruth/quran-data-kfgqpc@main/hafs/font/hafs.18.woff2`)
   - Save as `public/fonts/KFGQPCUthmanicHAFS.woff2`

2. **Add `@font-face` declaration** in `src/index.css`:
   - Declare `KFGQPC Uthmanic Script HAFS` with the local woff2 file
   - Target Arabic unicode range (U+0600-06FF, U+0750-077F, U+FB50-FDFF, U+FE70-FEFC, etc.)

3. **Update `tailwind.config.ts`**:
   - Change `font-arabic` from `"Noto Sans Arabic"` to `"KFGQPC Uthmanic Script HAFS"` with `"Noto Sans Arabic"` as fallback

4. **Remove Noto Sans Arabic imports** from `src/main.tsx`:
   - Remove the two `@fontsource/noto-sans-arabic` import lines (keep the package installed as fallback)

5. **Increase Arabic text sizes slightly** across components since Uthmanic script looks best at larger sizes:
   - `DailyQuote.tsx`: bump from `text-lg` to `text-2xl`
   - `Index.tsx` (sehri/iftar): bump from `text-xl` to `text-2xl`
   - `DuaHadith.tsx`: bump from `text-xl` to `text-2xl`

### Result
All Arabic text across the app will render in the beautiful Uthmanic calligraphy style used in printed Qurans, giving a much more authentic and recognizable appearance.

### Technical Notes
- The woff2 file is approximately 200KB -- lightweight for a font
- Noto Sans Arabic remains as a fallback font in case any characters are missing from the Uthmanic font
- The `font-display: swap` property ensures text is visible while the font loads

