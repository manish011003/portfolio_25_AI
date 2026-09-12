import { DoodleArrow, DoodleCircle } from "./Doodles";

export function HeroCollage() {
  return (
    <div
      id="hero-collage"
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 right-0 hidden w-[54%] overflow-hidden lg:block"
    >
      <div
        className="float-note absolute right-[36%] top-[6%] w-52 border-2 border-[#111] bg-[#f5c518] p-4 shadow-[8px_10px_0_rgba(17,17,17,0.12)]"
        style={{ "--tilt": "-7deg" } as React.CSSProperties}
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#111]/60">
          Sticky
        </p>
        <p className="display mt-1 text-6xl text-[#111]">Ship it</p>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[#111]/70">
          v1 over perfect
        </p>
      </div>

      <div
        className="float-note-slow absolute right-[8%] top-[22%] w-44 border-2 border-[#111] bg-[#f4b4c8] p-4 shadow-[8px_10px_0_rgba(17,17,17,0.12)]"
        style={{ "--tilt": "6deg" } as React.CSSProperties}
      >
        <p className="display text-5xl text-[#111]">Users</p>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[#111]/70">
          start here
        </p>
      </div>

      <div className="float-wiggle absolute right-[42%] top-[38%] flex size-20 items-center justify-center rounded-full border-2 border-[#111] bg-[#f5c518] text-6xl text-[#111]">
        ☺
      </div>

      <div
        className="float-note absolute right-[14%] top-[48%] w-40 border-2 border-[#111] bg-[#fff8ee] p-4 shadow-[8px_10px_0_rgba(17,17,17,0.12)]"
        style={{ "--tilt": "-3deg", animationDelay: "0.6s" } as React.CSSProperties}
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#111]/60">
          Now
        </p>
        <p className="display mt-1 text-5xl text-[#111]">11k</p>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[#111]/70">
          users touched
        </p>
      </div>

      <div
        className="float-note-slow absolute right-[40%] top-[62%] w-44 border-2 border-[#111] bg-[#b8e986] p-4 shadow-[8px_10px_0_rgba(17,17,17,0.12)]"
        style={{ "--tilt": "5deg", animationDelay: "1.4s" } as React.CSSProperties}
      >
        <p className="display text-5xl text-[#111]">PRD</p>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[#111]/70">
          then cut
        </p>
      </div>

      <DoodleCircle className="absolute right-[4%] top-[12%] w-52 text-red" />
      <DoodleArrow className="float-note-slow absolute right-[48%] top-[14%] w-32 text-[#111]" />
      <span className="absolute right-[28%] top-[34%] h-5 w-[72px] rotate-[-10deg] bg-[#f3e3a0]/90 shadow-sm" />
      <span className="absolute right-[18%] top-[72%] h-5 w-[64px] rotate-[8deg] bg-[#f3e3a0]/90 shadow-sm" />
    </div>
  );
}
