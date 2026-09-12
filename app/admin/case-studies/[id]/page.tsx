import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { CaseStudyForm } from "@/components/admin/CaseStudyForm";
import { asStats } from "@/lib/queries";
import { getCaseStudyById } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function EditCaseStudyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const study = await getCaseStudyById(id);
  if (!study) notFound();

  return (
    <AdminShell title={`Edit: ${study.title}`}>
      <CaseStudyForm
        study={{
          ...study,
          stats: asStats(study.stats),
        }}
      />
    </AdminShell>
  );
}
