

## Make the App iOS-Ready

### What's Already Done
- `@capacitor/ios` is already installed
- Capacitor config exists with splash screen settings
- Apple meta tags are in `index.html`
- Back button handler and notifications are set up

### What Needs to Change

#### 1. Update Capacitor Config for iOS Splash Screen
The current config only has `androidSplashResourceName`. Add iOS-specific splash screen settings so the splash works on both platforms.

#### 2. Add iOS Safe Area Support
iOS devices (especially those with notch/Dynamic Island) need safe area padding. Update the CSS to respect `env(safe-area-inset-*)` values so content isn't hidden behind the notch, home indicator, or status bar.

#### 3. Add iOS Status Bar Plugin
Install `@capacitor/status-bar` to control the status bar appearance (color, style) on iOS, ensuring a polished native feel.

#### 4. Add iOS Keyboard Plugin
Install `@capacitor/keyboard` to handle keyboard behavior on iOS (auto-scroll, resize mode) which prevents common issues where the keyboard covers input fields.

#### 5. Platform-Aware Notification Channels
The notification code already handles Android-only channels. No changes needed there -- it works correctly on iOS already.

#### 6. Update Back Button Handler for iOS
The hardware back button handler uses `App.exitApp()` which is Android-only. Add a platform check so it only runs on Android (iOS has no hardware back button and uses swipe gestures natively).

---

### Technical Details

**capacitor.config.ts** -- Add iOS splash screen config:
- Add `iosScheme: 'capacitor'` for proper URL handling
- Add splash screen settings that work for both platforms

**src/index.css** -- Add safe area insets:
- Add `padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)` to the body or root container
- Ensure bottom navigation respects the home indicator area

**src/hooks/useBackButtonHandler.ts** -- Platform guard:
- Wrap the back button listener with `Capacitor.getPlatform() === 'android'` check since iOS doesn't have a hardware back button

**src/components/BottomNav.tsx** -- Safe area bottom padding:
- Add extra bottom padding on iOS to account for the home indicator bar

**Install new dependencies:**
- `@capacitor/status-bar` -- control iOS status bar
- `@capacitor/keyboard` -- handle iOS keyboard behavior

**New: src/hooks/useStatusBar.ts** -- Configure status bar:
- Set status bar style and color on app launch
- Handle dark/light theme changes

**New: src/hooks/useKeyboard.ts** -- Handle iOS keyboard:
- Configure keyboard accessory bar and scroll behavior

### Build Steps (for the user)
After these changes, to build the iOS app:
1. Export to GitHub and `git pull`
2. Run `npm install`
3. Run `npx cap add ios`
4. Run `npm run build && npx cap sync`
5. Run `npx cap open ios` (requires Mac with Xcode)
6. In Xcode, add your app icon to `Assets.xcassets` and configure signing
7. Build and run on simulator or device

