"use client";

import { useMemo, useState } from "react";
import { computeSubnet, parseCidrInput } from "@/lib/subnet";
import { ToolShell } from "./ToolShell";

export function SubnetCalculator() {
  const [value, setValue] = useState("192.168.1.0/24");
  const parsed = useMemo(() => parseCidrInput(value), [value]);
  const info = useMemo(() => {
    if (!parsed) return null;
    return computeSubnet(parsed.ip, parsed.cidr);
  }, [parsed]);

  return (
    <ToolShell
      title="Subnet calculator"
      description="Enter an IPv4 address in CIDR notation (e.g. 10.0.0.0/16)."
    >
      <label className="block text-sm font-medium text-muted-foreground">
        IPv4 / CIDR
      </label>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="tool-input mt-1 max-w-md"
        placeholder="192.168.0.0/24"
        spellCheck={false}
      />
      {!parsed ? (
        <p className="mt-4 text-sm text-amber-700 dark:text-amber-200/90">
          Enter a value like 203.0.113.10/28
        </p>
      ) : info?.error ? (
        <p className="mt-4 text-sm text-red-600 dark:text-red-400">{info.error}</p>
      ) : info ? (
        <dl className="tool-panel mt-6 sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Network</dt>
            <dd className="font-mono text-foreground">{info.network}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Broadcast</dt>
            <dd className="font-mono text-foreground">{info.broadcast}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Netmask</dt>
            <dd className="font-mono text-foreground">{info.netmask}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Wildcard</dt>
            <dd className="font-mono text-foreground">{info.wildcard}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">First host</dt>
            <dd className="font-mono text-foreground">{info.firstHost}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Last host</dt>
            <dd className="font-mono text-foreground">{info.lastHost}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-muted-foreground">Usable hosts</dt>
            <dd className="font-mono text-foreground">{info.hostCount.toString()}</dd>
          </div>
        </dl>
      ) : null}
    </ToolShell>
  );
}
