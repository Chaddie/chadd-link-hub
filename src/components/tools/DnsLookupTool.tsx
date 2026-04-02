"use client";

import { useState } from "react";
import { ToolShell } from "./ToolShell";

const TYPES = ["A", "AAAA", "CNAME", "MX", "NS", "TXT", "SOA", "SRV", "PTR"] as const;

export function DnsLookupTool() {
  const [hostname, setHostname] = useState("");
  const [type, setType] = useState<string>("A");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [records, setRecords] = useState<unknown>(null);

  async function run() {
    setLoading(true);
    setError(null);
    setRecords(null);
    try {
      const res = await fetch("/api/tools/dns-lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hostname: hostname.trim(), type }),
      });
      const json = (await res.json()) as { records?: unknown; error?: string };
      if (!res.ok) {
        setError(json.error ?? "Lookup failed");
        return;
      }
      setRecords(json.records ?? null);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolShell
      title="DNS lookup"
      description="Uses the DNS resolvers configured on the server (deployment dependent)."
    >
      <div className="flex flex-wrap items-end gap-2">
        <div className="min-w-[200px] flex-1">
          <label className="text-xs font-medium text-zinc-600">Hostname</label>
          <input
            value={hostname}
            onChange={(e) => setHostname(e.target.value)}
            placeholder="example.com"
            className="mt-0.5 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-zinc-600">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="mt-0.5 block rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          >
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={run}
          disabled={loading}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
        >
          {loading ? "…" : "Query"}
        </button>
      </div>
      {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}
      {records !== null ? (
        <pre className="mt-6 overflow-x-auto rounded-xl border border-zinc-200 bg-zinc-50 p-4 font-mono text-xs text-zinc-900">
          {JSON.stringify(records, null, 2)}
        </pre>
      ) : null}
    </ToolShell>
  );
}
