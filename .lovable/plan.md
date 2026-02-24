

## Fix Bottom Content Cut-off on Native APK

### Problem
On the native APK, the bottom warning/disclaimer text on the Home page (and potentially other pages) is hidden behind the bottom navigation bar. The current `pb-20` (80px) padding is not enough when the native safe area inset is added to the bottom nav height.

### Solution
Increase the mobile bottom padding from `pb-20` (80px) to `pb-28` (112px) across all pages to ensure content clears the bottom nav bar plus safe area inset on native devices.

### Files to Change

**All page files** -- update `pb-20` to `pb-28` on the main container div:

1. `src/pages/Index.tsx` (line 82) -- `pb-20` to `pb-28`
2. `src/pages/DuaHadith.tsx` (line 41) -- `pb-20` to `pb-28`
3. `src/pages/SalatTracker.tsx` (line 137) -- `pb-20` to `pb-28`
4. `src/pages/Schedule.tsx` (line 63) -- `pb-20` to `pb-28`
5. `src/pages/Settings.tsx` (line 92) -- `pb-20` to `pb-28`
6. `src/pages/Profile.tsx` (line 108) -- `pb-20` to `pb-28`
7. `src/pages/Policies.tsx` (line 12) -- `pb-20` to `pb-28`
8. `src/pages/Auth.tsx` (line 50) -- `pb-20` to `pb-28`

This adds 32px more space at the bottom on mobile, which will comfortably clear the bottom nav bar even with the safe area inset on native devices. Desktop padding (`md:pb-8`) stays unchanged.
