"use client";

import {
  CHART_KINDS,
  chartSeriesNames,
  createBlock,
  isPolarChart,
  type ChartBlock,
  type ChartDatum,
  type ChartKind,
  type ContentBlock,
  type HeadingBlock,
  type ImageBlock,
  type ParagraphBlock,
  type QuoteBlock,
  type UiBlock,
} from "@/lib/blocks";
import { CaseChart } from "@/components/pm/CaseChart";
import { ImageField } from "./ImageField";

const CHART_TYPE_LABELS: Record<ChartKind, string> = {
  bar: "Bar",
  line: "Line",
  area: "Area",
  pie: "Pie",
  donut: "Donut",
};

const BLOCK_TYPES: { type: ContentBlock["type"]; label: string }[] = [
  { type: "heading", label: "Heading" },
  { type: "paragraph", label: "Paragraph" },
  { type: "image", label: "Image" },
  { type: "ui", label: "UI" },
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
          Add a heading, paragraph, image, UI screenshot, chart, quote, or divider.
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

  if (block.type === "ui") {
    const shot = block as UiBlock;
    return (
      <div className="space-y-3">
        <ImageField
          label="UI screenshot"
          url={shot.url}
          onChange={(url) => onChange({ ...shot, url })}
        />
        <label className="block text-sm">
          Alt text
          <input
            value={shot.alt}
            onChange={(e) => onChange({ ...shot, alt: e.target.value })}
            className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-sm">
          Caption
          <input
            value={shot.caption ?? ""}
            onChange={(e) => onChange({ ...shot, caption: e.target.value })}
            className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm"
          />
        </label>
      </div>
    );
  }

  if (block.type === "chart") {
    return <ChartFields chart={block} onChange={onChange} />;
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

function rowValues(row: ChartDatum, count: number) {
  const values = [row.value, ...(row.values ?? [])];
  while (values.length < count) values.push(0);
  return values.slice(0, count);
}

function rowDisplays(row: ChartDatum, count: number) {
  const displays = [row.display ?? "", ...(row.displays ?? [])];
  while (displays.length < count) displays.push("");
  return displays.slice(0, count);
}

function packRow(label: string, values: number[], displays: string[]): ChartDatum {
  const row: ChartDatum = { label, value: values[0] ?? 0 };
  if (values.length > 1) row.values = values.slice(1);
  if (displays[0]?.trim()) row.display = displays[0].trim();
  const extra = displays.slice(1);
  if (extra.some((item) => item.trim())) row.displays = extra;
  return row;
}

function ChartFields({
  chart,
  onChange,
}: {
  chart: ChartBlock;
  onChange: (block: ContentBlock) => void;
}) {
  const polar = isPolarChart(chart.chartType);
  const names = polar ? ["Value"] : chartSeriesNames(chart);
  const previewable = chart.data.some((row) => row.label.trim());

  function setData(data: ChartDatum[]) {
    onChange({ ...chart, data });
  }

  function setSeries(series: string[]) {
    const next = series.map((name, index) => name.trim() || `Series ${index + 1}`);
    const data = chart.data.map((row) => {
      const values = rowValues(row, next.length);
      const displays = rowDisplays(row, next.length);
      return packRow(row.label, values, displays);
    });
    onChange({
      ...chart,
      series: next.length > 1 || next[0] !== "Value" ? next : undefined,
      data,
    });
  }

  function updateCell(index: number, seriesIndex: number, value: number, display: string) {
    const data = chart.data.map((row, rowIndex) => {
      if (rowIndex !== index) return row;
      const values = rowValues(row, names.length);
      const displays = rowDisplays(row, names.length);
      values[seriesIndex] = value;
      displays[seriesIndex] = display;
      return packRow(row.label, values, displays);
    });
    setData(data);
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-2 sm:grid-cols-2">
        <label className="text-sm">
          Chart type
          <select
            value={chart.chartType}
            onChange={(e) => onChange({ ...chart, chartType: e.target.value as ChartKind })}
            className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm"
          >
            {CHART_KINDS.map((kind) => (
              <option key={kind} value={kind}>
                {CHART_TYPE_LABELS[kind]}
              </option>
            ))}
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
          Unit
          <input
            value={chart.unit ?? ""}
            onChange={(e) => onChange({ ...chart, unit: e.target.value })}
            placeholder='e.g. min, %, $'
            className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm"
          />
        </label>
        {polar ? null : (
          <>
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
          </>
        )}
      </div>

      {polar ? null : (
        <div className="space-y-2">
          <p className="text-sm font-medium">Series</p>
          {names.map((name, index) => (
            <div key={`${chart.id}-series-${index}`} className="flex gap-2">
              <input
                value={name}
                onChange={(e) => {
                  const next = [...names];
                  next[index] = e.target.value;
                  setSeries(next);
                }}
                className="w-full rounded border border-zinc-300 px-3 py-2 text-sm"
              />
              {names.length > 1 ? (
                <button
                  type="button"
                  className="rounded border border-zinc-300 px-2 text-xs"
                  onClick={() => setSeries(names.filter((_, i) => i !== index))}
                >
                  Remove
                </button>
              ) : null}
            </div>
          ))}
          <button
            type="button"
            className="rounded border border-zinc-300 px-3 py-1.5 text-xs"
            onClick={() => setSeries([...names, `Series ${names.length + 1}`])}
          >
            + Series
          </button>
        </div>
      )}

      <div className="space-y-2">
        <p className="text-sm font-medium">Data rows</p>
        <div className="overflow-x-auto">
          <div className="space-y-2 min-w-[32rem]">
            {chart.data.map((row, i) => {
              const values = rowValues(row, names.length);
              const displays = rowDisplays(row, names.length);
              return (
                <div key={`${chart.id}-row-${i}`} className="flex flex-wrap items-end gap-2">
                  <label className="min-w-[8rem] flex-1 text-xs text-zinc-500">
                    Label
                    <input
                      value={row.label}
                      placeholder="Label"
                      onChange={(e) => {
                        const data = chart.data.map((item, index) =>
                          index === i ? { ...item, label: e.target.value } : item,
                        );
                        setData(data);
                      }}
                      className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm text-zinc-900"
                    />
                  </label>
                  {names.map((name, seriesIndex) => (
                    <label key={`${chart.id}-row-${i}-s${seriesIndex}`} className="w-24 text-xs text-zinc-500">
                      {polar ? "Value" : name}
                      <input
                        type="number"
                        value={Number.isFinite(values[seriesIndex]) ? values[seriesIndex] : 0}
                        onChange={(e) =>
                          updateCell(i, seriesIndex, Number(e.target.value), displays[seriesIndex] ?? "")
                        }
                        className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm text-zinc-900"
                      />
                    </label>
                  ))}
                  {names.map((name, seriesIndex) => (
                    <label key={`${chart.id}-row-${i}-d${seriesIndex}`} className="min-w-[7rem] flex-1 text-xs text-zinc-500">
                      {names.length > 1 ? `${name} label` : "Display label"}
                      <input
                        value={displays[seriesIndex] ?? ""}
                        placeholder='e.g. ~1 sec'
                        onChange={(e) =>
                          updateCell(i, seriesIndex, values[seriesIndex] ?? 0, e.target.value)
                        }
                        className="mt-1 w-full rounded border border-zinc-300 px-3 py-2 text-sm text-zinc-900"
                      />
                    </label>
                  ))}
                  <button
                    type="button"
                    className="rounded border border-zinc-300 px-2 py-2 text-xs"
                    onClick={() => setData(chart.data.filter((_, index) => index !== i))}
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>
        </div>
        <button
          type="button"
          className="rounded border border-zinc-300 px-3 py-1.5 text-xs"
          onClick={() =>
            setData([
              ...chart.data,
              packRow("", Array(names.length).fill(0), Array(names.length).fill("")),
            ])
          }
        >
          + Row
        </button>
      </div>

      <div className="rounded border border-zinc-200 bg-zinc-50 p-3">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">Preview</p>
        {previewable ? (
          <div className="on-swatch rounded border border-zinc-200 bg-[#f6f1e8] px-3">
            <CaseChart block={chart} compact />
          </div>
        ) : (
          <p className="text-sm text-zinc-500">Add a labeled row to preview this chart.</p>
        )}
      </div>
    </div>
  );
}
