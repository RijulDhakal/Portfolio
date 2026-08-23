"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  adminContentApi,
  resolveAssetUrl,
  type AboutDto,
  type AboutUpsertDto,
} from "@/lib/api";
import { useApi } from "@/components/admin/useApi";
import { ErrorBanner, Spinner } from "@/components/admin/ui";
import AdminEditorLayout from "@/components/admin/AdminEditorLayout";
import { TypographyTrigger } from "@/components/admin/typography/TypographyTrigger";
import { TypographyInspector } from "@/components/admin/typography/TypographyInspector";
import MediaPicker from "@/components/admin/MediaPicker";
import { SiteCopyCard, type SiteCopyFieldDef } from "@/components/admin/SiteCopyCard";
import { useSectionTypography } from "@/components/admin/useSectionTypography";
import { emptyOverride, isOverrideEmpty } from "@/components/admin/typography/shared";

function toUpsert(about: AboutDto): AboutUpsertDto {
  return {
    heading: about.heading,
    description: about.description,
    profileImage: about.profileImage,
    experienceYears: about.experienceYears,
    projectsCompleted: about.projectsCompleted,
    technologiesCount: about.technologiesCount,
    commitsCount: about.commitsCount,
    education: about.education,
    additionalInformation: about.additionalInformation,
  };
}

const copyFields: SiteCopyFieldDef[] = [
  { key: "number", label: "Section number", placeholder: "01 /" },
  { key: "label", label: "Section label", placeholder: "About" },
  { key: "stat1Label", label: "Stat 1 label", placeholder: "YEARS OF" },
  { key: "stat2Label", label: "Stat 2 label", placeholder: "PROJECTS" },
  { key: "stat3Label", label: "Stat 3 label", placeholder: "TECH" },
  { key: "statSuffix", label: "Stat suffix", placeholder: "+", hint: "Appended to the stat values." },
];

const copyTargets: Record<string, string> = {
  number: "about.number",
  label: "about.label",
  stat1Label: "about.statsLabel",
  stat2Label: "about.statsLabel",
  stat3Label: "about.statsLabel",
};

export default function AdminAboutPage() {
  const { data, loading, error, reload } = useApi(() => adminContentApi.getAbout(), []);
  const typography = useSectionTypography("about");

  if (loading || typography.loading || !data) return <Spinner label="Loading about section" />;
  if (error) return <ErrorBanner message={error} />;

  return (
    <AboutForm
      key={data.id ?? data.updatedAt ?? "about"}
      data={data}
      reload={reload}
      typography={typography}
    />
  );
}

function AboutForm({
  data,
  reload,
  typography,
}: {
  data: AboutDto;
  reload: () => Promise<void>;
  typography: ReturnType<typeof useSectionTypography>;
}) {
  const [form, setForm] = useState<AboutUpsertDto>(() => toUpsert(data));

  // Media Picker state
  const [pickerOpen, setPickerOpen] = useState<boolean>(false);

  // Save state
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const set = <K extends keyof AboutUpsertDto>(key: K, value: AboutUpsertDto[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setSaveError(null);
    setSavedSuccess(false);

    try {
      const dto: AboutUpsertDto = {
        ...form,
        profileImage: form.profileImage?.trim() ? form.profileImage : null,
        commitsCount:
          form.commitsCount !== null && form.commitsCount !== undefined && form.commitsCount > 0
            ? form.commitsCount
            : null,
        education: form.education?.trim() ? form.education : null,
        additionalInformation: form.additionalInformation?.trim() ? form.additionalInformation : null,
        heading: form.heading.trim(),
        description: form.description.trim(),
      };
      await adminContentApi.upsertAbout(dto);

      if (typography.settings) {
        await typography.saveOverrides();
      }

      setSavedSuccess(true);
      await reload();
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const previewTexts: Record<string, string> = useMemo(() => {
    const map: Record<string, string> = {};
    map["about.number"] = "01 /";
    map["about.label"] = "About";
    map["about.title"] = form.heading || "About me";
    map["about.description"] = form.description || "Description...";
    map["about.statsValue"] = `${form.experienceYears ?? 3}+`;
    map["about.statsLabel"] = "YEARS OF EXPERIENCE";
    return map;
  }, [form]);

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#27272A] pb-5">
        <div>
          <h1 className="font-display font-bold text-2xl uppercase tracking-tight text-white">
            About
          </h1>
          <p className="text-xs text-secondary mt-1">
            Introduction section with statistics shown as animated counters.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/#about"
            target="_blank"
            className="h-10 px-4 rounded-xl border border-[#27272A] bg-[#121214] hover:bg-white/5 text-xs font-bold text-foreground transition-all flex items-center gap-2"
          >
            <span>👁</span>
            <span>Preview</span>
          </Link>
          <button
            type="button"
            onClick={() => void handleSaveAll()}
            disabled={saving}
            className="h-10 px-5 rounded-xl bg-[#C8FF00] hover:bg-[#b8eb00] text-black font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(200,255,0,0.25)] flex items-center gap-2 disabled:opacity-50"
          >
            <span>💾</span>
            <span>{saving ? "Saving…" : "Save about"}</span>
          </button>
        </div>
      </div>

      {saveError && <ErrorBanner message={saveError} />}
      {savedSuccess && (
        <div className="w-full bg-[#C8FF00]/10 border border-[#C8FF00]/40 text-[#C8FF00] rounded-xl px-4 py-3 text-xs font-semibold flex items-center gap-2">
          <span>✓</span>
          <span>About section content and typography saved successfully.</span>
        </div>
      )}

      {/* 3-Column Layout */}
      <AdminEditorLayout
        inspectorOpen={typography.inspectorOpen}
        inspector={
          <TypographyInspector
            sectionKey="about"
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
        <div className="flex flex-col gap-6 w-full min-w-0">
          {/* CONTENT CARD */}
          <div className="bg-[#121214] border border-[#27272A] rounded-2xl p-6 flex flex-col gap-5 w-full">
            <h2 className="text-[11px] font-bold tracking-[0.2em] uppercase text-secondary">
              CONTENT
            </h2>

            {/* Heading */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-secondary">Heading</label>
              <div className="flex items-center gap-2.5">
                <TypographyTrigger
                  active={typography.selectedKey === "about.title" && typography.inspectorOpen}
                  hasOverride={!isOverrideEmpty(typography.overrides["about.title"] ?? emptyOverride)}
                  onClick={() => typography.handleSelect("about.title")}
                />
                <input
                  type="text"
                  value={form.heading}
                  onChange={(e) => set("heading", e.target.value)}
                  onFocus={() => typography.handleSelect("about.title")}
                  placeholder="About me"
                  className="flex-1 bg-[#18181B] border border-[#27272A] rounded-xl px-4 py-2.5 text-sm text-foreground focus:border-[#C8FF00] outline-none transition-colors"
                />
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-secondary">Description</label>
              <div className="flex items-start gap-2.5">
                <TypographyTrigger
                  active={typography.selectedKey === "about.description" && typography.inspectorOpen}
                  hasOverride={!isOverrideEmpty(typography.overrides["about.description"] ?? emptyOverride)}
                  onClick={() => typography.handleSelect("about.description")}
                  label="≡"
                  className="mt-1"
                />
                <textarea
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  onFocus={() => typography.handleSelect("about.description")}
                  rows={4}
                  className="flex-1 bg-[#18181B] border border-[#27272A] rounded-xl p-3.5 text-sm text-foreground focus:border-[#C8FF00] outline-none transition-colors leading-relaxed"
                />
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <TypographyTrigger
                    active={typography.selectedKey === "about.statsValue" && typography.inspectorOpen}
                    hasOverride={!isOverrideEmpty(typography.overrides["about.statsValue"] ?? emptyOverride)}
                    onClick={() => typography.handleSelect("about.statsValue")}
                    label="#"
                  />
                  <span className="text-xs font-semibold text-secondary">Years</span>
                </div>
                <input
                  type="number"
                  value={form.experienceYears ?? ""}
                  onChange={(e) => set("experienceYears", e.target.value ? Number(e.target.value) : 0)}
                  onFocus={() => typography.handleSelect("about.statsValue")}
                  className="bg-[#18181B] border border-[#27272A] rounded-xl px-3 py-2 text-sm text-foreground focus:border-[#C8FF00] outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <TypographyTrigger
                    active={typography.selectedKey === "about.statsValue" && typography.inspectorOpen}
                    hasOverride={!isOverrideEmpty(typography.overrides["about.statsValue"] ?? emptyOverride)}
                    onClick={() => typography.handleSelect("about.statsValue")}
                    label="#"
                  />
                  <span className="text-xs font-semibold text-secondary">Projects</span>
                </div>
                <input
                  type="number"
                  value={form.projectsCompleted ?? ""}
                  onChange={(e) => set("projectsCompleted", e.target.value ? Number(e.target.value) : 0)}
                  onFocus={() => typography.handleSelect("about.statsValue")}
                  className="bg-[#18181B] border border-[#27272A] rounded-xl px-3 py-2 text-sm text-foreground focus:border-[#C8FF00] outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <TypographyTrigger
                    active={typography.selectedKey === "about.statsValue" && typography.inspectorOpen}
                    hasOverride={!isOverrideEmpty(typography.overrides["about.statsValue"] ?? emptyOverride)}
                    onClick={() => typography.handleSelect("about.statsValue")}
                    label="#"
                  />
                  <span className="text-xs font-semibold text-secondary">Tech</span>
                </div>
                <input
                  type="number"
                  value={form.technologiesCount ?? ""}
                  onChange={(e) => set("technologiesCount", e.target.value ? Number(e.target.value) : 0)}
                  onFocus={() => typography.handleSelect("about.statsValue")}
                  className="bg-[#18181B] border border-[#27272A] rounded-xl px-3 py-2 text-sm text-foreground focus:border-[#C8FF00] outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <TypographyTrigger
                    active={typography.selectedKey === "about.statsValue" && typography.inspectorOpen}
                    hasOverride={!isOverrideEmpty(typography.overrides["about.statsValue"] ?? emptyOverride)}
                    onClick={() => typography.handleSelect("about.statsValue")}
                    label="#"
                  />
                  <span className="text-xs font-semibold text-secondary">Commits</span>
                </div>
                <input
                  type="number"
                  value={form.commitsCount ?? ""}
                  onChange={(e) => set("commitsCount", e.target.value ? Number(e.target.value) : null)}
                  onFocus={() => typography.handleSelect("about.statsValue")}
                  className="bg-[#18181B] border border-[#27272A] rounded-xl px-3 py-2 text-sm text-foreground focus:border-[#C8FF00] outline-none"
                />
              </div>
            </div>

            {/* Education & Extra Info */}
            <div className="flex flex-col gap-1.5 pt-2">
              <label className="text-xs font-semibold text-secondary">Education</label>
              <input
                type="text"
                value={form.education ?? ""}
                onChange={(e) => set("education", e.target.value)}
                placeholder="Tribhuvan University"
                className="w-full bg-[#18181B] border border-[#27272A] rounded-xl px-4 py-2.5 text-sm text-foreground focus:border-[#C8FF00] outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-secondary">Additional Information</label>
              <textarea
                value={form.additionalInformation ?? ""}
                onChange={(e) => set("additionalInformation", e.target.value)}
                rows={3}
                className="w-full bg-[#18181B] border border-[#27272A] rounded-xl p-3.5 text-sm text-foreground focus:border-[#C8FF00] outline-none"
              />
            </div>
          </div>

          {/* MEDIA CARD */}
          <div className="bg-[#121214] border border-[#27272A] rounded-2xl p-6 flex flex-col gap-4 w-full">
            <h2 className="text-[11px] font-bold tracking-[0.2em] uppercase text-secondary">
              MEDIA
            </h2>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-16 h-16 rounded-xl border border-[#27272A] overflow-hidden bg-[#18181B] shrink-0 flex items-center justify-center">
                {form.profileImage ? (
                  <img
                    src={resolveAssetUrl(form.profileImage) ?? form.profileImage}
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl text-secondary">👤</span>
                )}
              </div>

              <div className="flex-1 flex flex-col gap-1.5 w-full min-w-0">
                <div className="flex items-center gap-2 w-full">
                  <input
                    type="text"
                    value={form.profileImage ?? ""}
                    onChange={(e) => set("profileImage", e.target.value)}
                    placeholder="/uploads/general/..."
                    className="flex-1 min-w-0 bg-[#18181B] border border-[#27272A] rounded-xl px-4 py-2 text-xs text-foreground focus:border-[#C8FF00] outline-none truncate"
                  />
                  <button
                    type="button"
                    onClick={() => setPickerOpen(true)}
                    className="px-4 py-2 rounded-xl bg-[#18181B] border border-[#27272A] hover:bg-white/5 text-xs font-bold text-foreground transition-all shrink-0"
                  >
                    Pick
                  </button>
                  {form.profileImage && (
                    <button
                      type="button"
                      onClick={() => set("profileImage", null)}
                      className="p-2 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold transition-all shrink-0"
                    >
                      🗑
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <SiteCopyCard
            title="About section copy"
            hint="Number, label and statistic labels for the About section."
            section="about"
            fields={copyFields}
            typography={typography}
            targets={copyTargets}
          />
        </div>
      </AdminEditorLayout>

      {pickerOpen && (
        <MediaPicker
          onSelect={(url) => {
            set("profileImage", url);
            setPickerOpen(false);
          }}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </div>
  );
}
