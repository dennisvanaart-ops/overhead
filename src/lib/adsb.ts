/**
 * adsb.lol API client
 *
 * Endpoint: GET https://api.adsb.lol/v2/lat/{lat}/lon/{lon}/dist/{nm}
 * - dist is in nautical miles (1 km ≈ 0.53996 nm)
 * - No authentication required
 * - Free, community-run ADS-B aggregator
 *
 * Response units (readsb format):
 *   alt_baro / alt_geom : feet  (or string "ground")
 *   gs                  : knots
 *   baro_rate / geom_rate : ft/min
 *   track               : degrees true
 *
 * Internal units (our Aircraft type):
 *   altitude : metres
 *   velocity : m/s
 *   verticalRate : m/s
 */

import { Aircraft } from "@/types/aircraft";

const ADSB_BASE_URL = "https://api.adsb.lol/v2";
const ADSB_ROUTE_URL = "https://api.adsb.lol/api/0/route";
const REQUEST_TIMEOUT = 10_000;
const ROUTE_TIMEOUT = 5_000;
const KM_TO_NM = 0.539957;

// Server-side route cache: callsign → {departure, arrival, cachedAt}
const ROUTE_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minuten

interface RouteCacheEntry {
  departureAirport: string | null;
  arrivalAirport: string | null;
  cachedAt: number;
}

const routeCache = new Map<string, RouteCacheEntry>();

// ────────────────────────────────────────────────────────────────────────────
// Error types
// ────────────────────────────────────────────────────────────────────────────

export type AdsbErrorType =
  | "TIMEOUT"
  | "NETWORK"
  | "INVALID_RESPONSE"
  | "SERVER_ERROR"
  | "RATE_LIMIT";

const ERROR_MESSAGES: Record<AdsbErrorType, string> = {
  TIMEOUT: "Vliegtuigdata-server reageert niet. Mogelijk tijdelijk overbelast.",
  NETWORK: "Kan geen verbinding maken met de vliegtuigdata-bron.",
  INVALID_RESPONSE: "Onverwacht antwoord van de vliegtuigdata-bron.",
  SERVER_ERROR: "De vliegtuigdata-bron heeft een serverfout.",
  RATE_LIMIT: "Te veel verzoeken. Even geduld, data wordt automatisch opnieuw opgehaald.",
};

export class AdsbError extends Error {
  type: AdsbErrorType;
  constructor(type: AdsbErrorType, message: string) {
    super(message);
    this.type = type;
    this.name = "AdsbError";
  }
}

// ────────────────────────────────────────────────────────────────────────────
// Raw response types (adsb.lol / readsb format)
// ────────────────────────────────────────────────────────────────────────────

interface AdsbAc {
  hex: string;
  flight?: string;
  r?: string;          // registration
  t?: string;          // ICAO type code (e.g. "A320")
  desc?: string;       // human-readable description (e.g. "Airbus A320")
  alt_baro?: number | "ground";
  alt_geom?: number;
  gs?: number;         // ground speed in knots
  track?: number;      // true track in degrees
  baro_rate?: number;  // ft/min
  lat?: number;
  lon?: number;
  squawk?: string;
  on_ground?: boolean;
  ownOp?: string;      // operator
  category?: string;
}

interface AdsbResponse {
  ac?: AdsbAc[];
  now?: number;
  total?: number;
}

// ────────────────────────────────────────────────────────────────────────────
// Normalisation
// ────────────────────────────────────────────────────────────────────────────

function feetToMeters(feet: number): number {
  return feet * 0.3048;
}

function knotsToMs(knots: number): number {
  return knots * 0.514444;
}

function ftMinToMs(ftMin: number): number {
  return ftMin * 0.00508;
}

function normalise(ac: AdsbAc): Aircraft {
  const onGround = ac.alt_baro === "ground" || ac.on_ground === true;
  const altBaroRaw = typeof ac.alt_baro === "number" ? ac.alt_baro : null;

  return {
    icao24: ac.hex.toLowerCase(),
    callsign: ac.flight ? ac.flight.trim() || null : null,
    originCountry: null,
    latitude: ac.lat ?? null,
    longitude: ac.lon ?? null,
    baroAltitude: altBaroRaw !== null ? feetToMeters(altBaroRaw) : null,
    geoAltitude: ac.alt_geom != null ? feetToMeters(ac.alt_geom) : null,
    onGround,
    velocity: ac.gs != null ? knotsToMs(ac.gs) : null,
    trueTrack: ac.track ?? null,
    verticalRate: ac.baro_rate != null ? ftMinToMs(ac.baro_rate) : null,
    squawk: ac.squawk ?? null,
    registration: ac.r ?? null,
    aircraftType: ac.desc ?? ac.t ?? null,
    operator: ac.ownOp ?? null,
  };
}

// ────────────────────────────────────────────────────────────────────────────
// Route lookup
// ────────────────────────────────────────────────────────────────────────────

export interface RouteResult {
  departureAirport: string | null;
  arrivalAirport: string | null;
}

/**
 * Haalt vertrek- en aankomstluchthaven op voor een callsign.
 *
 * Endpoint: GET https://api.adsb.lol/api/0/route/{callsign}/{lat}/{lon}
 * Response: { airport_codes: "EHAM-LEMD" | "unknown", ... }
 *
 * Resultaten worden 5 minuten gecached per callsign.
 * Geeft altijd een RouteResult terug (nulls bij ontbreking/fout).
 */
export async function fetchRoute(
  callsign: string,
  lat: number,
  lon: number
): Promise<RouteResult> {
  const key = callsign.trim().toUpperCase();
  if (!key) return { departureAirport: null, arrivalAirport: null };

  // Cache check
  const cached = routeCache.get(key);
  if (cached && Date.now() - cached.cachedAt < ROUTE_CACHE_TTL_MS) {
    return { departureAirport: cached.departureAirport, arrivalAirport: cached.arrivalAirport };
  }

  const url = `${ADSB_ROUTE_URL}/${encodeURIComponent(key)}/${lat.toFixed(4)}/${lon.toFixed(4)}`;

  let data: { airport_codes?: string } | null = null;
  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(ROUTE_TIMEOUT),
    });
    if (res.ok) {
      data = await res.json();
    } else {
      console.warn(`[adsb.lol route] HTTP ${res.status} voor callsign ${key}`);
    }
  } catch (err) {
    console.warn(`[adsb.lol route] Fout voor callsign ${key}:`, err instanceof Error ? err.message : err);
  }

  let departureAirport: string | null = null;
  let arrivalAirport: string | null = null;

  if (data?.airport_codes && data.airport_codes !== "unknown") {
    const parts = data.airport_codes.split("-");
    departureAirport = parts[0] || null;
    arrivalAirport = parts[parts.length - 1] || null;
    // Als vertrek en aankomst gelijk zijn, was de split ongeldig
    if (departureAirport === arrivalAirport) {
      departureAirport = null;
      arrivalAirport = null;
    }
  }

  routeCache.set(key, { departureAirport, arrivalAirport, cachedAt: Date.now() });
  return { departureAirport, arrivalAirport };
}

// ────────────────────────────────────────────────────────────────────────────
// Public API
// ────────────────────────────────────────────────────────────────────────────

export async function fetchNearbyAircraft(
  lat: number,
  lon: number,
  radiusKm: number = 50
): Promise<Aircraft[]> {
  const nm = Math.round(radiusKm * KM_TO_NM);
  const url = `${ADSB_BASE_URL}/lat/${lat.toFixed(4)}/lon/${lon.toFixed(4)}/dist/${nm}`;

  let response: Response;
  try {
    response = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT),
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === "TimeoutError") {
      console.error(`[adsb.lol] Timeout na ${REQUEST_TIMEOUT}ms`);
      throw new AdsbError("TIMEOUT", ERROR_MESSAGES["TIMEOUT"]);
    }
    console.error(`[adsb.lol] Netwerkfout:`, err);
    throw new AdsbError("NETWORK", ERROR_MESSAGES["NETWORK"]);
  }

  if (response.status === 429) {
    console.warn(`[adsb.lol] Rate limit bereikt`);
    throw new AdsbError("RATE_LIMIT", ERROR_MESSAGES["RATE_LIMIT"]);
  }

  if (!response.ok) {
    console.error(`[adsb.lol] HTTP ${response.status} van ${url}`);
    throw new AdsbError("SERVER_ERROR", ERROR_MESSAGES["SERVER_ERROR"]);
  }

  let data: AdsbResponse;
  try {
    data = await response.json();
  } catch {
    console.error(`[adsb.lol] Ongeldige JSON response`);
    throw new AdsbError("INVALID_RESPONSE", ERROR_MESSAGES["INVALID_RESPONSE"]);
  }

  if (!Array.isArray(data.ac)) {
    return [];
  }

  return data.ac
    .map(normalise)
    .filter(
      (a) =>
        a.latitude !== null &&
        a.longitude !== null &&
        !a.onGround
    );
}
