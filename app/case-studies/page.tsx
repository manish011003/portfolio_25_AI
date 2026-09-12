import type { Metadata } from "next";
import { CaseStudyGrid } from "@/components/pm/CaseStudyGrid";
import { ContactBand } from "@/components/pm/ContactBand";
import { Footer } from "@/components/pm/Footer";
import { Nav } from "@/components/pm/Nav";
import { FALLBACK_STUDIES } from "@/lib/fallback";
import { getPublishedCaseStudies } from "@/lib/queries";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Case studies — Manish Biswas",
  description: "Published product case studies by Manish Biswas.",
  alternates: { canonical: "/case-studies" },
};

export default async function CaseStudiesIndexPage() {
  let studies: Awaited<ReturnType<typeof getPublishedCaseStudies>> = [];
  try {
    studies = await getPublishedCaseStudies();
  } catch (error) {
    console.error("Case studies index fetch failed", error);
    studies = FALLBACK_STUDIES;
  }

  return (
    <div className="paper-lines min-h-screen text-ink">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <section className="paper-grid border-b-2 border-ink px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-6xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted">
              All files
            </p>
            <h1 className="display mt-2 text-5xl sm:text-7xl lg:text-8xl">Case studies</h1>
            <p className="mt-3 max-w-xl text-ink/75">
              Every published case — open a file to read the full story.
            </p>
            <div className="mt-10">
              <CaseStudyGrid studies={studies} />
            </div>
          </div>
        </section>
        <ContactBand />
      </main>
      <Footer />
    </div>
  );
}
