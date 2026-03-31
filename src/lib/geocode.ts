export interface GeocodeResult {
  latitude: number;
  longitude: number;
  displayName: string; // bijv. "Amsterdam, Nederland"
}

/**
 * Zet een plaatsnaam of postcode om naar coördinaten.
 * Roept de interne /api/geocode route aan (Nominatim proxy).
 */
export async function geocodeQuery(query: string): Promise<GeocodeResult> {
  const res = await fetch(`/api/geocode?q=${encodeURIComponent(query.trim())}`);

  if (!res.ok) {
    throw new Error("Geocoding mislukt. Probeer het opnieuw.");
  }

  const data = await res.json();

  if (!Array.isArray(data) || data.length === 0) {
    throw new Error(`Geen locatie gevonden voor "${query}".`);
  }

  const first = data[0];

  // Bouw een korte leesbare naam: eerste twee delen van display_name
  const parts: string[] = (first.display_name as string).split(", ");
  const displayName = parts.slice(0, 2).join(", ");

  return {
    latitude: parseFloat(first.lat),
    longitude: parseFloat(first.lon),
    displayName,
  };
}
