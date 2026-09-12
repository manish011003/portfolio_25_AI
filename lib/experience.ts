export function parseMonth(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})$/.exec(value.trim());
  if (!match) return null;
  return new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, 1));
}

function asDate(value: Date | string | null | undefined) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function toMonthInput(date: Date | string | null | undefined) {
  const parsed = asDate(date);
  if (!parsed) return "";
  const year = parsed.getUTCFullYear();
  const month = String(parsed.getUTCMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

export function formatMonth(date: Date | string) {
  const parsed = asDate(date);
  if (!parsed) return "";
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function formatExperienceRange(
  startDate: Date | string,
  endDate: Date | string | null,
) {
  const start = formatMonth(startDate);
  const end = endDate ? formatMonth(endDate) : "Present";
  return `${start} — ${end}`;
}

export type ExperienceDraft = {
  role: string;
  company: string;
  startMonth: string;
  endMonth: string;
  present: boolean;
  description: string;
  images: string[];
  order: number;
};
