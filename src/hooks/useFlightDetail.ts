"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Aircraft, FlightDetail } from "@/types/aircraft";

const EMPTY_DETAIL: FlightDetail = {
  airline: null,
  aircraftType: null,
  registration: null,
  departureAirport: null,
  arrivalAirport: null,
  departureAirportName: null,
  arrivalAirportName: null,
  loading: false,
  error: null,
};

// Cache airline lookups per icao24 (airline verandert niet tijdens een vlucht)
const airlineCache = new Map<string, string | null>();

export function useFlightDetail(
  selectedIcao: string | null,
  aircraft: Aircraft[]
): FlightDetail {
  const [detail, setDetail] = useState<FlightDetail>(EMPTY_DETAIL);
  const abortRef = useRef<AbortController | null>(null);

  const fetchDetail = useCallback(
    async (selected: Aircraft) => {
      const { icao24, callsign, latitude, longitude } = selected;

      // Check airline cache
      const cachedAirline = airlineCache.has(icao24)
        ? airlineCache.get(icao24)!
        : undefined;

      setDetail({
        airline: cachedAirline ?? null,
        aircraftType: selected.aircraftType,
        registration: selected.registration,
        departureAirport: null,
        arrivalAirport: null,
        departureAirportName: null,
        arrivalAirportName: null,
        loading: true,
        error: null,
      });

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const params = new URLSearchParams();
        if (callsign) params.set("callsign", callsign);
        if (latitude != null) params.set("lat", latitude.toString());
        if (longitude != null) params.set("lon", longitude.toString());

        const res = await fetch(`/api/aircraft/${icao24}?${params}`, {
          signal: controller.signal,
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Fout bij ophalen details");
        }

        const airline: string | null = data.airline ?? null;
        airlineCache.set(icao24, airline);

        setDetail({
          airline,
          aircraftType: selected.aircraftType,
          registration: selected.registration,
          departureAirport: data.departureAirport ?? null,
          arrivalAirport: data.arrivalAirport ?? null,
          departureAirportName: data.departureAirportName ?? null,
          arrivalAirportName: data.arrivalAirportName ?? null,
          loading: false,
          error: null,
        });
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        // Detail-fetch mislukt: toon wat we al hebben, geen crashende UI
        setDetail((prev) => ({ ...prev, loading: false, error: null }));
      }
    },
    []
  );

  useEffect(() => {
    if (!selectedIcao) {
      setDetail(EMPTY_DETAIL);
      return;
    }

    const selected = aircraft.find((a) => a.icao24 === selectedIcao);
    if (!selected) {
      setDetail(EMPTY_DETAIL);
      return;
    }

    fetchDetail(selected);

    return () => {
      abortRef.current?.abort();
    };
  }, [selectedIcao, aircraft, fetchDetail]);

  return detail;
}
