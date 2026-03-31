"use client";

import { AircraftCategory } from "@/lib/aircraftCategory";

interface AircraftIconProps {
  category: AircraftCategory;
  /** Tailwind sizing classes, e.g. "w-[150px] h-auto" */
  className?: string;
}

/**
 * Top-down aircraft silhouette — redesigned as a hero visual.
 *
 * viewBox: 0 0 200 300  (portrait, nose pointing up, tail at bottom)
 *
 * Fuselage uses smooth cubic bezier curves for a premium look.
 * Engine nacelles are rendered in a slightly darker tone to add depth.
 * No rotation — fixed orientation, always nose-up.
 *
 * Two-tone palette:
 *   Body / wings  — #dfe5ef  (slate-200, cool light gray)
 *   Engines       — #8d9ab3  (slate-400, mid-tone, clearly distinct)
 */
export default function AircraftIcon({
  category,
  className = "w-[150px] h-auto",
}: AircraftIconProps) {
  return (
    <svg
      viewBox="0 0 200 300"
      className={className}
      aria-hidden="true"
      style={{ filter: "drop-shadow(0 6px 16px rgba(0,0,0,0.07))" }}
    >
      {category === "narrow"  && <NarrowBody />}
      {category === "wide"    && <WideBody />}
      {category === "heavy"   && <HeavyBody />}
      {category === "unknown" && <GenericBody />}
    </svg>
  );
}

// ─── Shared colours ────────────────────────────────────────────────────────

const BODY   = "#dfe5ef";
const ENGINE = "#8d9ab3";

// ─── Narrow body  (A320 / B737 family) ────────────────────────────────────
// Slim fuselage ±13px, moderate swept wings, 2 turbofan nacelles

function NarrowBody() {
  return (
    <g>
      {/* Fuselage — smooth bezier nose + tail taper */}
      <path
        fill={BODY}
        d="
          M 100,14
          C 100,14 113,35 113,58
          L 113,208
          C 113,248 107,281 100,289
          C  93,281  87,248  87,208
          L  87,58
          C  87,35 100,14 100,14
          Z
        "
      />

      {/* Left wing — swept leading edge, tapered */}
      <path fill={BODY} d="M 91,108 L 5,156 L 9,174 L 91,133 Z" />
      {/* Right wing */}
      <path fill={BODY} d="M 109,108 L 195,156 L 191,174 L 109,133 Z" />

      {/* Left engine nacelle */}
      <ellipse fill={ENGINE} cx="8"   cy="162" rx="9"  ry="17" />
      {/* Right engine nacelle */}
      <ellipse fill={ENGINE} cx="192" cy="162" rx="9"  ry="17" />

      {/* Left horizontal stabiliser */}
      <path fill={BODY} d="M 91,234 L 37,257 L 40,266 L 91,249 Z" />
      {/* Right horizontal stabiliser */}
      <path fill={BODY} d="M 109,234 L 163,257 L 160,266 L 109,249 Z" />
    </g>
  );
}

// ─── Wide body  (A330 / B777 / B787 family) ───────────────────────────────
// Wider fuselage ±15px, long-span swept wings, 2 large nacelles

function WideBody() {
  return (
    <g>
      <path
        fill={BODY}
        d="
          M 100,14
          C 100,14 115,35 115,58
          L 115,208
          C 115,248 108,281 100,289
          C  92,281  85,248  85,208
          L  85,58
          C  85,35 100,14 100,14
          Z
        "
      />

      {/* Left wing — longer reach */}
      <path fill={BODY} d="M 87,102 L 3,154 L 7,174 L 87,129 Z" />
      {/* Right wing */}
      <path fill={BODY} d="M 113,102 L 197,154 L 193,174 L 113,129 Z" />

      {/* Engines — larger than narrow */}
      <ellipse fill={ENGINE} cx="7"   cy="162" rx="11" ry="20" />
      <ellipse fill={ENGINE} cx="193" cy="162" rx="11" ry="20" />

      {/* Stabilisers — slightly wider */}
      <path fill={BODY} d="M 87,234 L 29,258 L 32,268 L 87,250 Z" />
      <path fill={BODY} d="M 113,234 L 171,258 L 168,268 L 113,250 Z" />
    </g>
  );
}

// ─── Heavy  (B747 / A380) ──────────────────────────────────────────────────
// Very wide fuselage ±20px, massive wingspan, 4 engines

function HeavyBody() {
  return (
    <g>
      <path
        fill={BODY}
        d="
          M 100,14
          C 100,14 120,35 120,58
          L 120,208
          C 120,248 110,281 100,289
          C  90,281  80,248  80,208
          L  80,58
          C  80,35 100,14 100,14
          Z
        "
      />

      {/* Wings — full span */}
      <path fill={BODY} d="M 83,98 L 1,158 L 5,180 L 83,128 Z" />
      <path fill={BODY} d="M 117,98 L 199,158 L 195,180 L 117,128 Z" />

      {/* 4 engine nacelles */}
      <ellipse fill={ENGINE} cx="6"   cy="167" rx="10" ry="18" />
      <ellipse fill={ENGINE} cx="34"  cy="151" rx="8"  ry="15" />
      <ellipse fill={ENGINE} cx="166" cy="151" rx="8"  ry="15" />
      <ellipse fill={ENGINE} cx="194" cy="167" rx="10" ry="18" />

      {/* Stabilisers — wide */}
      <path fill={BODY} d="M 83,234 L 19,259 L 22,270 L 83,250 Z" />
      <path fill={BODY} d="M 117,234 L 181,259 L 178,270 L 117,250 Z" />
    </g>
  );
}

// ─── Generic / unknown ─────────────────────────────────────────────────────
// Clean archetypal shape — no engine pods, maximally readable at any size

function GenericBody() {
  return (
    <g>
      <path
        fill={BODY}
        d="
          M 100,14
          C 100,14 112,35 112,60
          L 112,208
          C 112,248 106,281 100,289
          C  94,281  88,248  88,208
          L  88,60
          C  88,35 100,14 100,14
          Z
        "
      />

      {/* Wings */}
      <path fill={BODY} d="M 90,112 L 6,160 L 10,178 L 90,138 Z" />
      <path fill={BODY} d="M 110,112 L 194,160 L 190,178 L 110,138 Z" />

      {/* Stabilisers */}
      <path fill={BODY} d="M 90,234 L 37,257 L 40,266 L 90,249 Z" />
      <path fill={BODY} d="M 110,234 L 163,257 L 160,266 L 110,249 Z" />
    </g>
  );
}
