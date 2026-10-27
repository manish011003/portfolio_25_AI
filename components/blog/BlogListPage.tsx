import type { CSSProperties, ReactNode } from "react";
import { categoryEmoji, categoryLabel, formatPostDate, postHref, type PublicBlogPost } from "@/lib/blog";
import { BlogFooter, BlogHeader } from "./BlogChrome";
import { NewsletterForm } from "./NewsletterForm";

const del = (value: string) => ({ "--del": value }) as CSSProperties;
const stagger = (i: number, base: number) => del(`${(base + i * 0.12).toFixed(2)}s`);

const Chevron = ({ dir }: { dir: "l" | "r" }) => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d={dir === "l" ? "m15 4-8 8 8 8" : "m9 4 8 8-8 8"} />
  </svg>
);

function Art({ post }: { post: PublicBlogPost }) {
  return (
    <span className="art" data-cat={post.category} aria-hidden="true">
      {post.coverImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.coverImage} alt="" loading="lazy" />
      ) : (
        post.emoji || categoryEmoji(post.category)
      )}
    </span>
  );
}

function SecHead({ title, dark, children }: { title: string; dark?: boolean; children?: ReactNode }) {
  return (
    <div className={`sec-head${dark ? " on-dark" : ""}`}>
      <div className="sec-title" data-anim="slide-from-bottom">
        <h2>{title}</h2>
      </div>
      <i className="sec-line" aria-hidden="true"></i>
      {children}
    </div>
  );
}

function Meta({ post }: { post: PublicBlogPost }) {
  return (
    <p className="pm-meta">
      <span className="cat">{categoryLabel(post.category)}</span>
      <i className="dot"></i>
      <time>{formatPostDate(post.publishedAt)}</time>
    </p>
  );
}

export function BlogListPage({ posts }: { posts: PublicBlogPost[] }) {
  const [big, ...rest] = posts;

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <BlogHeader search />
      <main className="blog-main" id="main">
        <div className="zone-top">
          <section className="blog-hero">
            <div className="blog-container">
              <i className="deco dots d1" data-parallax="y" data-speed="-.08" aria-hidden="true"></i>
              <i className="deco ring r1" data-parallax="x" data-speed=".05" aria-hidden="true"></i>
              <i className="deco ring r2" data-parallax="y" data-speed=".06" aria-hidden="true"></i>
              <i className="deco dots d2" data-parallax="y" data-speed=".07" aria-hidden="true"></i>
              <div className="hero-grid">
                <div className="hero-image" data-anim="zoom-in">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/og-image.png" alt="Manish Biswas — AI Engineer × Product Manager" width={1200} height={630} />
                </div>
                <div className="hero-left">
                  <div className="hero-card" data-anim="fade-in-left" style={{ "--dur": "1.5s", "--del": ".5s" } as CSSProperties}>
                    <p className="blog-eyebrow hero-meta">THE NOTEBOOK</p>
                    <h1 className="blog-title">Thoughts &amp; Insights</h1>
                  </div>
                  <p className="blog-subtitle hero-excerpt" data-anim="fade-in-up" style={del(".9s")}>
                    Exploring AI, product management, and engineering — one essay at a time.
                  </p>
                </div>
              </div>
            </div>
          </section>
          {posts.length ? (
            <section className="featured" aria-label="Featured posts">
              <div className="blog-container">
                <SecHead title="Featured Posts" dark>
                  <a className="sec-more" href="#posts" data-anim="fade-in">
                    View All Posts{" "}
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 4 8 8-8 8" /></svg>
                  </a>
                  <span className="car-arrows head-arrows">
                    <button type="button" className="car-prev" aria-label="Previous posts"><Chevron dir="l" /></button>
                    <button type="button" className="car-next" aria-label="Next posts"><Chevron dir="r" /></button>
                  </span>
                </SecHead>
              </div>
              <div className="carousel bleed" data-carousel data-anim="fade-in" style={del(".5s")}>
                <div className="car-track" id="featured-track">
                  {posts.map((p) => (
                    <div className="car-item" key={p.slug}>
                      <a className="feat-card" href={postHref(p)}>
                        <Art post={p} />
                        <div className="fc-body">
                          <h3>{p.title}</h3>
                          <Meta post={p} />
                        </div>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ) : null}
        </div>

        {big ? (
          <section className="recent" aria-label="Latest posts">
            <div className="blog-container">
              <SecHead title="Latest Notes" />
              <div className="recent-panel" data-anim="fade-in" style={del(".35s")}>
                <i className="deco dots d3" data-parallax="y" data-speed=".05" aria-hidden="true"></i>
                <i className="deco dots d3b" aria-hidden="true"></i>
                <div className="recent-big" id="recent-big" data-anim="scale-down">
                  <a href={postHref(big)}>
                    <Art post={big} />
                    <div className="rb-body">
                      <h3>{big.title}</h3>
                      <Meta post={big} />
                    </div>
                  </a>
                </div>
                <div className="recent-list" id="recent-list">
                  {rest.slice(0, 3).map((p, i) => (
                    <a className="r-item" href={postHref(p)} key={p.slug} data-anim="fade-in-up" style={stagger(i, 0.6)}>
                      <span className="r-thumb"><Art post={p} /></span>
                      <span>
                        <span className="r-meta">
                          <span>{categoryLabel(p.category)}</span>
                          <i className="dot"></i>
                          <time>{formatPostDate(p.publishedAt)}</time>
                        </span>
                        <h3>{p.title}</h3>
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ) : null}

        <div className="blog-container" id="posts">
          <div className="posts-grid">
            <div className="posts-col">
              <SecHead title="All Posts" />
              <div className="blog-posts">
                {posts.map((p, i) => (
                  <article className="blog-post" data-category={p.category} key={p.slug} data-anim="fade-in" style={del(`${Math.min(i, 3) * 0.1}s`)}>
                    <div className="post-image">
                      {p.coverImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.coverImage} alt="" loading="lazy" />
                      ) : (
                        <div className="post-image-placeholder">{p.emoji || categoryEmoji(p.category)}</div>
                      )}
                    </div>
                    <div className="post-content">
                      <div className="post-meta">
                        <span className="post-category">{categoryLabel(p.category)}</span>
                        <span className="post-date">{formatPostDate(p.publishedAt)}</span>
                        {p.readMinutes ? <span className="post-read">{p.readMinutes} min read</span> : null}
                      </div>
                      <h2 className="post-title">{p.title}</h2>
                      <p className="post-excerpt">{p.excerpt}</p>
                      <a href={postHref(p)} className="read-more">Read more →</a>
                    </div>
                  </article>
                ))}
              </div>
              <p className="blog-empty" id="blog-empty" hidden>No posts match your search yet — try a different keyword.</p>
            </div>
            <aside className="side-col" aria-label="More to read">
              <SecHead title="More To Read" />
              <div className="popular" id="popular-list">
                {posts.slice(0, 4).map((p, i) => (
                  <a className="pop-item" href={postHref(p)} key={p.slug} data-anim="fade-in-up" style={stagger(i, 0.4)}>
                    <span className="pop-thumb"><Art post={p} /></span>
                    <span>
                      <span className="pop-meta">
                        <span className="cat">{categoryLabel(p.category)}</span>
                        <i className="dot"></i>
                        <time>{formatPostDate(p.publishedAt)}</time>
                      </span>
                      <h3>{p.title}</h3>
                    </span>
                  </a>
                ))}
              </div>
            </aside>
          </div>
        </div>

        <section className="topics" aria-label="Browse by topic">
          <div className="topics-panel">
            <i className="deco dots d4" data-parallax="y" data-speed=".05" aria-hidden="true"></i>
            <div className="topics-text">
              <SecHead title="Browse By Topic" dark />
              <p data-anim="fade-in" style={del(".5s")}>Filter the notebook by what you care about.</p>
              <div className="car-arrows" data-anim="fade-in" style={del(".7s")}>
                <button type="button" className="car-prev" aria-label="Previous topics"><Chevron dir="l" /></button>
                <button type="button" className="car-next" aria-label="Next topics"><Chevron dir="r" /></button>
              </div>
            </div>
          </div>
          <div className="carousel topics-carousel" data-carousel data-anim="fade-in" style={del(".4s")}>
            <div className="car-track filter-track" role="tablist" aria-label="Filter posts">
              <button className="filter-btn topic-card active" data-filter="all"><span className="art art-all">✨</span><b>All</b></button>
              <button className="filter-btn topic-card" data-filter="ai"><span className="art art-ai">🤖</span><b>AI/ML</b></button>
              <button className="filter-btn topic-card" data-filter="pm"><span className="art art-pm">🎯</span><b>Product</b></button>
              <button className="filter-btn topic-card" data-filter="engineering"><span className="art art-engineering">💪</span><b>Engineering</b></button>
            </div>
          </div>
        </section>

        {posts.length ? (
          <section className="spotlight" aria-label="Spotlight">
            <div className="blog-container">
              <SecHead title="Spotlight" />
              <div className="spot-grid" id="spot-grid">
                {posts.slice(0, 4).map((p, i) => (
                  <a className="spot-card" href={postHref(p)} key={p.slug} data-anim="fade-in-up" style={stagger(i, 0.2)}>
                    <div className="s-img"><Art post={p} /></div>
                    <p className="s-cat">{categoryLabel(p.category)}</p>
                    <h3>{p.title}</h3>
                    <p>{p.excerpt}</p>
                    <p className="s-by">By Manish Biswas</p>
                  </a>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section className="blog-newsletter">
          <div className="blog-container">
            <div className="newsletter-wrap" data-anim="fade-in-up" style={del(".3s")}>
              <i className="deco dots-red nd1" aria-hidden="true"></i>
              <div className="newsletter-card">
                <div className="nl-copy">
                  <h2>Subscribe to the notebook</h2>
                  <p>Occasional essays on AI, products, and the messy middle of building things.</p>
                  <NewsletterForm />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <BlogFooter />
    </>
  );
}
