"use client";

import { useState, useCallback, useMemo } from "react";
import { useLocation } from "@/hooks/useLocation";
import { useAircraft } from "@/hooks/useAircraft";
import { useFlightDetail } from "@/hooks/useFlightDetail";
import { scoreAircraft } from "@/lib/geo";
import LocationPrompt from "@/components/LocationPrompt";
import OverheadCard from "@/components/OverheadCard";
import NearbyList from "@/components/NearbyList";
import EmptyState from "@/components/EmptyState";

const RADIUS_KM = 50;

export default function Home() {
  const { location, error: locationError, loading: locationLoading, requestLocation } = useLocation();
  const { aircraft, loading: aircraftLoading, error: aircraftError, errorType, lastUpdated } = useAircraft(location, RADIUS_KM);
  const [selectedIcao, setSelectedIcao] = useState<string | null>(null);

  const scored = useMemo(
    () => (location ? scoreAircraft(aircraft, location) : []),
    [aircraft, location]
  );

  // Selected or top-scored aircraft
  const primaryIcao = selectedIcao && scored.find((a) => a.icao24 === selectedIcao)
    ? selectedIcao
    : scored[0]?.icao24 || null;

  const primary = scored.find((a) => a.icao24 === primaryIcao) || null;
  const nearby = scored.filter((a) => a.icao24 !== primaryIcao);

  const detail = useFlightDetail(primaryIcao, aircraft);

  const handleSelect = useCallback((icao: string) => {
    setSelectedIcao(icao);
  }, []);

  if (!location) {
    return (
      <LocationPrompt
        onRequestLocation={requestLocation}
        loading={locationLoading}
        error={locationError}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-gray-100 shrink-0">
        <h1 className="text-sm font-medium text-gray-400 uppercase tracking-wide">
          Overhead
        </h1>
        <div className="flex items-center gap-3 text-xs text-gray-400">
          {aircraftLoading && !lastUpdated && (
            <span className="text-blue-400">Laden...</span>
          )}
          {aircraftError && (
            <span className="text-amber-500" title={errorType || undefined}>!</span>
          )}
          <span>{scored.length} in de buurt</span>
          {lastUpdated && (
            <time>
              {lastUpdated.toLocaleTimeString("nl-NL", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </time>
          )}
        </div>
      </header>

      {/* Primary aircraft or empty state */}
      <main className="flex-1">
        {primary ? (
          <OverheadCard aircraft={primary} detail={detail} />
        ) : (
          <EmptyState
            error={aircraftError}
            errorType={errorType}
            loading={aircraftLoading}
          />
        )}
      </main>

      {/* Nearby list */}
      {nearby.length > 0 && (
        <section className="border-t border-gray-100">
          <div className="px-6 py-2 text-xs text-gray-400 uppercase tracking-wide">
            Ook in de buurt ({nearby.length})
          </div>
          <NearbyList
            aircraft={nearby}
            selectedIcao={primaryIcao}
            onSelect={handleSelect}
          />
        </section>
      )}
    </div>
  );
}
