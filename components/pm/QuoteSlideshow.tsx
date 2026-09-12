"use client";

import { useEffect, useId, useState } from "react";

const QUOTES = [
  {
    text: "The job of a product manager is to discover a product that is valuable, usable, and feasible.",
    attribution: "Marty Cagan",
    tilt: "-1.6deg",
  },
  {
    text: "You've got to start with the customer experience and work back toward the technology.",
    attribution: "Steve Jobs",
    tilt: "2.2deg",
  },
  {
    text: "If you are not embarrassed by the first version of your product, you’ve launched too late.",
    attribution: "Reid Hoffman",
    tilt: "-0.8deg",
  },
  {
    text: "Customers don't care about your solution. They care about their problems.",
    attribution: "Dave McClure",
    tilt: "1.4deg",
  },
];

const INTERVAL_MS = 7000;

function randomOther(current: number) {
  if (QUOTES.length < 2) return current;
  let next = current;
  while (next === current) {
    next = Math.floor(Math.random() * QUOTES.length);
  }
  return next;
}

function randomNudge(tilt: string) {
  const base = Number.parseFloat(tilt) || 0;
  return {
    x: Math.round(Math.random() * 36 - 10),
    rotate: `${(base + Math.random() * 2.4 - 1.2).toFixed(2)}deg`,
  };
}

export function QuoteSlideshow() {
  const labelId = useId();
  const [index, setIndex] = useState(0);
  const [nudge, setNudge] = useState({ x: 0, rotate: QUOTES[0].tilt });
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const quote = QUOTES[index];

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (paused || reduceMotion) return;
    const timer = window.setInterval(() => {
      setIndex((current) => randomOther(current));
    }, INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [paused, reduceMotion]);

  useEffect(() => {
    setNudge(randomNudge(quote.tilt));
  }, [index, quote.tilt]);

  function go(next: number) {
    setIndex((next + QUOTES.length) % QUOTES.length);
  }

  return (
    <div
      className="mt-8 max-w-3xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
    >
      <figure aria-roledescription="carousel" aria-label="Product management quotes">
        <blockquote
          key={`${quote.attribution}-${nudge.rotate}`}
          className={reduceMotion ? "" : "quote-in"}
          style={
            {
              "--tilt": nudge.rotate,
              "--nudge-x": `${nudge.x}px`,
              transform: `translateX(${nudge.x}px) rotate(${nudge.rotate})`,
            } as React.CSSProperties
          }
        >
          <p
            id={labelId}
            className="display text-[clamp(1.85rem,5.6vw,3.6rem)] leading-[0.94] text-ink"
            aria-live="polite"
          >
            “{quote.text}”
          </p>
          <figcaption className="mt-4 font-mono text-xs uppercase tracking-[0.16em] text-muted">
            — {quote.attribution}
          </figcaption>
        </blockquote>
        <div className="mt-4 flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.16em]">
          <button
            type="button"
            onClick={() => go(index - 1)}
            className="text-ink underline underline-offset-4"
            aria-label="Previous quote"
          >
            Prev
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            className="text-ink underline underline-offset-4"
            aria-label="Next quote"
          >
            Next
          </button>
        </div>
      </figure>
    </div>
  );
}
