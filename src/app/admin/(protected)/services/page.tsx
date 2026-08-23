"use client";

import SimpleCrud, { type FieldDef } from "@/components/admin/SimpleCrud";
import { SiteCopyCard, type SiteCopyFieldDef } from "@/components/admin/SiteCopyCard";
import { useSectionTypography } from "@/components/admin/useSectionTypography";
import { adminServicesApi, type ServiceDto, type ServiceUpsertDto } from "@/lib/api";

const initialForm: ServiceUpsertDto = {
  title: "",
  description: null,
  icon: null,
  features: [],
  displayOrder: 0,
  isActive: true,
};

const fields: FieldDef<ServiceUpsertDto>[] = [
  { kind: "text", key: "title", label: "Title", placeholder: "Web Development", typographyTarget: "services.card.title" },
  { kind: "textarea", key: "description", label: "Description", typographyTarget: "services.card.description" },
  { kind: "text", key: "icon", label: "Icon" },
  { kind: "chips", key: "features", label: "Features" },
  { kind: "toggle", key: "isActive", label: "Active" },
];

const copyFields: SiteCopyFieldDef[] = [
  { key: "number", label: "Section number", placeholder: "05 /" },
  { key: "label", label: "Section label", placeholder: "Services" },
  { key: "heading", label: "Heading", kind: "textarea", placeholder: "What I\nCan Do.", span: 2 },
];

const copyTargets: Record<string, string> = {
  number: "services.number",
  label: "services.label",
  heading: "services.title",
};

export default function AdminServicesPage() {
  const typography = useSectionTypography("services");
  return (
    <div className="flex flex-col gap-8">
    <SimpleCrud<ServiceDto, ServiceUpsertDto>
      title="Services"
      subtitle="Services offered, shown on the public Services section. Features render as bullet items."
      fetchAll={async () => (await adminServicesApi.getAll({ pageSize: 100 })).items}
      create={(dto) => adminServicesApi.create(dto)}
      update={(id, dto) => adminServicesApi.update(id, dto)}
      remove={(id) => adminServicesApi.remove(id)}
      setActive={(id, active) => adminServicesApi.setActive(id, active)}
      reorder={(ids) => adminServicesApi.reorder(ids)}
      initialForm={initialForm}
      fields={fields}
      titleOf={(s) => s.title}
      subtitleOf={(s) => `${s.features.length} features`}
      activeOf={(s) => s.isActive}
      idOf={(s) => s.id}
      typography={typography}
      normalize={(d) => ({
        ...d,
        description: d.description?.trim() ? d.description : null,
        icon: d.icon?.trim() ? d.icon : null,
        features: d.features?.length ? d.features : null,
      })}
    />
    <SiteCopyCard title="Services section copy" hint="Number, label and heading for the Services section." section="services" fields={copyFields} typography={typography} targets={copyTargets} />
    </div>
  );
}
