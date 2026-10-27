"use server";

import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";
import { actionError } from "@/lib/action-error";
import { requireAdmin } from "@/lib/auth";
import { asBody, bodyToPlainText, imageUrlsFromBody } from "@/lib/blocks";
import { asBlogCategory, estimateReadMinutes, type BlogDraft } from "@/lib/blog";
import { prisma } from "@/lib/prisma";
import { revalidateBlog } from "@/lib/revalidate";
import { parseTags, slugify } from "@/lib/slug";
import { deleteStoredImages } from "./upload";

function draftToData(draft: BlogDraft) {
  const title = draft.title.trim() || "Untitled post";
  const slug = slugify(draft.slug || title) || `untitled-${Date.now()}`;
  const body = asBody(draft.body);
  const published = draft.publishedAt ? new Date(`${draft.publishedAt}T00:00:00.000Z`) : null;
  return {
    title,
    slug,
    excerpt: draft.excerpt.trim() || bodyToPlainText(body).slice(0, 180),
    category: asBlogCategory(draft.category),
    tags: parseTags(draft.tags.join(",")),
    emoji: draft.emoji?.trim() || null,
    coverImage: draft.coverImage?.trim() || null,
    body: body as Prisma.InputJsonValue,
    publishedAt: published && !Number.isNaN(published.getTime()) ? published : null,
    readMinutes: Number(draft.readMinutes) > 0 ? Math.round(Number(draft.readMinutes)) : estimateReadMinutes(body),
    metaTitle: draft.metaTitle.trim() || null,
    metaDescription: draft.metaDescription.trim() || null,
  };
}

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

export async function saveBlogDraft(id: string, draft: BlogDraft) {
  try {
    await requireAdmin();
    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) return { error: "Not found" };

    const data = draftToData(draft);
    const nextImages = new Set([data.coverImage, ...imageUrlsFromBody(asBody(data.body))]);
    const orphaned = [existing.coverImage, ...imageUrlsFromBody(asBody(existing.body))].filter(
      (url) => url && !nextImages.has(url),
    );

    await prisma.blogPost.update({ where: { id }, data });
    await deleteUnusedImages(orphaned, id);
    if (existing.status === "published") {
      revalidateBlog(existing.slug);
      revalidateBlog(data.slug);
    }
    return { ok: true, savedAt: new Date().toISOString(), slug: data.slug };
  } catch (error) {
    if (slugTaken(error)) return { error: "That slug is already used by another post." };
    return actionError(error, "Save failed. Try again.");
  }
}

export async function publishBlogPost(id: string, draft: BlogDraft) {
  try {
    await requireAdmin();
    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (!existing) return { error: "Not found" };
    const data = draftToData(draft);
    await prisma.blogPost.update({
      where: { id },
      data: { ...data, status: "published", publishedAt: data.publishedAt ?? existing.publishedAt ?? new Date() },
    });
    revalidateBlog(existing.slug);
    revalidateBlog(data.slug);
    return { ok: true };
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
