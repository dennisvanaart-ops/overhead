"use strict";
// Statische ICAO airline-prefix → naam mapping
const AIRLINE_MAP = {
  // Nederland
  KLM: "KLM Royal Dutch Airlines",
  TRA: "Transavia",
  MPH: "Martinair",

  // Europa — grote carriers
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

  // Azië
  SIA: "Singapore Airlines",
  CPA: "Cathay Pacific",
  CCA: "Air China",
  JAL: "Japan Airlines",
  ANA: "All Nippon Airways",
  KAL: "Korean Air",

  // Midden-Oosten
  UAE: "Emirates",
  QTR: "Qatar Airways",
  ETD: "Etihad Airways",
  ELY: "El Al",

  // Noord-Amerika
  AAL: "American Airlines",
  DAL: "Delta Air Lines",
  UAL: "United Airlines",
  ACA: "Air Canada",

  // Cargo
  FDX: "FedEx",
  UPS: "UPS Airlines",
  GTI: "Atlas Air",
  CLX: "Cargolux",

  // Low cost / leisure
  TUI: "TUI fly",
  CFG: "Condor",
  VOE: "Volotea",
  TVF: "Transavia France",
  PGT: "Pegasus Airlines",
  SAA: "South African Airways",
};

/** Geeft de airline-naam terug op basis van de eerste 3 tekens van de callsign. */
function getAirlineName(callsign) {
  if (!callsign || callsign.length < 3) return null;
  return AIRLINE_MAP[callsign.substring(0, 3).toUpperCase()] || null;
}
