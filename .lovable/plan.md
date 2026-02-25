

# Add City Thanas for Other Major Cities

## Summary
After a full audit, all official upazilas across all 64 districts are present. The enhancement is to add city-level thanas for other major city corporations, just like was done for Dhaka, so urban residents in these cities can pick their neighborhood for more precise prayer times.

## Cities to Add Thanas For

### 1. Chattogram City (under Chattogram zilla)
Add thanas after existing upazilas:

| Thana | Bengali | Coordinates |
|-------|---------|-------------|
| Akbar Shah | আকবর শাহ | 22.3330, 91.8180 |
| Bakalia | বাকলিয়া | 22.3370, 91.8350 |
| Bayazid | বায়েজিদ | 22.3570, 91.8100 |
| Chandgaon | চান্দগাঁও | 22.3690, 91.8280 |
| Chawkbazar (Ctg) | চকবাজার | 22.3520, 91.8330 |
| Double Mooring | ডবলমুরিং | 22.3210, 91.8170 |
| EPZ | ইপিজেড | 22.3370, 91.7640 |
| Halishahar | হালিশহর | 22.3440, 91.7780 |
| Khulshi | খুলশী | 22.3540, 91.7990 |
| Kotwali (Ctg) | কোতোয়ালি | 22.3430, 91.8410 |
| Pahartali | পাহাড়তলী | 22.3590, 91.7620 |
| Panchlaish | পাঁচলাইশ | 22.3650, 91.8160 |
| Patenga | পতেঙ্গা | 22.2770, 91.7950 |
| Sadarghat (Ctg) | সদরঘাট | 22.3250, 91.8400 |

### 2. Gazipur City (under Gazipur zilla)
| Thana | Bengali | Coordinates |
|-------|---------|-------------|
| Basan | বাসন | 23.9900, 90.4050 |
| Chandona | চান্দনা | 24.0350, 90.3600 |
| Gacha | গাছা | 24.0120, 90.3850 |
| Konabari | কোনাবাড়ী | 23.9750, 90.3500 |
| Tongi East | তুরাগ পূর্ব | 23.9100, 90.4100 |
| Tongi West | তুরাগ পশ্চিম | 23.9050, 90.3850 |

### 3. Narayanganj City (under Narayanganj zilla)
| Thana | Bengali | Coordinates |
|-------|---------|-------------|
| Fatullah | ফতুল্লা | 23.6380, 90.4550 |
| Siddhirganj | সিদ্ধিরগঞ্জ | 23.6900, 90.5100 |

### 4. Rajshahi City (under Rajshahi zilla)
| Thana | Bengali | Coordinates |
|-------|---------|-------------|
| Boalia | বোয়ালিয়া | 24.3740, 88.5900 |
| Matihar | মতিহার | 24.3660, 88.6250 |
| Rajpara | রাজপাড়া | 24.3620, 88.6050 |
| Shah Makhdum | শাহ মখদুম | 24.3800, 88.5700 |

### 5. Khulna City (under Khulna zilla)
| Thana | Bengali | Coordinates |
|-------|---------|-------------|
| Daulatpur (Khulna) | দৌলতপুর | 22.8640, 89.5000 |
| Khalishpur | খালিশপুর | 22.8350, 89.5150 |
| Khan Jahan Ali | খান জাহান আলী | 22.8200, 89.5500 |
| Kotwali (Khulna) | কোতোয়ালি | 22.8190, 89.5540 |
| Sonadanga | সোনাডাঙ্গা | 22.8250, 89.5350 |

### 6. Sylhet City (under Sylhet zilla)
| Thana | Bengali | Coordinates |
|-------|---------|-------------|
| Dakshin Surma | দক্ষিণ সুরমা | 24.8700, 91.8750 |
| Hazrat Shahjalal | হযরত শাহজালাল | 24.9050, 91.8600 |
| Hazrat Shahparan | হযরত শাহপরান | 24.8900, 91.8900 |
| Jalalabad | জালালাবাদ | 24.8850, 91.8500 |
| Kotwali (Sylhet) | কোতোয়ালি | 24.8970, 91.8700 |
| Moglabazar | মোগলাবাজার | 24.8800, 91.8800 |

## Technical Notes
- Only `src/data/locations.ts` needs to be modified
- Each city's thanas are appended to the existing `upazilas` array of their respective zilla
- Same format as Dhaka thanas: `{ id, nameBn, nameEn, lat, lng }`
- Total additions: ~32 new entries across 6 cities
