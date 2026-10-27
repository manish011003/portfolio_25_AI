# Graph Report - portfolio  (2026-10-28)

## Corpus Check
- 105 files · ~79,943 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 590 nodes · 1252 edges · 31 communities (26 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d51dfdd2`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CaseChart.tsx
- case-studies.ts
- queries.ts
- dependencies
- AdminShell.tsx
- compilerOptions
- CaseStudyArticle.tsx
- devDependencies
- lib/auth.ts
- gemini.js
- Hero.tsx
- script.js
- app/layout.tsx
- BlogListPage.tsx
- AI Portfolio of Manish Biswas
- make-og.js
- pm-portfolio.js
- vercel.json
- admin/layout.tsx
- eslint.config.mjs
- next.config.ts
- postcss.config.mjs
- actions/blog.ts
- BlockEditor.tsx
- blocks.ts
- CaseStudyBlocks.tsx
- BlogBlocks.tsx
- ImageLightbox.tsx
- CLAUDE.md

## God Nodes (most connected - your core abstractions)
1. `requireAdmin()` - 37 edges
2. `asBody()` - 24 edges
3. `revalidatePublicContent()` - 24 edges
4. `deleteStoredImages()` - 17 edges
5. `actionError()` - 17 edges
6. `compilerOptions` - 16 edges
7. `saveBlogDraft()` - 11 edges
8. `CaseChart()` - 11 edges
9. `scripts` - 11 edges
10. `saveCaseStudyDraft()` - 10 edges

## Surprising Connections (you probably didn't know these)
- `AdminSkillsPage()` --calls--> `getSkills()`  [EXTRACTED]
  app/admin/skills/page.tsx → lib/queries.ts
- `draftToData()` --calls--> `parseTags()`  [EXTRACTED]
  app/actions/blog.ts → lib/slug.ts
- `draftToData()` --calls--> `slugify()`  [EXTRACTED]
  app/actions/blog.ts → lib/slug.ts
- `createDraftBlogPost()` --calls--> `requireAdmin()`  [EXTRACTED]
  app/actions/blog.ts → lib/auth.ts
- `saveBlogDraft()` --calls--> `actionError()`  [EXTRACTED]
  app/actions/blog.ts → lib/action-error.ts

## Import Cycles
- None detected.

## Communities (31 total, 5 thin omitted)

### Community 0 - "CaseChart.tsx"
Cohesion: 0.22
Nodes (14): CaseChart, axisLabel(), CaseChart(), ChartTooltip(), keysIndex(), PlotRow, plotRows(), seriesKeys() (+6 more)

### Community 1 - "case-studies.ts"
Cohesion: 0.07
Nodes (64): createCaseStudy(), createDraftCaseStudy(), deleteCaseStudy(), draftToData(), moveCaseStudy(), publishCaseStudy(), saveCaseStudyDraft(), saveCoverUrl() (+56 more)

### Community 2 - "queries.ts"
Cohesion: 0.06
Nodes (47): AdminCaseStudiesPage(), AdminHomePage(), dynamic, CaseStudiesIndexPage(), metadata, revalidate, CaseStudyPage(), dynamicParams (+39 more)

### Community 3 - "dependencies"
Cohesion: 0.05
Nodes (40): cors, dotenv, express, @google/generative-ai, next, dependencies, cors, dotenv (+32 more)

### Community 4 - "AdminShell.tsx"
Cohesion: 0.22
Nodes (8): logoutAdmin(), dynamic, EditCaseStudyPage(), dynamic, EditExperiencePage(), AdminShell(), getCaseStudyById(), getExperienceById()

### Community 5 - "compilerOptions"
Cohesion: 0.07
Nodes (27): dom, dom.iterable, esnext, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts (+19 more)

### Community 6 - "CaseStudyArticle.tsx"
Cohesion: 0.13
Nodes (16): BrowserFrame(), CaseStudyArticle(), DataHeavyLayout(), CaseStudyBlock(), CaseStudyGrid(), ExperienceTimeline(), ROW_COLORS, PALETTE (+8 more)

### Community 7 - "devDependencies"
Cohesion: 0.08
Nodes (25): eslint, eslint-config-next, @eslint/eslintrc, devDependencies, eslint, eslint-config-next, @eslint/eslintrc, prisma (+17 more)

### Community 8 - "lib/auth.ts"
Cohesion: 0.18
Nodes (15): loginWithSecret(), ADMIN_SESSION_MAX_AGE, adminCookieOptions(), adminSecret(), adminSecretsEqual(), ADMIN_COOKIE, hex(), hmacHex() (+7 more)

### Community 9 - "gemini.js"
Cohesion: 0.13
Nodes (17): DEFAULT_SAFETY_SETTINGS, ensureDiscoveredModels(), generateReply(), getModel(), { GoogleGenerativeAI }, listModels(), MANISH_PERSONA_PROMPT, modelCache (+9 more)

### Community 10 - "Hero.tsx"
Cohesion: 0.16
Nodes (12): DoodleArrow(), DoodleCircle(), Tape(), Hero(), HeroCollage(), QUOTES, QuoteSlideshow(), randomNudge() (+4 more)

### Community 11 - "script.js"
Cohesion: 0.22
Nodes (15): appendMessage(), createWorkCard(), escapeHtml(), getApiBaseUrl(), getFilteredProjects(), openWorkPanel(), renderProjects(), resetChat() (+7 more)

### Community 12 - "app/layout.tsx"
Cohesion: 0.22
Nodes (8): bebas, dm, metadata, plex, applyTheme(), Theme, ThemeContext, ThemeProvider()

### Community 13 - "BlogListPage.tsx"
Cohesion: 0.08
Nodes (31): dynamic, PreviewBlogPostPage(), BlogPage(), jsonLd, metadata, revalidate, BlogPostPage(), dynamicParams (+23 more)

### Community 14 - "AI Portfolio of Manish Biswas"
Cohesion: 0.17
Nodes (11): AI Portfolio of Manish Biswas, Description, Features, First-time setup, License, PM portfolio CMS, Screenshots, Setup and Installation (+3 more)

### Community 15 - "make-og.js"
Cohesion: 0.33
Nodes (5): AVATAR, fs, OUT, path, sharp

### Community 16 - "pm-portfolio.js"
Cohesion: 0.67
Nodes (3): animateCounter(), observer, observerOptions

### Community 17 - "vercel.json"
Cohesion: 0.50
Nodes (3): buildCommand, framework, headers

### Community 24 - "actions/blog.ts"
Cohesion: 0.13
Nodes (35): createDraftBlogPost(), deleteBlogPost(), deleteUnusedImages(), draftToData(), duplicateBlogPost(), publishBlogPost(), saveBlogDraft(), slugTaken() (+27 more)

### Community 25 - "BlockEditor.tsx"
Cohesion: 0.13
Nodes (16): BLOCK_TYPES, BlockEditor(), BLOG_BLOCK_TYPES, CASE_STUDY_BLOCK_TYPES, CHART_TYPE_LABELS, ChartFields(), packRow(), rowDisplays() (+8 more)

### Community 26 - "blocks.ts"
Cohesion: 0.14
Nodes (17): CaseStudyBlocks(), asChartData(), asChartKind(), asNumberList(), asOptionalText(), asSeriesNames(), asTextList(), CHART_KINDS (+9 more)

### Community 27 - "CaseStudyBlocks.tsx"
Cohesion: 0.15
Nodes (7): QuoteView(), CaseStudySection, ImageBlock, parsePersonaFromQuote(), PersonaBlock, QuoteBlock, UiBlock

### Community 28 - "BlogBlocks.tsx"
Cohesion: 0.23
Nodes (8): BlockFields(), BlockView(), BlogBlocks(), reveal, ContentBlock, safeHref(), InlineText(), toEmbedUrl()

### Community 29 - "ImageLightbox.tsx"
Cohesion: 0.36
Nodes (8): destRect(), flipOrigin(), GenieFrom, GenieOrigin, ImageLightbox(), prefersReducedMotion(), sourceSize(), viewSize()

## Knowledge Gaps
- **157 isolated node(s):** `ALLOWED`, `UploadFile`, `dynamic`, `dynamic`, `dynamic` (+152 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `asBody()` connect `actions/blog.ts` to `case-studies.ts`, `blocks.ts`, `queries.ts`, `CaseStudyArticle.tsx`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **Why does `requireAdmin()` connect `case-studies.ts` to `actions/blog.ts`, `lib/auth.ts`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **What connects `ALLOWED`, `UploadFile`, `dynamic` to the rest of the system?**
  _157 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `case-studies.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07254901960784314 - nodes in this community are weakly interconnected._
- **Should `queries.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06246799795186892 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.04878048780487805 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._