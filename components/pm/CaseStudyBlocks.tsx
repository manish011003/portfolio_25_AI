import {
  groupCaseStudySections,
  parsePersonaFromQuote,
  type CaseStudySection,
  type ContentBlock,
  type ImageBlock,
  type PersonaBlock,
  type QuoteBlock,
  type UiBlock,
} from "@/lib/blocks";
import { InlineText } from "@/lib/inline";
import { CaseChart } from "./CaseChart";
import { ImageLightbox } from "./ImageLightbox";
import { Polaroid } from "./Polaroid";

export function CaseStudyBlocks({
  blocks,
  largeType = false,
}: {
  blocks: ContentBlock[];
  largeType?: boolean;
}) {
  const sections = groupCaseStudySections(blocks);

  return (
    <div className="space-y-14 sm:space-y-16 lg:space-y-20">
      {sections.map((section) => (
        <SectionView key={section.id} section={section} largeType={largeType} />
      ))}
    </div>
  );
}

function SectionView({
  section,
  largeType,
}: {
  section: CaseStudySection;
  largeType: boolean;
}) {
  const hasEditorial = Boolean(section.heading || section.narrative.length || section.asides.length);
  const splitWithAsides = section.asides.length > 0;
  const splitHeadingOnly =
    !splitWithAsides && Boolean(section.heading) && section.narrative.length > 0;

  return (
    <section className="space-y-8 lg:space-y-10">
      {hasEditorial ? (
        <div
          className={
            splitWithAsides
              ? "grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12 xl:gap-16"
              : splitHeadingOnly
                ? "grid items-start gap-6 lg:grid-cols-[minmax(12rem,0.38fr)_minmax(0,0.62fr)] lg:gap-10 xl:gap-14"
                : "max-w-3xl"
          }
        >
          <div className="min-w-0 space-y-5">
            {section.heading ? <HeadingView block={section.heading} /> : null}
            {splitWithAsides
              ? section.narrative.map((block, index) => (
                  <BlockView key={block.id} block={block} index={index} largeType={largeType} />
                ))
              : null}
            {!splitWithAsides && !splitHeadingOnly
              ? section.narrative.map((block, index) => (
                  <BlockView key={block.id} block={block} index={index} largeType={largeType} />
                ))
              : null}
          </div>

          {splitWithAsides ? (
            <div className="min-w-0 space-y-4">
              {section.asides.map((block, index) => (
                <BlockView key={block.id} block={block} index={index} largeType={largeType} />
              ))}
            </div>
          ) : null}

          {splitHeadingOnly ? (
            <div className="min-w-0 space-y-5 lg:pt-2">
              {section.narrative.map((block, index) => (
                <BlockView key={block.id} block={block} index={index} largeType={largeType} />
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      {section.media.length ? (
        <div className="space-y-8">
          {section.media.map((block, index) => (
            <BlockView key={block.id} block={block} index={index} largeType={largeType} />
          ))}
        </div>
      ) : null}
    </section>
  );
}

function HeadingView({ block }: { block: Extract<ContentBlock, { type: "heading" }> }) {
  const className =
    block.level === 3
      ? "display text-[clamp(1.75rem,3.5vw,2.75rem)]"
      : "display text-[clamp(2.5rem,5vw,4.25rem)]";
  return block.level === 3 ? (
    <h3 className={className}>{block.text}</h3>
  ) : (
    <h2 className={className}>{block.text}</h2>
  );
}

function BlockView({
  block,
  index,
  largeType,
}: {
  block: ContentBlock;
  index: number;
  largeType: boolean;
}) {
  if (block.type === "heading") {
    return <HeadingView block={block} />;
  }

  if (block.type === "paragraph") {
    return (
      <p
        className={
          largeType
            ? "max-w-[46rem] text-xl leading-9 text-ink/85"
            : "max-w-[46rem] text-lg leading-8 text-ink/85"
        }
      >
        <InlineText text={block.text} />
      </p>
    );
  }

  if (block.type === "image") {
    return <StoryImage block={block} index={index} />;
  }

  if (block.type === "ui") {
    return <UiShot block={block} />;
  }

  if (block.type === "chart") {
    return <CaseChart block={block} />;
  }

  if (block.type === "persona") {
    return <PersonaCard block={block} />;
  }

  if (block.type === "quote") {
    return <QuoteView block={block} />;
  }

  return <hr className="border-ink/30" />;
}

function PersonaCard({ block }: { block: PersonaBlock }) {
  return (
    <article className="border-l-4 border-ink bg-cream px-5 py-5 sm:px-6">
      <p className="display text-3xl sm:text-4xl">{block.name}</p>
      {block.role ? (
        <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
          {block.role}
        </p>
      ) : null}
      <p className="mt-3 text-base leading-7 text-ink/85 sm:text-lg sm:leading-8">
        <InlineText text={block.text} />
      </p>
    </article>
  );
}

function QuoteView({ block }: { block: QuoteBlock }) {
  const persona =
    !block.attribution?.trim() ? parsePersonaFromQuote(block.text) : null;

  if (persona) {
    return (
      <PersonaCard
        block={{
          id: block.id,
          type: "persona",
          name: persona.name,
          role: persona.role,
          text: persona.body,
        }}
      />
    );
  }

  return (
    <blockquote className="border-l-4 border-ink bg-cream px-5 py-4 sm:px-6">
      <p className="text-lg leading-8 sm:text-xl">
        <InlineText text={block.text} />
      </p>
      {block.attribution ? (
        <footer className="mt-3 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
          — {block.attribution}
        </footer>
      ) : null}
    </blockquote>
  );
}

function StoryImage({ block, index }: { block: ImageBlock; index: number }) {
  if (!block.url) return null;
  const rotate = index % 2 === 0 ? "-1.6deg" : "1.8deg";
  return (
    <div className="my-2">
      <Polaroid
        src={block.url}
        alt={block.alt || block.caption || "Case study image"}
        caption={block.caption}
        rotate={rotate}
        wide={block.size === "full"}
      />
    </div>
  );
}

function UiShot({ block }: { block: UiBlock }) {
  if (!block.url) return null;
  const alt = block.alt || block.caption || "Product screenshot";
  return (
    <figure className="my-2 w-full">
      <div className="flex w-full justify-center border border-line bg-chrome">
        <ImageLightbox src={block.url} alt={alt} caption={block.caption} className="block w-max max-w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={block.url} alt="" className="block h-auto max-w-full object-contain" />
        </ImageLightbox>
      </div>
      {block.caption ? (
        <figcaption className="mt-3 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
          {block.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
