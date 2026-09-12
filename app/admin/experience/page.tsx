import Link from "next/link";
import { createExperience, moveExperience } from "@/app/actions/experience";
import { AdminShell } from "@/components/admin/AdminShell";
import { ReorderButtons } from "@/components/admin/ReorderButtons";
import { formatExperienceRange } from "@/lib/experience";
import { getExperiences } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function AdminExperiencePage() {
  const entries = await getExperiences();

  return (
    <AdminShell title="Experience">
      <div className="mb-4">
        <form action={createExperience}>
          <button type="submit" className="rounded bg-zinc-900 px-3 py-2 text-sm text-white">
            New experience
          </button>
        </form>
      </div>
      <div className="overflow-x-auto rounded border border-zinc-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-3 py-2">Order</th>
              <th className="px-3 py-2">Role</th>
              <th className="px-3 py-2">Company</th>
              <th className="px-3 py-2">Dates</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id} className="border-b border-zinc-100">
                <td className="px-3 py-2 align-top">
                  <ReorderButtons
                    up={moveExperience.bind(null, entry.id, "up")}
                    down={moveExperience.bind(null, entry.id, "down")}
                  />
                  <div className="mt-1 text-xs text-zinc-400">{entry.order}</div>
                </td>
                <td className="px-3 py-2 font-medium">{entry.role}</td>
                <td className="px-3 py-2">{entry.company}</td>
                <td className="px-3 py-2">{formatExperienceRange(entry.startDate, entry.endDate)}</td>
                <td className="px-3 py-2">
                  <Link className="underline" href={`/admin/experience/${entry.id}`}>
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
