import type { Skill } from "@prisma/client";
import { Tape } from "./Doodles";

const BACKGROUNDS = ["#fff8ee", "#f4b4c8", "#b8e986", "#7eb8e8", "#f5c518", "#ffffff"];

export function SkillsGrid({ skills }: { skills: Skill[] }) {
  return (
    <section id="skills" className="border-b-2 border-ink px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted">
          The toolkit
        </p>
        <h2 className="display mt-2 text-5xl sm:text-7xl lg:text-8xl">Core competencies</h2>
        <p className="mt-4 max-w-xl text-ink/75">
          A toolkit honed across engineering, design, and business.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((skill, index) => (
            <article
              key={skill.id}
              className="on-swatch relative border-2 border-[#111] p-5"
              style={{ background: BACKGROUNDS[index % BACKGROUNDS.length] }}
            >
              {index % 2 === 0 ? <Tape /> : null}
              <div className="text-3xl" aria-hidden="true">
                {skill.icon}
              </div>
              <h3 className="display mt-3 text-4xl">{skill.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#111]/75">{skill.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
