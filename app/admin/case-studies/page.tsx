import Link from "next/link";
import {
  createDraftCaseStudy,
  moveCaseStudy,
  toggleCaseStudyFeatured,
  toggleCaseStudyStatus,
} from "@/app/actions/case-studies";
import { AdminShell } from "@/components/admin/AdminShell";
import { DeleteCaseStudyButton } from "@/components/admin/DeleteCaseStudyButton";
import { ReorderButtons } from "@/components/admin/ReorderButtons";
import { getAllCaseStudies } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function AdminCaseStudiesPage() {
  const studies = await getAllCaseStudies();

  return (
    <AdminShell title="Case studies">
      <div className="mb-4">
        <form action={createDraftCaseStudy}>
          <button type="submit" className="rounded bg-zinc-900 px-3 py-2 text-sm text-white">
            New case study
          </button>
        </form>
      </div>
      <div className="overflow-x-auto rounded border border-zinc-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-3 py-2">Order</th>
              <th className="px-3 py-2">Title</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Featured</th>
              <th className="px-3 py-2">Year</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {studies.map((study) => (
              <tr key={study.id} className="border-b border-zinc-100">
                <td className="px-3 py-2 align-top">
                  <ReorderButtons
                    up={moveCaseStudy.bind(null, study.id, "up")}
                    down={moveCaseStudy.bind(null, study.id, "down")}
                  />
                  <div className="mt-1 text-xs text-zinc-400">{study.order}</div>
                </td>
                <td className="px-3 py-2">
                  <div className="font-medium">{study.title}</div>
                  <div className="text-xs text-zinc-500">{study.slug}</div>
                </td>
                <td className="px-3 py-2">{study.status}</td>
                <td className="px-3 py-2">
                  <form action={toggleCaseStudyFeatured.bind(null, study.id)}>
                    <button type="submit" className="underline">
                      {study.featured ? "Yes" : "No"}
                    </button>
                  </form>
                </td>
                <td className="px-3 py-2">{study.year}</td>
                <td className="px-3 py-2">
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Link className="underline" href={`/admin/case-studies/${study.id}`}>
                      Edit
                    </Link>
                    <form action={toggleCaseStudyStatus.bind(null, study.id)}>
                      <button type="submit" className="underline">
                        {study.status === "published" ? "Unpublish" : "Publish"}
                      </button>
                    </form>
                    <DeleteCaseStudyButton id={study.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
