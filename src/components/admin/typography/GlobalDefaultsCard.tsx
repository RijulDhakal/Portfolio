"use client";

import { Card, Field, Input } from "../ui";
import { fontOptions, weightOptions, type GlobalForm } from "./shared";
import { Select, TriToggle } from "./widgets";

export function GlobalDefaultsCard({
  value,
  onChange,
}: {
  value: GlobalForm;
  onChange: <K extends keyof GlobalForm>(key: K, value: GlobalForm[K]) => void;
}) {
  return (
    <Card>
      <div className="mb-6">
        <h2 className="font-display font-bold text-xl uppercase tracking-tight">
          Global defaults
        </h2>
        <p className="text-sm text-secondary mt-1">
          Applied to every element of that kind unless overridden below.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <Field label="Heading font">
          <Select
            value={value.headingFont}
            onChange={(v) => onChange("headingFont", v)}
            options={fontOptions}
            placeholder="Choose a font"
          />
        </Field>
        <Field label="Body font">
          <Select
            value={value.bodyFont}
            onChange={(v) => onChange("bodyFont", v)}
            options={fontOptions}
            placeholder="Choose a font"
          />
        </Field>

        <Field label="Heading size" hint="Leave blank to keep the component's design size.">
          <Input
            value={value.headingSize}
            onChange={(e) => onChange("headingSize", e.target.value)}
            placeholder="e.g. clamp(2rem, 5vw, 4rem)"
          />
        </Field>
        <Field label="Body size" hint="Leave blank to keep the component's design size.">
          <Input
            value={value.bodySize}
            onChange={(e) => onChange("bodySize", e.target.value)}
            placeholder="e.g. 1.125rem"
          />
        </Field>

        <Field label="Heading weight">
          <Select
            value={value.headingWeight}
            onChange={(v) => onChange("headingWeight", v)}
            options={weightOptions}
          />
        </Field>
        <Field label="Body weight">
          <Select
            value={value.bodyWeight}
            onChange={(v) => onChange("bodyWeight", v)}
            options={weightOptions}
          />
        </Field>

        <Field label="Heading letter spacing" hint="e.g. -0.02em">
          <Input
            value={value.headingLetterSpacing}
            onChange={(e) => onChange("headingLetterSpacing", e.target.value)}
            placeholder="Inherit"
          />
        </Field>
        <Field label="Body letter spacing" hint="e.g. 0.01em">
          <Input
            value={value.bodyLetterSpacing}
            onChange={(e) => onChange("bodyLetterSpacing", e.target.value)}
            placeholder="Inherit"
          />
        </Field>

        <Field label="Heading line height" hint="e.g. 1.1">
          <Input
            value={value.headingLineHeight}
            onChange={(e) => onChange("headingLineHeight", e.target.value)}
            placeholder="Inherit"
          />
        </Field>
        <Field label="Body line height" hint="e.g. 1.6">
          <Input
            value={value.bodyLineHeight}
            onChange={(e) => onChange("bodyLineHeight", e.target.value)}
            placeholder="Inherit"
          />
        </Field>

        <div className="md:col-span-2 flex items-center gap-4">
          <span className="text-xs font-bold tracking-widest text-secondary uppercase">
            Heading casing
          </span>
          <TriToggle value={value.headingUppercase} onChange={(v) => onChange("headingUppercase", v)} />
        </div>
      </div>
    </Card>
  );
}
