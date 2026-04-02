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
      <label className="block text-sm font-medium text-zinc-800">IPv4 / CIDR</label>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="mt-1 w-full max-w-md rounded-lg border border-zinc-300 px-3 py-2 font-mono text-sm"
        placeholder="192.168.0.0/24"
        spellCheck={false}
      />
      {!parsed ? (
        <p className="mt-4 text-sm text-amber-800">Enter a value like 203.0.113.10/28</p>
      ) : info?.error ? (
        <p className="mt-4 text-sm text-red-700">{info.error}</p>
      ) : info ? (
        <dl className="mt-6 grid gap-3 rounded-xl border border-zinc-200 bg-white p-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-zinc-500">Network</dt>
            <dd className="font-mono text-zinc-900">{info.network}</dd>
          </div>
          <div>
            <dt className="text-zinc-500">Broadcast</dt>
            <dd className="font-mono text-zinc-900">{info.broadcast}</dd>
          </div>
          <div>
            <dt className="text-zinc-500">Netmask</dt>
            <dd className="font-mono text-zinc-900">{info.netmask}</dd>
          </div>
          <div>
            <dt className="text-zinc-500">Wildcard</dt>
            <dd className="font-mono text-zinc-900">{info.wildcard}</dd>
          </div>
          <div>
            <dt className="text-zinc-500">First host</dt>
            <dd className="font-mono text-zinc-900">{info.firstHost}</dd>
          </div>
          <div>
            <dt className="text-zinc-500">Last host</dt>
            <dd className="font-mono text-zinc-900">{info.lastHost}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-zinc-500">Usable hosts</dt>
            <dd className="font-mono text-zinc-900">{info.hostCount.toString()}</dd>
          </div>
        </dl>
      ) : null}
    </ToolShell>
  );
}
