"use client";

import { useState } from "react";
import { SiteCopyCard, type SiteCopyFieldDef } from "@/components/admin/SiteCopyCard";
import { SectionHeader } from "@/components/admin/SectionHeader";
import AdminEditorLayout from "@/components/admin/AdminEditorLayout";
import { TypographyInspector } from "@/components/admin/typography/TypographyInspector";
import { ErrorBanner, Spinner } from "@/components/admin/ui";
import { useSectionTypography } from "@/components/admin/useSectionTypography";

const fields: SiteCopyFieldDef[] = [
  { key: "number", label: "Section number", placeholder: "07 /" },
  { key: "label", label: "Section label", placeholder: "Contact" },
  { key: "headingLine1", label: "Heading line 1", placeholder: "LET'S" },
  { key: "headingLine2", label: "Heading line 2", placeholder: "MAKE" },
  { key: "headingLine3", label: "Heading line 3", placeholder: "SOMETHING." },
  { key: "body", label: "Body", kind: "textarea", span: 2 },
  { key: "emailLabel", label: "Email label", placeholder: "Email" },
  { key: "phoneLabel", label: "Phone label", placeholder: "Phone" },
  { key: "phoneNumber", label: "Phone number", placeholder: "+977 9746254793" },
  { key: "formNameLabel", label: "Form name label", placeholder: "Your Name" },
  { key: "formEmailLabel", label: "Form email label", placeholder: "Your Email" },
  { key: "formMessageLabel", label: "Form message label", placeholder: "Your Message" },
  { key: "namePlaceholder", label: "Name placeholder", placeholder: "John Doe" },
  { key: "emailPlaceholder", label: "Email placeholder", placeholder: "john@example.com" },
  { key: "messagePlaceholder", label: "Message placeholder", placeholder: "Tell me about your project…" },
  { key: "submitLabel", label: "Submit button", placeholder: "SEND MESSAGE" },
  { key: "sendingLabel", label: "Sending state", placeholder: "SENDING…" },
  { key: "successTitle", label: "Success title", placeholder: "Message Sent", span: 2 },
  { key: "successBody", label: "Success body", kind: "textarea", span: 2 },
  { key: "sendAnotherLabel", label: "Send another label", placeholder: "SEND ANOTHER", span: 2 },
  { key: "errorFallback", label: "Error fallback", kind: "textarea", span: 2 },
];

const targets: Record<string, string> = {
  number: "contact.number",
  label: "contact.label",
  headingLine1: "contact.heading",
  headingLine2: "contact.heading",
  headingLine3: "contact.heading",
  body: "contact.body",
  emailLabel: "contact.fieldLabel",
  phoneLabel: "contact.fieldLabel",
  formNameLabel: "contact.fieldLabel",
  formEmailLabel: "contact.fieldLabel",
  formMessageLabel: "contact.fieldLabel",
  phoneNumber: "contact.fieldValue",
  submitLabel: "contact.buttonLabel",
  sendingLabel: "contact.buttonLabel",
  sendAnotherLabel: "contact.buttonLabel",
  successTitle: "contact.successTitle",
  successBody: "contact.successBody",
  errorFallback: "contact.errorText",
};

const previewTexts: Record<string, string> = {
  "contact.number": "07 /",
  "contact.label": "Contact",
  "contact.heading": "LET'S MAKE SOMETHING.",
  "contact.body": "Contact body...",
  "contact.fieldLabel": "Email",
  "contact.fieldValue": "hello@rijuldhakal.com",
  "contact.socialLabel": "GitHub",
  "contact.successTitle": "Message Sent",
  "contact.successBody": "Thanks for reaching out!",
  "contact.buttonLabel": "SEND MESSAGE",
  "contact.errorText": "Something went wrong.",
};

export default function AdminContactPage() {
  const typography = useSectionTypography("contact");
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
        title="Contact"
        subtitle="Contact section heading, email/phone details, form labels and the success/error states of the contact form."
        previewHref="/#contact"
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
              sectionKey="contact"
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
            title="Contact copy"
            section="contact"
            fields={fields}
            typography={typography}
            targets={targets}
          />
        </AdminEditorLayout>
      )}
    </div>
  );
}
