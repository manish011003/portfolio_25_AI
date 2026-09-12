"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
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
  await requireAdmin();
  const skills = await prisma.skill.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
  const index = skills.findIndex((item) => item.id === id);
  if (index < 0) return;
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (swapWith < 0 || swapWith >= skills.length) return;

  const current = skills[index];
  const other = skills[swapWith];
  await prisma.$transaction([
    prisma.skill.update({
      where: { id: current.id },
      data: { order: other.order },
    }),
    prisma.skill.update({
      where: { id: other.id },
      data: { order: current.order },
    }),
  ]);
  revalidatePublicContent();
}
