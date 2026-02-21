
# Salat History & Progress Tracking

## Problem
Currently, users can only see today's prayer tracking. There's no way to view past days, monthly summaries, or yearly progress.

## Solution
Add a **History tab** to the Salat Tracker page using tabs (Today / History). The History view will show:

1. **Monthly Calendar View** - A visual calendar grid showing each day of the selected month, with color-coded indicators (green = all 5 prayers done, yellow = partial, empty = missed)
2. **Monthly Stats Summary** - Total prayers completed, perfect days count, completion percentage
3. **Month/Year Navigation** - Arrow buttons to browse previous months

## UI Layout

```text
+----------------------------------+
|  [  Today  ]  [  History  ]      |  <-- Tabs
+----------------------------------+

--- History Tab ---

+----------------------------------+
|  <  February 2026  >             |  <-- Month navigator
+----------------------------------+
|  Stats Card                      |
|  Perfect Days: 15/21             |
|  Completion: 87%                 |
|  Total Prayers: 91/105           |
+----------------------------------+
|  Calendar Grid                   |
|  Su Mo Tu We Th Fr Sa            |
|  [green][green][yellow]...       |
|  Each cell shows prayer count    |
+----------------------------------+
|  Day Detail (tap a day)          |
|  Shows which prayers were done   |
+----------------------------------+
```

## Technical Details

### No database changes needed
The `salat_tracking` table already stores data per day with individual prayer columns -- we just need to query past dates.

### Files to modify

**`src/pages/SalatTracker.tsx`**
- Wrap existing content in a Tabs component (Today / History)
- Today tab = current tracker UI (unchanged)
- History tab = new component

**`src/components/SalatHistory.tsx`** (new file)
- Month/year state with navigation arrows
- Query `salat_tracking` for the selected month's data
- Render a calendar grid with color-coded days
- Show monthly stats summary card
- Tap a day to see detail of which prayers were completed
- For non-logged-in users: show a message to log in (localStorage only stores today)

### Data Query
```sql
SELECT * FROM salat_tracking
WHERE user_id = $1
  AND date >= '2026-02-01'
  AND date <= '2026-02-28'
ORDER BY date
```

### Visual Indicators
- Green circle/dot: all 5 waqt completed
- Yellow/orange: partial (1-4 prayers)
- Gray/empty: no prayers recorded
- Number inside each day cell showing count (e.g., "5/5", "3/5")

### Login requirement
History only works for logged-in users (data is stored in the database). Non-logged-in users will see a prompt to log in to view history.
