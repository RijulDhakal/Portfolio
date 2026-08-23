"use client";

import { useEffect, useId } from "react";
import { cn } from "@/lib/utils";
import { Field, Input, Textarea } from "../ui";
import type { SectionTypographyState } from "../useSectionTypography";
import { emptyOverride, isOverrideEmpty } from "./shared";
import { TypographyTrigger } from "./TypographyTrigger";

interface TypographyTargetProps {
  typography: SectionTypographyState;
  /** Registry element key this field's typography is bound to (e.g. "intro.heading"). */
  elementKey: string;
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  kind?: "text" | "textarea";
  placeholder?: string;
  /** When 2, the field spans both columns of a two-column grid (must be a direct grid child). */
  span?: 1 | 2;
}

export function TypographyTarget({
  typography,
  elementKey,
  label,
  hint,
  value,
  onChange,
  kind = "text",
  placeholder,
  span = 1,
}: TypographyTargetProps) {
  const id = useId();
  const {
    handleSelect,
    selectedKey,
    inspectorOpen,
    overrides,
    setPreviewText,
  } = typography;

  const isSelected = inspectorOpen && selectedKey === elementKey;
  const hasOverride = !isOverrideEmpty(overrides[elementKey] ?? emptyOverride);

  useEffect(() => {
    setPreviewText(elementKey, value ?? "");
  }, [elementKey, value, setPreviewText]);

  const selectedCls = isSelected
    ? "border-electric/70 ring-1 ring-electric/20"
    : "hover:border-electric/40";

  const field =
    kind === "textarea" ? (
      <Textarea
        id={id}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => handleSelect(elementKey)}
        placeholder={placeholder}
        className={cn(selectedCls)}
      />
    ) : (
      <Input
        id={id}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => handleSelect(elementKey)}
        placeholder={placeholder}
        className={cn(selectedCls)}
      />
    );

  return (
    <div className={cn(span === 2 && "md:col-span-2")}>
      <Field
        label={label}
        hint={hint}
        action={
          <TypographyTrigger
            active={isSelected}
            hasOverride={hasOverride}
            onClick={() => handleSelect(elementKey)}
          />
        }
      >
        {field}
      </Field>
    </div>
  );
}
