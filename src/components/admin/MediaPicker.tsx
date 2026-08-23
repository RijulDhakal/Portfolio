"use client";

import { useRef, useState } from "react";
import { adminMediaApi, resolveAssetUrl } from "@/lib/api";
import { useApi } from "./useApi";
import { Button, ErrorBanner, Input, Spinner } from "./ui";

export default function MediaPicker({
  onSelect,
  onClose,
  title = "Select media",
}: {
  onSelect: (url: string) => void;
  onClose: () => void;
  title?: string;
}) {
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data, loading, error, reload } = useApi(
    () => adminMediaApi.getAll({ search, pageSize: 60 }),
    [search]
  );

  const items = data?.items ?? [];

  const handleUpload = async (file: File) => {
    setUploading(true);
    setUploadError(null);
    try {
      const result = await adminMediaApi.upload(file, undefined, "general");
      if (result) await reload();
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />
      <div className="relative w-full max-w-3xl bg-background border border-border rounded-2xl flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="font-display font-bold uppercase tracking-tight">{title}</h3>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-full bg-surface border border-border text-xs font-bold"
          >
            Close
          </button>
        </div>

        <div className="px-6 py-4 flex flex-col md:flex-row gap-3 border-b border-border">
          <div className="flex-1">
            <Input
              placeholder="Search media…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleUpload(file);
              e.target.value = "";
            }}
          />
          <Button
            variant="secondary"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {uploading ? "Uploading…" : "Upload new"}
          </Button>
        </div>

        {uploadError && (
          <div className="px-6 pt-4">
            <ErrorBanner message={uploadError} />
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <Spinner label="Loading media" />
          ) : error ? (
            <ErrorBanner message={error} />
          ) : items.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onSelect(item.url)}
                  className="group relative aspect-square rounded-xl overflow-hidden bg-surface border border-border hover:border-electric/60 transition-colors"
                  title={item.fileName}
                >
                  <img
                    src={resolveAssetUrl(item.url) ?? item.url}
                    alt={item.altText ?? item.fileName}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute inset-x-0 bottom-0 bg-black/70 text-[10px] px-2 py-1.5 truncate text-left text-secondary group-hover:text-foreground transition-colors">
                    {item.fileName}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-secondary py-16 text-center">
              {search ? "No media matches your search." : "No media yet. Upload your first image."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
