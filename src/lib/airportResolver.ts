/**
 * Airport code resolver.
 *
 * Bouwt bij module-load twee opzoektabellen:
 *   icaoMap  – ICAO (4 letters) → Airport
 *   iataMap  – IATA (3 letters) → Airport
 *
 * resolveAirport(code):
 *   1. 4-letter code  → zoek in icaoMap → geef IATA als displayCode als beschikbaar, anders ICAO
 *   2. 3-letter code  → zoek in iataMap → bevestig het bestaat en geef IATA terug
 *   3. Geen match     → geef raw code terug als displayCode, naam null
 *   4. Lege/null code → geef "Onbekend" terug
 */

import { AIRPORTS, Airport } from "@/data/airports";

export interface ResolvedAirport {
  rawCode: string;         // Wat binnenkwam (bv. "EHAM")
  icaoCode: string | null; // ICAO (4 letters) of null
  iataCode: string | null; // IATA (3 letters) of null
  name: string | null;     // Leesbare naam, bv. "Amsterdam Schiphol"
  city: string | null;
  displayCode: string;     // Wat in de UI staat: IATA als beschikbaar, anders ICAO, anders rawCode
}

// ── Lookup maps (eenmalig opgebouwd) ───────────────────────────────────────

const icaoMap = new Map<string, Airport>();
const iataMap = new Map<string, Airport>();

for (const ap of AIRPORTS) {
  icaoMap.set(ap.icao.toUpperCase(), ap);
  if (ap.iata) iataMap.set(ap.iata.toUpperCase(), ap);
}

// ── Public API ──────────────────────────────────────────────────────────────

export function resolveAirport(code: string | null | undefined): ResolvedAirport {
  if (!code || code.trim() === "") {
    return unknown("");
  }

  const upper = code.trim().toUpperCase();

  // 4-letter → ICAO lookup
  if (upper.length === 4) {
    const ap = icaoMap.get(upper);
    if (ap) {
      return {
        rawCode: upper,
        icaoCode: ap.icao,
        iataCode: ap.iata || null,
        name: ap.name,
        city: ap.city ?? null,
        displayCode: ap.iata || ap.icao,
      };
    }
    // Onbekend ICAO: geef raw code terug, geen naam
    return {
      rawCode: upper,
      icaoCode: upper,
      iataCode: null,
      name: null,
      city: null,
      displayCode: upper,
    };
  }

  // 3-letter → IATA lookup
  if (upper.length === 3) {
    const ap = iataMap.get(upper);
    if (ap) {
      return {
        rawCode: upper,
        icaoCode: ap.icao,
        iataCode: ap.iata,
        name: ap.name,
        city: ap.city ?? null,
        displayCode: ap.iata,
      };
    }
    // Onbekende IATA-code: geef raw code terug
    return {
      rawCode: upper,
      icaoCode: null,
      iataCode: upper,
      name: null,
      city: null,
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
    displayCode: upper,
  };
}

function unknown(raw: string): ResolvedAirport {
  return {
    rawCode: raw,
    icaoCode: null,
    iataCode: null,
    name: null,
    city: null,
    displayCode: raw || "Onbekend",
  };
}
