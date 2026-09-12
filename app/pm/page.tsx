import type { Metadata } from "next";
import { ContactBand } from "@/components/pm/ContactBand";
import { ExperienceTimeline } from "@/components/pm/ExperienceTimeline";
import { Footer } from "@/components/pm/Footer";
import { Hero } from "@/components/pm/Hero";
import { Nav } from "@/components/pm/Nav";
import { Showcase } from "@/components/pm/Showcase";
import { SkillsGrid } from "@/components/pm/SkillsGrid";
import {
  FALLBACK_EXPERIENCES,
  FALLBACK_HERO,
  FALLBACK_SKILLS,
  FALLBACK_STUDIES,
} from "@/lib/fallback";
import { getExperiences, getFeaturedCaseStudies, getHeroStats, getSkills } from "@/lib/queries";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "PM Portfolio — Manish Biswas | Product Manager Case Studies",
  description:
    "Product management portfolio by Manish Biswas — Ironclad, Claro AI, SIH e-waste platform, and AI task agent.",
  alternates: { canonical: "/pm" },
};

export default async function PmPage() {
  let featured = FALLBACK_STUDIES.filter((study) => study.featured);
  if (!featured.length) featured = FALLBACK_STUDIES;
  let skills = FALLBACK_SKILLS;
  let experiences = FALLBACK_EXPERIENCES;
  let hero = FALLBACK_HERO;

  try {
    const [nextFeatured, nextSkills, nextHero, nextExperiences] = await Promise.all([
      getFeaturedCaseStudies(),
      getSkills(),
      getHeroStats(),
      getExperiences(),
    ]);
    featured = nextFeatured;
    skills = nextSkills;
    hero = nextHero;
    experiences = nextExperiences;
  } catch (error) {
    console.error("PM page data fetch failed", error);
  }

  return (
    <div className="paper-lines min-h-screen text-ink">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero {...hero} />
        <section id="case-studies" className="border-t-2 border-ink">
          <div className="paper-grid border-b-2 border-ink px-4 py-12 sm:px-6">
            <div className="mx-auto max-w-6xl">
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted">
                Featured work
              </p>
              <h2 className="display mt-2 text-5xl sm:text-7xl lg:text-8xl">Case studies</h2>
              <p className="mt-3 max-w-xl text-ink/75">
                A rotating look at selected work. Open the file drawer for the full set.
              </p>
            </div>
          </div>
          <Showcase studies={featured} />
        </section>
        <section id="experience" className="border-b-2 border-ink px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted">
              The path
            </p>
            <h2 className="display mt-2 text-5xl sm:text-7xl lg:text-8xl">Experience</h2>
            <p className="mt-3 max-w-xl text-ink/75">
              Roles and orgs, most recent first. Hover or tap a row for the story.
            </p>
            <ExperienceTimeline entries={experiences} />
          </div>
        </section>
        <SkillsGrid skills={skills} />
        <ContactBand />
      </main>
      <Footer />
    </div>
  );
}
