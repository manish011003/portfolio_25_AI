import type { CSSProperties } from "react";

const FONTS =
  "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Roboto:wght@400;500;700&family=DM+Sans:wght@400;500&family=Raleway:wght@500;600&display=swap";

/** Runs before paint: add the `js` flag and apply the saved (or system) colour scheme. */
const THEME_INIT =
  'var d=document.documentElement;d.classList.add("js");try{var t=localStorage.getItem("blog-theme");if(t!=="dark"&&t!=="light")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";d.setAttribute("data-blog-theme",t)}catch(e){}';

const del = (value: string) => ({ "--del": value }) as CSSProperties;

/** Stylesheets and the `js` flag the blog design needs; plain tags so they unmount with the page. */
export function BlogHead() {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="stylesheet" href={FONTS} />
      <link rel="stylesheet" href="/blog.css" />
      <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
    </>
  );
}

export function BlogHeader({ search = false }: { search?: boolean }) {
  return (
    <header className="blog-header">
      <nav className="blog-nav" aria-label="Primary">
        <div className="nav-brand" data-anim="slide-from-top" style={{ "--dur": "2s", "--del": ".25s" } as CSSProperties}>
          <a href="/index.html">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand-logo.png" alt="" width={36} height={36} />
            <span>
              <b>Manish</b> Biswas
            </span>
          </a>
        </div>
        <button type="button" className="theme-toggle" id="theme-toggle" aria-label="Switch to dark mode" title="Toggle dark mode">
          <svg className="ti-moon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
          </svg>
          <svg className="ti-sun" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </svg>
        </button>
        <button className="blog-nav-toggle" id="blog-nav-toggle" aria-label="Toggle navigation" aria-expanded="false" aria-controls="blog-nav-links">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div className="nav-links" id="blog-nav-links">
          <a href="/index.html" data-anim="fade-in" style={del(".55s")}>Portfolio</a>
          <a href="/pm" data-anim="fade-in" style={del(".65s")}>PM Portfolio</a>
          <a href="/blog.html#posts" className="active" aria-current="location" data-anim="fade-in" style={del(".75s")}>Posts</a>
          {search ? (
            <div className="blog-search" data-anim="fade-in" style={{ "--dur": "1.5s", "--del": ".85s" } as CSSProperties}>
              <input type="search" id="blog-search" placeholder="Search posts..." aria-label="Search posts" />
              <span className="search-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
              </span>
            </div>
          ) : null}
        </div>
      </nav>
    </header>
  );
}

export function BlogFooter() {
  return (
    <footer className="blog-footer">
      <div className="blog-container">
        <div className="foot-top">
          <div className="foot-brand">
            <a href="/index.html" className="foot-logo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand-logo.png" alt="" width={36} height={36} />
              <span>
                <b>Manish</b> Biswas
              </span>
            </a>
            <p>AI Engineer × Product Manager</p>
          </div>
          <i className="dots-row" aria-hidden="true"></i>
        </div>
        <div className="foot-grid">
          <div className="foot-col">
            <h3>Categories</h3>
            <div className="foot-links row">
              <a href="/blog.html#posts">AI/ML</a>
              <a href="/blog.html#posts">Product</a>
              <a href="/blog.html#posts">Engineering</a>
            </div>
          </div>
          <div className="foot-col">
            <h3>Explore</h3>
            <div className="footer-links foot-links">
              <a href="/index.html">AI Portfolio</a>
              <a href="/pm">PM Portfolio</a>
              <a href="https://github.com/manish011003" target="_blank" rel="noopener noreferrer">GitHub</a>
            </div>
          </div>
          <div className="foot-col">
            <h3>Join Us</h3>
            <div className="socials">
              <a href="https://github.com/manish011003" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 .5a11.5 11.5 0 0 0-3.64 22.42c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" /></svg>
              </a>
              <a href="https://x.com/realmanishb" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M18.9 2H22l-7.3 8.3L23 22h-6.7l-5.2-6.8L5 22H2l7.8-8.9L1.5 2h6.9l4.7 6.2L18.9 2Zm-1.2 18h1.8L7.4 3.9H5.5L17.7 20Z" /></svg>
              </a>
            </div>
          </div>
        </div>
        <div className="foot-line"></div>
        <p className="foot-copy">
          &copy; <span id="blog-year" suppressHydrationWarning></span> Manish Biswas. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
