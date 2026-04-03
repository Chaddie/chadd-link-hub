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

const inp = "tool-input font-sans";

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
          <label className="text-xs font-medium text-muted-foreground">Hostname</label>
          <input
            value={host}
            onChange={(e) => setHost(e.target.value)}
            placeholder="example.com"
            className={`mt-0.5 block w-56 max-w-none ${inp}`}
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">Port</label>
          <input
            value={port}
            onChange={(e) => setPort(e.target.value)}
            className={`mt-0.5 block w-24 max-w-none ${inp}`}
          />
        </div>
        <button type="button" onClick={check} disabled={loading} className="tool-btn-primary">
          {loading ? "…" : "Check"}
        </button>
      </div>
      {error ? <p className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p> : null}
      {result ? (
        <div
          className="mt-6 space-y-4 rounded-2xl border p-4 text-sm backdrop-blur-sm"
          style={{
            borderColor: "var(--tool-panel-border)",
            background: "var(--tool-panel-bg)",
          }}
        >
          <div>
            <p className="text-xs font-medium uppercase text-muted-foreground">Subject</p>
            <p className="font-mono text-foreground">{result.subject || "—"}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase text-muted-foreground">Issuer</p>
            <p className="font-mono text-foreground">{result.issuer || "—"}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">Valid from</p>
              <p className="font-mono text-foreground/90">{result.validFrom}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">Valid to</p>
              <p className="font-mono text-foreground/90">{result.validTo}</p>
            </div>
          </div>
          <div>
            <p className="text-xs font-medium uppercase text-muted-foreground">Serial</p>
            <p className="break-all font-mono text-foreground/90">{result.serialNumber}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase text-muted-foreground">SHA-256 fingerprint</p>
            <p className="break-all font-mono text-xs text-muted-foreground">{result.fingerprint256}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase text-muted-foreground">Subject Alternative Names</p>
            <ul className="list-inside list-disc font-mono text-xs text-foreground/85">
              {result.subjectAltNames?.length
                ? result.subjectAltNames.map((s) => <li key={s}>{s}</li>)
                : "—"}
            </ul>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">
              Chain trusted by Node: {result.authorized ? "yes" : "no"}
              {result.authorizationError ? ` (${result.authorizationError})` : ""}
            </p>
          </div>
        </div>
      ) : null}
    </ToolShell>
  );
}
