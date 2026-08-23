"use client";

import { useEffect, useState } from "react";
import {
  adminTypographyApi,
  type TypographyElementOverrideDto,
  type TypographySettingUpsertDto,
} from "@/lib/api";
import { Button, ErrorBanner, PageHeader, Spinner, SuccessBanner } from "@/components/admin/ui";
import { GlobalDefaultsCard } from "@/components/admin/typography/GlobalDefaultsCard";
import { OtherTextCard } from "@/components/admin/typography/OtherTextCard";
import {
  cleanOverride,
  emptyGlobal,
  formToGlobal,
  globalToForm,
  isOverrideEmpty,
  overrideToForm,
  type GlobalForm,
} from "@/components/admin/typography/shared";

function toUpsert(
  global: GlobalForm,
  overrides: Record<string, TypographyElementOverrideDto>
): TypographySettingUpsertDto {
  const cleanOverrides: Record<string, TypographyElementOverrideDto> = {};
  for (const [key, o] of Object.entries(overrides)) {
    if (isOverrideEmpty(o)) continue;
    cleanOverrides[key] = cleanOverride(o);
  }
  return { global: formToGlobal(global), overrides: cleanOverrides };
}

export default function AdminTypographyPage() {
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [global, setGlobal] = useState<GlobalForm>(emptyGlobal);
  const [overrides, setOverrides] = useState<Record<string, TypographyElementOverrideDto>>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const settings = await adminTypographyApi.get();
        if (cancelled) return;
        setGlobal(globalToForm(settings.global));
        const map: Record<string, TypographyElementOverrideDto> = {};
        for (const [key, o] of Object.entries(settings.overrides)) {
          map[key] = overrideToForm(o);
        }
        setOverrides(map);
      } catch (err) {
        if (cancelled) return;
        setLoadError(err instanceof Error ? err.message : "Failed to load typography settings.");
        setGlobal(emptyGlobal);
        setOverrides({});
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    setSaved(false);
    try {
      await adminTypographyApi.upsert(toUpsert(global, overrides));
      setSaved(true);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const setGlobalField = <K extends keyof GlobalForm>(key: K, value: GlobalForm[K]) => {
    setGlobal((prev) => ({ ...prev, [key]: value }));
  };

  const setOverride = (key: string, value: TypographyElementOverrideDto) => {
    setOverrides((prev) => ({ ...prev, [key]: value }));
  };

  const resetOverride = (key: string) => {
    setOverrides((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  if (loading) return <Spinner label="Loading typography settings" />;
  if (loadError) return <ErrorBanner message={loadError} />;

  return (
    <div>
      <PageHeader
        title="Typography"
        subtitle="Global font defaults and per-element overrides. Changes apply instantly across the public site."
        actions={
          <Button onClick={() => void handleSave()} disabled={saving}>
            {saving ? "Saving…" : "Save typography"}
          </Button>
        }
      />

      {saveError && (
        <div className="mb-6">
          <ErrorBanner message={saveError} />
        </div>
      )}
      {saved && !saveError && (
        <div className="mb-6">
          <SuccessBanner message="Typography saved successfully." />
        </div>
      )}

      <div className="flex flex-col gap-8">
        <GlobalDefaultsCard value={global} onChange={setGlobalField} />
        <OtherTextCard
          overrides={overrides}
          onOverrideChange={setOverride}
          onResetOverride={resetOverride}
        />
      </div>

      <div className="mt-10 flex justify-end">
        <Button onClick={() => void handleSave()} disabled={saving}>
          {saving ? "Saving…" : "Save typography"}
        </Button>
      </div>
    </div>
  );
}
