

# Add City Thanas for Remaining City Corporations

## Summary
All 64 districts and their official upazilas are present. City thanas have been added for 7 major cities. This plan adds thanas for the remaining 4 city corporations: Rangpur, Barishal, Mymensingh, and Comilla.

## File to Modify
`src/data/locations.ts` only.

## Cities to Add Thanas For

### 1. Rangpur City (under Rangpur zilla, `rangpur-city`)
Append after existing upazilas (line ~1134):

| Thana | Bengali | Coordinates |
|-------|---------|-------------|
| Kotwali (Rangpur) | কোতোয়ালি | 25.7500, 89.2600 |
| Mahiganj | মাহিগঞ্জ | 25.7650, 89.2900 |
| Tajhat | তাজহাট | 25.7550, 89.2500 |

### 2. Barishal City (under Barishal zilla, `barishal-city`)
Append after existing upazilas (line ~949):

| Thana | Bengali | Coordinates |
|-------|---------|-------------|
| Kotwali (Barishal) | কোতোয়ালি | 22.7010, 90.3535 |
| Airport | এয়ারপোর্ট | 22.7150, 90.3720 |
| Bandar (Barishal) | বন্দর | 22.6900, 90.3650 |

### 3. Mymensingh City (under Mymensingh zilla, `mymensingh-city`)
Append after existing upazilas (line ~1193):

| Thana | Bengali | Coordinates |
|-------|---------|-------------|
| Kotwali (Mymensingh) | কোতোয়ালি | 24.7540, 90.4070 |

### 4. Comilla City (under Comilla zilla, `comilla`)
Append after existing upazilas (line ~405):

| Thana | Bengali | Coordinates |
|-------|---------|-------------|
| Kotwali (Comilla) | কোতোয়ালি | 23.4600, 91.1800 |
| Adarsha Sadar | আদর্শ সদর | 23.4500, 91.2000 |
| Sadar Dakshin (Thana) | সদর দক্ষিণ | 23.4200, 91.1700 |

## Technical Notes
- Same format as existing entries: `{ id, nameBn, nameEn, lat, lng }`
- Total additions: ~10 new entries across 4 cities
- No other files need changes

