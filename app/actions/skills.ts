"use server";

import { redirect } from "next/navigation";
import { actionError } from "@/lib/action-error";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { moveItem } from "@/lib/reorder";
import { revalidatePublicContent } from "@/lib/revalidate";

function readSkill(formData: FormData) {
  return {
    icon: String(formData.get("icon") || "◆").trim() || "◆",
    title: String(formData.get("title") || "").trim(),
    description: String(formData.get("description") || "").trim(),
    order: Number(formData.get("order") || 0) || 0,
  };
}

export async function createSkill(formData: FormData) {
  await requireAdmin();
  const data = readSkill(formData);
  if (!data.title) throw new Error("Title is required");
  await prisma.skill.create({ data });
  revalidatePublicContent();
  redirect("/admin/skills");
}

export async function updateSkill(id: string, formData: FormData) {
  await requireAdmin();
  const data = readSkill(formData);
  if (!data.title) throw new Error("Title is required");
  await prisma.skill.update({ where: { id }, data });
  revalidatePublicContent();
  redirect("/admin/skills");
}

export async function deleteSkill(id: string) {
  await requireAdmin();
  await prisma.skill.delete({ where: { id } });
  revalidatePublicContent();
  redirect("/admin/skills");
}

export async function moveSkill(id: string, direction: "up" | "down") {
  try {
    await requireAdmin();
    const skills = await prisma.skill.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });
    const next = moveItem(skills, id, direction);
    if (!next) return;
    await prisma.$transaction(
      next.map((skill, order) =>
        prisma.skill.update({
          where: { id: skill.id },
          data: { order },
        }),
      ),
    );
    revalidatePublicContent();
  } catch (error) {
    return actionError(error, "Could not reorder skills.");
  }
}
