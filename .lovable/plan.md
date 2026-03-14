

## Year-Round Sehri and Iftar Times

### What Changes
The app currently only fetches prayer times for Ramadan months (Feb-Mar 2026). After Ramadan ends, it falls back to stale data. This update will make the app fetch today's Sehri and Iftar times for any day of the year, so users can use it all 12 months.

### How It Will Work

**During Ramadan:** Everything stays the same -- Roza counter, countdown, duas, status banner.

**Outside Ramadan:** The home page will show:
- Today's Sehri and Iftar times (fetched for the current date)
- Today's date (Gregorian and Hijri)
- A note like "Ramadan is not active -- showing daily Sehri/Iftar times"
- The countdown timer still works (showing time until next Sehri or Iftar)
- Daily Quote remains visible
- Sehri Niyat and Iftar Dua cards remain visible (useful for voluntary fasting)
- The Roza counter card is replaced with a simple date/time display card

### Technical Details

**1. New hook: `src/hooks/useTodayPrayerTimes.ts`**
- Fetches prayer times for the current month only using the same Aladhan API
- Returns just today's Sehri (Fajr - 3 min) and Iftar (Maghrib) times
- Uses the same `fetchMonthTimes` logic extracted from `usePrayerTimes`
- Cached with React Query (1 hour stale time)

**2. Refactor: `src/hooks/usePrayerTimes.ts`**
- Extract `fetchMonthTimes` as a shared/exported utility function
- Add an `isRamadan` flag to the return value (true if today falls within ramadanDays)
- Add `isRamadanOver` flag (today is after last Ramadan day)

**3. Update: `src/pages/Index.tsx`**
- Import and use `useTodayPrayerTimes` as a fallback when outside Ramadan
- When `isRamadan` is false:
  - Hide the Roza counter card, replace with a simple "Today's Times" card showing Sehri and Iftar in large text
  - Change status banner to "Showing daily Sehri/Iftar times" instead of fasting status
  - Keep countdown timer, duas, and daily quote as-is
- When `isRamadan` is true: no changes, existing behavior

**4. Update: `src/pages/Schedule.tsx`**
- Outside Ramadan, show a banner saying the Ramadan schedule is from the last/upcoming Ramadan for reference
- The table remains accessible for reference

### UI Outside Ramadan

```text
+----------------------------------+
| Location Picker                  |
+----------------------------------+
| "Showing daily Sehri/Iftar times"|
+----------------------------------+
| Today's Date     | Countdown     |
| 23 Feb 2026      | to Iftar/     |
| Hijri date       | Sehri         |
| Sehri: 5:12 AM   |               |
| Iftar: 6:05 PM   |               |
+----------------------------------+
| Daily Quote                      |
+----------------------------------+
| Sehri Niyat      | Iftar Dua     |
+----------------------------------+
```

This keeps the app useful year-round for anyone doing voluntary (nafl) fasting like Monday/Thursday fasts, Ayyam al-Beed, Shawwal fasts, etc.
