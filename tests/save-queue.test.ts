import assert from "node:assert/strict";
import { test } from "node:test";
import { SaveQueue, type SaveOutcome } from "../lib/save-queue";

const tick = (ms = 15) => new Promise((resolve) => setTimeout(resolve, ms));

/** A document store with optimistic concurrency, like persistBlogDraft: write only if base matches. */
function makeServer(initial: string) {
  const state = { value: initial, revision: "r0", n: 0 };
  const log: { value: string; base: string; result: string }[] = [];
  const gates: Array<() => void> = [];
  let inFlight = 0;
  let maxInFlight = 0;
  let hold = false;
  let failNext = 0;
  let throwNext = 0;
  return {
    state,
    log,
    get maxInFlight() {
      return maxInFlight;
    },
    holdResponses: (on: boolean) => {
      hold = on;
    },
    failNext: (n: number) => {
      failNext = n;
    },
    throwNext: (n: number) => {
      throwNext = n;
    },
    release: () => gates.shift()?.(),
    pending: () => gates.length,
    save: async (value: string, base: string, { force }: { force: boolean }): Promise<SaveOutcome> => {
      inFlight += 1;
      maxInFlight = Math.max(maxInFlight, inFlight);
      if (hold) await new Promise<void>((resolve) => gates.push(resolve));
      inFlight -= 1;
      if (throwNext > 0) {
        throwNext -= 1;
        throw new Error("network down");
      }
      if (failNext > 0) {
        failNext -= 1;
        log.push({ value, base, result: "error" });
        return { error: "Save failed. Try again." };
      }
      if (!force && base !== state.revision) {
        log.push({ value, base, result: "conflict" });
        return { conflict: true, revision: state.revision };
      }
      state.value = value;
      state.revision = `r${++state.n}`;
      log.push({ value, base, result: "ok" });
      return { ok: true, revision: state.revision };
    },
  };
}

function queueFor(server: ReturnType<typeof makeServer>, initial = "v0", onSaved?: ConstructorParameters<typeof SaveQueue<string>>[0]["onSaved"]) {
  return new SaveQueue<string>({ initial, revision: "r0", debounceMs: 5, save: server.save, onSaved });
}

test("rapid edits during a slow save: one request at a time, newest state wins, 'saved' only when latest is confirmed", async () => {
  const server = makeServer("v0");
  server.holdResponses(true);
  const q = queueFor(server);
  const violations: string[] = [];
  q.subscribe(() => {
    const { status, editRev, savedRev } = q.getSnapshot();
    if (status === "saved" && editRev !== savedRev) violations.push(`saved with editRev ${editRev} != savedRev ${savedRev}`);
  });

  q.edit("v1");
  await tick();
  assert.equal(server.pending(), 1, "first save is in flight");
  assert.equal(q.getSnapshot().status, "saving");

  q.edit("v2");
  q.edit("v3");
  q.edit("v4");
  await tick();
  assert.equal(server.pending(), 1, "no second request while the first is in flight");

  server.release(); // response for v1 arrives
  await tick();
  assert.notEqual(q.getSnapshot().status, "saved", "v1 confirmed but v4 is not: must not claim saved");
  assert.equal(server.state.value, "v1");
  assert.equal(server.pending(), 1, "the next request carries the newest state");

  server.release();
  await tick();
  assert.equal(server.state.value, "v4", "intermediate v2/v3 skipped, newest persisted last");
  assert.equal(q.getSnapshot().status, "saved");
  assert.equal(server.maxInFlight, 1);
  assert.deepEqual(server.log.map((l) => l.value), ["v1", "v4"]);
  assert.deepEqual(violations, [], "'saved' was never reported while a newer edit was unconfirmed");
});

test("an old save's response cannot flip the label to saved while newer edits exist", async () => {
  const server = makeServer("v0");
  server.holdResponses(true);
  const q = queueFor(server);
  q.edit("a");
  await tick();
  q.edit("b");
  const seen: string[] = [];
  q.subscribe(() => seen.push(q.getSnapshot().status));
  server.release();
  await tick();
  assert.ok(!seen.includes("saved"), `status sequence ${seen.join(",")} must not include saved before b is persisted`);
  server.release();
  await tick();
  assert.equal(q.getSnapshot().status, "saved");
  assert.equal(server.state.value, "b");
});

test("a failed save keeps local edits, shows failed, and retry persists the newest state", async () => {
  const server = makeServer("v0");
  const q = queueFor(server);
  server.failNext(1);
  q.edit("draft-1");
  await tick(40);
  assert.equal(q.getSnapshot().status, "failed");
  assert.equal(server.state.value, "v0", "nothing persisted");
  q.edit("draft-2"); // more typing while failed
  assert.equal(q.getSnapshot().status, "failed", "still reports the failure until a save succeeds");
  assert.equal(await q.flush(), true, "retry succeeds");
  assert.equal(server.state.value, "draft-2", "retry carried the edits made after the failure");
  assert.equal(q.getSnapshot().status, "saved");
});

test("a thrown error (network down) is a failure, not a crash, and flush() reports false", async () => {
  const server = makeServer("v0");
  const q = queueFor(server);
  server.throwNext(1);
  q.edit("x");
  assert.equal(await q.flush(), false);
  assert.equal(q.getSnapshot().status, "failed");
  assert.match(q.getSnapshot().error, /network down/);
  assert.equal(await q.flush(), true);
  assert.equal(server.state.value, "x");
});

test("flush resolves true only when every earlier edit is persisted", async () => {
  const server = makeServer("v0");
  server.holdResponses(true);
  const q = queueFor(server);
  q.edit("a");
  const flushed = q.flush();
  await tick();
  q.edit("b"); // after flush() was called: not required for it, but must still be saved
  server.release(); // "a" confirmed; the queue immediately sends "b"
  await tick();
  assert.equal(server.state.value, "a");
  assert.equal(q.getSnapshot().status, "saving");
  server.release();
  assert.equal(await flushed, true);
  assert.equal(server.state.value, "b");
  assert.equal(q.getSnapshot().status, "saved");
});

test("a stale writer is rejected instead of overwriting newer content (two tabs / replayed request)", async () => {
  const server = makeServer("v0");
  const tabA = queueFor(server);
  const tabB = queueFor(server);
  tabA.edit("from A");
  assert.equal(await tabA.flush(), true);
  tabB.edit("from B (built on r0)");
  assert.equal(await tabB.flush(), false);
  assert.equal(tabB.getSnapshot().status, "conflict");
  assert.equal(server.state.value, "from A", "newer content was not overwritten");
  // edits while in conflict are kept, not sent
  tabB.edit("from B, later");
  await tick(30);
  assert.equal(server.log.filter((l) => l.result === "conflict").length, 1, "no retry storm");
  assert.equal(await tabB.overwrite(), true);
  assert.equal(server.state.value, "from B, later");
  assert.equal(tabB.getSnapshot().status, "saved");
});

test("an old request replayed after a newer one is refused by the server", async () => {
  const server = makeServer("v0");
  const first = await server.save("one", "r0", { force: false });
  assert.deepEqual(first, { ok: true, revision: "r1" });
  const second = await server.save("two", "r1", { force: false });
  assert.deepEqual(second, { ok: true, revision: "r2" });
  const late = await server.save("one", "r0", { force: false }); // the older request lands last
  assert.ok("conflict" in late);
  assert.equal(server.state.value, "two");
});

test("onSaved reports whether the saved state is still the newest", async () => {
  const server = makeServer("v0");
  server.holdResponses(true);
  const flags: boolean[] = [];
  const q = queueFor(server, "v0", (_v, _o, isLatest) => flags.push(isLatest));
  q.edit("a");
  await tick();
  q.edit("b");
  server.release();
  await tick();
  server.release();
  await tick();
  assert.deepEqual(flags, [false, true]);
});

test("publish writes even when nothing else changed and carries the publish flag", async () => {
  const seen: boolean[] = [];
  const q = new SaveQueue<string>({
    initial: "v0",
    revision: "r0",
    debounceMs: 5,
    save: async (_v, _b, { publish }) => {
      seen.push(publish);
      return { ok: true, revision: "r1" };
    },
  });
  assert.equal(await q.publish(), true);
  assert.deepEqual(seen, [true]);
  assert.equal(q.getSnapshot().status, "saved");
  q.edit("x");
  await q.flush();
  assert.deepEqual(seen, [true, false], "the flag does not stick");
});

test("continuous typing is saved periodically, not only after the user stops", async () => {
  const server = makeServer("v0");
  const q = new SaveQueue<string>({ initial: "v0", revision: "r0", debounceMs: 40, maxWaitMs: 120, save: server.save });
  const end = Date.now() + 450;
  let i = 0;
  while (Date.now() < end) {
    q.edit(`typing-${i++}`); // an edit every 10ms never lets the 40ms debounce expire
    await tick(10);
  }
  assert.ok(server.log.length >= 2, `expected periodic saves while typing, got ${server.log.length}`);
  assert.notEqual(server.state.value, "v0");
  assert.equal(await q.flush(), true);
  assert.equal(server.state.value, `typing-${i - 1}`);
});
