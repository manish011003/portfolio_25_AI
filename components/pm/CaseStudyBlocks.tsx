import {
  type ContentBlock,
  type ImageBlock,
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
  return (
    <div className="space-y-6">
      {blocks.map((block, index) => (
        <BlockView key={block.id} block={block} index={index} largeType={largeType} />
      ))}
    </div>
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
    const className = block.level === 3 ? "display text-4xl sm:text-5xl" : "display text-5xl sm:text-6xl";
    return block.level === 3 ? (
      <h3 className={className}>{block.text}</h3>
    ) : (
      <h2 className={className}>{block.text}</h2>
    );
  }

  if (block.type === "paragraph") {
    return (
      <p className={largeType ? "text-xl leading-9 text-ink/85" : "text-lg leading-8 text-ink/85"}>
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

  if (block.type === "quote") {
    return (
      <blockquote className="border-l-4 border-ink bg-cream px-5 py-4">
        <p className="text-xl leading-8">
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

  return <hr className="border-ink/30" />;
}

function StoryImage({ block, index }: { block: ImageBlock; index: number }) {
  if (!block.url) return null;
  const rotate = index % 2 === 0 ? "-1.6deg" : "1.8deg";
  return (
    <div className={block.size === "full" ? "my-8" : "my-8"}>
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
    <figure className="my-8 w-full">
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
