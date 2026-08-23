"use client";

import { useState } from "react";
import { adminMessagesApi, type ContactMessageDto } from "@/lib/api";
import { useApi } from "@/components/admin/useApi";
import {
  Card,
  ConfirmButton,
  EmptyState,
  ErrorBanner,
  PageHeader,
  Spinner,
  Toggle,
  btnSecondary,
} from "@/components/admin/ui";

export default function AdminMessagesPage() {
  const [unreadOnly, setUnreadOnly] = useState(false);
  const { data, loading, error, reload } = useApi(
    () => adminMessagesApi.getAll({ unreadOnly: unreadOnly || undefined, pageSize: 100 }),
    [unreadOnly]
  );
  const items = data?.items ?? [];

  const handleToggleRead = async (message: ContactMessageDto) => {
    try {
      await adminMessagesApi.markRead(message.id, !message.isRead);
      await reload();
    } catch {
      await reload();
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await adminMessagesApi.remove(id);
      await reload();
    } catch {
      await reload();
    }
  };

  return (
    <div>
      <PageHeader
        title="Messages"
        subtitle="Messages submitted through the public contact form."
        actions={<Toggle checked={unreadOnly} onChange={setUnreadOnly} label="Unread only" />}
      />

      {error && <div className="mb-6"><ErrorBanner message={error} /></div>}

      {loading ? (
        <Spinner label="Loading messages" />
      ) : items.length === 0 ? (
        <EmptyState
          title={unreadOnly ? "No unread messages." : "No messages yet."}
          hint="Messages from the contact form will appear here."
        />
      ) : (
        <div className="flex flex-col gap-4">
          {items.map((message) => (
            <Card key={message.id} className={`p-5 ${!message.isRead ? "border-electric/40" : ""}`}>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-bold text-lg truncate">{message.name}</p>
                    <a
                      href={`mailto:${message.email}`}
                      className="text-sm text-electric hover:underline"
                    >
                      {message.email}
                    </a>
                  </div>
                  <span className="text-xs text-secondary">
                    {new Date(message.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                  {message.message}
                </p>
                <div className="flex items-center gap-3">
                  <button onClick={() => void handleToggleRead(message)} className={btnSecondary}>
                    {message.isRead ? "Mark as unread" : "Mark as read"}
                  </button>
                  <ConfirmButton onConfirm={() => void handleDelete(message.id)} className="px-3 py-1.5 text-xs">
                    Delete
                  </ConfirmButton>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
