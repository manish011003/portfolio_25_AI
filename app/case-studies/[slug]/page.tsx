import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyArticle } from "@/components/pm/CaseStudyArticle";
import { ContactBand } from "@/components/pm/ContactBand";
import { Footer } from "@/components/pm/Footer";
import { Nav } from "@/components/pm/Nav";
import { FALLBACK_STUDIES } from "@/lib/fallback";
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
  if (!study) return { title: "Case study" };
  return {
    title: `${study.title} — Manish Biswas`,
    description: study.summary,
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

  return (
    <div className="paper-lines min-h-screen text-ink">
      <Nav />
      <main>
        <CaseStudyArticle study={study} />
        <ContactBand />
      </main>
      <Footer />
    </div>
  );
}
