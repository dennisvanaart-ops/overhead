"use client";

import { useState, useCallback } from "react";
import { UserLocation } from "@/types/aircraft";

interface UseLocationResult {
  location: UserLocation | null;
  error: string | null;
  loading: boolean;
  requestLocation: () => void;
}

export function useLocation(): UseLocationResult {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocatie wordt niet ondersteund door deze browser.");
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLoading(false);
      },
      (err) => {
        const messages: Record<number, string> = {
          1: "Locatietoegang is geweigerd. Sta locatie toe in je browserinstellingen.",
          2: "Locatie kon niet worden bepaald.",
          3: "Locatieverzoek duurde te lang.",
        };
        setError(messages[err.code] || "Onbekende locatiefout.");
        setLoading(false);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }, []);

  return { location, error, loading, requestLocation };
}
