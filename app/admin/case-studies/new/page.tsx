import { createDraftCaseStudy } from "@/app/actions/case-studies";
import { AdminShell } from "@/components/admin/AdminShell";

export default function NewCaseStudyPage() {
  return (
    <AdminShell title="New case study">
      <p className="mb-4 text-sm text-zinc-600">
        Creates a draft you can write in the block editor. Autosave stays a draft until you publish.
      </p>
      <form action={createDraftCaseStudy}>
        <button type="submit" className="rounded bg-zinc-900 px-4 py-2 text-sm text-white">
          Start writing
        </button>
      </form>
    </AdminShell>
  );
}
