"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { isDarkHex } from "@/lib/slug";
import { BrowserFrame } from "./BrowserFrame";

export type ShowcaseStudy = {
  id: string;
  slug: string;
  title: string;
  category: string;
  year: number;
  coverImage: string | null;
  themeColor: string;
};

const INTERVAL_MS = 6500;

export function Showcase({ studies }: { studies: ShowcaseStudy[] }) {
  const labelId = useId();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const count = studies.length;
  const study = studies[index];

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (count < 2 || paused || reduceMotion) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [count, paused, reduceMotion]);

  if (!study) {
    return (
      <p className="px-4 py-16 text-center text-muted">
        Case studies will show up here once the CMS is connected.
      </p>
    );
  }

  const dark = isDarkHex(study.themeColor);
  const ink = dark ? "#fff8ee" : "#111111";
  const muted = dark ? "rgba(255,248,238,0.72)" : "rgba(17,17,17,0.68)";

  function go(next: number) {
    setIndex((next + count) % count);
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
    >
      <article
        aria-labelledby={labelId}
        aria-roledescription="carousel"
        aria-label="Featured case studies"
        className="border-b-2 border-ink px-4 py-12 sm:px-6 sm:py-16"
        style={{ background: study.themeColor, color: ink }}
      >
        <div className="mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-2">
          <Link
            href="/case-studies"
            className="block outline-offset-4"
            aria-label={`View all case studies, currently showing ${study.title}`}
          >
            <BrowserFrame title={study.slug}>
              {study.coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={study.coverImage}
                  alt=""
                  className="aspect-[16/10] w-full object-cover"
                />
              ) : (
                <div className="flex aspect-[16/10] items-center justify-center paper-lines">
                  <p className="display px-6 text-center text-5xl text-ink/80 sm:text-6xl">
                    {study.category || study.title}
                  </p>
                </div>
              )}
            </BrowserFrame>
          </Link>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.28em]" style={{ color: muted }}>
              Featured file {index + 1} / {count}
            </p>
            <p
              className="mt-4 inline-flex rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-[0.16em]"
              style={{ background: dark ? "#fff8ee" : "#111", color: dark ? "#111" : "#fff8ee" }}
            >
              {study.category}
            </p>
            <h3 id={labelId} className="display mt-4 text-4xl leading-none sm:text-6xl lg:text-7xl" aria-live="polite">
              {study.title}
            </h3>
            <p className="mt-3 font-mono text-xs uppercase tracking-[0.16em]" style={{ color: muted }}>
              {study.year}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {count > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={() => go(index - 1)}
                    className="inline-flex min-h-11 min-w-11 items-center justify-center border-2 border-current px-3 font-mono text-[11px] uppercase tracking-[0.16em]"
                    aria-label="Previous case study"
                  >
                    Prev
                  </button>
                  <button
                    type="button"
                    onClick={() => go(index + 1)}
                    className="inline-flex min-h-11 min-w-11 items-center justify-center border-2 border-current px-3 font-mono text-[11px] uppercase tracking-[0.16em]"
                    aria-label="Next case study"
                  >
                    Next
                  </button>
                </>
              ) : null}
              <Link
                href="/case-studies"
                className="inline-flex min-h-11 items-center border-2 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em]"
                style={{
                  background: dark ? "#fff8ee" : "#111",
                  color: dark ? "#111" : "#fff8ee",
                  borderColor: dark ? "#fff8ee" : "#111",
                }}
              >
                View all case studies →
              </Link>
            </div>
            {count > 1 ? (
              <div className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label="Showcase slides">
                {studies.map((item, i) => (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={i === index}
                    aria-label={`Show ${item.title}`}
                    onClick={() => setIndex(i)}
                    className="h-2.5 w-7 border-2 border-current"
                    style={{ background: i === index ? ink : "transparent" }}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </article>
    </div>
  );
}
