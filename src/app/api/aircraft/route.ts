import { NextRequest, NextResponse } from "next/server";
import { fetchNearbyAircraft, AdsbError } from "@/lib/adsb";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  const radius = searchParams.get("radius");

  if (!lat || !lon) {
    return NextResponse.json(
      { error: "lat en lon parameters zijn verplicht", errorType: "VALIDATION" },
      { status: 400 }
    );
  }

  const latitude = parseFloat(lat);
  const longitude = parseFloat(lon);
  const radiusKm = radius ? parseFloat(radius) : 50;

  if (isNaN(latitude) || isNaN(longitude)) {
    return NextResponse.json(
      { error: "Ongeldige coördinaten", errorType: "VALIDATION" },
      { status: 400 }
    );
  }

  try {
    const aircraft = await fetchNearbyAircraft(latitude, longitude, radiusKm);
    return NextResponse.json({ aircraft, count: aircraft.length });
  } catch (error) {
    if (error instanceof AdsbError) {
      console.error(`[API /aircraft] ${error.type}: ${error.message}`);
      const status = error.type === "RATE_LIMIT" ? 429 : 502;
      return NextResponse.json(
        { error: error.message, errorType: error.type },
        { status }
      );
    }

    console.error(`[API /aircraft] Onverwachte fout:`, error);
    return NextResponse.json(
      { error: "Er ging iets mis bij het ophalen van vliegtuigdata.", errorType: "UNKNOWN" },
      { status: 500 }
    );
  }
}
