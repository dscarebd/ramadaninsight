

## Back Button Navigation Fix

### Problem
Currently, pressing the hardware/system back button once exits the app. Users want:
1. On non-home pages: back button navigates to the previous page
2. On the home page: require two back button presses to exit (first press shows a toast warning, second press within 2 seconds exits)

### Implementation

**New hook: `src/hooks/useBackButtonHandler.ts`**
- Uses Capacitor's `App` plugin to listen for the `backButton` event on native platforms
- Also handles browser `popstate` for PWA/web usage
- Logic:
  - If current route is NOT `/` (home): use `navigate(-1)` to go back
  - If current route IS `/`: on first press, show a toast "Press back again to exit" and start a 2-second timer. On second press within that window, call `App.exitApp()` (Capacitor) or do nothing on web
- Hook is used inside `AppContent` component in `App.tsx`

**Modified: `src/App.tsx`**
- Import and call `useBackButtonHandler()` inside the `AppContent` component (which is already inside BrowserRouter, so it has access to router context)
- Move `AppContent` inside `BrowserRouter` so it can use `useNavigate` and `useLocation`

### Technical Details

- Uses `@capacitor/app` plugin's `App.addListener('backButton', ...)` for native back button
- Falls back gracefully on web (no-op for exit)
- The "double-tap to exit" pattern is standard on Android apps
- Toast message will be bilingual (Bengali/English) using the language context
