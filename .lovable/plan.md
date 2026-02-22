

## Fix: Use Original App Logo for Splash Screens

### Problem
The generated splash screen images replaced the app's original logo design with a different, AI-generated image. The original logo has a dark black-green gradient background with a white mosque dome, crescent moon, and stars -- but the splash screens got a completely different design.

### Solution
Regenerate all splash screen images using the actual app logo (`src/assets/logo.png`) centered on the splash background color (`#f5faf8`). The splash images should simply display the original logo centered on the light mint background, not a new design.

### Steps

1. **Create splash screen images** in all 5 Android density sizes, each featuring the original `src/assets/logo.png` centered on the `#f5faf8` background:
   - `public/splash/splash-mdpi.png` (320x480, logo ~96px)
   - `public/splash/splash-hdpi.png` (480x800, logo ~144px)
   - `public/splash/splash-xhdpi.png` (720x1280, logo ~192px)
   - `public/splash/splash-xxhdpi.png` (960x1600, logo ~288px)
   - `public/splash/splash-xxxhdpi.png` (1280x1920, logo ~384px)

2. **No config changes needed** - the `capacitor.config.ts` splash screen settings remain the same.

### Result
The splash screen will show the original app logo (dark gradient dome with moon and stars) centered on the light mint green background, matching the app's actual branding.

