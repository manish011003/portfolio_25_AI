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
        className="border-b-2 border-ink py-14 sm:py-20"
        style={{ background: study.themeColor, color: ink }}
      >
        <div className="page-shell">
          <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-14 xl:gap-16">
            <div className="min-w-0">
              <Link
                href="/case-studies"
                className="font-mono text-[11px] uppercase tracking-[0.18em] underline underline-offset-4"
              >
                ← All case studies
              </Link>
              <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.2em]">
                {study.category} · {study.year}
              </p>
              <h1 className="display mt-3 text-[clamp(2.75rem,7vw,5.75rem)]">
                {study.title}
              </h1>
            </div>
            <div className="min-w-0 lg:pb-1">
              <p
                className={`max-w-xl opacity-85 ${
                  template === "narrative" ? "text-xl leading-8" : "text-lg leading-8"
                }`}
              >
                {study.summary}
              </p>
            </div>
          </div>
        </div>
      </section>

      {template === "standard" ? (
        <StandardLayout study={study} body={body} stats={stats} />
      ) : template === "narrative" ? (
        <NarrativeLayout study={study} body={body} stats={stats} />
      ) : (
        <DataHeavyLayout study={study} body={body} stats={stats} />
      )}

      <section className="page-shell pb-16 pt-4">
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

function StatValue({ value }: { value: string }) {
  const parts = value.split(/\s*→\s*/);
  const long = value.length > 14;
  const size = long
    ? "text-[clamp(1.75rem,4vw,3.25rem)]"
    : "text-[clamp(2.5rem,5vw,4.25rem)]";

  if (parts.length === 2 && parts[0] && parts[1]) {
    return (
      <div className={`display flex flex-wrap items-baseline gap-x-2 gap-y-1 ${size}`}>
        <span>{parts[0]}</span>
        <span className="text-[0.55em] opacity-45" aria-hidden>
          →
        </span>
        <span>{parts[1]}</span>
      </div>
    );
  }

  return <div className={`display ${size}`}>{value}</div>;
}

function StatGrid({ stats }: { stats: { value: string; label: string }[] }) {
  const cols =
    stats.length <= 2
      ? "sm:grid-cols-2"
      : stats.length === 3
        ? "sm:grid-cols-3"
        : "sm:grid-cols-2";

  return (
    <div className={`grid grid-cols-1 gap-x-8 gap-y-8 ${cols}`}>
      {stats.map((stat) => (
        <div key={`${stat.label}-${stat.value}`} className="min-w-0">
          <StatValue value={stat.value} />
          <div className="mt-2 max-w-[18rem] font-mono text-[11px] uppercase leading-4 tracking-[0.14em] text-muted">
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
      <section className="page-shell py-12 sm:py-16">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14">
          <Cover study={study} />
          <div className="flex min-w-0 flex-col justify-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">The results</p>
            <div className="mt-5">
              <StatGrid stats={stats} />
            </div>
          </div>
        </div>
      </section>
      <section className="page-shell pb-10">
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
    <section className="page-shell py-12 sm:py-16">
      <div className="mx-auto max-w-4xl">
        <Cover study={study} />
      </div>
      {stats.length ? (
        <div className="mt-12 border-y-2 border-ink py-8">
          <StatGrid stats={stats} />
        </div>
      ) : null}
      <div className="mt-12">
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
      <section className="border-b-2 border-ink bg-cream py-12 sm:py-16">
        <div className="page-shell">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Results snapshot</p>
          <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
            <div className="min-w-0">
              <Cover study={study} />
              <div className="mt-8">
                <StatGrid stats={stats} />
              </div>
            </div>
            <div className="min-w-0 space-y-6">
              {charts.map((block) => (
                <div key={block.id} className="border-2 border-ink bg-paper p-4">
                  <CaseChart block={block} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="page-shell py-12 sm:py-16">
        <CaseStudyBlocks blocks={rest} />
      </section>
    </>
  );
}
