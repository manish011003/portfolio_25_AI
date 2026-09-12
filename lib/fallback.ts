import type { CaseStudy, Experience, Skill } from "@prisma/client";
import { descriptionToBody } from "./blocks";
import { RESUME_EXPERIENCES } from "./resume";

const now = new Date("2026-09-12T00:00:00.000Z");

const fallbackStudies = [
  {
    id: "fallback-ironclad",
    slug: "ironclad",
    title: "Ironclad — Cross-Platform Fitness App",
    category: "Consumer Fitness",
    year: 2026,
    summary:
      "Defined and shipped a single Expo codebase for iOS, Android, and Web: AI meal logging, form checking, training plans, social meal feeds, XP loops, and Spotify soundtrack pins.",
    description:
      "Defined and shipped a single Expo codebase for iOS, Android, and Web: AI meal logging, form checking, training plans, social meal feeds, XP loops, and Spotify soundtrack pins — prioritizing activation (BMI/TDEE onboarding) and retention (plans + achievements).\n\nThe product bet was simple: one codebase, three platforms, and a loop that makes coming back feel obvious. Onboarding starts with BMI/TDEE so the first session is personal. Retention is planned — training plans, achievements, and soundtrack pins — not left to willpower.\n\nI owned the product framing, the activation/retention metrics, and the cut-line between v1 (ship the habit) and v2 (plans + soundtrack).",
    coverImage: "/assets/ironclad-case-study.jpg",
    usersImpacted: 0,
    themeColor: "#E23B2C",
    stats: [
      { value: "3", label: "Platforms" },
      { value: "1", label: "Expo Codebase" },
      { value: "v2", label: "Plans + Soundtrack" },
    ],
    tags: ["Product Strategy", "Mobile + Web", "AI Features", "Retention Loops"],
    github: "https://github.com/manish011003/ironclad",
    liveDemo: "https://ironclad-bice.vercel.app",
    featured: true,
    status: "published",
    order: 0,
    template: "standard",
    body: [],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "fallback-claro",
    slug: "claro-ai",
    title: "Claro AI Analytics Platform",
    category: "B2B SaaS",
    year: 2024,
    summary:
      "Led product development for an AI-powered analytics platform serving 1000+ users. Focused on making complex data accessible through LLM-powered insights and intuitive dashboards.",
    description:
      "Led product development for an AI-powered analytics platform serving 1000+ users. Focused on making complex data accessible through LLM-powered insights and intuitive dashboards.\n\nThe job was translation: take messy operational data and turn it into something a non-analyst could act on. I worked across research, roadmap, and delivery — deciding which insights were worth an LLM call, and which belonged in a plain chart.\n\nReliability was a product feature, not an engineering leftover. The platform needed to feel instant and stay up, or the insight layer would never get trusted.",
    coverImage: null,
    usersImpacted: 1000,
    themeColor: "#F5C518",
    stats: [
      { value: "1000+", label: "Active Users" },
      { value: "99.9%", label: "Uptime" },
      { value: "<100ms", label: "API Response" },
    ],
    tags: ["Product Strategy", "User Research", "Data Analytics", "Agile"],
    github: null,
    liveDemo: null,
    featured: true,
    status: "published",
    order: 1,
    template: "standard",
    body: [],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "fallback-ewaste",
    slug: "e-waste-platform",
    title: "E-Waste Management Platform",
    category: "Social Impact",
    year: 2023,
    summary:
      "Designed and launched a full-stack platform for e-waste management, connecting consumers, collection centers, and recyclers. Finalist at Smart India Hackathon 2023.",
    description:
      "Designed and launched a full-stack platform for e-waste management, connecting consumers, collection centers, and recyclers. Finalist at Smart India Hackathon 2023.\n\nThe supply chain only works if each side shows up: a household that can drop a device off, a facility that can take it, and a recycler that can process it. I scoped an MVP around those three roles instead of boiling the ocean with a marketplace.\n\nThe work sat in product design and UX as much as logistics — reducing the number of steps between “I have old electronics” and “they are in the right facility.”",
    coverImage: null,
    usersImpacted: 10000,
    themeColor: "#B8E986",
    stats: [
      { value: "10K+", label: "Users" },
      { value: "500+", label: "Facilities" },
      { value: "40%", label: "Efficiency Gain" },
    ],
    tags: ["Product Design", "User Experience", "Supply Chain", "MVP Development"],
    github: null,
    liveDemo: null,
    featured: false,
    status: "published",
    order: 2,
    template: "standard",
    body: [],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "fallback-agent",
    slug: "ai-task-agent",
    title: "AI Task Management Agent",
    category: "AI Product",
    year: 2024,
    summary:
      "Built an AI-powered task management system that reduces cognitive load by enabling natural language task creation and organization. Focused on user experience and API cost optimization.",
    description:
      "Built an AI-powered task management system that reduces cognitive load by enabling natural language task creation and organization. Focused on user experience and API cost optimization.\n\nThe product question was not “can the model parse a task?” — it was “can someone dump a messy thought and trust the system to file it?” I treated accuracy and cost as the same problem: a cheaper call that is wrong is still expensive.\n\nThe work mixed user research, product metrics, and a hard look at where the model actually earned its keep.",
    coverImage: null,
    usersImpacted: 100,
    themeColor: "#111111",
    stats: [
      { value: "100+", label: "Concurrent Users" },
      { value: "95%", label: "Accuracy" },
      { value: "30%", label: "Cost Reduction" },
    ],
    tags: ["AI/ML Products", "User Research", "Cost Optimization", "Product Metrics"],
    github: null,
    liveDemo: null,
    featured: false,
    status: "published",
    order: 3,
    template: "standard",
    body: [],
    createdAt: now,
    updatedAt: now,
  },
].map((study) => ({
  ...study,
  template: "standard" as const,
  body: descriptionToBody(study.description, study.slug),
})) as CaseStudy[];

export const FALLBACK_STUDIES = fallbackStudies;

export const FALLBACK_SKILLS: Skill[] = [
  {
    id: "fallback-s1",
    icon: "📊",
    title: "Product Strategy",
    description: "Defining vision, roadmap, and go-to-market strategies",
    order: 0,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "fallback-s2",
    icon: "🔍",
    title: "User Research",
    description: "Understanding user needs through interviews and data",
    order: 1,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "fallback-s3",
    icon: "📈",
    title: "Analytics & Metrics",
    description: "Defining and tracking KPIs for product success",
    order: 2,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "fallback-s4",
    icon: "🤝",
    title: "Stakeholder Management",
    description: "Collaborating with engineering, design, and business teams",
    order: 3,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "fallback-s5",
    icon: "⚡",
    title: "Agile & Scrum",
    description: "Leading sprints and iterative product development",
    order: 4,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "fallback-s6",
    icon: "🎨",
    title: "Product Design",
    description: "Creating intuitive user experiences and workflows",
    order: 5,
    createdAt: now,
    updatedAt: now,
  },
];

export const FALLBACK_HERO = {
  caseStudies: FALLBACK_STUDIES.length,
  usersImpacted: FALLBACK_STUDIES.reduce((sum, s) => sum + s.usersImpacted, 0),
  thirdValue: "50",
  thirdLabel: "% Faster Deployment",
};

export const FALLBACK_EXPERIENCES: Experience[] = RESUME_EXPERIENCES.map((entry, index) => ({
  ...entry,
  id: `fallback-e${index + 1}`,
  createdAt: now,
  updatedAt: now,
}));
