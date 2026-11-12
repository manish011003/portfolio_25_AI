import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyArticle } from "@/components/pm/CaseStudyArticle";
import { ContactBand } from "@/components/pm/ContactBand";
import { Footer } from "@/components/pm/Footer";
import { Nav } from "@/components/pm/Nav";
import { FALLBACK_STUDIES } from "@/lib/fallback";
import { JsonLd, PERSON_ID, SITE, SITE_NAME, absoluteUrl, breadcrumbs, snippet } from "@/lib/seo";
import { getPublishedCaseStudies, getPublishedCaseStudy } from "@/lib/queries";

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const studies = await getPublishedCaseStudies();
    return studies.map((study) => ({ slug: study.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study =
    (await getPublishedCaseStudy(slug).catch(() => null)) ??
    FALLBACK_STUDIES.find((item) => item.slug === slug);
  if (!study) return { title: "Case study", robots: { index: false, follow: false } };
  const title = `${study.title} — Manish Biswas`;
  const description = snippet(study.summary);
  const url = `${SITE}/case-studies/${study.slug}`;
  const image = absoluteUrl(study.coverImage);
  return {
    title,
    description,
    keywords: [...study.tags, study.category, "case study", "Manish Biswas"],
    alternates: { canonical: url },
    openGraph: { type: "article", siteName: SITE_NAME, title, description, url, images: [{ url: image }], authors: ["Manish Biswas"], tags: study.tags },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study =
    (await getPublishedCaseStudy(slug).catch(() => null)) ??
    FALLBACK_STUDIES.find((item) => item.slug === slug) ??
    null;
  if (!study) notFound();

  const url = `${SITE}/case-studies/${study.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#article`,
        headline: study.title,
        description: study.summary,
        image: absoluteUrl(study.coverImage),
        url,
        mainEntityOfPage: url,
        articleSection: study.category,
        keywords: study.tags.join(", "),
        datePublished: study.createdAt?.toISOString?.(),
        dateModified: study.updatedAt?.toISOString?.(),
        author: { "@id": PERSON_ID },
        publisher: { "@id": PERSON_ID },
        inLanguage: "en",
      },
      breadcrumbs([
        { name: "Home", path: "/" },
        { name: "Case studies", path: "/case-studies" },
        { name: study.title, path: `/case-studies/${study.slug}` },
      ]),
    ],
  };

  return (
    <div className="paper-lines min-h-screen text-ink">
      <JsonLd data={jsonLd} />
      <Nav />
      <main>
        <CaseStudyArticle study={study} />
        <ContactBand />
      </main>
      <Footer />
    </div>
  );
}
