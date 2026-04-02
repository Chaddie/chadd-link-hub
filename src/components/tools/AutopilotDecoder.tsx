"use client";

import { useMemo, useState } from "react";
import { decodeAutopilotHardwareHash } from "@/lib/autopilot-decode";
import { ToolShell } from "./ToolShell";

export function AutopilotDecoder() {
  const [raw, setRaw] = useState("");
  const result = useMemo(() => {
    if (!raw.trim()) return null;
    return decodeAutopilotHardwareHash(raw);
  }, [raw]);

  return (
    <ToolShell
      title="Autopilot hash decoder"
      description="Decodes the base64 Autopilot hardware hash and tries to extract common XML fields. For full validation use Microsoft OA3Tool / Windows ADK."
    >
      <textarea
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        rows={6}
        className="w-full rounded-lg border border-zinc-300 p-3 font-mono text-xs"
        placeholder="Paste the hardware hash (long base64 string)…"
      />
      {!result ? (
        <p className="mt-4 text-sm text-zinc-500">Paste a hash to decode.</p>
      ) : (
        <div className="mt-6 space-y-4">
          <p className="text-sm text-zinc-700">{result.note}</p>
          {Object.keys(result.fields).length > 0 ? (
            <dl className="rounded-xl border border-zinc-200 bg-white p-4 text-sm">
              {Object.entries(result.fields).map(([k, v]) => (
                <div key={k} className="grid gap-1 border-b border-zinc-100 py-2 last:border-0 sm:grid-cols-[180px_1fr]">
                  <dt className="font-medium text-zinc-600">{k}</dt>
                  <dd className="break-all font-mono text-zinc-900">{v}</dd>
                </div>
              ))}
            </dl>
          ) : null}
          <details className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
            <summary className="cursor-pointer text-sm font-medium text-zinc-800">
              Raw decoded text (preview)
            </summary>
            <pre className="mt-3 max-h-64 overflow-auto whitespace-pre-wrap break-all font-mono text-[10px] text-zinc-800">
              {result.decodedUtf8.slice(0, 12000)}
              {result.decodedUtf8.length > 12000 ? "\n…" : ""}
            </pre>
          </details>
        </div>
      )}
    </ToolShell>
  );
}
