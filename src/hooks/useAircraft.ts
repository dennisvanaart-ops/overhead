"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Aircraft, UserLocation } from "@/types/aircraft";

const REFRESH_INTERVAL = 15_000;
const RETRY_INTERVAL = 30_000; // Longer interval after errors

interface UseAircraftResult {
  aircraft: Aircraft[];
  loading: boolean;
  error: string | null;
  errorType: string | null;
  lastUpdated: Date | null;
}

export function useAircraft(
  location: UserLocation | null,
  radiusKm: number = 50
): UseAircraftResult {
  const [aircraft, setAircraft] = useState<Aircraft[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const fetchingRef = useRef(false);
  const hadSuccessRef = useRef(false);

  const fetchAircraft = useCallback(async () => {
    if (!location || fetchingRef.current) return;

    fetchingRef.current = true;
    setLoading(true);

    try {
      const params = new URLSearchParams({
        lat: location.latitude.toString(),
        lon: location.longitude.toString(),
        radius: radiusKm.toString(),
      });

      const response = await fetch(`/api/aircraft?${params}`);

      let data: { aircraft?: Aircraft[]; error?: string; errorType?: string };
      try {
        data = await response.json();
      } catch {
        throw { message: "Ongeldig antwoord van de server.", errorType: "INVALID_RESPONSE" };
      }

      if (!response.ok) {
        throw { message: data.error || "Fout bij ophalen vliegtuigdata.", errorType: data.errorType || "UNKNOWN" };
      }

      setAircraft(data.aircraft || []);
      setLastUpdated(new Date());
      setError(null);
      setErrorType(null);
      hadSuccessRef.current = true;
    } catch (err: unknown) {
      const typed = err as { message?: string; errorType?: string };

      // On network failure to our own API (e.g. offline)
      if (err instanceof TypeError && (err as TypeError).message === "Failed to fetch") {
        setError("Geen internetverbinding of server niet bereikbaar.");
        setErrorType("NETWORK");
      } else {
        setError(typed.message || "Onbekende fout bij ophalen vliegtuigdata.");
        setErrorType(typed.errorType || "UNKNOWN");
      }

      // Keep stale data visible if we had a previous success
      if (!hadSuccessRef.current) {
        setAircraft([]);
      }
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, [location, radiusKm]);

  useEffect(() => {
    if (!location) return;

    fetchAircraft();
    const interval = setInterval(
      fetchAircraft,
      error ? RETRY_INTERVAL : REFRESH_INTERVAL
    );
    return () => clearInterval(interval);
  }, [location, fetchAircraft, error]);

  return { aircraft, loading, error, errorType, lastUpdated };
}
