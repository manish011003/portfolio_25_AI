"use client";

import {
  createBlock,
  type ChartBlock,
  type ContentBlock,
  type HeadingBlock,
  type ImageBlock,
  type ParagraphBlock,
  type QuoteBlock,
} from "@/lib/blocks";
import { ImageField } from "./ImageField";

const BLOCK_TYPES: { type: ContentBlock["type"]; label: string }[] = [
  { type: "heading", label: "Heading" },
  { type: "paragraph", label: "Paragraph" },
  { type: "image", label: "Image" },
  { type: "chart", label: "Chart" },
  { type: "quote", label: "Quote" },
  { type: "divider", label: "Divider" },
];

export function BlockEditor({
  blocks,
  onChange,
}: {
  blocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
}) {
  function update(index: number, next: ContentBlock) {
    onChange(blocks.map((block, i) => (i === index ? next : block)));
  }

  function move(index: number, direction: "up" | "down") {
    const swap = direction === "up" ? index - 1 : index + 1;
    if (swap < 0 || swap >= blocks.length) return;
    const next = [...blocks];
    const current = next[index];
    next[index] = next[swap];
    next[swap] = current;
    onChange(next);
  }

  function remove(index: number) {
    onChange(blocks.filter((_, i) => i !== index));
  }

  function insert(index: number, type: ContentBlock["type"]) {
    const next = [...blocks];
    next.splice(index, 0, createBlock(type));
    onChange(next);
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold">Write-up</h2>
        <AddBlock onAdd={(type) => insert(blocks.length, type)} />
      </div>
      {blocks.length === 0 ? (
        <p className="rounded border border-dashed border-zinc-300 px-3 py-6 text-sm text-zinc-500">
          Add a heading, paragraph, image, chart, quote, or divider.
        </p>
      ) : null}
      {blocks.map((block, index) => (
        <article key={block.id} className="rounded border border-zinc-200 bg-white p-3">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              {block.type}
            </p>
            <div className="flex flex-wrap gap-1">
              <button type="button" className="rounded border border-zinc-300 px-2 py-1 text-xs" onClick={() => move(index, "up")}>
                Up
              </button>
              <button type="button" className="rounded border border-zinc-300 px-2 py-1 text-xs" onClick={() => move(index, "down")}>
                Down
              </button>
              <button type="button" className="rounded border border-red-200 px-2 py-1 text-xs text-red-700" onClick={() => remove(index)}>
                Remove
              </button>
            </div>
          </div>
          <BlockFields block={block} onChange={(next) => update(index, next)} />
          <div className="mt-3 border-t border-zinc-100 pt-3">
            <AddBlock label="Add below" onAdd={(type) => insert(index + 1, type)} />
          </div>
        </article>
      ))}
    </div>
  );
}

function AddBlock({
  onAdd,
  label = "Add block",
}: {
  onAdd: (type: ContentBlock["type"]) => void;
  label?: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs text-zinc-500">{label}</span>
      {BLOCK_TYPES.map((item) => (
        <button
          key={item.type}
          type="button"
          className="rounded border border-zinc-300 bg-white px-2 py-1 text-xs"
          onClick={() => onAdd(item.type)}
        >
          + {item.label}
        </button>
      ))}
    </div>
  );
}

function BlockFields({
  block,
  onChange,
}: {
  block: ContentBlock;
  onChange: (block: ContentBlock) => void;
}) {
  if (block.type === "heading") {
    const heading = block as HeadingBlock;
    return (
      <div className="grid gap-2 sm:grid-cols-[120px_1fr]">
        <select
          value={heading.level}
          onChange={(e) => onChange({ ...heading, level: Number(e.target.value) === 3 ? 3 : 2 })}
          className="rounded border border-zinc-300 px-2 py-2 text-sm"
        >
          <option value={2}>H2</option>
          <option value={3}>H3</option>
        </select>
        <input
          value={heading.text}
          onChange={(e) => onChange({ ...heading, text: e.target.value })}
          placeholder="Heading"
          className="rounded border border-zinc-300 px-3 py-2 text-sm"
        />
      </div>
    );
  }

  if (block.type === "paragraph") {
    const paragraph = block as ParagraphBlock;
    return (
      <label className="block text-sm">
        <span className="text-xs text-zinc-500">**bold**, *italic*, [link](https://…)</span>
        <textarea
          value={paragraph.text}
          onChange={(e) => onChange({ ...paragraph, text: e.target.value })}
          rows={5}
          className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm"
        />
      </label>
    );
  }

  if (block.type === "image") {
    const image = block as ImageBlock;
    return (
      <div className="space-y-3">
        <ImageField
          label="Image"
          url={image.url}
          onChange={(url) => onChange({ ...image, url })}
        />
        <label className="block text-sm">
          Alt text
          <input
            value={image.alt}
            onChange={(e) => onChange({ ...image, alt: e.target.value })}
            className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-sm">
          Caption
          <input
            value={image.caption ?? ""}
            onChange={(e) => onChange({ ...image, caption: e.target.value })}
            className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-sm">
          Size
          <select
            value={image.size}
            onChange={(e) => onChange({ ...image, size: e.target.value === "inline" ? "inline" : "full" })}
            className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm"
          >
            <option value="full">Full width</option>
            <option value="inline">Inline / centered</option>
          </select>
        </label>
      </div>
    );
  }

  if (block.type === "chart") {
    const chart = block as ChartBlock;
    return (
      <div className="space-y-3">
        <div className="grid gap-2 sm:grid-cols-2">
          <label className="text-sm">
            Chart type
            <select
              value={chart.chartType}
              onChange={(e) =>
                onChange({
                  ...chart,
                  chartType: e.target.value as ChartBlock["chartType"],
                })
              }
              className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm"
            >
              <option value="bar">Bar</option>
              <option value="line">Line</option>
              <option value="pie">Pie</option>
            </select>
          </label>
          <label className="text-sm">
            Title
            <input
              value={chart.title ?? ""}
              onChange={(e) => onChange({ ...chart, title: e.target.value })}
              className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="text-sm">
            X axis label
            <input
              value={chart.xLabel ?? ""}
              onChange={(e) => onChange({ ...chart, xLabel: e.target.value })}
              className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="text-sm">
            Y axis label
            <input
              value={chart.yLabel ?? ""}
              onChange={(e) => onChange({ ...chart, yLabel: e.target.value })}
              className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm"
            />
          </label>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium">Data rows</p>
          {chart.data.map((row, i) => (
            <div key={`${chart.id}-row-${i}`} className="grid grid-cols-[1fr_100px_auto] gap-2">
              <input
                value={row.label}
                placeholder="Label"
                onChange={(e) => {
                  const data = chart.data.map((item, index) =>
                    index === i ? { ...item, label: e.target.value } : item,
                  );
                  onChange({ ...chart, data });
                }}
                className="rounded border border-zinc-300 px-3 py-2 text-sm"
              />
              <input
                type="number"
                value={Number.isFinite(row.value) ? row.value : 0}
                onChange={(e) => {
                  const data = chart.data.map((item, index) =>
                    index === i ? { ...item, value: Number(e.target.value) } : item,
                  );
                  onChange({ ...chart, data });
                }}
                className="rounded border border-zinc-300 px-3 py-2 text-sm"
              />
              <button
                type="button"
                className="rounded border border-zinc-300 px-2 text-xs"
                onClick={() => onChange({ ...chart, data: chart.data.filter((_, index) => index !== i) })}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="rounded border border-zinc-300 px-3 py-1.5 text-xs"
            onClick={() => onChange({ ...chart, data: [...chart.data, { label: "", value: 0 }] })}
          >
            + Row
          </button>
        </div>
      </div>
    );
  }

  if (block.type === "quote") {
    const quote = block as QuoteBlock;
    return (
      <div className="space-y-2">
        <textarea
          value={quote.text}
          onChange={(e) => onChange({ ...quote, text: e.target.value })}
          rows={3}
          placeholder="Quote or callout"
          className="w-full rounded border border-zinc-300 px-3 py-2 text-sm"
        />
        <input
          value={quote.attribution ?? ""}
          onChange={(e) => onChange({ ...quote, attribution: e.target.value })}
          placeholder="Attribution (optional)"
          className="w-full rounded border border-zinc-300 px-3 py-2 text-sm"
        />
      </div>
    );
  }

  return <p className="text-sm text-zinc-500">Horizontal rule. No settings.</p>;
}
