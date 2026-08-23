"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { ProjectDto } from "@/lib/api";
import { useTypographyResolver } from "@/components/typography/TypographyProvider";
import { useSiteCopy } from "@/components/sitecopy/SiteCopyProvider";
import { DEFAULT_PORTRAIT } from "@/lib/contentDefaults";
import { resolveAssetUrl } from "@/lib/api";

interface ProjectCardProps {
  project: Pick<ProjectDto, "slug" | "title" | "category" | "technologies" | "thumbnail" | "featuredImage">;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const typography = useTypographyResolver();
  const copy = useSiteCopy();

  const number = String(index + 1).padStart(2, "0");
  const image =
    resolveAssetUrl(project.thumbnail ?? project.featuredImage) ?? DEFAULT_PORTRAIT;
  const isEven = index % 2 === 0;

  return (
    <div className={cn("group flex flex-col gap-8 md:gap-16 relative", isEven ? "md:flex-row" : "md:flex-row-reverse")}>

      {/* Image Container */}
      <Link
        href={`/work/${project.slug}`}
        className="w-full md:w-[60%] aspect-[4/3] relative overflow-hidden rounded-sm"
        data-cursor={copy.globalUi.cursorView}
      >
        <div className="absolute inset-0 bg-surface/20 z-10 pointer-events-none group-hover:bg-transparent transition-colors duration-500" />
        <Image
          src={image}
          alt={project.title}
          fill
          className="object-cover transform group-hover:scale-105 transition-transform duration-[1.5s] ease-out"
          sizes="(max-width: 768px) 100%, 60vw"
        />
      </Link>

      {/* Content */}
      <div className="w-full md:w-[40%] flex flex-col justify-center">
        <div className="flex flex-col gap-6 relative">
          <span className="font-display text-2xl text-secondary group-hover:text-electric transition-colors duration-500">
            {number}
          </span>

          <h3 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight group-hover:translate-x-4 transition-transform duration-500 ease-out" style={typography("work.card.title")}>
            {project.title}
          </h3>

          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-sm font-bold tracking-widest text-electric uppercase" style={typography("work.card.category")}>
              {project.category}
            </span>
            <span className="text-secondary/50 hidden md:block">{copy.work.separator}</span>
            {project.technologies.map(tech => (
              <span key={tech} className="text-sm font-bold tracking-widest text-secondary uppercase" style={typography("work.card.technologies")}>
                {tech}
              </span>
            ))}
          </div>

          <div className="mt-8">
            <Link
              href={`/work/${project.slug}`}
              className="inline-flex items-center gap-4 text-sm font-bold tracking-widest uppercase hover:text-electric transition-colors duration-300"
              style={typography("work.card.link")}
            >
              <span className="border-b border-current pb-1">{copy.work.viewProjectLabel}</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
