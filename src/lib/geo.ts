import { Aircraft, UserLocation } from "@/types/aircraft";

// Haversine distance in km between two points
export function distanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export interface ScoredAircraft extends Aircraft {
  distanceKm: number;
  relevanceScore: number;
}

// Score aircraft by relevance: closer + higher altitude = more interesting overhead
export function scoreAircraft(
  aircraft: Aircraft[],
  location: UserLocation
): ScoredAircraft[] {
  return aircraft
    .filter((a) => a.latitude !== null && a.longitude !== null)
    .map((a) => {
      const dist = distanceKm(
        location.latitude,
        location.longitude,
        a.latitude!,
        a.longitude!
      );

      // Relevance: inversely proportional to distance, bonus for altitude (overhead)
      // Lower distance = higher score. Aircraft directly overhead at high altitude score highest.
      const distScore = Math.max(0, 1 - dist / 100); // 0-1 range, 0 at 100km+
      const altBonus = a.baroAltitude
        ? Math.min(a.baroAltitude / 12000, 1) * 0.2
        : 0;
      const relevanceScore = distScore + altBonus;

      return { ...a, distanceKm: Math.round(dist * 10) / 10, relevanceScore };
    })
    .sort((a, b) => b.relevanceScore - a.relevanceScore);
}
