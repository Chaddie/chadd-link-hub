"use client";

import { useAppTheme } from "@/components/AppThemeProvider";
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
  const { resolvedTheme } = useAppTheme();
  const dark = resolvedTheme === "dark";
  const grid = dark ? "#3f3f46" : "#e4e4e7";
  const tick = dark ? "#a1a1aa" : "#52525b";
  const bar = dark ? "#818cf8" : "#4f46e5";
  const tooltipBg = dark ? "#18181b" : "#ffffff";
  const tooltipBorder = dark ? "#3f3f46" : "#e4e4e7";

  if (data.length === 0) {
    return <p className="text-sm text-muted-foreground">No clicks in this range yet.</p>;
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={grid} />
          <XAxis dataKey="date" tick={{ fontSize: 12, fill: tick }} stroke={grid} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: tick }} width={32} stroke={grid} />
          <Tooltip
            contentStyle={{
              borderRadius: 8,
              border: `1px solid ${tooltipBorder}`,
              fontSize: 12,
              background: tooltipBg,
              color: dark ? "#f4f4f5" : "#18181b",
            }}
          />
          <Bar dataKey="count" fill={bar} radius={[4, 4, 0, 0]} name="Clicks" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
