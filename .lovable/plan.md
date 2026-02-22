

## Fix: Streak Shows 0 Even After Completing Past Days

### Problem
The streak calculation loops from the earliest perfect date through **today**. If today hasn't been fully marked yet (which is expected -- the day isn't over), the streak resets to 0 on today's iteration. So even 4 consecutive perfect past days show "0 days" streak.

### Solution
Modify the `calculateStreaks` function in `src/hooks/usePrayerStreak.ts` to stop counting at **yesterday** for the current streak, then optionally extend by 1 if today is also perfect. This way, an incomplete today doesn't break the streak.

### Technical Details

**File: `src/hooks/usePrayerStreak.ts`**

Update `calculateStreaks` logic:
1. Calculate the streak ending at yesterday (don't let today reset it)
2. If today is also a perfect day, add 1 to the current streak
3. The longest streak calculation remains the same but also shouldn't penalize an incomplete today

```text
Loop from startDate to yesterday:
  if date is perfect -> streak++
  else -> streak = 0
  track longest

Then check today separately:
  if today is perfect -> current = streak + 1
  else -> current = streak  (don't reset!)

longest = max(longest, current)
```

This single change in the streak calculation function will fix the display across all components (Today tab, Monthly tab, Yearly tab) since they all use the same hook.

