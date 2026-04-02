import Link from "next/link";
import { notFound } from "next/navigation";
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
        <Link href="/admin/blog" className="text-sm text-zinc-600 hover:text-zinc-900">
          ← Blog posts
        </Link>
        <h1 className="mt-4 text-2xl font-semibold text-zinc-900">Edit post</h1>
      </div>
      <form action={updateBlogPost} className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <input type="hidden" name="id" value={post.id} />
        <div>
          <label htmlFor="title" className="text-sm font-medium text-zinc-800">
            Title
          </label>
          <input
            id="title"
            name="title"
            required
            defaultValue={post.title}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="slug" className="text-sm font-medium text-zinc-800">
            Slug
          </label>
          <input
            id="slug"
            name="slug"
            required
            defaultValue={post.slug}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 font-mono text-sm"
          />
        </div>
        <div>
          <label htmlFor="excerpt" className="text-sm font-medium text-zinc-800">
            Excerpt
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            rows={2}
            defaultValue={post.excerpt ?? ""}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="content" className="text-sm font-medium text-zinc-800">
            Content (Markdown)
          </label>
          <textarea
            id="content"
            name="content"
            required
            rows={16}
            defaultValue={post.content}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 font-mono text-sm"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-zinc-800">
          <input
            type="checkbox"
            name="published"
            defaultChecked={post.published}
            className="rounded border-zinc-300"
          />
          Published
        </label>
        <button
          type="submit"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Save changes
        </button>
      </form>
    </div>
  );
}
