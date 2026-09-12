import { prisma } from "./prisma";
import type { CaseStudyStat } from "./types";

export function asStats(value: unknown): CaseStudyStat[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter(
      (item): item is CaseStudyStat =>
        Boolean(item) &&
        typeof item === "object" &&
        typeof (item as CaseStudyStat).value === "string" &&
        typeof (item as CaseStudyStat).label === "string",
    )
    .slice(0, 4);
}

export async function getPublishedCaseStudies() {
  return prisma.caseStudy.findMany({
    where: { status: "published" },
    orderBy: [{ order: "asc" }, { year: "desc" }],
  });
}

export async function getFeaturedCaseStudies() {
  const featured = await prisma.caseStudy.findMany({
    where: { status: "published", featured: true },
    orderBy: [{ order: "asc" }, { year: "desc" }],
  });
  if (featured.length) return featured;
  return getPublishedCaseStudies();
}

export async function getExperiences() {
  return prisma.experience.findMany({
    orderBy: [{ order: "asc" }, { startDate: "desc" }],
  });
}

export async function getExperienceById(id: string) {
  return prisma.experience.findUnique({ where: { id } });
}

export async function getPublishedCaseStudy(slug: string) {
  return prisma.caseStudy.findFirst({
    where: { slug, status: "published" },
  });
}

export async function getAllCaseStudies() {
  return prisma.caseStudy.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
}

export async function getCaseStudyById(id: string) {
  return prisma.caseStudy.findUnique({ where: { id } });
}

export async function getSkills() {
  return prisma.skill.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
}

export async function getSkillById(id: string) {
  return prisma.skill.findUnique({ where: { id } });
}

export async function getSetting(key: string, fallback = "") {
  const row = await prisma.siteSetting.findUnique({ where: { key } });
  return row?.value ?? fallback;
}

export async function getHeroStats() {
  const [count, aggregate, thirdValue, thirdLabel] = await Promise.all([
    prisma.caseStudy.count({ where: { status: "published" } }),
    prisma.caseStudy.aggregate({
      _sum: { usersImpacted: true },
      where: { status: "published" },
    }),
    getSetting("hero_stat_3_value", "50"),
    getSetting("hero_stat_3_label", "% Faster Deployment"),
  ]);

  return {
    caseStudies: count,
    usersImpacted: aggregate._sum.usersImpacted ?? 0,
    thirdValue,
    thirdLabel,
  };
}

export async function getAllSettings() {
  const rows = await prisma.siteSetting.findMany();
  return Object.fromEntries(rows.map((row) => [row.key, row.value]));
}
