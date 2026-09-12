import Link from "next/link";
import { Footer } from "@/components/pm/Footer";
import { Nav } from "@/components/pm/Nav";

export default function NotFound() {
  return (
    <div className="paper-lines min-h-screen text-ink">
      <Nav />
      <main className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="display text-7xl">Not found</h1>
        <p className="mt-4 text-ink/70">That case study is unpublished or does not exist.</p>
        <Link
          href="/pm"
          className="mt-8 inline-flex border-2 border-ink bg-ink px-4 py-2 font-mono text-xs uppercase tracking-[0.16em] text-cream"
        >
          Back to PM portfolio
        </Link>
      </main>
      <Footer />
    </div>
  );
}
