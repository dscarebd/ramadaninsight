

## Preload App Icons for Instant Settings Page Load

### Problem
The "Our Other Apps" icons (`app-quran.png`, `app-quiz.png`, `app-expense.png`) only start loading when the Settings page mounts. This causes a visible flash/loading delay, breaking the native app feel.

### Solution
Preload these images early in the app lifecycle using `<link rel="preload">` tags in `index.html`, so they are already cached in the browser by the time the user navigates to Settings.

### Steps

1. **Add preload links in `index.html`** for the three app icon images using `<link rel="preload" as="image">` tags pointing to the bundled asset paths.

2. **Alternative approach (more reliable with Vite):** Create a small preload utility in `App.tsx` that imports the three images and triggers `new Image().src = ...` on app mount, ensuring the browser fetches and caches them immediately regardless of route.

### Technical Details

Since Vite hashes asset filenames during build, the most reliable approach is to import the images in `App.tsx` (or a dedicated preloader component) and programmatically preload them:

```typescript
// In App.tsx, add a useEffect that preloads the images
import appQuran from '@/assets/app-quran.png';
import appQuiz from '@/assets/app-quiz.png';
import appExpense from '@/assets/app-expense.png';

// Preload on mount
useEffect(() => {
  [appQuran, appQuiz, appExpense].forEach(src => {
    const img = new Image();
    img.src = src;
  });
}, []);
```

This runs once when the app starts, so by the time a user reaches Settings, all icons are already in the browser cache -- giving an instant, native-like experience.

### Files to Modify
- `src/App.tsx` -- add image preloading logic in the `AppContent` component

