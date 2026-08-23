"use client";

import SimpleCrud, { type FieldDef } from "@/components/admin/SimpleCrud";
import { SiteCopyCard, type SiteCopyFieldDef } from "@/components/admin/SiteCopyCard";
import { useSectionTypography } from "@/components/admin/useSectionTypography";
import { adminEducationsApi, type EducationDto, type EducationUpsertDto } from "@/lib/api";

const initialForm: EducationUpsertDto = {
  institution: "",
  degree: "",
  field: null,
  startYear: null,
  endYear: null,
  description: null,
  displayOrder: 0,
};

const fields: FieldDef<EducationUpsertDto>[] = [
  { kind: "text", key: "institution", label: "Institution", placeholder: "Tribhuvan University", typographyTarget: "education.institution" },
  { kind: "text", key: "degree", label: "Degree", placeholder: "BSc Computer Science", typographyTarget: "education.degree" },
  { kind: "text", key: "field", label: "Field", typographyTarget: "education.field" },
  { kind: "text", key: "startYear", label: "Start year", placeholder: "2020", typographyTarget: "education.years" },
  { kind: "text", key: "endYear", label: "End year", placeholder: "2024", typographyTarget: "education.years" },
  { kind: "textarea", key: "description", label: "Description", typographyTarget: "education.description" },
];

const copyFields: SiteCopyFieldDef[] = [
  { key: "number", label: "Section number", placeholder: "07 /" },
  { key: "label", label: "Section label", placeholder: "Education" },
  { key: "heading", label: "Heading", kind: "textarea", placeholder: "Where I\nLearned.", span: 2 },
  { key: "ofConnector", label: "Of connector", placeholder: "of", hint: "Shown between the years and the institution." },
  { key: "dash", label: "Dash separator", placeholder: "—" },
];

const copyTargets: Record<string, string> = {
  number: "education.number",
  label: "education.label",
  heading: "education.title",
};

export default function AdminEducationsPage() {
  const typography = useSectionTypography("education");
  return (
    <div className="flex flex-col gap-8">
    <SimpleCrud<EducationDto, EducationUpsertDto>
      title="Educations"
      subtitle="Education entries shown on the public Education section."
      fetchAll={async () => (await adminEducationsApi.getAll({ pageSize: 100 })).items}
      create={(dto) => adminEducationsApi.create(dto)}
      update={(id, dto) => adminEducationsApi.update(id, dto)}
      remove={(id) => adminEducationsApi.remove(id)}
      reorder={(ids) => adminEducationsApi.reorder(ids)}
      initialForm={initialForm}
      fields={fields}
      titleOf={(e) => e.institution}
      subtitleOf={(e) => `${e.degree}${e.field ? ` - ${e.field}` : ""}`}
      idOf={(e) => e.id}
      typography={typography}
      normalize={(d) => ({
        ...d,
        field: d.field?.trim() ? d.field : null,
        startYear: d.startYear?.trim() ? d.startYear : null,
        endYear: d.endYear?.trim() ? d.endYear : null,
        description: d.description?.trim() ? d.description : null,
        institution: d.institution.trim(),
        degree: d.degree.trim(),
      })}
    />
    <SiteCopyCard title="Education section copy" hint="Number, label, heading and connectors for the Education section." section="education" fields={copyFields} typography={typography} targets={copyTargets} />
    </div>
  );
}
