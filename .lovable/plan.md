

## Show Next Sehri/Iftar Countdown Continuously

### Problem
Currently, the countdown timer disappears after the target time passes (returns `null` when `isPast` is true). After Iftar, there's no countdown to next Sehri. The user always wants to see what's coming next.

### What Changes

The countdown card in Index.tsx will cycle through three states:
1. **Before Sehri ends** -- show "Sehri ends in..." countdown
2. **After Sehri, before Iftar** (fasting period) -- show "Iftar in..." countdown
3. **After Iftar** -- show "Next Sehri ends in..." countdown (to tomorrow's Sehri time)

### Technical Details

**1. `src/components/CountdownTimer.tsx`**
- Remove the `if (isPast) return null` -- instead, when the target time has passed and a `nextTargetTime` + `nextLabel` prop is provided, automatically switch to counting down to the next target
- Add a `nextDay` boolean prop: when true, the countdown targets the next calendar day (for "after Iftar, count to tomorrow's Sehri")

**2. `src/pages/Index.tsx`**
- Change the countdown logic to always show something:
  - During fasting (`isFasting`): countdown to Iftar
  - After Iftar (`isAfterIftar`): countdown to next day's Sehri (calculated as tomorrow's Sehri time)
  - Before Sehri (early morning): countdown to Sehri end time
- The simplest approach: pass a `nextDay` flag to CountdownTimer when counting down to tomorrow's Sehri, so it adds 24 hours to the target

This ensures users always see the next important time, whether it's Iftar or next morning's Sehri.

