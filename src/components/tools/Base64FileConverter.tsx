"use client";

import { useCallback, useState } from "react";
import { ToolShell } from "./ToolShell";

export function Base64FileConverter() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [b64, setB64] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState("download.bin");

  const onFile = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setError(null);
    const buf = await f.arrayBuffer();
    const bytes = new Uint8Array(buf);
    let binary = "";
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]!);
    setB64(btoa(binary));
    setFileName(f.name);
  }, []);

  const downloadDecoded = useCallback(() => {
    setError(null);
    try {
      const bin = atob(b64.replace(/\s/g, ""));
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      const blob = new Blob([bytes]);
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = fileName || "decoded.bin";
      a.click();
      URL.revokeObjectURL(a.href);
    } catch {
      setError("Invalid Base64 — check padding and characters.");
    }
  }, [b64, fileName]);

  const downloadB64Txt = useCallback(() => {
    const blob = new Blob([b64], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${fileName.replace(/\.[^.]+$/, "") || "file"}.b64.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  }, [b64, fileName]);

  const field =
    "w-full rounded-xl border border-border bg-card/80 px-3 py-2 text-sm outline-none focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--accent)]/25 dark:bg-white/10";

  return (
    <ToolShell
      title="Base64 file converter"
      description="Encode a file to Base64 text, or decode Base64 back to a downloadable file. Runs entirely in your browser."
    >
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
              mode === "encode"
                ? "bg-[color:var(--accent-muted)] text-[color:var(--accent)]"
                : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/10"
            }`}
            onClick={() => setMode("encode")}
          >
            File → Base64
          </button>
          <button
            type="button"
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
              mode === "decode"
                ? "bg-[color:var(--accent-muted)] text-[color:var(--accent)]"
                : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/10"
            }`}
            onClick={() => setMode("decode")}
          >
            Base64 → file
          </button>
        </div>

        {mode === "encode" ? (
          <div>
            <label className="mb-1 block text-sm font-medium">Choose file</label>
            <input
              type="file"
              onChange={onFile}
              className="block w-full text-sm file:mr-3 file:rounded-lg file:border file:border-border file:bg-card file:px-3 file:py-1.5"
            />
            <p className="mt-2 text-xs text-muted-foreground">
              Encoded name: {fileName}
            </p>
          </div>
        ) : (
          <div>
            <label className="mb-1 block text-sm font-medium">
              Output filename (decode)
            </label>
            <input
              className={field}
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="decoded.bin"
            />
          </div>
        )}

        <div>
          <label className="mb-1 block text-sm font-medium">Base64</label>
          <textarea
            className={`${field} min-h-[200px] font-mono text-xs`}
            value={b64}
            onChange={(e) => setB64(e.target.value)}
            placeholder={
              mode === "encode"
                ? "Pick a file above, or paste Base64 when decoding"
                : "Paste Base64 here"
            }
          />
        </div>

        {error ? (
          <p className="text-sm text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-2">
          {mode === "encode" && b64 ? (
            <>
              <button
                type="button"
                className="rounded-xl bg-[color:var(--accent)] px-4 py-2 text-sm font-medium text-white"
                onClick={() => navigator.clipboard.writeText(b64)}
              >
                Copy Base64
              </button>
              <button
                type="button"
                className="rounded-xl border border-border px-4 py-2 text-sm font-medium"
                onClick={downloadB64Txt}
              >
                Download as .txt
              </button>
            </>
          ) : null}
          {mode === "decode" && b64.trim() ? (
            <button
              type="button"
              className="rounded-xl bg-[color:var(--accent)] px-4 py-2 text-sm font-medium text-white"
              onClick={downloadDecoded}
            >
              Download decoded file
            </button>
          ) : null}
        </div>
      </div>
    </ToolShell>
  );
}
