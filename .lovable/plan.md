

# Fix: Native GPS Fallback for Low Accuracy

## Problem
On the native app, `Geolocation.getCurrentPosition({ enableHighAccuracy: true })` fails and shows "GPS signal not found." Unlike the web path, there's no fallback to low-accuracy GPS when high accuracy fails.

## Fix

### `src/components/Header.tsx`
Update the native GPS section to:
1. First try with `enableHighAccuracy: true`
2. If that fails (timeout/unavailable), retry with `enableHighAccuracy: false` (uses network/cell tower location)
3. Increase timeout to 20000ms for the first attempt
4. Only show the error toast if both attempts fail

```text
Native GPS Flow:
  Try high accuracy (timeout: 20s)
    Success → processPosition()
    Fail → Retry low accuracy (timeout: 15s)
             Success → processPosition()
             Fail → Show error toast
```

