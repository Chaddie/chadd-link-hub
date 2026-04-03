"use client";

import { useState } from "react";
import yaml from "js-yaml";
import { ToolShell } from "./ToolShell";

export function YamlJsonConverter() {
  const [direction, setDirection] = useState<"y2j" | "j2y">("y2j");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const convert = () => {
    setError(null);
    try {
      if (direction === "y2j") {
        const doc = yaml.load(input) as unknown;
        setOutput(JSON.stringify(doc, null, 2));
      } else {
        const parsed = JSON.parse(input);
        setOutput(yaml.dump(parsed, { lineWidth: -1 }));
      }
    } catch (e) {
      setOutput("");
      setError(e instanceof Error ? e.message : "Parse error");
    }
  };

  const field =
    "w-full rounded-xl border border-border bg-card/80 px-3 py-2 font-mono text-xs outline-none focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--accent)]/25 dark:bg-white/10";

  return (
    <ToolShell
      title="YAML ↔ JSON converter"
      description="Convert between YAML and JSON. Large documents are processed in your browser only."
    >
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
              direction === "y2j"
                ? "bg-[color:var(--accent-muted)] text-[color:var(--accent)]"
                : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/10"
            }`}
            onClick={() => setDirection("y2j")}
          >
            YAML → JSON
          </button>
          <button
            type="button"
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
              direction === "j2y"
                ? "bg-[color:var(--accent-muted)] text-[color:var(--accent)]"
                : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/10"
            }`}
            onClick={() => setDirection("j2y")}
          >
            JSON → YAML
          </button>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            {direction === "y2j" ? "YAML input" : "JSON input"}
          </label>
          <textarea
            className={`${field} min-h-[220px]`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              direction === "y2j"
                ? "key: value\nlist:\n  - a\n  - b"
                : '{\n  "key": "value"\n}'
            }
          />
        </div>

        <button
          type="button"
          className="rounded-xl bg-[color:var(--accent)] px-4 py-2 text-sm font-medium text-white"
          onClick={convert}
        >
          Convert
        </button>

        {error ? (
          <p className="text-sm text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
        ) : null}

        {output ? (
          <div>
            <div className="mb-1 flex items-center justify-between gap-2">
              <label className="text-sm font-medium">Output</label>
              <button
                type="button"
                className="text-xs font-medium text-accent hover:underline"
                onClick={() => navigator.clipboard.writeText(output)}
              >
                Copy
              </button>
            </div>
            <pre className="max-h-[360px] overflow-auto whitespace-pre-wrap break-all rounded-xl border border-border bg-black/[0.04] p-4 font-mono text-xs leading-relaxed dark:bg-white/[0.06]">
              {output}
            </pre>
          </div>
        ) : null}
      </div>
    </ToolShell>
  );
}
