

## Update App Icon and Color Theme to Purple

The new logo has a purple/violet color palette. This plan replaces the current green theme with a matching purple theme and uses the new logo across all icon locations.

### What Changes

1. **New Logo** - Replace the current logo in the header with the uploaded image
2. **Favicon** - Update to use the new logo
3. **Color Theme** - Change from green/teal (hue 170-174) to purple/violet throughout the entire app
4. **Status Bar and PWA** - Update theme colors to match purple

### Visual Change

- Current: Green/teal primary color (`#166534`, hue 170-174)
- New: Deep purple primary color (approximately hue 270-280, matching the logo gradient)

### Technical Details

**Files to modify:**

1. **Copy uploaded logo** to `src/assets/logo.png` (replacing old) and `public/favicon.png`

2. **`src/index.css`** - Update all CSS custom properties:
   - Light mode: Change hue from 170/174 to ~270/275 (purple)
   - Dark mode: Same hue shift
   - All background, card, muted, border, sidebar variables updated

3. **`index.html`**:
   - Update `meta theme-color` from `#166534` to a deep purple (e.g. `#5B21B6`)
   - Update favicon link to new logo

4. **`vite.config.ts`**:
   - Update PWA manifest `theme_color` and `background_color` to purple tones

5. **`capacitor.config.ts`**:
   - Update `StatusBar.backgroundColor` and `SplashScreen.backgroundColor` to purple

6. **`src/index.css`** utility class:
   - Update `.text-gradient-islamic` gradient to use purple tones instead of green

No component code changes needed since all components use CSS variables (`text-primary`, `bg-primary`, etc.) which will automatically pick up the new purple values.

