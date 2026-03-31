/**
 * Maps an aircraft type string to a visual category.
 * Accepts both ICAO type codes (e.g. "A320", "B738") and
 * descriptive strings (e.g. "Airbus A320-214", "Boeing 737-800").
 */

export type AircraftCategory = "narrow" | "wide" | "heavy" | "unknown";

export function getAircraftCategory(type: string | null | undefined): AircraftCategory {
  if (!type) return "unknown";
  const t = type.toUpperCase();

  // Heavy — check before wide to avoid A38x matching wide A3x rules
  if (
    t.includes("A38") || t.includes("380") ||
    t.includes("B74") || t.includes("747")
  ) return "heavy";

  // Wide body
  if (
    t.includes("A33") || t.includes("330") ||
    t.includes("A34") || t.includes("340") ||
    t.includes("A35") || t.includes("350") ||
    t.includes("B76") || t.includes("767") ||
    t.includes("B77") || t.includes("777") ||
    t.includes("B78") || t.includes("787")
  ) return "wide";

  // Narrow body
  if (
    t.includes("A31") || t.includes("319") || t.includes("318") ||
    t.includes("A32") || t.includes("320") || t.includes("321") ||
    t.includes("B73") || t.includes("737") ||
    t.includes("B71") || t.includes("717") ||
    t.includes("E17") || t.includes("E19") || t.includes("E75") ||
    t.includes("CRJ") || t.includes("DH8") || t.includes("AT7") ||
    t.includes("AT4") || t.includes("E290") || t.includes("E295")
  ) return "narrow";

  return "unknown";
}
