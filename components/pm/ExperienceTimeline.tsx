"use client";

import { useState } from "react";
import type { Experience } from "@prisma/client";
import { formatExperienceRange } from "@/lib/experience";
import { Polaroid } from "./Polaroid";

const ROW_COLORS = ["#fff8ee", "#f5c518", "#f4b4c8", "#b8e986", "#7eb8e8"];

export function ExperienceTimeline({ entries }: { entries: Experience[] }) {
  const [pinnedId, setPinnedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const expandedId = pinnedId ?? hoveredId;

  if (entries.length === 0) {
    return (
      <p className="mt-8 text-ink/70">
        Experience will show up here once it is added in the CMS.
      </p>
    );
  }

  return (
    <ol className="relative mt-10 border-l-2 border-ink">
      {entries.map((entry, index) => {
        const open = expandedId === entry.id;
        const detailsId = `experience-${entry.id}`;
        return (
          <li
            key={entry.id}
            className="relative pl-5 sm:pl-8"
            onMouseEnter={() => setHoveredId(entry.id)}
            onMouseLeave={() => setHoveredId((current) => (current === entry.id ? null : current))}
          >
            <span
              aria-hidden="true"
              className="absolute -left-[7px] top-6 size-3 border-2 border-ink bg-yellow"
            />
            <article
              className="on-swatch mb-4 border-2 border-[#111] p-4 sm:p-5"
              style={{ background: ROW_COLORS[index % ROW_COLORS.length] }}
            >
              <button
                type="button"
                className="w-full text-left"
                aria-expanded={open}
                aria-controls={detailsId}
                onClick={() =>
                  setPinnedId((current) => (current === entry.id ? null : entry.id))
                }
                onFocus={() => setHoveredId(entry.id)}
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#111]/70">
                  {formatExperienceRange(entry.startDate, entry.endDate)}
                </p>
                <h3 className="display mt-1 text-3xl leading-none sm:text-5xl">{entry.role}</h3>
                <p className="mt-2 font-mono text-xs uppercase tracking-[0.16em]">{entry.company}</p>
                <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-[#111]/60">
                  {open ? "Hide details" : "Tap or hover for details"}
                </p>
              </button>
              <div
                id={detailsId}
                hidden={!open}
                className="mt-4 border-t-2 border-[#111] pt-4"
              >
                {entry.description ? (
                  <p className="max-w-2xl text-sm leading-relaxed text-[#111]/80 sm:text-base">
                    {entry.description}
                  </p>
                ) : null}
                {entry.images.length ? (
                  <div className="mt-6 grid gap-6 sm:grid-cols-2">
                    {entry.images.map((src, imageIndex) => (
                      <Polaroid
                        key={`${src}-${imageIndex}`}
                        src={src}
                        alt={`${entry.role} at ${entry.company}`}
                        rotate={imageIndex % 2 === 0 ? "-2deg" : "2.4deg"}
                      />
                    ))}
                  </div>
                ) : null}
              </div>
            </article>
          </li>
        );
      })}
    </ol>
  );
}
