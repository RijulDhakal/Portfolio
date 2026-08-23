"use client";

import Link from "next/link";

interface SectionHeaderProps {
  title: string;
  subtitle: string;
  previewHref: string;
  actions?: React.ReactNode;
  onSave?: () => void;
  saving?: boolean;
  saveLabel?: string;
}

export function SectionHeader({
  title,
  subtitle,
  previewHref,
  actions,
  onSave,
  saving,
  saveLabel,
}: SectionHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#27272A] pb-5">
      <div>
        <h1 className="font-display font-bold text-2xl uppercase tracking-tight text-white">
          {title}
        </h1>
        <p className="text-xs text-secondary mt-1">{subtitle}</p>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {actions}
        <Link
          href={previewHref}
          target="_blank"
          className="h-10 px-4 rounded-xl border border-[#27272A] bg-[#121214] hover:bg-white/5 text-xs font-bold text-foreground transition-all flex items-center gap-2"
        >
          <span>👁</span>
          <span>Preview</span>
        </Link>
        {onSave && (
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="h-10 px-5 rounded-xl bg-[#C8FF00] hover:bg-[#b8eb00] text-black font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(200,255,0,0.25)] flex items-center gap-2 disabled:opacity-50"
          >
            <span>💾</span>
            <span>{saving ? "Saving…" : saveLabel ?? "Save"}</span>
          </button>
        )}
      </div>
    </div>
  );
}
