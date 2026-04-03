"use client";

import { useCallback, useMemo, useState } from "react";
import { ToolShell } from "./ToolShell";

const LOWER = "abcdefghijklmnopqrstuvwxyz";
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DIGITS = "0123456789";
const SYMBOLS = "!@#$%^&*()-_=+[]{};:,.?/";

function randomInt(max: number) {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0]! % max;
}

function pickFrom(alphabet: string, count: number) {
  let out = "";
  for (let i = 0; i < count; i++) {
    out += alphabet[randomInt(alphabet.length)]!;
  }
  return out;
}

const check =
  "rounded border border-border bg-card/80 text-foreground accent-[color:var(--accent)] dark:bg-white/10";

export function PasswordGenerator() {
  const [length, setLength] = useState(20);
  const [lower, setLower] = useState(true);
  const [upper, setUpper] = useState(true);
  const [digits, setDigits] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [pwd, setPwd] = useState("");

  const alphabet = useMemo(() => {
    let a = "";
    if (lower) a += LOWER;
    if (upper) a += UPPER;
    if (digits) a += DIGITS;
    if (symbols) a += SYMBOLS;
    return a;
  }, [lower, upper, digits, symbols]);

  const generate = useCallback(() => {
    if (!alphabet.length) {
      setPwd("");
      return;
    }
    setPwd(pickFrom(alphabet, Math.min(128, Math.max(4, length))));
  }, [alphabet, length]);

  const copy = async () => {
    if (!pwd) return;
    await navigator.clipboard.writeText(pwd);
  };

  return (
    <ToolShell
      title="Password generator"
      description="Uses the browser crypto API (CSPRNG). Length is capped at 128."
    >
      <div
        className="mt-0 space-y-4 rounded-2xl border p-5 backdrop-blur-sm"
        style={{
          borderColor: "var(--tool-panel-border)",
          background: "var(--tool-panel-bg)",
        }}
      >
        <div>
          <label className="text-sm font-medium text-muted-foreground">Length</label>
          <input
            type="number"
            min={4}
            max={128}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="tool-input mt-1 w-28 max-w-none font-sans tabular-nums"
          />
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-foreground/90">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={lower}
              onChange={(e) => setLower(e.target.checked)}
              className={check}
            />
            Lowercase
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={upper}
              onChange={(e) => setUpper(e.target.checked)}
              className={check}
            />
            Uppercase
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={digits}
              onChange={(e) => setDigits(e.target.checked)}
              className={check}
            />
            Digits
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={symbols}
              onChange={(e) => setSymbols(e.target.checked)}
              className={check}
            />
            Symbols
          </label>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={generate} className="tool-btn-primary">
            Generate
          </button>
          <button type="button" onClick={copy} disabled={!pwd} className="tool-btn-secondary">
            Copy
          </button>
        </div>
        {pwd ? (
          <pre className="tool-pre whitespace-pre-wrap break-all text-sm">{pwd}</pre>
        ) : (
          <p className="text-sm text-muted-foreground">Choose character sets and click Generate.</p>
        )}
      </div>
    </ToolShell>
  );
}
