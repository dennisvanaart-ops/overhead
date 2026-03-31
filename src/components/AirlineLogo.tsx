"use client";

/**
 * Airline badge component.
 *
 * Toont een gekleurde pill-badge met een korte airline afkorting voor
 * bekende maatschappijen (mapping op ICAO callsign prefix = eerste 3 chars).
 *
 * Fallback als de airline wel bekend is maar geen badge heeft:
 *   → grijze badge met de eerste 2 tekens van de naam.
 *
 * Fallback als airline onbekend:
 *   → null (niets weergeven).
 *
 * Geen externe requests, geen images, alleen inline styling.
 */

interface AirlineStyle {
  bg: string;
  fg: string;
  label: string;
}

// ICAO airline designator (eerste 3 tekens van callsign) → badge stijl
const AIRLINE_STYLES: Record<string, AirlineStyle> = {
  KLM: { bg: "#00A1DE", fg: "#ffffff", label: "KLM" },
  TRA: { bg: "#00A857", fg: "#ffffff", label: "HV"  },
  RYR: { bg: "#073590", fg: "#F7D000", label: "FR"  },
  DLH: { bg: "#05164D", fg: "#FFCC00", label: "LH"  },
  BAW: { bg: "#1A237E", fg: "#ffffff", label: "BA"  },
  EZY: { bg: "#FF6600", fg: "#ffffff", label: "U2"  },
  AFR: { bg: "#002157", fg: "#ffffff", label: "AF"  },
  UAE: { bg: "#D71921", fg: "#C5A028", label: "EK"  },
  QTR: { bg: "#5C0632", fg: "#C9A96E", label: "QR"  },
  THY: { bg: "#C8102E", fg: "#ffffff", label: "TK"  },
  IBE: { bg: "#CC0000", fg: "#ffffff", label: "IB"  },
  VLG: { bg: "#F9B700", fg: "#002F6C", label: "VY"  },
  WZZ: { bg: "#C6007E", fg: "#ffffff", label: "W6"  },
  NAX: { bg: "#D81F26", fg: "#ffffff", label: "DY"  },
  SAS: { bg: "#003F87", fg: "#ffffff", label: "SK"  },
  EWG: { bg: "#8E44AD", fg: "#ffffff", label: "EW"  },
  SWR: { bg: "#E30613", fg: "#ffffff", label: "LX"  },
  TAP: { bg: "#006F3C", fg: "#ffffff", label: "TP"  },
  TUI: { bg: "#EE2E7B", fg: "#ffffff", label: "TUI" },
  CFG: { bg: "#F26522", fg: "#ffffff", label: "DE"  },
  AUA: { bg: "#C8102E", fg: "#ffffff", label: "OS"  },
  FIN: { bg: "#003580", fg: "#ffffff", label: "AY"  },
  BEL: { bg: "#1C1C6E", fg: "#ffffff", label: "SN"  },
  DAL: { bg: "#C01933", fg: "#ffffff", label: "DL"  },
  UAL: { bg: "#005DAA", fg: "#ffffff", label: "UA"  },
  AAL: { bg: "#0078D2", fg: "#ffffff", label: "AA"  },
};

function icaoFromCallsign(callsign: string | null): string | null {
  if (!callsign || callsign.length < 3) return null;
  return callsign.substring(0, 3).toUpperCase();
}

function initials(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

interface AirlineLogoProps {
  callsign: string | null;
  airlineName: string | null;
}

export default function AirlineLogo({ callsign, airlineName }: AirlineLogoProps) {
  const icao = icaoFromCallsign(callsign);
  const style = icao ? AIRLINE_STYLES[icao] : null;

  // Known airline with mapped badge
  if (style) {
    return (
      <Badge bg={style.bg} fg={style.fg}>
        {style.label}
      </Badge>
    );
  }

  // Airline name available but no colour mapping: grey badge with initials
  if (airlineName) {
    return (
      <Badge bg="#e5e7eb" fg="#374151">
        {initials(airlineName)}
      </Badge>
    );
  }

  return null;
}

function Badge({
  bg,
  fg,
  children,
}: {
  bg: string;
  fg: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className="inline-flex items-center justify-center rounded px-2 py-0.5 text-xs font-bold tracking-wider shrink-0"
      style={{ backgroundColor: bg, color: fg, minWidth: "2rem" }}
    >
      {children}
    </span>
  );
}
