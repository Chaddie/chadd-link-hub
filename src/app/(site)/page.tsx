import { MissingDatabase } from "@/components/MissingDatabase";
import { PublicHome } from "@/components/PublicHome";
import { getPrisma, isDatabaseAvailable } from "@/lib/prisma";
import { getSiteOrigin } from "@/lib/site-url";

export const dynamic = "force-dynamic";

export default async function Home() {
  if (!isDatabaseAvailable()) {
    return <MissingDatabase />;
  }

  const prisma = getPrisma();

  const profile = await prisma.siteProfile.findUnique({ where: { id: "site" } });
  if (!profile) {
    return <MissingDatabase />;
  }

  const topLinks = await prisma.link.findMany({
    where: { sectionId: null, isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  const sections = await prisma.linkSection.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      links: {
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  const origin = await getSiteOrigin();
  const shareUrl = `${origin}/`;

  return (
    <PublicHome
      profile={profile}
      topLinks={topLinks}
      sections={sections}
      shareUrl={shareUrl}
    />
  );
}
