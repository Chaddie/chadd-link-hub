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
        <dt className="text-muted-foreground">{label}</dt>
        <dd className="font-mono text-sm text-foreground">{String(v)}</dd>
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
          className="tool-input min-w-[200px] flex-1"
        />
        <button type="button" onClick={lookup} disabled={loading} className="tool-btn-primary">
          {loading ? "…" : "Lookup"}
        </button>
      </div>
      {error ? <p className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p> : null}
      {data ? (
        <dl
          className="mt-6 flex flex-col gap-2 rounded-2xl border p-4 backdrop-blur-sm"
          style={{
            borderColor: "var(--tool-panel-border)",
            background: "var(--tool-panel-bg)",
          }}
        >
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
