"use client";

import { useEffect, useMemo, useState } from "react";
import {
  adminTypographyApi,
  type TypographyElementOverrideDto,
  type TypographySettingDto,
  type TypographySettingUpsertDto,
} from "@/lib/api";
import { getElementDef, typographyGroups, type TypographyElementDef } from "@/lib/typography/registry";
import { cn } from "@/lib/utils";
import { Button, ErrorBanner, Spinner } from "../ui";
import {
  cleanOverride,
  emptyGlobalDto,
  emptyOverride,
  isOverrideEmpty,
  overrideToForm,
} from "./shared";
import { OverrideEditor } from "./widgets";

function fallbackSettings(): TypographySettingDto {
  return { id: "", global: emptyGlobalDto(), overrides: {}, updatedAt: "" };
}

/**
 * UI-only visual grouping of the section's existing registry keys inside the modal.
 * Keys are NOT modified and no keys are added/removed — this only groups the
 * element cards under readable sub-headings. Sections not listed here render
 * as a single group. Any key missing from the plan is appended to "Other".
 */
const SUBSECTIONS: Record<string, { label: string; keys: string[] }[]> = {
  hero: [
    { label: "Hero", keys: ["hero.greeting", "hero.name", "hero.title", "hero.description"] },
    { label: "Buttons", keys: ["hero.primaryButton", "hero.secondaryButton"] },
    { label: "Optional", keys: ["hero.availability"] },
  ],
  about: [
    {
      label: "Section header",
      keys: ["about.number", "about.label", "about.title", "about.description"],
    },
    { label: "Stats", keys: ["about.statsValue", "about.statsLabel"] },
  ],
  skills: [
    {
      label: "Section header",
      keys: ["skills.number", "skills.centerLabel", "skills.label", "skills.title"],
    },
    { label: "Items", keys: ["skills.item"] },
  ],
  services: [
    { label: "Section header", keys: ["services.number", "services.label", "services.title"] },
    {
      label: "Cards",
      keys: ["services.card.title", "services.card.description", "services.card.feature"],
    },
  ],
  work: [
    { label: "Section header", keys: ["work.number", "work.label", "work.title"] },
    {
      label: "Cards",
      keys: [
        "work.card.title",
        "work.card.category",
        "work.card.description",
        "work.card.technologies",
        "work.card.link",
      ],
    },
  ],
  experience: [
    { label: "Section header", keys: ["experience.number", "experience.label", "experience.title"] },
    { label: "Entries", keys: ["experience.year", "experience.jobTitle", "experience.description"] },
  ],
  education: [
    { label: "Section header", keys: ["education.number", "education.label", "education.title"] },
    {
      label: "Entries",
      keys: [
        "education.institution",
        "education.degree",
        "education.field",
        "education.years",
        "education.description",
      ],
    },
  ],
};

function buildSections(
  sectionKey: string,
  elements: TypographyElementDef[]
): { label: string; elements: TypographyElementDef[] }[] {
  const byKey = new Map(elements.map((e) => [e.key, e]));
  const planned = SUBSECTIONS[sectionKey];
  if (!planned) return [{ label: sectionKey, elements }];

  const covered = new Set<string>();
  const sections = planned
    .map((s) => ({
      label: s.label,
      elements: s.keys
        .map((k) => byKey.get(k))
        .filter((e): e is TypographyElementDef => Boolean(e)),
    }))
    .filter((s) => s.elements.length > 0);
  for (const s of planned) for (const k of s.keys) covered.add(k);

  const leftover = elements.filter((e) => !covered.has(e.key));
  if (leftover.length > 0) sections.push({ label: "Other", elements: leftover });
  return sections;
}

export default function TypographyControl({
  sectionKey,
  elementKey,
  label = "Aa",
}: {
  sectionKey?: string;
  elementKey?: string;
  label?: string;
}) {
  const group = sectionKey ? typographyGroups.find((g) => g.id === sectionKey) : undefined;
  const elements: TypographyElementDef[] = useMemo(() => {
    if (elementKey) {
      const def = getElementDef(elementKey);
      return def ? [def] : [];
    }
    return group?.elements ?? [];
  }, [elementKey, group]);

  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<TypographySettingDto | null>(null);
  const [overrides, setOverrides] = useState<Record<string, TypographyElementOverrideDto>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sections = useMemo(
    () => (sectionKey && !elementKey ? buildSections(sectionKey, elements) : []),
    [sectionKey, elementKey, elements]
  );

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const s = await adminTypographyApi.get();
        if (!active) return;
        setSettings(s);
        const map: Record<string, TypographyElementOverrideDto> = {};
        for (const element of elements) {
          map[element.key] = s.overrides[element.key]
            ? overrideToForm(s.overrides[element.key])
            : emptyOverride;
        }
        setOverrides(map);
      } catch {
        if (!active) return;
        setSettings(null);
        setOverrides(Object.fromEntries(elements.map((e) => [e.key, { ...emptyOverride }])));
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [elements]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  const hasOverrides = elements.some((e) => !isOverrideEmpty(overrides[e.key] ?? emptyOverride));

  const applyChanges = (next: Record<string, TypographyElementOverrideDto>) => {
    const base = settings ?? fallbackSettings();
    const merged = { ...base.overrides };
    for (const element of elements) {
      delete merged[element.key];
    }
    for (const [key, value] of Object.entries(next)) {
      if (isOverrideEmpty(value)) continue;
      merged[key] = cleanOverride(value);
    }
    const dto: TypographySettingUpsertDto = { global: base.global, overrides: merged };
    return adminTypographyApi.upsert(dto);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const updated = await applyChanges(overrides);
      setSettings(updated);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const updated = await applyChanges({});
      setSettings(updated);
      setOverrides(Object.fromEntries(elements.map((e) => [e.key, { ...emptyOverride }])));
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const setOverride = (key: string, value: TypographyElementOverrideDto) => {
    setOverrides((prev) => ({ ...prev, [key]: value }));
  };

  if (elements.length === 0) return null;

  const title = elementKey ? elements[0].label : (group?.label ?? sectionKey);
  const subtitle = elementKey
    ? "Override typography for this element."
    : `Override typography for the ${group?.label ?? sectionKey} section.`;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="h-10 px-3.5 rounded-full bg-surface border border-border font-display text-sm font-bold hover:border-electric/50 transition-colors flex items-center gap-2"
        title={`Typography: ${title}`}
      >
        {label}
        {hasOverrides && (
          <span className="w-1.5 h-1.5 rounded-full bg-electric shrink-0" aria-hidden />
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className={cn(
              "relative w-full flex flex-col overflow-hidden bg-surface border border-border rounded-2xl shadow-2xl",
              "max-h-[calc(100vh-64px)]",
              elementKey ? "max-w-[480px]" : "max-w-[1060px]"
            )}
          >
            {/* Fixed header */}
            <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-border shrink-0">
              <div className="flex items-start gap-3 min-w-0">
                <span
                  className="shrink-0 h-8 w-8 rounded-full bg-electric/10 border border-electric/30 text-electric font-display font-bold text-sm flex items-center justify-center select-none mt-0.5"
                  aria-hidden
                >
                  Aa
                </span>
                <div className="min-w-0">
                  <p className="font-display font-bold text-xl uppercase tracking-tight leading-tight break-words">
                    {title}
                  </p>
                  <p className="text-xs text-secondary mt-1">{subtitle}</p>
                  <p className="text-[11px] text-secondary/80 mt-1">
                    Inherited = keeps the original design. Blank fields are never applied.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="shrink-0 h-8 w-8 rounded-lg border border-border text-secondary hover:text-foreground hover:border-electric/50 transition-colors flex items-center justify-center"
                aria-label="Close typography editor"
              >
                ✕
              </button>
            </div>

            {/* Scrollable content */}
            {loading ? (
              <div className="flex-1 min-h-0 flex items-center justify-center py-20">
                <Spinner label="Loading typography" />
              </div>
            ) : (
              <div className="flex-1 min-h-0 overflow-y-auto px-6 py-6">
                {elementKey ? (
                  <OverrideEditor
                    elementLabel={elements[0].label}
                    kind={elements[0].kind}
                    sizeLocked={elements[0].sizeLocked}
                    alignable={elements[0].alignable}
                    compact
                    value={overrides[elements[0].key] ?? emptyOverride}
                    onChange={(v) => setOverride(elements[0].key, v)}
                    onReset={() => setOverride(elements[0].key, { ...emptyOverride })}
                  />
                ) : (
                  <div className="flex flex-col gap-8">
                    {sections.map((sec) => (
                      <section key={sec.label}>
                        <div className="flex items-center gap-3 mb-4">
                          <h3 className="font-display font-bold text-xs uppercase tracking-[0.2em] text-secondary shrink-0">
                            {sec.label}
                          </h3>
                          <div className="h-px bg-border flex-1" aria-hidden />
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          {sec.elements.map((element) => (
                            <OverrideEditor
                              key={element.key}
                              elementLabel={element.label}
                              kind={element.kind}
                              sizeLocked={element.sizeLocked}
                              alignable={element.alignable}
                              value={overrides[element.key] ?? emptyOverride}
                              onChange={(v) => setOverride(element.key, v)}
                              onReset={() => setOverride(element.key, { ...emptyOverride })}
                            />
                          ))}
                        </div>
                      </section>
                    ))}
                  </div>
                )}
                {error && (
                  <div className="mt-5">
                    <ErrorBanner message={error} />
                  </div>
                )}
              </div>
            )}

            {/* Sticky footer */}
            <div className="px-6 py-4 border-t border-border shrink-0 bg-surface">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => void handleReset()}
                  disabled={saving || loading}
                  className="text-xs font-bold text-secondary hover:text-red-400 transition-colors disabled:opacity-50"
                >
                  Reset {elementKey ? "element" : "section"}
                </button>
                <div className="flex items-center gap-3">
                  {saved && !error && (
                    <span className="text-xs font-bold text-electric">Saved</span>
                  )}
                  <Button variant="secondary" onClick={() => setOpen(false)} disabled={saving}>
                    Cancel
                  </Button>
                  <Button onClick={() => void handleSave()} disabled={saving || loading}>
                    {saving ? "Saving…" : "Save typography"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
