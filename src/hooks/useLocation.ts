"use client";

import { useState, useCallback, useEffect } from "react";
import { UserLocation } from "@/types/aircraft";

// ── Opslag ──────────────────────────────────────────────────────────────────

const STORAGE_KEY = "overhead_location";

interface StoredLocation {
  latitude: number;
  longitude: number;
  label: string;
  source: "geocode" | "gps";
}

function loadStored(): StoredLocation | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredLocation;
  } catch {
    return null;
  }
}

function saveStored(loc: StoredLocation): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(loc));
  } catch {
    /* localStorage niet beschikbaar */
  }
}

function clearStored(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* niets */
  }
}

// ── Hook ────────────────────────────────────────────────────────────────────

export interface UseLocationResult {
  /** Huidige locatie (uit localStorage of GPS), null als onbekend */
  location: UserLocation | null;
  /** Leesbare naam, bijv. "Amsterdam, Nederland" */
  locationLabel: string | null;
  /** Foutmelding voor GPS-verzoek */
  gpsError: string | null;
  /** Bezig met GPS-verzoek */
  gpsLoading: boolean;
  /** Sla een via geocoding gevonden locatie op (primaire methode) */
  setLocation: (lat: number, lon: number, label: string) => void;
  /** Verwijder opgeslagen locatie → app blokkeert tot nieuwe invoer */
  clearLocation: () => void;
  /** Optioneel: probeer GPS (secundair) */
  requestGPS: () => void;
}

export function useLocation(): UseLocationResult {
  const [location, setLocationState] = useState<UserLocation | null>(null);
  const [locationLabel, setLocationLabel] = useState<string | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);

  // Laad opgeslagen locatie bij mount (client-only)
  useEffect(() => {
    const stored = loadStored();
    if (stored) {
      setLocationState({
        latitude: stored.latitude,
        longitude: stored.longitude,
        label: stored.label,
      });
      setLocationLabel(stored.label);
    }
  }, []);

  const setLocation = useCallback(
    (lat: number, lon: number, label: string) => {
      const loc: UserLocation = { latitude: lat, longitude: lon, label };
      setLocationState(loc);
      setLocationLabel(label);
      setGpsError(null);
      saveStored({ latitude: lat, longitude: lon, label, source: "geocode" });
    },
    []
  );

  const clearLocation = useCallback(() => {
    setLocationState(null);
    setLocationLabel(null);
    clearStored();
  }, []);

  const requestGPS = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setGpsError("GPS wordt niet ondersteund door dit apparaat.");
      return;
    }
    setGpsLoading(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        const label = `${lat.toFixed(3)}°N, ${lon.toFixed(3)}°E`;
        const loc: UserLocation = { latitude: lat, longitude: lon, label };
        setLocationState(loc);
        setLocationLabel(label);
        setGpsLoading(false);
        saveStored({ latitude: lat, longitude: lon, label, source: "gps" });
      },
      (err) => {
        const messages: Record<number, string> = {
          1: "Locatietoegang geweigerd. Voer handmatig een plaatsnaam in.",
          2: "Locatie kon niet worden bepaald via GPS.",
          3: "GPS-verzoek duurde te lang.",
        };
        setGpsError(messages[err.code] || "Onbekende GPS-fout.");
        setGpsLoading(false);
      },
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 60_000 }
    );
  }, []);

  return {
    location,
    locationLabel,
    gpsError,
    gpsLoading,
    setLocation,
    clearLocation,
    requestGPS,
  };
}
