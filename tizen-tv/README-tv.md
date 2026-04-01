# Overhead — Samsung TV (Tizen Web Application)

Standalone Tizen Web App versie van Overhead.
Werkt zonder GPS, zonder server, zonder hosted-app constructie.

---

## Vereisten

| Item | Versie / info |
|---|---|
| Tizen Studio | 4.x of hoger — [download](https://developer.tizen.org/development/tizen-studio) |
| Samsung Smart TV | Tizen OS 4.0+ (modellen 2018+; Tizen 3.0 voor 2017) |
| Netwerk | TV en PC op hetzelfde lokale netwerk |
| Internetverbinding op TV | Ja — voor adsb.lol API en geocoding |

---

## Eerste keer opzetten

### 1. TV in Developer Mode zetten

1. Ga naar **Instellingen → Smart Hub → Apps**
2. Druk op de afstandsbediening: `1` `2` `3` `4` `5`
   - (Op sommige modellen: druk `Chique/Home` → ga naar Apps → druk snel `1` `2` `3` `4` `5`)
3. Zet **Developer Mode** op **Aan**
4. Voer het **IP-adres van je PC** in (te vinden via `ip addr` / systeeminfo)
5. Herstart de TV

Na herstart staat rechtsboven in de Apps-sectie `DEV MODE`.

### 2. TV koppelen in Tizen Studio

1. Open Tizen Studio
2. Ga naar **Tools → Device Manager**
3. Klik op **Remote Device Manager** (rechtsboven) → **+** (Add)
4. Vul in:
   - **Name**: samsung-tv (of eigen naam)
   - **IP**: het IP-adres van de TV (zichtbaar in TV onder Developer Mode)
   - **Port**: 26101 (standaard)
5. Klik **Add** → **Connect**
6. De TV vraagt om bevestiging — accepteer op de TV

### 3. Project importeren in Tizen Studio

1. **File → Import → Tizen → Tizen Project**
2. Kies **Import from directory**
3. Selecteer de map `overhead/tizen-tv/`
4. Klik **Finish**
5. Het project verschijnt in **Project Explorer** als `overhead` (of `tizen-tv`)

### 4. Icoon toevoegen (eenmalig)

Converteer `images/icon.svg` naar `images/icon.png` (128×128 px).
Zie `images/icon-placeholder.md` voor instructies.

> Tizen Studio geeft een waarschuwing zonder icon.png, maar de app draait gewoon.

---

## Bouwen en installeren

### Optie A — direct installeren op TV

1. Rechtsklik op het project in Project Explorer
2. Kies **Run As → Tizen Web Application**
3. Tizen Studio bouwt de app en installeert deze direct op de gekoppelde TV
4. De app start automatisch

### Optie B — .wgt pakket bouwen (voor lokale installatie)

1. Rechtsklik op het project
2. Kies **Export → Tizen → Tizen Web Application Package**
3. Kies een uitvoermap → **Finish**
4. Je hebt nu een `overhead.wgt` bestand

Het `.wgt` bestand installeren via de TV:
- Kopieer naar USB-stick (FAT32) → steek in TV → open via Tizen Package Manager
- Of stuur via sdb (Samsung Device Bridge):
  ```bash
  sdb connect <tv-ip>:26101
  sdb install overhead.wgt
  ```

---

## TV-bediening

| Actie | Knop |
|---|---|
| Locatie wijzigen | Terug-knop op afstandsbediening |
| Locatie bevestigen | OK / Enter |
| App verlaten | Terug op het locatiescherm |

D-pad navigeert tussen invoerveld en knop op het locatiescherm.

---

## Hoe de app werkt

### Locatie
- Bij eerste start: invoerscherm met plaatsnaam of postcode
- Geocoding via [Nominatim](https://nominatim.openstreetmap.org/) (OpenStreetMap, HTTPS)
- Locatie wordt opgeslagen in `localStorage` van de TV-browser
- Volgende keer: app start direct zonder invoerscherm
- Terugknop → locatiescherm om locatie te wijzigen

### Vliegtuigdata
- [adsb.lol](https://api.adsb.lol) — geen API-sleutel vereist
- Straal: 80 km rondom de opgegeven locatie
- Auto-refresh: elke 15 seconden
- Route (vertrek → aankomst): via `api.adsb.lol/api/0/route/...`, 5 min gecachet

### Luchthavens
- Lokale dataset: 8 164 luchthavens (OurAirports, publiek domein)
- ICAO → IATA omzetting lokaal in `js/airports.js`
- Geen externe API-call voor luchthavennamen

---

## Netwerktoegang (config.xml)

De app mag alleen verbinden met:
- `https://api.adsb.lol` — vliegtuigdata
- `https://nominatim.openstreetmap.org` — geocoding

Andere domeinen zijn geblokkeerd door Tizen's access policy.

---

## Technische details

| Gegeven | Waarde |
|---|---|
| Tizen required_version | 4.0 |
| Package ID | `overheadtv` |
| App ID | `overheadtv.Overhead` |
| Schermoriëntatie | landscape (fullscreen) |
| Framework | Geen (plain JS + Web APIs) |
| Bundler | Geen — statische bestanden |
| Serververeiste | Geen |

---

## Bestanden in deze map

```
tizen-tv/
├── config.xml          ← Tizen app manifest
├── index.html          ← App entry point
├── README-tv.md        ← Dit bestand
├── css/
│   └── app.css         ← TV-stijlen (donker, grote typografie)
├── js/
│   ├── app.js          ← Hoofdlogica (locatie, refresh, render)
│   ├── airlines.js     ← ICAO prefix → airline naam
│   └── airports.js     ← 8 164 luchthavens, ICAO/IATA lookup
└── images/
    ├── icon.svg        ← Bronbestand voor icoon
    └── icon.png        ← Vereist door Tizen (zie icon-placeholder.md)
```
