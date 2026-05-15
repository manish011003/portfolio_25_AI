# Graph Report - C:\Users\manisbis\portfolio_25_AI  (2026-05-15)

## Corpus Check
- 4 files · ~27,838 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 15 nodes · 16 edges · 4 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]

## God Nodes (most connected - your core abstractions)
1. `sendMessage()` - 3 edges
2. `tryGenerate()` - 3 edges
3. `getApiBaseUrl()` - 2 edges
4. `appendMessage()` - 2 edges
5. `listModels()` - 2 edges
6. `ensureDiscoveredModels()` - 2 edges
7. `getModel()` - 2 edges
8. `generateReply()` - 2 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Communities

### Community 0 - "Community 0"
Cohesion: 0.47
Nodes (3): appendMessage(), getApiBaseUrl(), sendMessage()

### Community 1 - "Community 1"
Cohesion: 0.53
Nodes (5): ensureDiscoveredModels(), generateReply(), getModel(), listModels(), tryGenerate()

### Community 2 - "Community 2"
Cohesion: 1.0
Nodes (0): 

### Community 3 - "Community 3"
Cohesion: 1.0
Nodes (0): 

## Knowledge Gaps
- **Thin community `Community 2`** (2 nodes): `pm-portfolio.js`, `animateCounter()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 3`** (1 nodes): `blog.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Not enough signal to generate questions. This usually means the corpus has no AMBIGUOUS edges, no bridge nodes, no INFERRED relationships, and all communities are tightly cohesive. Add more files or run with --mode deep to extract richer edges._