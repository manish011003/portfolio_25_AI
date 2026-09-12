export function Footer() {
  return (
    <footer className="bg-ink px-4 py-8 text-cream sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cream/70">
          © {new Date().getFullYear()} Manish Biswas. Product management portfolio.
        </p>
        <div className="flex flex-wrap gap-4 font-mono text-[11px] uppercase tracking-[0.16em]">
          <a href="/" className="hover:text-yellow">
            AI portfolio
          </a>
          <a href="/case-studies" className="hover:text-yellow">
            Case studies
          </a>
          <a href="/blog.html" className="hover:text-yellow">
            Blog
          </a>
          <a
            href="https://github.com/manish011003"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-yellow"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
