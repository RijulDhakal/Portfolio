"use client";

import { useState } from "react";
import { SiteCopyCard, type SiteCopyFieldDef } from "@/components/admin/SiteCopyCard";
import { SectionHeader } from "@/components/admin/SectionHeader";
import AdminEditorLayout from "@/components/admin/AdminEditorLayout";
import { TypographyInspector } from "@/components/admin/typography/TypographyInspector";
import { ErrorBanner, Spinner } from "@/components/admin/ui";
import { useSectionTypography } from "@/components/admin/useSectionTypography";

const fields: SiteCopyFieldDef[] = [
  { key: "line1", label: "Line 1", placeholder: "I DESIGN." },
  { key: "line2", label: "Line 2", placeholder: "AND" },
  { key: "line3", label: "Line 3", placeholder: "DEVELOP." },
  { key: "body", label: "Body", kind: "textarea", span: 2 },
];

const targets: Record<string, string> = {
  line1: "intro.heading",
  line2: "intro.heading",
  line3: "intro.heading",
  body: "intro.body",
};

const previewTexts: Record<string, string> = {
  "intro.heading": "I DESIGN. / AND / DEVELOP.",
  "intro.body": "I'm a UI/UX Designer and Developer...",
};

export default function AdminIntroPage() {
  const typography = useSectionTypography("intro");
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
        title="Intro"
        subtitle="The full-screen statement shown between the hero and the about section. Use {name} in the body to insert the hero name."
        previewHref="/#intro"
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
              sectionKey="intro"
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
            title="Intro copy"
            section="intro"
            fields={fields}
            typography={typography}
            targets={targets}
          />
        </AdminEditorLayout>
      )}
    </div>
  );
}
