

# Fix: Show All 30 Ramadan Days

## Problem
Line 138 in `src/hooks/usePrayerTimes.ts`:
```typescript
const ramadanDays = apiRamadanDays.slice(1);
```
This removes the first Ramadan day from the list, resulting in only 29 days displayed instead of 30. The `slice(1)` was likely added to skip a duplicate or misaligned entry, but it incorrectly drops a valid day.

## Fix
In `src/hooks/usePrayerTimes.ts`, change line 138 to use the full array without skipping:
```typescript
const ramadanDays = apiRamadanDays;
```

If the original `slice(1)` was meant to handle a duplicate first entry from the API, we should instead deduplicate by Hijri day number rather than blindly skipping the first item.

## Files
- **src/hooks/usePrayerTimes.ts** — remove `slice(1)`, optionally deduplicate by date

