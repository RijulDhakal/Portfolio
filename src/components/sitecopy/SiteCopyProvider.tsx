"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { SiteCopyDto, SiteCopyUpsertDto } from "@/lib/api";
import { resolveSiteCopy } from "@/lib/siteCopy";

const SiteCopyContextValue = createContext<SiteCopyUpsertDto | null>(null);

interface SiteCopyProviderProps {
  copy: SiteCopyDto | null;
  children: ReactNode;
}

export function SiteCopyProvider({ copy, children }: SiteCopyProviderProps) {
  const value = useMemo(() => resolveSiteCopy(copy), [copy]);
  return (
    <SiteCopyContextValue.Provider value={value}>
      {children}
    </SiteCopyContextValue.Provider>
  );
}

export function useSiteCopy(): SiteCopyUpsertDto {
  const context = useContext(SiteCopyContextValue);
  return context ?? resolveSiteCopy(null);
}
