export type CaseStudyStat = {
  value: string;
  label: string;
};

export type CaseStudyStatus = "draft" | "published";
export type { CaseStudyTemplate, ContentBlock } from "./blocks";

export type CaseStudyInput = {
  slug: string;
  title: string;
  category: string;
  year: number;
  summary: string;
  description: string;
  coverImage?: string | null;
  usersImpacted: number;
  themeColor: string;
  stats: CaseStudyStat[];
  tags: string[];
  github?: string | null;
  liveDemo?: string | null;
  status: CaseStudyStatus;
  order: number;
};

export type SkillInput = {
  icon: string;
  title: string;
  description: string;
  order: number;
};
