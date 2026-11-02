import assert from "node:assert/strict";
import { test } from "node:test";
import { asBody, bodyToPlainText, createBlock, type ContentBlock } from "../lib/blocks";

const ids = (body: ContentBlock[]) => body.map((b) => b.id);

test("posts stored before ids existed load with the same deterministic ids every time", () => {
  const stored = [
    { type: "heading", text: "H", level: 2 },
    { type: "paragraph", text: "P" },
    { type: "image", url: "u", alt: "a", caption: "c", size: "full" },
  ];
  assert.deepEqual(ids(asBody(stored)), ["b-0", "b-1", "b-2"]);
  assert.deepEqual(ids(asBody(stored)), ids(asBody(stored)));
});

test("existing ids are preserved untouched, including the old index-style ones", () => {
  const stored = [
    { id: "p-1", type: "paragraph", text: "one" },
    { id: "7c21362b-f2cd-4568-8dcc-249acc71a91d", type: "quote", text: "q", attribution: "x" },
  ];
  assert.deepEqual(ids(asBody(stored)), ["p-1", "7c21362b-f2cd-4568-8dcc-249acc71a91d"]);
});

test("colliding ids (the cause of duplicated/ghost blocks in the editor) are made unique without changing the first owner", () => {
  const stored = [
    { id: "b-1", type: "paragraph", text: "first explicit" },
    { type: "paragraph", text: "no id, fallback is b-1" },
    { id: "b-1", type: "paragraph", text: "second explicit" },
    { id: "", type: "divider" },
  ];
  const out = asBody(stored);
  assert.equal(new Set(ids(out)).size, out.length, `ids not unique: ${ids(out)}`);
  assert.equal(out[0].id, "b-1");
  assert.deepEqual(out.map((b) => (b.type === "paragraph" ? b.text : b.type)), [
    "first explicit",
    "no id, fallback is b-1",
    "second explicit",
    "divider",
  ]);
  assert.deepEqual(ids(asBody(stored)), ids(out), "deterministic");
});

test("normalising is idempotent: what the server stores loads back with identical ids and content", () => {
  const first = asBody([
    { id: "b-1", type: "paragraph", text: "x" },
    { id: "b-1", type: "paragraph", text: "y" },
    { type: "list", ordered: true, items: [{ text: "a" }, { text: "b" }] },
    { type: "gallery", images: [{ url: "1", alt: "" }, { url: "2", alt: "" }] },
  ]);
  const second = asBody(JSON.parse(JSON.stringify(first)));
  assert.deepEqual(second, first);
});

test("older posts without the new fields are unchanged apart from the empty figure title", () => {
  const stored = [{ id: "i", type: "image", url: "u", alt: "alt", caption: "cap", size: "inline" }];
  const [img] = asBody(stored);
  assert.equal(img.type, "image");
  if (img.type !== "image") return;
  assert.deepEqual({ ...img, title: undefined }, { id: "i", type: "image", url: "u", alt: "alt", caption: "cap", size: "inline", title: undefined });
  assert.equal(img.title, "");
});

test("image figure title, alt text, caption and size survive normalising", () => {
  const [img] = asBody([{ id: "i", type: "image", url: "u", alt: "Alt!", title: "Figure 1", caption: "Cap", size: "full" }]);
  assert.deepEqual(img, { id: "i", type: "image", url: "u", alt: "Alt!", title: "Figure 1", caption: "Cap", size: "full" });
});

test("list blocks keep order, item ids and inline markup; legacy string items are accepted", () => {
  const [list] = asBody([
    { id: "l", type: "list", ordered: true, items: [{ id: "i1", text: "**bold** [link](https://example.com)" }, { id: "i2", text: "two" }, "three"] },
  ]);
  assert.equal(list.type, "list");
  if (list.type !== "list") return;
  assert.equal(list.ordered, true);
  assert.deepEqual(list.items.map((i) => i.id), ["i1", "i2", "l-l2"]);
  assert.deepEqual(list.items.map((i) => i.text), ["**bold** [link](https://example.com)", "two", "three"]);
});

test("gallery images get stable unique ids", () => {
  const [g] = asBody([{ id: "g", type: "gallery", images: [{ url: "1", alt: "a" }, { id: "x", url: "2", alt: "b" }, { id: "x", url: "3", alt: "c" }] }]);
  if (g.type !== "gallery") throw new Error("not a gallery");
  assert.equal(new Set(g.images.map((i) => i.id)).size, 3);
  assert.deepEqual(g.images.map((i) => i.url), ["1", "2", "3"]);
});

test("new blocks always get globally unique ids", () => {
  const made = Array.from({ length: 200 }, () => createBlock("list").id);
  assert.equal(new Set(made).size, 200);
});

test("list text counts toward the automatic excerpt / read time", () => {
  const body = asBody([{ id: "l", type: "list", ordered: false, items: [{ id: "a", text: "alpha" }, { id: "b", text: "beta" }] }]);
  assert.equal(bodyToPlainText(body), "alpha\nbeta");
});
