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

const codeBadge =
  "rounded bg-black/[0.06] px-1 font-mono text-[0.8em] dark:bg-white/10";

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
        <h1 className="font-display text-2xl font-semibold text-foreground">Links</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage sections and links. Public URLs use <code className={codeBadge}>/go/…</code> for click
          tracking.
        </p>
      </div>

      <section className="admin-card">
        <h2 className="text-lg font-medium text-foreground">Top links</h2>
        <p className="mt-1 text-sm text-muted-foreground">Shown above all sections.</p>
        <ul className="mt-4 space-y-6">
          {topLinks.map((link, i) => (
            <li
              key={link.id}
              className="border-b border-border/60 pb-6 last:border-0 last:pb-0"
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

      <section className="admin-card">
        <h2 className="text-lg font-medium text-foreground">New section</h2>
        <form action={createSection} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label htmlFor="new-section-title" className="admin-label">
              Title
            </label>
            <input
              id="new-section-title"
              name="title"
              required
              className="admin-input"
              placeholder="e.g. Personal Blogs"
            />
          </div>
          <div className="flex-[2]">
            <label htmlFor="new-section-intro" className="admin-label">
              Intro (optional)
            </label>
            <input
              id="new-section-intro"
              name="intro"
              className="admin-input"
              placeholder="Paragraph under the heading"
            />
          </div>
          <button type="submit" className="admin-btn-primary shrink-0">
            Add section
          </button>
        </form>
      </section>

      {sections.map((section, si) => (
        <section key={section.id} className="admin-card">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <form action={updateSection} className="min-w-0 flex-1 space-y-3">
              <input type="hidden" name="id" value={section.id} />
              <div className="flex flex-wrap gap-3">
                <div className="min-w-[200px] flex-1">
                  <label className="admin-label">Section title</label>
                  <input
                    name="title"
                    required
                    defaultValue={section.title}
                    className="admin-input"
                  />
                </div>
                <div className="min-w-[240px] flex-[2]">
                  <label className="admin-label">Intro</label>
                  <input
                    name="intro"
                    defaultValue={section.intro ?? ""}
                    className="admin-input"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="submit" className="admin-btn-outline bg-card">
                  Save section
                </button>
              </div>
            </form>
            <div className="flex flex-wrap gap-2">
              <form action={moveSection}>
                <input type="hidden" name="id" value={section.id} />
                <input type="hidden" name="direction" value="up" />
                <button type="submit" disabled={si === 0} className="admin-btn-outline">
                  Up
                </button>
              </form>
              <form action={moveSection}>
                <input type="hidden" name="id" value={section.id} />
                <input type="hidden" name="direction" value="down" />
                <button
                  type="submit"
                  disabled={si === sections.length - 1}
                  className="admin-btn-outline"
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
                  className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-sm text-red-800 hover:bg-red-100 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200 dark:hover:bg-red-950/60"
                >
                  Delete
                </button>
              </ConfirmForm>
            </div>
          </div>

          <ul className="mt-6 space-y-6 border-t border-border/60 pt-6">
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
          <div className="mt-6 border-t border-border/60 pt-6">
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
          <label className="text-xs font-medium text-muted-foreground">Label</label>
          <input name="label" required defaultValue={link.label} className="admin-input" />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">Destination URL</label>
          <input
            name="url"
            required
            type="text"
            defaultValue={link.url}
            className="admin-input"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-medium text-muted-foreground">Description (optional)</label>
          <input
            name="description"
            defaultValue={link.description ?? ""}
            className="admin-input"
          />
        </div>
        <div className="sm:col-span-2">
          <button type="submit" className="admin-btn-primary">
            Save
          </button>
        </div>
      </form>
      <div className="flex flex-wrap gap-2">
        <form action={moveLink}>
          <input type="hidden" name="id" value={link.id} />
          <input type="hidden" name="direction" value="up" />
          <button type="submit" disabled={!canMoveUp} className="admin-btn-outline">
            Move up
          </button>
        </form>
        <form action={moveLink}>
          <input type="hidden" name="id" value={link.id} />
          <input type="hidden" name="direction" value="down" />
          <button type="submit" disabled={!canMoveDown} className="admin-btn-outline">
            Move down
          </button>
        </form>
        <form action={toggleLinkActive}>
          <input type="hidden" name="id" value={link.id} />
          <button type="submit" className="admin-btn-outline">
            {link.isActive ? "Hide" : "Show"}
          </button>
        </form>
        <ConfirmForm action={deleteLink} message="Delete this link?">
          <input type="hidden" name="id" value={link.id} />
          <button
            type="submit"
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-sm text-red-800 hover:bg-red-100 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200"
          >
            Delete
          </button>
        </ConfirmForm>
      </div>
      <p className="text-xs text-muted-foreground">
        Tracked URL: <code className={codeBadge}>/go/{link.id}</code>
      </p>
    </div>
  );
}

function AddLinkForm({ sectionId }: { sectionId: string | null }) {
  return (
    <form
      action={createLink}
      className="mt-6 space-y-3 rounded-lg border border-dashed border-border bg-black/[0.02] p-4 dark:bg-white/[0.03]"
    >
      {sectionId ? <input type="hidden" name="sectionId" value={sectionId} /> : null}
      <p className="text-sm font-medium text-foreground">Add link</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-xs text-muted-foreground">Label</label>
          <input
            name="label"
            required
            className="admin-input"
            placeholder="Visible title"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground">URL</label>
          <input
            name="url"
            required
            type="text"
            className="admin-input"
            placeholder="https://… or mailto:…"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs text-muted-foreground">Description (optional)</label>
          <input name="description" className="admin-input" />
        </div>
      </div>
      <button type="submit" className="admin-btn-primary">
        Add
      </button>
    </form>
  );
}
