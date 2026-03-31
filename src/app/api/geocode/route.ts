import { NextRequest, NextResponse } from "next/server";

/**
 * Server-side proxy voor Nominatim geocoding.
 * Zet User-Agent correct (vereist door Nominatim ToS) en voorkomt CORS issues.
 *
 * GET /api/geocode?q=Amsterdam
 */
export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q");

  if (!query || query.trim().length < 2) {
    return NextResponse.json(
      { error: "Zoekterm te kort." },
      { status: 400 }
    );
  }

  const params = new URLSearchParams({
    q: query.trim(),
    format: "json",
    limit: "5",
    addressdetails: "0",
  });

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?${params}`,
      {
        headers: {
          "User-Agent":
            "overhead-app/1.0 (https://github.com/dennisvanaart-ops/overhead)",
          "Accept-Language": "nl,en;q=0.9",
        },
        // Nominatim verzoek mag maximaal 10 seconden duren
        signal: AbortSignal.timeout(10_000),
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Geocoding service onbereikbaar." },
        { status: 502 }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Geocoding mislukt." },
      { status: 502 }
    );
  }
}
