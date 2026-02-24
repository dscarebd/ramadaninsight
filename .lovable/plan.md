

## Offline Support Improvements

This plan enhances the app so it works reliably without an internet connection and gracefully handles connectivity changes.

### What You'll Get

1. **Offline Status Banner** - A small notification bar appears when you lose internet, so you always know your connection status.

2. **Cached Prayer Times** - Prayer times (Sehri, Iftar, all 5 waqt) are saved locally after first load. If you open the app offline, you still see accurate times instead of a loading spinner.

3. **Offline Queue for Prayer Tracking** - When logged in but offline, prayer check/uncheck actions are queued and automatically synced to the cloud when you reconnect.

4. **Dua & Hadith Always Available** - Already works offline since data is bundled in the app. No changes needed here.

---

### Technical Details

**New file: `src/hooks/useNetworkStatus.ts`**
- Custom hook using `navigator.onLine` and `online`/`offline` events
- Returns `{ isOnline: boolean }`

**New file: `src/components/OfflineBanner.tsx`**
- Small, non-intrusive banner shown at the top when offline
- Displays "You're offline - data may not be up to date" in Bengali/English
- Auto-dismisses when back online

**Modified: `src/App.tsx`**
- Add `OfflineBanner` component inside the main layout

**Modified: `src/hooks/usePrayerTimes.ts` and `src/hooks/useTodayPrayerTimes.ts`**
- After successful API fetch, cache the response in `localStorage` (keyed by lat/lng/year/month)
- On query error or offline, fall back to cached data
- Uses React Query's `initialData` from cache

**Modified: `src/pages/Index.tsx` and `src/pages/Schedule.tsx`**
- Show cached data with a subtle "cached" indicator instead of a spinner when offline
- Remove the hard block on loading (no more infinite spinner when offline)

**Modified: `src/pages/SalatTracker.tsx`**
- When offline and logged in, skip the cloud upsert and store a pending sync flag in localStorage
- On reconnect, trigger the sync automatically

**Modified: `src/hooks/useSalatSync.ts`**
- Add listener for `online` event to trigger sync when connectivity returns
- Process any queued offline changes on reconnect

