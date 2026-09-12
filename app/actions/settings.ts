"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePublicContent } from "@/lib/revalidate";

export async function saveSettings(formData: FormData) {
  await requireAdmin();
  const pairs = [
    ["hero_stat_3_value", String(formData.get("hero_stat_3_value") || "").trim()],
    ["hero_stat_3_label", String(formData.get("hero_stat_3_label") || "").trim()],
  ] as const;

  await prisma.$transaction(
    pairs
      .filter(([, value]) => value.length > 0)
      .map(([key, value]) =>
        prisma.siteSetting.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        }),
      ),
  );

  revalidatePublicContent();
  redirect("/admin");
}
