import Link from "next/link";
import type { CaseStudy } from "@prisma/client";
import { isDarkHex } from "@/lib/slug";
import { BrowserFrame } from "./BrowserFrame";

export function CaseStudyGrid({ studies }: { studies: CaseStudy[] }) {
  if (studies.length === 0) {
    return (
      <p className="px-4 py-16 text-center text-muted">
        Case studies will show up here once the CMS is connected.
      </p>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {studies.map((study) => {
        const dark = isDarkHex(study.themeColor);
        return (
          <Link
            key={study.id}
            href={`/case-studies/${study.slug}`}
            className="group relative block outline-offset-4"
          >
            <span
              aria-hidden="true"
              className="absolute -top-2 left-4 z-10 border-2 border-ink bg-paper px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em]"
            >
              File
            </span>
            <div
              className="border-2 border-ink p-3 pt-5"
              style={{ background: study.themeColor }}
            >
              <BrowserFrame title={study.slug} className="shadow-none">
                {study.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={study.coverImage}
                    alt=""
                    className="aspect-[16/10] w-full object-cover"
                  />
                ) : (
                  <div className="flex aspect-[16/10] items-center justify-center paper-lines">
                    <p className="display px-4 text-center text-4xl text-ink/80">
                      {study.category || study.title}
                    </p>
                  </div>
                )}
              </BrowserFrame>
              <div className="mt-3 flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em]">
                <span
                  className="rounded-full px-2 py-0.5"
                  style={{
                    background: dark ? "#fff8ee" : "#111",
                    color: dark ? "#111" : "#fff8ee",
                  }}
                >
                  {study.category}
                </span>
                <span style={{ color: dark ? "rgba(255,248,238,0.72)" : "rgba(17,17,17,0.68)" }}>
                  {study.year}
                </span>
              </div>
              <h2
                className="display mt-2 text-3xl leading-none sm:text-4xl"
                style={{ color: dark ? "#fff8ee" : "#111" }}
              >
                {study.title}
              </h2>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
