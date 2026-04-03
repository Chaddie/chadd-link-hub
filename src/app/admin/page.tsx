import { format, subDays, startOfDay } from "date-fns";
import { getPrisma } from "@/lib/prisma";
import { ClicksChart } from "./ClicksChart";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const prisma = getPrisma();

  const [totalClicks, byLink, recentClicks] = await Promise.all([
    prisma.linkClick.count(),
    prisma.linkClick.groupBy({
      by: ["linkId"],
      _count: { _all: true },
      orderBy: { _count: { linkId: "desc" } },
      take: 20,
    }),
    prisma.linkClick.findMany({
      where: {
        createdAt: { gte: startOfDay(subDays(new Date(), 6)) },
      },
      select: { createdAt: true },
    }),
  ]);

  const linkIds = byLink.map((b) => b.linkId);
  const links = await prisma.link.findMany({
    where: { id: { in: linkIds } },
    select: { id: true, label: true },
  });
  const labelById = Object.fromEntries(links.map((l) => [l.id, l.label]));

  const dayKeys: string[] = [];
  for (let i = 6; i >= 0; i--) {
    dayKeys.push(format(startOfDay(subDays(new Date(), i)), "yyyy-MM-dd"));
  }

  const countsByDay = new Map<string, number>();
  for (const k of dayKeys) countsByDay.set(k, 0);
  for (const c of recentClicks) {
    const k = format(c.createdAt, "yyyy-MM-dd");
    if (countsByDay.has(k)) {
      countsByDay.set(k, (countsByDay.get(k) ?? 0) + 1);
    }
  }

  const chartData = dayKeys.map((date) => ({
    date: format(new Date(date + "T12:00:00"), "MMM d"),
    count: countsByDay.get(date) ?? 0,
  }));

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-2xl font-semibold text-foreground">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Click analytics for your link hub.
        </p>
      </div>

      <section className="admin-card">
        <h2 className="text-lg font-medium text-foreground">Total clicks</h2>
        <p className="mt-2 text-4xl font-semibold tabular-nums text-foreground">
          {totalClicks}
        </p>
      </section>

      <section className="admin-card">
        <h2 className="mb-4 text-lg font-medium text-foreground">Last 7 days</h2>
        <ClicksChart data={chartData} />
      </section>

      <section className="admin-card">
        <h2 className="mb-4 text-lg font-medium text-foreground">Top links</h2>
        {byLink.length === 0 ? (
          <p className="text-sm text-muted-foreground">No clicks recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="pb-2 pr-4 font-medium">Link</th>
                  <th className="pb-2 font-medium">Clicks</th>
                </tr>
              </thead>
              <tbody>
                {byLink.map((row) => (
                  <tr key={row.linkId} className="border-b border-border/60">
                    <td className="py-2 pr-4 text-foreground">
                      {labelById[row.linkId] ?? row.linkId}
                    </td>
                    <td className="py-2 tabular-nums text-foreground">{row._count._all}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
