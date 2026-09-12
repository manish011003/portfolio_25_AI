import Link from "next/link";
import type { CaseStudy } from "@prisma/client";
import { isDarkHex } from "@/lib/slug";
import { asStats } from "@/lib/queries";
import { BrowserFrame } from "./BrowserFrame";
import { Pill } from "./Pills";
import { Polaroid } from "./Polaroid";

export function CaseStudyBlock({
  study,
  index,
}: {
  study: CaseStudy;
  index: number;
}) {
  const dark = isDarkHex(study.themeColor);
  const ink = dark ? "#fff8ee" : "#111111";
  const muted = dark ? "rgba(255,248,238,0.72)" : "rgba(17,17,17,0.68)";
  const stats = asStats(study.stats);
  const rotate = index % 2 === 0 ? "-2deg" : "2.4deg";

  return (
    <article
      className="border-b-2 border-ink px-4 py-16 sm:px-6 sm:py-20"
      style={{ background: study.themeColor, color: ink }}
    >
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
        <div className={index % 2 === 1 ? "lg:order-2" : ""}>
          {study.coverImage ? (
            <Polaroid
              src={study.coverImage}
              alt={`${study.title} cover`}
              caption={study.category}
              rotate={rotate}
            />
          ) : (
            <BrowserFrame title={study.slug}>
              <div className="flex aspect-[16/10] items-center justify-center paper-lines">
                <p className="display px-6 text-center text-6xl text-ink/80">
                  {study.category}
                </p>
              </div>
            </BrowserFrame>
          )}
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.16em]">
            <span
              className="rounded-full px-3 py-1"
              style={{ background: dark ? "#fff8ee" : "#111", color: dark ? "#111" : "#fff8ee" }}
            >
              {study.category}
            </span>
            <span style={{ color: muted }}>{study.year}</span>
          </div>
          <h3 className="display mt-4 text-5xl sm:text-7xl">{study.title}</h3>
          <p className="mt-4 max-w-xl text-base leading-relaxed" style={{ color: muted }}>
            {study.summary}
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={`${stat.label}-${stat.value}`}>
                <div className="display text-5xl sm:text-6xl">{stat.value}</div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: muted }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {study.tags.map((tag, i) => (
              <Pill key={tag} index={i + index}>
                {tag}
              </Pill>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-x-4 gap-y-2 font-mono text-xs uppercase tracking-[0.14em]">
            <Link href={`/case-studies/${study.slug}`} className="underline underline-offset-4">
              Read the case →
            </Link>
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
        </div>
      </div>
    </article>
  );
}
