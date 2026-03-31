"use client";

import { ScoredAircraft } from "@/lib/geo";

interface NearbyListProps {
  aircraft: ScoredAircraft[];
  selectedIcao: string | null;
  onSelect: (icao: string) => void;
}

function formatAltitude(meters: number | null): string {
  if (meters === null) return "—";
  return `${Math.round(meters).toLocaleString("nl-NL")}m`;
}

function formatSpeed(ms: number | null): string {
  if (ms === null) return "—";
  return `${Math.round(ms * 3.6)} km/h`;
}

export default function NearbyList({
  aircraft,
  selectedIcao,
  onSelect,
}: NearbyListProps) {
  if (aircraft.length === 0) {
    return null;
  }

  return (
    <div className="divide-y divide-gray-100">
      {aircraft.map((a) => (
        <button
          key={a.icao24}
          onClick={() => onSelect(a.icao24)}
          className={`w-full text-left px-6 py-3 hover:bg-gray-50 transition-colors ${
            selectedIcao === a.icao24
              ? "bg-gray-50"
              : ""
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono font-semibold text-gray-900">
              {a.callsign || a.icao24}
            </span>
            <span className="text-sm text-gray-400">{a.distanceKm} km</span>
          </div>
          <div className="flex gap-4 text-xs text-gray-500 mt-0.5">
            <span>{formatAltitude(a.baroAltitude)}</span>
            <span>{formatSpeed(a.velocity)}</span>
            {a.aircraftType && <span>{a.aircraftType}</span>}
          </div>
        </button>
      ))}
    </div>
  );
}
