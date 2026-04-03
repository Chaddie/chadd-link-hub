import Link from "next/link";
import { format } from "date-fns";
import { Prisma } from "@prisma/client";
import { BlogLabelFilter } from "@/components/BlogLabelFilter";
import { BlogPostLabels } from "@/components/BlogPostLabels";
import { isValidBlogLabel } from "@/lib/blog-labels";
import { getPrisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Blog",
  description: "Articles and notes.",
};

type Props = { searchParams: Promise<{ label?: string }> };

export default async function BlogIndexPage({ searchParams }: Props) {
  const sp = await searchParams;
  const raw = sp.label;
  const rawLabel = Array.isArray(raw) ? raw[0] : raw;
  const label =
    rawLabel && typeof rawLabel === "string" && isValidBlogLabel(rawLabel)
      ? rawLabel
      : undefined;

  const prisma = getPrisma();
  // Filter labels in memory instead of `labels: { has }` so a stale Prisma client
  // (e.g. generate failed on Windows/OneDrive) still runs; DB-level `has` can throw
  // PrismaClientValidationError when client and schema disagree.

  type BlogListRow = {
    slug: string;
    title: string;
    excerpt: string | null;
    publishedAt: Date | null;
    labels: string[];
  };

  let allPublished: BlogListRow[];
  try {
    allPublished = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      select: {
        slug: true,
        title: true,
        excerpt: true,
        publishedAt: true,
        labels: true,
      },
    });
  } catch (e) {
    const err = e as { name?: string; message?: string };
    const isStaleClientLabels =
      err.name === "PrismaClientValidationError" &&
      typeof err.message === "string" &&
      err.message.includes("labels");
    if (!isStaleClientLabels) throw e;

    // Stale generated client (e.g. prisma generate EPERM on Windows/locked DLL) —
    // select without labels, then load labels from DB.
    const base = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      select: {
        slug: true,
        title: true,
        excerpt: true,
        publishedAt: true,
      },
    });
    const labelRows = await prisma.$queryRaw<Array<{ slug: string; labels: string[] }>>(
      Prisma.sql`SELECT "slug", "labels" FROM "BlogPost" WHERE "published" = true`
    );
    const labelsBySlug = new Map(
      labelRows.map((r) => [r.slug, Array.isArray(r.labels) ? r.labels : []])
    );
    allPublished = base.map((p) => ({
      ...p,
      labels: labelsBySlug.get(p.slug) ?? [],
    }));
  }

  const posts = label
    ? allPublished.filter((p) => (p.labels ?? []).includes(label))
    : allPublished;

  return (
    <div className="mx-auto max-w-2xl px-4 pb-20 pt-6">
      <div className="glass-panel">
        <div className="glass-panel-shine opacity-80" aria-hidden />
        <div className="relative">
          <h1 className="font-display text-3xl font-semibold tracking-tight">Blog</h1>
          {label ? (
            <p className="mt-2 text-muted-foreground">
              Showing posts labelled{" "}
              <span className="font-medium text-foreground">{label}</span>.
            </p>
          ) : null}

          <BlogLabelFilter activeLabel={label} />

          <ul className="space-y-8">
            {posts.length === 0 ? (
              <li className="text-sm text-muted-foreground">
                {label ? "No posts with this label yet." : "No posts yet."}
              </li>
            ) : (
              posts.map((p) => {
                const postLabels = p.labels ?? [];
                return (
                  <li
                    key={p.slug}
                    className="border-b border-border pb-8 last:border-0 last:pb-0"
                  >
                    {/* Avoid nested <a>: labels are outside the post link */}
                    <Link
                      href={`/blog/${p.slug}`}
                      className="group block rounded-lg outline-none transition hover:opacity-95 focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
                    >
                      <h2 className="text-xl font-semibold text-foreground transition group-hover:text-accent">
                        {p.title}
                      </h2>
                      {p.publishedAt ? (
                        <time
                          dateTime={p.publishedAt.toISOString()}
                          className="mt-1 block text-sm text-muted-foreground"
                        >
                          {format(p.publishedAt, "MMMM d, yyyy")}
                        </time>
                      ) : null}
                      {p.excerpt ? (
                        <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                          {p.excerpt}
                        </p>
                      ) : null}
                    </Link>
                    <BlogPostLabels labels={postLabels} />
                  </li>
                );
              })
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
