
# Ramadan Timer BD — Clone App

## Overview
A Ramadan calendar and prayer time tracker for Bangladesh, supporting all 64 districts, with bilingual support (Bengali + English), live countdowns, and user accounts for persistent salat tracking.

---

## Page 1: Home / Dashboard
- **Header**: "রমজান ক্যালেন্ডার ২০২৬" / "Ramadan Calendar 2026" with language toggle (BN/EN)
- **Current Ramadan day display**: Hijri date, Gregorian date, Roza count (e.g., 3/30)
- **District selector**: Dropdown/modal with searchable list of all 64 Bangladesh districts (supports both Bangla and English search)
- **Live status banner**: "রোজা চলছে" (Fasting in progress) or current status
- **Countdown timers**: Real-time countdown to next Sehri or Iftar based on selected district
- **Today's times card**: Sehri end time and Iftar start time for the selected district
- **Sehri Niyat (intention)**: Arabic text with Bengali/English transliteration and translation
- **Iftar Dua**: Arabic text with Bengali/English transliteration and translation

## Page 2: Dua & Hadith Section
- Daily Hadith display in Arabic + Bengali/English
- Collection of Ramadan-related duas
- Accessible from bottom navigation tab

## Page 3: 5 Waqt Salat Tracker
- Checkboxes for Fajr, Dhuhr, Asr, Maghrib, Isha & Taraweeh
- Warning message: "Don't check without praying"
- Completion celebration: "MashaAllah! 🎉" animation when all 5 are checked
- Reset button for daily reset
- **Data persists across devices** via user account (Supabase)

## Page 4: Full Ramadan Schedule
- Complete 30-day table with Sehri and Iftar times for the selected district
- Highlight current day

---

## Design & UX
- **Color scheme**: Light mint/green Islamic theme matching the original app
- **Mobile-first layout** optimized for phone screens
- **Bottom navigation bar** with 3 tabs: Dua & Hadith, Salat Tracker, Full Schedule
- **Smooth transitions** and countdown animations
- Bengali as default language with EN toggle in header

## Backend (Lovable Cloud + Supabase)
- **Prayer time data**: Fetched from Aladhan API based on district coordinates
- **User authentication**: Email-based signup/login to persist salat tracker data
- **Database**: Store user's selected district preference and daily salat tracking progress
- **Edge function**: Proxy prayer time API calls through Supabase edge function
