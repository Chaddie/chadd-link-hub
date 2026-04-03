"use client";

import { useMemo, useState } from "react";
import { extension, lookup } from "mime-types";
import { ToolShell } from "./ToolShell";

export function MimeConverter() {
  const [extIn, setExtIn] = useState("png");
  const [mimeIn, setMimeIn] = useState("image/png");

  const mimeFromExt = useMemo(() => {
    const e = extIn.trim().replace(/^\./, "");
    if (!e) return "";
    const m = lookup(`file.${e}`);
    return m || "";
  }, [extIn]);

  const extFromMime = useMemo(() => {
    const m = mimeIn.trim().toLowerCase();
    if (!m) return "";
    const e = extension(m);
    return typeof e === "string" && e ? `.${e}` : "";
  }, [mimeIn]);

  const field =
    "w-full rounded-xl border border-border bg-card/80 px-3 py-2 font-mono text-sm outline-none focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--accent)]/25 dark:bg-white/10";

  return (
    <ToolShell
      title="MIME type converter"
      description="Map file extensions to MIME types and back using the same database Node uses (mime-types)."
    >
      <div className="space-y-8">
        <div>
          <label className="mb-1 block text-sm font-medium">
            Extension → MIME (e.g. png, .jpg)
          </label>
          <input
            className={field}
            value={extIn}
            onChange={(e) => setExtIn(e.target.value)}
          />
          <p className="mt-3 rounded-lg border border-border bg-black/[0.04] p-3 font-mono text-sm dark:bg-white/[0.06]">
            {mimeFromExt || (
              <span className="text-muted-foreground">Unknown extension</span>
            )}
          </p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            MIME type → extension
          </label>
          <input
            className={field}
            value={mimeIn}
            onChange={(e) => setMimeIn(e.target.value)}
            placeholder="image/svg+xml"
          />
          <p className="mt-3 rounded-lg border border-border bg-black/[0.04] p-3 font-mono text-sm dark:bg-white/[0.06]">
            {extFromMime || (
              <span className="text-muted-foreground">Unknown or no single extension</span>
            )}
          </p>
        </div>

        <p className="text-xs text-muted-foreground">
          Some MIME types map to multiple extensions; this tool returns the canonical
          one from the library.
        </p>
      </div>
    </ToolShell>
  );
}
