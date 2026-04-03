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
        className="tool-textarea min-h-[8rem]"
        placeholder="Paste the hardware hash (long base64 string)…"
      />
      {!result ? (
        <p className="mt-4 text-sm text-muted-foreground">Paste a hash to decode.</p>
      ) : (
        <div className="mt-6 space-y-4">
          <p className="text-sm text-muted-foreground">{result.note}</p>
          {Object.keys(result.fields).length > 0 ? (
            <dl
              className="rounded-2xl border p-4 text-sm backdrop-blur-sm"
              style={{
                borderColor: "var(--tool-panel-border)",
                background: "var(--tool-panel-bg)",
              }}
            >
              {Object.entries(result.fields).map(([k, v]) => (
                <div
                  key={k}
                  className="grid gap-1 border-b border-border/50 py-2 last:border-0 sm:grid-cols-[180px_1fr]"
                >
                  <dt className="font-medium text-muted-foreground">{k}</dt>
                  <dd className="break-all font-mono text-foreground">{v}</dd>
                </div>
              ))}
            </dl>
          ) : null}
          <details
            className="rounded-2xl border p-3 backdrop-blur-sm"
            style={{
              borderColor: "var(--tool-panel-border)",
              background: "color-mix(in srgb, var(--card) 40%, var(--background))",
            }}
          >
            <summary className="cursor-pointer text-sm font-medium text-foreground">
              Raw decoded text (preview)
            </summary>
            <pre className="mt-3 max-h-64 overflow-auto whitespace-pre-wrap break-all font-mono text-[10px] text-muted-foreground">
              {result.decodedUtf8.slice(0, 12000)}
              {result.decodedUtf8.length > 12000 ? "\n…" : ""}
            </pre>
          </details>
        </div>
      )}
    </ToolShell>
  );
}
