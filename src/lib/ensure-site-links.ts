import type { Prisma } from "@prisma/client";
import { getPrisma, isDatabaseAvailable } from "@/lib/prisma";

const FITNESS_TRACKER = {
  label: "Fitness Tracker",
  url: "https://tracker.chadd.ie",
  description: "Training and workout tracking app.",
} as const;

const STUDY_GUIDE = {
  label: "Study Guide",
  url: "https://study-guide-pearl.vercel.app/dashboard",
  description: "Grok-powered learning dashboard.",
} as const;

const SIMMER_EATS = {
  label: "SIMMER EATS",
  url: "https://www.simmereats.com/r/NATHAN-KTH",
  description: "get 30% off if you want to give it a go!",
} as const;

const THREE_MOBILE = {
  label: "Three (mobile)",
  url: "https://aklam.io/2StGK2PA",
  description: "Get up to £40 in cash!",
} as const;

type LinkRow = {
  id: string;
  url: string;
  label: string;
  sortOrder: number;
};

type CanonicalLink = {
  label: string;
  url: string;
  description: string;
};

function normalizeUrl(u: string) {
  return u.trim().replace(/\/+$/, "").toLowerCase();
}

/** Matches any Simmer EATS referral row (canonical URL, label, or simmereats.com referral links). */
function isSimmerCandidate(l: { url: string; label: string }) {
  const u = l.url.trim().toLowerCase();
  const lab = l.label.trim().toLowerCase();
  if (lab === "simmer eats") return true;
  if (normalizeUrl(l.url) === normalizeUrl(SIMMER_EATS.url)) return true;
  if (!u.includes("simmereats.com")) return false;
  return u.includes("nathan-kth");
}

/** Matches Three (mobile) / aklam.io referral rows. */
function isThreeCandidate(l: { url: string; label: string }) {
  const u = l.url.trim().toLowerCase();
  const lab = l.label.trim().toLowerCase();
  if (lab === "three (mobile)") return true;
  if (normalizeUrl(l.url) === normalizeUrl(THREE_MOBILE.url)) return true;
  if (!u.includes("aklam.io")) return false;
  return u.includes("2stgk2pa");
}

/** Matches Study Guide project rows (canonical URL, label, or study-guide-pearl host). */
function isStudyGuideCandidate(l: { url: string; label: string }) {
  const u = l.url.trim().toLowerCase();
  const lab = l.label.trim().toLowerCase();
  if (lab === "study guide") return true;
  if (normalizeUrl(l.url) === normalizeUrl(STUDY_GUIDE.url)) return true;
  return u.includes("study-guide-pearl.vercel.app");
}

async function mergeCanonicalReferral(
  tx: Prisma.TransactionClient,
  sectionId: string,
  links: LinkRow[],
  isCandidate: (l: { url: string; label: string }) => boolean,
  canonical: CanonicalLink
) {
  const rows = links.filter(isCandidate);

  if (rows.length === 0) {
    const agg = await tx.link.aggregate({
      where: { sectionId },
      _max: { sortOrder: true },
    });
    await tx.link.create({
      data: {
        sectionId,
        label: canonical.label,
        url: canonical.url,
        description: canonical.description,
        sortOrder: (agg._max.sortOrder ?? -1) + 1,
      },
    });
    return;
  }

  const sorted = [...rows].sort(
    (a, b) => a.sortOrder - b.sortOrder || a.id.localeCompare(b.id)
  );
  const keep = sorted[0]!;
  for (const row of sorted.slice(1)) {
    await tx.link.delete({ where: { id: row.id } });
  }

  await tx.link.update({
    where: { id: keep.id },
    data: {
      label: canonical.label,
      url: canonical.url,
      description: canonical.description,
    },
  });
}

/**
 * Idempotent fixes: removes legacy "Personal Blogs" sections, ensures canonical
 * Fitness Tracker and Study Guide links under Projects, and canonical referral rows under Referrals.
 * Safe to call when the DB is available.
 */
export async function ensureSiteLinkHubData(): Promise<void> {
  if (!isDatabaseAvailable()) return;

  try {
    const prisma = getPrisma();
    const fitnessUrl = normalizeUrl(FITNESS_TRACKER.url);

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

    const referrals = await prisma.linkSection.findFirst({
      where: { title: { equals: "Referrals", mode: "insensitive" } },
    });

    if (projects) {
      const projectLinks = await prisma.link.findMany({
        where: { sectionId: projects.id },
        orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
      });

      const isFitnessRow = (l: { url: string; label: string }) =>
        normalizeUrl(l.url) === fitnessUrl ||
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
      } else {
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
      }

      const projectLinksForStudy = await prisma.link.findMany({
        where: { sectionId: projects.id },
        orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
      });

      await mergeCanonicalReferral(
        prisma,
        projects.id,
        projectLinksForStudy,
        isStudyGuideCandidate,
        STUDY_GUIDE
      );
    }

    if (referrals) {
      await prisma.$transaction(async (tx) => {
        let referralLinks = await tx.link.findMany({
          where: { sectionId: referrals.id },
          orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
        });

        await mergeCanonicalReferral(
          tx,
          referrals.id,
          referralLinks,
          isSimmerCandidate,
          SIMMER_EATS
        );

        referralLinks = await tx.link.findMany({
          where: { sectionId: referrals.id },
          orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
        });

        await mergeCanonicalReferral(
          tx,
          referrals.id,
          referralLinks,
          isThreeCandidate,
          THREE_MOBILE
        );
      });
    }
  } catch (e) {
    console.error("[ensureSiteLinkHubData]", e);
  }
}
