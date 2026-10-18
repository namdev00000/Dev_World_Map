# Implementation Plan & Specifications: Dev World Map

An interactive, responsive, and visually rich web application built with **HTML5, CSS3, modern JavaScript (ES6+), and Leaflet Maps**. This application provides an educational and analytical guide to geopolitical entities (UN Member States, Observer States, and De Facto/Unrecognized States), global saltwater bodies (Oceans, Marginal Seas, and Hypersaline Lakes), and live spatial map visuals.

---

## 1. Project Specifications & Design Architecture

### A. Welcome Screen Experience ("Welcome Friends!")
- **Interactive Welcome Page**: Initial entry point welcoming friends before venturing into the maincourse atlas.
- **Explorer Girl Pop-Up Animation**:
  - Transparent PNG of the enthusiastic world explorer girl holding and pointing to the world map (`assets/explorer-girl.png`).
  - Spring pop-up entry animation (`@keyframes girlPopIn`) scaling from below with glowing backdrop pulse and twinkling stars.
  - Continuous idle float animation (`@keyframes girlIdleFloat`) for lifelike vitality.
  - Floating status badge: "🧭 Global Cartographer".
- **Botanical Floral Corner Ornaments**:
  - 4 elegant floral corners (`assets/floral-tl.png`, `assets/floral-tr.png`, `assets/floral-bl.png`, `assets/floral-br.png`) framing the welcome card.
  - Ambient breathing sway animation (`@keyframes floralBreathe`).
- **Typography & Headline**:
  - Gradient header: **"Welcome Friends!"** (adapts dynamically to both pure black dark mode and crisp light mode).
  - Highlighting the 205 sovereign nations, oceans, saline seas, 3D cards, and live maps.
- **"Let's Explore ➔" CTA Button**:
  - Pulsing Electric Yellow button (`#facc15`) with hover shimmer reflection.
  - Clicking triggers a smooth portal transition (`@keyframes welcomeCardExit` and `@keyframes mainAppEnter`) taking the user directly into the main atlas.
- **Header Return Button**:
  - "👋 Welcome" button located in the main header allows returning to the welcome screen anytime with freshly re-triggered animations.

### B. Brand Identity & Theme Engine
- **App Name**: **Dev World Map** (Clean branding, no "PRO" label)
- **Theme Options**:
  - ☀️ **Light**: Clean, crisp white & slate layout.
  - 🌙 **Dark**: Pure Black (`#000000`) background with deep obsidian surfaces (`#0a0a0a` / `#141414`).
  - 💻 **System**: Automatically matches device local time (daytime: Light, nighttime: Dark) via a 30-second interval monitor.
- **Button Design**:
  - **Electric Yellow (`#facc15`)**: Used for continent selector active buttons, primary actions, reveal buttons, calling code badges, and observer state indicators.
  - **Neon Pink (`#ec4899`)**: Used for active navigation tabs, 3D card flips, web domain badges, UN member badges, and status pills.
  - **No Blue Buttons**: Clean, vibrant neo-modern high-contrast aesthetic.

### C. 6 Functional Header Quick-Filters
All 6 top stat pills are interactive buttons with hover animations that filter and navigate with smooth scrolling:
1. 🌐 **205 Total Countries & Territories**: Resets all filters to show every country.
2. 🇺🇳 **193 UN Member States**: Filters directly to UN Member States.
3. 🕊️ **2 UN Observer States**: Displays Vatican City & State of Palestine.
4. 🚩 **10 Limited / De Facto**: Displays partially recognized and de facto states.
5. 🌊 **5 World Oceans**: Navigates to Oceans tab and isolates the 5 major oceans.
6. 🧭 **18+ Marginal & Salt Seas**: Navigates to Oceans tab and filters to marginal seas and gulfs.

### D. Country Flashcards & Detail Modals
- **International Calling Code & Internet TLD (Web Domain)**:
  - Integrated across all **205 countries** (e.g. India has `+91` and `.in`).
  - **Card Front**: Visible under the details list with dedicated tags.
  - **Card Back**: 3D flip card includes calling code and internet domain stat boxes.
  - **Overview Modal**: Highlighted stat cards for telephone calling code and internet domain.

### E. Interactive World Map (3 Layer Styles)
- **Live World Map Tab (`#view-map`)**:
  - Powered by Leaflet with 100% free, watermark-free ESRI basemap layers:
    - 🌙 **Dark Canvas** (`World_Dark_Gray_Base`)
    - ☀️ **Light Canvas** (`World_Light_Gray_Base`)
    - 🛰️ **Satellite** (`World_Imagery`)
  - Features all **205 countries** plotted as interactive glowing pins.
  - Interactive popup displaying national flag, name, capital, currency, coordinates, and link to overview modal.
  - Seamlessly re-centers and zooms when selecting continent buttons.
- **In-Modal Geographic Locator Map**:
  - Shows country location with animated flag pin and coordinates.

### F. Study & Knowledge Quiz Engine (456 Multiple-Choice Questions)
- **Portion Points (228 Total)**:
  - 205 Sovereign Countries & Territories
  - 23 Oceans, Marginal Seas, and Hypersaline Lakes
- **Question Structure (456 Questions, Exactly 2 per Portion Point)**:
  - **Question 1 per portion**: Cultural landmarks, historic capitals, geographic superlatives, territorial borders, and marine hydrography.
  - **Question 2 per portion**: Currencies, international telephone calling codes (`+XX`), internet top-level domains (`.xx`), establishment/admission years, and marine hydrology.
  - 4 distinct multiple-choice options (A, B, C, D) per question with verified correctness.
- **Categorization & Filtering**:
  - **Categories**: All Questions (456), Countries & Territories (410), Oceans & Salt Seas (46).
  - **Continent / Region Filters**: Africa (112), Asia (98), Europe (98), North America (46), South America (24), Oceania (32), Oceans & Salt Seas (46).
- **Interactive Quiz Stage & Feedback**:
  - Instant visual feedback: Correct selection illuminates in Green (`#22c55e`); incorrect illuminates in Red (`#ef4444`) while automatically revealing the correct option.
  - Dynamic Educational Fact Insight box revealed upon selection with deep historical/geographical context.
  - Live Scoreboard: Progress tracker, Score counter, Streak counter, and Accuracy percentage.
  - Quiz Toolbar: Previous Question, Next Question, Random Question, Shuffle All, and Reset Score.
  - Keyboard accessibility: Arrow keys (`⬅`/`➡`) and option hotkeys (`1-4` or `A-D`).
- **Cleaned Up Legacy Elements**:
  - Removed old "Dev Flashcard Knowledge Trainer" tagline.
  - Completely replaced the previous 3D flip card system with this comprehensive 4-option engine.

---

## 2. Geopolitical Taxonomy & Marine Hydrography

1. **193 UN Member States**: All sovereign member states with admission dates.
2. **2 UN Permanent Observer States**: Holy See (Vatican City) and State of Palestine.
3. **10 De Facto / Associated / Partially Recognized Entities**: Taiwan (ROC), Kosovo, Western Sahara, Cook Islands, Niue, Somaliland, Transnistria, Northern Cyprus, Abkhazia, and South Ossetia.
4. **Marine Water Bodies (23)**:
   - 5 World Oceans: Pacific, Atlantic, Indian, Southern, Arctic.
   - 12 Marginal Seas: Mediterranean, Caribbean, South China, Bering, Coral, Arabian, Red, Black, Baltic, North, Sea of Japan, Persian Gulf.
   - 6 Hypersaline Inland Water Bodies: Caspian Sea, Dead Sea (~34%), Great Salt Lake, Aral Sea, Lake Urmia, Don Juan Pond (>44%).

---

## 3. Status

All requested features, welcome page, interactive maps, 205 country profiles, 23 waterbodies, and the 456-question quiz engine across all 228 portion points have been implemented and verified.
