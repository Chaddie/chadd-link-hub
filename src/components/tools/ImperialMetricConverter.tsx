"use client";

import { useMemo, useState } from "react";
import { ToolShell } from "./ToolShell";

type Cat = "length" | "mass" | "volume" | "temperature";

const LENGTH_TO_M: Record<string, number> = {
  m: 1,
  km: 1000,
  cm: 0.01,
  mm: 0.001,
  mi: 1609.344,
  yd: 0.9144,
  ft: 0.3048,
  in: 0.0254,
};

const MASS_TO_KG: Record<string, number> = {
  kg: 1,
  g: 0.001,
  lb: 0.45359237,
  oz: 0.0283495231,
  st: 6.35029318,
};

const VOL_TO_L: Record<string, number> = {
  l: 1,
  ml: 0.001,
  "gal-us": 3.785411784,
  "qt-us": 0.946352946,
  "pt-us": 0.473176473,
  "cup-us": 0.2365882365,
  "floz-us": 0.0295735295625,
  "gal-uk": 4.54609,
};

function convertLength(v: number, from: string, to: string) {
  const m = v * (LENGTH_TO_M[from] ?? 1);
  return m / (LENGTH_TO_M[to] ?? 1);
}

function convertMass(v: number, from: string, to: string) {
  const kg = v * (MASS_TO_KG[from] ?? 1);
  return kg / (MASS_TO_KG[to] ?? 1);
}

function convertVolume(v: number, from: string, to: string) {
  const l = v * (VOL_TO_L[from] ?? 1);
  return l / (VOL_TO_L[to] ?? 1);
}

function convertTemp(v: number, from: string, to: string) {
  let c = v;
  if (from === "F") c = ((v - 32) * 5) / 9;
  else if (from === "K") c = v - 273.15;
  if (to === "C") return c;
  if (to === "F") return (c * 9) / 5 + 32;
  if (to === "K") return c + 273.15;
  return v;
}

export function ImperialMetricConverter() {
  const [cat, setCat] = useState<Cat>("length");
  const [value, setValue] = useState("1");
  const [from, setFrom] = useState("m");
  const [to, setTo] = useState("ft");

  const num = parseFloat(value.replace(",", "."));
  const invalid = Number.isNaN(num);

  const result = useMemo(() => {
    if (invalid) return null;
    try {
      if (cat === "length") return convertLength(num, from, to);
      if (cat === "mass") return convertMass(num, from, to);
      if (cat === "volume") return convertVolume(num, from, to);
      return convertTemp(num, from, to);
    } catch {
      return null;
    }
  }, [cat, num, from, to, invalid]);

  const units: Record<Cat, { id: string; label: string }[]> = {
    length: [
      { id: "m", label: "Metres (m)" },
      { id: "km", label: "Kilometres (km)" },
      { id: "cm", label: "Centimetres (cm)" },
      { id: "mm", label: "Millimetres (mm)" },
      { id: "mi", label: "Miles (mi)" },
      { id: "yd", label: "Yards (yd)" },
      { id: "ft", label: "Feet (ft)" },
      { id: "in", label: "Inches (in)" },
    ],
    mass: [
      { id: "kg", label: "Kilograms (kg)" },
      { id: "g", label: "Grams (g)" },
      { id: "lb", label: "Pounds (lb)" },
      { id: "oz", label: "Ounces (oz)" },
      { id: "st", label: "Stone (st)" },
    ],
    volume: [
      { id: "l", label: "Litres (L)" },
      { id: "ml", label: "Millilitres (mL)" },
      { id: "gal-us", label: "US gallons" },
      { id: "qt-us", label: "US quarts" },
      { id: "pt-us", label: "US pints" },
      { id: "cup-us", label: "US cups" },
      { id: "floz-us", label: "US fl oz" },
      { id: "gal-uk", label: "UK gallons" },
    ],
    temperature: [
      { id: "C", label: "Celsius (°C)" },
      { id: "F", label: "Fahrenheit (°F)" },
      { id: "K", label: "Kelvin (K)" },
    ],
  };

  const field =
    "w-full rounded-xl border border-border bg-card/80 px-3 py-2 text-sm outline-none focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--accent)]/25 dark:bg-white/10";

  return (
    <ToolShell
      title="Imperial / metric converter"
      description="Length, mass, volume, and temperature. Uses standard conversion factors; suitable for everyday estimates."
    >
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {(["length", "mass", "volume", "temperature"] as const).map((c) => (
            <button
              key={c}
              type="button"
              className={`rounded-lg px-3 py-1.5 text-sm font-medium capitalize ${
                cat === c
                  ? "bg-[color:var(--accent-muted)] text-[color:var(--accent)]"
                  : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/10"
              }`}
              onClick={() => {
                setCat(c);
                const u = units[c];
                setFrom(u[0]!.id);
                setTo(u[1]!.id);
              }}
            >
              {c}
            </button>
          ))}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Value</label>
          <input
            type="text"
            inputMode="decimal"
            className={field}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">From</label>
            <select
              className={field}
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            >
              {units[cat].map((u) => (
                <option key={u.id} value={u.id}>
                  {u.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">To</label>
            <select
              className={field}
              value={to}
              onChange={(e) => setTo(e.target.value)}
            >
              {units[cat].map((u) => (
                <option key={u.id} value={u.id}>
                  {u.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-black/[0.04] p-4 dark:bg-white/[0.06]">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Result
          </p>
          <p className="mt-2 font-mono text-2xl font-semibold tabular-nums">
            {invalid || result === null
              ? "—"
              : cat === "temperature"
                ? result.toLocaleString(undefined, { maximumFractionDigits: 4 })
                : result.toLocaleString(undefined, { maximumFractionDigits: 8 })}
          </p>
        </div>
      </div>
    </ToolShell>
  );
}
