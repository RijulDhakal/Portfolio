"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface TypographyTriggerProps {
  active?: boolean;
  hasOverride?: boolean;
  onClick: () => void;
  label?: string;
  className?: string;
  title?: string;
}

export function TypographyTrigger({
  active = false,
  hasOverride = false,
  onClick,
  label = "Aa",
  className,
  title = "Edit typography",
}: TypographyTriggerProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={cn(
        "h-10 px-3.5 rounded-lg border font-display text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 select-none",
        active
          ? "bg-electric/15 border-electric text-electric shadow-[0_0_12px_rgba(200,255,0,0.2)]"
          : "bg-surface border-border text-foreground hover:border-electric/50 hover:text-electric",
        className
      )}
    >
      <span>{label}</span>
      {hasOverride && (
        <span className="w-1.5 h-1.5 rounded-full bg-electric shrink-0" aria-hidden />
      )}
    </button>
  );
}
