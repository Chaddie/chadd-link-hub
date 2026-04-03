"use client";

import { useState } from "react";
import { ToolShell } from "./ToolShell";

const TYPES = ["A", "AAAA", "CNAME", "MX", "NS", "TXT", "SOA", "SRV", "PTR"] as const;

const inp = "tool-input font-sans max-w-none";

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
          <label className="text-xs font-medium text-muted-foreground">Hostname</label>
          <input
            value={hostname}
            onChange={(e) => setHostname(e.target.value)}
            placeholder="example.com"
            className={`mt-0.5 block w-full ${inp}`}
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className={`mt-0.5 block ${inp}`}
          >
            {TYPES.map((t) => (
              <option key={t} value={t} className="bg-card text-foreground">
                {t}
              </option>
            ))}
          </select>
        </div>
        <button type="button" onClick={run} disabled={loading} className="tool-btn-primary">
          {loading ? "…" : "Query"}
        </button>
      </div>
      {error ? <p className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p> : null}
      {records !== null ? (
        <pre className="tool-pre mt-6 text-xs leading-relaxed">{JSON.stringify(records, null, 2)}</pre>
      ) : null}
    </ToolShell>
  );
}
