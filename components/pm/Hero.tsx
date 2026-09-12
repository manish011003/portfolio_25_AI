import { HeroCollage } from "./HeroCollage";
import { QuoteSlideshow } from "./QuoteSlideshow";
import { StatCounter } from "./StatCounter";

export function Hero({
  caseStudies,
  usersImpacted,
  thirdValue,
  thirdLabel,
}: {
  caseStudies: number;
  usersImpacted: number;
  thirdValue: string;
  thirdLabel: string;
}) {
  const thirdNumber = Number(String(thirdValue).replace(/[^\d.-]/g, ""));
  const thirdIsNumber = Number.isFinite(thirdNumber) && thirdNumber !== 0;

  return (
    <section className="relative overflow-hidden px-4 py-12 sm:px-6 sm:py-20 lg:min-h-[760px]">
      <HeroCollage />
      <div className="relative lg:max-w-[56%]">
      <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.28em] text-muted">
        Product management portfolio
      </p>
      <h1 className="display text-[clamp(2.75rem,12vw,6.5rem)] leading-[0.88] text-ink">
        Manish Biswas
      </h1>
      <p className="mt-4 max-w-xl text-base leading-relaxed text-ink/80 sm:text-xl">
        Technical product manager. I turn messy problems into shipped products —
        users, business, and tech in the same room.
      </p>
      <div className="mt-5 flex flex-wrap gap-2 lg:hidden">
        <span className="on-swatch rotate-[-3deg] border-2 border-[#111] bg-[#f5c518] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em]">
          Ship it
        </span>
        <span className="on-swatch rotate-[2deg] border-2 border-[#111] bg-[#f4b4c8] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em]">
          Users first
        </span>
        <span className="on-swatch rotate-[-1deg] border-2 border-[#111] bg-[#b8e986] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em]">
          PRD then cut
        </span>
      </div>
      <QuoteSlideshow />
      <div className="mt-10 grid max-w-3xl grid-cols-1 gap-3 min-[420px]:grid-cols-3">
        <div className="border-2 border-ink bg-paper p-4">
          <div className="display text-5xl text-ink sm:text-6xl">
            <StatCounter value={caseStudies} />
          </div>
          <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
            Case studies
          </div>
        </div>
        <div className="on-swatch border-2 border-[#111] bg-yellow p-4">
          <div className="display text-5xl sm:text-6xl">
            <StatCounter value={usersImpacted} />
          </div>
          <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-[#111]/70">
            Users impacted
          </div>
        </div>
        <div className="border-2 border-[#111] bg-[#111] p-4 text-[#fff8ee]">
          <div className="display text-5xl sm:text-6xl">
            {thirdIsNumber ? <StatCounter value={thirdNumber} /> : thirdValue}
          </div>
          <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-[#fff8ee]/70">
            {thirdLabel}
          </div>
        </div>
      </div>
      <div className="mt-8 flex flex-col gap-3 min-[420px]:flex-row">
        <a
          href="/case-studies"
          className="inline-flex items-center justify-center border-2 border-[#111] bg-[#111] px-5 py-3 font-mono text-xs uppercase tracking-[0.16em] text-[#fff8ee]"
        >
          Explore case studies
        </a>
        <a
          href="/#chat"
          className="inline-flex items-center justify-center border-2 border-ink bg-paper px-5 py-3 font-mono text-xs uppercase tracking-[0.16em] text-ink"
        >
          Chat with my AI twin
        </a>
      </div>
      </div>
    </section>
  );
}
