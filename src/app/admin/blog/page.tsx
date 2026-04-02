import Link from "next/link";
import { format } from "date-fns";
import { ConfirmForm } from "@/components/ConfirmForm";
import { getPrisma } from "@/lib/prisma";
import { deleteBlogPost } from "../blog-actions";

export const dynamic = "force-dynamic";

export default async function AdminBlogListPage() {
  const prisma = getPrisma();
  const posts = await prisma.blogPost.findMany({
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      published: true,
      publishedAt: true,
      updatedAt: true,
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Blog</h1>
          <p className="mt-1 text-sm text-zinc-600">Create and publish posts for /blog.</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          New post
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 text-zinc-600">
              <th className="px-4 py-2 font-medium">Title</th>
              <th className="px-4 py-2 font-medium">Slug</th>
              <th className="px-4 py-2 font-medium">Status</th>
              <th className="px-4 py-2 font-medium">Updated</th>
              <th className="px-4 py-2 font-medium" />
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id} className="border-b border-zinc-100">
                <td className="px-4 py-2 font-medium text-zinc-900">{p.title}</td>
                <td className="px-4 py-2 font-mono text-xs text-zinc-700">{p.slug}</td>
                <td className="px-4 py-2">
                  {p.published ? (
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-800">
                      Published
                    </span>
                  ) : (
                    <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-700">
                      Draft
                    </span>
                  )}
                </td>
                <td className="px-4 py-2 text-zinc-600">
                  {format(p.updatedAt, "MMM d, yyyy HH:mm")}
                </td>
                <td className="px-4 py-2 text-right">
                  <Link
                    href={`/admin/blog/${p.id}/edit`}
                    className="text-sm font-medium text-zinc-900 underline"
                  >
                    Edit
                  </Link>
                  <ConfirmForm action={deleteBlogPost} message="Delete this post permanently?" className="ml-4 inline">
                    <input type="hidden" name="id" value={p.id} />
                    <button type="submit" className="text-sm text-red-700 hover:underline">
                      Delete
                    </button>
                  </ConfirmForm>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {posts.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-zinc-500">No posts yet.</p>
        ) : null}
      </div>
    </div>
  );
}
