"use client";

import { useState } from "react";
import { SiteCopyCard, type SiteCopyFieldDef } from "@/components/admin/SiteCopyCard";
import { SectionHeader } from "@/components/admin/SectionHeader";
import AdminEditorLayout from "@/components/admin/AdminEditorLayout";
import { TypographyInspector } from "@/components/admin/typography/TypographyInspector";
import { ErrorBanner, Spinner } from "@/components/admin/ui";
import { useSectionTypography } from "@/components/admin/useSectionTypography";

const fields: SiteCopyFieldDef[] = [
  { key: "label", label: "Section label", placeholder: "Beyond the Screen." },
  { key: "marqueeSeparator", label: "Marquee separator", placeholder: "✦" },
  { key: "marqueeWords", label: "Marquee words", kind: "chips", span: 2 },
  { key: "body", label: "Body", kind: "textarea", span: 2 },
];

const targets: Record<string, string> = {
  label: "personal.label",
  marqueeWords: "personal.heading",
  body: "personal.body",
};

const previewTexts: Record<string, string> = {
  "personal.label": "Beyond the Screen.",
  "personal.heading": "Beyond the Screen.",
  "personal.body": "Personal statement...",
};

export default function AdminPersonalPage() {
  const typography = useSectionTypography("personal");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      await typography.saveOverrides();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <SectionHeader
        title="Personal"
        subtitle="The scrolling marquee and personal statement. Use {highlight}…{/highlight} in the body to underline part of the text."
        previewHref="/"
        onSave={handleSave}
        saving={saving}
        saveLabel="Save typography"
      />

      {saveError && <ErrorBanner message={saveError} />}

      {typography.loading ? (
        <Spinner label="Loading typography" />
      ) : (
        <AdminEditorLayout
          inspectorOpen={typography.inspectorOpen}
          inspector={
            <TypographyInspector
              sectionKey="personal"
              selectedElementKey={typography.selectedKey}
              onSelectElement={typography.handleSelect}
              overrides={typography.overrides}
              onChangeOverride={typography.handleChangeOverride}
              onResetOverride={typography.handleResetOverride}
              onClose={() => typography.setInspectorOpen(false)}
              previewTexts={{ ...previewTexts, ...typography.previewTexts }}
            />
          }
        >
          <SiteCopyCard
            title="Personal copy"
            section="personal"
            fields={fields}
            typography={typography}
            targets={targets}
          />
        </AdminEditorLayout>
      )}
    </div>
  );
}
