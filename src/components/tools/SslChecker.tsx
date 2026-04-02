"use client";

import { useState } from "react";
import { ToolShell } from "./ToolShell";

type SslResult = {
  subject: string;
  issuer: string;
  serialNumber: string;
  validFrom: string;
  validTo: string;
  fingerprint256: string;
  subjectAltNames: string[];
  authorized: boolean;
  authorizationError: string | null;
};

export function SslChecker() {
  const [host, setHost] = useState("");
  const [port, setPort] = useState("443");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SslResult | null>(null);

  async function check() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/tools/ssl-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          host: host.trim(),
          port: Number(port) || 443,
        }),
      });
      const json = (await res.json()) as { result?: SslResult; error?: string };
      if (!res.ok) {
        setError(json.error ?? "Request failed");
        return;
      }
      if (json.result) setResult(json.result);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolShell
      title="SSL certificate checker"
      description="Inspects the certificate presented by the host (TLS). Self-signed or expired certs may still be shown."
    >
      <div className="flex flex-wrap items-end gap-2">
        <div>
          <label className="text-xs font-medium text-zinc-600">Hostname</label>
          <input
            value={host}
            onChange={(e) => setHost(e.target.value)}
            placeholder="example.com"
            className="mt-0.5 block w-56 rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-zinc-600">Port</label>
          <input
            value={port}
            onChange={(e) => setPort(e.target.value)}
            className="mt-0.5 block w-20 rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          />
        </div>
        <button
          type="button"
          onClick={check}
          disabled={loading}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
        >
          {loading ? "…" : "Check"}
        </button>
      </div>
      {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}
      {result ? (
        <div className="mt-6 space-y-4 rounded-xl border border-zinc-200 bg-white p-4 text-sm">
          <div>
            <p className="text-xs font-medium uppercase text-zinc-500">Subject</p>
            <p className="font-mono text-zinc-900">{result.subject || "—"}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase text-zinc-500">Issuer</p>
            <p className="font-mono text-zinc-900">{result.issuer || "—"}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase text-zinc-500">Valid from</p>
              <p className="font-mono">{result.validFrom}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-zinc-500">Valid to</p>
              <p className="font-mono">{result.validTo}</p>
            </div>
          </div>
          <div>
            <p className="text-xs font-medium uppercase text-zinc-500">Serial</p>
            <p className="break-all font-mono">{result.serialNumber}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase text-zinc-500">SHA-256 fingerprint</p>
            <p className="break-all font-mono text-xs">{result.fingerprint256}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase text-zinc-500">Subject Alternative Names</p>
            <ul className="list-inside list-disc font-mono text-xs text-zinc-800">
              {result.subjectAltNames?.length
                ? result.subjectAltNames.map((s) => <li key={s}>{s}</li>)
                : "—"}
            </ul>
          </div>
          <div>
            <p className="text-xs text-zinc-500">
              Chain trusted by Node: {result.authorized ? "yes" : "no"}
              {result.authorizationError ? ` (${result.authorizationError})` : ""}
            </p>
          </div>
        </div>
      ) : null}
    </ToolShell>
  );
}
