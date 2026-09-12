import Link from "next/link";
import type { CaseStudy } from "@prisma/client";
import { asBody, asTemplate, collectChartBlocks, collectNarrativeBlocks } from "@/lib/blocks";
import { asStats } from "@/lib/queries";
import { isDarkHex } from "@/lib/slug";
import { BrowserFrame } from "./BrowserFrame";
import { CaseStudyBlocks } from "./CaseStudyBlocks";
import { Pill } from "./Pills";
import { Polaroid } from "./Polaroid";
import { CaseChart } from "./CaseChart";

export function CaseStudyArticle({ study }: { study: CaseStudy }) {
  const template = asTemplate(study.template);
  const body = asBody(study.body, study.description);
  const stats = asStats(study.stats);
  const dark = isDarkHex(study.themeColor);
  const ink = dark ? "#fff8ee" : "#111111";

  return (
    <>
      <section
        className="border-b-2 border-ink px-4 py-14 sm:px-6 sm:py-20"
        style={{ background: study.themeColor, color: ink }}
      >
        <div className={`mx-auto ${template === "narrative" ? "max-w-3xl" : "max-w-4xl"}`}>
          <Link
            href="/case-studies"
            className="font-mono text-[11px] uppercase tracking-[0.18em] underline underline-offset-4"
          >
            ← All case studies
          </Link>
          <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.2em]">
            {study.category} · {study.year}
          </p>
          <h1 className={`display mt-3 ${template === "narrative" ? "text-6xl sm:text-8xl" : "text-6xl sm:text-8xl"}`}>
            {study.title}
          </h1>
          <p className={`mt-5 max-w-2xl opacity-80 ${template === "narrative" ? "text-xl leading-8" : "text-lg"}`}>
            {study.summary}
          </p>
        </div>
      </section>

      {template === "standard" ? (
        <StandardLayout study={study} body={body} stats={stats} />
      ) : template === "narrative" ? (
        <NarrativeLayout study={study} body={body} stats={stats} />
      ) : (
        <DataHeavyLayout study={study} body={body} stats={stats} />
      )}

      <section className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
        <div className="flex flex-wrap gap-2">
          {study.tags.map((tag, i) => (
            <Pill key={tag} index={i}>
              {tag}
            </Pill>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-4 font-mono text-xs uppercase tracking-[0.14em]">
          {study.github ? (
            <a href={study.github} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
              GitHub
            </a>
          ) : null}
          {study.liveDemo ? (
            <a href={study.liveDemo} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
              Live demo
            </a>
          ) : null}
        </div>
      </section>
    </>
  );
}

function Cover({ study }: { study: CaseStudy }) {
  if (study.coverImage) {
    return <Polaroid src={study.coverImage} alt={study.title} caption={study.category} wide />;
  }
  return (
    <BrowserFrame title={study.slug}>
      <div className="flex aspect-[16/10] items-center justify-center paper-grid">
        <p className="display text-6xl">{study.category}</p>
      </div>
    </BrowserFrame>
  );
}

function StatGrid({ stats }: { stats: { value: string; label: string }[] }) {
  return (
    <div className="grid grid-cols-2 gap-6">
      {stats.map((stat) => (
        <div key={`${stat.label}-${stat.value}`}>
          <div className="display text-6xl sm:text-7xl">{stat.value}</div>
          <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}

function StandardLayout({
  study,
  body,
  stats,
}: {
  study: CaseStudy;
  body: ReturnType<typeof asBody>;
  stats: { value: string; label: string }[];
}) {
  return (
    <>
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Cover study={study} />
        <div className="flex flex-col justify-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">The results</p>
          <div className="mt-4">
            <StatGrid stats={stats} />
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-3xl px-4 pb-10 sm:px-6">
        <CaseStudyBlocks blocks={body} />
      </section>
    </>
  );
}

function NarrativeLayout({
  study,
  body,
  stats,
}: {
  study: CaseStudy;
  body: ReturnType<typeof asBody>;
  stats: { value: string; label: string }[];
}) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Cover study={study} />
      {stats.length ? (
        <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4 border-y-2 border-ink py-6">
          {stats.map((stat) => (
            <div key={`${stat.label}-${stat.value}`}>
              <div className="display text-5xl">{stat.value}</div>
              <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">{stat.label}</div>
            </div>
          ))}
        </div>
      ) : null}
      <div className="mt-10">
        <CaseStudyBlocks blocks={body} largeType />
      </div>
    </section>
  );
}

function DataHeavyLayout({
  study,
  body,
  stats,
}: {
  study: CaseStudy;
  body: ReturnType<typeof asBody>;
  stats: { value: string; label: string }[];
}) {
  const charts = collectChartBlocks(body);
  const rest = collectNarrativeBlocks(body);
  return (
    <>
      <section className="border-b-2 border-ink bg-cream px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Results snapshot</p>
          <div className="mt-6 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <Cover study={study} />
              <div className="mt-8">
                <StatGrid stats={stats} />
              </div>
            </div>
            <div className="space-y-6">
              {charts.map((block) => (
                <div key={block.id} className="border-2 border-ink bg-paper p-4">
                  <CaseChart block={block} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <CaseStudyBlocks blocks={rest} />
      </section>
    </>
  );
}
