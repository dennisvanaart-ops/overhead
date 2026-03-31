"use client";

import { useState, FormEvent } from "react";
import { geocodeQuery } from "@/lib/geocode";

interface LocationPromptProps {
  /** Wordt aangeroepen zodra een locatie (via geocoding of GPS) is gevonden */
  onLocationFound: (lat: number, lon: number, label: string) => void;
  /** Optioneel: trigger GPS-verzoek vanuit parent */
  onRequestGPS: () => void;
  gpsLoading: boolean;
  gpsError: string | null;
}

export default function LocationPrompt({
  onLocationFound,
  onRequestGPS,
  gpsLoading,
  gpsError,
}: LocationPromptProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const result = await geocodeQuery(query);
      onLocationFound(result.latitude, result.longitude, result.displayName);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Locatie niet gevonden.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 bg-white">
      <div className="w-full max-w-sm">

        {/* Titel */}
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Overhead</h1>
        <p className="text-sm text-gray-500 mb-8">
          Wat vliegt er nu boven of dicht bij jou?
        </p>

        {/* Geocoding formulier — primaire methode */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Voer je locatie in
          </label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Plaatsnaam of postcode"
            autoFocus
            autoComplete="off"
            spellCheck={false}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-base"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="w-full px-4 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Zoeken…" : "Locatie instellen"}
          </button>
        </form>

        {/* Geocoding fout */}
        {error && (
          <p className="mt-3 text-sm text-red-600">{error}</p>
        )}

        {/* Scheidingslijn */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-xs text-gray-400">of</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        {/* GPS — secundaire methode */}
        <button
          onClick={onRequestGPS}
          disabled={gpsLoading}
          className="w-full px-4 py-3 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {gpsLoading ? "GPS ophalen…" : "Gebruik GPS-locatie"}
        </button>

        {/* GPS fout */}
        {gpsError && (
          <p className="mt-3 text-sm text-red-600">{gpsError}</p>
        )}

      </div>
    </div>
  );
}
