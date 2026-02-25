

# Add Dhaka City Thanas to Location Dropdown

## Summary
Add major Dhaka city thanas/areas as selectable locations under the existing Dhaka zilla, so city residents can pick their neighborhood for more accurate prayer times.

## What Changes

### File: `src/data/locations.ts`

Add the following Dhaka city thanas to the Dhaka zilla's `upazilas` array (after the existing 5 upazilas). These are the major thana/areas within Dhaka city:

| Thana | Bengali | Coordinates |
|-------|---------|-------------|
| Adabor | আদাবর | 23.7590, 90.3500 |
| Badda | বাড্ডা | 23.7800, 90.4260 |
| Bangshal | বংশাল | 23.7190, 90.4030 |
| Cantonment | ক্যান্টনমেন্ট | 23.8170, 90.4010 |
| Chackbazar | চকবাজার | 23.7210, 90.4000 |
| Darus Salam | দারুস সালাম | 23.7480, 90.3630 |
| Demra | ডেমরা | 23.7080, 90.4850 |
| Dhanmondi | ধানমন্ডি | 23.7461, 90.3742 |
| Gandaria | গেন্ডারিয়া | 23.7050, 90.4250 |
| Gulshan | গুলশান | 23.7925, 90.4078 |
| Hazaribagh | হাজারীবাগ | 23.7310, 90.3680 |
| Jatrabari | যাত্রাবাড়ী | 23.7100, 90.4350 |
| Kadamtali | কদমতলী | 23.6980, 90.4460 |
| Kafrul | কাফরুল | 23.7950, 90.3880 |
| Kalabagan | কলাবাগান | 23.7430, 90.3760 |
| Kamrangirchar | কামরাঙ্গীরচর | 23.7220, 90.3810 |
| Khilgaon | খিলগাঁও | 23.7530, 90.4350 |
| Khilkhet | খিলক্ষেত | 23.8290, 90.4230 |
| Kotwali | কোতোয়ালি | 23.7160, 90.4080 |
| Lalbagh | লালবাগ | 23.7180, 90.3880 |
| Mirpur | মিরপুর | 23.8042, 90.3687 |
| Mohammadpur | মোহাম্মদপুর | 23.7662, 90.3586 |
| Motijheel | মতিঝিল | 23.7330, 90.4170 |
| New Market | নিউমার্কেট | 23.7340, 90.3850 |
| Pallabi | পল্লবী | 23.8200, 90.3650 |
| Paltan | পল্টন | 23.7360, 90.4130 |
| Ramna | রমনা | 23.7400, 90.4060 |
| Rampura | রামপুরা | 23.7620, 90.4340 |
| Sabujbagh | সবুজবাগ | 23.7430, 90.4310 |
| Shah Ali | শাহ আলী | 23.7970, 90.3580 |
| Shahbagh | শাহবাগ | 23.7390, 90.3960 |
| Sher-e-Bangla Nagar | শেরেবাংলা নগর | 23.7630, 90.3750 |
| Shyampur | শ্যামপুর | 23.6920, 90.4360 |
| Sutrapur | সূত্রাপুর | 23.7120, 90.4130 |
| Tejgaon | তেজগাঁও | 23.7600, 90.3920 |
| Tejgaon Industrial | তেজগাঁও শিল্পাঞ্চল | 23.7680, 90.4000 |
| Turag | তুরাগ | 23.8750, 90.3900 |
| Uttara | উত্তরা | 23.8759, 90.3795 |
| Uttarkhan | উত্তরখান | 23.8700, 90.4100 |
| Vatara | ভাটারা | 23.8100, 90.4300 |
| Wari | ওয়ারী | 23.7170, 90.4130 |

## Technical Notes
- Only `src/data/locations.ts` needs to be modified
- These entries are added as items in the existing `upazilas` array for the Dhaka zilla, alongside the 5 existing upazilas (Dhamrai, Dohar, Keraniganj, Nawabganj, Savar)
- Each entry follows the same format: `{ id, nameBn, nameEn, lat, lng }`
- Coordinates are approximate center points of each thana for prayer time accuracy
