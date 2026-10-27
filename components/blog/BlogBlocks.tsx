import type { CSSProperties } from "react";
import { safeHref, type ContentBlock } from "@/lib/blocks";
import { InlineText } from "@/lib/inline";
import { toEmbedUrl } from "@/lib/video";
import { CaseChart } from "@/components/pm/CaseChart";
import { ImageLightbox } from "@/components/pm/ImageLightbox";

const reveal = { "--del": "0s" } as CSSProperties;

function Figure({ url, alt, caption, className }: { url: string; alt: string; caption?: string; className: string }) {
  if (!url) return null;
  const label = alt || caption || "Blog image";
  return (
    <figure className={className}>
      <ImageLightbox src={url} alt={label} caption={caption} className="bb-lightbox">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={url} alt="" loading="lazy" />
      </ImageLightbox>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}

function BlockView({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "heading":
      return block.level === 3 ? <h3 className="bb-h3">{block.text}</h3> : <h2 className="bb-h2">{block.text}</h2>;
    case "paragraph":
      return (
        <p className="bb-p">
          <InlineText text={block.text} />
        </p>
      );
    case "image":
      return <Figure url={block.url} alt={block.alt} caption={block.caption} className={`bb-figure ${block.size === "inline" ? "bb-inline" : "bb-full"}`} />;
    case "ui":
      return <Figure url={block.url} alt={block.alt} caption={block.caption} className="bb-figure bb-full bb-ui" />;
    case "gallery": {
      const images = block.images.filter((image) => image.url);
      if (!images.length) return null;
      return (
        <figure className={`bb-gallery bb-cols-${Math.min(images.length, 3)}`}>
          <div className="bb-gallery-grid">
            {images.map((image, i) => (
              <ImageLightbox key={`${image.url}-${i}`} src={image.url} alt={image.alt || block.caption || "Gallery image"} caption={block.caption} className="bb-lightbox">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image.url} alt="" loading="lazy" />
              </ImageLightbox>
            ))}
          </div>
          {block.caption ? <figcaption>{block.caption}</figcaption> : null}
        </figure>
      );
    }
    case "quote":
      return (
        <blockquote className="bb-quote">
          <p>
            <InlineText text={block.text} />
          </p>
          {block.attribution ? <footer>— {block.attribution}</footer> : null}
        </blockquote>
      );
    case "persona":
      return (
        <aside className="bb-quote bb-persona">
          <strong>{block.name}</strong>
          {block.role ? <span>{block.role}</span> : null}
          <p>
            <InlineText text={block.text} />
          </p>
        </aside>
      );
    case "code":
      if (!block.code.trim()) return null;
      return (
        <figure className="bb-code">
          {block.language ? <figcaption>{block.language}</figcaption> : null}
          <pre tabIndex={0}>
            <code>{block.code}</code>
          </pre>
        </figure>
      );
    case "video": {
      const embed = toEmbedUrl(block.url);
      const href = safeHref(block.url);
      if (!embed && !href) return null;
      return (
        <figure className="bb-video">
          {embed ? (
            <div className="bb-video-frame">
              <iframe
                src={embed}
                title={block.caption || "Embedded video"}
                loading="lazy"
                allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          ) : (
            <a className="bb-btn" href={href} target="_blank" rel="noopener noreferrer">
              Watch video →
            </a>
          )}
          {block.caption ? <figcaption>{block.caption}</figcaption> : null}
        </figure>
      );
    }
    case "cta": {
      const href = safeHref(block.url);
      if (!block.heading && !block.text && !(href && block.label)) return null;
      const external = /^https?:\/\//i.test(href);
      return (
        <aside className="bb-cta">
          {block.heading ? <h3>{block.heading}</h3> : null}
          {block.text ? <p>{block.text}</p> : null}
          {href && block.label ? (
            <a className="bb-btn" href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
              {block.label}
            </a>
          ) : null}
        </aside>
      );
    }
    case "chart":
      return (
        <div className="bb-chart">
          <CaseChart block={block} />
        </div>
      );
    case "divider":
      return <hr className="bb-hr" />;
  }
}

export function BlogBlocks({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="bb">
      {blocks.map((block) => (
        <div key={block.id} className={`bbi bbi-${block.type}`} data-anim="fade-in-up" style={reveal}>
          <BlockView block={block} />
        </div>
      ))}
    </div>
  );
}
