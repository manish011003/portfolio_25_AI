export function ContactBand() {
  return (
    <section id="contact" className="on-swatch border-b-2 border-[#111] bg-mint px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-3xl text-center">
        <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full border-2 border-[#111] bg-yellow text-5xl">
          ☺
        </div>
        <h2 className="display text-5xl sm:text-7xl lg:text-8xl">Let&apos;s talk</h2>
        <p className="mx-auto mt-4 max-w-md text-lg text-[#111]/75">
          Open to PM and AI-product roles. Got a messy problem? I like those.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="mailto:me@manishb.in"
            className="inline-flex items-center justify-center border-2 border-[#111] bg-[#111] px-5 py-3 font-mono text-xs uppercase tracking-[0.16em] text-[#fff8ee]"
          >
            Email me
          </a>
          <a
            href="https://linkedin.com/in/manish-biswas"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center border-2 border-[#111] bg-[#fff8ee] px-5 py-3 font-mono text-xs uppercase tracking-[0.16em] text-[#111]"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </section>
  );
}
