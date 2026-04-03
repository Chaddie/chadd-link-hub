"use client";

import { useState } from "react";
import { ToolShell } from "./ToolShell";

export function ReverseDns() {
  const [ip, setIp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hostnames, setHostnames] = useState<string[] | null>(null);

  async function run() {
    setLoading(true);
    setError(null);
    setHostnames(null);
    try {
      const res = await fetch("/api/tools/reverse-dns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ip: ip.trim() }),
      });
      const json = (await res.json()) as { hostnames?: string[]; error?: string };
      if (!res.ok) {
        setError(json.error ?? "Lookup failed");
        return;
      }
      setHostnames(json.hostnames ?? []);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolShell
      title="Reverse DNS"
      description="PTR lookup (reverse DNS) for IPv4 and IPv6 using server resolvers."
    >
      <div className="flex flex-wrap gap-2">
        <input
          value={ip}
          onChange={(e) => setIp(e.target.value)}
          placeholder="203.0.113.10"
          className="tool-input min-w-[200px] flex-1"
        />
        <button type="button" onClick={run} disabled={loading} className="tool-btn-primary">
          {loading ? "…" : "Lookup"}
        </button>
      </div>
      {error ? <p className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p> : null}
      {hostnames ? (
        <ul
          className="mt-6 list-inside list-disc rounded-2xl border p-4 font-mono text-sm text-foreground/90 backdrop-blur-sm"
          style={{
            borderColor: "var(--tool-panel-border)",
            background: "var(--tool-panel-bg)",
          }}
        >
          {hostnames.length ? (
            hostnames.map((h) => <li key={h}>{h}</li>)
          ) : (
            <li className="list-none text-muted-foreground">No PTR records returned.</li>
          )}
        </ul>
      ) : null}
    </ToolShell>
  );
}
