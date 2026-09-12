"use server";

import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import {
  asBody,
  asTemplate,
  bodyToPlainText,
  imageUrlsFromBody,
  type CaseStudyDraft,
} from "@/lib/blocks";
import { prisma } from "@/lib/prisma";
import { revalidatePublicContent } from "@/lib/revalidate";
import { parseStats, parseTags, slugify } from "@/lib/slug";
import { deleteStoredImages } from "./upload";

function draftToData(draft: CaseStudyDraft) {
  const title = draft.title.trim() || "Untitled case study";
  const slug = slugify(draft.slug || title) || `untitled-${Date.now()}`;
  const body = asBody(draft.body);
  return {
    title,
    slug,
    category: draft.category.trim(),
    year: Number(draft.year) || new Date().getFullYear(),
    summary: draft.summary.trim(),
    description: bodyToPlainText(body) || draft.summary.trim(),
    coverImage: draft.coverImage?.trim() || null,
    usersImpacted: Number(draft.usersImpacted) || 0,
    themeColor: draft.themeColor.trim() || "#F5C518",
    stats: parseStats(
      draft.stats.map((s) => s.value),
      draft.stats.map((s) => s.label),
    ) as Prisma.InputJsonValue,
    tags: parseTags(draft.tags.join(",")),
    github: draft.github?.trim() || null,
    liveDemo: draft.liveDemo?.trim() || null,
    featured: Boolean(draft.featured),
    order: Number(draft.order) || 0,
    template: asTemplate(draft.template),
    body: body as Prisma.InputJsonValue,
  };
}

export async function createDraftCaseStudy() {
  await requireAdmin();
  const count = await prisma.caseStudy.count();
  const created = await prisma.caseStudy.create({
    data: {
      title: "Untitled case study",
      slug: `untitled-${Date.now()}`,
      category: "",
      year: new Date().getFullYear(),
      summary: "",
      description: "",
      body: [],
      template: "standard",
      stats: [],
      tags: [],
      featured: false,
      status: "draft",
      order: count,
    },
  });
  redirect(`/admin/case-studies/${created.id}`);
}

export async function saveCaseStudyDraft(id: string, draft: CaseStudyDraft) {
  await requireAdmin();
  const existing = await prisma.caseStudy.findUnique({ where: { id } });
  if (!existing) return { error: "Not found" };

  const data = draftToData(draft);
  const oldImages = [existing.coverImage, ...imageUrlsFromBody(asBody(existing.body))];
  const nextImages = new Set([data.coverImage, ...imageUrlsFromBody(asBody(data.body))]);
  const orphaned = oldImages.filter((url) => url && !nextImages.has(url));
  if (orphaned.length) {
    await deleteStoredImages(orphaned);
  }

  await prisma.caseStudy.update({ where: { id }, data });
  if (existing.status === "published") {
    revalidatePublicContent(existing.slug);
    revalidatePublicContent(data.slug);
  }
  return { ok: true, savedAt: new Date().toISOString(), slug: data.slug };
}

export async function publishCaseStudy(id: string, draft: CaseStudyDraft) {
  await requireAdmin();
  const existing = await prisma.caseStudy.findUnique({ where: { id } });
  if (!existing) return { error: "Not found" };
  const data = draftToData(draft);
  if (!data.title || !data.slug) return { error: "Title is required" };

  await prisma.caseStudy.update({
    where: { id },
    data: { ...data, status: "published" },
  });
  revalidatePublicContent(existing.slug);
  revalidatePublicContent(data.slug);
  return { ok: true };
}

export async function unpublishCaseStudy(id: string) {
  await requireAdmin();
  const existing = await prisma.caseStudy.findUnique({ where: { id } });
  if (!existing) return { error: "Not found" };
  await prisma.caseStudy.update({
    where: { id },
    data: { status: "draft" },
  });
  revalidatePublicContent(existing.slug);
  return { ok: true };
}

export async function createCaseStudy(formData: FormData) {
  await requireAdmin();
  const title = String(formData.get("title") || "").trim();
  const slug = slugify(String(formData.get("slug") || "") || title);
  if (!title || !slug) throw new Error("Title is required");
  await prisma.caseStudy.create({
    data: {
      title,
      slug,
      category: String(formData.get("category") || "").trim(),
      year: Number(formData.get("year") || new Date().getFullYear()),
      summary: String(formData.get("summary") || "").trim(),
      description: String(formData.get("description") || "").trim(),
      body: asBody([], String(formData.get("description") || "")),
      template: "standard",
      coverImage: String(formData.get("coverImage") || "").trim() || null,
      usersImpacted: Number(formData.get("usersImpacted") || 0) || 0,
      themeColor: String(formData.get("themeColor") || "#F5C518").trim(),
      stats: parseStats(
        formData.getAll("statValue").map(String),
        formData.getAll("statLabel").map(String),
      ) as Prisma.InputJsonValue,
      tags: parseTags(String(formData.get("tags") || "")),
      github: String(formData.get("github") || "").trim() || null,
      liveDemo: String(formData.get("liveDemo") || "").trim() || null,
      featured: formData.get("featured") === "on",
      status: "draft",
      order: Number(formData.get("order") || 0) || 0,
    },
  });
  revalidatePublicContent(slug);
  redirect("/admin/case-studies");
}

export async function updateCaseStudy(id: string, formData: FormData) {
  await requireAdmin();
  const existing = await prisma.caseStudy.findUnique({ where: { id } });
  if (!existing) throw new Error("Not found");
  const title = String(formData.get("title") || "").trim();
  const slug = slugify(String(formData.get("slug") || "") || title);
  if (!title || !slug) throw new Error("Title is required");
  await prisma.caseStudy.update({
    where: { id },
    data: {
      title,
      slug,
      category: String(formData.get("category") || "").trim(),
      year: Number(formData.get("year") || new Date().getFullYear()),
      summary: String(formData.get("summary") || "").trim(),
      coverImage: String(formData.get("coverImage") || "").trim() || null,
      usersImpacted: Number(formData.get("usersImpacted") || 0) || 0,
      themeColor: String(formData.get("themeColor") || "#F5C518").trim(),
      stats: parseStats(
        formData.getAll("statValue").map(String),
        formData.getAll("statLabel").map(String),
      ) as Prisma.InputJsonValue,
      tags: parseTags(String(formData.get("tags") || "")),
      github: String(formData.get("github") || "").trim() || null,
      liveDemo: String(formData.get("liveDemo") || "").trim() || null,
      featured: formData.get("featured") === "on",
      order: Number(formData.get("order") || 0) || 0,
    },
  });
  revalidatePublicContent(existing.slug);
  revalidatePublicContent(slug);
  redirect("/admin/case-studies");
}

export async function deleteCaseStudy(id: string) {
  await requireAdmin();
  const existing = await prisma.caseStudy.findUnique({ where: { id } });
  if (!existing) throw new Error("Not found");
  const urls = [existing.coverImage, ...imageUrlsFromBody(asBody(existing.body, existing.description))];
  await deleteStoredImages(urls);
  await prisma.caseStudy.delete({ where: { id } });
  revalidatePublicContent(existing.slug);
  redirect("/admin/case-studies");
}

export async function toggleCaseStudyStatus(id: string) {
  await requireAdmin();
  const existing = await prisma.caseStudy.findUnique({ where: { id } });
  if (!existing) throw new Error("Not found");
  const status = existing.status === "published" ? "draft" : "published";
  await prisma.caseStudy.update({ where: { id }, data: { status } });
  revalidatePublicContent(existing.slug);
}

export async function toggleCaseStudyFeatured(id: string) {
  await requireAdmin();
  const existing = await prisma.caseStudy.findUnique({ where: { id } });
  if (!existing) throw new Error("Not found");
  await prisma.caseStudy.update({
    where: { id },
    data: { featured: !existing.featured },
  });
  revalidatePublicContent(existing.slug);
}

export async function moveCaseStudy(id: string, direction: "up" | "down") {
  await requireAdmin();
  const studies = await prisma.caseStudy.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
  const index = studies.findIndex((item) => item.id === id);
  if (index < 0) return;
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (swapWith < 0 || swapWith >= studies.length) return;

  const current = studies[index];
  const other = studies[swapWith];
  await prisma.$transaction([
    prisma.caseStudy.update({
      where: { id: current.id },
      data: { order: other.order },
    }),
    prisma.caseStudy.update({
      where: { id: other.id },
      data: { order: current.order },
    }),
  ]);
  revalidatePublicContent();
}

export async function saveCoverUrl(id: string, url: string) {
  await requireAdmin();
  const existing = await prisma.caseStudy.findUnique({ where: { id } });
  if (!existing) throw new Error("Not found");
  if (existing.coverImage && existing.coverImage !== url) {
    await deleteStoredImages([existing.coverImage]);
  }
  await prisma.caseStudy.update({
    where: { id },
    data: { coverImage: url || null },
  });
  revalidatePublicContent(existing.slug);
}
