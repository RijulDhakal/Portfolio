"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  adminTypographyApi,
  type TypographyElementOverrideDto,
  type TypographySettingDto,
} from "@/lib/api";
import { typographyGroups } from "@/lib/typography/registry";
import {
  cleanOverride,
  emptyGlobalDto,
  emptyOverride,
  isOverrideEmpty,
  overrideToForm,
} from "./typography/shared";

export function useSectionTypography(sectionKey?: string) {
  const [settings, setSettings] = useState<TypographySettingDto | null>(null);
  const [overrides, setOverrides] = useState<Record<string, TypographyElementOverrideDto>>({});
  const [selectedKey, setSelectedKey] = useState<string>("");
  const [inspectorOpen, setInspectorOpen] = useState<boolean>(true);
  const [loadingState, setLoadingState] = useState<boolean>(true);
  const [previewTexts, setPreviewTextsState] = useState<Record<string, string>>({});

  const group = useMemo(
    () => (sectionKey ? typographyGroups.find((g) => g.id === sectionKey) : null),
    [sectionKey]
  );
  const elements = useMemo(() => group?.elements ?? [], [group]);
  const loading = sectionKey ? loadingState : false;

  useEffect(() => {
    if (!sectionKey || elements.length === 0) return;
    let active = true;
    (async () => {
      setLoadingState(true);
      try {
        const s = await adminTypographyApi.get();
        if (!active) return;
        setSettings(s);
        const map: Record<string, TypographyElementOverrideDto> = {};
        for (const el of elements) {
          map[el.key] = s.overrides[el.key] ? overrideToForm(s.overrides[el.key]) : emptyOverride;
        }
        setOverrides(map);
        setSelectedKey((prev) => prev || elements[0].key);
      } catch {
        if (!active) return;
        setSettings(null);
      } finally {
        if (active) setLoadingState(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [sectionKey, elements]);

  const handleSelect = useCallback((key: string) => {
    setSelectedKey(key);
    setInspectorOpen(true);
  }, []);

  const handleChangeOverride = useCallback((key: string, value: TypographyElementOverrideDto) => {
    setOverrides((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleResetOverride = useCallback((key: string) => {
    setOverrides((prev) => ({ ...prev, [key]: { ...emptyOverride } }));
  }, []);

  const setPreviewText = useCallback((key: string, text: string) => {
    setPreviewTextsState((prev) => (prev[key] === text ? prev : { ...prev, [key]: text }));
  }, []);

  const hasOverrides = useMemo(
    () => elements.some((el) => !isOverrideEmpty(overrides[el.key] ?? emptyOverride)),
    [elements, overrides]
  );

  const saveOverrides = useCallback(async (): Promise<TypographySettingDto> => {
    const base = settings ?? {
      id: "",
      global: emptyGlobalDto(),
      overrides: {},
      updatedAt: "",
    };
    const merged = { ...base.overrides };
    for (const [key, value] of Object.entries(overrides)) {
      if (isOverrideEmpty(value)) delete merged[key];
      else merged[key] = cleanOverride(value);
    }
    const updated = await adminTypographyApi.upsert({ global: base.global, overrides: merged });
    setSettings(updated);
    return updated;
  }, [settings, overrides]);

  return {
    group,
    elements,
    settings,
    overrides,
    selectedKey,
    setSelectedKey,
    inspectorOpen,
    setInspectorOpen,
    loading,
    hasOverrides,
    previewTexts,
    setPreviewText,
    handleSelect,
    handleChangeOverride,
    handleResetOverride,
    saveOverrides,
  };
}

export type SectionTypographyState = ReturnType<typeof useSectionTypography>;
