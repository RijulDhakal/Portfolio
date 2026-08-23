import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PublicShell from "@/components/layout/PublicShell";
import ProjectDetail from "@/components/work/ProjectDetail";
import { publicApi, type ProjectDto } from "@/lib/api";
import { getSiteChrome } from "@/lib/content";
import { DEFAULT_META_TITLE } from "@/lib/contentDefaults";

export const dynamic = "force-dynamic";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

async function loadProject(slug: string) {
  const [project, all] = await Promise.all([
    publicApi.projectBySlug(slug).catch(() => null),
    publicApi.projects().catch(() => [] as ProjectDto[]),
  ]);

  if (!project) return null;

  const index = all.findIndex((item) => item.slug === project.slug);
  const prev = index > 0 ? all[index - 1] : all.length > 1 ? all[all.length - 1] : undefined;
  const next =
    index >= 0 && index < all.length - 1
      ? all[index + 1]
      : all.length > 1
        ? all[0]
        : undefined;

  return {
    project,
    number: index >= 0 ? index + 1 : 1,
    prev: prev && prev.slug !== project.slug ? prev : undefined,
    next: next && next.slug !== project.slug ? next : undefined,
  };
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const [data, chrome] = await Promise.all([loadProject(slug), getSiteChrome()]);

  if (!data) return { title: `Project Not Found — ${chrome.settings?.siteName ?? DEFAULT_META_TITLE}` };

  const siteName = chrome.settings?.siteName ?? DEFAULT_META_TITLE.split("—")[0].trim();
  const description =
    data.project.shortDescription ??
    data.project.fullDescription ??
    undefined;
  const ogImage =
    data.project.thumbnail ?? data.project.featuredImage ?? undefined;

  return {
    title: `${data.project.title} — ${siteName}`,
    description,
    openGraph: {
      title: `${data.project.title} — ${siteName}`,
      description,
      images: ogImage ? [{ url: ogImage }] : undefined,
      type: "article",
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const [data, chrome] = await Promise.all([loadProject(slug), getSiteChrome()]);

  if (!data) notFound();

  return (
    <PublicShell chrome={chrome}>
      <ProjectDetail
        project={data.project}
        number={data.number}
        prev={data.prev}
        next={data.next}
      />
    </PublicShell>
  );
}
