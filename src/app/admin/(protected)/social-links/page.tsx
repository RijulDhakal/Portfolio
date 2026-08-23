"use client";

import SimpleCrud, { type FieldDef } from "@/components/admin/SimpleCrud";
import { adminSocialLinksApi, type SocialLinkDto, type SocialLinkUpsertDto } from "@/lib/api";

const initialForm: SocialLinkUpsertDto = {
  platform: "",
  label: null,
  shortLabel: null,
  url: "",
  icon: null,
  displayOrder: 0,
  isActive: true,
};

const fields: FieldDef<SocialLinkUpsertDto>[] = [
  { kind: "text", key: "platform", label: "Platform", placeholder: "GitHub" },
  { kind: "text", key: "label", label: "Label" },
  { kind: "text", key: "shortLabel", label: "Short Label" },
  { kind: "text", key: "url", label: "URL", placeholder: "https://github.com/…" },
  { kind: "text", key: "icon", label: "Icon" },
  { kind: "toggle", key: "isActive", label: "Active" },
];

export default function AdminSocialLinksPage() {
  return (
    <SimpleCrud<SocialLinkDto, SocialLinkUpsertDto>
      title="Social Links"
      subtitle="Social profiles shown in the Contact and Footer sections."
      fetchAll={async () => (await adminSocialLinksApi.getAll({ pageSize: 100 })).items}
      create={(dto) => adminSocialLinksApi.create(dto)}
      update={(id, dto) => adminSocialLinksApi.update(id, dto)}
      remove={(id) => adminSocialLinksApi.remove(id)}
      setActive={(id, active) => adminSocialLinksApi.setActive(id, active)}
      reorder={(ids) => adminSocialLinksApi.reorder(ids)}
      initialForm={initialForm}
      fields={fields}
      titleOf={(s) => s.platform}
      subtitleOf={(s) => s.url}
      activeOf={(s) => s.isActive}
      idOf={(s) => s.id}
      normalize={(d) => ({
        ...d,
        label: d.label?.trim() ? d.label : null,
        shortLabel: d.shortLabel?.trim() ? d.shortLabel : null,
        icon: d.icon?.trim() ? d.icon : null,
        platform: d.platform.trim() || "Custom",
        url: d.url.trim(),
      })}
    />
  );
}
