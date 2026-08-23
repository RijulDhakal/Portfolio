"use client";

import { useRef, useState } from "react";
import {
  adminMediaApi,
  formatFileSize,
  resolveAssetUrl,
  type MediaItemDto,
} from "@/lib/api";
import { useApi } from "@/components/admin/useApi";
import {
  Button,
  Card,
  ConfirmButton,
  EmptyState,
  ErrorBanner,
  Input,
  PageHeader,
  Spinner,
} from "@/components/admin/ui";

function copyText(text: string) {
  if (navigator.clipboard?.writeText) {
    void navigator.clipboard.writeText(text);
  }
}

export default function AdminMediaPage() {
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [replacingId, setReplacingId] = useState<string | null>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const { data, loading, error, reload } = useApi(
    () => adminMediaApi.getAll({ search, pageSize: 60 }),
    [search]
  );
  const items = data?.items ?? [];

  const handleUpload = async (file: File) => {
    setUploading(true);
    setUploadError(null);
    try {
      await adminMediaApi.upload(file, undefined, "general");
      await reload();
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleReplace = async (id: string, file: File) => {
    setReplacingId(id);
    setUploadError(null);
    try {
      await adminMediaApi.replace(id, file);
      await reload();
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Replace failed.");
    } finally {
      setReplacingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await adminMediaApi.remove(id);
      await reload();
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Delete failed.");
    }
  };

  const handleCopy = (item: MediaItemDto) => {
    copyText(resolveAssetUrl(item.url) ?? item.url);
    setCopiedUrl(item.id);
    window.setTimeout(() => setCopiedUrl(null), 1500);
  };

  return (
    <div>
      <PageHeader
        title="Media"
        subtitle="Images and files uploaded to the CMS. Copy a URL to use it anywhere in your content."
        actions={
          <>
            <Input
              placeholder="Search media…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-56"
            />
            <input
              ref={uploadInputRef}
              type="file"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handleUpload(file);
                e.target.value = "";
              }}
            />
            <Button disabled={uploading} onClick={() => uploadInputRef.current?.click()}>
              {uploading ? "Uploading…" : "Upload"}
            </Button>
          </>
        }
      />

      {uploadError && <div className="mb-6"><ErrorBanner message={uploadError} /></div>}

      {loading ? (
        <Spinner label="Loading media" />
      ) : error ? (
        <ErrorBanner message={error} />
      ) : items.length === 0 ? (
        <EmptyState
          title={search ? "No media matches your search." : "No media yet."}
          hint="Upload images to use them across your content."
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map((item) => (
            <Card key={item.id} className="p-0 overflow-hidden flex flex-col">
              <div className="aspect-square bg-surface overflow-hidden">
                <img
                  src={resolveAssetUrl(item.url) ?? ""}
                  alt={item.altText ?? item.fileName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 flex flex-col gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-bold truncate" title={item.fileName}>
                    {item.fileName}
                  </p>
                  <p className="text-xs text-secondary">{formatFileSize(item.fileSize)}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleCopy(item)}
                    className="px-3 py-1.5 rounded-full bg-surface border border-border text-xs font-bold hover:border-electric/50 transition-colors"
                  >
                    {copiedUrl === item.id ? "Copied!" : "Copy URL"}
                  </button>
                  <input
                    ref={(el) => {
                      replaceInputRefs.current[item.id] = el;
                    }}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void handleReplace(item.id, file);
                      e.target.value = "";
                    }}
                  />
                  <button
                    onClick={() => replaceInputRefs.current[item.id]?.click()}
                    disabled={replacingId === item.id}
                    className="px-3 py-1.5 rounded-full bg-surface border border-border text-xs font-bold hover:border-electric/50 transition-colors disabled:opacity-50"
                  >
                    {replacingId === item.id ? "Replacing…" : "Replace"}
                  </button>
                  <ConfirmButton
                    onConfirm={() => void handleDelete(item.id)}
                    className="px-3 py-1.5 text-xs"
                  >
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
