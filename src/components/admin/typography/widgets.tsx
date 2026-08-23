"use client";

import type { TypographyElementOverrideDto } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Field, Input } from "../ui";
import { alignOptions, fontOptions, inheritedFontLabel, isOverrideEmpty, weightOptions } from "./shared";

export function Select({
  value,
  onChange,
  options,
  placeholder = "Inherit",
}: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full min-w-0 bg-surface border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-electric/60 transition-colors"
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function TriToggle({
  value,
  onChange,
}: {
  value: boolean | null;
  onChange: (v: boolean | null) => void;
}) {
  const options: { value: boolean | null; label: string }[] = [
    { value: null, label: "Default" },
    { value: true, label: "Uppercase" },
    { value: false, label: "None" },
  ];
  return (
    <div className="flex items-center gap-1.5 bg-background border border-border rounded-lg p-1 w-fit">
      {options.map((o) => (
        <button
          key={String(o.value)}
          type="button"
          onClick={() => onChange(o.value)}
          className={cn(
            "px-3 py-1.5 rounded-md text-xs font-bold transition-colors",
            value === o.value
              ? "bg-electric text-background"
              : "text-secondary hover:text-foreground"
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function KindBadge({ kind }: { kind: "heading" | "body" }) {
  return (
    <span
      className={cn(
        "text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border",
        kind === "heading"
          ? "border-electric/40 text-electric"
          : "border-border text-secondary"
      )}
    >
      {kind}
    </span>
  );
}

export function OverrideEditor({
  elementLabel,
  kind,
  sizeLocked,
  alignable,
  compact,
  value,
  onChange,
  onReset,
}: {
  elementLabel: string;
  kind: "heading" | "body";
  sizeLocked?: boolean;
  alignable?: boolean;
  compact?: boolean;
  value: TypographyElementOverrideDto;
  onChange: (v: TypographyElementOverrideDto) => void;
  onReset: () => void;
}) {
  const set = (patch: Partial<TypographyElementOverrideDto>) =>
    onChange({ ...value, ...patch });

  const overridden = !isOverrideEmpty(value);
  const inheritedFont = inheritedFontLabel(kind);

  return (
    <div className="border border-border rounded-xl p-4 flex flex-col gap-4 bg-background/40 min-w-0">
      {/* Card header: Aa icon, wrapping element name, kind + state badges, Reset */}
      <div className="flex flex-wrap items-center gap-2.5">
        <span
          className="shrink-0 h-[30px] w-[30px] rounded-full bg-electric/10 border border-electric/30 text-electric font-display font-bold text-xs flex items-center justify-center select-none"
          aria-hidden
        >
          Aa
        </span>
        <span className="font-bold text-sm text-foreground break-words min-w-0">
          {elementLabel}
        </span>
        <KindBadge kind={kind} />
        <div className="flex items-center gap-2 ml-auto shrink-0">
          <span
            className={cn(
              "text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border whitespace-nowrap",
              overridden
                ? "bg-electric/10 text-electric border-electric/30"
                : "bg-background text-secondary border-border"
            )}
          >
            {overridden ? "Overridden" : "Inherited"}
          </span>
          <button
            type="button"
            onClick={onReset}
            className="text-xs font-bold text-secondary hover:text-red-400 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Fields: 3 → 2 → 1 responsive columns; helpers sit below inputs in normal flow */}
      <div
        className={cn(
          "grid gap-x-4 gap-y-4 min-w-0",
          compact ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        )}
      >
        <div className="min-w-0">
          <Field label="Font">
            <Select
              value={value.fontFamily ?? ""}
              onChange={(v) => set({ fontFamily: v || null })}
              options={fontOptions}
            />
            {!value.fontFamily && (
              <p className="text-[11px] text-secondary mt-1">Inherited — {inheritedFont}</p>
            )}
          </Field>
        </div>

        <div className="min-w-0">
          <Field label="Weight">
            <Select
              value={value.fontWeight ?? ""}
              onChange={(v) => set({ fontWeight: v || null })}
              options={weightOptions}
            />
          </Field>
        </div>

        {alignable ? (
          <div className="min-w-0">
            <Field label="Align">
              <Select
                value={value.textAlign ?? ""}
                onChange={(v) => set({ textAlign: v || null })}
                options={alignOptions}
              />
            </Field>
          </div>
        ) : (
          <div className="min-w-0">
            <Field label="Uppercase">
              <TriToggle value={value.uppercase} onChange={(v) => set({ uppercase: v })} />
            </Field>
          </div>
        )}

        {!sizeLocked && (
          <div className="min-w-0">
            <Field label="Size" hint="e.g. 2rem, clamp(...)">
              <Input
                value={value.fontSize ?? ""}
                onChange={(e) => set({ fontSize: e.target.value || null })}
                placeholder="Inherit"
              />
            </Field>
          </div>
        )}

        <div className="min-w-0">
          <Field label="Spacing" hint="e.g. 0.05em">
            <Input
              value={value.letterSpacing ?? ""}
              onChange={(e) => set({ letterSpacing: e.target.value || null })}
              placeholder="Inherit"
            />
          </Field>
        </div>

        <div className="min-w-0">
          <Field label="Line height" hint="e.g. 1.15">
            <Input
              value={value.lineHeight ?? ""}
              onChange={(e) => set({ lineHeight: e.target.value || null })}
              placeholder="Inherit"
            />
          </Field>
        </div>
      </div>

      {alignable && (
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-xs font-bold tracking-widest text-secondary uppercase">
            Uppercase
          </span>
          <TriToggle value={value.uppercase} onChange={(v) => set({ uppercase: v })} />
        </div>
      )}
    </div>
  );
}
