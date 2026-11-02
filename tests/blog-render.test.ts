import assert from "node:assert/strict";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { asBody } from "../lib/blocks";
import { BlogBlocks } from "../components/blog/BlogBlocks";

const render = (body: unknown) => renderToStaticMarkup(createElement(BlogBlocks, { blocks: asBody(body) }));

test("bulleted list renders semantic ul/li with inline formatting and links inside items", () => {
  const html = render([
    { id: "l", type: "list", ordered: false, items: [
      { id: "a", text: "**Bold** start and *italic* middle" },
      { id: "b", text: "A [link](https://example.com/x) inside" },
    ] },
  ]);
  assert.match(html, /<ul class="bb-list bb-ul">/);
  assert.equal((html.match(/<li>/g) ?? []).length, 2);
  assert.match(html, /<li><strong>Bold<\/strong> start and <em>italic<\/em> middle<\/li>/);
  assert.match(html, /<li>A <a href="https:\/\/example\.com\/x"[^>]*>link<\/a> inside<\/li>/);
  assert.doesNotMatch(html, /<ol/);
});

test("numbered list renders ol", () => {
  const html = render([{ id: "l", type: "list", ordered: true, items: [{ id: "a", text: "one" }, { id: "b", text: "two" }] }]);
  assert.match(html, /<ol class="bb-list bb-ol"><li>one<\/li><li>two<\/li><\/ol>/);
});

test("empty items are skipped and an all-empty list renders nothing", () => {
  assert.match(render([{ id: "l", type: "list", ordered: false, items: [{ id: "a", text: "x" }, { id: "b", text: "  " }] }]), /<ul class="bb-list bb-ul"><li>x<\/li><\/ul>/);
  assert.doesNotMatch(render([{ id: "l", type: "list", ordered: false, items: [{ id: "a", text: "" }] }]), /<ul|<ol/);
});

test("list item markup cannot inject HTML or unsafe links", () => {
  const html = render([{ id: "l", type: "list", ordered: false, items: [
    { id: "a", text: "<img src=x onerror=alert(1)> [x](javascript:alert(1))" },
  ] }]);
  assert.doesNotMatch(html, /<img/);
  assert.doesNotMatch(html, /href="javascript/);
  assert.match(html, /&lt;img/);
});

test("figure title renders above the image, caption below, in one figure", () => {
  const html = render([{ id: "i", type: "image", url: "https://e.com/a.png", alt: "Alt text", title: "Figure 1: Title", caption: "Caption below", size: "full" }]);
  const title = html.indexOf("Figure 1: Title");
  const img = html.indexOf("<img");
  const cap = html.indexOf("<figcaption>Caption below");
  assert.ok(title > -1 && img > title && cap > img, "title < image < caption");
  assert.equal((html.match(/<figure/g) ?? []).length, 1);
  assert.match(html, /<p class="bb-figtitle">Figure 1: Title<\/p>/);
  assert.match(html, /<figcaption>Caption below<\/figcaption>/);
});

test("images without a title render exactly as before (no extra markup)", () => {
  const withEmpty = render([{ id: "i", type: "image", url: "https://e.com/a.png", alt: "A", title: "", caption: "C", size: "full" }]);
  const legacy = render([{ id: "i", type: "image", url: "https://e.com/a.png", alt: "A", caption: "C", size: "full" }]);
  assert.equal(withEmpty, legacy);
  assert.doesNotMatch(legacy, /bb-figtitle/);
});

test("existing block types render unchanged", () => {
  const html = render([
    { id: "h", type: "heading", text: "Heading", level: 2 },
    { id: "p", type: "paragraph", text: "Para **b**" },
    { id: "q", type: "quote", text: "Quote", attribution: "Me" },
    { id: "d", type: "divider" },
  ]);
  assert.match(html, /<h2 class="bb-h2">Heading<\/h2>/);
  assert.match(html, /<p class="bb-p">Para <strong>b<\/strong><\/p>/);
  assert.match(html, /<blockquote class="bb-quote"><p>Quote<\/p><footer>— Me<\/footer><\/blockquote>/);
  assert.match(html, /<hr class="bb-hr"\/>/);
});
