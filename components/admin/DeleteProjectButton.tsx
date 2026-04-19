"use client";

import { useRouter } from "next/navigation";
import { DeleteDialog } from "@/components/admin/DeleteDialog";

interface DeleteProjectButtonProps {
  id: string;
  title: string;
}

export function DeleteProjectButton({ id, title }: DeleteProjectButtonProps) {
  const router = useRouter();

  async function handleDelete() {
    const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
  }

  return (
    <DeleteDialog
      title={`Delete "${title}"?`}
      description="This will permanently delete the project and all its data."
      onConfirm={handleDelete}
    />
  );
}
