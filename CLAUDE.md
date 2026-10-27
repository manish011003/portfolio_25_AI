# Graphify (project map)

- Before planning changes or exploring the project structure, read `graphify-out/GRAPH_REPORT.md` first (graph data: `graphify-out/graph.json`; query with `graphify path|explain`).
- Treat the graph as a map only. Verify the relevant source files before editing; never treat an old report as current truth.
- Check freshness: compare the report's "Built from commit" with `git rev-parse HEAD`. If the index is missing or outdated for the affected code, refresh it with `graphify update .` (installed v0.9.39, no LLM needed; doc/image changes need `/graphify --update`). Do not upgrade or install anything without asking the user.
- At the start of a coding task, briefly state which Graphify report you read and which source files you verified.
