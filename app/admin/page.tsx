import Link from "next/link";
import { saveSettings } from "@/app/actions/settings";
import { AdminShell } from "@/components/admin/AdminShell";
import { getAllCaseStudies, getAllSettings, getExperiences, getSkills } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const [studies, skills, settings, experiences] = await Promise.all([
    getAllCaseStudies(),
    getSkills(),
    getAllSettings(),
    getExperiences(),
  ]);
  const published = studies.filter((s) => s.status === "published").length;
  const featured = studies.filter((s) => s.featured).length;

  return (
    <AdminShell title="Dashboard">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded border border-zinc-200 bg-white p-4">
          <p className="text-sm text-zinc-500">Case studies</p>
          <p className="text-3xl font-semibold">{studies.length}</p>
          <p className="text-xs text-zinc-500">
            {published} published · {featured} featured
          </p>
        </div>
        <div className="rounded border border-zinc-200 bg-white p-4">
          <p className="text-sm text-zinc-500">Skills</p>
          <p className="text-3xl font-semibold">{skills.length}</p>
        </div>
        <div className="rounded border border-zinc-200 bg-white p-4">
          <p className="text-sm text-zinc-500">Experience</p>
          <p className="text-3xl font-semibold">{experiences.length}</p>
        </div>
        <div className="rounded border border-zinc-200 bg-white p-4">
          <p className="text-sm text-zinc-500">Users impacted (published)</p>
          <p className="text-3xl font-semibold">
            {studies
              .filter((s) => s.status === "published")
              .reduce((sum, s) => sum + s.usersImpacted, 0)
              .toLocaleString()}
          </p>
        </div>
      </div>

      <section className="mt-8 rounded border border-zinc-200 bg-white p-4">
        <h2 className="text-lg font-semibold">Hero third stat</h2>
        <p className="mt-1 text-sm text-zinc-600">
          Case study count and users impacted are computed from published records.
          This third number is a site setting.
        </p>
        <form action={saveSettings} className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="text-sm">
            Value
            <input
              name="hero_stat_3_value"
              defaultValue={settings.hero_stat_3_value ?? "50"}
              className="mt-1 w-full rounded border border-zinc-300 px-3 py-2"
            />
          </label>
          <label className="text-sm">
            Label
            <input
              name="hero_stat_3_label"
              defaultValue={settings.hero_stat_3_label ?? "% Faster Deployment"}
              className="mt-1 w-full rounded border border-zinc-300 px-3 py-2"
            />
          </label>
          <button type="submit" className="rounded bg-zinc-900 px-3 py-2 text-sm text-white sm:col-span-2">
            Save setting
          </button>
        </form>
      </section>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link className="rounded bg-zinc-900 px-4 py-2 text-sm text-white" href="/admin/case-studies/new">
          New case study
        </Link>
        <Link className="rounded border border-zinc-300 bg-white px-4 py-2 text-sm" href="/admin/skills">
          Edit skills
        </Link>
        <Link className="rounded border border-zinc-300 bg-white px-4 py-2 text-sm" href="/admin/experience">
          Edit experience
        </Link>
      </div>
    </AdminShell>
  );
}
