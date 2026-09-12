export const CHART_COLORS = [
  "#E23B2C",
  "#F5C518",
  "#B8E986",
  "#F4B4C8",
  "#7EB8E8",
  "#111111",
];

export type CaseStudyTemplate = "standard" | "narrative" | "dataHeavy";

export type ChartKind = "bar" | "line" | "pie";
export type ImageSize = "full" | "inline";
export type HeadingLevel = 2 | 3;

export type ChartDatum = { label: string; value: number };

export type HeadingBlock = {
  id: string;
  type: "heading";
  text: string;
  level: HeadingLevel;
};

export type ParagraphBlock = {
  id: string;
  type: "paragraph";
  text: string;
};

export type ImageBlock = {
  id: string;
  type: "image";
  url: string;
  alt: string;
  caption?: string;
  size: ImageSize;
};

export type ChartBlock = {
  id: string;
  type: "chart";
  chartType: ChartKind;
  title?: string;
  xLabel?: string;
  yLabel?: string;
  data: ChartDatum[];
};

export type QuoteBlock = {
  id: string;
  type: "quote";
  text: string;
  attribution?: string;
};

export type DividerBlock = {
  id: string;
  type: "divider";
};

export type ContentBlock =
  | HeadingBlock
  | ParagraphBlock
  | ImageBlock
  | ChartBlock
  | QuoteBlock
  | DividerBlock;

export type CaseStudyDraft = {
  title: string;
  slug: string;
  category: string;
  year: number;
  summary: string;
  coverImage: string | null;
  usersImpacted: number;
  themeColor: string;
  stats: { value: string; label: string }[];
  tags: string[];
  github: string | null;
  liveDemo: string | null;
  featured: boolean;
  order: number;
  template: CaseStudyTemplate;
  body: ContentBlock[];
};

export function newBlockId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `b-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createBlock(type: ContentBlock["type"]): ContentBlock {
  const id = newBlockId();
  switch (type) {
    case "heading":
      return { id, type, text: "", level: 2 };
    case "paragraph":
      return { id, type, text: "" };
    case "image":
      return { id, type, url: "", alt: "", caption: "", size: "full" };
    case "chart":
      return {
        id,
        type,
        chartType: "bar",
        title: "",
        xLabel: "",
        yLabel: "",
        data: [
          { label: "", value: 0 },
          { label: "", value: 0 },
        ],
      };
    case "quote":
      return { id, type, text: "", attribution: "" };
    case "divider":
      return { id, type };
  }
}

export function descriptionToBody(description: string, prefix = "p"): ContentBlock[] {
  return description
    .split(/\n{2,}/)
    .map((text) => text.trim())
    .filter(Boolean)
    .map((text, index) => ({
      id: `${prefix}-${index + 1}`,
      type: "paragraph" as const,
      text,
    }));
}

function asChartData(value: unknown): ChartDatum[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((row) => {
      if (!row || typeof row !== "object") return null;
      const label = String((row as ChartDatum).label ?? "").trim();
      const raw = Number((row as ChartDatum).value);
      if (!label || !Number.isFinite(raw)) return null;
      return { label, value: raw };
    })
    .filter((row): row is ChartDatum => Boolean(row));
}

export function asBody(value: unknown, fallbackDescription = ""): ContentBlock[] {
  if (Array.isArray(value) && value.length > 0) {
    const blocks: ContentBlock[] = [];
    for (const item of value) {
      if (!item || typeof item !== "object") continue;
      const raw = item as Record<string, unknown>;
      const id = String(raw.id || newBlockId());
      switch (raw.type) {
        case "heading":
          blocks.push({
            id,
            type: "heading",
            text: String(raw.text ?? ""),
            level: raw.level === 3 ? 3 : 2,
          });
          break;
        case "paragraph":
          blocks.push({ id, type: "paragraph", text: String(raw.text ?? "") });
          break;
        case "image":
          blocks.push({
            id,
            type: "image",
            url: String(raw.url ?? ""),
            alt: String(raw.alt ?? ""),
            caption: String(raw.caption ?? ""),
            size: raw.size === "inline" ? "inline" : "full",
          });
          break;
        case "chart":
          blocks.push({
            id,
            type: "chart",
            chartType:
              raw.chartType === "line" || raw.chartType === "pie" ? raw.chartType : "bar",
            title: String(raw.title ?? ""),
            xLabel: String(raw.xLabel ?? ""),
            yLabel: String(raw.yLabel ?? ""),
            data: asChartData(raw.data),
          });
          break;
        case "quote":
          blocks.push({
            id,
            type: "quote",
            text: String(raw.text ?? ""),
            attribution: String(raw.attribution ?? ""),
          });
          break;
        case "divider":
          blocks.push({ id, type: "divider" });
          break;
        default:
          break;
      }
    }
    if (blocks.length) return blocks;
  }
  return fallbackDescription ? descriptionToBody(fallbackDescription, "legacy") : [];
}

export function isEmptyBody(value: unknown) {
  return !Array.isArray(value) || value.length === 0;
}

export function bodyToPlainText(body: ContentBlock[]) {
  return body
    .map((block) => {
      if (block.type === "paragraph" || block.type === "heading" || block.type === "quote") {
        return block.text.trim();
      }
      return "";
    })
    .filter(Boolean)
    .join("\n\n");
}

export function imageUrlsFromBody(body: ContentBlock[]) {
  return body
    .filter((block): block is ImageBlock => block.type === "image" && Boolean(block.url))
    .map((block) => block.url);
}

export function asTemplate(value: unknown): CaseStudyTemplate {
  if (value === "narrative" || value === "dataHeavy" || value === "standard") {
    return value;
  }
  return "standard";
}

export function collectChartBlocks(body: ContentBlock[]) {
  return body.filter((block): block is ChartBlock => block.type === "chart");
}

export function collectNarrativeBlocks(body: ContentBlock[]) {
  return body.filter((block) => block.type !== "chart");
}
