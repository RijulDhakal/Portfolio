/**
 * Typed API client for the Portfolio CMS backend.
 *
 * Backend contract (ASP.NET Core Web API, /api/v1):
 * - Every response is wrapped in ApiResponse<T>: { success, message, data, errors }
 * - Paged admin endpoints return PagedResult<T>: { items, total, page, pageSize }
 * - Auth uses JWT access token (Bearer) + revocable refresh token (rotated on refresh)
 * - Admin endpoints live under /api/v1/admin/* and require Authorization: Bearer <accessToken>
 *
 * The API is a separate process (default http://localhost:5261) configured via
 * NEXT_PUBLIC_API_URL in the frontend environment.
 */

export const API_BASE_URL: string =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5261";

/* ------------------------------------------------------------------ */
/* Envelope + paging                                                    */
/* ------------------------------------------------------------------ */

export interface ApiResponse<T> {
  success: boolean;
  message: string | null;
  data: T | null;
  errors: string[] | null;
}

export interface PagedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

/* ------------------------------------------------------------------ */
/* Auth                                                                 */
/* ------------------------------------------------------------------ */

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface UserDto {
  id: string;
  email: string;
  role: string;
  lastLoginAt: string | null;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
  refreshTokenExpiresAt: string;
  user: UserDto;
}

/* ------------------------------------------------------------------ */
/* Content DTOs                                                         */
/* ------------------------------------------------------------------ */

export interface HeroDto {
  id: string;
  greeting: string;
  name: string;
  title: string;
  description: string;
  profilePhoto: string | null;
  cvFile: string | null;
  cvFileName: string | null;
  primaryButtonText: string | null;
  primaryButtonUrl: string | null;
  secondaryButtonText: string | null;
  secondaryButtonUrl: string | null;
  availabilityText: string | null;
  isActive: boolean;
  updatedAt: string;
}

export interface HeroUpsertDto {
  greeting: string;
  name: string;
  title: string;
  description: string;
  profilePhoto: string | null;
  cvFile: string | null;
  cvFileName: string | null;
  primaryButtonText: string | null;
  primaryButtonUrl: string | null;
  secondaryButtonText: string | null;
  secondaryButtonUrl: string | null;
  availabilityText: string | null;
  isActive: boolean;
}

export interface AboutDto {
  id: string;
  heading: string;
  description: string;
  profileImage: string | null;
  experienceYears: number;
  projectsCompleted: number;
  technologiesCount: number;
  commitsCount: number | null;
  education: string | null;
  additionalInformation: string | null;
  updatedAt: string;
}

export interface AboutUpsertDto {
  heading: string;
  description: string;
  profileImage: string | null;
  experienceYears: number;
  projectsCompleted: number;
  technologiesCount: number;
  commitsCount: number | null;
  education: string | null;
  additionalInformation: string | null;
}

export interface SkillDto {
  id: string;
  name: string;
  category: string;
  description: string | null;
  icon: string | null;
  positionX: string | null;
  positionY: string | null;
  displayOrder: number;
  isActive: boolean;
}

export interface SkillUpsertDto {
  name: string;
  category: string;
  description: string | null;
  icon: string | null;
  positionX: string | null;
  positionY: string | null;
  displayOrder: number;
  isActive: boolean;
}

export interface ServiceDto {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
  features: string[];
  displayOrder: number;
  isActive: boolean;
}

export interface ServiceUpsertDto {
  title: string;
  description: string | null;
  icon: string | null;
  features: string[] | null;
  displayOrder: number;
  isActive: boolean;
}

export interface ProjectImageDto {
  id: string;
  imageUrl: string;
  altText: string | null;
  displayOrder: number;
}

export interface ProjectDto {
  id: string;
  title: string;
  slug: string;
  shortDescription: string | null;
  fullDescription: string | null;
  category: string | null;
  technologies: string[];
  thumbnail: string | null;
  featuredImage: string | null;
  liveUrl: string | null;
  githubUrl: string | null;
  figmaUrl: string | null;
  caseStudyUrl: string | null;
  year: string | null;
  role: string | null;
  client: string | null;
  problem: string | null;
  goal: string | null;
  contribution: string | null;
  process: string | null;
  features: string[];
  challenges: string | null;
  solution: string | null;
  results: string | null;
  displayOrder: number;
  isFeatured: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  images: ProjectImageDto[];
}

export interface ProjectImageUpsertDto {
  id: string | null;
  imageUrl: string;
  altText: string | null;
  displayOrder: number;
}

export interface ProjectUpsertDto {
  title: string;
  slug: string;
  shortDescription: string | null;
  fullDescription: string | null;
  category: string | null;
  technologies: string[] | null;
  thumbnail: string | null;
  featuredImage: string | null;
  liveUrl: string | null;
  githubUrl: string | null;
  figmaUrl: string | null;
  caseStudyUrl: string | null;
  year: string | null;
  role: string | null;
  client: string | null;
  problem: string | null;
  goal: string | null;
  contribution: string | null;
  process: string | null;
  features: string[] | null;
  challenges: string | null;
  solution: string | null;
  results: string | null;
  displayOrder: number;
  isFeatured: boolean;
  isPublished: boolean;
  images: ProjectImageUpsertDto[] | null;
}

export interface ExperienceDto {
  id: string;
  year: string;
  role: string;
  description: string | null;
  displayOrder: number;
}

export interface ExperienceUpsertDto {
  year: string;
  role: string;
  description: string | null;
  displayOrder: number;
}

export interface EducationDto {
  id: string;
  institution: string;
  degree: string;
  field: string | null;
  startYear: string | null;
  endYear: string | null;
  description: string | null;
  displayOrder: number;
}

export interface EducationUpsertDto {
  institution: string;
  degree: string;
  field: string | null;
  startYear: string | null;
  endYear: string | null;
  description: string | null;
  displayOrder: number;
}

export interface SocialLinkDto {
  id: string;
  platform: string;
  label: string | null;
  shortLabel: string | null;
  url: string;
  icon: string | null;
  displayOrder: number;
  isActive: boolean;
}

export interface SocialLinkUpsertDto {
  platform: string;
  label: string | null;
  shortLabel: string | null;
  url: string;
  icon: string | null;
  displayOrder: number;
  isActive: boolean;
}

export interface SiteSettingDto {
  id: string;
  siteName: string;
  siteTitle: string;
  metaTitle: string | null;
  metaDescription: string | null;
  favicon: string | null;
  ogImage: string | null;
  logo: string | null;
  copyrightText: string | null;
  googleAnalyticsId: string | null;
  updatedAt: string;
}

export interface SiteSettingUpsertDto {
  siteName: string;
  siteTitle: string;
  metaTitle: string | null;
  metaDescription: string | null;
  favicon: string | null;
  ogImage: string | null;
  logo: string | null;
  copyrightText: string | null;
  googleAnalyticsId: string | null;
}

export interface TypographyGlobalDto {
  headingFont: string | null;
  bodyFont: string | null;
  headingSize: string | null;
  bodySize: string | null;
  headingWeight: string | null;
  bodyWeight: string | null;
  headingLetterSpacing: string | null;
  bodyLetterSpacing: string | null;
  headingLineHeight: string | null;
  bodyLineHeight: string | null;
  headingUppercase: boolean | null;
}

export interface TypographyElementOverrideDto {
  fontFamily: string | null;
  fontSize: string | null;
  fontWeight: string | null;
  letterSpacing: string | null;
  lineHeight: string | null;
  uppercase: boolean | null;
  textAlign: string | null;
  color?: string | null;
}

export interface TypographySettingDto {
  id: string;
  global: TypographyGlobalDto;
  overrides: Record<string, TypographyElementOverrideDto>;
  updatedAt: string;
}

export interface TypographySettingUpsertDto {
  global: TypographyGlobalDto;
  overrides: Record<string, TypographyElementOverrideDto>;
}

export interface NavLinkDto {
  label: string;
  href: string;
}

export interface SiteCopyNavigationDto {
  brand: string;
  hireMe: string;
  links: NavLinkDto[];
}

export interface SiteCopyIntroDto {
  line1: string;
  line2: string;
  line3: string;
  body: string;
}

export interface SiteCopyAboutDto {
  number: string;
  label: string;
  stat1Label: string;
  stat2Label: string;
  stat3Label: string;
  statSuffix: string;
}

export interface SiteCopySkillsDto {
  number: string;
  label: string;
  heading: string;
  centerLabel: string;
}

export interface SiteCopyServicesDto {
  number: string;
  label: string;
  heading: string;
}

export interface SiteCopyWorkDto {
  number: string;
  label: string;
  heading: string;
  viewProjectLabel: string;
  separator: string;
}

export interface SiteCopyExperienceDto {
  number: string;
  label: string;
  heading: string;
}

export interface SiteCopyEducationDto {
  number: string;
  label: string;
  heading: string;
  ofConnector: string;
  dash: string;
}

export interface SiteCopyPersonalDto {
  label: string;
  heading: string;
  marqueeWords: string[];
  marqueeSeparator: string;
  body: string;
}

export interface SiteCopyContactDto {
  number: string;
  label: string;
  headingLine1: string;
  headingLine2: string;
  headingLine3: string;
  body: string;
  emailLabel: string;
  phoneLabel: string;
  phoneNumber: string;
  formNameLabel: string;
  formEmailLabel: string;
  formMessageLabel: string;
  namePlaceholder: string;
  emailPlaceholder: string;
  messagePlaceholder: string;
  submitLabel: string;
  sendingLabel: string;
  successTitle: string;
  successBody: string;
  sendAnotherLabel: string;
  errorFallback: string;
}

export interface SiteCopyFooterDto {
  navigationHeading: string;
  contactHeading: string;
  navLinks: NavLinkDto[];
  builtWith: string;
}

export interface SiteCopyGlobalUiDto {
  cursorDefault: string;
  cursorHome: string;
  cursorLetsTalk: string;
  cursorView: string;
  cursorDownload: string;
  cursorDesign: string;
  cursorBuild: string;
  cursorCreate: string;
  cursorExplore: string;
  cursorOpen: string;
  cursorBolt: string;
  heroImageAlt: string;
}

export interface SiteCopyDto {
  id: string;
  navigation: SiteCopyNavigationDto;
  intro: SiteCopyIntroDto;
  about: SiteCopyAboutDto;
  skills: SiteCopySkillsDto;
  services: SiteCopyServicesDto;
  work: SiteCopyWorkDto;
  experience: SiteCopyExperienceDto;
  education: SiteCopyEducationDto;
  personal: SiteCopyPersonalDto;
  contact: SiteCopyContactDto;
  footer: SiteCopyFooterDto;
  globalUi: SiteCopyGlobalUiDto;
  updatedAt: string;
}

export interface SiteCopyUpsertDto {
  navigation: SiteCopyNavigationDto;
  intro: SiteCopyIntroDto;
  about: SiteCopyAboutDto;
  skills: SiteCopySkillsDto;
  services: SiteCopyServicesDto;
  work: SiteCopyWorkDto;
  experience: SiteCopyExperienceDto;
  education: SiteCopyEducationDto;
  personal: SiteCopyPersonalDto;
  contact: SiteCopyContactDto;
  footer: SiteCopyFooterDto;
  globalUi: SiteCopyGlobalUiDto;
}

export interface ContactMessageDto {
  id: string;
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface ContactMessageRequest {
  name: string;
  email: string;
  message: string;
}

/* ------------------------------------------------------------------ */
/* Media                                                                */
/* ------------------------------------------------------------------ */

export interface MediaItemDto {
  id: string;
  fileName: string;
  originalFileName: string;
  fileType: string;
  mimeType: string;
  fileSize: number;
  url: string;
  altText: string | null;
  folder: string;
  uploadedAt: string;
  uploadedBy: string | null;
}

export interface DashboardStatsDto {
  projectsCount: number;
  publishedProjects: number;
  skillsCount: number;
  servicesCount: number;
  unreadMessages: number;
  mediaCount: number;
  recentProjects: ProjectDto[];
  recentMessages: ContactMessageDto[];
}

/* ------------------------------------------------------------------ */
/* Token storage (admin session)                                        */
/* ------------------------------------------------------------------ */

const ACCESS_TOKEN_KEY = "portfolio_admin_access_token";
const REFRESH_TOKEN_KEY = "portfolio_admin_refresh_token";
const USER_KEY = "portfolio_admin_user";

export const tokenStore = {
  getAccessToken(): string | null {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(ACCESS_TOKEN_KEY);
  },
  getRefreshToken(): string | null {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(REFRESH_TOKEN_KEY);
  },
  setTokens(access: string, refresh: string): void {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(ACCESS_TOKEN_KEY, access);
    window.localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  },
  clear(): void {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
    window.localStorage.removeItem(USER_KEY);
  },
  getUser(): UserDto | null {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as UserDto;
    } catch {
      return null;
    }
  },
  setUser(user: UserDto): void {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
};

/* ------------------------------------------------------------------ */
/* Low-level fetch wrapper with envelope + refresh-on-401               */
/* ------------------------------------------------------------------ */

export class ApiError extends Error {
  status: number;
  errors: string[] | null;
  constructor(status: number, message: string, errors: string[] | null = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

let refreshPromise: Promise<boolean> | null = null;

async function refreshTokens(): Promise<boolean> {
  const refreshToken = tokenStore.getRefreshToken();
  if (!refreshToken) return false;
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken } satisfies RefreshTokenRequest),
      cache: "no-store",
    });
    if (!res.ok) {
      tokenStore.clear();
      return false;
    }
    const body = (await res.json()) as ApiResponse<LoginResponse>;
    if (!body.success || !body.data) {
      tokenStore.clear();
      return false;
    }
    tokenStore.setTokens(body.data.accessToken, body.data.refreshToken);
    tokenStore.setUser(body.data.user);
    return true;
  } catch {
    tokenStore.clear();
    return false;
  }
}

interface ApiFetchOptions {
  method?: string;
  body?: unknown;
  formData?: FormData;
  auth?: boolean;
  /** Set false to skip the automatic single retry after token refresh. */
  retryOnRefresh?: boolean;
}

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {}
): Promise<ApiResponse<T>> {
  const {
    method = "GET",
    body,
    formData,
    auth = false,
    retryOnRefresh = true,
  } = options;

  const headers: Record<string, string> = {};
  if (formData) {
    // Let the browser set the multipart boundary.
  } else if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }
  if (auth) {
    const token = tokenStore.getAccessToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: formData ?? (body !== undefined ? JSON.stringify(body) : undefined),
    cache: "no-store",
  });

  // 401 on an authenticated request: try refreshing the token once, then retry.
  if (res.status === 401 && auth && retryOnRefresh) {
    refreshPromise = refreshPromise ?? refreshTokens();
    const ok = await refreshPromise;
    refreshPromise = null;
    if (ok) {
      return apiFetch<T>(path, { ...options, retryOnRefresh: false });
    }
    throw new ApiError(401, "Authentication required. Please sign in again.");
  }

  // 204 / empty body (e.g. some media responses) -> treat as empty envelope.
  const text = await res.text();
  let payload: ApiResponse<T> | null = null;
  if (text) {
    try {
      payload = JSON.parse(text) as ApiResponse<T>;
    } catch {
      payload = null;
    }
  }

  if (!res.ok) {
    const message =
      payload?.message ||
      (Array.isArray(payload?.errors) && payload!.errors!.length > 0
        ? payload!.errors!.join(" ")
        : null) ||
      `Request failed with status ${res.status}.`;
    throw new ApiError(res.status, message, payload?.errors ?? null);
  }

  if (!payload) {
    return { success: true, message: null, data: null, errors: null };
  }
  return payload;
}

/* ------------------------------------------------------------------ */
/* Auth API                                                             */
/* ------------------------------------------------------------------ */

export const authApi = {
  async login(request: LoginRequest): Promise<LoginResponse> {
    const body = await apiFetch<LoginResponse>("/api/v1/auth/login", {
      method: "POST",
      body: request,
    });
    if (!body.data) throw new ApiError(500, "Login returned no data.");
    tokenStore.setTokens(body.data.accessToken, body.data.refreshToken);
    tokenStore.setUser(body.data.user);
    return body.data;
  },

  async refresh(request: RefreshTokenRequest): Promise<LoginResponse> {
    const body = await apiFetch<LoginResponse>("/api/v1/auth/refresh", {
      method: "POST",
      body: request,
    });
    if (!body.data) throw new ApiError(500, "Refresh returned no data.");
    tokenStore.setTokens(body.data.accessToken, body.data.refreshToken);
    tokenStore.setUser(body.data.user);
    return body.data;
  },

  async me(): Promise<UserDto> {
    const body = await apiFetch<UserDto>("/api/v1/auth/me", { auth: true });
    if (!body.data) throw new ApiError(500, "Me returned no data.");
    return body.data;
  },

  async logout(): Promise<void> {
    const refreshToken = tokenStore.getRefreshToken();
    try {
      if (refreshToken) {
        await apiFetch<unknown>("/api/v1/auth/logout", {
          method: "POST",
          body: { refreshToken } satisfies RefreshTokenRequest,
          auth: true,
        });
      }
    } finally {
      tokenStore.clear();
    }
  },
};

/* ------------------------------------------------------------------ */
/* Public API                                                           */
/* ------------------------------------------------------------------ */

export const publicApi = {
  async hero(): Promise<HeroDto> {
    const body = await apiFetch<HeroDto>("/api/v1/hero");
    if (!body.data) throw new ApiError(500, "Hero returned no data.");
    return body.data;
  },
  async about(): Promise<AboutDto> {
    const body = await apiFetch<AboutDto>("/api/v1/about");
    if (!body.data) throw new ApiError(500, "About returned no data.");
    return body.data;
  },
  async skills(): Promise<SkillDto[]> {
    const body = await apiFetch<SkillDto[]>("/api/v1/skills");
    if (!body.data) throw new ApiError(500, "Skills returned no data.");
    return body.data;
  },
  async services(): Promise<ServiceDto[]> {
    const body = await apiFetch<ServiceDto[]>("/api/v1/services");
    if (!body.data) throw new ApiError(500, "Services returned no data.");
    return body.data;
  },
  async projects(): Promise<ProjectDto[]> {
    const body = await apiFetch<ProjectDto[]>("/api/v1/projects");
    if (!body.data) throw new ApiError(500, "Projects returned no data.");
    return body.data;
  },
  async projectBySlug(slug: string): Promise<ProjectDto> {
    const body = await apiFetch<ProjectDto>(`/api/v1/projects/${encodeURIComponent(slug)}`);
    if (!body.data) throw new ApiError(500, "Project returned no data.");
    return body.data;
  },
  async experiences(): Promise<ExperienceDto[]> {
    const body = await apiFetch<ExperienceDto[]>("/api/v1/experiences");
    if (!body.data) throw new ApiError(500, "Experiences returned no data.");
    return body.data;
  },
  async educations(): Promise<EducationDto[]> {
    const body = await apiFetch<EducationDto[]>("/api/v1/educations");
    if (!body.data) throw new ApiError(500, "Educations returned no data.");
    return body.data;
  },
  async socialLinks(): Promise<SocialLinkDto[]> {
    const body = await apiFetch<SocialLinkDto[]>("/api/v1/social-links");
    if (!body.data) throw new ApiError(500, "Social links returned no data.");
    return body.data;
  },
  async settings(): Promise<SiteSettingDto> {
    const body = await apiFetch<SiteSettingDto>("/api/v1/settings");
    if (!body.data) throw new ApiError(500, "Settings returned no data.");
    return body.data;
  },
  async typography(): Promise<TypographySettingDto | null> {
    const body = await apiFetch<TypographySettingDto>("/api/v1/typography");
    return body.data;
  },
  async siteCopy(): Promise<SiteCopyDto | null> {
    const body = await apiFetch<SiteCopyDto>("/api/v1/site-copy");
    return body.data;
  },
  async submitContact(request: ContactMessageRequest): Promise<ContactMessageDto> {
    const body = await apiFetch<ContactMessageDto>("/api/v1/contact", {
      method: "POST",
      body: request,
    });
    if (!body.data) throw new ApiError(500, "Contact returned no data.");
    return body.data;
  },
};

/* ------------------------------------------------------------------ */
/* Admin: content                                                       */
/* ------------------------------------------------------------------ */

export const adminContentApi = {
  getHero: () =>
    apiFetch<HeroDto>("/api/v1/admin/hero", { auth: true }).then(requireData),
  upsertHero: (dto: HeroUpsertDto) =>
    apiFetch<HeroDto>("/api/v1/admin/hero", { method: "PUT", body: dto, auth: true }).then(requireData),
  getAbout: () =>
    apiFetch<AboutDto>("/api/v1/admin/about", { auth: true }).then(requireData),
  upsertAbout: (dto: AboutUpsertDto) =>
    apiFetch<AboutDto>("/api/v1/admin/about", { method: "PUT", body: dto, auth: true }).then(requireData),
  getSettings: () =>
    apiFetch<SiteSettingDto>("/api/v1/admin/settings", { auth: true }).then(requireData),
  upsertSettings: (dto: SiteSettingUpsertDto) =>
    apiFetch<SiteSettingDto>("/api/v1/admin/settings", { method: "PUT", body: dto, auth: true }).then(requireData),
  getSiteCopy: () =>
    apiFetch<SiteCopyDto>("/api/v1/admin/site-copy", { auth: true }).then(requireData),
  upsertSiteCopy: (dto: SiteCopyUpsertDto) =>
    apiFetch<SiteCopyDto>("/api/v1/admin/site-copy", { method: "PUT", body: dto, auth: true }).then(requireData),
};

/* ------------------------------------------------------------------ */
/* Admin: typography                                                    */
/* ------------------------------------------------------------------ */

export const adminTypographyApi = {
  get: () =>
    apiFetch<TypographySettingDto>("/api/v1/admin/typography", { auth: true }).then(requireData),
  upsert: (dto: TypographySettingUpsertDto) =>
    apiFetch<TypographySettingDto>("/api/v1/admin/typography", { method: "PUT", body: dto, auth: true }).then(requireData),
};

/* ------------------------------------------------------------------ */
/* Admin: skills                                                        */
/* ------------------------------------------------------------------ */

export const adminSkillsApi = {
  getAll: (params: { search?: string; category?: string; activeOnly?: boolean; page?: number; pageSize?: number } = {}) => {
    const qs = new URLSearchParams();
    if (params.search) qs.set("search", params.search);
    if (params.category) qs.set("category", params.category);
    if (params.activeOnly !== undefined) qs.set("activeOnly", String(params.activeOnly));
    qs.set("page", String(params.page ?? 1));
    qs.set("pageSize", String(params.pageSize ?? 50));
    return apiFetch<PagedResult<SkillDto>>(`/api/v1/admin/skills?${qs.toString()}`, { auth: true }).then(requireData);
  },
  get: (id: string) =>
    apiFetch<SkillDto>(`/api/v1/admin/skills/${id}`, { auth: true }).then(requireData),
  create: (dto: SkillUpsertDto) =>
    apiFetch<SkillDto>("/api/v1/admin/skills", { method: "POST", body: dto, auth: true }).then(requireData),
  update: (id: string, dto: SkillUpsertDto) =>
    apiFetch<SkillDto>(`/api/v1/admin/skills/${id}`, { method: "PUT", body: dto, auth: true }).then(requireData),
  setActive: (id: string, isActive: boolean) =>
    apiFetch<unknown>(`/api/v1/admin/skills/${id}/active`, { method: "PATCH", body: isActive, auth: true }),
  reorder: (orderedIds: string[]) =>
    apiFetch<unknown>("/api/v1/admin/skills/reorder", { method: "PUT", body: orderedIds, auth: true }),
  remove: (id: string) =>
    apiFetch<unknown>(`/api/v1/admin/skills/${id}`, { method: "DELETE", auth: true }),
};

/* ------------------------------------------------------------------ */
/* Admin: services                                                      */
/* ------------------------------------------------------------------ */

export const adminServicesApi = {
  getAll: (params: { search?: string; activeOnly?: boolean; page?: number; pageSize?: number } = {}) => {
    const qs = new URLSearchParams();
    if (params.search) qs.set("search", params.search);
    if (params.activeOnly !== undefined) qs.set("activeOnly", String(params.activeOnly));
    qs.set("page", String(params.page ?? 1));
    qs.set("pageSize", String(params.pageSize ?? 50));
    return apiFetch<PagedResult<ServiceDto>>(`/api/v1/admin/services?${qs.toString()}`, { auth: true }).then(requireData);
  },
  get: (id: string) =>
    apiFetch<ServiceDto>(`/api/v1/admin/services/${id}`, { auth: true }).then(requireData),
  create: (dto: ServiceUpsertDto) =>
    apiFetch<ServiceDto>("/api/v1/admin/services", { method: "POST", body: dto, auth: true }).then(requireData),
  update: (id: string, dto: ServiceUpsertDto) =>
    apiFetch<ServiceDto>(`/api/v1/admin/services/${id}`, { method: "PUT", body: dto, auth: true }).then(requireData),
  setActive: (id: string, isActive: boolean) =>
    apiFetch<unknown>(`/api/v1/admin/services/${id}/active`, { method: "PATCH", body: isActive, auth: true }),
  reorder: (orderedIds: string[]) =>
    apiFetch<unknown>("/api/v1/admin/services/reorder", { method: "PUT", body: orderedIds, auth: true }),
  remove: (id: string) =>
    apiFetch<unknown>(`/api/v1/admin/services/${id}`, { method: "DELETE", auth: true }),
};

/* ------------------------------------------------------------------ */
/* Admin: projects                                                      */
/* ------------------------------------------------------------------ */

export const adminProjectsApi = {
  getAll: (params: { search?: string; publishedOnly?: boolean; featuredOnly?: boolean; page?: number; pageSize?: number } = {}) => {
    const qs = new URLSearchParams();
    if (params.search) qs.set("search", params.search);
    if (params.publishedOnly !== undefined) qs.set("publishedOnly", String(params.publishedOnly));
    if (params.featuredOnly !== undefined) qs.set("featuredOnly", String(params.featuredOnly));
    qs.set("page", String(params.page ?? 1));
    qs.set("pageSize", String(params.pageSize ?? 50));
    return apiFetch<PagedResult<ProjectDto>>(`/api/v1/admin/projects?${qs.toString()}`, { auth: true }).then(requireData);
  },
  get: (id: string) =>
    apiFetch<ProjectDto>(`/api/v1/admin/projects/${id}`, { auth: true }).then(requireData),
  getBySlug: (slug: string) =>
    apiFetch<ProjectDto>(`/api/v1/admin/projects/by-slug/${encodeURIComponent(slug)}`, { auth: true }).then(requireData),
  create: (dto: ProjectUpsertDto) =>
    apiFetch<ProjectDto>("/api/v1/admin/projects", { method: "POST", body: dto, auth: true }).then(requireData),
  update: (id: string, dto: ProjectUpsertDto) =>
    apiFetch<ProjectDto>(`/api/v1/admin/projects/${id}`, { method: "PUT", body: dto, auth: true }).then(requireData),
  setPublished: (id: string, isPublished: boolean) =>
    apiFetch<unknown>(`/api/v1/admin/projects/${id}/publish`, { method: "PATCH", body: isPublished, auth: true }),
  setFeatured: (id: string, isFeatured: boolean) =>
    apiFetch<unknown>(`/api/v1/admin/projects/${id}/feature`, { method: "PATCH", body: isFeatured, auth: true }),
  reorder: (orderedIds: string[]) =>
    apiFetch<unknown>("/api/v1/admin/projects/reorder", { method: "PUT", body: orderedIds, auth: true }),
  remove: (id: string) =>
    apiFetch<unknown>(`/api/v1/admin/projects/${id}`, { method: "DELETE", auth: true }),
};

/* ------------------------------------------------------------------ */
/* Admin: experiences                                                   */
/* ------------------------------------------------------------------ */

export const adminExperiencesApi = {
  getAll: (params: { search?: string; page?: number; pageSize?: number } = {}) => {
    const qs = new URLSearchParams();
    if (params.search) qs.set("search", params.search);
    qs.set("page", String(params.page ?? 1));
    qs.set("pageSize", String(params.pageSize ?? 50));
    return apiFetch<PagedResult<ExperienceDto>>(`/api/v1/admin/experiences?${qs.toString()}`, { auth: true }).then(requireData);
  },
  get: (id: string) =>
    apiFetch<ExperienceDto>(`/api/v1/admin/experiences/${id}`, { auth: true }).then(requireData),
  create: (dto: ExperienceUpsertDto) =>
    apiFetch<ExperienceDto>("/api/v1/admin/experiences", { method: "POST", body: dto, auth: true }).then(requireData),
  update: (id: string, dto: ExperienceUpsertDto) =>
    apiFetch<ExperienceDto>(`/api/v1/admin/experiences/${id}`, { method: "PUT", body: dto, auth: true }).then(requireData),
  reorder: (orderedIds: string[]) =>
    apiFetch<unknown>("/api/v1/admin/experiences/reorder", { method: "PUT", body: orderedIds, auth: true }),
  remove: (id: string) =>
    apiFetch<unknown>(`/api/v1/admin/experiences/${id}`, { method: "DELETE", auth: true }),
};

/* ------------------------------------------------------------------ */
/* Admin: educations                                                    */
/* ------------------------------------------------------------------ */

export const adminEducationsApi = {
  getAll: (params: { search?: string; page?: number; pageSize?: number } = {}) => {
    const qs = new URLSearchParams();
    if (params.search) qs.set("search", params.search);
    qs.set("page", String(params.page ?? 1));
    qs.set("pageSize", String(params.pageSize ?? 50));
    return apiFetch<PagedResult<EducationDto>>(`/api/v1/admin/educations?${qs.toString()}`, { auth: true }).then(requireData);
  },
  get: (id: string) =>
    apiFetch<EducationDto>(`/api/v1/admin/educations/${id}`, { auth: true }).then(requireData),
  create: (dto: EducationUpsertDto) =>
    apiFetch<EducationDto>("/api/v1/admin/educations", { method: "POST", body: dto, auth: true }).then(requireData),
  update: (id: string, dto: EducationUpsertDto) =>
    apiFetch<EducationDto>(`/api/v1/admin/educations/${id}`, { method: "PUT", body: dto, auth: true }).then(requireData),
  reorder: (orderedIds: string[]) =>
    apiFetch<unknown>("/api/v1/admin/educations/reorder", { method: "PUT", body: orderedIds, auth: true }),
  remove: (id: string) =>
    apiFetch<unknown>(`/api/v1/admin/educations/${id}`, { method: "DELETE", auth: true }),
};

/* ------------------------------------------------------------------ */
/* Admin: social links                                                  */
/* ------------------------------------------------------------------ */

export const adminSocialLinksApi = {
  getAll: (params: { search?: string; activeOnly?: boolean; page?: number; pageSize?: number } = {}) => {
    const qs = new URLSearchParams();
    if (params.search) qs.set("search", params.search);
    if (params.activeOnly !== undefined) qs.set("activeOnly", String(params.activeOnly));
    qs.set("page", String(params.page ?? 1));
    qs.set("pageSize", String(params.pageSize ?? 50));
    return apiFetch<PagedResult<SocialLinkDto>>(`/api/v1/admin/social-links?${qs.toString()}`, { auth: true }).then(requireData);
  },
  get: (id: string) =>
    apiFetch<SocialLinkDto>(`/api/v1/admin/social-links/${id}`, { auth: true }).then(requireData),
  create: (dto: SocialLinkUpsertDto) =>
    apiFetch<SocialLinkDto>("/api/v1/admin/social-links", { method: "POST", body: dto, auth: true }).then(requireData),
  update: (id: string, dto: SocialLinkUpsertDto) =>
    apiFetch<SocialLinkDto>(`/api/v1/admin/social-links/${id}`, { method: "PUT", body: dto, auth: true }).then(requireData),
  setActive: (id: string, isActive: boolean) =>
    apiFetch<unknown>(`/api/v1/admin/social-links/${id}/active`, { method: "PATCH", body: isActive, auth: true }),
  reorder: (orderedIds: string[]) =>
    apiFetch<unknown>("/api/v1/admin/social-links/reorder", { method: "PUT", body: orderedIds, auth: true }),
  remove: (id: string) =>
    apiFetch<unknown>(`/api/v1/admin/social-links/${id}`, { method: "DELETE", auth: true }),
};

/* ------------------------------------------------------------------ */
/* Admin: messages                                                      */
/* ------------------------------------------------------------------ */

export const adminMessagesApi = {
  getAll: (params: { unreadOnly?: boolean; page?: number; pageSize?: number } = {}) => {
    const qs = new URLSearchParams();
    if (params.unreadOnly !== undefined) qs.set("unreadOnly", String(params.unreadOnly));
    qs.set("page", String(params.page ?? 1));
    qs.set("pageSize", String(params.pageSize ?? 50));
    return apiFetch<PagedResult<ContactMessageDto>>(`/api/v1/admin/messages?${qs.toString()}`, { auth: true }).then(requireData);
  },
  get: (id: string) =>
    apiFetch<ContactMessageDto>(`/api/v1/admin/messages/${id}`, { auth: true }).then(requireData),
  markRead: (id: string, isRead: boolean) =>
    apiFetch<unknown>(`/api/v1/admin/messages/${id}/read`, { method: "PATCH", body: isRead, auth: true }),
  remove: (id: string) =>
    apiFetch<unknown>(`/api/v1/admin/messages/${id}`, { method: "DELETE", auth: true }),
};

/* ------------------------------------------------------------------ */
/* Admin: media                                                         */
/* ------------------------------------------------------------------ */

export const adminMediaApi = {
  getAll: (params: { search?: string; fileType?: string; page?: number; pageSize?: number } = {}) => {
    const qs = new URLSearchParams();
    if (params.search) qs.set("search", params.search);
    if (params.fileType) qs.set("fileType", params.fileType);
    qs.set("page", String(params.page ?? 1));
    qs.set("pageSize", String(params.pageSize ?? 50));
    return apiFetch<PagedResult<MediaItemDto>>(`/api/v1/admin/media?${qs.toString()}`, { auth: true }).then(requireData);
  },
  get: (id: string) =>
    apiFetch<MediaItemDto>(`/api/v1/admin/media/${id}`, { auth: true }).then(requireData),
  upload: (file: File, altText?: string, folder?: string) => {
    const fd = new FormData();
    fd.append("file", file);
    if (altText) fd.append("altText", altText);
    if (folder) fd.append("folder", folder);
    return apiFetch<MediaItemDto>("/api/v1/admin/media/upload", { method: "POST", formData: fd, auth: true }).then(requireData);
  },
  updateMetadata: (id: string, altText: string | null, folder: string | null) =>
    apiFetch<MediaItemDto>(`/api/v1/admin/media/${id}/metadata`, {
      method: "PUT",
      body: { altText, folder },
      auth: true,
    }).then(requireData),
  replace: (id: string, file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    return apiFetch<MediaItemDto>(`/api/v1/admin/media/${id}/replace`, { method: "POST", formData: fd, auth: true }).then(requireData);
  },
  remove: (id: string) =>
    apiFetch<unknown>(`/api/v1/admin/media/${id}`, { method: "DELETE", auth: true }),
};

/* ------------------------------------------------------------------ */
/* Admin: dashboard                                                     */
/* ------------------------------------------------------------------ */

export const adminDashboardApi = {
  stats: () =>
    apiFetch<DashboardStatsDto>("/api/v1/admin/dashboard/stats", { auth: true }).then(requireData),
};

/* ------------------------------------------------------------------ */
/* Helper                                                               */
/* ------------------------------------------------------------------ */

async function requireData<T>(body: ApiResponse<T>): Promise<T> {
  if (!body.success || body.data === null || body.data === undefined) {
    throw new ApiError(500, body.message ?? "API returned no data.");
  }
  return body.data;
}

/**
 * Resolve a URL from API data for use in the browser.
 * API-hosted uploads come back as "/uploads/..." (root-relative to the API
 * origin) and are rewritten to an absolute URL. Other root-relative paths
 * (e.g. "/images/...", which live in the frontend's public dir) are kept as-is.
 */
export function resolveAssetUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/uploads")) return `${API_BASE_URL}${url}`;
  return url;
}

/** Human-readable file size. */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
