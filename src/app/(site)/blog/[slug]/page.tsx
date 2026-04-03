import Link from "next/link";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { BlogPostLabels } from "@/components/BlogPostLabels";
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
    <article className="mx-auto max-w-2xl px-4 pb-20 pt-6">
      <div className="glass-panel">
        <div className="glass-panel-shine opacity-80" aria-hidden />
        <div className="relative">
          <Link
            href="/blog"
            className="text-sm font-medium text-accent transition hover:opacity-80"
          >
            ← Blog
          </Link>
          <header className="mt-6">
            <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              {post.title}
            </h1>
            {post.publishedAt ? (
              <time
                dateTime={post.publishedAt.toISOString()}
                className="mt-2 block text-sm text-muted-foreground"
              >
                {format(post.publishedAt, "MMMM d, yyyy")}
              </time>
            ) : null}
            <BlogPostLabels labels={post.labels ?? []} linkToFilter />
          </header>
          <div className="prose-blog mt-8">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
        </div>
      </div>
    </article>
  );
}
