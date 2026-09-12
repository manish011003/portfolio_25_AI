import { createSkill, deleteSkill, moveSkill, updateSkill } from "@/app/actions/skills";
import { AdminShell } from "@/components/admin/AdminShell";
import { ReorderButtons } from "@/components/admin/ReorderButtons";
import { getSkills } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function AdminSkillsPage() {
  const skills = await getSkills();

  return (
    <AdminShell title="Skills">
      <form action={createSkill} className="mb-8 space-y-3 rounded border border-zinc-200 bg-white p-4">
        <h2 className="font-semibold">Add skill</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm">
            Icon (emoji or short text)
            <input name="icon" defaultValue="◆" className="mt-1 w-full rounded border border-zinc-300 px-3 py-2" />
          </label>
          <label className="text-sm">
            Order
            <input name="order" type="number" defaultValue={skills.length} className="mt-1 w-full rounded border border-zinc-300 px-3 py-2" />
          </label>
          <label className="text-sm sm:col-span-2">
            Title
            <input name="title" required className="mt-1 w-full rounded border border-zinc-300 px-3 py-2" />
          </label>
          <label className="text-sm sm:col-span-2">
            Description
            <textarea name="description" required rows={2} className="mt-1 w-full rounded border border-zinc-300 px-3 py-2" />
          </label>
        </div>
        <button type="submit" className="rounded bg-zinc-900 px-3 py-2 text-sm text-white">
          Add
        </button>
      </form>

      <div className="space-y-4">
        {skills.map((skill) => (
          <form
            key={skill.id}
            action={updateSkill.bind(null, skill.id)}
            className="space-y-3 rounded border border-zinc-200 bg-white p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs text-zinc-500">#{skill.order}</p>
              <ReorderButtons
                up={moveSkill.bind(null, skill.id, "up")}
                down={moveSkill.bind(null, skill.id, "down")}
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-sm">
                Icon
                <input name="icon" defaultValue={skill.icon} className="mt-1 w-full rounded border border-zinc-300 px-3 py-2" />
              </label>
              <label className="text-sm">
                Order
                <input name="order" type="number" defaultValue={skill.order} className="mt-1 w-full rounded border border-zinc-300 px-3 py-2" />
              </label>
              <label className="text-sm sm:col-span-2">
                Title
                <input name="title" required defaultValue={skill.title} className="mt-1 w-full rounded border border-zinc-300 px-3 py-2" />
              </label>
              <label className="text-sm sm:col-span-2">
                Description
                <textarea name="description" required rows={2} defaultValue={skill.description} className="mt-1 w-full rounded border border-zinc-300 px-3 py-2" />
              </label>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="rounded bg-zinc-900 px-3 py-2 text-sm text-white">
                Save
              </button>
              <button formAction={deleteSkill.bind(null, skill.id)} className="rounded border border-red-300 px-3 py-2 text-sm text-red-700">
                Delete
              </button>
            </div>
          </form>
        ))}
      </div>
    </AdminShell>
  );
}
