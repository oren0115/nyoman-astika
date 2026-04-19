"use client";

import { useRouter } from "next/navigation";
import { DeleteDialog } from "@/components/admin/DeleteDialog";

export function DeleteExperienceButton({ id, title }: { id: string; title: string }) {
  const router = useRouter();
  async function handleDelete() {
    const res = await fetch(`/api/experience/${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
  }
  return (
    <DeleteDialog
      title={`Delete "${title}"?`}
      description="This will permanently remove this experience entry."
      onConfirm={handleDelete}
    />
  );
}
