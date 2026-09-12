export function ReorderButtons({
  up,
  down,
}: {
  up: (formData: FormData) => Promise<void>;
  down: (formData: FormData) => Promise<void>;
}) {
  return (
    <div className="flex gap-1">
      <form action={up}>
        <button type="submit" className="rounded border border-zinc-300 px-2 py-1 text-xs">
          Up
        </button>
      </form>
      <form action={down}>
        <button type="submit" className="rounded border border-zinc-300 px-2 py-1 text-xs">
          Down
        </button>
      </form>
    </div>
  );
}
