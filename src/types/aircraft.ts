export interface Aircraft {
  icao24: string;
  callsign: string | null;
  originCountry: string | null;   // null voor adsb.lol (niet beschikbaar)
  longitude: number | null;
  latitude: number | null;
  baroAltitude: number | null;    // metres
  onGround: boolean;
  velocity: number | null;        // m/s
  trueTrack: number | null;       // degrees
  verticalRate: number | null;    // m/s
  geoAltitude: number | null;     // metres
  squawk: string | null;
  // Velden direct beschikbaar via adsb.lol
  registration: string | null;
  aircraftType: string | null;    // bijv. "Airbus A320"
  operator: string | null;        // airline/operator naam
}

export interface UserLocation {
  latitude: number;
  longitude: number;
}

export interface FlightDetail {
  airline: string | null;
  aircraftType: string | null;
  registration: string | null;
  // Weergavecode: IATA als beschikbaar, anders ICAO, anders null
  departureAirport: string | null;
  arrivalAirport: string | null;
  // Leesbare naam (bijv. "Amsterdam Schiphol"), null als onbekend
  departureAirportName: string | null;
  arrivalAirportName: string | null;
  loading: boolean;
  error: string | null;
}
