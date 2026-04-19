"use client";

import { useRouter } from "next/navigation";
import { DeleteDialog } from "@/components/admin/DeleteDialog";

interface DeletePostButtonProps {
  id: string;
  title: string;
}

export function DeletePostButton({ id, title }: DeletePostButtonProps) {
  const router = useRouter();

  async function handleDelete() {
    const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
  }

  return (
    <DeleteDialog
      title={`Delete "${title}"?`}
      description="This will permanently delete the post and all its data."
      onConfirm={handleDelete}
    />
  );
}
