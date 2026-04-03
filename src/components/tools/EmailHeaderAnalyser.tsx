"use client";

import { useMemo, useState } from "react";
import { parseEmailHeaders, summarizeAuth } from "@/lib/email-headers";
import { ToolShell } from "./ToolShell";

export function EmailHeaderAnalyser() {
  const [raw, setRaw] = useState("");
  const parsed = useMemo(() => {
    if (!raw.trim()) return null;
    return parseEmailHeaders(raw);
  }, [raw]);
  const summary = useMemo(() => (parsed ? summarizeAuth(parsed) : []), [parsed]);

  return (
    <ToolShell
      title="Email header analyser"
      description="Paste raw headers (from top through the first blank line). Parsing is heuristic; verify critical security decisions with your mail team."
    >
      <textarea
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        rows={12}
        className="tool-textarea min-h-[12rem]"
        placeholder={"Return-Path: ...\nReceived: from ...\n..."}
      />
      {!parsed ? (
        <p className="mt-4 text-sm text-muted-foreground">Paste headers to analyse.</p>
      ) : (
        <div className="mt-6 space-y-6">
          <section>
            <h2 className="text-sm font-semibold text-foreground">Auth summary</h2>
            <ul className="mt-2 list-inside list-disc text-sm text-foreground/85">
              {summary.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="text-sm font-semibold text-foreground">Core metadata</h2>
            <dl className="mt-2 space-y-1 text-sm">
              {[
                ["From", parsed.from.join(", ")],
                ["To", parsed.to.join(", ")],
                ["Subject", parsed.subject.join(" ")],
                ["Date", parsed.date.join(" ")],
                ["Message-ID", parsed.messageId.join(" ")],
                ["Return-Path", parsed.returnPath.join(" ")],
                ["Reply-To", parsed.replyTo.join(" ")],
              ].map(([k, v]) =>
                v ? (
                  <div key={k} className="grid gap-1 sm:grid-cols-[100px_1fr]">
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd className="break-all text-foreground/90">{v}</dd>
                  </div>
                ) : null
              )}
            </dl>
          </section>
          <section>
            <h2 className="text-sm font-semibold text-foreground">
              Received (newest first in source)
            </h2>
            <ol className="mt-2 list-decimal space-y-2 pl-5 text-xs text-foreground/80">
              {parsed.received.map((r, i) => (
                <li key={i} className="break-all font-mono">
                  {r}
                </li>
              ))}
            </ol>
          </section>
          <section>
            <h2 className="text-sm font-semibold text-foreground">Authentication-Results</h2>
            <pre className="tool-pre mt-2 whitespace-pre-wrap">
              {parsed.authenticationResults.join("\n\n") || "—"}
            </pre>
          </section>
          <section>
            <h2 className="text-sm font-semibold text-foreground">DKIM-Signature (truncated)</h2>
            <pre className="tool-pre mt-2 max-h-40 overflow-auto text-[10px] leading-relaxed">
              {parsed.dkimSignature
                .map((d) => d.slice(0, 400) + (d.length > 400 ? "…" : ""))
                .join("\n\n") || "—"}
            </pre>
          </section>
        </div>
      )}
    </ToolShell>
  );
}
