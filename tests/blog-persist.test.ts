import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { PrismaClient } from "@prisma/client";
import { asBody, type ContentBlock } from "../lib/blocks";
import type { BlogDraft } from "../lib/blog";
import { persistBlogDraft, postRevision } from "../lib/blog-persist";

// Writes rows, so it only ever runs against a local database.
const host = (() => {
  try {
    return new URL(process.env.DATABASE_URL ?? "").hostname;
  } catch {
    return "";
  }
})();
const local = host === "127.0.0.1" || host === "localhost";
const opts = { skip: local ? false : "DATABASE_URL is not a local database; refusing to write" };

const db = local ? new PrismaClient() : (null as unknown as PrismaClient);
const created: string[] = [];

function draft(body: unknown, extra: Partial<BlogDraft> = {}): BlogDraft {
  return {
    title: "Persist test",
    slug: `persist-${Math.random().toString(36).slice(2, 9)}`,
    excerpt: "e",
    category: "ai",
    tags: ["x"],
    emoji: null,
    coverImage: null,
    body: asBody(body),
    publishedAt: null,
    readMinutes: 1,
    metaTitle: "",
    metaDescription: "",
    ...extra,
  };
}

async function newPost(body: unknown = []) {
  const d = draft(body);
  const row = await db.blogPost.create({
    data: { slug: d.slug, title: d.title, excerpt: "e", category: "ai", tags: ["x"], body: body as never, status: "draft", readMinutes: 1 },
  });
  created.push(row.id);
  return { row, d, revision: postRevision(row) };
}

const text = (b: ContentBlock[]) => b.map((x) => ("text" in x ? x.text : x.type));

before(() => {});
after(async () => {
  if (!local) return;
  await db.blogPost.deleteMany({ where: { id: { in: created } } });
  await db.$disconnect();
});

test("returned revision equals the revision of the stored row (jsonb key order cannot desync it)", opts, async () => {
  const { row, d, revision } = await newPost([]);
  d.body = asBody([
    { id: "a", type: "chart", chartType: "bar", title: "t", xLabel: "", yLabel: "", unit: "", data: [{ label: "l", value: 1 }] },
    { id: "b", type: "paragraph", text: "hi" },
  ]);
  const res = await persistBlogDraft(db, row.id, d, { baseRevision: revision });
  assert.ok("ok" in res);
  if (!("ok" in res)) return;
  const stored = await db.blogPost.findUniqueOrThrow({ where: { id: row.id } });
  assert.equal(res.revision, postRevision(stored));
});

test("a stale base is rejected and leaves the stored post untouched", opts, async () => {
  const { row, d, revision } = await newPost([{ id: "p", type: "paragraph", text: "original" }]);
  const a = await persistBlogDraft(db, row.id, { ...d, body: asBody([{ id: "p", type: "paragraph", text: "from A" }]) }, { baseRevision: revision });
  assert.ok("ok" in a);
  const b = await persistBlogDraft(db, row.id, { ...d, body: asBody([{ id: "p", type: "paragraph", text: "from B (stale)" }]) }, { baseRevision: revision });
  assert.ok("conflict" in b);
  const stored = await db.blogPost.findUniqueOrThrow({ where: { id: row.id } });
  assert.deepEqual(text(asBody(stored.body)), ["from A"]);
  if ("conflict" in b && "ok" in a) assert.equal(b.revision, a.revision, "conflict reports the current revision");
});

test("replaying an already-applied save (lost response) succeeds without changing anything", opts, async () => {
  const { row, d, revision } = await newPost([]);
  const mine = { ...d, body: asBody([{ id: "p", type: "paragraph", text: "same" }]) };
  const first = await persistBlogDraft(db, row.id, mine, { baseRevision: revision });
  assert.ok("ok" in first);
  const before = await db.blogPost.findUniqueOrThrow({ where: { id: row.id } });
  const replay = await persistBlogDraft(db, row.id, mine, { baseRevision: revision });
  assert.ok("ok" in replay);
  const after = await db.blogPost.findUniqueOrThrow({ where: { id: row.id } });
  assert.equal(after.updatedAt.getTime(), before.updatedAt.getTime(), "no second write");
});

test("concurrent writers on the same base: exactly one wins, the other is a conflict, nothing is lost or merged", opts, async () => {
  for (let round = 0; round < 8; round += 1) {
    const { row, d, revision } = await newPost([]);
    const mk = (word: string) => ({ ...d, body: asBody([{ id: "p", type: "paragraph", text: word }]) });
    const results = await Promise.all([
      persistBlogDraft(db, row.id, mk("alpha"), { baseRevision: revision }),
      persistBlogDraft(db, row.id, mk("beta"), { baseRevision: revision }),
      persistBlogDraft(db, row.id, mk("gamma"), { baseRevision: revision }),
    ]);
    const oks = results.filter((r) => "ok" in r);
    const conflicts = results.filter((r) => "conflict" in r);
    assert.equal(oks.length, 1, `round ${round}: one winner`);
    assert.equal(conflicts.length, 2);
    const stored = await db.blogPost.findUniqueOrThrow({ where: { id: row.id } });
    const winner = results.findIndex((r) => "ok" in r);
    assert.deepEqual(text(asBody(stored.body)), [["alpha", "beta", "gamma"][winner]]);
  }
});

test("a chain of saves each based on the previous revision all apply, in order", opts, async () => {
  const { row, d, revision } = await newPost([]);
  let base = revision;
  for (let i = 1; i <= 10; i += 1) {
    const res = await persistBlogDraft(db, row.id, { ...d, body: asBody([{ id: "p", type: "paragraph", text: `v${i}` }]) }, { baseRevision: base });
    assert.ok("ok" in res, `save ${i}`);
    if ("ok" in res) base = res.revision;
  }
  const stored = await db.blogPost.findUniqueOrThrow({ where: { id: row.id } });
  assert.deepEqual(text(asBody(stored.body)), ["v10"]);
});

test("force overwrites a newer stored version only when asked", opts, async () => {
  const { row, d, revision } = await newPost([]);
  await persistBlogDraft(db, row.id, { ...d, title: "newer elsewhere" }, { baseRevision: revision });
  const refused = await persistBlogDraft(db, row.id, { ...d, title: "mine" }, { baseRevision: revision });
  assert.ok("conflict" in refused);
  const forced = await persistBlogDraft(db, row.id, { ...d, title: "mine" }, { baseRevision: revision, force: true });
  assert.ok("ok" in forced);
  assert.equal((await db.blogPost.findUniqueOrThrow({ where: { id: row.id } })).title, "mine");
});

test("legacy bodies round-trip: ids, order and every word persist; duplicates are repaired, not dropped", opts, async () => {
  const legacy = [
    { id: "b-1", type: "paragraph", text: "one" },
    { type: "paragraph", text: "two" },
    { id: "b-1", type: "paragraph", text: "three" },
    { type: "list", ordered: true, items: [{ text: "x **b**" }, { text: "y [l](https://example.com)" }] },
    { type: "image", url: "https://e.com/a.png", alt: "A", title: "T", caption: "C", size: "inline" },
  ];
  const { row, d, revision } = await newPost(legacy);
  const loaded = asBody((await db.blogPost.findUniqueOrThrow({ where: { id: row.id } })).body);
  const res = await persistBlogDraft(db, row.id, { ...d, body: loaded }, { baseRevision: revision });
  assert.ok("ok" in res);
  const reloaded = asBody((await db.blogPost.findUniqueOrThrow({ where: { id: row.id } })).body);
  assert.deepEqual(reloaded, loaded, "stored == what the editor held");
  assert.equal(new Set(reloaded.map((b) => b.id)).size, reloaded.length);
  assert.deepEqual(text(reloaded).slice(0, 3), ["one", "two", "three"]);
});

test("publishing goes through the same revision check and sets status once", opts, async () => {
  const { row, d, revision } = await newPost([]);
  const stale = await persistBlogDraft(db, row.id, { ...d, title: "differs from stored" }, { baseRevision: "not-the-revision", publish: true });
  assert.ok("conflict" in stale);
  assert.equal((await db.blogPost.findUniqueOrThrow({ where: { id: row.id } })).status, "draft");
  const ok = await persistBlogDraft(db, row.id, d, { baseRevision: revision, publish: true });
  assert.ok("ok" in ok);
  const stored = await db.blogPost.findUniqueOrThrow({ where: { id: row.id } });
  assert.equal(stored.status, "published");
  assert.ok(stored.publishedAt);
});

test("a missing post is reported, not created", opts, async () => {
  const res = await persistBlogDraft(db, "does-not-exist", draft([]), { baseRevision: "x" });
  assert.ok("notFound" in res);
});
