import type { MetadataRoute } from "next";
import { FALLBACK_STUDIES } from "@/lib/fallback";
import { loadPublishedPosts } from "@/lib/blog-public";
import { getPublishedCaseStudies } from "@/lib/queries";
import { SITE } from "@/lib/seo";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  let studies: { slug: string; updatedAt?: Date }[] = FALLBACK_STUDIES;
  try {
    studies = await getPublishedCaseStudies();
  } catch {
    // keep fallback
  }
  const posts = await loadPublishedPosts();

  const latest = (dates: (Date | null | undefined)[]) =>
    dates.filter((d): d is Date => !!d).sort((a, b) => b.getTime() - a.getTime())[0] ?? now;

  return [
    { url: `${SITE}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE}/pm`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    {
      url: `${SITE}/case-studies`,
      lastModified: latest(studies.map((s) => s.updatedAt)),
      changeFrequency: "monthly",
      priority: 0.85,
    },
    ...studies.map((s) => ({
      url: `${SITE}/case-studies/${s.slug}`,
      lastModified: s.updatedAt ?? now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    {
      url: `${SITE}/blog.html`,
      lastModified: latest(posts.map((p) => ("updatedAt" in p ? (p.updatedAt as Date) : p.publishedAt))),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...posts.map((p) => ({
      url: `${SITE}/blog/${p.slug}`,
      lastModified: ("updatedAt" in p ? (p.updatedAt as Date) : p.publishedAt) ?? now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    { url: `${SITE}/business-card.html`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
  ];
}
