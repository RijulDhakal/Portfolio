"use client";

import { useState } from "react";
import { useApi } from "./useApi";
import {
  Button,
  Card,
  ConfirmButton,
  EmptyState,
  ErrorBanner,
  Field,
  Input,
  PageHeader,
  Spinner,
  Textarea,
  Toggle,
  inputCls,
} from "./ui";
import { ChipsEditor, UrlField } from "./fields";
import AdminEditorLayout from "./AdminEditorLayout";
import { TypographyInspector } from "./typography/TypographyInspector";
import { TypographyTrigger } from "./typography/TypographyTrigger";
import { TypographyTarget } from "./typography/TypographyTarget";
import type { SectionTypographyState } from "./useSectionTypography";

export type FieldDef<U> =
  | {
      kind: "text";
      key: keyof U & string;
      label: string;
      placeholder?: string;
      typographyTarget?: string;
    }
  | {
      kind: "textarea";
      key: keyof U & string;
      label: string;
      placeholder?: string;
      typographyTarget?: string;
    }
  | { kind: "url"; key: keyof U & string; label: string; hint?: string }
  | { kind: "chips"; key: keyof U & string; label: string }
  | { kind: "toggle"; key: keyof U & string; label: string }
  | { kind: "select"; key: keyof U & string; label: string; options: string[] };

interface SimpleCrudProps<T, U extends object> {
  title: string;
  subtitle: string;
  fetchAll: () => Promise<T[]>;
  create: (dto: U) => Promise<unknown>;
  update: (id: string, dto: U) => Promise<unknown>;
  remove: (id: string) => Promise<unknown>;
  setActive?: (id: string, active: boolean) => Promise<unknown>;
  reorder?: (ids: string[]) => Promise<unknown>;
  initialForm: U;
  fields: FieldDef<U>[];
  titleOf: (item: T) => string;
  subtitleOf?: (item: T) => string;
  activeOf?: (item: T) => boolean;
  idOf: (item: T) => string;
  normalize?: (dto: U) => U;
  typography?: SectionTypographyState;
}

function FieldControl<U>({
  def,
  value,
  onChange,
}: {
  def: FieldDef<U>;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  const stringValue = typeof value === "string" ? value : "";

  if (def.kind === "text" || def.kind === "select") {
    if (def.kind === "select") {
      return (
        <select
          className={inputCls}
          value={stringValue}
          onChange={(e) => onChange(e.target.value)}
        >
          {def.options.map((option) => (
            <option key={option} value={option} className="bg-surface">
              {option}
            </option>
          ))}
        </select>
      );
    }
    return (
      <Input
        value={stringValue}
        onChange={(e) => onChange(e.target.value)}
        placeholder={def.placeholder}
      />
    );
  }

  if (def.kind === "textarea") {
    return (
      <Textarea
        value={stringValue}
        onChange={(e) => onChange(e.target.value)}
        placeholder={def.placeholder}
      />
    );
  }

  if (def.kind === "url") {
    return <UrlField label={def.label} hint={def.hint} value={stringValue} onChange={onChange} />;
  }

  if (def.kind === "chips") {
    const listValue = Array.isArray(value) ? (value as string[]) : [];
    return <ChipsEditor values={listValue} onChange={onChange} />;
  }

  if (def.kind === "toggle") {
    const boolValue = Boolean(value);
    return <Toggle checked={boolValue} onChange={onChange} label={def.label} />;
  }

  return null;
}

export default function SimpleCrud<T, U extends object>({
  title,
  subtitle,
  fetchAll,
  create,
  update,
  remove,
  setActive,
  reorder,
  initialForm,
  fields,
  titleOf,
  subtitleOf,
  activeOf,
  idOf,
  normalize,
  typography,
}: SimpleCrudProps<T, U>) {
  const { data: items, loading, error, reload } = useApi(fetchAll, []);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<U>(initialForm);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const startCreate = () => {
    setEditingId(null);
    setForm(initialForm);
    setSaveError(null);
    setSaved(false);
  };

  const startEdit = (item: T) => {
    setEditingId(idOf(item));
    const next = {} as U;
    const nextRec = next as unknown as Record<string, unknown>;
    const itemRec = item as unknown as Record<string, unknown>;
    for (const f of fields) {
      nextRec[f.key] = itemRec[f.key];
    }
    setForm(next);
    setSaveError(null);
    setSaved(false);
  };

  const setFieldValue = (key: keyof U, val: unknown) => {
    setForm((prev) => ({ ...prev, [key]: val }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    setSaved(false);
    try {
      let dto = structuredClone(form);
      if (normalize) dto = normalize(dto);
      if (editingId) {
        await update(editingId, dto);
      } else {
        await create(dto);
      }

      if (typography && typography.settings) {
        await typography.saveOverrides();
      }

      setSaved(true);
      await reload();
      startCreate();
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (id: string, active: boolean) => {
    if (!setActive) return;
    try {
      await setActive(id, active);
      await reload();
    } catch {
      await reload();
    }
  };

  const handleMove = async (index: number, direction: -1 | 1) => {
    if (!reorder || !items) return;
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    try {
      await reorder(next.map(idOf));
      await reload();
    } catch {
      await reload();
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await remove(id);
      if (editingId === id) startCreate();
      await reload();
    } catch {
      await reload();
    }
  };

  const handleSelectTypo = (key: string) => {
    typography?.handleSelect(key);
  };

  const content = (
    <div className="flex flex-col gap-6 w-full min-w-0">
      <PageHeader
        title={title}
        subtitle={subtitle}
        actions={
          <div className="flex items-center gap-3">
            {typography && typography.elements.length > 0 && (
              <TypographyTrigger
                active={typography.inspectorOpen}
                hasOverride={typography.hasOverrides}
                onClick={() => typography.setInspectorOpen((v) => !v)}
                label="Aa Typography"
              />
            )}
            <Button variant="secondary" onClick={startCreate}>
              New {title.replace(/s$/, "").toLowerCase()}
            </Button>
          </div>
        }
      />

      {error && <ErrorBanner message={error} />}
      {saveError && <ErrorBanner message={saveError} />}
      {saved && (
        <div className="w-full bg-[#C8FF00]/10 border border-[#C8FF00]/40 text-[#C8FF00] rounded-xl px-4 py-3 text-xs font-semibold">
          Saved successfully.
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6 items-start">
        {/* List Card */}
        <div className="flex flex-col gap-3">
          {loading ? (
            <Spinner label="Loading" />
          ) : items && items.length > 0 ? (
            items.map((item, index) => {
              const active = activeOf ? activeOf(item) : undefined;
              const isEditing = editingId === idOf(item);
              return (
                <Card
                  key={idOf(item)}
                  className={`p-4 flex items-center gap-4 ${
                    isEditing ? "border-[#C8FF00]/80 shadow-[0_0_12px_rgba(200,255,0,0.15)]" : ""
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <button
                      onClick={() => startEdit(item)}
                      className="text-left font-display font-bold text-base hover:text-[#C8FF00] transition-colors truncate block w-full"
                    >
                      {titleOf(item)}
                    </button>
                    {subtitleOf && (
                      <p className="text-xs text-secondary truncate">{subtitleOf(item)}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {active !== undefined && setActive && (
                      <Toggle checked={active} onChange={(v) => void handleToggle(idOf(item), v)} />
                    )}
                    {reorder && (
                      <div className="flex flex-col">
                        <button
                          onClick={() => void handleMove(index, -1)}
                          disabled={index === 0}
                          className="px-1.5 text-secondary hover:text-foreground disabled:opacity-30 text-xs"
                          aria-label="Move up"
                        >
                          ▲
                        </button>
                        <button
                          onClick={() => void handleMove(index, 1)}
                          disabled={index === items.length - 1}
                          className="px-1.5 text-secondary hover:text-foreground disabled:opacity-30 text-xs"
                          aria-label="Move down"
                        >
                          ▼
                        </button>
                      </div>
                    )}
                    <ConfirmButton
                      onConfirm={() => void handleDelete(idOf(item))}
                      className="px-2 py-1 text-xs"
                    >
                      Delete
                    </ConfirmButton>
                  </div>
                </Card>
              );
            })
          ) : (
            <EmptyState
              title={`No ${title.toLowerCase()} yet`}
              hint="Create your first entry using the form."
            />
          )}
        </div>

        {/* Form Card */}
        <Card className="p-5">
          <div className="flex items-center justify-between border-b border-[#27272A] pb-4 mb-4">
            <h3 className="font-display text-sm font-bold uppercase tracking-wider">
              {editingId ? `Edit ${title.replace(/s$/, "")}` : `New ${title.replace(/s$/, "")}`}
            </h3>
            {editingId && (
              <button
                onClick={startCreate}
                className="text-xs font-semibold text-secondary hover:text-foreground"
              >
                Cancel edit
              </button>
            )}
          </div>

          <div className="flex flex-col gap-4">
            {fields.map((def) => {
              const value = (form as Record<string, unknown>)[def.key];
              if (def.kind === "url") {
                return (
                  <FieldControl
                    key={def.key}
                    def={def}
                    value={value}
                    onChange={(v) => setFieldValue(def.key, v)}
                  />
                );
              }
              if (
                typography &&
                (def.kind === "text" || def.kind === "textarea") &&
                def.typographyTarget
              ) {
                return (
                  <TypographyTarget
                    key={def.key}
                    typography={typography}
                    elementKey={def.typographyTarget}
                    label={def.label}
                    value={String(value ?? "")}
                    onChange={(v) => setFieldValue(def.key, v)}
                    kind={def.kind}
                    placeholder={def.placeholder}
                  />
                );
              }
              return (
                <Field key={def.key} label={def.label}>
                  <FieldControl
                    def={def}
                    value={value}
                    onChange={(v) => setFieldValue(def.key, v)}
                  />
                </Field>
              );
            })}

            <div className="flex justify-end gap-3 pt-3 border-t border-[#27272A]">
              {editingId && (
                <Button variant="secondary" onClick={startCreate} disabled={saving}>
                  Cancel
                </Button>
              )}
              <Button onClick={() => void handleSave()} disabled={saving}>
                {saving ? "Saving…" : editingId ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  if (typography && typography.group) {
    return (
      <AdminEditorLayout
        inspectorOpen={typography.inspectorOpen}
        inspector={
          <TypographyInspector
            sectionKey={typography.group.id}
            selectedElementKey={typography.selectedKey}
            onSelectElement={handleSelectTypo}
            overrides={typography.overrides}
            onChangeOverride={typography.handleChangeOverride}
            onResetOverride={typography.handleResetOverride}
            onClose={() => typography.setInspectorOpen(false)}
            previewTexts={typography.previewTexts}
          />
        }
      >
        {content}
      </AdminEditorLayout>
    );
  }

  return content;
}
