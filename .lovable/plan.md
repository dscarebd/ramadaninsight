

# Bilingual Search with Fuzzy Matching for Location Finder

## Summary
Currently, the location search only matches against the active language (Bengali or English). This plan adds bilingual search (always matches both languages regardless of selection) and fuzzy/partial matching so users can find locations even with typos or partial input.

## What Changes

### File: `src/components/DistrictSelector.tsx`

**1. Update item data structure** to include both Bengali and English names:
- Change `items` from `{ id, label }[]` to `{ id, labelBn, labelEn, label }[]`
- `label` remains the display text (based on current language)
- `labelBn` and `labelEn` are always passed for search purposes

**2. Add custom filter function** to the `Command` component:
- The `cmdk` library's `Command` component accepts a `filter` prop for custom matching
- The filter will normalize the search query and check against both `nameBn` and `nameEn`
- Uses substring matching on both language names

**3. Add fuzzy matching logic:**
- If no exact substring match is found, split the query into individual words
- Match if 2+ characters of any word appear in either language name
- This handles common typos like "mirpr" matching "Mirpur" or "মিরপু" matching "মিরপুর"
- Results are ranked: exact matches score higher than partial/fuzzy matches

**4. Update `LocationPicker`** to pass both language labels in item arrays for divisions, zillas, and upazilas.

## Technical Approach

```text
User types: "mirpr" (typo)
                |
    Custom filter function runs
                |
    Check "mirpr" against:
      - "মিরপুর" (nameBn) --> no match
      - "Mirpur" (nameEn) --> substring "mirpr" not found
                |
    Fuzzy check: "mirpr" has 5 chars, 
    "mirpur" contains "mirp" --> partial match found
                |
    Result: Mirpur shown with lower rank
```

### Key implementation details:
- The `Command` component's `filter` prop returns a score (0 = no match, 1 = exact, 0.5 = fuzzy)
- Each `CommandItem` gets a `value` that combines both names (e.g., `"মিরপুর Mirpur"`) so the filter can search both
- Display text still shows only the selected language
- The `CommandEmpty` message becomes bilingual: "পাওয়া যায়নি / Not found"

