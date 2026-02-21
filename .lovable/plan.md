

## Plan: Use Hind Siliguri Font for Bold Bengali Numbers

### What changes
Apply the "Hind Siliguri" Google Font exclusively to bold Bengali numerals (large/prominent numbers like Sehri/Iftar times, Roza count, countdown timer digits) -- not to regular Bengali text or small-sized numbers.

### Steps

1. **Add Hind Siliguri font import** in `src/index.css` -- append `Hind+Siliguri:wght@700` to the existing Google Fonts URL.

2. **Add a new Tailwind font family** in `tailwind.config.ts` -- add `'bengali-num': ['"Hind Siliguri"', 'sans-serif']` alongside the existing `bengali` and `arabic` font families.

3. **Apply the font to bold Bengali number elements** by adding `font-bengali-num` class to:
   - **`src/pages/Index.tsx`**: Roza count heading (`text-3xl font-bold`), Sehri time (`text-2xl font-bold`), Iftar time (`text-2xl font-bold`)
   - **`src/components/CountdownTimer.tsx`**: Countdown digit spans (`text-xl font-bold`)
   - **`src/pages/Schedule.tsx`**: No change needed here since schedule table uses small text (`text-xs`), not bold display numbers

### Technical Details

- Google Fonts URL update: `...&family=Hind+Siliguri:wght@700&display=swap`
- Tailwind config addition under `fontFamily`:
  ```
  'bengali-num': ['"Hind Siliguri"', 'sans-serif']
  ```
- Only bold, large-display number elements get `font-bengali-num` -- regular Bengali text continues using Anek Bangla

