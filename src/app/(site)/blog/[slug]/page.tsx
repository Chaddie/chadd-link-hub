import Link from "next/link";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { getPrisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const prisma = getPrisma();
  const post = await prisma.blogPost.findFirst({
    where: { slug, published: true },
    select: { title: true, excerpt: true },
  });
  if (!post) return { title: "Post" };
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const prisma = getPrisma();
  const post = await prisma.blogPost.findFirst({
    where: { slug, published: true },
  });
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-2xl px-4 py-12">
      <Link href="/blog" className="text-sm font-medium text-zinc-600 hover:text-zinc-900">
        ← Blog
      </Link>
      <header className="mt-6">
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-zinc-900">
          {post.title}
        </h1>
        {post.publishedAt ? (
          <time
            dateTime={post.publishedAt.toISOString()}
            className="mt-2 block text-sm text-zinc-500"
          >
            {format(post.publishedAt, "MMMM d, yyyy")}
          </time>
        ) : null}
      </header>
      <div className="mt-8 max-w-none space-y-4 text-[15px] leading-relaxed text-zinc-800 [&_a]:font-medium [&_a]:text-zinc-900 [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-zinc-300 [&_blockquote]:pl-4 [&_code]:rounded [&_code]:bg-zinc-100 [&_code]:px-1 [&_h1]:mt-8 [&_h1]:text-2xl [&_h1]:font-semibold [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_li]:my-1 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-3 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-zinc-100 [&_pre]:p-3 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-6">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>
    </article>
  );
}
