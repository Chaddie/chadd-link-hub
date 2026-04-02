"use server";

import { auth } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.isAdmin) throw new Error("Unauthorized");
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function createBlogPost(formData: FormData) {
  await requireAdmin();
  const prisma = getPrisma();
  const title = String(formData.get("title") ?? "").trim();
  let slug = String(formData.get("slug") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim() || null;
  const content = String(formData.get("content") ?? "");
  const published = String(formData.get("published") ?? "") === "on";

  if (!title) throw new Error("Title is required");
  if (!slug) slug = slugify(title);
  else slug = slugify(slug);

  const publishedAt = published ? new Date() : null;

  await prisma.blogPost.create({
    data: {
      title,
      slug,
      excerpt,
      content,
      published,
      publishedAt,
    },
  });
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
}

export async function updateBlogPost(formData: FormData) {
  await requireAdmin();
  const prisma = getPrisma();
  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  let slug = String(formData.get("slug") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim() || null;
  const content = String(formData.get("content") ?? "");
  const published = String(formData.get("published") ?? "") === "on";

  if (!id || !title) throw new Error("Invalid post");
  if (!slug) slug = slugify(title);
  else slug = slugify(slug);

  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing) throw new Error("Not found");

  let publishedAt = existing.publishedAt;
  if (published && !existing.published) {
    publishedAt = new Date();
  }
  if (!published) {
    publishedAt = null;
  }

  await prisma.blogPost.update({
    where: { id },
    data: {
      title,
      slug,
      excerpt,
      content,
      published,
      publishedAt,
    },
  });
  revalidatePath("/blog");
  if (existing.slug !== slug) {
    revalidatePath(`/blog/${existing.slug}`);
  }
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/admin/blog");
}

export async function deleteBlogPost(formData: FormData) {
  await requireAdmin();
  const prisma = getPrisma();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await prisma.blogPost.delete({ where: { id } });
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
}
