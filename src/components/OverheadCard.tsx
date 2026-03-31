"use client";

import { ScoredAircraft } from "@/lib/geo";
import { FlightDetail } from "@/types/aircraft";
import AirlineLogo from "@/components/AirlineLogo";

interface OverheadCardProps {
  aircraft: ScoredAircraft;
  detail: FlightDetail;
}

// ── Formatters ──────────────────────────────────────────────────────────────

function formatAltitude(meters: number | null): string {
  if (meters === null) return "—";
  const fl = Math.round(meters / 30.48) * 100;
  return `FL ${fl}`;
}

function formatSpeed(ms: number | null): string {
  if (ms === null) return "—";
  return `${Math.round(ms * 3.6)} km/h`;
}

function getStatusText(distanceKm: number): string {
  if (distanceKm <= 5)  return "recht boven je locatie";
  if (distanceKm <= 15) return "bijna boven je locatie";
  if (distanceKm <= 30) return "vlakbij je locatie";
  return `${distanceKm} km van je locatie`;
}

// ── Component ───────────────────────────────────────────────────────────────

export default function OverheadCard({ aircraft: a, detail }: OverheadCardProps) {
  const airlineName  = detail.airline || a.operator || null;
  const aircraftType = a.aircraftType;
  const statusText   = getStatusText(a.distanceKm);

  const dep     = detail.departureAirport;
  const arr     = detail.arrivalAirport;
  const depName = detail.departureAirportName;
  const arrName = detail.arrivalAirportName;
  const hasRoute = !!(dep || arr);

  return (
    <div className="px-6 py-8 md:px-10 md:py-10 max-w-xl mx-auto w-full">

      {/* ── 1. Airline header ─────────────────────────────────────────── */}
      <div className="flex items-start gap-3 mb-1">
        <AirlineLogo callsign={a.callsign} airlineName={airlineName} />
        <div className="min-w-0">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight truncate">
            {detail.loading ? "Laden…" : (airlineName || "Onbekende airline")}
          </h2>
          <p className="text-sm font-mono text-gray-400 mt-0.5">
            {a.callsign || a.icao24.toUpperCase()}
            {a.registration ? ` · ${a.registration}` : ""}
          </p>
        </div>
      </div>

      {/* ── 2. Status ──────────────────────────────────────────────────── */}
      <p className="text-sm font-semibold text-emerald-600 uppercase tracking-wide mt-3 mb-8">
        {statusText}
      </p>

      {/* ── 3. Route section ───────────────────────────────────────────── */}
      {hasRoute ? (
        <div className="mb-8">
          {/* Airport codes + names */}
          <div className="flex justify-between items-start">

            {/* Departure */}
            <div className="text-left max-w-[44%]">
              <div className="text-5xl md:text-6xl font-bold text-gray-900 leading-none tracking-tight">
                {dep || "???"}
              </div>
              {depName && (
                <p className="text-sm text-gray-500 mt-2 leading-snug">{depName}</p>
              )}
            </div>

            {/* Arrival */}
            <div className="text-right max-w-[44%]">
              <div className="text-5xl md:text-6xl font-bold text-gray-900 leading-none tracking-tight">
                {arr || "???"}
              </div>
              {arrName && (
                <p className="text-sm text-gray-500 mt-2 leading-snug">{arrName}</p>
              )}
            </div>
          </div>

          {/* Progress line with plane marker */}
          <div className="flex items-center mt-6 gap-0">
            {/* Departure dot */}
            <div className="w-3 h-3 rounded-full bg-gray-800 shrink-0 z-10" />

            {/* Left line */}
            <div className="flex-1 h-px bg-gray-300" />

            {/* Plane marker — ✈ rotated to point right */}
            <span
              className="text-xl text-gray-600 mx-1 shrink-0 leading-none select-none"
              style={{ display: "inline-block", transform: "rotate(45deg)" }}
              aria-hidden="true"
            >
              ✈
            </span>

            {/* Right line — lighter, "not yet flown" */}
            <div className="flex-1 h-px bg-gray-200" />

            {/* Arrival dot — hollow */}
            <div className="w-3 h-3 rounded-full border-2 border-gray-300 shrink-0 z-10" />
          </div>
        </div>
      ) : (
        /* No route: just a separator */
        <div className="mb-8 h-px bg-gray-100" />
      )}

      {/* ── 4. Aircraft type ───────────────────────────────────────────── */}
      {aircraftType && (
        <p className="text-base font-medium text-gray-700 mb-6">
          {aircraftType}
        </p>
      )}

      {/* ── 5. Key stats ───────────────────────────────────────────────── */}
      <div className="flex gap-8 md:gap-12">
        <Stat label="Hoogte"   value={formatAltitude(a.baroAltitude)} />
        <Stat label="Snelheid" value={formatSpeed(a.velocity)} />
        <Stat label="Afstand"  value={`${a.distanceKm} km`} />
      </div>

    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-gray-400 mb-0.5">
        {label}
      </div>
      <div className="text-base md:text-lg font-semibold text-gray-900 tabular-nums">
        {value}
      </div>
    </div>
  );
}
