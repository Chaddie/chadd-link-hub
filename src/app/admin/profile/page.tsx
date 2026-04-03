import { getPrisma } from "@/lib/prisma";
import { updateSiteProfile } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminProfilePage() {
  const prisma = getPrisma();
  const profile = await prisma.siteProfile.findUnique({
    where: { id: "site" },
  });

  if (!profile) {
    return (
      <p className="text-sm text-muted-foreground">
        Run{" "}
        <code className="rounded bg-black/[0.06] px-1 font-mono text-xs dark:bg-white/10">
          npm run db:seed
        </code>{" "}
        to create the site profile.
      </p>
    );
  }

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-foreground">Site profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Text and image shown at the top of the public page.
        </p>
      </div>

      <form action={updateSiteProfile} className="admin-card space-y-4">
        <div>
          <label htmlFor="displayName" className="admin-label">
            Display name
          </label>
          <input
            id="displayName"
            name="displayName"
            required
            defaultValue={profile.displayName}
            className="admin-input"
          />
        </div>
        <div>
          <label htmlFor="tagline" className="admin-label">
            Tagline
          </label>
          <input
            id="tagline"
            name="tagline"
            defaultValue={profile.tagline ?? ""}
            className="admin-input"
          />
        </div>
        <div>
          <label htmlFor="avatarUrl" className="admin-label">
            Avatar URL
          </label>
          <input
            id="avatarUrl"
            name="avatarUrl"
            type="url"
            placeholder="https://…"
            defaultValue={profile.avatarUrl ?? ""}
            className="admin-input"
          />
          <p className="mt-1 text-xs text-muted-foreground">Optional. HTTPS image URL.</p>
        </div>
        <button type="submit" className="admin-btn-primary">
          Save
        </button>
      </form>
    </div>
  );
}
