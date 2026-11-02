# Graph Report - portfolio  (2026-11-02)

## Corpus Check
- 111 files · ~87,407 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 644 nodes · 1372 edges · 31 communities (26 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.56)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0b8f5482`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CaseChart.tsx
- case-studies.ts
- queries.ts
- dependencies
- SaveQueue
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
- asBody
- blocks.ts
- types.ts
- CaseStudyBlocks.tsx
- BlogBlocks.tsx
- ChartFields
- CLAUDE.md

## God Nodes (most connected - your core abstractions)
1. `requireAdmin()` - 37 edges
2. `asBody()` - 33 edges
3. `revalidatePublicContent()` - 24 edges
4. `deleteStoredImages()` - 17 edges
5. `actionError()` - 17 edges
6. `SaveQueue` - 16 edges
7. `compilerOptions` - 16 edges
8. `scripts` - 12 edges
9. `saveBlogDraft()` - 11 edges
10. `CaseChart()` - 11 edges

## Surprising Connections (you probably didn't know these)
- `createDraftBlogPost()` --calls--> `requireAdmin()`  [EXTRACTED]
  app/actions/blog.ts → lib/auth.ts
- `saveBlogDraft()` --calls--> `actionError()`  [EXTRACTED]
  app/actions/blog.ts → lib/action-error.ts
- `saveBlogDraft()` --calls--> `requireAdmin()`  [EXTRACTED]
  app/actions/blog.ts → lib/auth.ts
- `publishBlogPost()` --calls--> `actionError()`  [EXTRACTED]
  app/actions/blog.ts → lib/action-error.ts
- `publishBlogPost()` --calls--> `requireAdmin()`  [EXTRACTED]
  app/actions/blog.ts → lib/auth.ts

## Import Cycles
- None detected.

## Communities (31 total, 5 thin omitted)

### Community 0 - "CaseChart.tsx"
Cohesion: 0.24
Nodes (13): CaseChart, axisLabel(), CaseChart(), ChartTooltip(), keysIndex(), PlotRow, plotRows(), seriesKeys() (+5 more)

### Community 1 - "case-studies.ts"
Cohesion: 0.07
Nodes (65): logoutAdmin(), createDraftCaseStudy(), deleteCaseStudy(), moveCaseStudy(), publishCaseStudy(), saveCaseStudyDraft(), saveCoverUrl(), toggleCaseStudyFeatured() (+57 more)

### Community 2 - "queries.ts"
Cohesion: 0.07
Nodes (44): AdminCaseStudiesPage(), AdminHomePage(), dynamic, AdminSkillsPage(), CaseStudiesIndexPage(), metadata, revalidate, CaseStudyPage() (+36 more)

### Community 3 - "dependencies"
Cohesion: 0.05
Nodes (41): cors, dotenv, express, @google/generative-ai, next, dependencies, cors, dotenv (+33 more)

### Community 4 - "SaveQueue"
Cohesion: 0.15
Nodes (5): QueueSnapshot, SaveOptions, SaveOutcome, SaveQueue, SaveStatus

### Community 5 - "compilerOptions"
Cohesion: 0.07
Nodes (27): dom, dom.iterable, esnext, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts (+19 more)

### Community 6 - "CaseStudyArticle.tsx"
Cohesion: 0.09
Nodes (25): dynamic, EditCaseStudyPage(), BrowserFrame(), CaseStudyArticle(), DataHeavyLayout(), CaseStudyBlock(), ROW_COLORS, destRect() (+17 more)

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
Cohesion: 0.07
Nodes (37): dynamic, PreviewBlogPostPage(), BlogPage(), jsonLd, metadata, revalidate, BlogPostPage(), dynamicParams (+29 more)

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

### Community 24 - "asBody"
Cohesion: 0.08
Nodes (52): createDraftBlogPost(), deleteBlogPost(), deleteUnusedImages(), duplicateBlogPost(), publishBlogPost(), saveBlogDraft(), slugTaken(), toggleBlogStatus() (+44 more)

### Community 25 - "blocks.ts"
Cohesion: 0.11
Nodes (31): BLOCK_TYPES, BlockEditor(), BlockPatch, CASE_STUDY_BLOCK_TYPES, CHART_TYPE_LABELS, GalleryFields(), ListFields(), asChartData() (+23 more)

### Community 26 - "types.ts"
Cohesion: 0.22
Nodes (6): CaseStudyTemplate, ContentBlock, CaseStudyInput, CaseStudyStat, CaseStudyStatus, SkillInput

### Community 27 - "CaseStudyBlocks.tsx"
Cohesion: 0.12
Nodes (11): CaseStudyBlocks(), QuoteView(), CaseStudySection, groupCaseStudySections(), ImageBlock, isAsideBlock(), isMediaBlock(), parsePersonaFromQuote() (+3 more)

### Community 28 - "BlogBlocks.tsx"
Cohesion: 0.23
Nodes (8): BlockFields(), BlockView(), BlogBlocks(), reveal, safeHref(), InlineText(), toEmbedUrl(), render()

### Community 29 - "ChartFields"
Cohesion: 0.50
Nodes (4): ChartFields(), packRow(), rowDisplays(), rowValues()

## Knowledge Gaps
- **170 isolated node(s):** `ALLOWED`, `UploadFile`, `dynamic`, `dynamic`, `dynamic` (+165 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `asBody()` connect `asBody` to `case-studies.ts`, `queries.ts`, `CaseStudyArticle.tsx`, `BlogListPage.tsx`, `blocks.ts`, `types.ts`, `BlogBlocks.tsx`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **Why does `SaveQueue` connect `SaveQueue` to `asBody`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **Why does `requireAdmin()` connect `case-studies.ts` to `asBody`, `lib/auth.ts`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **What connects `ALLOWED`, `UploadFile`, `dynamic` to the rest of the system?**
  _170 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `case-studies.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06537282941777324 - nodes in this community are weakly interconnected._
- **Should `queries.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0672316384180791 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.047619047619047616 - nodes in this community are weakly interconnected._