import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminBlogLabelsField } from "@/components/admin/AdminBlogLabelsField";
import { getPrisma } from "@/lib/prisma";
import { updateBlogPost } from "../../../blog-actions";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function AdminBlogEditPage({ params }: Props) {
  const { id } = await params;
  const prisma = getPrisma();
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          href="/admin/blog"
          className="text-sm text-muted-foreground transition hover:text-foreground"
        >
          ← Blog posts
        </Link>
        <h1 className="mt-4 font-display text-2xl font-semibold text-foreground">Edit post</h1>
      </div>
      <form action={updateBlogPost} className="admin-card space-y-4">
        <input type="hidden" name="id" value={post.id} />
        <div>
          <label htmlFor="title" className="admin-label">
            Title
          </label>
          <input
            id="title"
            name="title"
            required
            defaultValue={post.title}
            className="admin-input"
          />
        </div>
        <div>
          <label htmlFor="slug" className="admin-label">
            Slug
          </label>
          <input
            id="slug"
            name="slug"
            required
            defaultValue={post.slug}
            className="admin-input font-mono text-sm"
          />
        </div>
        <div>
          <label htmlFor="excerpt" className="admin-label">
            Excerpt
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            rows={2}
            defaultValue={post.excerpt ?? ""}
            className="admin-input min-h-[4rem]"
          />
        </div>
        <div>
          <label htmlFor="content" className="admin-label">
            Content (Markdown)
          </label>
          <textarea
            id="content"
            name="content"
            required
            rows={16}
            defaultValue={post.content}
            className="admin-input min-h-[12rem] font-mono text-sm"
          />
        </div>
        <AdminBlogLabelsField defaultSelected={post.labels} />
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            name="published"
            defaultChecked={post.published}
            className="rounded border-border accent-[color:var(--accent)]"
          />
          Published
        </label>
        <button type="submit" className="admin-btn-primary">
          Save changes
        </button>
      </form>
    </div>
  );
}
