/**
 * Dev World Map: Interactive Spatial & Geopolitical Explorer
 * Controller: Device-Time-Based Theme Engine (Day=Light, Night=Dark),
 * Leaflet Interactive World Map, 3D Flashcards, Filtering, Search, and Quiz Mode.
 */

(function () {
  'use strict';

  // --- STATE MANAGEMENT ---
  const state = {
    theme: localStorage.getItem('dev_world_map_theme') || 'system',
    currentView: 'countries',
    selectedContinent: 'All',
    selectedStatus: 'all',
    searchQuery: '',
    sortBy: 'name-asc',
    countries: window.COUNTRIES_DATA || [],
    waterbodies: window.WATERBODIES_DATA || [],
    selectedWaterType: 'all',
    mapStyle: 'dark',
    quiz: {
      questions: [],
      filtered: [],
      currentIndex: 0,
      score: 0,
      answeredCount: 0,
      streak: 0,
      userAnswers: {},
      activeFilter: 'all',
      activeRegion: null,
      isInitialized: false
    }
  };

  // Map state
  let worldMap = null;
  let worldMapTileLayer = null;
  let worldMapMarkersLayer = null;
  let modalMiniMap = null;
  let modalMiniMapMarker = null;
  let modalMiniMapTileLayer = null;

  // --- DOM ELEMENT REFERENCES ---
  const elements = {
    // Welcome Page Elements
    welcomeScreen: document.getElementById('welcome-screen'),
    welcomeCard: document.getElementById('welcome-card-wrapper'),
    welcomeGirlImg: document.getElementById('welcome-girl-img'),
    btnLetsExplore: document.getElementById('btn-lets-explore'),
    btnNavWelcome: document.getElementById('btn-nav-welcome'),
    mainApp: document.getElementById('main-app'),

    // Theme buttons
    themeBtns: document.querySelectorAll('.theme-btn'),
    
    // Top Stats Ticker Quick-Filter Buttons
    statTotalCountries: document.getElementById('stat-total-countries'),
    statUnMembers: document.getElementById('stat-un-members'),
    statUnObservers: document.getElementById('stat-un-observers'),
    statDeFacto: document.getElementById('stat-de-facto'),
    statOceansCount: document.getElementById('stat-oceans-count'),
    statSeasCount: document.getElementById('stat-seas-count'),
    
    // View Tabs
    navTabs: document.querySelectorAll('.nav-tab'),
    viewPanels: document.querySelectorAll('.view-panel'),
    tabCountriesBadge: document.getElementById('tab-countries-badge'),
    tabWaterBadge: document.getElementById('tab-water-badge'),

    // Continent Buttons
    continentBtns: document.querySelectorAll('.continent-btn'),
    antarcticaBanner: document.getElementById('antarctica-banner'),

    // Filter & Search Controls
    countrySearch: document.getElementById('country-search'),
    searchClearBtn: document.getElementById('search-clear'),
    statusPills: document.querySelectorAll('.status-pill'),
    sortSelect: document.getElementById('sort-select'),
    btnShuffle: document.getElementById('btn-shuffle'),
    resultsCount: document.getElementById('results-count'),
    noResults: document.getElementById('no-results'),
    btnResetFilters: document.getElementById('btn-reset-filters'),

    // Cards Grid
    countriesGrid: document.getElementById('countries-grid'),

    // Water Bodies View
    waterFilterBtns: document.querySelectorAll('.water-btn'),
    waterbodiesGrid: document.getElementById('waterbodies-grid'),
    wbCountAll: document.getElementById('wb-count-all'),

    // Quiz Mode Elements (456-Question Multiple-Choice Engine)
    quizCurrentNum: document.getElementById('quiz-current-num'),
    quizTotalNum: document.getElementById('quiz-total-num'),
    quizScoreVal: document.getElementById('quiz-score-val'),
    quizAnsweredCount: document.getElementById('quiz-answered-count'),
    quizStreakVal: document.getElementById('quiz-streak-val'),
    quizAccuracyVal: document.getElementById('quiz-accuracy-val'),
    quizCountAll: document.getElementById('quiz-count-all'),

    quizCatBtns: document.querySelectorAll('.quiz-cat-btn'),
    quizSubBtns: document.querySelectorAll('.quiz-sub-btn'),

    quizInteractiveCard: document.getElementById('quiz-interactive-card'),
    qCategoryBadge: document.getElementById('q-category-badge'),
    qRegionBadge: document.getElementById('q-region-badge'),
    qTypeBadge: document.getElementById('q-type-badge'),
    qPortionIndicator: document.getElementById('q-portion-indicator'),
    qText: document.getElementById('q-text'),
    qOptionsContainer: document.getElementById('q-options-container'),
    qExplanationBox: document.getElementById('q-explanation-box'),
    expStatusIcon: document.getElementById('exp-status-icon'),
    expStatusTitle: document.getElementById('exp-status-title'),
    expText: document.getElementById('exp-text'),

    btnQuizPrev: document.getElementById('btn-quiz-prev'),
    btnQuizNext: document.getElementById('btn-quiz-next'),
    btnQuizRandom: document.getElementById('btn-quiz-random'),
    btnQuizShuffle: document.getElementById('btn-quiz-shuffle'),
    btnQuizResetScore: document.getElementById('btn-quiz-reset-score'),

    // Modal Elements
    detailModal: document.getElementById('detail-modal'),
    modalCloseBtn: document.getElementById('modal-close'),
    modalFlagImg: document.getElementById('modal-flag-img'),
    modalFlagFallback: document.getElementById('modal-flag-fallback'),
    modalStatusBadge: document.getElementById('modal-status-badge'),
    modalContinentBadge: document.getElementById('modal-continent-badge'),
    modalTitle: document.getElementById('modal-title'),
    modalOfficialName: document.getElementById('modal-official-name'),
    modalCapital: document.getElementById('modal-capital'),
    modalCurrency: document.getElementById('modal-currency'),
    modalEstablished: document.getElementById('modal-established'),
    modalUnYear: document.getElementById('modal-un-year'),
    modalPopulation: document.getElementById('modal-population'),
    modalArea: document.getElementById('modal-area'),
    modalCallingCode: document.getElementById('modal-calling-code'),
    modalTld: document.getElementById('modal-tld'),
    modalCoordsVal: document.getElementById('modal-coords-val'),
    modalLocationSnippet: document.getElementById('modal-location-snippet'),
    modalFunfact: document.getElementById('modal-funfact'),
    modalLinkMaps: document.getElementById('modal-link-maps'),
    modalLinkWiki: document.getElementById('modal-link-wiki')
  };

  // --- 1. DEVICE TIME-BASED THEME ENGINE ---
  // Daylight (6:00 AM to 6:59 PM) -> Light theme
  // Nighttime (7:00 PM to 5:59 AM) -> Pure Black Dark theme
  function getDeviceTimeTheme() {
    const hours = new Date().getHours();
    const isDay = hours >= 6 && hours < 19;
    return isDay ? 'light' : 'dark';
  }

  function getActiveEffectiveTheme() {
    if (state.theme === 'system') {
      return getDeviceTimeTheme();
    }
    return state.theme;
  }

  function applyTheme(themeChoice) {
    state.theme = themeChoice;
    localStorage.setItem('dev_world_map_theme', themeChoice);

    const effectiveTheme = getActiveEffectiveTheme();
    document.documentElement.setAttribute('data-theme', effectiveTheme);

    // Update active state on buttons
    elements.themeBtns.forEach(btn => {
      if (btn.getAttribute('data-theme-choice') === themeChoice) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Refresh map tiles to match theme
    updateMapTileThemes();
  }

  function initTheme() {
    applyTheme(state.theme);

    // Dynamic timer checking device time every 30 seconds
    setInterval(() => {
      if (state.theme === 'system') {
        const effectiveTheme = getDeviceTimeTheme();
        if (document.documentElement.getAttribute('data-theme') !== effectiveTheme) {
          document.documentElement.setAttribute('data-theme', effectiveTheme);
          updateMapTileThemes();
        }
      }
    }, 30000);

    elements.themeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const choice = btn.getAttribute('data-theme-choice');
        applyTheme(choice);
      });
    });
  }

  // --- 2. FORMATTING HELPERS ---
  function formatNumber(num) {
    if (num === null || num === undefined) return 'N/A';
    return Number(num).toLocaleString('en-US');
  }

  function parseEstablishmentYear(yearStr) {
    if (!yearStr) return 9999;
    const str = String(yearStr).trim();
    if (str.includes('BCE') || str.includes('BC')) {
      const num = parseInt(str.replace(/[^0-9]/g, ''), 10) || 0;
      return -num;
    }
    const match = str.match(/\d{3,4}/);
    return match ? parseInt(match[0], 10) : 9999;
  }

  function getStatusClass(status) {
    switch (status) {
      case 'un_member': return 'un-member';
      case 'observer': return 'observer';
      case 'partially_recognized': return 'partially_recognized';
      case 'de_facto': return 'de_facto';
      default: return 'un-member';
    }
  }

  // --- 3. FILTERING & SORTING LOGIC ---
  function getFilteredCountries() {
    let list = [...state.countries];

    // Filter by Continent
    if (state.selectedContinent !== 'All') {
      list = list.filter(c => c.continent === state.selectedContinent);
    }

    // Filter by Geopolitical Status
    if (state.selectedStatus === 'un_member') {
      list = list.filter(c => c.status === 'un_member');
    } else if (state.selectedStatus === 'observer') {
      list = list.filter(c => c.status === 'observer');
    } else if (state.selectedStatus === 'limited') {
      list = list.filter(c => c.status === 'partially_recognized' || c.status === 'de_facto');
    }

    // Filter by Search Query
    if (state.searchQuery.trim() !== '') {
      const q = state.searchQuery.toLowerCase().trim();
      list = list.filter(c => {
        const nameMatch = c.name.toLowerCase().includes(q);
        const officialMatch = (c.officialName || '').toLowerCase().includes(q);
        const capitalMatch = (c.capital || '').toLowerCase().includes(q);
        const currencyMatch = (c.currency?.name || '').toLowerCase().includes(q) || (c.currency?.code || '').toLowerCase().includes(q);
        const locationMatch = (c.location?.nearby || '').toLowerCase().includes(q) || (c.subregion || '').toLowerCase().includes(q);
        return nameMatch || officialMatch || capitalMatch || currencyMatch || locationMatch;
      });
    }

    // Sorting
    switch (state.sortBy) {
      case 'name-asc':
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        list.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'year-asc':
        list.sort((a, b) => parseEstablishmentYear(a.establishmentYear) - parseEstablishmentYear(b.establishmentYear));
        break;
      case 'year-desc':
        list.sort((a, b) => parseEstablishmentYear(b.establishmentYear) - parseEstablishmentYear(a.establishmentYear));
        break;
      case 'pop-desc':
        list.sort((a, b) => (b.stats?.population || 0) - (a.stats?.population || 0));
        break;
      case 'area-desc':
        list.sort((a, b) => (b.stats?.areaKm2 || 0) - (a.stats?.areaKm2 || 0));
        break;
      default:
        list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }

  // --- 4. RENDER FLASHCARDS ---
  function renderCountriesGrid() {
    const list = getFilteredCountries();
    elements.countriesGrid.innerHTML = '';

    // Show/hide Antarctica banner
    if (state.selectedContinent === 'Antarctica') {
      elements.antarcticaBanner.classList.remove('hidden');
    } else {
      elements.antarcticaBanner.classList.add('hidden');
    }

    // Results count
    elements.resultsCount.textContent = `Showing ${list.length} of ${state.countries.length} countries`;

    // Empty state
    if (list.length === 0) {
      elements.noResults.classList.remove('hidden');
      return;
    } else {
      elements.noResults.classList.add('hidden');
    }

    const fragment = document.createDocumentFragment();

    list.forEach(country => {
      const card = document.createElement('article');
      card.className = 'country-card';
      card.setAttribute('data-id', country.id);

      const statusBadgeClass = getStatusClass(country.status);
      const flagUrl = `https://flagcdn.com/w160/${country.code2.toLowerCase()}.png`;

      card.innerHTML = `
        <div class="card-inner">
          <!-- FRONT FACE -->
          <div class="card-face card-front">
            <div class="card-front-header">
              <div class="flag-box">
                <img class="flag-img" src="${flagUrl}" alt="${country.name} flag" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                <span class="flag-fallback" style="display:none;">${country.flag}</span>
              </div>
              <div class="card-badges">
                <span class="status-badge ${statusBadgeClass}">${country.statusLabel}</span>
                <span class="continent-badge">${country.continent}</span>
              </div>
            </div>

            <div class="card-title-block">
              <h2 class="country-name">${country.name}</h2>
              <div class="country-official-name" title="${country.officialName}">${country.officialName}</div>
            </div>

            <div class="card-details-list">
              <div class="detail-item">
                <span class="detail-label">🏛️ Capital:</span>
                <span class="detail-val">${country.capital || 'N/A'}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">🪙 Currency:</span>
                <span class="detail-val">${country.currency.name} (${country.currency.code || ''}${country.currency.symbol ? ', ' + country.currency.symbol : ''})</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">📅 Established:</span>
                <span class="detail-val">${country.establishmentYear}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">📍 Location:</span>
                <span class="detail-val location-val" title="${country.location.nearby}">${country.subregion || country.continent} • ${country.location.nearby}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">📞 Call Code:</span>
                <span class="detail-val calling-val">${country.callingCode || 'N/A'}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">🌐 Web Domain:</span>
                <span class="detail-val domain-val">${country.tld || 'N/A'}</span>
              </div>
            </div>

            <div class="card-actions">
              <button type="button" class="btn-card flip-btn" data-action="flip" title="Flip to see additional statistics">
                <span>🔄</span> Flip Card
              </button>
              <button type="button" class="btn-card detail-btn" data-action="detail" title="View complete geopolitical profile & map">
                <span>🔍</span> Details
              </button>
            </div>
          </div>

          <!-- BACK FACE -->
          <div class="card-face card-back">
            <div class="card-back-header">
              <div class="card-back-title">${country.name} Quick Facts</div>
              <span class="status-badge ${statusBadgeClass}">${country.status === 'un_member' ? 'UN Member' : country.statusLabel}</span>
            </div>

            <div class="card-back-stats">
              <div class="stat-box">
                <span class="box-label">👥 Population</span>
                <span class="box-value">${formatNumber(country.stats.population)}</span>
              </div>
              <div class="stat-box">
                <span class="box-label">📐 Land Area</span>
                <span class="box-value">${formatNumber(country.stats.areaKm2)} km²</span>
              </div>
              <div class="stat-box">
                <span class="box-label">🇺🇳 UN Admission</span>
                <span class="box-value">${country.unAdmissionYear || 'Non-Member'}</span>
              </div>
              <div class="stat-box">
                <span class="box-label">🧭 Subregion</span>
                <span class="box-value">${country.subregion || country.continent}</span>
              </div>
              <div class="stat-box">
                <span class="box-label">📞 Calling Code</span>
                <span class="box-value">${country.callingCode || 'N/A'}</span>
              </div>
              <div class="stat-box">
                <span class="box-label">🌐 Internet Domain</span>
                <span class="box-value">${country.tld || 'N/A'}</span>
              </div>
            </div>

            <div class="card-back-funfact">
              <strong>Geopolitical Highlight:</strong><br>
              "${country.funFact || country.establishmentNote}"
            </div>

            <div class="card-actions">
              <button type="button" class="btn-card flip-btn" data-action="flip" title="Flip back to front view">
                <span>🔄</span> Flip Back
              </button>
              <button type="button" class="btn-card detail-btn" data-action="detail" title="View complete overview & map">
                <span>🔍</span> Full Details
              </button>
            </div>
          </div>
        </div>
      `;

      // Event delegation for card flipping and modal opening
      card.addEventListener('click', (e) => {
        const actionBtn = e.target.closest('button[data-action]');
        if (actionBtn) {
          const action = actionBtn.getAttribute('data-action');
          if (action === 'flip') {
            card.classList.toggle('flipped');
          } else if (action === 'detail') {
            openDetailModal(country);
          }
        } else {
          card.classList.toggle('flipped');
        }
      });

      fragment.appendChild(card);
    });

    elements.countriesGrid.appendChild(fragment);
  }

  // --- 5. INTERACTIVE WORLD MAP (LEAFLET) ---
  // Free, high-performance, watermark-free production map tiles (No API Key Required)
  const MAP_TILES = {
    dark: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    light: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
  };

  const CONTINENT_BOUNDS = {
    'All': { center: [20, 0], zoom: 2 },
    'Africa': { center: [2.5, 20.0], zoom: 3 },
    'Asia': { center: [34.0, 95.0], zoom: 3 },
    'Europe': { center: [52.0, 15.0], zoom: 4 },
    'North America': { center: [40.0, -100.0], zoom: 3 },
    'South America': { center: [-15.0, -60.0], zoom: 3 },
    'Oceania': { center: [-22.0, 140.0], zoom: 3 },
    'Antarctica': { center: [-75.0, 0.0], zoom: 2 }
  };

  function getActiveMapTileUrl() {
    if (state.mapStyle === 'light') return MAP_TILES.light;
    if (state.mapStyle === 'satellite') return MAP_TILES.satellite;
    return MAP_TILES.dark; // Default high-contrast dark canvas
  }

  function updateMapTileThemes() {
    const tileUrl = getActiveMapTileUrl();

    if (worldMapTileLayer) {
      worldMapTileLayer.setUrl(tileUrl);
    }
    if (modalMiniMapTileLayer) {
      const modalTileUrl = getActiveEffectiveTheme() === 'dark' ? MAP_TILES.dark : MAP_TILES.light;
      modalMiniMapTileLayer.setUrl(modalTileUrl);
    }
  }

  function fitMapToContinent(continent) {
    if (!worldMap) return;
    const config = CONTINENT_BOUNDS[continent] || CONTINENT_BOUNDS['All'];
    worldMap.flyTo(config.center, config.zoom, { duration: 1.0 });
  }

  function initWorldMap() {
    if (worldMap || typeof L === 'undefined') return;

    const mapElement = document.getElementById('world-map');
    if (!mapElement) return;

    const tileUrl = getActiveMapTileUrl();

    worldMap = L.map('world-map', {
      center: [20, 0],
      zoom: 2,
      minZoom: 2,
      maxZoom: 14,
      zoomControl: true,
      scrollWheelZoom: true
    });

    worldMapTileLayer = L.tileLayer(tileUrl, {
      attribution: '&copy; <a href="https://www.esri.com/">Esri</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18
    }).addTo(worldMap);

    worldMapMarkersLayer = L.layerGroup().addTo(worldMap);
    renderWorldMapMarkers();
    fitMapToContinent(state.selectedContinent);
  }

  function renderWorldMapMarkers() {
    if (!worldMap || !worldMapMarkersLayer) return;

    worldMapMarkersLayer.clearLayers();
    const list = getFilteredCountries();

    list.forEach(country => {
      if (!country.latlng || country.latlng.length < 2) return;

      const [lat, lng] = country.latlng;
      let markerType = 'un';
      if (country.status === 'observer') markerType = 'observer';
      else if (country.status === 'partially_recognized' || country.status === 'de_facto') markerType = 'limited';

      const customIcon = L.divIcon({
        className: 'map-custom-marker-wrapper',
        html: `<div class="map-marker-pin ${markerType}" title="${country.name}"></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7]
      });

      const marker = L.marker([lat, lng], { icon: customIcon });

      const popupHtml = `
        <div class="map-popup-card">
          <div class="map-popup-header">
            <span class="map-popup-flag">${country.flag}</span>
            <div class="map-popup-name">${country.name}</div>
          </div>
          <div style="font-size: 0.8rem; line-height: 1.4;">
            <div>🏛️ <strong>Capital:</strong> ${country.capital || 'N/A'}</div>
            <div>🪙 <strong>Currency:</strong> ${country.currency.name} (${country.currency.code || ''})</div>
            <div>📅 <strong>Established:</strong> ${country.establishmentYear}</div>
            <div>🧭 <strong>Continent:</strong> ${country.continent}</div>
          </div>
          <button type="button" class="map-popup-btn" onclick="window.__devWorldMapOpenModal('${country.id}')">
            🔍 Open Full Overview
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml);
      worldMapMarkersLayer.addLayer(marker);
    });
  }

  // Global helper for Leaflet popups
  window.__devWorldMapOpenModal = function (countryId) {
    const country = state.countries.find(c => c.id === countryId);
    if (country) openDetailModal(country);
  };

  // --- 6. OCEANS & SALTWATER BODIES RENDERING ---
  function renderWaterbodiesGrid() {
    let list = [...state.waterbodies];

    if (state.selectedWaterType !== 'all') {
      list = list.filter(w => w.type === state.selectedWaterType);
    }

    elements.waterbodiesGrid.innerHTML = '';
    const fragment = document.createDocumentFragment();

    list.forEach(wb => {
      const card = document.createElement('article');
      card.className = 'water-card';

      const salinityPercent = Math.min(100, Math.max(5, (wb.salinityValue / 44) * 100));
      const borderingText = wb.borderingContinents ? wb.borderingContinents.join(', ') : 'Global';
      const coastalText = wb.coastalCountries ? wb.coastalCountries.slice(0, 8).join(', ') + (wb.coastalCountries.length > 8 ? '...' : '') : 'Global oceanic basin';

      card.innerHTML = `
        <div class="water-card-header">
          <div>
            <h3 class="water-name">${wb.name}</h3>
            <span class="water-badge ${wb.type}">${wb.typeLabel}</span>
          </div>
          <span style="font-size: 2rem;">${wb.type === 'ocean' ? '🌊' : (wb.type === 'salt_lake' ? '🧂' : '⛵')}</span>
        </div>

        <div class="salinity-meter-wrap">
          <div class="salinity-meter-header">
            <span>Average Salinity Level</span>
            <span><strong>${wb.salinityAvg}</strong> (Global Ocean Avg: 3.5%)</span>
          </div>
          <div class="salinity-meter-bar">
            <div class="salinity-meter-fill" style="width: ${salinityPercent}%;"></div>
          </div>
        </div>

        <div class="water-metrics-grid">
          <div class="water-metric">
            <span class="m-label">📐 Surface Area</span>
            <span class="m-val">${formatNumber(wb.areaKm2)} km²</span>
          </div>
          <div class="water-metric">
            <span class="m-label">💧 Volume</span>
            <span class="m-val">${wb.volumeKm3 ? formatNumber(wb.volumeKm3) + ' km³' : 'Varied'}</span>
          </div>
          <div class="water-metric">
            <span class="m-label">⚓ Average Depth</span>
            <span class="m-val">${formatNumber(wb.averageDepthMeters)} m</span>
          </div>
          <div class="water-metric">
            <span class="m-label">⬇️ Deepest Point</span>
            <span class="m-val" style="font-size: 0.75rem;" title="${wb.deepestPoint}">${wb.deepestPoint}</span>
          </div>
        </div>

        <div style="font-size: 0.8rem; margin: 0.5rem 0; color: var(--text-secondary);">
          <strong>Continents / Borders:</strong> ${borderingText}<br>
          <strong>Notable Coastal States:</strong> ${coastalText}
        </div>

        <div class="water-description">
          ${wb.keyFeatures}
        </div>
      `;

      fragment.appendChild(card);
    });

    elements.waterbodiesGrid.appendChild(fragment);
  }

  // --- 7. DETAIL MODAL DIALOG WITH INTERACTIVE MINI-MAP ---
  function openDetailModal(country) {
    const flagUrl = `https://flagcdn.com/w160/${country.code2.toLowerCase()}.png`;
    elements.modalFlagImg.src = flagUrl;
    elements.modalFlagImg.onerror = () => {
      elements.modalFlagImg.style.display = 'none';
      elements.modalFlagFallback.style.display = 'block';
    };
    elements.modalFlagImg.style.display = 'block';
    elements.modalFlagFallback.style.display = 'none';
    elements.modalFlagFallback.textContent = country.flag;

    elements.modalTitle.textContent = country.name;
    elements.modalOfficialName.textContent = country.officialName;
    elements.modalStatusBadge.textContent = country.statusLabel;
    elements.modalStatusBadge.className = `status-badge ${getStatusClass(country.status)}`;
    elements.modalContinentBadge.textContent = country.continent;

    elements.modalCapital.textContent = country.capital || 'N/A';
    elements.modalCurrency.textContent = `${country.currency.name} (${country.currency.code || ''}${country.currency.symbol ? ', ' + country.currency.symbol : ''})`;
    elements.modalEstablished.textContent = `${country.establishmentYear} (${country.establishmentNote})`;
    elements.modalUnYear.textContent = country.unAdmissionYear ? `${country.unAdmissionYear} (UN Member)` : (country.status === 'observer' ? 'Permanent Observer' : 'Non-Member');
    elements.modalPopulation.textContent = `${formatNumber(country.stats.population)} residents`;
    elements.modalArea.textContent = `${formatNumber(country.stats.areaKm2)} km²`;
    if (elements.modalCallingCode) elements.modalCallingCode.textContent = country.callingCode || 'N/A';
    if (elements.modalTld) elements.modalTld.textContent = country.tld || 'N/A';

    if (country.latlng && country.latlng.length === 2) {
      elements.modalCoordsVal.textContent = `${country.latlng[0].toFixed(2)}°, ${country.latlng[1].toFixed(2)}°`;
    } else {
      elements.modalCoordsVal.textContent = 'N/A';
    }
    elements.modalLocationSnippet.textContent = `${country.subregion || country.continent} • ${country.location.nearby}`;
    elements.modalFunfact.textContent = `"${country.funFact}"`;

    // Dynamic External Links
    elements.modalLinkMaps.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(country.name + ' country')}`;
    elements.modalLinkWiki.href = `https://en.wikipedia.org/wiki/${encodeURIComponent(country.name)}`;

    elements.detailModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    // Initialize or update Leaflet Mini-Map in Modal
    setTimeout(() => {
      initModalMiniMap(country);
    }, 100);
  }

  function initModalMiniMap(country) {
    if (typeof L === 'undefined') return;

    const mapWrap = document.getElementById('modal-country-map');
    if (!mapWrap) return;

    const latlng = (country.latlng && country.latlng.length === 2) ? country.latlng : [20, 0];
    const effectiveTheme = getActiveEffectiveTheme();
    const tileUrl = effectiveTheme === 'dark' ? MAP_TILES.dark : MAP_TILES.light;

    if (!modalMiniMap) {
      modalMiniMap = L.map('modal-country-map', {
        center: latlng,
        zoom: 5,
        zoomControl: true,
        scrollWheelZoom: false
      });

      modalMiniMapTileLayer = L.tileLayer(tileUrl, {
        attribution: '&copy; <a href="https://www.esri.com/">Esri</a> &copy; OpenStreetMap',
        maxZoom: 18
      }).addTo(modalMiniMap);

      const pinIcon = L.divIcon({
        className: 'modal-marker-wrapper',
        html: `<div style="font-size: 2rem; transform: translate(-50%, -100%); text-shadow: 0 2px 5px rgba(0,0,0,0.8);">${country.flag}</div>`,
        iconSize: [24, 24]
      });

      modalMiniMapMarker = L.marker(latlng, { icon: pinIcon }).addTo(modalMiniMap);
    } else {
      modalMiniMap.setView(latlng, 5);
      modalMiniMapTileLayer.setUrl(tileUrl);

      const pinIcon = L.divIcon({
        className: 'modal-marker-wrapper',
        html: `<div style="font-size: 2rem; transform: translate(-50%, -100%); text-shadow: 0 2px 5px rgba(0,0,0,0.8);">${country.flag}</div>`,
        iconSize: [24, 24]
      });

      modalMiniMapMarker.setLatLng(latlng);
      modalMiniMapMarker.setIcon(pinIcon);
    }

    modalMiniMap.invalidateSize();
  }

  function closeDetailModal() {
    elements.detailModal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  // --- 8. MULTIPLE-CHOICE STUDY & QUIZ ENGINE (456 QUESTIONS ACROSS 228 PORTIONS) ---
  function initQuizEngine() {
    const rawQuestions = window.QUIZ_DATA || [];
    state.quiz.questions = [...rawQuestions];
    state.quiz.filtered = [...rawQuestions];
    state.quiz.currentIndex = 0;
    state.quiz.isInitialized = true;

    if (elements.quizCountAll) {
      elements.quizCountAll.textContent = state.quiz.questions.length;
    }

    updateQuizScoreboard();
    renderCurrentQuizQuestion();
  }

  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  function updateQuizScoreboard() {
    const totalInView = state.quiz.filtered.length;
    const currentNum = totalInView > 0 ? (state.quiz.currentIndex + 1) : 0;

    if (elements.quizCurrentNum) elements.quizCurrentNum.textContent = currentNum;
    if (elements.quizTotalNum) elements.quizTotalNum.textContent = totalInView;
    if (elements.quizScoreVal) elements.quizScoreVal.textContent = state.quiz.score;
    if (elements.quizAnsweredCount) elements.quizAnsweredCount.textContent = state.quiz.answeredCount;
    if (elements.quizStreakVal) elements.quizStreakVal.textContent = state.quiz.streak;

    if (elements.quizAccuracyVal) {
      const accuracy = state.quiz.answeredCount > 0
        ? Math.round((state.quiz.score / state.quiz.answeredCount) * 100)
        : 0;
      elements.quizAccuracyVal.textContent = `${accuracy}%`;
    }
  }

  function applyQuizFilter(filterType, regionName) {
    if (filterType) {
      state.quiz.activeFilter = filterType;
      state.quiz.activeRegion = null;

      // Update button active states
      elements.quizCatBtns.forEach(btn => {
        if (btn.getAttribute('data-quiz-filter') === filterType) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
      elements.quizSubBtns.forEach(btn => btn.classList.remove('active'));

      // Filter questions
      if (filterType === 'all') {
        state.quiz.filtered = [...state.quiz.questions];
      } else {
        state.quiz.filtered = state.quiz.questions.filter(q => q.category === filterType);
      }
    } else if (regionName) {
      state.quiz.activeFilter = null;
      state.quiz.activeRegion = regionName;

      // Update button active states
      elements.quizCatBtns.forEach(btn => btn.classList.remove('active'));
      elements.quizSubBtns.forEach(btn => {
        if (btn.getAttribute('data-quiz-region') === regionName) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      // Filter questions by continent / region
      state.quiz.filtered = state.quiz.questions.filter(q => q.continent === regionName);
    }

    state.quiz.currentIndex = 0;
    updateQuizScoreboard();
    renderCurrentQuizQuestion();
  }

  function renderCurrentQuizQuestion() {
    if (!elements.quizInteractiveCard) return;

    const total = state.quiz.filtered.length;
    if (total === 0) {
      if (elements.qText) elements.qText.textContent = 'No questions found for the selected filter.';
      if (elements.qOptionsContainer) elements.qOptionsContainer.innerHTML = '';
      if (elements.qExplanationBox) elements.qExplanationBox.classList.add('hidden');
      updateQuizScoreboard();
      return;
    }

    // Wrap index safety
    if (state.quiz.currentIndex >= total) state.quiz.currentIndex = 0;
    if (state.quiz.currentIndex < 0) state.quiz.currentIndex = total - 1;

    const q = state.quiz.filtered[state.quiz.currentIndex];
    if (!q) return;

    // Meta badges
    if (elements.qCategoryBadge) {
      elements.qCategoryBadge.textContent = q.category === 'waterbodies' ? '🌊 Oceans & Salt Seas' : '🌐 Countries & Territories';
    }
    if (elements.qRegionBadge) {
      elements.qRegionBadge.textContent = q.continent;
    }
    if (elements.qTypeBadge) {
      elements.qTypeBadge.textContent = q.questionType || 'Geography & Geopolitics';
    }
    if (elements.qPortionIndicator) {
      const qNum = (q.id % 2 === 1) ? 1 : 2;
      elements.qPortionIndicator.textContent = `Portion #${q.portionNumber} of 228 • Question ${qNum} of 2`;
    }

    // Prompt text
    if (elements.qText) {
      elements.qText.textContent = q.question;
    }

    // Check if already answered
    const existingAnswer = state.quiz.userAnswers[q.id];
    const isAnswered = existingAnswer !== undefined;

    // Render 4 Options
    if (elements.qOptionsContainer) {
      elements.qOptionsContainer.innerHTML = '';
      const letters = ['A', 'B', 'C', 'D'];

      q.options.forEach((optText, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'q-option-btn';
        btn.setAttribute('data-opt-index', idx);
        btn.setAttribute('role', 'radio');
        btn.setAttribute('aria-checked', isAnswered && existingAnswer.selectedIndex === idx ? 'true' : 'false');

        if (isAnswered) {
          btn.disabled = true;
          // Highlight correct option
          if (idx === q.correctIndex) {
            btn.classList.add('correct');
          }
          // Highlight incorrect option if selected by user
          if (idx === existingAnswer.selectedIndex && !existingAnswer.isCorrect) {
            btn.classList.add('incorrect');
          }
        } else {
          btn.addEventListener('click', () => handleQuizOptionSelect(idx));
        }

        btn.innerHTML = `
          <span class="q-option-letter">${letters[idx]}</span>
          <span class="q-option-text">${optText}</span>
        `;

        elements.qOptionsContainer.appendChild(btn);
      });
    }

    // Explanation Box
    if (elements.qExplanationBox) {
      if (isAnswered) {
        elements.qExplanationBox.classList.remove('hidden');
        if (existingAnswer.isCorrect) {
          elements.qExplanationBox.classList.remove('incorrect-theme');
          elements.qExplanationBox.classList.add('correct-theme');
          if (elements.expStatusIcon) elements.expStatusIcon.textContent = '🎉';
          if (elements.expStatusTitle) elements.expStatusTitle.textContent = 'Correct! Outstanding Knowledge:';
        } else {
          elements.qExplanationBox.classList.remove('correct-theme');
          elements.qExplanationBox.classList.add('incorrect-theme');
          if (elements.expStatusIcon) elements.expStatusIcon.textContent = '💡';
          if (elements.expStatusTitle) {
            elements.expStatusTitle.textContent = `Incorrect! The correct answer is: ${q.options[q.correctIndex]} — Fact Insight:`;
          }
        }
        if (elements.expText) elements.expText.textContent = q.explanation;
      } else {
        elements.qExplanationBox.classList.add('hidden');
      }
    }

    updateQuizScoreboard();
  }

  function handleQuizOptionSelect(selectedIndex) {
    const q = state.quiz.filtered[state.quiz.currentIndex];
    if (!q) return;

    if (state.quiz.userAnswers[q.id] !== undefined) return;

    const isCorrect = (selectedIndex === q.correctIndex);
    state.quiz.userAnswers[q.id] = {
      selectedIndex: selectedIndex,
      isCorrect: isCorrect
    };

    state.quiz.answeredCount++;
    if (isCorrect) {
      state.quiz.score++;
      state.quiz.streak++;
    } else {
      state.quiz.streak = 0;
    }

    renderCurrentQuizQuestion();
  }

  function nextQuizQuestion() {
    if (state.quiz.filtered.length === 0) return;
    state.quiz.currentIndex = (state.quiz.currentIndex + 1) % state.quiz.filtered.length;
    renderCurrentQuizQuestion();
  }

  function prevQuizQuestion() {
    if (state.quiz.filtered.length === 0) return;
    state.quiz.currentIndex = (state.quiz.currentIndex - 1 + state.quiz.filtered.length) % state.quiz.filtered.length;
    renderCurrentQuizQuestion();
  }

  function randomQuizQuestion() {
    if (state.quiz.filtered.length <= 1) return;
    let nextIdx = state.quiz.currentIndex;
    while (nextIdx === state.quiz.currentIndex) {
      nextIdx = Math.floor(Math.random() * state.quiz.filtered.length);
    }
    state.quiz.currentIndex = nextIdx;
    renderCurrentQuizQuestion();
  }

  function shuffleQuizQuestions() {
    if (state.quiz.filtered.length === 0) return;
    shuffleArray(state.quiz.filtered);
    state.quiz.currentIndex = 0;
    renderCurrentQuizQuestion();
  }

  function resetQuizScore() {
    state.quiz.score = 0;
    state.quiz.answeredCount = 0;
    state.quiz.streak = 0;
    state.quiz.userAnswers = {};
    updateQuizScoreboard();
    renderCurrentQuizQuestion();
  }

  // --- 9. VIEW SWITCHING HELPER ---
  function switchTab(view) {
    elements.navTabs.forEach(t => {
      if (t.getAttribute('data-view') === view) {
        t.classList.add('active');
      } else {
        t.classList.remove('active');
      }
    });

    state.currentView = view;

    elements.viewPanels.forEach(p => p.classList.remove('active'));
    const activePanel = document.getElementById(`view-${view}`);
    if (activePanel) activePanel.classList.add('active');

    if (view === 'map') {
      setTimeout(() => {
        initWorldMap();
        if (worldMap) {
          worldMap.invalidateSize();
          fitMapToContinent(state.selectedContinent);
        }
      }, 50);
    } else if (view === 'waterbodies') {
      renderWaterbodiesGrid();
    } else if (view === 'quiz') {
      if (!state.quiz.isInitialized) {
        initQuizEngine();
      } else {
        renderCurrentQuizQuestion();
      }
    }
  }

  function smoothScrollTo(element) {
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // --- 10. EVENT LISTENERS SETUP ---
  function setupEventListeners() {
    // 1. Navigation Tabs
    elements.navTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const view = tab.getAttribute('data-view');
        switchTab(view);
      });
    });

    // 1.5 Quick Filter Stat Tickers (All 6 Features Functional)
    // Feature 1: Total 205 Countries & Territories
    if (elements.statTotalCountries) {
      elements.statTotalCountries.addEventListener('click', () => {
        switchTab('countries');
        state.selectedContinent = 'All';
        state.selectedStatus = 'all';
        state.searchQuery = '';
        state.sortBy = 'name-asc';

        if (elements.countrySearch) elements.countrySearch.value = '';
        if (elements.sortSelect) elements.sortSelect.value = 'name-asc';

        elements.continentBtns.forEach(b => {
          if (b.getAttribute('data-continent') === 'All') b.classList.add('active');
          else b.classList.remove('active');
        });

        elements.statusPills.forEach(p => {
          if (p.getAttribute('data-status') === 'all') p.classList.add('active');
          else p.classList.remove('active');
        });

        renderCountriesGrid();
        renderWorldMapMarkers();
        smoothScrollTo(elements.countriesGrid);
      });
    }

    // Feature 2: 193 UN Member States
    if (elements.statUnMembers) {
      elements.statUnMembers.addEventListener('click', () => {
        switchTab('countries');
        state.selectedContinent = 'All';
        state.selectedStatus = 'un_member';
        state.searchQuery = '';
        if (elements.countrySearch) elements.countrySearch.value = '';

        elements.continentBtns.forEach(b => {
          if (b.getAttribute('data-continent') === 'All') b.classList.add('active');
          else b.classList.remove('active');
        });

        elements.statusPills.forEach(p => {
          if (p.getAttribute('data-status') === 'un_member') p.classList.add('active');
          else p.classList.remove('active');
        });

        renderCountriesGrid();
        renderWorldMapMarkers();
        smoothScrollTo(elements.countriesGrid);
      });
    }

    // Feature 3: 2 UN Observer States (Vatican City & Palestine)
    if (elements.statUnObservers) {
      elements.statUnObservers.addEventListener('click', () => {
        switchTab('countries');
        state.selectedContinent = 'All';
        state.selectedStatus = 'observer';
        state.searchQuery = '';
        if (elements.countrySearch) elements.countrySearch.value = '';

        elements.continentBtns.forEach(b => {
          if (b.getAttribute('data-continent') === 'All') b.classList.add('active');
          else b.classList.remove('active');
        });

        elements.statusPills.forEach(p => {
          if (p.getAttribute('data-status') === 'observer') p.classList.add('active');
          else p.classList.remove('active');
        });

        renderCountriesGrid();
        renderWorldMapMarkers();
        smoothScrollTo(elements.countriesGrid);
      });
    }

    // Feature 4: 10 Limited / De Facto Recognized States
    if (elements.statDeFacto) {
      elements.statDeFacto.addEventListener('click', () => {
        switchTab('countries');
        state.selectedContinent = 'All';
        state.selectedStatus = 'limited';
        state.searchQuery = '';
        if (elements.countrySearch) elements.countrySearch.value = '';

        elements.continentBtns.forEach(b => {
          if (b.getAttribute('data-continent') === 'All') b.classList.add('active');
          else b.classList.remove('active');
        });

        elements.statusPills.forEach(p => {
          if (p.getAttribute('data-status') === 'limited') p.classList.add('active');
          else p.classList.remove('active');
        });

        renderCountriesGrid();
        renderWorldMapMarkers();
        smoothScrollTo(elements.countriesGrid);
      });
    }

    // Feature 5: 5 World Oceans
    if (elements.statOceansCount) {
      elements.statOceansCount.addEventListener('click', () => {
        switchTab('waterbodies');
        state.selectedWaterType = 'ocean';

        elements.waterFilterBtns.forEach(b => {
          if (b.getAttribute('data-watertype') === 'ocean') b.classList.add('active');
          else b.classList.remove('active');
        });

        renderWaterbodiesGrid();
        smoothScrollTo(elements.waterbodiesGrid);
      });
    }

    // Feature 6: 18+ Marginal & Salt Seas
    if (elements.statSeasCount) {
      elements.statSeasCount.addEventListener('click', () => {
        switchTab('waterbodies');
        state.selectedWaterType = 'sea';

        elements.waterFilterBtns.forEach(b => {
          if (b.getAttribute('data-watertype') === 'sea') b.classList.add('active');
          else b.classList.remove('active');
        });

        renderWaterbodiesGrid();
        smoothScrollTo(elements.waterbodiesGrid);
      });
    }

    // 2. Continent Button Bar
    elements.continentBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        elements.continentBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        state.selectedContinent = btn.getAttribute('data-continent');
        renderCountriesGrid();
        renderWorldMapMarkers();
        fitMapToContinent(state.selectedContinent);
      });
    });

    // 2.5 Map Style Switcher Buttons
    const mapStyleBtns = document.querySelectorAll('.map-style-btn');
    mapStyleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        mapStyleBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        state.mapStyle = btn.getAttribute('data-map-style');
        updateMapTileThemes();
      });
    });

    // 3. Search Bar
    elements.countrySearch.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      renderCountriesGrid();
      renderWorldMapMarkers();
    });

    elements.searchClearBtn.addEventListener('click', () => {
      elements.countrySearch.value = '';
      state.searchQuery = '';
      renderCountriesGrid();
      renderWorldMapMarkers();
    });

    // 4. Status Filter Pills
    elements.statusPills.forEach(pill => {
      pill.addEventListener('click', () => {
        elements.statusPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        state.selectedStatus = pill.getAttribute('data-status');
        renderCountriesGrid();
        renderWorldMapMarkers();
      });
    });

    // 5. Sort Selector
    elements.sortSelect.addEventListener('change', (e) => {
      state.sortBy = e.target.value;
      renderCountriesGrid();
    });

    // 6. Shuffle Button
    elements.btnShuffle.addEventListener('click', () => {
      shuffleArray(state.countries);
      renderCountriesGrid();
    });

    // 7. Reset Filters Button
    elements.btnResetFilters.addEventListener('click', () => {
      state.selectedContinent = 'All';
      state.selectedStatus = 'all';
      state.searchQuery = '';
      state.sortBy = 'name-asc';

      elements.countrySearch.value = '';
      elements.sortSelect.value = 'name-asc';

      elements.continentBtns.forEach(b => {
        if (b.getAttribute('data-continent') === 'All') b.classList.add('active');
        else b.classList.remove('active');
      });

      elements.statusPills.forEach(p => {
        if (p.getAttribute('data-status') === 'all') p.classList.add('active');
        else p.classList.remove('active');
      });

      renderCountriesGrid();
      renderWorldMapMarkers();
    });

    // 8. Water Body Filter Buttons
    elements.waterFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        elements.waterFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        state.selectedWaterType = btn.getAttribute('data-watertype');
        renderWaterbodiesGrid();
      });
    });

    // 9. Modal Close & Keyboard Shortcuts
    elements.modalCloseBtn.addEventListener('click', closeDetailModal);
    elements.detailModal.addEventListener('click', (e) => {
      if (e.target === elements.detailModal) closeDetailModal();
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeDetailModal();
        return;
      }

      // If user is focused on an input or select, skip quiz shortcuts
      if (document.activeElement && ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;

      if (state.currentView === 'quiz' && elements.detailModal.classList.contains('hidden')) {
        if (e.key === 'ArrowRight') {
          nextQuizQuestion();
        } else if (e.key === 'ArrowLeft') {
          prevQuizQuestion();
        } else if (['1', '2', '3', '4'].includes(e.key)) {
          const optIdx = parseInt(e.key, 10) - 1;
          handleQuizOptionSelect(optIdx);
        } else if (['a', 'b', 'c', 'd', 'A', 'B', 'C', 'D'].includes(e.key)) {
          const map = { a: 0, b: 1, c: 2, d: 3, A: 0, B: 1, C: 2, D: 3 };
          handleQuizOptionSelect(map[e.key]);
        }
      }
    });

    // 10. Quiz Controls & Filter Buttons
    elements.quizCatBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filterVal = btn.getAttribute('data-quiz-filter');
        applyQuizFilter(filterVal, null);
      });
    });

    elements.quizSubBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const regionVal = btn.getAttribute('data-quiz-region');
        applyQuizFilter(null, regionVal);
      });
    });

    if (elements.btnQuizPrev) elements.btnQuizPrev.addEventListener('click', prevQuizQuestion);
    if (elements.btnQuizNext) elements.btnQuizNext.addEventListener('click', nextQuizQuestion);
    if (elements.btnQuizRandom) elements.btnQuizRandom.addEventListener('click', randomQuizQuestion);
    if (elements.btnQuizShuffle) elements.btnQuizShuffle.addEventListener('click', shuffleQuizQuestions);
    if (elements.btnQuizResetScore) elements.btnQuizResetScore.addEventListener('click', resetQuizScore);
  }

  // --- 11. WELCOME PAGE & NAVIGATION CONTROLLER ---
  function setupWelcomeNavigation() {
    if (!elements.welcomeScreen || !elements.btnLetsExplore || !elements.mainApp) return;

    // Check URL hash or initial state
    const isDirectAtlas = window.location.hash === '#explore';

    if (isDirectAtlas) {
      elements.welcomeScreen.classList.add('is-hidden');
      elements.mainApp.classList.remove('is-hidden');
    } else {
      elements.welcomeScreen.classList.remove('is-hidden');
      elements.mainApp.classList.add('is-hidden');
    }

    // "Let's Explore" button handler with smooth navigation animation
    elements.btnLetsExplore.addEventListener('click', () => {
      // Trigger navigation exit animation on Welcome Screen
      elements.welcomeScreen.classList.add('navigating-out');

      setTimeout(() => {
        // Hide Welcome Screen
        elements.welcomeScreen.classList.remove('navigating-out');
        elements.welcomeScreen.classList.add('is-hidden');

        // Reveal Main Application with smooth entrance
        elements.mainApp.classList.remove('is-hidden');
        elements.mainApp.classList.add('navigating-in');

        // Smooth scroll to top of main course page
        window.scrollTo({ top: 0, behavior: 'smooth' });
        window.location.hash = 'explore';

        // Re-render / invalidate map if needed
        if (worldMap) {
          worldMap.invalidateSize();
        }

        setTimeout(() => {
          elements.mainApp.classList.remove('navigating-in');
        }, 650);
      }, 500);
    });

    // "Welcome" button in header (returns to Welcome Screen)
    if (elements.btnNavWelcome) {
      elements.btnNavWelcome.addEventListener('click', () => {
        elements.mainApp.classList.add('is-hidden');
        elements.welcomeScreen.classList.remove('is-hidden');
        elements.welcomeScreen.classList.add('navigating-in');

        // Replay girl pop-up bounce animation
        if (elements.welcomeGirlImg) {
          elements.welcomeGirlImg.style.animation = 'none';
          void elements.welcomeGirlImg.offsetWidth; // trigger reflow
          elements.welcomeGirlImg.style.animation = '';
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
        history.replaceState(null, null, ' ');

        setTimeout(() => {
          elements.welcomeScreen.classList.remove('navigating-in');
        }, 550);
      });
    }

    // Handle browser Back/Forward buttons
    window.addEventListener('popstate', () => {
      if (window.location.hash === '#explore') {
        elements.welcomeScreen.classList.add('is-hidden');
        elements.mainApp.classList.remove('is-hidden');
        if (worldMap) worldMap.invalidateSize();
      } else {
        elements.welcomeScreen.classList.remove('is-hidden');
        elements.mainApp.classList.add('is-hidden');
      }
    });
  }

  // --- 12. APP INITIALIZATION ---
  function init() {
    initTheme();
    setupEventListeners();
    setupWelcomeNavigation();
    renderCountriesGrid();
    renderWaterbodiesGrid();
    initQuizEngine();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
