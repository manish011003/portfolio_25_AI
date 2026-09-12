export function BrowserFrame({
  children,
  title = "project",
  className = "",
}: {
  children: React.ReactNode;
  title?: string;
  className?: string;
}) {
  return (
    <figure
      className={`overflow-hidden rounded-[14px] border-2 border-ink bg-paper shadow-[6px_8px_0_rgba(17,17,17,0.12)] ${className}`}
    >
      <div className="flex items-center gap-2 border-b-2 border-ink bg-chrome px-3 py-2">
        <span className="size-2.5 rounded-full bg-[#ff5f57]" />
        <span className="size-2.5 rounded-full bg-[#febc2e]" />
        <span className="size-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-2 truncate font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
          {title}
        </span>
      </div>
      <div className="bg-cream">{children}</div>
    </figure>
  );
}
