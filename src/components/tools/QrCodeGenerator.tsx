"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { ToolShell } from "./ToolShell";

export function QrCodeGenerator() {
  const [text, setText] = useState("https://example.com");
  const [ecc, setEcc] = useState<"L" | "M" | "Q" | "H">("M");
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!text.trim()) {
      void Promise.resolve().then(() => {
        if (!cancelled) {
          setDataUrl(null);
          setError(null);
        }
      });
      return () => {
        cancelled = true;
      };
    }
    QRCode.toDataURL(text, {
      errorCorrectionLevel: ecc,
      width: 280,
      margin: 2,
      color: { dark: "#0c1222", light: "#ffffff" },
    })
      .then((url) => {
        if (!cancelled) {
          setError(null);
          setDataUrl(url);
        }
      })
      .catch((e: Error) => {
        if (!cancelled) {
          setDataUrl(null);
          setError(e.message || "Could not generate QR");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [text, ecc]);

  const field =
    "w-full rounded-xl border border-border bg-card/80 px-3 py-2 text-sm outline-none focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--accent)]/25 dark:bg-white/10";

  return (
    <ToolShell
      title="QR code generator"
      description="Encode text or a URL as a QR image. Download PNG from your browser."
    >
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Content</label>
          <textarea
            className={`${field} min-h-[100px] font-mono text-xs`}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Error correction</label>
          <select
            className={field}
            value={ecc}
            onChange={(e) => setEcc(e.target.value as typeof ecc)}
          >
            <option value="L">Low (L)</option>
            <option value="M">Medium (M)</option>
            <option value="Q">Quartile (Q)</option>
            <option value="H">High (H)</option>
          </select>
        </div>

        {error ? (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        ) : null}

        {dataUrl ? (
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={dataUrl} alt="QR preview" className="rounded-lg border border-border bg-white p-2" />
            <a
              href={dataUrl}
              download="qrcode.png"
              className="inline-flex rounded-xl bg-[color:var(--accent)] px-4 py-2 text-sm font-medium text-white"
            >
              Download PNG
            </a>
          </div>
        ) : null}
      </div>
    </ToolShell>
  );
}
