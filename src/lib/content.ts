import {
  publicApi,
  type AboutDto,
  type EducationDto,
  type ExperienceDto,
  type HeroDto,
  type ServiceDto,
  type SiteSettingDto,
  type SkillDto,
  type SocialLinkDto,
  type ProjectDto,
  type TypographySettingDto,
  type SiteCopyDto,
} from "./api";

export interface SiteContent {
  hero: HeroDto | null;
  about: AboutDto | null;
  skills: SkillDto[];
  services: ServiceDto[];
  projects: ProjectDto[];
  experiences: ExperienceDto[];
  educations: EducationDto[];
  socialLinks: SocialLinkDto[];
  settings: SiteSettingDto | null;
  typography: TypographySettingDto | null;
  siteCopy: SiteCopyDto | null;
}

async function settled<T>(promise: Promise<T>): Promise<T | null> {
  try {
    return await promise;
  } catch {
    return null;
  }
}

export interface SiteChrome {
  siteCopy: SiteCopyDto | null;
  typography: TypographySettingDto | null;
  settings: SiteSettingDto | null;
  socialLinks: SocialLinkDto[];
}

/**
 * Loads all public content from the CMS API in parallel.
 * Each collection degrades to null/[] on failure so the page always renders;
 * section components fall back to their built-in content when data is missing.
 */
export async function getSiteContent(): Promise<SiteContent> {
  const [hero, about, skills, services, projects, experiences, educations, socialLinks, settings, typography, siteCopy] =
    await Promise.all([
      settled(publicApi.hero()),
      settled(publicApi.about()),
      settled(publicApi.skills()),
      settled(publicApi.services()),
      settled(publicApi.projects()),
      settled(publicApi.experiences()),
      settled(publicApi.educations()),
      settled(publicApi.socialLinks()),
      settled(publicApi.settings()),
      settled(publicApi.typography()),
      settled(publicApi.siteCopy()),
    ]);

  return {
    hero,
    about,
    skills: skills ?? [],
    services: services ?? [],
    projects: projects ?? [],
    experiences: experiences ?? [],
    educations: educations ?? [],
    socialLinks: socialLinks ?? [],
    settings,
    typography,
    siteCopy,
  };
}

/** Navigation/footer chrome shared by every public page. */
export async function getSiteChrome(): Promise<SiteChrome> {
  const [siteCopy, typography, settings, socialLinks] = await Promise.all([
    settled(publicApi.siteCopy()),
    settled(publicApi.typography()),
    settled(publicApi.settings()),
    settled(publicApi.socialLinks()),
  ]);

  return {
    siteCopy,
    typography,
    settings,
    socialLinks: socialLinks ?? [],
  };
}
