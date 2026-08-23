"use client";

import { useState } from "react";
import {
  adminContentApi,
  type SiteSettingDto,
  type SiteSettingUpsertDto,
} from "@/lib/api";
import { useApi } from "@/components/admin/useApi";
import {
  Button,
  Card,
  ErrorBanner,
  Field,
  Input,
  PageHeader,
  Spinner,
  Textarea,
} from "@/components/admin/ui";
import { UrlField } from "@/components/admin/fields";
import { SiteCopyCard, type SiteCopyFieldDef } from "@/components/admin/SiteCopyCard";

function toUpsert(settings: SiteSettingDto): SiteSettingUpsertDto {
  return {
    siteName: settings.siteName,
    siteTitle: settings.siteTitle,
    metaTitle: settings.metaTitle,
    metaDescription: settings.metaDescription,
    favicon: settings.favicon,
    ogImage: settings.ogImage,
    logo: settings.logo,
    copyrightText: settings.copyrightText,
    googleAnalyticsId: settings.googleAnalyticsId,
  };
}

const footerFields: SiteCopyFieldDef[] = [
  { key: "navigationHeading", label: "Navigation heading", placeholder: "Navigation" },
  { key: "contactHeading", label: "Contact heading", placeholder: "Contact" },
  { key: "builtWith", label: "Built with text", placeholder: "Built with curiosity.", span: 2 },
  { key: "navLinks", label: "Footer navigation links", kind: "links", span: 2 },
];

const globalUiFields: SiteCopyFieldDef[] = [
  { key: "cursorDefault", label: "Default cursor", placeholder: "VIEW" },
  { key: "cursorHome", label: "Home cursor", placeholder: "HOME" },
  { key: "cursorLetsTalk", label: "Lets talk cursor", placeholder: "LET'S TALK" },
  { key: "cursorView", label: "View cursor", placeholder: "VIEW" },
  { key: "cursorDownload", label: "Download cursor", placeholder: "DOWNLOAD" },
  { key: "cursorDesign", label: "Design cursor", placeholder: "DESIGN" },
  { key: "cursorBuild", label: "Build cursor", placeholder: "BUILD" },
  { key: "cursorCreate", label: "Create cursor", placeholder: "CREATE" },
  { key: "cursorExplore", label: "Explore cursor", placeholder: "EXPLORE" },
  { key: "cursorOpen", label: "Open cursor", placeholder: "OPEN" },
  { key: "cursorBolt", label: "Bolt cursor", placeholder: "⚡" },
  { key: "heroImageAlt", label: "Hero image alt text", span: 2 },
];

export default function AdminSettingsPage() {
  const { data, loading, error, reload } = useApi(() => adminContentApi.getSettings(), []);

  if (loading || !data) return <Spinner label="Loading settings" />;
  if (error) return <ErrorBanner message={error} />;

  return (
    <SettingsForm
      key={data.id ?? data.updatedAt ?? "settings"}
      data={data}
      reload={reload}
    />
  );
}

function SettingsForm({
  data,
  reload,
}: {
  data: SiteSettingDto;
  reload: () => Promise<void>;
}) {
  const [form, setForm] = useState<SiteSettingUpsertDto>(() => toUpsert(data));
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const set = <K extends keyof SiteSettingUpsertDto>(key: K, value: SiteSettingUpsertDto[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    setSaved(false);
    try {
      const dto: SiteSettingUpsertDto = {
        ...form,
        metaTitle: form.metaTitle?.trim() ? form.metaTitle : null,
        metaDescription: form.metaDescription?.trim() ? form.metaDescription : null,
        favicon: form.favicon?.trim() ? form.favicon : null,
        ogImage: form.ogImage?.trim() ? form.ogImage : null,
        logo: form.logo?.trim() ? form.logo : null,
        copyrightText: form.copyrightText?.trim() ? form.copyrightText : null,
        googleAnalyticsId: form.googleAnalyticsId?.trim() ? form.googleAnalyticsId : null,
        siteName: form.siteName.trim(),
        siteTitle: form.siteTitle.trim(),
      };
      await adminContentApi.upsertSettings(dto);
      setSaved(true);
      await reload();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="Site-wide identity: brand name, tagline, SEO metadata and shared assets."
        actions={
          <Button onClick={() => void handleSave()} disabled={saving}>
            {saving ? "Saving…" : "Save settings"}
          </Button>
        }
      />

      {saveError && <div className="mb-6"><ErrorBanner message={saveError} /></div>}
      {saved && !saveError && (
        <div className="mb-6 w-full bg-electric/10 border border-electric/30 text-electric rounded-lg px-4 py-3 text-sm">
          Settings saved successfully.
        </div>
      )}

      <Card>
        <div className="grid md:grid-cols-2 gap-5">
          <Field label="Site name">
            <Input value={form.siteName} onChange={(e) => set("siteName", e.target.value)} placeholder="Rijul Dhakal" />
          </Field>
          <Field label="Site title">
            <Input value={form.siteTitle} onChange={(e) => set("siteTitle", e.target.value)} placeholder="UI/UX Designer & Developer" />
          </Field>
          <Field label="Meta title" hint="Browser tab / search result title.">
            <Input value={form.metaTitle ?? ""} onChange={(e) => set("metaTitle", e.target.value)} />
          </Field>
          <Field label="Google Analytics ID" hint="Optional — e.g. G-XXXXXXXXXX">
            <Input value={form.googleAnalyticsId ?? ""} onChange={(e) => set("googleAnalyticsId", e.target.value)} />
          </Field>
          <div className="md:col-span-2">
            <Field label="Meta description" hint="Used for search results and social previews.">
              <Textarea value={form.metaDescription ?? ""} onChange={(e) => set("metaDescription", e.target.value)} />
            </Field>
          </div>
          <div className="md:col-span-2">
            <UrlField label="Logo" value={form.logo ?? ""} onChange={(v) => set("logo", v)} />
          </div>
          <div className="md:col-span-2">
            <UrlField label="Favicon" value={form.favicon ?? ""} onChange={(v) => set("favicon", v)} />
          </div>
          <div className="md:col-span-2">
            <UrlField label="Open Graph image" hint="Shared when the site is linked on social platforms." value={form.ogImage ?? ""} onChange={(v) => set("ogImage", v)} />
          </div>
          <div className="md:col-span-2">
            <Field label="Copyright text">
              <Input value={form.copyrightText ?? ""} onChange={(e) => set("copyrightText", e.target.value)} placeholder="2026 Rijul Dhakal" />
            </Field>
          </div>
        </div>
      </Card>
      <SiteCopyCard title="Footer copy" hint="Headings, navigation links and the 'Built with' text for the site footer." section="footer" fields={footerFields} />
      <SiteCopyCard title="Global UI copy" hint="Custom cursor labels and image alt text used across the site." section="globalUi" fields={globalUiFields} />
    </div>
  );
}
