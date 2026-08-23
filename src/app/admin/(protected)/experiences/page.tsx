"use client";

import SimpleCrud, { type FieldDef } from "@/components/admin/SimpleCrud";
import { SiteCopyCard, type SiteCopyFieldDef } from "@/components/admin/SiteCopyCard";
import { useSectionTypography } from "@/components/admin/useSectionTypography";
import { adminExperiencesApi, type ExperienceDto, type ExperienceUpsertDto } from "@/lib/api";

const initialForm: ExperienceUpsertDto = {
  year: "",
  role: "",
  description: null,
  displayOrder: 0,
};

const fields: FieldDef<ExperienceUpsertDto>[] = [
  { kind: "text", key: "year", label: "Year", placeholder: "2023 — Present", typographyTarget: "experience.year" },
  { kind: "text", key: "role", label: "Role", placeholder: "Full Stack Developer", typographyTarget: "experience.jobTitle" },
  { kind: "textarea", key: "description", label: "Description", typographyTarget: "experience.description" },
];

const copyFields: SiteCopyFieldDef[] = [
  { key: "number", label: "Section number", placeholder: "06 /" },
  { key: "label", label: "Section label", placeholder: "Experience" },
  { key: "heading", label: "Heading", kind: "textarea", placeholder: "The Journey\nSo Far.", span: 2 },
];

const copyTargets: Record<string, string> = {
  number: "experience.number",
  label: "experience.label",
  heading: "experience.title",
};

export default function AdminExperiencesPage() {
  const typography = useSectionTypography("experience");
  return (
    <div className="flex flex-col gap-8">
    <SimpleCrud<ExperienceDto, ExperienceUpsertDto>
      title="Experiences"
      subtitle="Career timeline entries shown on the public Experience section."
      fetchAll={async () => (await adminExperiencesApi.getAll({ pageSize: 100 })).items}
      create={(dto) => adminExperiencesApi.create(dto)}
      update={(id, dto) => adminExperiencesApi.update(id, dto)}
      remove={(id) => adminExperiencesApi.remove(id)}
      reorder={(ids) => adminExperiencesApi.reorder(ids)}
      initialForm={initialForm}
      fields={fields}
      titleOf={(e) => e.role}
      subtitleOf={(e) => e.year}
      idOf={(e) => e.id}
      typography={typography}
      normalize={(d) => ({
        ...d,
        description: d.description?.trim() ? d.description : null,
        year: d.year.trim() || "—",
        role: d.role.trim(),
      })}
    />
    <SiteCopyCard title="Experience section copy" hint="Number, label and heading for the Experience section." section="experience" fields={copyFields} typography={typography} targets={copyTargets} />
    </div>
  );
}
