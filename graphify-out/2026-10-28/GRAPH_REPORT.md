# Graph Report - portfolio  (2026-10-27)

## Corpus Check
- 85 files · ~73,453 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 488 nodes · 963 edges · 24 communities (20 shown, 4 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `dbd96895`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- blocks.ts
- case-studies.ts
- queries.ts
- dependencies
- experience/page.tsx
- compilerOptions
- CaseStudyArticle.tsx
- devDependencies
- lib/auth.ts
- gemini.js
- Hero.tsx
- script.js
- app/layout.tsx
- upload.ts
- AI Portfolio of Manish Biswas
- make-og.js
- pm-portfolio.js
- vercel.json
- admin/layout.tsx
- eslint.config.mjs
- next.config.ts
- postcss.config.mjs

## God Nodes (most connected - your core abstractions)
1. `requireAdmin()` - 29 edges
2. `revalidatePublicContent()` - 24 edges
3. `compilerOptions` - 16 edges
4. `deleteStoredImages()` - 15 edges
5. `asBody()` - 14 edges
6. `actionError()` - 13 edges
7. `saveCaseStudyDraft()` - 10 edges
8. `CaseChart()` - 10 edges
9. `scripts` - 10 edges
10. `AI Portfolio of Manish Biswas` - 10 edges

## Surprising Connections (you probably didn't know these)
- `ExperienceForm()` --calls--> `saveExperience()`  [EXTRACTED]
  components/admin/ExperienceForm.tsx → app/actions/experience.ts
- `ExperienceForm()` --calls--> `deleteExperience()`  [EXTRACTED]
  components/admin/ExperienceForm.tsx → app/actions/experience.ts
- `uploadCaseStudyImage()` --calls--> `actionError()`  [EXTRACTED]
  app/actions/upload.ts → lib/action-error.ts
- `uploadCaseStudyImage()` --calls--> `requireAdmin()`  [EXTRACTED]
  app/actions/upload.ts → lib/auth.ts
- `deleteStoredImages()` --calls--> `storagePathFromUrl()`  [EXTRACTED]
  app/actions/upload.ts → lib/storage.ts

## Import Cycles
- None detected.

## Communities (24 total, 4 thin omitted)

### Community 0 - "blocks.ts"
Cohesion: 0.06
Nodes (53): BLOCK_TYPES, BlockEditor(), CaseChart, CHART_TYPE_LABELS, ChartFields(), packRow(), rowDisplays(), rowValues() (+45 more)

### Community 1 - "case-studies.ts"
Cohesion: 0.10
Nodes (49): createCaseStudy(), createDraftCaseStudy(), deleteCaseStudy(), draftToData(), moveCaseStudy(), publishCaseStudy(), saveCaseStudyDraft(), saveCoverUrl() (+41 more)

### Community 2 - "queries.ts"
Cohesion: 0.07
Nodes (41): AdminCaseStudiesPage(), AdminHomePage(), dynamic, AdminSkillsPage(), CaseStudiesIndexPage(), metadata, revalidate, CaseStudyPage() (+33 more)

### Community 3 - "dependencies"
Cohesion: 0.05
Nodes (39): cors, dotenv, express, @google/generative-ai, next, dependencies, cors, dotenv (+31 more)

### Community 4 - "experience/page.tsx"
Cohesion: 0.09
Nodes (27): logoutAdmin(), dynamic, EditExperiencePage(), AdminExperiencePage(), dynamic, AdminShell(), EditorExperience, ExperienceForm() (+19 more)

### Community 5 - "compilerOptions"
Cohesion: 0.07
Nodes (27): dom, dom.iterable, esnext, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts (+19 more)

### Community 6 - "CaseStudyArticle.tsx"
Cohesion: 0.13
Nodes (15): dynamic, EditCaseStudyPage(), BrowserFrame(), DataHeavyLayout(), CaseStudyBlock(), CaseStudyGrid(), PALETTE, Pill() (+7 more)

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
Cohesion: 0.19
Nodes (10): bebas, dm, metadata, plex, applyTheme(), Theme, ThemeContext, ThemeProvider() (+2 more)

### Community 13 - "upload.ts"
Cohesion: 0.31
Nodes (9): ALLOWED, asUploadFile(), uploadCaseStudyImage(), uploadCoverImage(), UploadFile, ImageField(), storagePathFromUrl(), getCoversBucket() (+1 more)

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

## Knowledge Gaps
- **141 isolated node(s):** `ALLOWED`, `UploadFile`, `dynamic`, `dynamic`, `dynamic` (+136 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `requireAdmin()` connect `case-studies.ts` to `lib/auth.ts`, `upload.ts`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **Why does `asBody()` connect `case-studies.ts` to `blocks.ts`, `queries.ts`, `CaseStudyArticle.tsx`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **What connects `ALLOWED`, `UploadFile`, `dynamic` to the rest of the system?**
  _141 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `blocks.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05563093622795115 - nodes in this community are weakly interconnected._
- **Should `case-studies.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10259122157588578 - nodes in this community are weakly interconnected._
- **Should `queries.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07474747474747474 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._