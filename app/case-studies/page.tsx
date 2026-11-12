import type { Metadata } from "next";
import { CaseStudyGrid } from "@/components/pm/CaseStudyGrid";
import { ContactBand } from "@/components/pm/ContactBand";
import { Footer } from "@/components/pm/Footer";
import { Nav } from "@/components/pm/Nav";
import { FALLBACK_STUDIES } from "@/lib/fallback";
import { DEFAULT_OG_IMAGE, JsonLd, SITE, SITE_NAME, breadcrumbs } from "@/lib/seo";
import { getPublishedCaseStudies } from "@/lib/queries";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Case studies — Manish Biswas",
  description: "Published product case studies by Manish Biswas.",
  alternates: { canonical: "/case-studies" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: "Case studies — Manish Biswas",
    description: "Product case studies by Manish Biswas: problem, process and measurable outcomes.",
    url: `${SITE}/case-studies`,
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: { card: "summary_large_image", title: "Case studies — Manish Biswas", description: "Product case studies: problem, process and measurable outcomes.", images: [DEFAULT_OG_IMAGE.url] },
};

export default async function CaseStudiesIndexPage() {
  let studies: Awaited<ReturnType<typeof getPublishedCaseStudies>> = [];
  try {
    studies = await getPublishedCaseStudies();
  } catch (error) {
    console.error("Case studies index fetch failed", error);
    studies = FALLBACK_STUDIES;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${SITE}/case-studies#webpage`,
        url: `${SITE}/case-studies`,
        name: "Case studies — Manish Biswas",
        isPartOf: { "@id": `${SITE}/#website` },
        mainEntity: {
          "@type": "ItemList",
          itemListElement: studies.map((s, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: s.title,
            url: `${SITE}/case-studies/${s.slug}`,
          })),
        },
      },
      breadcrumbs([
        { name: "Home", path: "/" },
        { name: "Case studies", path: "/case-studies" },
      ]),
    ],
  };

  return (
    <div className="paper-lines min-h-screen text-ink">
      <JsonLd data={jsonLd} />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <section className="paper-grid border-b-2 border-ink py-12 sm:py-16">
          <div className="page-shell">
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
