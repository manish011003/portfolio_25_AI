import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { ExperienceForm } from "@/components/admin/ExperienceForm";
import { getExperienceById } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function EditExperiencePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const entry = await getExperienceById(id);
  if (!entry) notFound();

  return (
    <AdminShell title={`Edit: ${entry.role}`}>
      <ExperienceForm entry={entry} />
    </AdminShell>
  );
}
