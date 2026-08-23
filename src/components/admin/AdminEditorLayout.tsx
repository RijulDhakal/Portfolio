"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface AdminEditorLayoutProps {
  children: React.ReactNode;
  inspector?: React.ReactNode;
  inspectorOpen?: boolean;
  onCloseInspector?: () => void;
  className?: string;
}

export default function AdminEditorLayout({
  children,
  inspector,
  inspectorOpen = true,
  className,
}: AdminEditorLayoutProps) {
  return (
    <div
      className={cn(
        "relative w-full min-h-[calc(100vh-64px)] lg:min-h-screen grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] xl:grid-cols-[minmax(0,1fr)_420px] gap-6 items-start",
        !inspectorOpen && "lg:grid-cols-1 xl:grid-cols-1",
        className
      )}
    >
      {/* Center content editor */}
      <div className="min-w-0 flex-1 w-full flex flex-col gap-6">{children}</div>

      {/* Dedicated Right Typography Inspector Column (Desktop Grid Column) */}
      {inspector && inspectorOpen && (
        <aside className="w-full lg:sticky lg:top-6 lg:max-h-[calc(100vh-48px)] lg:overflow-y-auto shrink-0 z-10">
          {inspector}
        </aside>
      )}
    </div>
  );
}
