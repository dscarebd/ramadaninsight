

# Remove Weekly Summary Section

## What
Remove the `WeeklySummary` component from the Salat Tracker page entirely.

## Changes

### `src/pages/SalatTracker.tsx`
- Remove the `import WeeklySummary` line
- Remove `<WeeklySummary userId={user} />` from the "today" tab (around line 143)
- Remove `<WeeklySummary userId={user} />` from the "history" tab (around line 160)

### `src/components/WeeklySummary.tsx`
- Delete the file (no longer needed)

