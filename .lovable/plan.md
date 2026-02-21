

## Add Translation Disclaimer to Home Page

Add a subtle warning/disclaimer at the bottom of the home page (Index.tsx) informing users that the Bengali translations of Arabic text are approximate and provided only as a reference.

### Changes

**File: `src/pages/Index.tsx`**
- Add a small muted alert/note at the bottom of the page (before the `pb-20` padding area), styled similarly to the existing login warning on the Salat page.
- Text will be bilingual:
  - Bengali: "⚠️ আরবি থেকে বাংলা অনুবাদ সম্পূর্ণ নির্ভুল নাও হতে পারে। এটি শুধুমাত্র সহায়তার জন্য।"
  - English: "⚠️ Bengali translation of Arabic may not be fully accurate. It is provided for reference only."
- Use the `Alert` component or a simple `<p>` with `text-xs text-muted-foreground bg-muted rounded-lg p-2` styling (matching the existing pattern in SalatTracker).

No new files or dependencies needed.
