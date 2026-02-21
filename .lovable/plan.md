

## Hierarchical Location Picker: Division > Zilla > Upazila

### Overview
Replace the current flat district dropdown with a 3-step cascading location picker covering all of Bangladesh's administrative divisions:
- **8 Divisions** (Dhaka, Chittagong, Rajshahi, Khulna, Sylhet, Barisal, Rangpur, Mymensingh)
- **64 Zillas** (districts under each division)
- **495 Upazilas** (sub-districts under each zilla)

When a user selects a division, the zilla dropdown appears. After selecting a zilla, the upazila dropdown appears. Prayer times are calculated using the selected upazila's latitude/longitude for maximum accuracy.

### What Changes

1. **New data file: `src/data/locations.ts`**
   - A hierarchical data structure containing all 8 divisions, 64 zillas, and 495 upazilas
   - Each entry includes: id, Bengali name, English name, and lat/lng coordinates
   - Structure: divisions array, each with a `zillas` array, each zilla with an `upazilas` array

2. **Rewrite `src/components/DistrictSelector.tsx` to `LocationPicker`**
   - Three cascading Select dropdowns: Division > Zilla > Upazila
   - Selecting a division filters and shows its zillas
   - Selecting a zilla filters and shows its upazilas
   - The component outputs the final lat/lng from the most specific selection
   - Saved selection persisted in localStorage

3. **Update `src/hooks/usePrayerTimes.ts`**
   - Instead of looking up a district ID from the flat list, accept lat/lng directly
   - The API call already uses lat/lng, so this is a minor refactor

4. **Update `src/pages/Index.tsx` and `src/pages/Schedule.tsx`**
   - Replace the district state with division/zilla/upazila state
   - Pass lat/lng from the selected location to usePrayerTimes

### Technical Details

**Data structure:**
```typescript
interface Upazila {
  id: string;
  nameBn: string;
  nameEn: string;
  lat: number;
  lng: number;
}

interface Zilla {
  id: string;
  nameBn: string;
  nameEn: string;
  lat: number;
  lng: number;
  upazilas: Upazila[];
}

interface Division {
  id: string;
  nameBn: string;
  nameEn: string;
  zillas: Zilla[];
}
```

**LocationPicker component behavior:**
- Step 1: Show division dropdown (always visible)
- Step 2: Show zilla dropdown (appears after division selected)
- Step 3: Show upazila dropdown (appears after zilla selected)
- Changing a parent resets child selections
- Prayer times use upazila coordinates (most accurate), falling back to zilla, then division center

**localStorage persistence:**
- Saves `{ division, zilla, upazila }` object so users don't re-select each visit

**usePrayerTimes refactor:**
- Change signature from `usePrayerTimes(districtId)` to `usePrayerTimes(lat, lng)`
- Remove dependency on the old `districts` array for coordinate lookup
- The Aladhan API call stays the same, just uses the passed coordinates

**Note:** The locations data file will be large (~495 entries with coordinates). All data will be bundled client-side for instant filtering without API calls.

