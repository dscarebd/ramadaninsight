
## Qaza Date-Level Tracking

Currently, tapping a missed prayer badge (e.g., "Fajr (3)") toggles the entire prayer as done/undone. Instead, tapping will open a dropdown/popover showing the specific dates that prayer was missed, so the user can mark each date individually. Once all missed dates for a prayer are marked, the badge turns teal/green. If some remain, the badge shows partial progress.

### How It Works

1. **Tap a missed prayer badge** -- a Popover opens below it showing a list of the specific missed dates (e.g., "17 Feb", "19 Feb", "21 Feb")
2. **Each date has a checkbox/toggle** -- tap to mark that date's qaza as done (turns teal with checkmark) or tap again to undo
3. **Badge updates dynamically** -- shows remaining count like "Fajr (1/3)" and changes color progressively
4. **Only remaining (not yet completed) dates appear** as pending; completed ones show with a checkmark
5. **Once all dates are marked done**, the badge turns fully teal/green

### Technical Details

**File: `src/components/WeeklySummary.tsx`**

- Change `qazaDone` state from `Record<string, boolean>` (prayer-level) to `Record<string, boolean>` where keys are `prayer_date` format (e.g., `fajr_2026-02-17`), enabling per-date tracking
- Compute missed dates per prayer by checking which dates in the weekly data have that prayer as `false`
- Replace the simple `onClick` toggle with a `Popover` component from shadcn/ui
- Inside the Popover, render a list of missed dates with checkboxes that toggle individual `prayer_date` keys
- Update the badge display to show completed count vs total (e.g., "Fajr (1/3 done)")
- Badge color logic: all done = teal/primary, partially done = amber/warning style, none done = red/destructive
- Toast notifications fire per individual date toggle
- localStorage persistence continues using the same `qaza_weekly_` key but with the new granular structure
- The overall qaza completion summary updates to count individual dates completed vs total missed

**Imports to add:**
- `Popover, PopoverTrigger, PopoverContent` from `@/components/ui/popover`
- `Checkbox` from `@/components/ui/checkbox` (or simple styled buttons)

No database changes needed -- all qaza tracking stays in localStorage.
