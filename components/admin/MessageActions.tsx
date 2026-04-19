"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, EnvelopeOpen, Envelope, Trash } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { DeleteDialog } from "@/components/admin/DeleteDialog";

interface MessageActionsProps {
  id: string;
  read: boolean;
}

export function MessageActions({ id, read }: MessageActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function toggleRead() {
    setLoading(true);
    await fetch(`/api/contact/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: !read }),
    });
    router.refresh();
    setLoading(false);
  }

  async function handleDelete() {
    await fetch(`/api/contact/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon-xs"
        onClick={toggleRead}
        disabled={loading}
        title={read ? "Mark unread" : "Mark read"}
      >
        {read ? <Envelope /> : <EnvelopeOpen />}
      </Button>
      <DeleteDialog
        title="Delete message?"
        description="This will permanently delete this contact message."
        onConfirm={handleDelete}
      />
    </div>
  );
}
