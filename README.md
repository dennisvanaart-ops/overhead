# Vliegtuig Tracker

Realtime webapp die laat zien welke vliegtuigen er boven en rond jouw locatie vliegen.

## Features

- Locatie-gebaseerd: vraagt browser permission en toont vliegtuigen in een straal van 50km
- Primaire weergave: het meest relevante vliegtuig (dichtstbij of recht boven je)
- Secundaire lijst: overige toestellen in de buurt
- Automatische refresh elke 15 seconden
- Responsive: werkt op desktop en mobiel
- Geen API-sleutel vereist

## Data

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
│   ├── api/aircraft/
│   │   ├── route.ts              # Proxy naar adsb.lol
│   │   └── [icao24]/route.ts    # Statische airline lookup per callsign
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                  # Hoofdpagina
├── components/
│   ├── OverheadCard.tsx          # Primaire vliegtuigweergave
│   ├── NearbyList.tsx            # Lijst nabije toestellen
│   ├── EmptyState.tsx            # Fout- en leegstaat
│   └── LocationPrompt.tsx        # Locatietoestemming
├── hooks/
│   ├── useAircraft.ts            # Data fetching + auto-refresh
│   ├── useFlightDetail.ts        # Airline lookup + vluchtdetails
│   └── useLocation.ts            # Browser geolocation
├── lib/
│   ├── adsb.ts                   # adsb.lol API client + normalisatie
│   ├── geo.ts                    # Afstandsberekening en relevantie-scoring
│   └── airlines.ts               # Statische ICAO → airline mapping
└── types/
    └── aircraft.ts               # Gedeeld Aircraft-model
```

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- adsb.lol API (gratis, geen authenticatie)

---

## Beperkingen en deployment notes

### Waarom niet meer OpenSky?

OpenSky Network vereist OAuth2-credentials die niet meer direct beschikbaar zijn
via zelfregistratie — toegang moet worden aangevraagd en handmatig worden goedgekeurd.
Bovendien blokkeert OpenSky actief verzoeken vanuit bekende cloud-IP-ranges.
adsb.lol biedt vergelijkbare data zonder deze drempels.

### Beperkingen van adsb.lol (gratis)

- **Geen SLA**: de dienst is community-gedreven en kan tijdelijk onbeschikbaar zijn
- **Geen route-informatie**: vertrek- en aankomstluchthaven zijn niet beschikbaar
- **Geen historische data**: alleen live/near-realtime data
- **Dekkingsgaten**: ADS-B-ontvangst is afhankelijk van grondstations; dunne gebieden
  kunnen minder toestellen tonen
- **Rate limits**: onbekend/informeel; bij intensief gebruik of bij problemen treedt
  automatisch retry in werking

### Toekomstige verrijking

De databron is geïsoleerd in `src/lib/adsb.ts` en het interne `Aircraft`-type in
`src/types/aircraft.ts`. Een verrijkingsbron toevoegen (bijv. voor route-info of
luchthavennamen) kan zonder wijzigingen in componenten of hooks:

1. Voeg een nieuwe service toe in `src/lib/`
2. Roep die aan vanuit `/api/aircraft/[icao24]/route.ts`
3. Het `FlightDetail`-type heeft al velden voor `departureAirport` en `arrivalAirport`

### Hosting

adsb.lol is doorgaans bereikbaar vanuit cloudplatforms. Mocht dit veranderen,
pas dan alleen `src/lib/adsb.ts` aan — de rest van de app is bronagnostisch.
