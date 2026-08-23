"use client";

import Link from "next/link";
import Image from "next/image";
import { resolveAssetUrl, type ProjectDto } from "@/lib/api";
import { useTypographyResolver } from "@/components/typography/TypographyProvider";
import { useSiteCopy } from "@/components/sitecopy/SiteCopyProvider";

// Project links are external by contract; anything that is not an absolute
// http(s) URL is refused at render time as defense in depth against
// javascript:/data: injection through stale or hand-edited data.
const EXTERNAL_URL_PATTERN = /^https?:\/\//i;

interface ProjectDetailProps {
  project: ProjectDto;
  number: number;
  prev?: Pick<ProjectDto, "slug" | "title">;
  next?: Pick<ProjectDto, "slug" | "title">;
}

function SectionHeader({ index, label }: { index: string; label: string }) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <span className="text-electric font-bold tracking-widest text-sm">{index}</span>
      <span className="tracking-[0.2em] uppercase text-xs font-bold text-secondary">{label}</span>
    </div>
  );
}

export default function ProjectDetail({ project, number, prev, next }: ProjectDetailProps) {
  const typography = useTypographyResolver();
  const copy = useSiteCopy();

  const heroImage =
    resolveAssetUrl(project.featuredImage ?? project.thumbnail) ??
    resolveAssetUrl(project.images[0]?.imageUrl);
  const overview = project.fullDescription ?? project.shortDescription;
  const stack = project.technologies.length > 0 ? project.technologies : null;
  const gallery = project.images.filter((image) => resolveAssetUrl(image.imageUrl));

  const meta: { label: string; value: string | null }[] = [
    { label: "Year", value: project.year },
    { label: "Role", value: project.role },
    { label: "Client", value: project.client },
    { label: "Category", value: project.category },
  ].filter((item) => item.value);

  const caseSections = [
    { label: "Problem", body: project.problem },
    { label: "Goal", body: project.goal },
    { label: "My Role", body: project.contribution },
    { label: "Process", body: project.process },
    { label: "Challenges", body: project.challenges },
    { label: "Solution", body: project.solution },
    { label: "Results", body: project.results },
  ].filter((section) => section.body);

  const linkCandidates = [
    { label: "View Live Project", url: project.liveUrl },
    { label: "GitHub", url: project.githubUrl },
    { label: "View Design", url: project.figmaUrl },
    { label: "Case Study", url: project.caseStudyUrl },
  ];
  const links = linkCandidates.filter(
    (link): link is { label: string; url: string } =>
      Boolean(link.url && EXTERNAL_URL_PATTERN.test(link.url)),
  );

  return (
    <article className="w-full bg-background text-foreground">
      {/* Header */}
      <header className="w-full pt-40 pb-16 md:pt-52 md:pb-24 px-4 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto w-full flex flex-col gap-8">
          <Link
            href="/#work"
            className="inline-flex items-center gap-3 text-sm font-bold tracking-widest uppercase text-secondary hover:text-electric transition-colors w-fit"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            All Work
          </Link>

          <div className="flex items-center gap-4">
            <span className="font-display text-2xl text-secondary">
              {String(number).padStart(2, "0")}
            </span>
            {project.category && (
              <span className="text-sm font-bold tracking-widest text-electric uppercase" style={typography("work.card.category")}>
                {project.category}
              </span>
            )}
          </div>

          <h1
            className="font-display text-4xl sm:text-5xl md:text-7xl lg:text-7xl font-bold leading-[1.05] tracking-tight uppercase"
            style={typography("work.card.title")}
          >
            {project.title}
          </h1>

          {project.shortDescription && (
            <p className="text-secondary md:text-lg max-w-2xl" style={typography("work.card.description")}>
              {project.shortDescription}
            </p>
          )}

          {meta.length > 0 && (
            <dl className="grid grid-cols-2 md:flex md:flex-wrap gap-x-16 gap-y-6 mt-6 pt-8 border-t border-border">
              {meta.map((item) => (
                <div key={item.label} className="flex flex-col gap-2">
                  <dt className="text-xs font-bold tracking-[0.2em] uppercase text-secondary">{item.label}</dt>
                  <dd className="font-display font-bold uppercase tracking-tight">{item.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </header>

      {/* Hero image */}
      {heroImage && (
        <div className="w-full px-4 md:px-12 lg:px-24">
          <div className="max-w-7xl mx-auto w-full aspect-[16/9] relative overflow-hidden rounded-sm">
            <Image
              src={heroImage}
              alt={project.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100%, 90vw"
            />
          </div>
        </div>
      )}

      {/* Body */}
      <div className="w-full py-24 md:py-32 px-4 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto w-full flex flex-col gap-24 md:gap-32">

          {(overview || stack) && (
            <section className="grid md:grid-cols-12 gap-10">
              <div className="md:col-span-4">
                <SectionHeader index="01 /" label="Overview" />
              </div>
              <div className="md:col-span-8 flex flex-col gap-10">
                {overview && (
                  <p className="text-lg md:text-xl leading-relaxed text-foreground/90">{overview}</p>
                )}
                {stack && (
                  <div className="flex flex-wrap gap-3">
                    {stack.map((tech) => (
                      <span
                        key={tech}
                        className="px-4 py-2 rounded-full border border-border bg-surface text-xs font-bold tracking-widest uppercase text-secondary"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}

          {caseSections.map((section, i) => (
            <section key={section.label} className="grid md:grid-cols-12 gap-10">
              <div className="md:col-span-4">
                <SectionHeader index={`${String(i + 2).padStart(2, "0")} /`} label={section.label} />
              </div>
              <p className="md:col-span-8 leading-relaxed text-foreground/80 whitespace-pre-line">
                {section.body}
              </p>
            </section>
          ))}

          {project.features.length > 0 && (
            <section className="grid md:grid-cols-12 gap-10">
              <div className="md:col-span-4">
                <SectionHeader
                  index={`${String(caseSections.length + 2).padStart(2, "0")} /`}
                  label="Key Features"
                />
              </div>
              <ul className="md:col-span-8 flex flex-col gap-4">
                {project.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-4 text-foreground/80">
                    <span className="mt-[0.55em] w-2 h-2 rounded-full bg-electric shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {gallery.length > 0 && (
            <section className="flex flex-col gap-10">
              <SectionHeader
                index={`${String(caseSections.length + (project.features.length > 0 ? 3 : 2)).padStart(2, "0")} /`}
                label="Screens"
              />
              <div className="grid md:grid-cols-2 gap-6 md:gap-10">
                {gallery.map((image) => (
                  <div
                    key={image.id}
                    className="aspect-[4/3] relative overflow-hidden rounded-sm bg-surface"
                  >
                    <Image
                      src={resolveAssetUrl(image.imageUrl) ?? ""}
                      alt={image.altText ?? project.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100%, 45vw"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {links.length > 0 && (
            <section className="flex flex-col gap-7 pt-10 border-t border-border">
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-secondary">
                Project Links
              </span>
              <div className="flex flex-wrap gap-x-12 gap-y-6">
                {links.map((link) => (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor={copy.globalUi.cursorView}
                    className="group inline-flex items-center gap-2 pb-2 border-b border-border text-sm md:text-base font-bold uppercase tracking-[0.15em] text-secondary hover:text-electric hover:border-electric/60 transition-colors duration-300 whitespace-nowrap"
                  >
                    {link.label}
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    >
                      <path d="M7 17L17 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8 7H17V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Prev / Next */}
      {(prev || next) && (
        <nav className="w-full border-t border-border grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
          {prev ? (
            <Link
              href={`/work/${prev.slug}`}
              className="group flex flex-col gap-3 px-4 md:px-12 lg:px-24 py-12 md:py-16 hover:bg-surface/40 transition-colors"
            >
              <span className="inline-flex items-center gap-3 text-xs font-bold tracking-[0.2em] uppercase text-secondary group-hover:text-electric transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Previous Project
              </span>
              <span className="font-display text-2xl md:text-4xl font-bold uppercase tracking-tight group-hover:translate-x-2 transition-transform duration-500">
                {prev.title}
              </span>
            </Link>
          ) : (
            <div className="hidden md:block" />
          )}
          {next && (
            <Link
              href={`/work/${next.slug}`}
              className="group flex flex-col gap-3 items-start md:items-end px-4 md:px-12 lg:px-24 py-12 md:py-16 hover:bg-surface/40 transition-colors"
            >
              <span className="inline-flex items-center gap-3 text-xs font-bold tracking-[0.2em] uppercase text-secondary group-hover:text-electric transition-colors">
                Next Project
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <span className="font-display text-2xl md:text-4xl font-bold uppercase tracking-tight text-right group-hover:-translate-x-2 transition-transform duration-500">
                {next.title}
              </span>
            </Link>
          )}
        </nav>
      )}
    </article>
  );
}
