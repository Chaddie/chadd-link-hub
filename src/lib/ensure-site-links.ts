import { getPrisma, isDatabaseAvailable } from "@/lib/prisma";

const FITNESS_TRACKER = {
  label: "Fitness Tracker",
  url: "https://tracker.chadd.ie",
  description: "Training and workout tracking app.",
} as const;

function normalizeUrl(u: string) {
  return u.trim().replace(/\/+$/, "").toLowerCase();
}

/**
 * Idempotent fixes: removes legacy "Personal Blogs" sections and ensures exactly one
 * Fitness Tracker link under Projects. Safe to call when the DB is available.
 */
export async function ensureSiteLinkHubData(): Promise<void> {
  if (!isDatabaseAvailable()) return;

  try {
    const prisma = getPrisma();
    const targetUrl = normalizeUrl(FITNESS_TRACKER.url);

    const legacySections = await prisma.linkSection.findMany({
      where: {
        OR: [
          { title: { equals: "Personal Blogs", mode: "insensitive" } },
          { title: { equals: "Personal Blog", mode: "insensitive" } },
        ],
      },
    });

    for (const sec of legacySections) {
      await prisma.link.deleteMany({ where: { sectionId: sec.id } });
      await prisma.linkSection.delete({ where: { id: sec.id } });
    }

    const projects = await prisma.linkSection.findFirst({
      where: { title: { equals: "Projects", mode: "insensitive" } },
    });

    if (!projects) return;

    const projectLinks = await prisma.link.findMany({
      where: { sectionId: projects.id },
      orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    });

    const isFitnessRow = (l: { url: string; label: string }) =>
      normalizeUrl(l.url) === targetUrl ||
      l.label.trim().toLowerCase() === FITNESS_TRACKER.label.toLowerCase();

    const fitnessRows = projectLinks.filter(isFitnessRow);

    if (fitnessRows.length === 0) {
      const agg = await prisma.link.aggregate({
        where: { sectionId: projects.id },
        _max: { sortOrder: true },
      });
      await prisma.link.create({
        data: {
          sectionId: projects.id,
          label: FITNESS_TRACKER.label,
          url: FITNESS_TRACKER.url,
          description: FITNESS_TRACKER.description,
          sortOrder: (agg._max.sortOrder ?? -1) + 1,
        },
      });
      return;
    }

    const [keep, ...remove] = fitnessRows;
    for (const row of remove) {
      await prisma.link.delete({ where: { id: row.id } });
    }

    await prisma.link.update({
      where: { id: keep.id },
      data: {
        label: FITNESS_TRACKER.label,
        url: FITNESS_TRACKER.url,
        description: FITNESS_TRACKER.description,
      },
    });
  } catch (e) {
    console.error("[ensureSiteLinkHubData]", e);
  }
}
