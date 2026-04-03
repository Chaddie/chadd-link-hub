"use client";

import { useState } from "react";
import { ToolShell } from "./ToolShell";

export function MacAddressLookup() {
  const [mac, setMac] = useState("");
  const [loading, setLoading] = useState(false);
  const [vendor, setVendor] = useState<string | null>(null);
  const [normalized, setNormalized] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function lookup() {
    setError(null);
    setVendor(null);
    setNormalized(null);
    setLoading(true);
    try {
      const res = await fetch(
        `/api/tools/mac-lookup?mac=${encodeURIComponent(mac.trim())}`
      );
      const data = (await res.json()) as {
        vendor?: string;
        mac?: string;
        error?: string;
      };
      if (!res.ok) {
        setError(data.error ?? "Lookup failed");
        return;
      }
      setVendor(data.vendor ?? null);
      setNormalized(data.mac ?? null);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  const field =
    "w-full rounded-xl border border-border bg-card/80 px-3 py-2 font-mono text-sm outline-none focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--accent)]/25 dark:bg-white/10";

  return (
    <ToolShell
      title="MAC address lookup"
      description="OUI vendor hint from the device MAC (first 3 octets). Data via api.macvendors.com through this server — rate limits apply."
    >
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">MAC address</label>
          <input
            className={field}
            value={mac}
            onChange={(e) => setMac(e.target.value)}
            placeholder="AA:BB:CC:DD:EE:FF or AABBCCDDEEFF"
          />
        </div>
        <button
          type="button"
          disabled={loading}
          className="rounded-xl bg-[color:var(--accent)] px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          onClick={lookup}
        >
          {loading ? "Looking up…" : "Lookup vendor"}
        </button>

        {error ? (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        ) : null}

        {vendor ? (
          <div className="rounded-xl border border-border bg-black/[0.04] p-4 dark:bg-white/[0.06]">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Normalized
            </p>
            <p className="mt-1 font-mono text-sm">{normalized}</p>
            <p className="mt-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Vendor (OUI database)
            </p>
            <p className="mt-1 text-lg font-medium">{vendor}</p>
          </div>
        ) : null}
      </div>
    </ToolShell>
  );
}
