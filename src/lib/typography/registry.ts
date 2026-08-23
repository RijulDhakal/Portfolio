export interface TypographyElementDef {  key: string;
  label: string;
  kind: "heading" | "body";
  /**
   * Structural display elements whose size is part of the layout design.
   * Global size inheritance is skipped for these; only explicit overrides apply.
   */
  sizeLocked?: boolean;
  /** Element text can be left/center/right aligned. */
  alignable?: boolean;
}

export interface TypographyGroupDef {
  id: string;
  label: string;
  elements: TypographyElementDef[];
}

export const typographyGroups: TypographyGroupDef[] = [
  {
    id: "hero",
    label: "Hero",
    elements: [
      { key: "hero.greeting", label: "Greeting", kind: "body" },
      { key: "hero.name", label: "Name (letters)", kind: "heading", sizeLocked: true, alignable: true },
      { key: "hero.title", label: "Title", kind: "heading", sizeLocked: true, alignable: true },
      { key: "hero.description", label: "Description", kind: "body", alignable: true },
      { key: "hero.availability", label: "Availability badge", kind: "body", alignable: true },
      { key: "hero.primaryButton", label: "Primary button", kind: "body", alignable: true },
      { key: "hero.secondaryButton", label: "Secondary button", kind: "body", alignable: true },
    ],
  },
  {
    id: "intro",
    label: "Intro",
    elements: [
      { key: "intro.heading", label: "Heading", kind: "heading", sizeLocked: true, alignable: true },
      { key: "intro.body", label: "Body", kind: "body", alignable: true },
    ],
  },
  {
    id: "about",
    label: "About",
    elements: [
      { key: "about.number", label: "Section number", kind: "body" },
      { key: "about.label", label: "Section label", kind: "body" },
      { key: "about.title", label: "Title", kind: "heading", alignable: true },
      { key: "about.description", label: "Description", kind: "body", alignable: true },
      { key: "about.statsValue", label: "Stat numbers", kind: "heading" },
      { key: "about.statsLabel", label: "Stat labels", kind: "body" },
    ],
  },
  {
    id: "skills",
    label: "Skills",
    elements: [
      { key: "skills.number", label: "Section number", kind: "body" },
      { key: "skills.centerLabel", label: "Center label", kind: "body" },
      { key: "skills.label", label: "Section label", kind: "body" },
      { key: "skills.title", label: "Title", kind: "heading", alignable: true },
      { key: "skills.item", label: "Skill chip labels", kind: "body" },
    ],
  },
  {
    id: "services",
    label: "Services",
    elements: [
      { key: "services.number", label: "Section number", kind: "body" },
      { key: "services.label", label: "Section label", kind: "body" },
      { key: "services.title", label: "Title", kind: "heading", alignable: true },
      { key: "services.card.title", label: "Card title", kind: "heading", alignable: true },
      { key: "services.card.description", label: "Card description", kind: "body", alignable: true },
      { key: "services.card.feature", label: "Card feature", kind: "body" },
    ],
  },
  {
    id: "work",
    label: "Work / Projects",
    elements: [
      { key: "work.number", label: "Section number", kind: "body" },
      { key: "work.label", label: "Section label", kind: "body" },
      { key: "work.title", label: "Title", kind: "heading", alignable: true },
      { key: "work.card.title", label: "Project card title", kind: "heading", alignable: true },
      { key: "work.card.category", label: "Project card category", kind: "body" },
      { key: "work.card.description", label: "Project card description", kind: "body", alignable: true },
      { key: "work.card.technologies", label: "Project card technologies", kind: "body" },
      { key: "work.card.link", label: "Project card link", kind: "body" },
    ],
  },
  {
    id: "experience",
    label: "Experience",
    elements: [
      { key: "experience.number", label: "Section number", kind: "body" },
      { key: "experience.label", label: "Section label", kind: "body" },
      { key: "experience.title", label: "Title", kind: "heading", alignable: true },
      { key: "experience.year", label: "Year", kind: "body" },
      { key: "experience.jobTitle", label: "Job title", kind: "heading" },
      { key: "experience.description", label: "Description", kind: "body", alignable: true },
    ],
  },
  {
    id: "education",
    label: "Education",
    elements: [
      { key: "education.number", label: "Section number", kind: "body" },
      { key: "education.label", label: "Section label", kind: "body" },
      { key: "education.title", label: "Title", kind: "heading", alignable: true },
      { key: "education.institution", label: "Institution", kind: "heading" },
      { key: "education.degree", label: "Degree", kind: "body" },
      { key: "education.field", label: "Field", kind: "body" },
      { key: "education.years", label: "Years", kind: "body" },
      { key: "education.description", label: "Description", kind: "body", alignable: true },
    ],
  },
  {
    id: "personal",
    label: "Personal",
    elements: [
      { key: "personal.label", label: "Section label", kind: "body" },
      { key: "personal.heading", label: "Heading", kind: "heading", sizeLocked: true, alignable: true },
      { key: "personal.body", label: "Body", kind: "body", alignable: true },
    ],
  },
  {
    id: "contact",
    label: "Contact",
    elements: [
      { key: "contact.number", label: "Section number", kind: "body" },
      { key: "contact.label", label: "Section label", kind: "body" },
      { key: "contact.heading", label: "Heading", kind: "heading", sizeLocked: true, alignable: true },
      { key: "contact.body", label: "Body", kind: "body", alignable: true },
      { key: "contact.fieldLabel", label: "Field label", kind: "body" },
      { key: "contact.fieldValue", label: "Field value", kind: "heading" },
      { key: "contact.socialLabel", label: "Social labels", kind: "body" },
      { key: "contact.successTitle", label: "Success title", kind: "heading" },
      { key: "contact.successBody", label: "Success body", kind: "body", alignable: true },
      { key: "contact.buttonLabel", label: "Button label", kind: "body" },
      { key: "contact.errorText", label: "Error text", kind: "body" },
    ],
  },
  {
    id: "footer",
    label: "Footer",
    elements: [
      { key: "footer.name", label: "Name", kind: "heading" },
      { key: "footer.tagline", label: "Tagline", kind: "body" },
      { key: "footer.copyright", label: "Copyright", kind: "body" },
      { key: "footer.navLink", label: "Nav link", kind: "body" },
    ],
  },
  {
    id: "navigation",
    label: "Navigation",
    elements: [
      { key: "navigation.brand", label: "Brand / logo text", kind: "heading" },
      { key: "navigation.link", label: "Nav link", kind: "body" },
      { key: "navigation.cta", label: "CTA button", kind: "body" },
    ],
  },
];

const elementIndex = new Map<string, TypographyElementDef>();
for (const group of typographyGroups) {
  for (const element of group.elements) {
    elementIndex.set(element.key, element);
  }
}

export function getElementDef(key: string): TypographyElementDef | null {
  return elementIndex.get(key) ?? null;
}
