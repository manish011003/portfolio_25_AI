/** The posts that shipped in the original static blog page, mapped into the CMS model. */
export const BLOG_SEED_POSTS = [
  {
    slug: "building-ai-agents-with-websockets",
    title: "Building AI Agents with WebSockets",
    category: "ai",
    emoji: "🤖",
    publishedAt: "2024-12-01",
    readMinutes: 5,
    excerpt:
      "Exploring how to create real-time AI agents using FastAPI WebSockets and GPT models for natural language task management...",
    externalUrl: "index.html#work",
  },
  {
    slug: "from-engineering-to-product-thinking",
    title: "From Engineering to Product Thinking",
    category: "pm",
    emoji: "🎯",
    publishedAt: "2024-11-01",
    readMinutes: 7,
    excerpt:
      "My journey transitioning from building features to thinking about user problems, market fit, and product strategy...",
    externalUrl: "/pm",
  },
  {
    slug: "real-time-pose-estimation-with-mediapipe",
    title: "Real-Time Pose Estimation with MediaPipe",
    category: "engineering",
    emoji: "💪",
    publishedAt: "2024-10-01",
    readMinutes: 6,
    excerpt:
      "Building a push-up counter using computer vision: lessons learned from angle calculations, form validation, and live feedback...",
    externalUrl: "index.html#work",
  },
  {
    slug: "llm-integration-patterns",
    title: "LLM Integration Patterns",
    category: "ai",
    emoji: "🧠",
    publishedAt: "2024-09-01",
    readMinutes: 8,
    excerpt:
      "Best practices for integrating large language models into production applications, from prompt engineering to cost optimization...",
    externalUrl: "index.html#work",
  },
  {
    slug: "case-study-e-waste-management-platform",
    title: "Case Study: E-Waste Management Platform",
    category: "pm",
    emoji: "♻️",
    publishedAt: "2024-08-01",
    readMinutes: 9,
    excerpt:
      "How we built a full-stack solution for SIH 2023, balancing user needs, technical constraints, and environmental impact...",
    externalUrl: "/pm#case-studies",
  },
] as const;
