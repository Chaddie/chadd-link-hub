"use client";

import { useMemo, useState } from "react";
import { ToolShell } from "./ToolShell";

export function RegexTester() {
  const [pattern, setPattern] = useState("\\w+");
  const [flags, setFlags] = useState("g");
  const [subject, setSubject] = useState("hello regex world");
  const [replace, setReplace] = useState("$&!");

  const { parsed, parseErr } = useMemo(() => {
    try {
      const f = flags.replace(/[^gimsuvy]/g, "");
      return {
        parsed: new RegExp(pattern, f),
        parseErr: null as string | null,
      };
    } catch (e) {
      return {
        parsed: null as RegExp | null,
        parseErr: e instanceof Error ? e.message : "Invalid pattern",
      };
    }
  }, [pattern, flags]);

  const matches = useMemo(() => {
    if (!parsed || !subject) return [];
    const out: Array<{
      i: number;
      match: string;
      index: number;
      groups?: Record<string, string>;
    }> = [];
    try {
      if (parsed.global) {
        let m: RegExpExecArray | null;
        const re = new RegExp(parsed.source, parsed.flags);
        let i = 0;
        while ((m = re.exec(subject)) !== null) {
          out.push({
            i: ++i,
            match: m[0],
            index: m.index,
            groups: m.groups,
          });
          if (m[0].length === 0) re.lastIndex++;
        }
      } else {
        const m = parsed.exec(subject);
        if (m) {
          out.push({
            i: 1,
            match: m[0],
            index: m.index,
            groups: m.groups,
          });
        }
      }
    } catch {
      /* ignore */
    }
    return out;
  }, [parsed, subject]);

  const replaced = useMemo(() => {
    if (!parsed || !subject) return "";
    try {
      return subject.replace(parsed, replace);
    } catch {
      return "(replace error)";
    }
  }, [parsed, subject, replace]);

  const field =
    "w-full rounded-xl border border-border bg-card/80 px-3 py-2 font-mono text-sm outline-none focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--accent)]/25 dark:bg-white/10";

  return (
    <ToolShell
      title="Regex tester"
      description="JavaScript RegExp only — pattern, flags, and test string. See match list and optional replacement preview (not a full regex101.com engine)."
    >
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Pattern</label>
            <input
              className={field}
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              spellCheck={false}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Flags</label>
            <input
              className={field}
              value={flags}
              onChange={(e) => setFlags(e.target.value)}
              placeholder="g i m s u v y"
              spellCheck={false}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Allowed: g i m s u v y (invalid chars ignored)
            </p>
          </div>
        </div>

        {parseErr ? (
          <p className="text-sm text-red-600 dark:text-red-400">{parseErr}</p>
        ) : null}

        <div>
          <label className="mb-1 block text-sm font-medium">Test string</label>
          <textarea
            className={`${field} min-h-[120px]`}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Replacement (JavaScript <code>$&</code>, <code>$1</code>, …)
          </label>
          <input
            className={field}
            value={replace}
            onChange={(e) => setReplace(e.target.value)}
            spellCheck={false}
          />
          <p className="mt-2 rounded-lg border border-border/60 bg-black/[0.03] p-3 font-mono text-xs dark:bg-white/[0.04]">
            {replaced}
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-sm font-semibold">Matches</h2>
          {matches.length === 0 ? (
            <p className="text-sm text-muted-foreground">No matches.</p>
          ) : (
            <ul className="max-h-[240px] space-y-2 overflow-auto rounded-xl border border-border p-3 text-sm">
              {matches.map((m) => (
                <li key={`${m.i}-${m.index}`} className="font-mono text-xs">
                  <span className="text-muted-foreground">#{m.i} @ {m.index}:</span>{" "}
                  <span className="break-all text-foreground">{JSON.stringify(m.match)}</span>
                  {m.groups && Object.keys(m.groups).length > 0 ? (
                    <pre className="mt-1 text-[11px] text-muted-foreground">
                      {JSON.stringify(m.groups, null, 2)}
                    </pre>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </ToolShell>
  );
}
