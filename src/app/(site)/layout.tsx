import { SpaceCanvas } from "@/components/SpaceCanvas";
import { SiteNav } from "@/components/SiteNav";
import { ensureSiteLinkHubData } from "@/lib/ensure-site-links";
import { isDatabaseAvailable } from "@/lib/prisma";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (isDatabaseAvailable()) {
    await ensureSiteLinkHubData();
  }

  return (
    <SpaceCanvas>
      <SiteNav />
      {children}
    </SpaceCanvas>
  );
}
