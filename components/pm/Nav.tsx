"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

const LINKS = [
  { href: "/", label: "Portfolio" },
  { href: "/blog.html", label: "Blog" },
  { href: "/case-studies", label: "Work" },
  { href: "/pm#experience", label: "Experience" },
  { href: "/pm#skills", label: "Skills" },
];

export function Nav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b-2 border-ink bg-paper/95 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="shrink-0 font-mono text-sm font-semibold tracking-[0.18em] uppercase"
        >
          MB<span className="text-red">.</span>
        </Link>
        <div
          id="pm-nav"
          className={`${open ? "flex" : "hidden"} absolute left-0 right-0 top-full max-h-[calc(100dvh-3.5rem)] flex-col overflow-y-auto border-b-2 border-ink bg-paper px-4 py-3 lg:static lg:flex lg:max-h-none lg:flex-1 lg:flex-row lg:items-center lg:justify-end lg:gap-5 lg:overflow-visible lg:border-0 lg:bg-transparent lg:p-0`}
        >
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-ink hover:text-red"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="mailto:me@manishb.in"
            className="mt-1 inline-flex items-center justify-center whitespace-nowrap border-2 border-ink bg-ink px-3 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-cream lg:mt-0"
            onClick={() => setOpen(false)}
          >
            Contact
          </a>
        </div>
        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <ThemeToggle />
          <button
            type="button"
            className="flex size-10 flex-col items-center justify-center gap-1.5 border-2 border-ink bg-paper lg:hidden"
            aria-expanded={open}
            aria-controls="pm-nav"
            aria-label="Toggle navigation"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="block h-0.5 w-5 bg-ink" />
            <span className="block h-0.5 w-5 bg-ink" />
            <span className="block h-0.5 w-5 bg-ink" />
          </button>
        </div>
      </nav>
    </header>
  );
}
