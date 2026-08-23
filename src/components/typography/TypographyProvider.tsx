"use client";

import { createContext, useContext, useMemo, type CSSProperties, type ReactNode } from "react";
import type { TypographySettingDto } from "@/lib/api";
import { fonts } from "@/lib/typography/fonts";
import { createTypographyContext, type TypographyContext } from "@/lib/typography/resolve";

const TypographyContextValue = createContext<TypographyContext | null>(null);

interface TypographyProviderProps {
  settings: TypographySettingDto | null;
  children: ReactNode;
}

export function TypographyProvider({ settings, children }: TypographyProviderProps) {
  const value = useMemo(
    () => (settings ? createTypographyContext(settings) : null),
    [settings]
  );

  const variables = useMemo<CSSProperties>(() => {
    if (!settings) return {};
    const byKey = new Map<string, string>(fonts.map((f) => [f.key, f.variable]));
    const vars: Record<string, string> = {};
    if (settings.global.headingFont) {
      const font = byKey.get(settings.global.headingFont);
      if (font) vars["--font-display"] = font;
    }
    if (settings.global.bodyFont) {
      const font = byKey.get(settings.global.bodyFont);
      if (font) {
        vars["--font-sans"] = font;
        vars["fontFamily"] = font;
      }
    }
    return vars as CSSProperties;
  }, [settings]);

  if (!value) return <>{children}</>;

  return (
    <TypographyContextValue.Provider value={value}>
      <div className="contents" style={variables}>
        {children}
      </div>
    </TypographyContextValue.Provider>
  );
}

export function useTypography(): TypographyContext | null {
  return useContext(TypographyContextValue);
}

export function useTypographyResolver(): (key: string) => ReturnType<TypographyContext["resolve"]> {
  const context = useContext(TypographyContextValue);
  return useMemo(
    () => (key: string) => (context ? context.resolve(key) : {}),
    [context]
  );
}
