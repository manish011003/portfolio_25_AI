import Link from "next/link";
import { logoutAdmin } from "@/app/actions/auth";

export function AdminShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      <header className="mb-6 flex flex-col gap-3 border-b border-zinc-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Private CMS
          </p>
          <h1 className="text-2xl font-semibold">{title}</h1>
        </div>
        <nav className="flex flex-wrap gap-2 text-sm">
          <Link className="rounded border border-zinc-300 bg-white px-3 py-1.5" href="/admin">
            Home
          </Link>
          <Link className="rounded border border-zinc-300 bg-white px-3 py-1.5" href="/admin/case-studies">
            Case studies
          </Link>
          <Link className="rounded border border-zinc-300 bg-white px-3 py-1.5" href="/admin/skills">
            Skills
          </Link>
          <Link className="rounded border border-zinc-300 bg-white px-3 py-1.5" href="/admin/experience">
            Experience
          </Link>
          <Link className="rounded border border-zinc-300 bg-white px-3 py-1.5" href="/pm">
            View site
          </Link>
          <form action={logoutAdmin}>
            <button className="rounded border border-zinc-300 bg-white px-3 py-1.5" type="submit">
              Log out
            </button>
          </form>
        </nav>
      </header>
      {children}
    </div>
  );
}
