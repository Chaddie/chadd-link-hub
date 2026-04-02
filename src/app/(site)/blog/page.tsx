import Link from "next/link";
import { format } from "date-fns";
import { getPrisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Blog",
  description: "Articles and notes.",
};

export default async function BlogIndexPage() {
  const prisma = getPrisma();
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    select: { slug: true, title: true, excerpt: true, publishedAt: true },
  });

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-serif text-3xl font-semibold tracking-tight text-zinc-900">
        Blog
      </h1>
      <p className="mt-2 text-zinc-600">Posts published from the admin area.</p>
      <ul className="mt-10 space-y-8">
        {posts.length === 0 ? (
          <li className="text-sm text-zinc-500">No posts yet.</li>
        ) : (
          posts.map((p) => (
            <li key={p.slug} className="border-b border-zinc-200 pb-8">
              <Link href={`/blog/${p.slug}`} className="group">
                <h2 className="text-xl font-semibold text-zinc-900 group-hover:underline">
                  {p.title}
                </h2>
                {p.publishedAt ? (
                  <time
                    dateTime={p.publishedAt.toISOString()}
                    className="mt-1 block text-sm text-zinc-500"
                  >
                    {format(p.publishedAt, "MMMM d, yyyy")}
                  </time>
                ) : null}
                {p.excerpt ? (
                  <p className="mt-3 text-zinc-600">{p.excerpt}</p>
                ) : null}
              </Link>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
