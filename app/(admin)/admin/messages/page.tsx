import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageActions } from "@/components/admin/MessageActions";
import { getContactMessages } from "@/lib/services/contact.service";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export const metadata: Metadata = { title: "Messages — Admin" };

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default async function AdminMessagesPage({ searchParams }: Props) {
  const { page = "1" } = await searchParams;
  const currentPage = parseInt(page, 10);

  const { messages, total, totalPages } = await getContactMessages(currentPage).catch(() => ({
    messages: [],
    total: 0,
    totalPages: 1,
  }));

  const unread = messages.filter((m) => !m.read).length;

  return (
    <div>
      <AdminHeader
        title="Messages"
        description={`${total} total · ${unread} unread`}
      />

      <div className="p-6">
        {messages.length === 0 ? (
          <div className="rounded-none border border-dashed border-border py-20 text-center">
            <p className="text-sm text-muted-foreground">No messages yet.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {messages.map((msg) => (
              <Card
                key={msg.id}
                className={`p-4 transition-colors ${!msg.read ? "bg-primary/5 border-primary/20" : ""}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-foreground">{msg.name}</span>
                      <a
                        href={`mailto:${msg.email}`}
                        className="text-xs text-muted-foreground hover:text-primary transition-colors"
                      >
                        {msg.email}
                      </a>
                      {!msg.read && (
                        <Badge variant="default" className="text-xs px-1.5 py-0">New</Badge>
                      )}
                    </div>
                    {msg.subject && (
                      <p className="text-xs font-medium text-foreground mb-1">{msg.subject}</p>
                    )}
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                      {msg.message}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground/60">
                      {formatDate(msg.createdAt)}
                    </p>
                  </div>
                  <MessageActions id={msg.id} read={msg.read} />
                </div>
              </Card>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
            <span>Page {currentPage} of {totalPages}</span>
            <div className="flex gap-2">
              {currentPage > 1 && (
                <Button asChild variant="outline" size="xs">
                  <Link href={`?page=${currentPage - 1}`}>Previous</Link>
                </Button>
              )}
              {currentPage < totalPages && (
                <Button asChild variant="outline" size="xs">
                  <Link href={`?page=${currentPage + 1}`}>Next</Link>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
