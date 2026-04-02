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
          className="min-w-[200px] flex-1 rounded-lg border border-zinc-300 px-3 py-2 font-mono text-sm"
        />
        <button
          type="button"
          onClick={run}
          disabled={loading}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
        >
          {loading ? "…" : "Lookup"}
        </button>
      </div>
      {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}
      {hostnames ? (
        <ul className="mt-6 list-inside list-disc rounded-xl border border-zinc-200 bg-white p-4 font-mono text-sm">
          {hostnames.length ? (
            hostnames.map((h) => <li key={h}>{h}</li>)
          ) : (
            <li className="list-none text-zinc-500">No PTR records returned.</li>
          )}
        </ul>
      ) : null}
    </ToolShell>
  );
}
