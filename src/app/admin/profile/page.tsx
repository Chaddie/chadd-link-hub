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
      <p className="text-sm text-zinc-600">
        Run <code className="rounded bg-zinc-200 px-1">npm run db:seed</code> to create the site profile.
      </p>
    );
  }

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">Site profile</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Text and image shown at the top of the public page.
        </p>
      </div>

      <form action={updateSiteProfile} className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div>
          <label htmlFor="displayName" className="block text-sm font-medium text-zinc-800">
            Display name
          </label>
          <input
            id="displayName"
            name="displayName"
            required
            defaultValue={profile.displayName}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
          />
        </div>
        <div>
          <label htmlFor="tagline" className="block text-sm font-medium text-zinc-800">
            Tagline
          </label>
          <input
            id="tagline"
            name="tagline"
            defaultValue={profile.tagline ?? ""}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
          />
        </div>
        <div>
          <label htmlFor="avatarUrl" className="block text-sm font-medium text-zinc-800">
            Avatar URL
          </label>
          <input
            id="avatarUrl"
            name="avatarUrl"
            type="url"
            placeholder="https://…"
            defaultValue={profile.avatarUrl ?? ""}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
          />
          <p className="mt-1 text-xs text-zinc-500">Optional. HTTPS image URL.</p>
        </div>
        <button
          type="submit"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Save
        </button>
      </form>
    </div>
  );
}
