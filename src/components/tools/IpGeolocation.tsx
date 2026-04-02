"use client";

import { useState } from "react";
import { ToolShell } from "./ToolShell";

export function IpGeolocation() {
  const [ip, setIp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Record<string, unknown> | null>(null);

  async function lookup() {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await fetch("/api/tools/ip-lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ip: ip.trim() }),
      });
      const json = (await res.json()) as { data?: Record<string, unknown>; error?: string };
      if (!res.ok) {
        setError(json.error ?? "Request failed");
        return;
      }
      setData(json.data ?? null);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  const d = data ?? {};
  const row = (k: string, label: string) => {
    const v = d[k];
    if (v === undefined || v === null || v === "") return null;
    return (
      <div key={k} className="grid gap-1 sm:grid-cols-[160px_1fr] sm:gap-4">
        <dt className="text-zinc-500">{label}</dt>
        <dd className="font-mono text-sm text-zinc-900">{String(v)}</dd>
      </div>
    );
  };

  return (
    <ToolShell
      title="IP geolocation"
      description="Powered by ipapi.co (rate limits apply on free tier)."
    >
      <div className="flex flex-wrap gap-2">
        <input
          value={ip}
          onChange={(e) => setIp(e.target.value)}
          placeholder="203.0.113.42"
          className="min-w-[200px] flex-1 rounded-lg border border-zinc-300 px-3 py-2 font-mono text-sm"
        />
        <button
          type="button"
          onClick={lookup}
          disabled={loading}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
        >
          {loading ? "…" : "Lookup"}
        </button>
      </div>
      {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}
      {data ? (
        <dl className="mt-6 space-y-2 rounded-xl border border-zinc-200 bg-white p-4">
          {row("ip", "IP")}
          {row("city", "City")}
          {row("region", "Region")}
          {row("country_name", "Country")}
          {row("postal", "Postal")}
          {row("latitude", "Latitude")}
          {row("longitude", "Longitude")}
          {row("asn", "ASN")}
          {row("org", "ISP / Org")}
          {row("timezone", "Timezone")}
        </dl>
      ) : null}
    </ToolShell>
  );
}
