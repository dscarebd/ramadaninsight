
# Desktop Responsive Design

Currently the app is locked to `max-w-md` (28rem / 448px) width for all screen sizes. This plan will make it adapt nicely to desktop while keeping the mobile experience unchanged.

## Changes Overview

### 1. App Layout (src/App.tsx)
- Change `max-w-md` to `max-w-md md:max-w-2xl lg:max-w-4xl` so content expands on larger screens
- On desktop (md+), hide the bottom nav and show a horizontal top navigation bar instead (or sidebar)

### 2. Bottom Nav (src/components/BottomNav.tsx)
- Hide on desktop: add `md:hidden` class
- Create a desktop navigation that appears inside the Header on md+ screens

### 3. Header (src/components/Header.tsx)
- On desktop, expand the header to include navigation links (Home, Dua, Salat, Schedule, Settings) inline
- Use `hidden md:flex` for desktop nav links

### 4. Index Page (src/pages/Index.tsx)
- Use grid layouts for cards on desktop: Sehri/Iftar cards already use `grid-cols-2`, add wider grids for other sections
- Roza count + countdown side by side on desktop: `md:grid md:grid-cols-2 md:gap-4`
- Sehri Niyat + Iftar Dua side by side: `md:grid md:grid-cols-2 md:gap-4`

### 5. Salat Tracker (src/pages/SalatTracker.tsx)
- On desktop, display the "Today" tab content in a multi-column layout
- Streak + Weekly Summary + Prayer checklist in a grid

### 6. Dua & Hadith (src/pages/DuaHadith.tsx)
- Display dua cards in a 2-column grid on desktop: `md:grid md:grid-cols-2 md:gap-4`

### 7. Schedule (src/pages/Schedule.tsx)
- Table already works well, just ensure it uses available width

### 8. Settings (src/pages/Settings.tsx)
- Display settings cards in a 2-column grid on desktop

### 9. Policies (src/pages/Policies.tsx)
- 2-column grid for policy cards on desktop

## Technical Details

**Files to modify:**
- `src/App.tsx` -- widen container, adjust layout
- `src/components/Header.tsx` -- add inline desktop nav links
- `src/components/BottomNav.tsx` -- hide on `md:` screens
- `src/pages/Index.tsx` -- responsive grids for card pairs
- `src/pages/DuaHadith.tsx` -- 2-col grid for dua cards
- `src/pages/SalatTracker.tsx` -- multi-column layout for desktop
- `src/pages/Settings.tsx` -- 2-col grid for settings cards
- `src/pages/Policies.tsx` -- 2-col grid for policy cards

**Approach:** All changes use Tailwind responsive prefixes (`md:`, `lg:`) so mobile layout remains completely untouched. No new components or dependencies needed.
