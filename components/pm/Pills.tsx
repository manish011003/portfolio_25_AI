const PALETTE = ["#f4b4c8", "#b8e986", "#7eb8e8", "#f5c518", "#e23b2c", "#d7c4f5"];

export function Pill({
  children,
  index = 0,
}: {
  children: React.ReactNode;
  index?: number;
}) {
  const bg = PALETTE[index % PALETTE.length];
  const dark = bg === "#e23b2c";
  return (
    <span
      className="inline-flex rounded-full border border-ink px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.12em]"
      style={{ background: bg, color: dark ? "#fff8ee" : "#111" }}
    >
      {children}
    </span>
  );
}
