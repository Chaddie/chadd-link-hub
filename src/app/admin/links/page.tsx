import { ConfirmForm } from "@/components/ConfirmForm";
import { getPrisma } from "@/lib/prisma";
import {
  createLink,
  createSection,
  deleteLink,
  deleteSection,
  moveLink,
  moveSection,
  toggleLinkActive,
  updateLink,
  updateSection,
} from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminLinksPage() {
  const prisma = getPrisma();
  const topLinks = await prisma.link.findMany({
    where: { sectionId: null },
    orderBy: { sortOrder: "asc" },
  });
  const sections = await prisma.linkSection.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      links: { orderBy: { sortOrder: "asc" } },
    },
  });

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">Links</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Manage sections and links. Public URLs use <code className="rounded bg-zinc-200 px-1">/go/…</code>{" "}
          for click tracking.
        </p>
      </div>

      <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-medium text-zinc-900">Top links</h2>
        <p className="mt-1 text-sm text-zinc-600">Shown above all sections.</p>
        <ul className="mt-4 space-y-6">
          {topLinks.map((link, i) => (
            <li
              key={link.id}
              className="border-b border-zinc-100 pb-6 last:border-0 last:pb-0"
            >
              <LinkEditor
                link={link}
                canMoveUp={i > 0}
                canMoveDown={i < topLinks.length - 1}
              />
            </li>
          ))}
        </ul>
        <AddLinkForm sectionId={null} />
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-medium text-zinc-900">New section</h2>
        <form action={createSection} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label htmlFor="new-section-title" className="text-sm font-medium text-zinc-800">
              Title
            </label>
            <input
              id="new-section-title"
              name="title"
              required
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900"
              placeholder="e.g. Personal Blogs"
            />
          </div>
          <div className="flex-[2]">
            <label htmlFor="new-section-intro" className="text-sm font-medium text-zinc-800">
              Intro (optional)
            </label>
            <input
              id="new-section-intro"
              name="intro"
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900"
              placeholder="Paragraph under the heading"
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Add section
          </button>
        </form>
      </section>

      {sections.map((section, si) => (
        <section
          key={section.id}
          className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <form action={updateSection} className="min-w-0 flex-1 space-y-3">
              <input type="hidden" name="id" value={section.id} />
              <div className="flex flex-wrap gap-3">
                <div className="min-w-[200px] flex-1">
                  <label className="text-sm font-medium text-zinc-800">Section title</label>
                  <input
                    name="title"
                    required
                    defaultValue={section.title}
                    className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900"
                  />
                </div>
                <div className="min-w-[240px] flex-[2]">
                  <label className="text-sm font-medium text-zinc-800">Intro</label>
                  <input
                    name="intro"
                    defaultValue={section.intro ?? ""}
                    className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="submit"
                  className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-800 hover:bg-zinc-50"
                >
                  Save section
                </button>
              </div>
            </form>
            <div className="flex flex-wrap gap-2">
              <form action={moveSection}>
                <input type="hidden" name="id" value={section.id} />
                <input type="hidden" name="direction" value="up" />
                <button
                  type="submit"
                  disabled={si === 0}
                  className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm disabled:opacity-40"
                >
                  Up
                </button>
              </form>
              <form action={moveSection}>
                <input type="hidden" name="id" value={section.id} />
                <input type="hidden" name="direction" value="down" />
                <button
                  type="submit"
                  disabled={si === sections.length - 1}
                  className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm disabled:opacity-40"
                >
                  Down
                </button>
              </form>
              <ConfirmForm
                action={deleteSection}
                message="Delete this section and its links?"
              >
                <input type="hidden" name="id" value={section.id} />
                <button
                  type="submit"
                  className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-sm text-red-800 hover:bg-red-100"
                >
                  Delete
                </button>
              </ConfirmForm>
            </div>
          </div>

          <ul className="mt-6 space-y-6 border-t border-zinc-100 pt-6">
            {section.links.map((link, li) => (
              <li key={link.id}>
                <LinkEditor
                  link={link}
                  canMoveUp={li > 0}
                  canMoveDown={li < section.links.length - 1}
                />
              </li>
            ))}
          </ul>
          <div className="mt-6 border-t border-zinc-100 pt-6">
            <AddLinkForm sectionId={section.id} />
          </div>
        </section>
      ))}
    </div>
  );
}

function LinkEditor({
  link,
  canMoveUp,
  canMoveDown,
}: {
  link: {
    id: string;
    label: string;
    url: string;
    description: string | null;
    isActive: boolean;
  };
  canMoveUp: boolean;
  canMoveDown: boolean;
}) {
  return (
    <div className="space-y-3">
      <form action={updateLink} className="grid gap-3 sm:grid-cols-2">
        <input type="hidden" name="id" value={link.id} />
        <div>
          <label className="text-xs font-medium text-zinc-600">Label</label>
          <input
            name="label"
            required
            defaultValue={link.label}
            className="mt-0.5 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-zinc-600">Destination URL</label>
          <input
            name="url"
            required
            type="text"
            defaultValue={link.url}
            className="mt-0.5 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-medium text-zinc-600">Description (optional)</label>
          <input
            name="description"
            defaultValue={link.description ?? ""}
            className="mt-0.5 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900"
          />
        </div>
        <div className="sm:col-span-2">
          <button
            type="submit"
            className="rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Save
          </button>
        </div>
      </form>
      <div className="flex flex-wrap gap-2">
        <form action={moveLink}>
          <input type="hidden" name="id" value={link.id} />
          <input type="hidden" name="direction" value="up" />
          <button
            type="submit"
            disabled={!canMoveUp}
            className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm disabled:opacity-40"
          >
            Move up
          </button>
        </form>
        <form action={moveLink}>
          <input type="hidden" name="id" value={link.id} />
          <input type="hidden" name="direction" value="down" />
          <button
            type="submit"
            disabled={!canMoveDown}
            className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm disabled:opacity-40"
          >
            Move down
          </button>
        </form>
        <form action={toggleLinkActive}>
          <input type="hidden" name="id" value={link.id} />
          <button type="submit" className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm">
            {link.isActive ? "Hide" : "Show"}
          </button>
        </form>
        <ConfirmForm action={deleteLink} message="Delete this link?">
          <input type="hidden" name="id" value={link.id} />
          <button
            type="submit"
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-sm text-red-800"
          >
            Delete
          </button>
        </ConfirmForm>
      </div>
      <p className="text-xs text-zinc-500">
        Tracked URL: <code className="rounded bg-zinc-100 px-1">/go/{link.id}</code>
      </p>
    </div>
  );
}

function AddLinkForm({ sectionId }: { sectionId: string | null }) {
  return (
    <form action={createLink} className="mt-6 space-y-3 rounded-lg border border-dashed border-zinc-300 bg-zinc-50/80 p-4">
      {sectionId ? <input type="hidden" name="sectionId" value={sectionId} /> : null}
      <p className="text-sm font-medium text-zinc-800">Add link</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-xs text-zinc-600">Label</label>
          <input
            name="label"
            required
            className="mt-0.5 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
            placeholder="Visible title"
          />
        </div>
        <div>
          <label className="text-xs text-zinc-600">URL</label>
          <input
            name="url"
            required
            type="text"
            className="mt-0.5 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
            placeholder="https://… or mailto:…"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs text-zinc-600">Description (optional)</label>
          <input
            name="description"
            className="mt-0.5 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          />
        </div>
      </div>
      <button
        type="submit"
        className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
      >
        Add
      </button>
    </form>
  );
}
