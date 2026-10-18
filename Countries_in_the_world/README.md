# Dev World Map: Interactive Spatial & Geopolitical Explorer

An interactive, responsive web application built with **HTML5, CSS3, Pure Vanilla JavaScript (ES6+), and Leaflet Maps**. This application provides an educational reference for global geopolitical entities, marine hydrography, and interactive world map visuals.

---

## 🌟 Key Features & Design Updates

### 1. Interactive Welcome Page ("Welcome Friends!")
- **Explorer Girl Pop-Up Animation**: Featuring the happy world explorer girl holding and pointing at the world map with a springy pop-up entrance (`@keyframes girlPopIn`) and floating idle animation.
- **Floral Corner Ornaments**: 4 botanical corner decorations framing the welcome card with subtle breathing sway effects.
- **"Welcome Friends!" Heading**: Elegant gradient typography welcoming the user with an overview of global geography and marine hydrography.
- **"Let's Explore ➔" Button**: High-energy Electric Yellow pulsing CTA button that triggers a smooth portal transition into the main atlas.
- **Navigation Transitions**: Fluid exit and enter animations between the Welcome Screen and Main Atlas, plus a "👋 Welcome" return button in the header.

### 2. App Identity: Dev World Map
- High-contrast, sleek interface with professional geospatial aesthetics.
- Quick navigation across:
  - 🎴 **Countries Flashcards** (205 Sovereign and De Facto Entities)
  - 🗺️ **Interactive World Map** (Live Leaflet map with global pins and popups)
  - 🌊 **Oceans & Saltwater Bodies** (5 Oceans + 18 Marginal & Salt Seas)
  - 🎯 **Study & Quiz Mode** (456 Multiple-Choice Questions across all 228 portion points)

### 2. Streamlined Theme Switcher
- **Themes**:
  - ☀️ **Light**: Crisp, high-contrast day theme.
  - 🌙 **Dark**: Pure Black (`#000000`) dark theme with deep obsidian surfaces.
  - 💻 **System**: Automatically matches device time (daytime: Light, nighttime: Dark) via a 30-second background ticker.

### 3. Pure Black, White, Electric Yellow & Neon Pink Button Design
- **Dark Mode Background**: **Pure Black (`#000000`)** with deep obsidian surfaces (`#0a0a0a` / `#141414`).
- **Typography**: High-contrast **Pure White (`#ffffff`)**.
- **Button Styling**:
  - **Electric Yellow (`#facc15`)**: Used for active continent buttons, primary action buttons, reveal buttons, calling codes, and observer state indicators.
  - **Neon Pink (`#ec4899`)**: Used for active navigation tabs, card flip buttons, web domain tags, UN member state highlights, and status pills.
  - **No Blue Buttons**: Clean, vibrant, sharp neo-modern visual design.

### 4. Interactive Live World Map with 3 Basemap Styles
- **Live World Map Tab (`#view-map`)**:
  - High-performance, watermark-free production tiles powered by Leaflet & ESRI:
    - 🌙 **Dark Canvas** (`World_Dark_Gray_Base`)
    - ☀️ **Light Canvas** (`World_Light_Gray_Base`)
    - 🛰️ **Satellite** (`World_Imagery`)
  - Features all **205 countries** plotted as interactive glowing pins (categorized into UN Members, Observers, and Limited Recognition).
  - Clicking any pin reveals an instant summary card with flag, capital, currency, establishment date, and an "Open Full Overview" button.
  - Seamlessly re-centers and zooms when selecting continent buttons.
- **In-Modal Geographic Locator Map**:
  - Clicking "Details" on any country card opens an interactive mini-map zoomed to that nation with an animated flag marker and exact coordinates.

### 5. 6 Functional Quick-Filter Header Tickers
Clicking any of the 6 header stat cards immediately filters and navigates to the relevant view with smooth scroll:
1. 🌐 **205 Total Countries & Territories**: Resets all filters to show every country.
2. 🇺🇳 **193 UN Member States**: Instantly filters to UN Member States.
3. 🕊️ **2 UN Observer States**: Displays Vatican City & State of Palestine.
4. 🚩 **10 Limited / De Facto**: Displays partially recognized and de facto states.
5. 🌊 **5 World Oceans**: Navigates to Oceans tab and isolates the 5 major oceans.
6. 🧭 **18+ Marginal & Salt Seas**: Navigates to Oceans tab and filters to marginal seas and gulfs.

### 6. Country Telephone Calling Codes & Internet Domain Codes (TLD)
- Integrated into all **205 country profiles**:
  - **Card Front**: 📞 Calling Code (e.g. `+91`) and 🌐 Web Domain (e.g. `.in`) badges.
  - **Card Back**: Dedicated stat boxes in the 3D flip view.
  - **Detail Modal**: Prominent stat cards with international telecommunication and domain registries.

### 7. Interactive Study & Quiz Engine (456 Multiple-Choice Questions)
- **228 Portion Points Covered**:
  - All 205 Sovereign Nations and De Facto Territories
  - All 23 World Oceans, Marginal Seas, and Hypersaline Lakes
- **456 Creative Questions (2 per Portion Point)**:
  - **Question 1**: Cultural landmarks, historic capitals, geographic superlatives, border relations, or marine features.
  - **Question 2**: Currencies, calling codes (`+XX`), web domains (`.xx`), establishment/admission years, or salinity/depth hydrology.
- **4 Distinct Options per Question (A, B, C, D)**:
  - Instant interactive feedback with Green (`#22c55e`) for correct answers and Red (`#ef4444`) for incorrect answers.
  - Automatically reveals the correct answer and opens the **Educational Fact Insight** box explaining the history/geography.
- **Filters & Categorization**:
  - **By Category**: All (456), Countries & Territories (410), Oceans & Salt Seas (46).
  - **By Continent / Region**: Africa (112), Asia (98), Europe (98), North America (46), South America (24), Oceania (32), Oceans (46).
- **Scoreboard & Navigation Toolbar**:
  - Real-time Progress, Score, Streak, and Accuracy percentage counters.
  - Controls: Previous, Next, Random Question, Shuffle All, and Reset Score.
  - Full keyboard accessibility: Left/Right arrows, `1-4`, and `A-D` keys.

---

## 📁 Project Structure

```
Countries_in_the_world/
├── index.html              # Main single-page application structure
├── css/
│   └── styles.css          # Pure black theme, yellow & pink buttons, map styles, quiz engine
├── js/
│   ├── countries-data.js   # 205 countries with coordinates, capitals, currencies, codes
│   ├── waterbodies-data.js # 23 oceans, marginal seas, and salt lakes
│   ├── quiz-data.js        # 456 creative multiple-choice questions across 228 portions
│   └── app.js              # Theme engine, Leaflet map, quiz engine controller
├── PLAN.md                 # Implementation roadmap
└── README.md               # Documentation
```

---

## 🚀 How to Run

Because this project is built using modern web standards with no build step:
1. Double-click `index.html` to open directly in any web browser.
2. Or run via local server:
   ```powershell
   python -m http.server 8000
   ```
   and navigate to `http://localhost:8000`.
