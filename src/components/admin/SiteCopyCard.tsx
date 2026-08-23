"use client";

import { useEffect, useState } from "react";
import {
  adminContentApi,
  type NavLinkDto,
  type SiteCopyDto,
  type SiteCopyUpsertDto,
} from "@/lib/api";
import { ChipsEditor } from "./fields";
import type { SectionTypographyState } from "./useSectionTypography";
import { TypographyTarget } from "./typography/TypographyTarget";
import { TypographyTrigger } from "./typography/TypographyTrigger";
import { emptyOverride, isOverrideEmpty } from "./typography/shared";
import {
  Button,
  Card,
  ErrorBanner,
  Field,
  Input,
  Spinner,
  Textarea,
  btnDanger,
  btnSecondary,
} from "./ui";

export type SiteCopyFieldDef = {
  key: string;
  label: string;
  kind?: "text" | "textarea" | "chips" | "links";
  hint?: string;
  placeholder?: string;
  span?: 1 | 2;
};

function toUpsert(dto: SiteCopyDto): SiteCopyUpsertDto {
  const { id: _id, updatedAt: _updatedAt, ...rest } = dto;
  void _id;
  void _updatedAt;
  return rest;
}

async function mergeSectionIntoLatestServerCopy<K extends keyof SiteCopyUpsertDto>(
  section: K,
  sectionValue: SiteCopyUpsertDto[K]
): Promise<SiteCopyUpsertDto> {
  const fresh = await adminContentApi.getSiteCopy();
  return { ...toUpsert(fresh), [section]: sectionValue };
}

function LinksEditor({
  value,
  onChange,
}: {
  value: NavLinkDto[];
  onChange: (value: NavLinkDto[]) => void;
}) {
  const [label, setLabel] = useState("");
  const [href, setHref] = useState("");

  const add = () => {
    const l = label.trim();
    const h = href.trim();
    if (l && h) {
      onChange([...value, { label: l, href: h }]);
      setLabel("");
      setHref("");
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {value.map((link, i) => (
        <div key={i} className="flex items-center gap-2">
          <Input
            value={link.label}
            onChange={(e) =>
              onChange(value.map((l, j) => (j === i ? { ...l, label: e.target.value } : l)))
            }
            className="flex-1"
          />
          <Input
            value={link.href}
            onChange={(e) =>
              onChange(value.map((l, j) => (j === i ? { ...l, href: e.target.value } : l)))
            }
            className="flex-1"
          />
          <button
            type="button"
            onClick={() => onChange(value.filter((_, j) => j !== i))}
            className={btnDanger}
          >
            Remove
          </button>
        </div>
      ))}
      <div className="flex items-center gap-2">
        <Input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Label"
          className="flex-1"
        />
        <Input
          value={href}
          onChange={(e) => setHref(e.target.value)}
          placeholder="#about"
          className="flex-1"
        />
        <button type="button" onClick={add} className={btnSecondary}>
          Add
        </button>
      </div>
    </div>
  );
}

export function SiteCopyCard({
  title,
  hint,
  section,
  fields,
  typography,
  targets,
}: {
  title: string;
  hint?: string;
  section: keyof SiteCopyUpsertDto;
  fields: SiteCopyFieldDef[];
  typography?: SectionTypographyState;
  /** Maps content field keys to registry typography element keys (e.g. { heading: "intro.heading" }). */
  targets?: Record<string, string>;
}) {
  const [copy, setCopy] = useState<SiteCopyUpsertDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const reload = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const dto = await adminContentApi.getSiteCopy();
      setCopy(toUpsert(dto));
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Failed to load site copy.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const dto = await adminContentApi.getSiteCopy();
        if (!active) return;
        setCopy(toUpsert(dto));
      } catch (err) {
        if (!active) return;
        setLoadError(err instanceof Error ? err.message : "Failed to load site copy.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!typography || !targets) return;
    const sec = copy ? (copy[section] as unknown as Record<string, unknown>) : null;
    for (const f of fields) {
      const target = targets[f.key];
      if (!target || f.kind !== "chips") continue;
      const raw = sec?.[f.key];
      typography.setPreviewText(
        target,
        Array.isArray(raw) ? (raw as string[]).join(" · ") : ""
      );
    }
  }, [copy, typography, targets, fields, section]);

  const setValue = (key: string, value: string | string[] | NavLinkDto[]) => {
    setCopy((prev) => {
      if (!prev) return prev;
      const sec = prev[section] as unknown as Record<string, unknown>;
      return { ...prev, [section]: { ...sec, [key]: value } };
    });
  };

  const handleSave = async () => {
    if (!copy) return;
    setSaving(true);
    setSaveError(null);
    setSaved(false);
    try {
      const merged = await mergeSectionIntoLatestServerCopy(section, copy[section]);
      await adminContentApi.upsertSiteCopy(merged);
      setSaved(true);
      await reload();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading && !copy) return <Spinner label="Loading site copy" />;
  if (loadError && !copy) return <ErrorBanner message={loadError} />;

  const sectionObj = copy ? (copy[section] as unknown as Record<string, unknown>) : null;

  return (
    <Card>
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h3 className="font-bold text-lg">{title}</h3>
          {hint && <p className="text-xs text-secondary/70 mt-1">{hint}</p>}
        </div>
        <Button onClick={() => void handleSave()} disabled={saving || !copy}>
          {saving ? "Saving…" : "Save"}
        </Button>
      </div>
      {saveError && (
        <div className="mb-4">
          <ErrorBanner message={saveError} />
        </div>
      )}
      {saved && !saveError && (
        <div className="mb-4 w-full bg-electric/10 border border-electric/30 text-electric rounded-lg px-4 py-3 text-sm">
          {title} saved successfully.
        </div>
      )}
      <div className="grid md:grid-cols-2 gap-5">
        {fields.map((f) => {
          const raw = sectionObj?.[f.key];
          const target = typography && targets ? targets[f.key] : undefined;
          const isTextLike = f.kind !== "chips" && f.kind !== "links";
          if (isTextLike && typography && target) {
            return (
              <TypographyTarget
                key={f.key}
                typography={typography}
                elementKey={target}
                label={f.label}
                hint={f.hint}
                value={String(raw ?? "")}
                onChange={(v) => setValue(f.key, v)}
                kind={f.kind === "textarea" ? "textarea" : "text"}
                placeholder={f.placeholder}
                span={f.span}
              />
            );
          }
          const cls = f.span === 2 ? "md:col-span-2" : undefined;
          return (
            <div key={f.key} className={cls}>
              <Field label={f.label} hint={f.hint}>
                {f.kind === "textarea" ? (
                  <Textarea
                    value={String(raw ?? "")}
                    onChange={(e) => setValue(f.key, e.target.value)}
                    placeholder={f.placeholder}
                  />
                ) : f.kind === "chips" ? (
                  <Field
                    label={f.label}
                    hint={f.hint}
                    action={
                      target ? (
                        <TypographyTrigger
                          active={
                            typography?.inspectorOpen && typography.selectedKey === target
                          }
                          hasOverride={
                            !isOverrideEmpty(
                              typography?.overrides[target] ?? emptyOverride
                            )
                          }
                          onClick={() => typography?.handleSelect(target)}
                        />
                      ) : undefined
                    }
                  >
                    <ChipsEditor
                      values={Array.isArray(raw) ? (raw as string[]) : []}
                      onChange={(v) => setValue(f.key, v)}
                      placeholder={f.placeholder}
                    />
                  </Field>
                ) : f.kind === "links" ? (
                  <LinksEditor
                    value={Array.isArray(raw) ? (raw as NavLinkDto[]) : []}
                    onChange={(v) => setValue(f.key, v)}
                  />
                ) : (
                  <Input
                    value={String(raw ?? "")}
                    onChange={(e) => setValue(f.key, e.target.value)}
                    placeholder={f.placeholder}
                  />
                )}
              </Field>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
