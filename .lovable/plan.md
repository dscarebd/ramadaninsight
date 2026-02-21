

## Make the App Feel Like a Native App -- Smooth Transitions Everywhere

### What will change

The app currently "blinks" with a white screen when switching locations or navigating between pages. This plan adds smooth, native-app-like behavior across the entire app.

### Changes

**1. Fix Schedule page blink (same issue as Index)**
- `src/pages/Schedule.tsx`: Use `isFetching` instead of `isLoading` for the loading gate, so old data stays visible while new data loads. Add opacity transition during refetch (same pattern already applied to Index).

**2. Add page transition animations**
- `src/index.css`: Add a CSS animation for page content to fade-in smoothly on mount.
- All page components (`Index.tsx`, `Schedule.tsx`, `DuaHadith.tsx`, `SalatTracker.tsx`, `Settings.tsx`): Add `animate-fade-in` class to the root container so each page fades in when navigated to.

**3. Smoother bottom navigation**
- `src/components/BottomNav.tsx`: Add a subtle scale/color transition on the active tab indicator so switching tabs feels fluid rather than instant.

**4. Smooth countdown timer updates**
- `src/components/CountdownTimer.tsx`: Add `transition-all` on the number boxes so digit changes don't feel jarring.

**5. Global CSS polish for native feel**
- `src/index.css`: Add `-webkit-tap-highlight-color: transparent` and `scroll-behavior: smooth` to remove the default blue tap highlight on mobile and enable smooth scrolling. Add `overscroll-behavior: none` to prevent pull-to-refresh bounce.

### Technical Details

**`tailwind.config.ts`** -- Add fade-in keyframe:
```
"fade-in": {
  "0%": { opacity: "0", transform: "translateY(6px)" },
  "100%": { opacity: "1", transform: "translateY(0)" }
}
```
Animation: `"fade-in": "fade-in 0.25s ease-out"`

**`src/index.css`** -- Add native-feel base styles:
```css
html {
  scroll-behavior: smooth;
  overscroll-behavior: none;
  -webkit-tap-highlight-color: transparent;
}
```

**`src/pages/Schedule.tsx`** -- Key changes:
- Destructure `isFetching` from `usePrayerTimes`
- Change loading gate: `if (isLoading && ramadanDays.length === 0)` (only show spinner on first load)
- Add transition opacity and `animate-fade-in` class to root div

**`src/components/BottomNav.tsx`** -- Add `transition-all duration-200` to the button and icon for smooth active state changes.

**`src/components/CountdownTimer.tsx`** -- Add `transition-all duration-300` to number display spans.

**All pages** -- Add `animate-fade-in` class to root containers.

