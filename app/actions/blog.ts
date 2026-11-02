"use server";

import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";
import { actionError } from "@/lib/action-error";
import { requireAdmin } from "@/lib/auth";
import { asBody, imageUrlsFromBody } from "@/lib/blocks";
import type { BlogDraft } from "@/lib/blog";
import { persistBlogDraft } from "@/lib/blog-persist";
import { prisma } from "@/lib/prisma";
import { revalidateBlog } from "@/lib/revalidate";
import { deleteStoredImages } from "./upload";

function slugTaken(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}

/** Images shared with other posts (e.g. a duplicate) or case studies must survive a delete/replace. */
async function deleteUnusedImages(urls: Array<string | null | undefined>, exceptPostId: string) {
  const candidates = urls.filter((url): url is string => Boolean(url));
  if (!candidates.length) return;
  const [posts, studies] = await Promise.all([
    prisma.blogPost.findMany({ where: { id: { not: exceptPostId } } }),
    prisma.caseStudy.findMany(),
  ]);
  const used = new Set<string>();
  for (const post of posts) {
    if (post.coverImage) used.add(post.coverImage);
    imageUrlsFromBody(asBody(post.body)).forEach((url) => used.add(url));
  }
  for (const study of studies) {
    if (study.coverImage) used.add(study.coverImage);
    imageUrlsFromBody(asBody(study.body)).forEach((url) => used.add(url));
  }
  await deleteStoredImages(candidates.filter((url) => !used.has(url)));
}

export async function createDraftBlogPost() {
  await requireAdmin();
  const created = await prisma.blogPost.create({
    data: {
      title: "Untitled post",
      slug: `untitled-${Date.now()}`,
      excerpt: "",
      category: "ai",
      tags: [],
      body: [],
      status: "draft",
    },
  });
  redirect(`/admin/blog/${created.id}`);
}

/**
 * Writes the editor's draft. `baseRevision` is the revision token the editor last received; a
 * stale one gets `{ conflict: true }` back instead of silently replacing newer content.
 */
export async function saveBlogDraft(id: string, draft: BlogDraft, baseRevision: string, force = false) {
  try {
    await requireAdmin();
    const result = await persistBlogDraft(prisma, id, draft, { baseRevision, force });
    if ("notFound" in result) return { error: "Not found" };
    if ("conflict" in result) return { conflict: true as const, revision: result.revision };

    const nextImages = new Set([result.stored.coverImage, ...imageUrlsFromBody(asBody(result.stored.body))]);
    const orphaned = [result.previous.coverImage, ...imageUrlsFromBody(asBody(result.previous.body))].filter(
      (url) => url && !nextImages.has(url),
    );
    await deleteUnusedImages(orphaned, id);
    if (result.previous.status === "published") {
      revalidateBlog(result.previous.slug);
      revalidateBlog(result.slug);
    }
    return { ok: true as const, savedAt: result.savedAt, slug: result.slug, revision: result.revision };
  } catch (error) {
    if (slugTaken(error)) return { error: "That slug is already used by another post." };
    return actionError(error, "Save failed. Try again.");
  }
}

export async function publishBlogPost(id: string, draft: BlogDraft, baseRevision: string, force = false) {
  try {
    await requireAdmin();
    const result = await persistBlogDraft(prisma, id, draft, { baseRevision, force, publish: true });
    if ("notFound" in result) return { error: "Not found" };
    if ("conflict" in result) return { conflict: true as const, revision: result.revision };
    revalidateBlog(result.previous.slug);
    revalidateBlog(result.slug);
    return { ok: true as const, revision: result.revision, slug: result.slug };
  } catch (error) {
    if (slugTaken(error)) return { error: "That slug is already used by another post." };
    return actionError(error, "Publish failed. Try again.");
  }
}

export async function unpublishBlogPost(id: string) {
  try {
    await requireAdmin();
    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) return { error: "Not found" };
    await prisma.blogPost.update({ where: { id }, data: { status: "draft" } });
    revalidateBlog(existing.slug);
    return { ok: true };
  } catch (error) {
    return actionError(error, "Could not unpublish.");
  }
}

export async function toggleBlogStatus(id: string) {
  await requireAdmin();
  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing) throw new Error("Not found");
  const publishing = existing.status !== "published";
  await prisma.blogPost.update({
    where: { id },
    data: {
      status: publishing ? "published" : "draft",
      ...(publishing && !existing.publishedAt ? { publishedAt: new Date() } : {}),
    },
  });
  revalidateBlog(existing.slug);
}

export async function duplicateBlogPost(id: string) {
  await requireAdmin();
  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing) throw new Error("Not found");

  const base = `${existing.slug}-copy`;
  let slug = base;
  for (let n = 2; await prisma.blogPost.findUnique({ where: { slug } }); n += 1) {
    slug = `${base}-${n}`;
  }
  const copy = await prisma.blogPost.create({
    data: {
      title: `Copy of ${existing.title}`,
      slug,
      excerpt: existing.excerpt,
      category: existing.category,
      tags: existing.tags,
      emoji: existing.emoji,
      coverImage: existing.coverImage,
      body: existing.body as Prisma.InputJsonValue,
      readMinutes: existing.readMinutes,
      metaTitle: existing.metaTitle,
      metaDescription: existing.metaDescription,
      status: "draft",
    },
  });
  redirect(`/admin/blog/${copy.id}`);
}

export async function deleteBlogPost(id: string) {
  await requireAdmin();
  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing) throw new Error("Not found");
  const urls = [existing.coverImage, ...imageUrlsFromBody(asBody(existing.body))];
  await prisma.blogPost.delete({ where: { id } });
  await deleteUnusedImages(urls, id);
  revalidateBlog(existing.slug);
  redirect("/admin/blog");
}
