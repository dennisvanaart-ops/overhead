# Overhead

Realtime webapp die laat zien welke vliegtuigen er boven en rond jouw locatie vliegen.

## Features

- Locatie-instelling via plaatsnaam of postcode (geocoding) — werkt ook zonder GPS
- GPS als optionele secundaire locatiemethode
- Locatie wordt opgeslagen in localStorage; bij terugkeer direct actief
- Primaire weergave: het meest relevante vliegtuig (dichtstbij of recht boven je)
- Secundaire lijst: overige toestellen in de buurt
- Automatische refresh elke 15 seconden
- Responsive: werkt op desktop, mobiel, tablet en apparaten zonder GPS
- Geen API-sleutel vereist

## Data

### Vliegtuigdata

Gebruikt [adsb.lol](https://adsb.lol/) voor realtime ADS-B vliegtuigdata.
adsb.lol is een gratis, community-gedreven ADS-B aggregator zonder authenticatie.

Per vliegtuig zijn direct beschikbaar:
- Callsign / identificatie
- Positie (lat/lon)
- Hoogte (barometrisch en geometrisch)
- Snelheid (ground speed)
- Heading / track
- Verticale snelheid
- Registratie (staartletters)
- Vliegtuigtype (bijv. "Airbus A320")
- Operator/airline naam (indien beschikbaar in ADS-B data)

### Airport reference dataset

De app gebruikt een volledige, lokale airport reference dataset gebaseerd op
[OurAirports](https://ourairports.com/data/) (publiek domein).

- **8 164 luchthavens** wereldwijd
- Velden per record: ICAO, IATA, naam, stad, ISO-landcode
- IATA is de standaard weergave in de UI (bijv. `AMS`, `LHR`, `JFK`)
- ICAO dient alleen als fallback als geen IATA-code beschikbaar is
- Lookup via twee in-memory Maps (ICAO→airport, IATA→airport), opgebouwd bij server-start
- Dataset wordt server-side geladen (API-routes); zit niet in de client-bundle

### Geocoding

Plaatsnamen en postcodes worden omgezet naar coördinaten via
[Nominatim](https://nominatim.openstreetmap.org/) (OpenStreetMap), proxied via een
interne Next.js API-route.

## Lokaal draaien

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in je browser.

Geen `.env`-bestand vereist.

## Projectstructuur

```
src/
├── app/
│   ├── api/
│   │   ├── aircraft/
│   │   │   ├── route.ts              # Proxy naar adsb.lol
│   │   │   └── [icao24]/route.ts    # Airline + route lookup per vliegtuig
│   │   └── geocode/route.ts         # Nominatim geocoding proxy
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                      # Hoofdpagina
├── components/
│   ├── OverheadCard.tsx              # Primaire vliegtuigweergave
│   ├── NearbyList.tsx                # Lijst nabije toestellen
│   ├── EmptyState.tsx                # Fout- en leegstaat
│   └── LocationPrompt.tsx            # Locatie-invoerscherm (geocoding + GPS)
├── data/
│   ├── airports.json                 # 8 164 luchthavens (OurAirports, publiek domein)
│   └── airports.ts                   # TypeScript-interface + JSON-import
├── hooks/
│   ├── useAircraft.ts                # Data fetching + auto-refresh
│   ├── useFlightDetail.ts            # Airline lookup + vluchtdetails
│   └── useLocation.ts                # Locatie via localStorage, geocoding of GPS
├── lib/
│   ├── adsb.ts                       # adsb.lol API client + normalisatie
│   ├── airportResolver.ts            # ICAO/IATA lookup via lokale dataset
│   ├── geocode.ts                    # Geocoding helper (client-side)
│   ├── geo.ts                        # Afstandsberekening en relevantie-scoring
│   └── airlines.ts                   # Statische ICAO → airline mapping
└── types/
    └── aircraft.ts                   # Gedeeld Aircraft-model
```

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- adsb.lol API (gratis, geen authenticatie)
- OurAirports dataset (publiek domein)
- Nominatim geocoding (OpenStreetMap)

---

## Deployment notes

### adsb.lol beperkingen

- **Geen SLA**: community-gedreven, kan tijdelijk onbeschikbaar zijn
- **Dekkingsgaten**: ADS-B-ontvangst afhankelijk van grondstations
- **Rate limits**: onbekend/informeel; automatisch retry bij problemen

### Hosting

adsb.lol is doorgaans bereikbaar vanuit cloudplatforms.
Pas bij databronwijziging alleen `src/lib/adsb.ts` aan — de rest is bronagnostisch.
