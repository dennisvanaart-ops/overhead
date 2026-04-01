# Icoon

Tizen Web Apps vereisen een PNG-icoon (minimaal 128×128 px).

## Stap 1 — genereer icon.png vanuit icon.svg

**macOS (met sips):**
```bash
# Vereist: qlmanage (standaard op macOS) of Inkscape
# Optie A — via Safari/Preview: open icon.svg, exporteer als PNG 128x128

# Optie B — via Inkscape (brew install inkscape):
inkscape icon.svg -w 128 -h 128 -o icon.png
inkscape icon.svg -w 512 -h 512 -o icon_large.png
```

**Of gebruik een online converter:**
- https://svgtopng.com

## Stap 2 — bestandsnamen

Zorg dat de gegenereerde bestanden op de juiste plek staan:
- `tizen-tv/images/icon.png`       ← vereist door config.xml
- `tizen-tv/images/icon_large.png` ← optioneel, voor store-vermelding

## Tijdelijk

Zolang `icon.png` ontbreekt bouwt Tizen Studio met een waarschuwing maar draait de app wel.
