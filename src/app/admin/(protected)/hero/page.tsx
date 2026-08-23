"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  adminContentApi,
  resolveAssetUrl,
  type HeroDto,
  type HeroUpsertDto,
} from "@/lib/api";
import { useApi } from "@/components/admin/useApi";
import { ErrorBanner, Spinner } from "@/components/admin/ui";
import AdminEditorLayout from "@/components/admin/AdminEditorLayout";
import { TypographyTrigger } from "@/components/admin/typography/TypographyTrigger";
import { TypographyInspector } from "@/components/admin/typography/TypographyInspector";
import MediaPicker from "@/components/admin/MediaPicker";
import {
  emptyOverride,
  isOverrideEmpty,
} from "@/components/admin/typography/shared";
import { useSectionTypography } from "@/components/admin/useSectionTypography";
import { cn } from "@/lib/utils";

function toHeroUpsert(hero: HeroDto): HeroUpsertDto {
  return {
    greeting: hero.greeting,
    name: hero.name,
    title: hero.title,
    description: hero.description,
    profilePhoto: hero.profilePhoto,
    cvFile: hero.cvFile,
    cvFileName: hero.cvFileName,
    primaryButtonText: hero.primaryButtonText,
    primaryButtonUrl: hero.primaryButtonUrl,
    secondaryButtonText: hero.secondaryButtonText,
    secondaryButtonUrl: hero.secondaryButtonUrl,
    availabilityText: hero.availabilityText,
    isActive: hero.isActive,
  };
}

export default function AdminHeroPage() {
  // Hero Data
  const { data: heroData, loading: heroLoading, error: heroError, reload: reloadHero } = useApi(
    () => adminContentApi.getHero(),
    []
  );

  const typography = useSectionTypography("hero");

  if (heroLoading || typography.loading || !heroData) {
    return <Spinner label="Loading hero content & typography" />;
  }

  if (heroError) {
    return <ErrorBanner message={heroError} />;
  }

  return (
    <HeroForm
      key={heroData.id ?? heroData.updatedAt ?? "hero"}
      data={heroData}
      reloadHero={reloadHero}
      typography={typography}
    />
  );
}

function HeroForm({
  data,
  reloadHero,
  typography,
}: {
  data: HeroDto;
  reloadHero: () => Promise<void>;
  typography: ReturnType<typeof useSectionTypography>;
}) {
  const [form, setForm] = useState<HeroUpsertDto>(() => toHeroUpsert(data));

  // Media Picker state
  const [pickerOpen, setPickerOpen] = useState<boolean>(false);

  // Save states
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const setHeroField = <K extends keyof HeroUpsertDto>(key: K, value: HeroUpsertDto[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setSaveError(null);
    setSavedSuccess(false);

    try {
      // 1. Save Hero Content
      const heroDto: HeroUpsertDto = {
        ...form,
        profilePhoto: form.profilePhoto?.trim() ? form.profilePhoto : null,
        cvFile: form.cvFile?.trim() ? form.cvFile : null,
        cvFileName: form.cvFileName?.trim() ? form.cvFileName : null,
        primaryButtonText: form.primaryButtonText?.trim() ? form.primaryButtonText : null,
        primaryButtonUrl: form.primaryButtonUrl?.trim() ? form.primaryButtonUrl : null,
        secondaryButtonText: form.secondaryButtonText?.trim() ? form.secondaryButtonText : null,
        secondaryButtonUrl: form.secondaryButtonUrl?.trim() ? form.secondaryButtonUrl : null,
        availabilityText: form.availabilityText?.trim() ? form.availabilityText : null,
        greeting: form.greeting.trim(),
        name: form.name.trim(),
        title: form.title.trim(),
        description: form.description.trim(),
      };
      await adminContentApi.upsertHero(heroDto);

      if (typography.settings) {
        await typography.saveOverrides();
      }

      setSavedSuccess(true);
      await reloadHero();
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const previewTexts: Record<string, string> = useMemo(() => {
    const map: Record<string, string> = {};
    map["hero.greeting"] = form.greeting || "Hello I'm";
    map["hero.name"] = form.name || "Rijul Dhakal";
    map["hero.title"] = form.title || "UI/UX Designer & Developer";
    map["hero.description"] = form.description || "I'm a UI/UX Designer and Developer...";
    map["hero.primaryButton"] = form.primaryButtonText || "VIEW MY WORK";
    map["hero.secondaryButton"] = form.secondaryButtonText || "DOWNLOAD CV";
    map["hero.availability"] = form.availabilityText || "Available for freelance work";
    return map;
  }, [form]);

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#27272A] pb-5">
        <div>
          <h1 className="font-display font-bold text-2xl uppercase tracking-tight text-white">
            Hero
          </h1>
          <p className="text-xs text-secondary mt-1">
            Manage hero content and typography.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/"
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
            <span>{saving ? "Saving…" : "Save hero"}</span>
          </button>
        </div>
      </div>

      {/* Banners */}
      {saveError && <ErrorBanner message={saveError} />}
      {savedSuccess && (
        <div className="w-full bg-[#C8FF00]/10 border border-[#C8FF00]/40 text-[#C8FF00] rounded-xl px-4 py-3 text-xs font-semibold flex items-center gap-2">
          <span>✓</span>
          <span>Hero content and typography saved successfully.</span>
        </div>
      )}

      {/* Main 3-Column Layout */}
      <AdminEditorLayout
        inspectorOpen={typography.inspectorOpen}
        inspector={
          <TypographyInspector
            sectionKey="hero"
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
        {/* Center Content Editor */}
        <div className="flex flex-col gap-6 w-full min-w-0">
          {/* CONTENT Card */}
          <div className="bg-[#121214] border border-[#27272A] rounded-2xl p-6 flex flex-col gap-5 w-full">
            <h2 className="text-[11px] font-bold tracking-[0.2em] uppercase text-secondary">
              CONTENT
            </h2>

            {/* Greeting */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-secondary">Greeting</label>
              <div className="flex items-center gap-2.5">
                <TypographyTrigger
                  active={typography.selectedKey === "hero.greeting" && typography.inspectorOpen}
                  hasOverride={!isOverrideEmpty(typography.overrides["hero.greeting"] ?? emptyOverride)}
                  onClick={() => typography.handleSelect("hero.greeting")}
                />
                <div className="relative flex-1 min-w-0">
                  <input
                    type="text"
                    value={form.greeting}
                    onChange={(e) => setHeroField("greeting", e.target.value)}
                    onFocus={() => typography.handleSelect("hero.greeting")}
                    placeholder="Hello I'm"
                    maxLength={60}
                    className="w-full bg-[#18181B] border border-[#27272A] rounded-xl px-4 py-2.5 text-sm text-foreground focus:border-[#C8FF00] outline-none transition-colors pr-16"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-medium text-secondary/60 select-none">
                    {form.greeting.length} / 60
                  </span>
                </div>
              </div>
            </div>

            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-secondary">Name</label>
              <div className="flex items-center gap-2.5">
                <TypographyTrigger
                  active={typography.selectedKey === "hero.name" && typography.inspectorOpen}
                  hasOverride={!isOverrideEmpty(typography.overrides["hero.name"] ?? emptyOverride)}
                  onClick={() => typography.handleSelect("hero.name")}
                />
                <div className="relative flex-1 min-w-0">
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setHeroField("name", e.target.value)}
                    onFocus={() => typography.handleSelect("hero.name")}
                    placeholder="Rijul Dhakal"
                    maxLength={60}
                    className="w-full bg-[#18181B] border border-[#27272A] rounded-xl px-4 py-2.5 text-sm text-foreground focus:border-[#C8FF00] outline-none transition-colors pr-16"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-medium text-secondary/60 select-none">
                    {form.name.length} / 60
                  </span>
                </div>
              </div>
            </div>

            {/* Title */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-secondary">Title</label>
              <div className="flex items-center gap-2.5">
                <TypographyTrigger
                  active={typography.selectedKey === "hero.title" && typography.inspectorOpen}
                  hasOverride={!isOverrideEmpty(typography.overrides["hero.title"] ?? emptyOverride)}
                  onClick={() => typography.handleSelect("hero.title")}
                />
                <div className="relative flex-1 min-w-0">
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setHeroField("title", e.target.value)}
                    onFocus={() => typography.handleSelect("hero.title")}
                    placeholder="UI/UX Designer & Developer"
                    maxLength={80}
                    className="w-full bg-[#18181B] border border-[#27272A] rounded-xl px-4 py-2.5 text-sm text-foreground focus:border-[#C8FF00] outline-none transition-colors pr-16"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-medium text-secondary/60 select-none">
                    {form.title.length} / 80
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-secondary">Description</label>
                <span className="text-[11px] font-medium text-secondary/60 select-none">
                  {form.description.length} / 300
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <TypographyTrigger
                  active={typography.selectedKey === "hero.description" && typography.inspectorOpen}
                  hasOverride={!isOverrideEmpty(typography.overrides["hero.description"] ?? emptyOverride)}
                  onClick={() => typography.handleSelect("hero.description")}
                  label="≡"
                  title="Description typography"
                  className="mt-1"
                />
                <textarea
                  value={form.description}
                  onChange={(e) => setHeroField("description", e.target.value)}
                  onFocus={() => typography.handleSelect("hero.description")}
                  maxLength={300}
                  rows={4}
                  className="w-full bg-[#18181B] border border-[#27272A] rounded-xl p-3.5 text-sm text-foreground focus:border-[#C8FF00] outline-none transition-colors leading-relaxed resize-none"
                />
              </div>
            </div>

            {/* Primary Button */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-secondary">Primary Button</label>
              <div className="flex items-center gap-2.5">
                <TypographyTrigger
                  active={typography.selectedKey === "hero.primaryButton" && typography.inspectorOpen}
                  hasOverride={!isOverrideEmpty(typography.overrides["hero.primaryButton"] ?? emptyOverride)}
                  onClick={() => typography.handleSelect("hero.primaryButton")}
                  label="▢"
                  title="Primary button typography"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 flex-1 min-w-0">
                  <input
                    type="text"
                    value={form.primaryButtonText ?? ""}
                    onChange={(e) => setHeroField("primaryButtonText", e.target.value)}
                    onFocus={() => typography.handleSelect("hero.primaryButton")}
                    placeholder="VIEW MY WORK"
                    className="w-full bg-[#18181B] border border-[#27272A] rounded-xl px-4 py-2.5 text-sm text-foreground focus:border-[#C8FF00] outline-none transition-colors"
                  />
                  <div className="relative">
                    <input
                      type="text"
                      value={form.primaryButtonUrl ?? ""}
                      onChange={(e) => setHeroField("primaryButtonUrl", e.target.value)}
                      placeholder="#work"
                      className="w-full bg-[#18181B] border border-[#27272A] rounded-xl px-4 py-2.5 text-sm text-foreground focus:border-[#C8FF00] outline-none transition-colors pr-9"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary/60 text-xs pointer-events-none">
                      🔗
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Secondary Button */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-secondary">Secondary Button</label>
              <div className="flex items-center gap-2.5">
                <TypographyTrigger
                  active={typography.selectedKey === "hero.secondaryButton" && typography.inspectorOpen}
                  hasOverride={!isOverrideEmpty(typography.overrides["hero.secondaryButton"] ?? emptyOverride)}
                  onClick={() => typography.handleSelect("hero.secondaryButton")}
                  label="▢"
                  title="Secondary button typography"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 flex-1 min-w-0">
                  <input
                    type="text"
                    value={form.secondaryButtonText ?? ""}
                    onChange={(e) => setHeroField("secondaryButtonText", e.target.value)}
                    onFocus={() => typography.handleSelect("hero.secondaryButton")}
                    placeholder="DOWNLOAD CV"
                    className="w-full bg-[#18181B] border border-[#27272A] rounded-xl px-4 py-2.5 text-sm text-foreground focus:border-[#C8FF00] outline-none transition-colors"
                  />
                  <div className="relative">
                    <input
                      type="text"
                      value={form.secondaryButtonUrl ?? ""}
                      onChange={(e) => setHeroField("secondaryButtonUrl", e.target.value)}
                      placeholder="/uploads/general/Rijul-Dhakal-CV.pdf"
                      className="w-full bg-[#18181B] border border-[#27272A] rounded-xl px-4 py-2.5 text-sm text-foreground focus:border-[#C8FF00] outline-none transition-colors pr-9"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary/60 text-xs pointer-events-none">
                      🔗
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Availability Text */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-secondary">Availability Text</label>
              <div className="flex items-center gap-2.5">
                <TypographyTrigger
                  active={typography.selectedKey === "hero.availability" && typography.inspectorOpen}
                  hasOverride={!isOverrideEmpty(typography.overrides["hero.availability"] ?? emptyOverride)}
                  onClick={() => typography.handleSelect("hero.availability")}
                />
                <div className="relative flex-1 min-w-0">
                  <input
                    type="text"
                    value={form.availabilityText ?? ""}
                    onChange={(e) => setHeroField("availabilityText", e.target.value)}
                    onFocus={() => typography.handleSelect("hero.availability")}
                    placeholder="Available for freelance work"
                    maxLength={80}
                    className="w-full bg-[#18181B] border border-[#27272A] rounded-xl px-4 py-2.5 text-sm text-foreground focus:border-[#C8FF00] outline-none transition-colors pr-16"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-medium text-secondary/60 select-none">
                    {(form.availabilityText || "").length} / 80
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* MEDIA Card */}
          <div className="bg-[#121214] border border-[#27272A] rounded-2xl p-6 flex flex-col gap-5 w-full">
            <h2 className="text-[11px] font-bold tracking-[0.2em] uppercase text-secondary">
              MEDIA
            </h2>

            {/* Profile Photo Row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Photo Thumbnail */}
              <div className="w-16 h-16 rounded-xl border border-[#27272A] overflow-hidden bg-[#18181B] shrink-0 flex items-center justify-center">
                {form.profilePhoto ? (
                  <img
                    src={resolveAssetUrl(form.profilePhoto) ?? form.profilePhoto}
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl text-secondary">👤</span>
                )}
              </div>

              {/* Path + Actions */}
              <div className="flex-1 flex flex-col gap-1.5 w-full min-w-0">
                <div className="flex items-center gap-2 w-full">
                  <input
                    type="text"
                    value={form.profilePhoto ?? ""}
                    onChange={(e) => setHeroField("profilePhoto", e.target.value)}
                    placeholder="/uploads/general/..."
                    className="flex-1 min-w-0 bg-[#18181B] border border-[#27272A] rounded-xl px-4 py-2 text-xs text-foreground focus:border-[#C8FF00] outline-none transition-colors truncate"
                  />
                  <button
                    type="button"
                    onClick={() => setPickerOpen(true)}
                    className="px-4 py-2 rounded-xl bg-[#18181B] border border-[#27272A] hover:bg-white/5 text-xs font-bold text-foreground transition-all shrink-0"
                  >
                    Pick
                  </button>
                  {form.profilePhoto && (
                    <button
                      type="button"
                      onClick={() => setHeroField("profilePhoto", null)}
                      className="p-2 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold transition-all shrink-0"
                      title="Delete image"
                    >
                      🗑
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-secondary/70">
                  Recommended: Square image (1:1) for best results.
                </p>
              </div>
            </div>

            {/* Toggle Switch */}
            <div className="flex items-center gap-3 pt-2 border-t border-[#27272A]">
              <button
                type="button"
                role="switch"
                aria-checked={form.isActive}
                onClick={() => setHeroField("isActive", !form.isActive)}
                className={cn(
                  "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                  form.isActive ? "bg-[#C8FF00]" : "bg-[#27272A]"
                )}
              >
                <span
                  className={cn(
                    "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-black shadow-lg ring-0 transition duration-200 ease-in-out",
                    form.isActive ? "translate-x-5 bg-black" : "translate-x-0 bg-white"
                  )}
                />
              </button>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-foreground">
                  Visible on the public site
                </span>
                <span className="text-[11px] text-secondary">
                  Show or hide the hero section on the public website.
                </span>
              </div>
            </div>
          </div>
        </div>
      </AdminEditorLayout>

      {/* Media Picker Modal */}
      {pickerOpen && (
        <MediaPicker
          onSelect={(url) => {
            setHeroField("profilePhoto", url);
            setPickerOpen(false);
          }}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </div>
  );
}
