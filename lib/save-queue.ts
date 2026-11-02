export type SaveStatus = "saved" | "unsaved" | "saving" | "failed" | "conflict";

export type SaveOutcome =
  /** Persisted; `revision` is the server's token for what is now stored. */
  | { ok: true; revision: string }
  /** The server holds something newer than the revision this save was based on. */
  | { conflict: true; revision: string }
  | { error: string };

export type SaveOptions = { force: boolean; publish: boolean };

export type QueueSnapshot = {
  status: SaveStatus;
  error: string;
  /** Last revision token confirmed by the server. */
  revision: string;
  /** Number of local edits made so far, and how many of them the server has confirmed. */
  editRev: number;
  savedRev: number;
};

/**
 * Autosave for a single document that is edited continuously.
 *
 * - One request is in flight at a time and it always carries the newest local state, so an older
 *   state can never be written after a newer one. Edits made during a save are sent next.
 * - Every edit bumps `editRev`; a save records the `editRev` it was built from. "Saved" means
 *   `savedRev === editRev` and nothing is in flight — never "a request finished".
 * - Each request is based on the server's revision token. If the stored document moved on
 *   (another tab, a replayed request) the server answers `conflict` and nothing is overwritten
 *   until the user chooses to.
 * - A failed save keeps every local edit; `flush()` / the next edit retries.
 */
export class SaveQueue<T> {
  private latest: T;
  private editRev = 0;
  private savedRev = 0;
  private revision: string;
  private error = "";
  private conflictRevision: string | null = null;
  private saving = false;
  private forceNext = false;
  private publishNext = false;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private pendingSince = 0;
  private draining: Promise<void> | null = null;
  private listeners = new Set<() => void>();
  private snapshot: QueueSnapshot;

  constructor(
    private readonly options: {
      save: (value: T, baseRevision: string, save: SaveOptions) => Promise<SaveOutcome>;
      /** The document as loaded, and the revision token it was loaded at. */
      initial: T;
      revision: string;
      debounceMs?: number;
      /** Longest a burst of continuous edits may go without a save attempt. */
      maxWaitMs?: number;
      /** `isLatest` is false when the user edited again while this save was in flight. */
      onSaved?: (value: T, outcome: { revision: string }, isLatest: boolean) => void;
    },
  ) {
    this.latest = options.initial;
    this.revision = options.revision;
    this.snapshot = this.compute();
  }

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  getSnapshot = () => this.snapshot;

  private compute(): QueueSnapshot {
    let status: SaveStatus;
    if (this.conflictRevision !== null) status = "conflict";
    else if (this.saving) status = "saving";
    else if (this.error) status = "failed";
    else if (this.editRev > this.savedRev) status = "unsaved";
    else status = "saved";
    return {
      status,
      error: this.error,
      revision: this.revision,
      editRev: this.editRev,
      savedRev: this.savedRev,
    };
  }

  private emit() {
    this.snapshot = this.compute();
    for (const listener of this.listeners) listener();
  }

  private clearTimer() {
    if (this.timer) clearTimeout(this.timer);
    this.timer = null;
  }

  /** Record a new local state and schedule a save. */
  edit(value: T) {
    this.latest = value;
    this.editRev += 1;
    this.emit();
    if (this.conflictRevision !== null) return;
    const now = Date.now();
    if (!this.timer) this.pendingSince = now;
    this.clearTimer();
    const debounce = this.options.debounceMs ?? 800;
    const maxWait = this.options.maxWaitMs ?? 4000;
    const delay = Math.max(0, Math.min(debounce, maxWait - (now - this.pendingSince)));
    this.timer = setTimeout(() => {
      this.timer = null;
      void this.drain();
    }, delay);
  }

  private drain(): Promise<void> {
    if (this.draining) return this.draining;
    this.draining = (async () => {
      try {
        while (this.editRev > this.savedRev && this.conflictRevision === null) {
          const rev = this.editRev;
          const value = this.latest;
          const attempt = { force: this.forceNext, publish: this.publishNext };
          this.saving = true;
          this.error = "";
          this.emit();

          let outcome: SaveOutcome;
          try {
            outcome = await this.options.save(value, this.revision, attempt);
          } catch (err) {
            outcome = { error: err instanceof Error ? err.message : "Save failed" };
          }
          this.saving = false;

          if ("ok" in outcome) {
            this.revision = outcome.revision;
            this.savedRev = Math.max(this.savedRev, rev);
            if (attempt.force) this.forceNext = false;
            if (attempt.publish) this.publishNext = false;
            this.emit();
            this.options.onSaved?.(value, outcome, this.editRev === rev);
          } else if ("conflict" in outcome) {
            this.conflictRevision = outcome.revision;
            this.emit();
            break;
          } else {
            this.error = outcome.error || "Save failed";
            this.emit();
            break;
          }
        }
      } finally {
        this.draining = null;
        this.saving = false;
        this.emit();
      }
    })();
    return this.draining;
  }

  /**
   * Save now. Resolves true only when every edit made before the call is confirmed persisted.
   * After a failure it tries again, so it doubles as "Retry".
   */
  async flush(): Promise<boolean> {
    this.clearTimer();
    const target = this.editRev;
    while (this.savedRev < target && this.conflictRevision === null) {
      await this.drain();
      if (this.error) break;
    }
    return this.savedRev >= target && this.conflictRevision === null;
  }

  /** Save the latest state and mark the post published in the same write. */
  async publish(): Promise<boolean> {
    this.publishNext = true;
    this.editRev += 1; // force a write even when nothing else changed
    this.emit();
    const ok = await this.flush();
    if (!ok) this.publishNext = false;
    return ok;
  }

  /** After a conflict: keep the local version and replace what the server has. */
  async overwrite(): Promise<boolean> {
    if (this.conflictRevision === null) return this.flush();
    this.revision = this.conflictRevision;
    this.conflictRevision = null;
    this.forceNext = true;
    this.editRev += 1;
    this.emit();
    return this.flush();
  }

  /** The only thing not yet persisted is what the user may lose by leaving. */
  get isClean() {
    return this.snapshot.status === "saved";
  }

  dispose() {
    this.clearTimer();
    this.listeners.clear();
  }
}
