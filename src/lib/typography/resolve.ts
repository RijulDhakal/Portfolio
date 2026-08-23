import type { TypographyElementOverrideDto, TypographyGlobalDto, TypographySettingDto } from "@/lib/api";
import { fonts } from "@/lib/typography/fonts";
import { getElementDef, type TypographyElementDef } from "@/lib/typography/registry";

export interface TypographyStyle {
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  letterSpacing?: string;
  lineHeight?: string;
  textTransform?: "uppercase" | "none";
  textAlign?: "left" | "center" | "right" | "justify" | "start" | "end";
  color?: string;
}

interface TypographyContext {
  settings: TypographySettingDto;
  resolve: (key: string) => TypographyStyle;
  isOverridden: (key: string, field?: keyof TypographyElementOverrideDto) => boolean;
  hasOverride: (key: string) => boolean;
}

function resolveFontFamily(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  const font = fonts.find((f) => f.key === value);
  return font?.variable;
}

function resolveFontWeight(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  return /^\d{1,4}$/.test(value) || /^(normal|bold|bolder|lighter)$/.test(value) ? value : undefined;
}

function resolveSize(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  return /^[\d.]+(px|rem|em|%|vh|vw|clamp\(.*\)|calc\(.*\))?$/.test(value) ? value : undefined;
}

function applyGlobal(
  style: TypographyStyle,
  global: TypographyGlobalDto,
  kind: TypographyElementDef["kind"],
  element: TypographyElementDef
): void {
  const font = kind === "heading" ? global.headingFont : global.bodyFont;
  if (font) style.fontFamily = resolveFontFamily(font);

  if (!element.sizeLocked) {
    const size = kind === "heading" ? global.headingSize : global.bodySize;
    if (size) style.fontSize = resolveSize(size);
  }

  const weight = kind === "heading" ? global.headingWeight : global.bodyWeight;
  if (weight) style.fontWeight = resolveFontWeight(weight);

  const spacing = kind === "heading" ? global.headingLetterSpacing : global.bodyLetterSpacing;
  if (spacing) style.letterSpacing = spacing;

  const lineHeight = kind === "heading" ? global.headingLineHeight : global.bodyLineHeight;
  if (lineHeight) style.lineHeight = lineHeight;

  if (kind === "heading" && global.headingUppercase !== null && global.headingUppercase !== undefined) {
    style.textTransform = global.headingUppercase ? "uppercase" : "none";
  }
}

function applyOverride(style: TypographyStyle, override: TypographyElementOverrideDto): void {
  if (override.fontFamily) style.fontFamily = resolveFontFamily(override.fontFamily);
  if (override.fontSize) style.fontSize = resolveSize(override.fontSize);
  if (override.fontWeight) style.fontWeight = resolveFontWeight(override.fontWeight);
  if (override.letterSpacing) style.letterSpacing = override.letterSpacing;
  if (override.lineHeight) style.lineHeight = override.lineHeight;
  if (override.uppercase !== null && override.uppercase !== undefined) {
    style.textTransform = override.uppercase ? "uppercase" : "none";
  }
  if (override.textAlign) {
    const align = ["left", "center", "right", "justify", "start", "end"].includes(override.textAlign)
      ? (override.textAlign as TypographyStyle["textAlign"])
      : undefined;
    if (align) style.textAlign = align;
  }
  if (override.color) style.color = override.color;
}

export function createTypographyContext(settings: TypographySettingDto): TypographyContext {
  return {
    settings,
    resolve(key: string): TypographyStyle {
      const element = getElementDef(key);
      if (!element) return {};

      const style: TypographyStyle = {};
      applyGlobal(style, settings.global, element.kind, element);

      const override = settings.overrides[key];
      if (override) applyOverride(style, override);

      return style;
    },
    isOverridden(key: string, field?: keyof TypographyElementOverrideDto): boolean {
      const override = settings.overrides[key];
      if (!override) return false;
      if (!field) return true;
      const value = override[field];
      if (field === "uppercase") return value !== null && value !== undefined;
      return typeof value === "string" && value.length > 0;
    },
    hasOverride(key: string): boolean {
      return settings.overrides[key] !== undefined;
    },
  };
}

export type { TypographyContext };
