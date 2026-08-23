"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { adminProjectsApi, resolveAssetUrl } from "@/lib/api";
import { useApi } from "@/components/admin/useApi";
import {
  Button,
  Card,
  ConfirmButton,
  EmptyState,
  ErrorBanner,
  Spinner,
  Toggle,
} from "@/components/admin/ui";
import { SectionHeader } from "@/components/admin/SectionHeader";
import AdminEditorLayout from "@/components/admin/AdminEditorLayout";
import { TypographyInspector } from "@/components/admin/typography/TypographyInspector";
import { SiteCopyCard, type SiteCopyFieldDef } from "@/components/admin/SiteCopyCard";
import { useSectionTypography } from "@/components/admin/useSectionTypography";

const copyFields: SiteCopyFieldDef[] = [
  { key: "number", label: "Section number", placeholder: "06 /" },
  { key: "label", label: "Section label", placeholder: "Work" },
  { key: "heading", label: "Heading", kind: "textarea", placeholder: "Things\nI've Built.", span: 2 },
  { key: "viewProjectLabel", label: "View project label", placeholder: "View Case Study" },
  { key: "separator", label: "Separator", placeholder: "—" },
];

const copyTargets: Record<string, string> = {
  number: "work.number",
  label: "work.label",
  heading: "work.title",
  viewProjectLabel: "work.card.link",
};

export default function AdminProjectsPage() {
  const router = useRouter();
  const { data, loading, error, reload } = useApi(
    () => adminProjectsApi.getAll({ pageSize: 100 }),
    []
  );
  const items = data?.items ?? [];

  const typography = useSectionTypography("work");
  const [savingTypo, setSavingTypo] = useState(false);
  const [typoError, setTypoError] = useState<string | null>(null);

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

  const handlePublished = async (id: string, value: boolean) => {
    try {
      await adminProjectsApi.setPublished(id, value);
      await reload();
    } catch {
      await reload();
    }
  };

  const handleFeatured = async (id: string, value: boolean) => {
    try {
      await adminProjectsApi.setFeatured(id, value);
      await reload();
    } catch {
      await reload();
    }
  };

  const handleMove = async (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    try {
      await adminProjectsApi.reorder(next.map((p) => p.id));
      await reload();
    } catch {
      await reload();
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await adminProjectsApi.remove(id);
      await reload();
    } catch {
      await reload();
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <SectionHeader
        title="Projects"
        subtitle="Portfolio work items. Toggle publishing to control visibility on the public site."
        previewHref="/#work"
        actions={
          <Button onClick={() => router.push("/admin/projects/new")}>New project</Button>
        }
        onSave={handleSaveTypo}
        saving={savingTypo}
        saveLabel="Save typography"
      />

      {error && <ErrorBanner message={error} />}
      {typoError && <ErrorBanner message={typoError} />}

      {typography.loading ? (
        <Spinner label="Loading typography" />
      ) : (
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
              previewTexts={typography.previewTexts}
            />
          }
        >
          {loading ? (
            <Spinner label="Loading projects" />
          ) : items.length === 0 ? (
            <EmptyState title="No projects yet" hint="Create your first project to get started." />
          ) : (
            <div className="flex flex-col gap-4">
              {items.map((project, index) => (
                <Card key={project.id} className="p-4 flex items-center gap-4 flex-wrap">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-surface shrink-0">
                    {project.thumbnail && (
                      <img
                        src={resolveAssetUrl(project.thumbnail) ?? ""}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-40">
                    <p className="font-display font-bold text-lg truncate">{project.title}</p>
                    <p className="text-sm text-secondary truncate">
                      {project.category ?? "Uncategorized"} · /{project.slug}
                    </p>
                  </div>
                  <div className="flex items-center gap-5 shrink-0 flex-wrap">
                    <Toggle
                      checked={project.isPublished}
                      onChange={(v) => void handlePublished(project.id, v)}
                      label="Published"
                    />
                    <Toggle
                      checked={project.isFeatured}
                      onChange={(v) => void handleFeatured(project.id, v)}
                      label="Featured"
                    />
                    <div className="flex flex-col">
                      <button
                        onClick={() => void handleMove(index, -1)}
                        disabled={index === 0}
                        className="px-1.5 text-secondary hover:text-foreground disabled:opacity-30"
                        aria-label="Move up"
                      >
                        ^
                      </button>
                      <button
                        onClick={() => void handleMove(index, 1)}
                        disabled={index === items.length - 1}
                        className="px-1.5 text-secondary hover:text-foreground disabled:opacity-30"
                        aria-label="Move down"
                      >
                        v
                      </button>
                    </div>
                    <Link
                      href={`/admin/projects/${project.id}`}
                      className="px-4 py-2 rounded-full bg-surface border border-border text-xs font-bold hover:border-electric/50 transition-colors"
                    >
                      Edit
                    </Link>
                    <ConfirmButton
                      onConfirm={() => void handleDelete(project.id)}
                      className="px-3 py-1.5 text-xs"
                    >
                      Delete
                    </ConfirmButton>
                  </div>
                </Card>
              ))}
            </div>
          )}
          <div className="mt-0">
            <SiteCopyCard
              title="Work section copy"
              hint="Number, label, heading and card labels for the Work / Projects section."
              section="work"
              fields={copyFields}
              typography={typography}
              targets={copyTargets}
            />
          </div>
        </AdminEditorLayout>
      )}
    </div>
  );
}
