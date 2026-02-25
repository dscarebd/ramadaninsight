
# Fix Missing and Incorrect Upazilas in Location Data

## Summary
Update `src/data/locations.ts` to correct 8 issues in the Bangladesh location database.

## Changes (all in `src/data/locations.ts`)

### 1. Add Karnaphuli upazila to Chattogram zilla
- Add `{ id: 'karnaphuli', nameBn: 'কর্ণফুলী', nameEn: 'Karnaphuli', lat: 22.3200, lng: 91.8000 }` after Hathazari (line 306 area)

### 2. Replace Langalkot with Lalmai in Comilla zilla
- Line 335: Change `langalkot` / `লাঙ্গলকোট` / `Langalkot` to `lalmai` / `লালমাই` / `Lalmai` with coordinates `lat: 23.3500, lng: 91.1300`

### 3. Add Eidgaon upazila to Cox's Bazar zilla
- Add `{ id: 'eidgaon', nameBn: 'ঈদগাঁও', nameEn: 'Eidgaon', lat: 21.4700, lng: 92.0200 }` in the upazilas list (after Coxs Bazar Sadar, line 351 area)

### 4. Add Naldanga upazila to Natore zilla
- Add `{ id: 'naldanga', nameBn: 'নলডাঙ্গা', nameEn: 'Naldanga', lat: 24.3400, lng: 89.0500 }` after Lalpur (line 530 area)

### 5. Add Dasar upazila to Madaripur zilla
- Add `{ id: 'dasar', nameBn: 'ডাসার', nameEn: 'Dasar', lat: 23.1200, lng: 90.1400 }` in Madaripur's upazilas (after Kalkini, line 120 area)

### 6. Add Madhyanagar upazila to Sunamganj zilla
- Add `{ id: 'madhyanagar', nameBn: 'মধ্যনগর', nameEn: 'Madhyanagar', lat: 25.0100, lng: 91.2800 }` in Sunamganj's upazilas (line 810 area)

### 7. Rename South Sunamganj to Shantiganj
- Line 813: Change id from `south-sunamganj` to `shantiganj`, nameBn from `দক্ষিণ সুনামগঞ্জ` to `শান্তিগঞ্জ`, nameEn from `South Sunamganj` to `Shantiganj`

### 8. Remove duplicate Nawabganj zilla from Rajshahi division
- Delete lines 535-544 (the duplicate `nawabganj` zilla entry with only 1 upazila), since `chapainawabganj` already covers this district correctly

## Technical Notes
- No other files need changes; all fixes are in `src/data/locations.ts`
- The `districts.ts` file also has a Nawabganj entry but it's a separate legacy dataset not used by the dropdown
