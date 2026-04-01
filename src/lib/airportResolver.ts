/**
 * Airport code resolver.
 *
 * Bouwt bij module-load twee opzoektabellen:
 *   icaoMap  – ICAO (4 letters) → Airport
 *   iataMap  – IATA (3 letters) → Airport
 *
 * resolveAirport(code):
 *   1. 4-letter code  → ICAO-lookup → displayCode = IATA als beschikbaar, anders ICAO
 *   2. 3-letter code  → IATA-lookup → bevestig het bestaat, geef IATA terug
 *   3. Geen match     → geef raw code terug, naam null
 *   4. Lege/null code → geef "Onbekend" terug
 *
 * Dataset: OurAirports (8 164 records, wereldwijd).
 * Server-side only — niet importeren in client-componenten.
 */

import { AIRPORTS, Airport } from "@/data/airports";

export interface ResolvedAirport {
  rawCode: string;          // Wat binnenkwam, bijv. "EHAM"
  icaoCode: string | null;  // ICAO (4 letters) of null
  iataCode: string | null;  // IATA (3 letters) of null
  name: string | null;      // Leesbare naam, bijv. "Amsterdam Airport Schiphol"
  city: string | null;      // Stad, bijv. "Amsterdam" (kan null zijn als leeg)
  country: string | null;   // ISO-landcode, bijv. "NL"
  displayCode: string;      // UI-weergave: IATA als beschikbaar, anders ICAO, anders rawCode
}

// ── Lookup maps (eenmalig opgebouwd bij module-load) ────────────────────────

const icaoMap = new Map<string, Airport>();
const iataMap = new Map<string, Airport>();

for (const ap of AIRPORTS) {
  icaoMap.set(ap.icao.toUpperCase(), ap);
  iataMap.set(ap.iata.toUpperCase(), ap);
}

// ── Public API ───────────────────────────────────────────────────────────────

export function resolveAirport(code: string | null | undefined): ResolvedAirport {
  if (!code || code.trim() === "") {
    return unknownAirport("");
  }

  const upper = code.trim().toUpperCase();

  // 4-letter → ICAO-lookup
  if (upper.length === 4) {
    const ap = icaoMap.get(upper);
    if (ap) {
      return fromAirport(upper, ap);
    }
    // Onbekend ICAO: geef raw code terug zonder naam
    return {
      rawCode: upper,
      icaoCode: upper,
      iataCode: null,
      name: null,
      city: null,
      country: null,
      displayCode: upper,
    };
  }

  // 3-letter → IATA-lookup
  if (upper.length === 3) {
    const ap = iataMap.get(upper);
    if (ap) {
      return fromAirport(upper, ap);
    }
    // Onbekende IATA-code: geef raw code terug zonder naam
    return {
      rawCode: upper,
      icaoCode: null,
      iataCode: upper,
      name: null,
      city: null,
      country: null,
      displayCode: upper,
    };
  }

  // Andere lengte: geef raw terug
  return {
    rawCode: upper,
    icaoCode: null,
    iataCode: null,
    name: null,
    city: null,
    country: null,
    displayCode: upper,
  };
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function fromAirport(rawCode: string, ap: Airport): ResolvedAirport {
  return {
    rawCode,
    icaoCode: ap.icao,
    iataCode: ap.iata,
    name: ap.name,
    city: ap.city || null,
    country: ap.country || null,
    displayCode: ap.iata, // IATA is altijd beschikbaar in de gefilterde dataset
  };
}

function unknownAirport(raw: string): ResolvedAirport {
  return {
    rawCode: raw,
    icaoCode: null,
    iataCode: null,
    name: null,
    city: null,
    country: null,
    displayCode: raw || "Onbekend",
  };
}
