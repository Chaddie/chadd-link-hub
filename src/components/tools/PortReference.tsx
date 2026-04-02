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
        className="w-full max-w-md rounded-lg border border-zinc-300 px-3 py-2 text-sm"
      />
      <div className="mt-4 overflow-x-auto rounded-xl border border-zinc-200 bg-white">
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 text-zinc-600">
              <th className="px-3 py-2 font-medium">Port</th>
              <th className="px-3 py-2 font-medium">Protocol</th>
              <th className="px-3 py-2 font-medium">Service</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={`${p.port}-${p.proto}-${p.service}`} className="border-b border-zinc-100">
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
