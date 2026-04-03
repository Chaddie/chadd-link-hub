"use client";

import { useMemo, useState } from "react";
import { COMMON_PORTS } from "@/lib/data/common-ports";
import { ToolShell } from "./ToolShell";

export function PortReference() {
  const [q, setQ] = useState("");
  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return COMMON_PORTS;
    return COMMON_PORTS.filter(
      (p) =>
        String(p.port).includes(s) ||
        p.service.toLowerCase().includes(s) ||
        p.proto.toLowerCase().includes(s)
    );
  }, [q]);

  return (
    <ToolShell
      title="Port reference"
      description="Common ports and typical services (not exhaustive)."
    >
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Filter by port, protocol, or name…"
        className="tool-input max-w-md font-sans"
      />
      <div
        className="mt-4 overflow-x-auto rounded-2xl border backdrop-blur-sm"
        style={{
          borderColor: "var(--tool-panel-border)",
          background: "var(--tool-panel-bg)",
        }}
      >
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead>
            <tr
              className="border-b text-muted-foreground"
              style={{ borderColor: "var(--tool-panel-border)" }}
            >
              <th className="bg-black/[0.03] px-3 py-2 font-medium dark:bg-white/[0.06]">
                Port
              </th>
              <th className="bg-black/[0.03] px-3 py-2 font-medium dark:bg-white/[0.06]">
                Protocol
              </th>
              <th className="bg-black/[0.03] px-3 py-2 font-medium dark:bg-white/[0.06]">
                Service
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr
                key={`${p.port}-${p.proto}-${p.service}`}
                className="border-b border-border/60 text-foreground/95"
              >
                <td className="px-3 py-2 font-mono tabular-nums">{p.port}</td>
                <td className="px-3 py-2">{p.proto}</td>
                <td className="px-3 py-2">{p.service}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ToolShell>
  );
}
