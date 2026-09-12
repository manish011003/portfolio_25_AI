import { config } from "dotenv";
import { resolve } from "path";
import { PrismaClient } from "@prisma/client";
import { descriptionToBody, isEmptyBody } from "../lib/blocks";
import { RESUME_EXPERIENCES } from "../lib/resume";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

const prisma = new PrismaClient();

const caseStudies = [
  {
    slug: "ironclad",
    title: "Ironclad — Cross-Platform Fitness App",
    category: "Consumer Fitness",
    year: 2026,
    summary:
      "Defined and shipped a single Expo codebase for iOS, Android, and Web: AI meal logging, form checking, training plans, social meal feeds, XP loops, and Spotify soundtrack pins.",
    description: `Defined and shipped a single Expo codebase for iOS, Android, and Web: AI meal logging, form checking, training plans, social meal feeds, XP loops, and Spotify soundtrack pins — prioritizing activation (BMI/TDEE onboarding) and retention (plans + achievements).

The product bet was simple: one codebase, three platforms, and a loop that makes coming back feel obvious. Onboarding starts with BMI/TDEE so the first session is personal. Retention is planned — training plans, achievements, and soundtrack pins — not left to willpower.

I owned the product framing, the activation/retention metrics, and the cut-line between v1 (ship the habit) and v2 (plans + soundtrack).`,
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
    status: "published" as const,
    order: 0,
  },
  {
    slug: "claro-ai",
    title: "Claro AI Analytics Platform",
    category: "B2B SaaS",
    year: 2024,
    summary:
      "Led product development for an AI-powered analytics platform serving 1000+ users. Focused on making complex data accessible through LLM-powered insights and intuitive dashboards.",
    description: `Led product development for an AI-powered analytics platform serving 1000+ users. Focused on making complex data accessible through LLM-powered insights and intuitive dashboards.

The job was translation: take messy operational data and turn it into something a non-analyst could act on. I worked across research, roadmap, and delivery — deciding which insights were worth an LLM call, and which belonged in a plain chart.

Reliability was a product feature, not an engineering leftover. The platform needed to feel instant and stay up, or the insight layer would never get trusted.`,
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
    status: "published" as const,
    order: 1,
  },
  {
    slug: "e-waste-platform",
    title: "E-Waste Management Platform",
    category: "Social Impact",
    year: 2023,
    summary:
      "Designed and launched a full-stack platform for e-waste management, connecting consumers, collection centers, and recyclers. Finalist at Smart India Hackathon 2023.",
    description: `Designed and launched a full-stack platform for e-waste management, connecting consumers, collection centers, and recyclers. Finalist at Smart India Hackathon 2023.

The supply chain only works if each side shows up: a household that can drop a device off, a facility that can take it, and a recycler that can process it. I scoped an MVP around those three roles instead of boiling the ocean with a marketplace.

The work sat in product design and UX as much as logistics — reducing the number of steps between “I have old electronics” and “they are in the right facility.”`,
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
    status: "published" as const,
    order: 2,
  },
  {
    slug: "ai-task-agent",
    title: "AI Task Management Agent",
    category: "AI Product",
    year: 2024,
    summary:
      "Built an AI-powered task management system that reduces cognitive load by enabling natural language task creation and organization. Focused on user experience and API cost optimization.",
    description: `Built an AI-powered task management system that reduces cognitive load by enabling natural language task creation and organization. Focused on user experience and API cost optimization.

The product question was not “can the model parse a task?” — it was “can someone dump a messy thought and trust the system to file it?” I treated accuracy and cost as the same problem: a cheaper call that is wrong is still expensive.

The work mixed user research, product metrics, and a hard look at where the model actually earned its keep.`,
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
    status: "published" as const,
    order: 3,
  },
];

const skills = [
  {
    icon: "📊",
    title: "Product Strategy",
    description: "Defining vision, roadmap, and go-to-market strategies",
    order: 0,
  },
  {
    icon: "🔍",
    title: "User Research",
    description: "Understanding user needs through interviews and data",
    order: 1,
  },
  {
    icon: "📈",
    title: "Analytics & Metrics",
    description: "Defining and tracking KPIs for product success",
    order: 2,
  },
  {
    icon: "🤝",
    title: "Stakeholder Management",
    description: "Collaborating with engineering, design, and business teams",
    order: 3,
  },
  {
    icon: "⚡",
    title: "Agile & Scrum",
    description: "Leading sprints and iterative product development",
    order: 4,
  },
  {
    icon: "🎨",
    title: "Product Design",
    description: "Creating intuitive user experiences and workflows",
    order: 5,
  },
];

async function main() {
  for (const study of caseStudies) {
    const body = descriptionToBody(study.description, study.slug);
    const existing = await prisma.caseStudy.findUnique({ where: { slug: study.slug } });
    const payload = {
      ...study,
      template: "standard" as const,
      body,
    };
    if (!existing) {
      await prisma.caseStudy.create({ data: payload });
      continue;
    }
    await prisma.caseStudy.update({
      where: { slug: study.slug },
      data: isEmptyBody(existing.body)
        ? payload
        : { ...payload, body: undefined, template: existing.template },
    });
  }

  const existingSkills = await prisma.skill.count();
  if (existingSkills === 0) {
    await prisma.skill.createMany({ data: skills });
  }

  const featuredCount = await prisma.caseStudy.count({ where: { featured: true } });
  if (featuredCount === 0) {
    await prisma.caseStudy.updateMany({
      where: { slug: { in: ["ironclad", "claro-ai"] } },
      data: { featured: true },
    });
  }

  await prisma.experience.deleteMany();
  await prisma.experience.createMany({ data: RESUME_EXPERIENCES });

  await prisma.siteSetting.upsert({
    where: { key: "hero_stat_3_value" },
    update: {},
    create: { key: "hero_stat_3_value", value: "50" },
  });
  await prisma.siteSetting.upsert({
    where: { key: "hero_stat_3_label" },
    update: {},
    create: { key: "hero_stat_3_label", value: "% Faster Deployment" },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
