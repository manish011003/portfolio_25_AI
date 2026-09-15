"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function ReorderButtons({
  up,
  down,
}: {
  up: () => Promise<unknown>;
  down: () => Promise<unknown>;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function run(action: () => Promise<unknown>) {
    startTransition(async () => {
      await action();
      router.refresh();
    });
  }

  return (
    <div className="flex gap-1">
      <button
        type="button"
        disabled={pending}
        className="rounded border border-zinc-300 px-2 py-1 text-xs disabled:opacity-50"
        onClick={() => run(up)}
      >
        Up
      </button>
      <button
        type="button"
        disabled={pending}
        className="rounded border border-zinc-300 px-2 py-1 text-xs disabled:opacity-50"
        onClick={() => run(down)}
      >
        Down
      </button>
    </div>
  );
}
