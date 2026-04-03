"use client";

import { useMemo, useState } from "react";
import { HTTP_STATUS_CODES } from "@/lib/data/http-status-codes";
import { ToolShell } from "./ToolShell";

export function HttpStatusCodes() {
  const [q, setQ] = useState("");
  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return HTTP_STATUS_CODES;
    return HTTP_STATUS_CODES.filter(
      (r) =>
        String(r.code).includes(s) ||
        r.name.toLowerCase().includes(s) ||
        r.description.toLowerCase().includes(s)
    );
  }, [q]);

  return (
    <ToolShell
      title="HTTP status codes"
      description="Common status codes — see RFC 9110 for the full registry."
    >
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Filter…"
        className="tool-input max-w-md font-sans"
      />
      <div
        className="mt-4 overflow-x-auto rounded-2xl border backdrop-blur-sm"
        style={{
          borderColor: "var(--tool-panel-border)",
          background: "var(--tool-panel-bg)",
        }}
      >
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead>
            <tr
              className="border-b text-muted-foreground"
              style={{ borderColor: "var(--tool-panel-border)" }}
            >
              <th className="bg-black/[0.03] px-3 py-2 font-medium dark:bg-white/[0.06]">
                Code
              </th>
              <th className="bg-black/[0.03] px-3 py-2 font-medium dark:bg-white/[0.06]">
                Name
              </th>
              <th className="bg-black/[0.03] px-3 py-2 font-medium dark:bg-white/[0.06]">
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.code} className="border-b border-border/60 text-foreground/90">
                <td className="px-3 py-2 font-mono tabular-nums">{r.code}</td>
                <td className="px-3 py-2 font-medium">{r.name}</td>
                <td className="px-3 py-2">{r.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ToolShell>
  );
}
