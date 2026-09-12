"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { parseMonth, type ExperienceDraft } from "@/lib/experience";
import { prisma } from "@/lib/prisma";
import { revalidatePublicContent } from "@/lib/revalidate";
import { deleteStoredImages } from "./upload";

function draftToData(draft: ExperienceDraft) {
  const role = draft.role.trim();
  const company = draft.company.trim();
  const startDate = parseMonth(draft.startMonth);
  if (!role) throw new Error("Role is required");
  if (!company) throw new Error("Company is required");
  if (!startDate) throw new Error("Start date is required");

  const images = draft.images.map((url) => url.trim()).filter(Boolean);
  const endDate = draft.present ? null : parseMonth(draft.endMonth);

  return {
    role,
    company,
    startDate,
    endDate,
    description: draft.description.trim(),
    images,
    order: Number(draft.order) || 0,
  };
}

export async function createExperience() {
  await requireAdmin();
  const count = await prisma.experience.count();
  const now = new Date();
  const startDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const created = await prisma.experience.create({
    data: {
      role: "Untitled role",
      company: "",
      startDate,
      endDate: null,
      description: "",
      images: [],
      order: count,
    },
  });
  revalidatePublicContent();
  redirect(`/admin/experience/${created.id}`);
}

export async function saveExperience(id: string, draft: ExperienceDraft) {
  await requireAdmin();
  const existing = await prisma.experience.findUnique({ where: { id } });
  if (!existing) return { error: "Not found" };

  try {
    const data = draftToData(draft);
    const orphaned = existing.images.filter((url) => !data.images.includes(url));
    if (orphaned.length) {
      await deleteStoredImages(orphaned);
    }
    await prisma.experience.update({ where: { id }, data });
    revalidatePublicContent();
    return { ok: true, savedAt: new Date().toISOString() };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Could not save." };
  }
}

export async function deleteExperience(id: string) {
  await requireAdmin();
  const existing = await prisma.experience.findUnique({ where: { id } });
  if (!existing) throw new Error("Not found");
  await deleteStoredImages(existing.images);
  await prisma.experience.delete({ where: { id } });
  revalidatePublicContent();
  redirect("/admin/experience");
}

export async function moveExperience(id: string, direction: "up" | "down") {
  await requireAdmin();
  const entries = await prisma.experience.findMany({
    orderBy: [{ order: "asc" }, { startDate: "desc" }],
  });
  const index = entries.findIndex((item) => item.id === id);
  if (index < 0) return;
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (swapWith < 0 || swapWith >= entries.length) return;

  const current = entries[index];
  const other = entries[swapWith];
  await prisma.$transaction([
    prisma.experience.update({
      where: { id: current.id },
      data: { order: other.order },
    }),
    prisma.experience.update({
      where: { id: other.id },
      data: { order: current.order },
    }),
  ]);
  revalidatePublicContent();
}
