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
      <div className="space-y-4 rounded-xl border border-zinc-200 bg-white p-4">
        <div>
          <label className="text-sm font-medium text-zinc-800">Length</label>
          <input
            type="number"
            min={4}
            max={128}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="mt-1 w-28 rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={lower} onChange={(e) => setLower(e.target.checked)} />
            Lowercase
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={upper} onChange={(e) => setUpper(e.target.checked)} />
            Uppercase
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={digits} onChange={(e) => setDigits(e.target.checked)} />
            Digits
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={symbols} onChange={(e) => setSymbols(e.target.checked)} />
            Symbols
          </label>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={generate}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Generate
          </button>
          <button
            type="button"
            onClick={copy}
            disabled={!pwd}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm disabled:opacity-50"
          >
            Copy
          </button>
        </div>
        {pwd ? (
          <pre className="overflow-x-auto whitespace-pre-wrap break-all rounded-lg bg-zinc-50 p-3 font-mono text-sm text-zinc-900">
            {pwd}
          </pre>
        ) : (
          <p className="text-sm text-zinc-500">Choose character sets and click Generate.</p>
        )}
      </div>
    </ToolShell>
  );
}
