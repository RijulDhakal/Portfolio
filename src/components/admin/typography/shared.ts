import type { TypographyElementOverrideDto, TypographyGlobalDto } from "@/lib/api";
import { fonts } from "@/lib/typography/fonts";
import { typographyGroups } from "@/lib/typography/registry";

export const sectionGroupIds: string[] = [
  "hero",
  "about",
  "skills",
  "services",
  "experience",
  "education",
  "work",
];

export const otherGroups = typographyGroups.filter((g) => !sectionGroupIds.includes(g.id));

export const fontOptions = fonts.map((f) => ({ value: f.key, label: f.label }));

export const weightOptions = [
  { value: "300", label: "Light (300)" },
  { value: "400", label: "Regular (400)" },
  { value: "500", label: "Medium (500)" },
  { value: "600", label: "Semibold (600)" },
  { value: "700", label: "Bold (700)" },
  { value: "800", label: "Extrabold (800)" },
  { value: "900", label: "Black (900)" },
];

export const alignOptions = [
  { value: "left", label: "Left" },
  { value: "center", label: "Center" },
  { value: "right", label: "Right" },
  { value: "justify", label: "Justify" },
];

export type GlobalForm = {
  headingFont: string;
  bodyFont: string;
  headingSize: string;
  bodySize: string;
  headingWeight: string;
  bodyWeight: string;
  headingLetterSpacing: string;
  bodyLetterSpacing: string;
  headingLineHeight: string;
  bodyLineHeight: string;
  headingUppercase: boolean | null;
};

export const emptyGlobal: GlobalForm = {
  headingFont: "space-grotesk",
  bodyFont: "inter",
  headingSize: "",
  bodySize: "",
  headingWeight: "",
  bodyWeight: "",
  headingLetterSpacing: "",
  bodyLetterSpacing: "",
  headingLineHeight: "",
  bodyLineHeight: "",
  headingUppercase: null,
};

export function emptyGlobalDto(): TypographyGlobalDto {
  return {
    headingFont: null,
    bodyFont: null,
    headingSize: null,
    bodySize: null,
    headingWeight: null,
    bodyWeight: null,
    headingLetterSpacing: null,
    bodyLetterSpacing: null,
    headingLineHeight: null,
    bodyLineHeight: null,
    headingUppercase: null,
  };
}

export function globalToForm(g: TypographyGlobalDto): GlobalForm {
  return {
    headingFont: g.headingFont ?? "",
    bodyFont: g.bodyFont ?? "",
    headingSize: g.headingSize ?? "",
    bodySize: g.bodySize ?? "",
    headingWeight: g.headingWeight ?? "",
    bodyWeight: g.bodyWeight ?? "",
    headingLetterSpacing: g.headingLetterSpacing ?? "",
    bodyLetterSpacing: g.bodyLetterSpacing ?? "",
    headingLineHeight: g.headingLineHeight ?? "",
    bodyLineHeight: g.bodyLineHeight ?? "",
    headingUppercase: g.headingUppercase ?? null,
  };
}

export function formToGlobal(f: GlobalForm): TypographyGlobalDto {
  const g: Partial<TypographyGlobalDto> = {};
  if (f.headingFont) g.headingFont = f.headingFont;
  if (f.bodyFont) g.bodyFont = f.bodyFont;
  if (f.headingSize.trim()) g.headingSize = f.headingSize.trim();
  if (f.bodySize.trim()) g.bodySize = f.bodySize.trim();
  if (f.headingWeight) g.headingWeight = f.headingWeight;
  if (f.bodyWeight) g.bodyWeight = f.bodyWeight;
  if (f.headingLetterSpacing.trim()) g.headingLetterSpacing = f.headingLetterSpacing.trim();
  if (f.bodyLetterSpacing.trim()) g.bodyLetterSpacing = f.bodyLetterSpacing.trim();
  if (f.headingLineHeight.trim()) g.headingLineHeight = f.headingLineHeight.trim();
  if (f.bodyLineHeight.trim()) g.bodyLineHeight = f.bodyLineHeight.trim();
  if (f.headingUppercase !== null && f.headingUppercase !== undefined) g.headingUppercase = f.headingUppercase;
  return g as TypographyGlobalDto;
}

export const emptyOverride: TypographyElementOverrideDto = {
  fontFamily: null,
  fontSize: null,
  fontWeight: null,
  letterSpacing: null,
  lineHeight: null,
  uppercase: null,
  textAlign: null,
  color: null,
};

export function overrideToForm(o: TypographyElementOverrideDto): TypographyElementOverrideDto {
  return {
    fontFamily: o.fontFamily ?? null,
    fontSize: o.fontSize ?? null,
    fontWeight: o.fontWeight ?? null,
    letterSpacing: o.letterSpacing ?? null,
    lineHeight: o.lineHeight ?? null,
    uppercase: o.uppercase ?? null,
    textAlign: o.textAlign ?? null,
    color: o.color ?? null,
  };
}

export function isOverrideEmpty(o: TypographyElementOverrideDto): boolean {
  return (
    !o.fontFamily &&
    !o.fontSize &&
    !o.fontWeight &&
    !o.letterSpacing &&
    !o.lineHeight &&
    o.uppercase === null &&
    !o.textAlign &&
    !o.color
  );
}

export function cleanOverride(o: TypographyElementOverrideDto): TypographyElementOverrideDto {
  const c: Partial<TypographyElementOverrideDto> = {};
  if (o.fontFamily) c.fontFamily = o.fontFamily;
  if (o.fontSize?.trim()) c.fontSize = o.fontSize.trim();
  if (o.fontWeight) c.fontWeight = o.fontWeight;
  if (o.letterSpacing?.trim()) c.letterSpacing = o.letterSpacing.trim();
  if (o.lineHeight?.trim()) c.lineHeight = o.lineHeight.trim();
  if (o.uppercase !== null && o.uppercase !== undefined) c.uppercase = o.uppercase;
  if (o.textAlign) c.textAlign = o.textAlign;
  if (o.color) c.color = o.color;
  return c as TypographyElementOverrideDto;
}

/** Design-default font (from globals.css @theme) shown when a field inherits. */
export function inheritedFontLabel(kind: "heading" | "body"): string {
  return kind === "heading" ? "Space Grotesk" : "Inter";
}

export function fontLabelFromVariable(variable: string | undefined | null): string | null {
  if (!variable) return null;
  const font = fonts.find((f) => f.variable === variable);
  return font?.label ?? null;
}
