"use client";

import { useState } from "react";
import { SiteCopyCard, type SiteCopyFieldDef } from "@/components/admin/SiteCopyCard";
import { SectionHeader } from "@/components/admin/SectionHeader";
import AdminEditorLayout from "@/components/admin/AdminEditorLayout";
import { TypographyInspector } from "@/components/admin/typography/TypographyInspector";
import { ErrorBanner, Spinner } from "@/components/admin/ui";
import { useSectionTypography } from "@/components/admin/useSectionTypography";

const fields: SiteCopyFieldDef[] = [
  { key: "brand", label: "Brand", placeholder: "Rijul", span: 2 },
  { key: "hireMe", label: "Hire me label", placeholder: "Hire Me", span: 2 },
  { key: "links", label: "Navigation links", kind: "links", span: 2 },
];

const targets: Record<string, string> = {
  brand: "navigation.brand",
  hireMe: "navigation.cta",
};

const previewTexts: Record<string, string> = {
  "navigation.brand": "Rijul",
  "navigation.link": "About",
  "navigation.cta": "Hire Me",
};

export default function AdminNavigationPage() {
  const typography = useSectionTypography("navigation");
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
        title="Navigation"
        subtitle="Brand name, Hire Me label and the navigation links shown in the site header."
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
              sectionKey="navigation"
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
            title="Navigation copy"
            section="navigation"
            fields={fields}
            typography={typography}
            targets={targets}
          />
        </AdminEditorLayout>
      )}
    </div>
  );
}
