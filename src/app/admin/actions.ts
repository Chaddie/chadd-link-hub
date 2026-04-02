"use server";

import { auth } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    throw new Error("Unauthorized");
  }
}

export async function updateSiteProfile(formData: FormData) {
  await requireAdmin();
  const prisma = getPrisma();
  const displayName = String(formData.get("displayName") ?? "").trim();
  const tagline = String(formData.get("tagline") ?? "").trim() || null;
  const avatarUrl = String(formData.get("avatarUrl") ?? "").trim() || null;
  if (!displayName) throw new Error("Name is required");

  await prisma.siteProfile.upsert({
    where: { id: "site" },
    create: { id: "site", displayName, tagline, avatarUrl },
    update: { displayName, tagline, avatarUrl },
  });
  revalidatePath("/");
  revalidatePath("/admin/profile");
}

export async function createSection(formData: FormData) {
  await requireAdmin();
  const prisma = getPrisma();
  const title = String(formData.get("title") ?? "").trim();
  if (!title) throw new Error("Title is required");
  const intro = String(formData.get("intro") ?? "").trim() || null;
  const max = await prisma.linkSection.aggregate({ _max: { sortOrder: true } });
  const sortOrder = (max._max.sortOrder ?? -1) + 1;
  await prisma.linkSection.create({
    data: { title, intro, sortOrder },
  });
  revalidatePath("/");
  revalidatePath("/admin/links");
}

export async function updateSection(formData: FormData) {
  await requireAdmin();
  const prisma = getPrisma();
  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const intro = String(formData.get("intro") ?? "").trim() || null;
  if (!id || !title) throw new Error("Invalid section");
  await prisma.linkSection.update({
    where: { id },
    data: { title, intro },
  });
  revalidatePath("/");
  revalidatePath("/admin/links");
}

export async function deleteSection(formData: FormData) {
  await requireAdmin();
  const prisma = getPrisma();
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Invalid section");
  await prisma.linkSection.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/links");
}

export async function moveSection(formData: FormData) {
  await requireAdmin();
  const prisma = getPrisma();
  const id = String(formData.get("id") ?? "");
  const dir = String(formData.get("direction") ?? "");
  if (!id || (dir !== "up" && dir !== "down")) return;

  const sections = await prisma.linkSection.findMany({
    orderBy: { sortOrder: "asc" },
  });
  const idx = sections.findIndex((s) => s.id === id);
  if (idx < 0) return;
  const swapWith = dir === "up" ? idx - 1 : idx + 1;
  if (swapWith < 0 || swapWith >= sections.length) return;
  const a = sections[idx];
  const b = sections[swapWith];
  await prisma.$transaction([
    prisma.linkSection.update({
      where: { id: a.id },
      data: { sortOrder: b.sortOrder },
    }),
    prisma.linkSection.update({
      where: { id: b.id },
      data: { sortOrder: a.sortOrder },
    }),
  ]);
  revalidatePath("/");
  revalidatePath("/admin/links");
}

export async function createLink(formData: FormData) {
  await requireAdmin();
  const prisma = getPrisma();
  const label = String(formData.get("label") ?? "").trim();
  const url = String(formData.get("url") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const sectionIdRaw = String(formData.get("sectionId") ?? "").trim();
  const sectionId = sectionIdRaw === "" ? null : sectionIdRaw;
  if (!label || !url) throw new Error("Label and URL are required");

  const where = sectionId
    ? { sectionId }
    : { sectionId: null as null };
  const max = await prisma.link.aggregate({
    where,
    _max: { sortOrder: true },
  });
  const sortOrder = (max._max.sortOrder ?? -1) + 1;

  await prisma.link.create({
    data: {
      label,
      url,
      description,
      sectionId,
      sortOrder,
    },
  });
  revalidatePath("/");
  revalidatePath("/admin/links");
}

export async function updateLink(formData: FormData) {
  await requireAdmin();
  const prisma = getPrisma();
  const id = String(formData.get("id") ?? "");
  const label = String(formData.get("label") ?? "").trim();
  const url = String(formData.get("url") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  if (!id || !label || !url) throw new Error("Invalid link");
  await prisma.link.update({
    where: { id },
    data: { label, url, description },
  });
  revalidatePath("/");
  revalidatePath("/admin/links");
}

export async function toggleLinkActive(formData: FormData) {
  await requireAdmin();
  const prisma = getPrisma();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const link = await prisma.link.findUnique({ where: { id } });
  if (!link) return;
  await prisma.link.update({
    where: { id },
    data: { isActive: !link.isActive },
  });
  revalidatePath("/");
  revalidatePath("/admin/links");
}

export async function deleteLink(formData: FormData) {
  await requireAdmin();
  const prisma = getPrisma();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await prisma.link.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/links");
}

export async function moveLink(formData: FormData) {
  await requireAdmin();
  const prisma = getPrisma();
  const id = String(formData.get("id") ?? "");
  const dir = String(formData.get("direction") ?? "");
  if (!id || (dir !== "up" && dir !== "down")) return;

  const link = await prisma.link.findUnique({ where: { id } });
  if (!link) return;
  const siblings = await prisma.link.findMany({
    where: link.sectionId
      ? { sectionId: link.sectionId }
      : { sectionId: null },
    orderBy: { sortOrder: "asc" },
  });
  const idx = siblings.findIndex((l) => l.id === id);
  if (idx < 0) return;
  const swapWith = dir === "up" ? idx - 1 : idx + 1;
  if (swapWith < 0 || swapWith >= siblings.length) return;
  const a = siblings[idx];
  const b = siblings[swapWith];
  await prisma.$transaction([
    prisma.link.update({
      where: { id: a.id },
      data: { sortOrder: b.sortOrder },
    }),
    prisma.link.update({
      where: { id: b.id },
      data: { sortOrder: a.sortOrder },
    }),
  ]);
  revalidatePath("/");
  revalidatePath("/admin/links");
}
