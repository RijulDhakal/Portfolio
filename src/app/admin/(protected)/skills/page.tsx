"use client";

import SimpleCrud, { type FieldDef } from "@/components/admin/SimpleCrud";
import { SiteCopyCard, type SiteCopyFieldDef } from "@/components/admin/SiteCopyCard";
import { useSectionTypography } from "@/components/admin/useSectionTypography";
import { adminSkillsApi, type SkillDto, type SkillUpsertDto } from "@/lib/api";

const initialForm: SkillUpsertDto = {
  name: "",
  category: "DEVELOPMENT",
  description: null,
  icon: null,
  positionX: "50%",
  positionY: "50%",
  displayOrder: 0,
  isActive: true,
};

const fields: FieldDef<SkillUpsertDto>[] = [
  { kind: "text", key: "name", label: "Name", placeholder: "React", typographyTarget: "skills.item" },
  {
    kind: "select",
    key: "category",
    label: "Category",
    options: ["DEVELOPMENT", "UI / UX", "BUSINESS"],
  },
  { kind: "text", key: "description", label: "Description" },
  { kind: "text", key: "positionX", label: "Position X (%)", placeholder: "50%" },
  { kind: "text", key: "positionY", label: "Position Y (%)", placeholder: "50%" },
  { kind: "toggle", key: "isActive", label: "Active" },
];

const copyFields: SiteCopyFieldDef[] = [
  { key: "number", label: "Section number", placeholder: "04 /" },
  { key: "label", label: "Section label", placeholder: "Skills" },
  { key: "heading", label: "Heading", kind: "textarea", placeholder: "Tools I\nWork With.", span: 2 },
  { key: "centerLabel", label: "Center label", placeholder: "RIJUL", span: 2 },
];

const copyTargets: Record<string, string> = {
  number: "skills.number",
  label: "skills.label",
  heading: "skills.title",
  centerLabel: "skills.centerLabel",
};

export default function AdminSkillsPage() {
  const typography = useSectionTypography("skills");
  return (
    <div className="flex flex-col gap-8">
    <SimpleCrud<SkillDto, SkillUpsertDto>
      title="Skills"
      subtitle="Orbit items shown on the public Skills section. Position X/Y place each skill in the orbiting cluster."
      fetchAll={async () => (await adminSkillsApi.getAll({ pageSize: 100 })).items}
      create={(dto) => adminSkillsApi.create(dto)}
      update={(id, dto) => adminSkillsApi.update(id, dto)}
      remove={(id) => adminSkillsApi.remove(id)}
      setActive={(id, active) => adminSkillsApi.setActive(id, active)}
      reorder={(ids) => adminSkillsApi.reorder(ids)}
      initialForm={initialForm}
      fields={fields}
      titleOf={(s) => s.name}
      subtitleOf={(s) => `${s.category} - ${s.positionX} / ${s.positionY}`}
      activeOf={(s) => s.isActive}
      idOf={(s) => s.id}
      typography={typography}
      normalize={(d) => ({
        ...d,
        description: d.description?.trim() ? d.description : null,
        icon: d.icon?.trim() ? d.icon : null,
        category: d.category || "DEVELOPMENT",
        positionX: d.positionX?.trim() ? d.positionX : "50%",
        positionY: d.positionY?.trim() ? d.positionY : "50%",
      })}
    />
    <SiteCopyCard title="Skills section copy" hint="Number, label, heading and center watermark for the Skills section." section="skills" fields={copyFields} typography={typography} targets={copyTargets} />
    </div>
  );
}
