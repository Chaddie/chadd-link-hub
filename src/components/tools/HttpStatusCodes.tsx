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
        className="w-full max-w-md rounded-lg border border-zinc-300 px-3 py-2 text-sm"
      />
      <div className="mt-4 overflow-x-auto rounded-xl border border-zinc-200 bg-white">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 text-zinc-600">
              <th className="px-3 py-2 font-medium">Code</th>
              <th className="px-3 py-2 font-medium">Name</th>
              <th className="px-3 py-2 font-medium">Description</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.code} className="border-b border-zinc-100">
                <td className="px-3 py-2 font-mono tabular-nums">{r.code}</td>
                <td className="px-3 py-2 font-medium">{r.name}</td>
                <td className="px-3 py-2 text-zinc-700">{r.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ToolShell>
  );
}
