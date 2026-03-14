

# Use Native GPS for Capacitor APK

## Problem
The current GPS uses `navigator.geolocation` (browser API). While this technically works inside Capacitor's WebView, it has issues on native:
- No native Android/iOS permission dialogs (uses browser-style prompts instead)
- Less reliable location accuracy
- Iframe detection code runs unnecessarily on native
- Error messages reference "browser settings" which don't apply on native

## Solution

### 1. Install `@capacitor/geolocation` plugin
Add the native geolocation dependency for proper Android/iOS GPS access.

### 2. Update `src/components/Header.tsx`
Modify the `handleGPS` function to:
- Detect if running on a native platform using `Capacitor.isNativePlatform()`
- On native: use `@capacitor/geolocation` (native permission dialogs, better accuracy)
- On web: keep current `navigator.geolocation` logic as fallback
- Update error messages: show "app settings" instead of "browser settings" on native

### Technical Details

```text
GPS Flow:
  Is Native? (Capacitor.isNativePlatform())
    YES --> Use @capacitor/geolocation
            - Geolocation.requestPermissions()
            - Geolocation.getCurrentPosition()
            - Native Android permission dialog
    NO  --> Use navigator.geolocation (existing code)
            - Iframe detection
            - Browser permission prompt
```

**Key code change in Header.tsx:**
- Import `Capacitor` from `@capacitor/core` and `Geolocation` from `@capacitor/geolocation`
- In `handleGPS`, check `Capacitor.isNativePlatform()`
- If native: call `Geolocation.requestPermissions()` then `Geolocation.getCurrentPosition()`
- The success handler (finding nearest location, saving to localStorage) stays the same
- Error messages adapt based on platform ("app settings" vs "browser settings")

### 3. Android permissions
Add location permissions to `AndroidManifest.xml` note for the user (Capacitor plugin handles this automatically via `npx cap sync`).

### Files to modify
- **package.json** -- add `@capacitor/geolocation` dependency
- **src/components/Header.tsx** -- platform-aware GPS logic

