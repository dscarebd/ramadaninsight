

# Fix GPS Location Finder

## Problem
The GPS button uses `navigator.geolocation.getCurrentPosition()` which can fail silently in certain environments (preview iframes, browsers that block geolocation permissions). The current error handling is minimal -- the error callback just shows a generic toast without details, and there's no fallback.

## Solution

### File: `src/components/Header.tsx`

**1. Add better error handling with specific error codes:**
- `GeolocationPositionError.PERMISSION_DENIED` (code 1) -- Show message asking user to allow location permission
- `GeolocationPositionError.POSITION_UNAVAILABLE` (code 2) -- Show message that GPS signal is unavailable
- `GeolocationPositionError.TIMEOUT` (code 3) -- Show timeout message and suggest manual selection

**2. Increase timeout and add fallback:**
- Increase timeout from 10s to 15s for slower devices
- Add `maximumAge: 60000` to allow cached position (1 minute old) for faster response
- If high accuracy fails, retry with `enableHighAccuracy: false` as fallback

**3. Add iframe geolocation permission check:**
- Check if running inside an iframe and warn user that GPS may not work in preview mode
- Suggest using the published URL or manual location selection instead

### Changes Summary

```text
Header.tsx GPS error handler:
  Before: Generic "Could not get location" toast
  After:  Specific error messages per error code
          + Automatic retry with low accuracy
          + Preview/iframe detection warning
```

### Detailed Code Changes

In the error callback (line 57-59), replace with:
- Check `error.code` for specific messages
- If code is TIMEOUT or POSITION_UNAVAILABLE and `enableHighAccuracy` was true, retry with `enableHighAccuracy: false`
- Add a helper function `tryGPS(highAccuracy)` to avoid code duplication

Add iframe detection before calling geolocation:
- Check `window.self !== window.top` to detect iframe
- If in iframe, check if `navigator.permissions` API is available to query geolocation permission status
- Show appropriate warning toast if permission is denied in iframe context

