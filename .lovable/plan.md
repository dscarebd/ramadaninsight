
## Dynamic Header: App Title on Home, Page Titles on Other Pages

### What Changes
The header will show the app branding ("রমজান ইনসাইট / Ramadan Insight" with "বাংলাদেশ") only on the home page (`/`). On all other pages, it will show the relevant page title instead (e.g., "দোয়া ও হাদিস", "নামাজ ট্র্যাকার", "সময়সূচী", "সেটিংস").

### Page Title Mapping
| Route | Bengali Title | English Title |
|-------|--------------|---------------|
| `/` | রমজান ইনসাইট + বাংলাদেশ | Ramadan Insight + Bangladesh |
| `/dua` | দোয়া ও হাদিস | Dua & Hadith |
| `/salat` | নামাজ ট্র্যাকার | Salat Tracker |
| `/schedule` | সময়সূচী | Schedule |
| `/settings` | সেটিংস | Settings |

### Technical Details

**File: `src/components/Header.tsx`**
- Import `useLocation` from `react-router-dom`
- Check if current path is `/` (home)
- If home: show current branding (app name + Bangladesh subtitle)
- If other page: show page-specific title based on route, no subtitle
