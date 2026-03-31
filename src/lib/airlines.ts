// Static ICAO airline code to name mapping
// Covers major European and global carriers commonly seen in Dutch airspace
const AIRLINE_CODES: Record<string, string> = {
  // Netherlands
  KLM: "KLM Royal Dutch Airlines",
  TRA: "Transavia",
  MPH: "Martinair",

  // Major European
  BAW: "British Airways",
  DLH: "Lufthansa",
  AFR: "Air France",
  EZY: "easyJet",
  RYR: "Ryanair",
  EWG: "Eurowings",
  SAS: "Scandinavian Airlines",
  FIN: "Finnair",
  AUA: "Austrian Airlines",
  SWR: "Swiss International",
  TAP: "TAP Air Portugal",
  IBE: "Iberia",
  VLG: "Vueling",
  BEL: "Brussels Airlines",
  NAX: "Norwegian",
  WZZ: "Wizz Air",
  TVS: "Travel Service",
  AEE: "Aegean Airlines",
  THY: "Turkish Airlines",
  LOT: "LOT Polish Airlines",
  CSA: "Czech Airlines",
  ICE: "Icelandair",
  SIA: "Singapore Airlines",

  // Cargo
  FDX: "FedEx",
  UPS: "UPS Airlines",
  GTI: "Atlas Air",
  CLX: "Cargolux",

  // Middle East
  UAE: "Emirates",
  QTR: "Qatar Airways",
  ETD: "Etihad Airways",
  ELY: "El Al",
  SAA: "South African Airways",

  // Americas
  AAL: "American Airlines",
  DAL: "Delta Air Lines",
  UAL: "United Airlines",
  ACA: "Air Canada",

  // Asia
  CPA: "Cathay Pacific",
  CCA: "Air China",
  JAL: "Japan Airlines",
  ANA: "All Nippon Airways",
  KAL: "Korean Air",

  // Low cost / regional
  BER: "Air Berlin",
  NOS: "Neos",
  TUI: "TUI fly",
  CFG: "Condor",
  VOE: "Volotea",
  TVF: "Transavia France",
  HVN: "Vietnam Airlines",
  PGT: "Pegasus Airlines",
  NSZ: "Nordica / North Star",
};

// Extract airline name from callsign (first 3 characters = ICAO airline designator)
export function getAirlineName(callsign: string | null): string | null {
  if (!callsign || callsign.length < 3) return null;
  const code = callsign.substring(0, 3).toUpperCase();
  return AIRLINE_CODES[code] || null;
}
