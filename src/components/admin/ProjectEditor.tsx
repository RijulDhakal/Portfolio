"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  adminProjectsApi,
  resolveAssetUrl,
  type ProjectDto,
  type ProjectImageUpsertDto,
  type ProjectUpsertDto,
} from "@/lib/api";
import { useApi } from "./useApi";
import {
  Button,
  Card,
  ErrorBanner,
  Field,
  Input,
  PageHeader,
  Spinner,
  Textarea,
  Toggle,
} from "./ui";
import { ChipsEditor, UrlField } from "./fields";
import MediaPicker from "./MediaPicker";
import AdminEditorLayout from "./AdminEditorLayout";
import { TypographyInspector } from "./typography/TypographyInspector";
import { TypographyTarget } from "./typography/TypographyTarget";
import { TypographyTrigger } from "./typography/TypographyTrigger";
import { emptyOverride, isOverrideEmpty } from "./typography/shared";
import { useSectionTypography } from "./useSectionTypography";

interface ProjectFormState {
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  technologies: string[];
  thumbnail: string;
  featuredImage: string;
  liveUrl: string;
  githubUrl: string;
  figmaUrl: string;
  caseStudyUrl: string;
  year: string;
  role: string;
  client: string;
  problem: string;
  goal: string;
  contribution: string;
  process: string;
  features: string[];
  challenges: string;
  solution: string;
  results: string;
  displayOrder: number;
  isFeatured: boolean;
  isPublished: boolean;
  images: ProjectImageUpsertDto[];
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function fromProject(project: ProjectDto): ProjectFormState {
  return {
    title: project.title,
    slug: project.slug,
    shortDescription: project.shortDescription ?? "",
    fullDescription: project.fullDescription ?? "",
    category: project.category ?? "",
    technologies: project.technologies,
    thumbnail: project.thumbnail ?? "",
    featuredImage: project.featuredImage ?? "",
    liveUrl: project.liveUrl ?? "",
    githubUrl: project.githubUrl ?? "",
    figmaUrl: project.figmaUrl ?? "",
    caseStudyUrl: project.caseStudyUrl ?? "",
    year: project.year ?? "",
    role: project.role ?? "",
    client: project.client ?? "",
    problem: project.problem ?? "",
    goal: project.goal ?? "",
    contribution: project.contribution ?? "",
    process: project.process ?? "",
    features: project.features,
    challenges: project.challenges ?? "",
    solution: project.solution ?? "",
    results: project.results ?? "",
    displayOrder: project.displayOrder,
    isFeatured: project.isFeatured,
    isPublished: project.isPublished,
    images: project.images.map((image) => ({
      id: image.id,
      imageUrl: image.imageUrl,
      altText: image.altText,
      displayOrder: image.displayOrder,
    })),
  };
}

function emptyForm(nextOrder: number): ProjectFormState {
  return {
    title: "",
    slug: "",
    shortDescription: "",
    fullDescription: "",
    category: "",
    technologies: [],
    thumbnail: "",
    featuredImage: "",
    liveUrl: "",
    githubUrl: "",
    figmaUrl: "",
    caseStudyUrl: "",
    year: "",
    role: "",
    client: "",
    problem: "",
    goal: "",
    contribution: "",
    process: "",
    features: [],
    challenges: "",
    solution: "",
    results: "",
    displayOrder: nextOrder,
    isFeatured: false,
    isPublished: false,
    images: [],
  };
}

export default function ProjectEditor({ id }: { id?: string }) {
  const { data, loading, error } = useApi(
    () => (id ? adminProjectsApi.get(id) : Promise.resolve(null)),
    [id]
  );

  if (id && loading) return <Spinner label="Loading project" />;
  if (error) return <ErrorBanner message={error} />;
  if (id && !data) return <Spinner label="Loading project" />;

  const initialForm = data ? fromProject(data) : emptyForm(1);

  return <ProjectForm key={id ?? "new"} initialForm={initialForm} id={id} />;
}

function ProjectForm({
  initialForm,
  id,
}: {
  initialForm: ProjectFormState;
  id?: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState<ProjectFormState>(initialForm);
  const [slugTouched, setSlugTouched] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savingTypo, setSavingTypo] = useState(false);
  const [typoError, setTypoError] = useState<string | null>(null);

  const typography = useSectionTypography("work");

  const set = <K extends keyof ProjectFormState>(key: K, value: ProjectFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleTitleChange = (title: string) => {
    setForm((prev) => {
      if (!prev) return prev;
      const next = { ...prev, title };
      if (!slugTouched) next.slug = slugify(title);
      return next;
    });
  };

  const handleSaveTypo = async () => {
    setSavingTypo(true);
    setTypoError(null);
    try {
      await typography.saveOverrides();
    } catch (err) {
      setTypoError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSavingTypo(false);
    }
  };

  const addImage = (imageUrl: string) => {
    setForm((prev) => {
      if (!prev) return prev;
      const nextOrder = prev.images.reduce((max, image) => Math.max(max, image.displayOrder), 0) + 1;
      return {
        ...prev,
        images: [...prev.images, { id: null, imageUrl, altText: null, displayOrder: nextOrder }],
      };
    });
  };

  const handleSave = async () => {
    if (!form) return;
    setSaving(true);
    setSaveError(null);
    try {
      const dto: ProjectUpsertDto = {
        title: form.title.trim(),
        slug: form.slug.trim() || slugify(form.title) || "project",
        shortDescription: form.shortDescription.trim() ? form.shortDescription : null,
        fullDescription: form.fullDescription.trim() ? form.fullDescription : null,
        category: form.category.trim() ? form.category : null,
        technologies: form.technologies.length ? form.technologies : null,
        thumbnail: form.thumbnail.trim() ? form.thumbnail : null,
        featuredImage: form.featuredImage.trim() ? form.featuredImage : null,
        liveUrl: form.liveUrl.trim() ? form.liveUrl : null,
        githubUrl: form.githubUrl.trim() ? form.githubUrl : null,
        figmaUrl: form.figmaUrl.trim() ? form.figmaUrl : null,
        caseStudyUrl: form.caseStudyUrl.trim() ? form.caseStudyUrl : null,
        year: form.year.trim() ? form.year : null,
        role: form.role.trim() ? form.role : null,
        client: form.client.trim() ? form.client : null,
        problem: form.problem.trim() ? form.problem : null,
        goal: form.goal.trim() ? form.goal : null,
        contribution: form.contribution.trim() ? form.contribution : null,
        process: form.process.trim() ? form.process : null,
        features: form.features.length ? form.features : null,
        challenges: form.challenges.trim() ? form.challenges : null,
        solution: form.solution.trim() ? form.solution : null,
        results: form.results.trim() ? form.results : null,
        displayOrder: form.displayOrder,
        isFeatured: form.isFeatured,
        isPublished: form.isPublished,
        images: form.images.map((image, index) => ({
          ...image,
          altText: image.altText?.trim() ? image.altText : null,
          displayOrder: image.displayOrder || index + 1,
        })),
      };
      if (id) {
        await adminProjectsApi.update(id, dto);
      } else {
        await adminProjectsApi.create(dto);
      }
      router.push("/admin/projects");
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Save failed.");
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        title={id ? "Edit project" : "New project"}
        subtitle="Projects appear on the public Work section when published."
        actions={
          <>
            <Button variant="secondary" onClick={() => router.push("/admin/projects")}>
              Back to projects
            </Button>
            <Button variant="secondary" onClick={() => void handleSaveTypo()} disabled={savingTypo}>
              {savingTypo ? "Saving…" : "Save typography"}
            </Button>
            <Button onClick={() => void handleSave()} disabled={saving}>
              {saving ? "Saving…" : "Save project"}
            </Button>
          </>
        }
      />

      {saveError && <div className="mb-6"><ErrorBanner message={saveError} /></div>}
      {typoError && <div className="mb-6"><ErrorBanner message={typoError} /></div>}

      <AdminEditorLayout
        inspectorOpen={typography.inspectorOpen}
        inspector={
          <TypographyInspector
            sectionKey="work"
            selectedElementKey={typography.selectedKey}
            onSelectElement={typography.handleSelect}
            overrides={typography.overrides}
            onChangeOverride={typography.handleChangeOverride}
            onResetOverride={typography.handleResetOverride}
            onClose={() => typography.setInspectorOpen(false)}
            previewTexts={{
              "work.card.technologies": form.technologies?.join(", ") ?? "",
              ...typography.previewTexts,
            }}
          />
        }
      >
        <div className="flex flex-col gap-6 w-full min-w-0">
          <Card>
            <h2 className="font-display font-bold text-xl uppercase tracking-tight mb-5">Details</h2>
            <div className="grid md:grid-cols-2 gap-5">
              <TypographyTarget
                typography={typography}
                elementKey="work.card.title"
                label="Title"
                value={form.title}
                onChange={handleTitleChange}
                placeholder="Project name"
              />
              <Field label="Slug" hint="Used in the project URL.">
                <Input
                  value={form.slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    set("slug", slugify(e.target.value));
                  }}
                  placeholder="project-name"
                />
              </Field>
              <TypographyTarget
                typography={typography}
                elementKey="work.card.category"
                label="Category"
                value={form.category}
                onChange={(v) => set("category", v)}
                placeholder="Web App"
              />
              <Field label="Display order">
                <Input
                  type="number"
                  value={String(form.displayOrder)}
                  onChange={(e) => set("displayOrder", Number(e.target.value) || 0)}
                />
              </Field>
              <TypographyTarget
                typography={typography}
                elementKey="work.card.description"
                label="Short description"
                hint="One-liner shown in the Work section card."
                value={form.shortDescription}
                onChange={(v) => set("shortDescription", v)}
                kind="textarea"
                span={2}
              />
              <div className="md:col-span-2">
                <Field label="Full description">
                  <Textarea value={form.fullDescription} onChange={(e) => set("fullDescription", e.target.value)} className="min-h-40" />
                </Field>
              </div>
              <div className="md:col-span-2">
                <Field
                  label="Technologies"
                  action={
                    <TypographyTrigger
                      active={
                        typography.inspectorOpen &&
                        typography.selectedKey === "work.card.technologies"
                      }
                      hasOverride={
                        !isOverrideEmpty(
                          typography.overrides["work.card.technologies"] ?? emptyOverride
                        )
                      }
                      onClick={() => typography.handleSelect("work.card.technologies")}
                    />
                  }
                >
                  <ChipsEditor values={form.technologies} onChange={(v) => set("technologies", v)} placeholder="Add a technology and press Enter" />
                </Field>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="font-display font-bold text-xl uppercase tracking-tight mb-5">Images</h2>
            <div className="grid md:grid-cols-2 gap-5">
              <UrlField label="Thumbnail" hint="Card image on the Work section." value={form.thumbnail} onChange={(v) => set("thumbnail", v)} />
              <UrlField label="Featured image" value={form.featuredImage} onChange={(v) => set("featuredImage", v)} />
            </div>
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <span className="block text-xs font-bold tracking-widest text-secondary uppercase">
                  Gallery
                </span>
                <button
                  onClick={() => setPickerOpen(true)}
                  className="px-4 py-2 rounded-full bg-surface border border-border text-xs font-bold hover:border-electric/50 transition-colors"
                >
                  Add image
                </button>
              </div>
              {form.images.length === 0 ? (
                <p className="text-sm text-secondary">No gallery images yet.</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {form.images.map((image, index) => (
                    <div key={index} className="flex items-center gap-4 bg-background rounded-xl border border-border p-3">
                      <img
                        src={resolveAssetUrl(image.imageUrl) ?? ""}
                        alt={image.altText ?? ""}
                        className="w-16 h-16 rounded-lg object-cover shrink-0"
                      />
                      <Input
                        value={image.altText ?? ""}
                        onChange={(e) => {
                          const next = [...form.images];
                          next[index] = { ...next[index], altText: e.target.value };
                          set("images", next);
                        }}
                        placeholder="Alt text"
                        className="flex-1"
                      />
                      <button
                        onClick={() => set("images", form.images.filter((_, i) => i !== index))}
                        className="px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold hover:bg-red-500/20 transition-colors shrink-0"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          <Card>
            <h2 className="font-display font-bold text-xl uppercase tracking-tight mb-2">Project Links</h2>
            <p className="text-sm text-secondary mb-5">Optional. Empty fields are hidden on the public project page.</p>
            <div className="grid md:grid-cols-2 gap-5">
              <Field label="Live Project URL">
                <Input value={form.liveUrl} onChange={(e) => set("liveUrl", e.target.value)} placeholder="https://…" />
              </Field>
              <Field label="GitHub Repository URL">
                <Input value={form.githubUrl} onChange={(e) => set("githubUrl", e.target.value)} placeholder="https://github.com/…" />
              </Field>
              <Field label="Design / Figma URL">
                <Input value={form.figmaUrl} onChange={(e) => set("figmaUrl", e.target.value)} placeholder="https://figma.com/…" />
              </Field>
              <Field label="Case Study URL">
                <Input value={form.caseStudyUrl} onChange={(e) => set("caseStudyUrl", e.target.value)} placeholder="https://…" />
              </Field>
            </div>
          </Card>

          <Card>
            <h2 className="font-display font-bold text-xl uppercase tracking-tight mb-2">Case Study</h2>
            <p className="text-sm text-secondary mb-5">Optional. Empty fields are simply hidden on the public project page.</p>
            <div className="grid md:grid-cols-3 gap-5">
              <Field label="Year">
                <Input value={form.year} onChange={(e) => set("year", e.target.value)} placeholder="2026" />
              </Field>
              <Field label="Role">
                <Input value={form.role} onChange={(e) => set("role", e.target.value)} placeholder="Lead Developer" />
              </Field>
              <Field label="Client">
                <Input value={form.client} onChange={(e) => set("client", e.target.value)} placeholder="Client name" />
              </Field>
            </div>
            <div className="flex flex-col gap-5 mt-5">
              <Field label="Problem">
                <Textarea value={form.problem} onChange={(e) => set("problem", e.target.value)} />
              </Field>
              <Field label="Goal">
                <Textarea value={form.goal} onChange={(e) => set("goal", e.target.value)} />
              </Field>
              <Field label="My Role / Contribution">
                <Textarea value={form.contribution} onChange={(e) => set("contribution", e.target.value)} />
              </Field>
              <Field label="Process">
                <Textarea value={form.process} onChange={(e) => set("process", e.target.value)} />
              </Field>
              <Field label="Key Features">
                <ChipsEditor values={form.features} onChange={(v) => set("features", v)} placeholder="Add a feature and press Enter" />
              </Field>
              <Field label="Challenges">
                <Textarea value={form.challenges} onChange={(e) => set("challenges", e.target.value)} />
              </Field>
              <Field label="Solution">
                <Textarea value={form.solution} onChange={(e) => set("solution", e.target.value)} />
              </Field>
              <Field label="Results">
                <Textarea value={form.results} onChange={(e) => set("results", e.target.value)} />
              </Field>
            </div>
          </Card>

          <Card>
            <div className="flex flex-wrap gap-8">
              <Toggle checked={form.isPublished} onChange={(v) => set("isPublished", v)} label="Published on the public site" />
              <Toggle checked={form.isFeatured} onChange={(v) => set("isFeatured", v)} label="Featured" />
            </div>
          </Card>
        </div>
      </AdminEditorLayout>

      {pickerOpen && (
        <MediaPicker
          title="Add gallery image"
          onSelect={(url) => {
            addImage(url);
            setPickerOpen(false);
          }}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </div>
  );
}
