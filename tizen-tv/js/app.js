"use strict";

// ═══════════════════════════════════════════════════════════════════════════════
// Overhead — Tizen TV app
// Geen framework, geen bundler, plain JS + fetch + localStorage
// ═══════════════════════════════════════════════════════════════════════════════

// ── Constanten ────────────────────────────────────────────────────────────────
const STORAGE_KEY  = "overhead_location";
const RADIUS_KM    = 80;          // ruimere straal dan web (TV hangt vaker thuis)
const REFRESH_MS   = 15_000;      // 15 sec auto-refresh
const ROUTE_TTL_MS = 5 * 60_000;  // 5 min route-cache
const MAX_NEARBY   = 7;           // max items in de footer

// ── State ─────────────────────────────────────────────────────────────────────
let appLocation   = null;    // { lat, lon, label }
let aircraft      = [];      // gescoorde AircraftTV[]
let routeCache    = {};      // { [callsign]: { dep, arr, ts } }
let refreshTimer  = null;
let lastUpdated   = null;
let clockTimer    = null;

// ── DOM shortcuts ─────────────────────────────────────────────────────────────
const el = id => document.getElementById(id);

const screenLoc    = el("screen-location");
const screenMain   = el("screen-main");
const locInput     = el("loc-input");
const locBtn       = el("loc-btn");
const locError     = el("loc-error");
const changeLocBtn = el("change-loc-btn");
const hdrCount     = el("hdr-count");
const hdrTime      = el("hdr-time");
const hdrLabel     = el("hdr-label");
const emptyState   = el("empty-state");
const emptyMsg     = el("empty-msg");
const acCard       = el("ac-card");
const acAirline    = el("ac-airline");
const acCallsign   = el("ac-callsign");
const routeBar     = el("route-bar");
const depCode      = el("dep-code");
const depName      = el("dep-name");
const arrCode      = el("arr-code");
const arrName      = el("arr-name");
const typeRow      = el("type-row");
const acType       = el("ac-type");
const statAlt      = el("stat-alt");
const statSpd      = el("stat-spd");
const statDist     = el("stat-dist");
const statReg      = el("stat-reg");
const nearbyList   = el("nearby-list");


// ═══════════════════════════════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════════════════════════════
window.addEventListener("load", () => {
  // Laad opgeslagen locatie (ook aanwezig na herstarten TV)
  const stored = loadLocation();
  if (stored) {
    appLocation = stored;
    showMain();
    startRefresh();
  } else {
    showLocationScreen();
  }

  // Klok
  clockTimer = setInterval(updateClock, 1000);
  updateClock();

  // Events
  locBtn.addEventListener("click", handleLocationSubmit);
  locInput.addEventListener("keydown", e => { if (e.key === "Enter") handleLocationSubmit(); });
  changeLocBtn.addEventListener("click", showLocationScreen);

  // Tizen remote-keys
  document.addEventListener("keydown", handleRemoteKey);
});


// ═══════════════════════════════════════════════════════════════════════════════
// SCHERMWISSELING
// ═══════════════════════════════════════════════════════════════════════════════
function showLocationScreen() {
  stopRefresh();
  screenLoc.hidden  = false;
  screenMain.hidden = true;
  locInput.value    = "";
  locError.hidden   = true;
  // Focus voor TV-keyboard (werkt ook met D-pad)
  setTimeout(() => locInput.focus(), 100);
}

function showMain() {
  screenLoc.hidden  = true;
  screenMain.hidden = false;
  if (appLocation) hdrLabel.textContent = appLocation.label;
}


// ═══════════════════════════════════════════════════════════════════════════════
// LOCATIE
// ═══════════════════════════════════════════════════════════════════════════════
function loadLocation() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveLocation(lat, lon, label) {
  appLocation = { lat, lon, label };
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(appLocation)); } catch {}
}

async function handleLocationSubmit() {
  const query = locInput.value.trim();
  if (!query) return;

  locBtn.disabled       = true;
  locBtn.textContent    = "Zoeken…";
  locError.hidden       = true;

  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;
    const res  = await fetch(url, {
      headers: { "Accept-Language": "nl,en;q=0.9" },
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) throw new Error("Geocoding mislukt. Probeer opnieuw.");

    const data = await res.json();
    if (!data.length) throw new Error(`Geen locatie gevonden voor "${query}".`);

    const r     = data[0];
    const parts = r.display_name.split(", ");
    const label = parts.slice(0, 2).join(", ");

    saveLocation(parseFloat(r.lat), parseFloat(r.lon), label);
    showMain();
    startRefresh();

  } catch (e) {
    locError.textContent = e.message;
    locError.hidden      = false;
  } finally {
    locBtn.disabled    = false;
    locBtn.textContent = "Locatie instellen";
  }
}


// ═══════════════════════════════════════════════════════════════════════════════
// KLOK
// ═══════════════════════════════════════════════════════════════════════════════
function updateClock() {
  if (lastUpdated) {
    hdrTime.textContent = lastUpdated.toLocaleTimeString("nl-NL", {
      hour: "2-digit", minute: "2-digit", second: "2-digit",
    });
  }
}


// ═══════════════════════════════════════════════════════════════════════════════
// AIRCRAFT DATA — adsb.lol
// ═══════════════════════════════════════════════════════════════════════════════
async function fetchAircraft() {
  const nm  = Math.round(RADIUS_KM / 1.852);
  const url = `https://api.adsb.lol/v2/lat/${appLocation.lat}/lon/${appLocation.lon}/dist/${nm}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(10_000) });
  if (!res.ok) throw new Error(`adsb.lol: HTTP ${res.status}`);
  const data = await res.json();

  return (data.ac || [])
    .filter(ac => !ac.ground && ac.lat != null && ac.lon != null && (ac.alt_baro || 0) > 0)
    .map(ac => ({
      icao24:       ac.hex,
      callsign:     (ac.flight || "").trim() || null,
      lat:          ac.lat,
      lon:          ac.lon,
      altM:         ac.alt_baro != null ? ac.alt_baro * 0.3048 : null,
      velMs:        ac.gs       != null ? ac.gs * 0.514444     : null,
      registration: ac.r  || null,
      type:         ac.t  || null,
    }));
}

async function fetchRoute(callsign, lat, lon) {
  // Controleer cache
  const now    = Date.now();
  const cached = routeCache[callsign];
  if (cached && now - cached.ts < ROUTE_TTL_MS) return cached;

  try {
    const url = `https://api.adsb.lol/api/0/route/${encodeURIComponent(callsign)}/${lat}/${lon}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(5_000) });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.airport_codes) return null;

    const [dep, arr] = data.airport_codes.split("-");
    const result = { dep: dep || null, arr: arr || null, ts: now };
    routeCache[callsign] = result;
    return result;
  } catch {
    return null;
  }
}


// ═══════════════════════════════════════════════════════════════════════════════
// SCORING & SORTERING
// ═══════════════════════════════════════════════════════════════════════════════
function haversineKm(lat1, lon1, lat2, lon2) {
  const R    = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a    = Math.sin(dLat / 2) ** 2
             + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180)
             * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function scoreAndSort(acs) {
  return acs
    .map(ac => {
      const distKm   = haversineKm(appLocation.lat, appLocation.lon, ac.lat, ac.lon);
      const altScore  = ac.altM ? (1 - Math.min(ac.altM / 12000, 1)) : 0;
      const distScore = 1 - Math.min(distKm / RADIUS_KM, 1);
      return { ...ac, distKm, score: distScore * 0.6 + altScore * 0.4 };
    })
    .sort((a, b) => b.score - a.score);
}


// ═══════════════════════════════════════════════════════════════════════════════
// REFRESH LOOP
// ═══════════════════════════════════════════════════════════════════════════════
async function refresh() {
  try {
    const raw = await fetchAircraft();
    aircraft   = scoreAndSort(raw);
    lastUpdated = new Date();
    await renderMain();
  } catch (e) {
    showEmpty(`Fout: ${e.message}`);
  }
}

function startRefresh() {
  refresh(); // direct
  refreshTimer = setInterval(refresh, REFRESH_MS);
}

function stopRefresh() {
  if (refreshTimer) { clearInterval(refreshTimer); refreshTimer = null; }
}


// ═══════════════════════════════════════════════════════════════════════════════
// RENDERING
// ═══════════════════════════════════════════════════════════════════════════════
async function renderMain() {
  const primary = aircraft[0] || null;
  const nearby  = aircraft.slice(1, 1 + MAX_NEARBY);

  // Header
  hdrCount.textContent = `${aircraft.length} in de buurt`;
  if (appLocation) hdrLabel.textContent = appLocation.label;

  if (!primary) {
    showEmpty("Geen vliegtuigen gevonden in de buurt.");
    return;
  }

  emptyState.hidden = true;
  acCard.hidden     = false;

  // Airline + callsign
  const airline = primary.callsign ? getAirlineName(primary.callsign) : null;
  if (airline) {
    acAirline.textContent  = airline;
    acCallsign.textContent = primary.callsign || "";
  } else {
    acAirline.textContent  = primary.callsign || "Onbekend";
    acCallsign.textContent = "";
  }

  // Route (async, zonder de UI te blokkeren)
  routeBar.hidden = true;
  if (primary.callsign) {
    fetchRoute(primary.callsign, primary.lat, primary.lon).then(route => {
      if (route && route.dep && route.arr) {
        const dep = resolveAirport(route.dep);
        const arr = resolveAirport(route.arr);
        depCode.textContent = dep.iata || dep.raw;
        depName.textContent = dep.name || "";
        arrCode.textContent = arr.iata || arr.raw;
        arrName.textContent = arr.name || "";
        routeBar.hidden     = false;
      }
    });
  }

  // Vliegtuigtype
  if (primary.type) {
    acType.textContent = primary.type;
    typeRow.hidden     = false;
  } else {
    typeRow.hidden = true;
  }

  // Stats
  statAlt.textContent  = primary.altM  ? formatFL(primary.altM)           : "—";
  statSpd.textContent  = primary.velMs ? `${Math.round(primary.velMs * 1.944)} kt` : "—";
  statDist.textContent = `${Math.round(primary.distKm)} km`;
  statReg.textContent  = primary.registration || "—";

  // Nabije toestellen
  renderNearby(nearby);
}

function renderNearby(list) {
  nearbyList.innerHTML = "";
  list.forEach(ac => {
    const li   = document.createElement("li");
    li.className = "nearby-item";

    const cs   = document.createElement("span");
    cs.className    = "nearby-cs";
    cs.textContent  = ac.callsign || ac.icao24;

    const dist = document.createElement("span");
    dist.className   = "nearby-dist";
    dist.textContent = `${Math.round(ac.distKm)} km`;

    li.appendChild(cs);
    li.appendChild(dist);
    nearbyList.appendChild(li);
  });
}

function showEmpty(msg) {
  emptyState.hidden  = false;
  acCard.hidden      = true;
  emptyMsg.textContent = msg;
  nearbyList.innerHTML  = "";
}


// ═══════════════════════════════════════════════════════════════════════════════
// FORMATTERS
// ═══════════════════════════════════════════════════════════════════════════════
function formatFL(metres) {
  if (metres == null) return "—";
  const fl = Math.round(metres / 30.48 / 100) * 100;
  if (fl >= 1000) return `FL${String(fl).slice(0, -2)}`;
  return `${Math.round(metres)} m`;
}


// ═══════════════════════════════════════════════════════════════════════════════
// TIZEN REMOTE KEY HANDLING
// ═══════════════════════════════════════════════════════════════════════════════
// Tizen key codes: https://developer.tizen.org/development/guides/web-application/user-interface/tizen-advanced-ui/ui-components/remote-control
const KEY_BACK   = 10009;
const KEY_RETURN = 10009; // alias
const KEY_ENTER  = 13;

function handleRemoteKey(e) {
  // Terug → locatiescherm (als we op het hoofdscherm zijn)
  if (e.keyCode === KEY_BACK) {
    if (!screenMain.hidden) {
      e.preventDefault();
      showLocationScreen();
    }
    // Als we al op het locatiescherm zijn: geen preventDefault → TV verlaat de app
  }
}
