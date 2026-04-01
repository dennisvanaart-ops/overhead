/**
 * Airport reference dataset — 8 164 luchthavens wereldwijd.
 *
 * Bron: OurAirports (https://ourairports.com/data/)  — publiek domein.
 * Gefilterd op: aanwezig IATA-code (3 letters) + ICAO-code (4 letters),
 * type niet "closed" of "heliport".
 *
 * Velden:
 *   icao    – 4-letter ICAO-code (altijd aanwezig)
 *   iata    – 3-letter IATA-code (altijd aanwezig in deze dataset)
 *   name    – officiële naam van de luchthaven
 *   city    – gemeente / stad (kan leeg zijn)
 *   country – 2-letter ISO-landcode (bijv. "NL", "DE", "US")
 *
 * Gebruik: importeer via airportResolver.ts — niet direct in client-code.
 * De dataset wordt alleen server-side geladen (API-routes).
 */

import rawData from "./airports.json";

export interface Airport {
  icao: string;    // bijv. "EHAM"
  iata: string;    // bijv. "AMS"
  name: string;    // bijv. "Amsterdam Airport Schiphol"
  city: string;    // bijv. "Amsterdam" (kan leeg zijn)
  country: string; // bijv. "NL"
}

export const AIRPORTS = rawData as Airport[];
