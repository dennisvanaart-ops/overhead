import { NextRequest, NextResponse } from "next/server";
import { getAirlineName } from "@/lib/airlines";
import { fetchRoute } from "@/lib/adsb";
import { resolveAirport } from "@/lib/airportResolver";

/**
 * GET /api/aircraft/[icao24]?callsign=&lat=&lon=
 *
 * Geeft airline-naam (statische lookup), vertrek- en aankomstluchthaven
 * (adsb.lol route + lokale airport resolutie) terug.
 *
 * Airport codes worden via resolveAirport() omgezet:
 *   ICAO (4-letter) → IATA (3-letter) als bekend, anders ICAO
 *   Naam wordt meegestuurd als beschikbaar in de lokale dataset.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ icao24: string }> }
) {
  const { icao24 } = await params;
  const sp = request.nextUrl.searchParams;
  const callsign = sp.get("callsign");
  const lat = sp.get("lat");
  const lon = sp.get("lon");

  if (!icao24) {
    return NextResponse.json({ error: "icao24 is verplicht" }, { status: 400 });
  }

  const airline = callsign ? getAirlineName(callsign) : null;

  let departureAirport: string | null = null;
  let arrivalAirport: string | null = null;
  let departureAirportName: string | null = null;
  let arrivalAirportName: string | null = null;

  if (callsign && lat && lon) {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);
    if (!isNaN(latitude) && !isNaN(longitude)) {
      const route = await fetchRoute(callsign, latitude, longitude);

      if (route.departureAirport) {
        const dep = resolveAirport(route.departureAirport);
        departureAirport = dep.displayCode;
        departureAirportName = dep.name;
      }
      if (route.arrivalAirport) {
        const arr = resolveAirport(route.arrivalAirport);
        arrivalAirport = arr.displayCode;
        arrivalAirportName = arr.name;
      }
    }
  }

  return NextResponse.json({
    airline,
    aircraftType: null,
    registration: null,
    departureAirport,
    arrivalAirport,
    departureAirportName,
    arrivalAirportName,
  });
}
