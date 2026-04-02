"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type DailyRow = { date: string; count: number };

export function ClicksChart({ data }: { data: DailyRow[] }) {
  if (data.length === 0) {
    return (
      <p className="text-sm text-zinc-500">No clicks in this range yet.</p>
    );
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            className="text-zinc-600"
          />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} width={32} />
          <Tooltip
            contentStyle={{
              borderRadius: 8,
              border: "1px solid #e4e4e7",
              fontSize: 12,
            }}
          />
          <Bar dataKey="count" fill="#3f3f46" radius={[4, 4, 0, 0]} name="Clicks" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
