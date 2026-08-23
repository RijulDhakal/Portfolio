"use client";

import React, { useMemo } from "react";
import type { TypographyElementOverrideDto } from "@/lib/api";
import { getElementDef, typographyGroups, type TypographyElementDef } from "@/lib/typography/registry";
import { fonts } from "@/lib/typography/fonts";
import { cn } from "@/lib/utils";
import { emptyOverride, isOverrideEmpty } from "./shared";

interface TypographyInspectorProps {
  sectionKey: string;
  selectedElementKey: string;
  onSelectElement: (key: string) => void;
  overrides: Record<string, TypographyElementOverrideDto>;
  onChangeOverride: (key: string, override: TypographyElementOverrideDto) => void;
  onResetOverride: (key: string) => void;
  onClose?: () => void;
  /** Live text previews keyed by element key or field name */
  previewTexts?: Record<string, string>;
}

const fontOptions = [
  { value: "", label: "Inherit (Inter)" },
  ...fonts.map((f) => ({ value: f.key, label: f.label })),
];

const weightOptions = [
  { value: "", label: "Inherit (400)" },
  { value: "300", label: "Light (300)" },
  { value: "400", label: "Regular (400)" },
  { value: "500", label: "Medium (500)" },
  { value: "600", label: "Semibold (600)" },
  { value: "700", label: "Bold (700)" },
  { value: "800", label: "Extrabold (800)" },
  { value: "900", label: "Black (900)" },
];

const sizeOptions = [
  { value: "", label: "Inherit" },
  { value: "0.75rem", label: "XS (0.75rem)" },
  { value: "0.875rem", label: "Small (0.875rem)" },
  { value: "1rem", label: "Base (1rem)" },
  { value: "1.125rem", label: "Large (1.125rem)" },
  { value: "1.25rem", label: "XL (1.25rem)" },
  { value: "1.5rem", label: "2XL (1.5rem)" },
  { value: "1.875rem", label: "3XL (1.875rem)" },
  { value: "2.25rem", label: "4XL (2.25rem)" },
  { value: "3rem", label: "5XL (3rem)" },
];

const lineHeightOptions = [
  { value: "", label: "Inherit" },
  { value: "1", label: "Tight (1.0)" },
  { value: "1.15", label: "Snug (1.15)" },
  { value: "1.25", label: "Compact (1.25)" },
  { value: "1.4", label: "Medium (1.4)" },
  { value: "1.5", label: "Normal (1.5)" },
  { value: "1.75", label: "Relaxed (1.75)" },
];

const letterSpacingOptions = [
  { value: "", label: "Inherit" },
  { value: "-0.05em", label: "Tighter (-0.05em)" },
  { value: "-0.025em", label: "Tight (-0.025em)" },
  { value: "0", label: "Normal (0)" },
  { value: "0.05em", label: "Wide (0.05em)" },
  { value: "0.1em", label: "Wider (0.1em)" },
  { value: "0.2em", label: "Widest (0.2em)" },
];

const transformOptions = [
  { value: "", label: "Inherit" },
  { value: "none", label: "None" },
  { value: "uppercase", label: "Uppercase" },
  { value: "lowercase", label: "Lowercase" },
  { value: "capitalize", label: "Capitalize" },
];

const colorOptions = [
  { value: "", label: "● Inherit" },
  { value: "#C8FF00", label: "● Electric Lime" },
  { value: "#FFFFFF", label: "● White" },
  { value: "#9CA3AF", label: "● Muted Gray" },
  { value: "#3B82F6", label: "● Accent Blue" },
];

export function TypographyInspector({
  sectionKey,
  selectedElementKey,
  onSelectElement,
  overrides,
  onChangeOverride,
  onResetOverride,
  onClose,
  previewTexts = {},
}: TypographyInspectorProps) {
  const group = useMemo(() => typographyGroups.find((g) => g.id === sectionKey), [sectionKey]);
  const elements = useMemo(() => group?.elements ?? [], [group]);

  const currentDef: TypographyElementDef | null = useMemo(
    () => getElementDef(selectedElementKey) ?? elements[0] ?? null,
    [selectedElementKey, elements]
  );

  const activeKey = currentDef?.key ?? selectedElementKey;
  const currentOverride = overrides[activeKey] ?? emptyOverride;

  const setOverrideField = (patch: Partial<TypographyElementOverrideDto>) => {
    onChangeOverride(activeKey, { ...currentOverride, ...patch });
  };

  // Get preview text for the currently selected element
  const currentPreviewText = useMemo(() => {
    if (!currentDef) return "Preview text";
    if (previewTexts[activeKey]) return previewTexts[activeKey];
    
    // Fallbacks based on key suffix
    if (activeKey.endsWith(".greeting")) return previewTexts.greeting || "Hello I'm";
    if (activeKey.endsWith(".name")) return previewTexts.name || "Rijul Dhakal";
    if (activeKey.endsWith(".title")) return previewTexts.title || "UI/UX Designer & Developer";
    if (activeKey.endsWith(".description")) return previewTexts.description || "I'm a UI/UX Designer and Developer...";
    if (activeKey.endsWith(".primaryButton")) return previewTexts.primaryButtonText || "VIEW MY WORK";
    if (activeKey.endsWith(".secondaryButton")) return previewTexts.secondaryButtonText || "DOWNLOAD CV";
    if (activeKey.endsWith(".availability")) return previewTexts.availabilityText || "Available for freelance work";

    return currentDef.label;
  }, [currentDef, activeKey, previewTexts]);

  // Compute live CSS styles for the preview box
  const previewStyle = useMemo(() => {
    const style: React.CSSProperties = {};
    if (currentOverride.fontFamily) {
      const font = fonts.find((f) => f.key === currentOverride.fontFamily);
      if (font) style.fontFamily = font.variable;
    }
    if (currentOverride.fontWeight) style.fontWeight = currentOverride.fontWeight;
    if (currentOverride.fontSize) style.fontSize = currentOverride.fontSize;
    if (currentOverride.lineHeight) style.lineHeight = currentOverride.lineHeight;
    if (currentOverride.letterSpacing) style.letterSpacing = currentOverride.letterSpacing;

    if (currentOverride.uppercase !== null && currentOverride.uppercase !== undefined) {
      style.textTransform = currentOverride.uppercase ? "uppercase" : "none";
    }
    if (currentOverride.textAlign) {
      style.textAlign = currentOverride.textAlign as React.CSSProperties["textAlign"];
    }
    if (currentOverride.color) {
      style.color = currentOverride.color;
    } else {
      style.color = "#C8FF00"; // Signature default preview accent
    }

    return style;
  }, [currentOverride]);

  return (
    <div className="bg-[#121214] border border-[#27272A] rounded-2xl p-5 flex flex-col gap-4 text-foreground w-full shadow-2xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 border-b border-[#27272A] pb-3.5">
        <div>
          <h3 className="font-display text-sm font-bold tracking-wider uppercase text-white">
            TYPOGRAPHY
          </h3>
          <p className="text-xs text-secondary mt-0.5">
            Style each text element in the {group?.label.toLowerCase() ?? sectionKey} section.
          </p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-secondary hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors text-base leading-none"
            title="Close inspector"
          >
            ✕
          </button>
        )}
      </div>

      {/* Horizontal Pill Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {elements.map((el) => {
          const isActive = el.key === activeKey;
          const hasOverride = !isOverrideEmpty(overrides[el.key] ?? emptyOverride);
          // Shorten label for tabs
          let shortLabel = el.label
            .replace(" (letters)", "")
            .replace(" badge", "")
            .replace(" text", "")
            .replace(" button", "");
          if (el.key.endsWith(".primaryButton")) shortLabel = "Primary";
          if (el.key.endsWith(".secondaryButton")) shortLabel = "Secondary";
          if (el.key.includes("Button")) shortLabel = "Buttons";

          return (
            <button
              key={el.key}
              type="button"
              onClick={() => onSelectElement(el.key)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all select-none flex items-center gap-1.5 shrink-0",
                isActive
                  ? "bg-[#C8FF00] text-black font-bold shadow-[0_0_10px_rgba(200,255,0,0.3)]"
                  : "text-secondary hover:text-foreground hover:bg-white/5"
              )}
            >
              <span>{shortLabel}</span>
              {hasOverride && !isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#C8FF00]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Live Preview Box */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[11px] font-medium text-secondary">Preview</span>
        <div className="p-4 rounded-xl border border-[#27272A] bg-[#09090B] min-h-[64px] flex items-center justify-start overflow-hidden">
          <p
            style={previewStyle}
            className="text-base font-bold transition-all truncate w-full"
          >
            {currentPreviewText}
          </p>
        </div>
      </div>

      {/* Controls Grid */}
      <div className="flex flex-col gap-3.5 mt-1">
        {/* Font Family */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-secondary">Font Family</label>
          <select
            value={currentOverride.fontFamily ?? ""}
            onChange={(e) => setOverrideField({ fontFamily: e.target.value || null })}
            className="w-full bg-[#18181B] border border-[#27272A] rounded-lg px-3 py-2 text-xs text-foreground focus:border-[#C8FF00] outline-none transition-colors"
          >
            {fontOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Font Weight */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-secondary">Font Weight</label>
          <select
            value={currentOverride.fontWeight ?? ""}
            onChange={(e) => setOverrideField({ fontWeight: e.target.value || null })}
            className="w-full bg-[#18181B] border border-[#27272A] rounded-lg px-3 py-2 text-xs text-foreground focus:border-[#C8FF00] outline-none transition-colors"
          >
            {weightOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Size & Line Height */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-secondary">Font Size</label>
            <select
              value={currentOverride.fontSize ?? ""}
              onChange={(e) => setOverrideField({ fontSize: e.target.value || null })}
              className="w-full bg-[#18181B] border border-[#27272A] rounded-lg px-3 py-2 text-xs text-foreground focus:border-[#C8FF00] outline-none transition-colors"
            >
              {sizeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-secondary">Line Height</label>
            <select
              value={currentOverride.lineHeight ?? ""}
              onChange={(e) => setOverrideField({ lineHeight: e.target.value || null })}
              className="w-full bg-[#18181B] border border-[#27272A] rounded-lg px-3 py-2 text-xs text-foreground focus:border-[#C8FF00] outline-none transition-colors"
            >
              {lineHeightOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Spacing & Transform */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-secondary">Letter Spacing</label>
            <select
              value={currentOverride.letterSpacing ?? ""}
              onChange={(e) => setOverrideField({ letterSpacing: e.target.value || null })}
              className="w-full bg-[#18181B] border border-[#27272A] rounded-lg px-3 py-2 text-xs text-foreground focus:border-[#C8FF00] outline-none transition-colors"
            >
              {letterSpacingOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-secondary">Text Transform</label>
            <select
              value={
                currentOverride.uppercase === true
                  ? "uppercase"
                  : currentOverride.uppercase === false
                  ? "none"
                  : ""
              }
              onChange={(e) => {
                const val = e.target.value;
                setOverrideField({
                  uppercase: val === "uppercase" ? true : val === "none" ? false : null,
                });
              }}
              className="w-full bg-[#18181B] border border-[#27272A] rounded-lg px-3 py-2 text-xs text-foreground focus:border-[#C8FF00] outline-none transition-colors"
            >
              {transformOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Text Color */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-secondary">Text Color</label>
          <select
            value={currentOverride.color ?? ""}
            onChange={(e) => setOverrideField({ color: e.target.value || null })}
            className="w-full bg-[#18181B] border border-[#27272A] rounded-lg px-3 py-2 text-xs text-foreground focus:border-[#C8FF00] outline-none transition-colors"
          >
            {colorOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Text Align */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-secondary">Text Align</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "left", label: "Left", icon: "≡" },
              { id: "center", label: "Center", icon: "≂" },
              { id: "right", label: "Right", icon: "≡" },
            ].map((btn) => {
              const active = (currentOverride.textAlign || "left") === btn.id;
              return (
                <button
                  key={btn.id}
                  type="button"
                  onClick={() => setOverrideField({ textAlign: btn.id })}
                  className={cn(
                    "py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all",
                    active
                      ? "bg-[#C8FF00]/10 border-[#C8FF00] text-[#C8FF00]"
                      : "bg-[#18181B] border-[#27272A] text-secondary hover:text-foreground"
                  )}
                >
                  <span className="text-xs">{btn.icon}</span>
                  <span>{btn.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Reset Button */}
        <button
          type="button"
          onClick={() => onResetOverride(activeKey)}
          className="w-full mt-2 py-2.5 rounded-lg border border-[#27272A] bg-[#18181B] hover:bg-white/5 text-xs font-bold text-secondary hover:text-foreground transition-all flex items-center justify-center gap-2"
        >
          <span>↺</span>
          <span>Reset to inherit</span>
        </button>

        {/* Inherit Notice */}
        <div className="text-[11px] text-secondary/70 flex items-start gap-2 leading-relaxed mt-1 bg-white/[0.02] p-3 rounded-lg border border-white/5">
          <span className="text-xs">ⓘ</span>
          <span>
            Inherit means no override. The text will use the default typography from your theme.
          </span>
        </div>
      </div>
    </div>
  );
}
