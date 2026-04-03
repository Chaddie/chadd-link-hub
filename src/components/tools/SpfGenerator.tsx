"use client";

import { useMemo, useState } from "react";
import { ToolShell } from "./ToolShell";

function splitLines(s: string) {
  return s
    .split(/[\n,]+/)
    .map((x) => x.trim())
    .filter(Boolean);
}

export function SpfGenerator() {
  const [ip4, setIp4] = useState("192.0.2.1\n192.0.2.2");
  const [ip6, setIp6] = useState("");
  const [includes, setIncludes] = useState("_spf.example.com");
  const [useA, setUseA] = useState(false);
  const [useMx, setUseMx] = useState(false);
  const [allPolicy, setAllPolicy] = useState<"~all" | "-all" | "?all" | "+all">(
    "~all"
  );

  const record = useMemo(() => {
    const parts: string[] = ["v=spf1"];
    for (const ip of splitLines(ip4)) {
      if (ip) parts.push(`ip4:${ip}`);
    }
    for (const ip of splitLines(ip6)) {
      if (ip) parts.push(`ip6:${ip}`);
    }
    for (const h of splitLines(includes)) {
      parts.push(`include:${h.replace(/^include:/i, "")}`);
    }
    if (useA) parts.push("a");
    if (useMx) parts.push("mx");
    parts.push(allPolicy);
    return parts.join(" ");
  }, [ip4, ip6, includes, useA, useMx, allPolicy]);

  const field =
    "w-full rounded-xl border border-border bg-card/80 px-3 py-2 text-sm outline-none focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--accent)]/25 dark:bg-white/10";

  return (
    <ToolShell
      title="SPF record generator"
      description="Build a v=spf1 TXT line from IP addresses, includes, and policy. Validate in your DNS provider before publishing."
    >
      <div className="space-y-6">
        <div>
          <label className="mb-1 block text-sm font-medium">IPv4 addresses</label>
          <textarea
            className={`${field} min-h-[88px] font-mono`}
            value={ip4}
            onChange={(e) => setIp4(e.target.value)}
            placeholder="One per line or comma-separated"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">IPv6 addresses</label>
          <textarea
            className={`${field} min-h-[72px] font-mono`}
            value={ip6}
            onChange={(e) => setIp6(e.target.value)}
            placeholder="Optional"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Include domains</label>
          <textarea
            className={`${field} min-h-[72px] font-mono`}
            value={includes}
            onChange={(e) => setIncludes(e.target.value)}
            placeholder="e.g. _spf.google.com"
          />
        </div>
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={useA}
              onChange={(e) => setUseA(e.target.checked)}
              className="rounded border-border accent-[color:var(--accent)]"
            />
            Allow domain A record (<code className="text-xs">a</code>)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={useMx}
              onChange={(e) => setUseMx(e.target.checked)}
              className="rounded border-border accent-[color:var(--accent)]"
            />
            Allow MX (<code className="text-xs">mx</code>)
          </label>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Default for all other senders</label>
          <select
            className={field}
            value={allPolicy}
            onChange={(e) =>
              setAllPolicy(e.target.value as typeof allPolicy)
            }
          >
            <option value="~all">Soft fail (~all) — common</option>
            <option value="-all">Hard fail (-all) — strict</option>
            <option value="?all">Neutral (?all)</option>
            <option value="+all">Pass (+all) — not recommended</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">TXT record value</label>
          <pre className="whitespace-pre-wrap break-all rounded-xl border border-border bg-black/[0.04] p-4 font-mono text-[13px] leading-relaxed dark:bg-white/[0.06]">
            {record}
          </pre>
          <button
            type="button"
            className="mt-3 rounded-xl bg-[color:var(--accent)] px-4 py-2 text-sm font-medium text-white transition hover:opacity-95"
            onClick={() => navigator.clipboard.writeText(record)}
          >
            Copy to clipboard
          </button>
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">
          SPF has a DNS lookup limit (typically 10 includes). Test with your mail flow
          after publishing.
        </p>
      </div>
    </ToolShell>
  );
}
