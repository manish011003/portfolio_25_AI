"use client";

import { deleteCaseStudy } from "@/app/actions/case-studies";

export function DeleteCaseStudyButton({ id }: { id: string }) {
  return (
    <button
      type="button"
      className="rounded border border-red-200 px-3 py-2 text-sm text-red-700"
      onClick={() => {
        if (window.confirm("Delete this case study and its uploaded images?")) {
          void deleteCaseStudy(id);
        }
      }}
    >
      Delete
    </button>
  );
}
