"use client";

import { useRef } from "react";
import { type ProjectDto } from "@/lib/api";
import { useTypographyResolver } from "@/components/typography/TypographyProvider";
import { useSiteCopy } from "@/components/sitecopy/SiteCopyProvider";
import { DEFAULT_PROJECTS } from "@/lib/contentDefaults";
import ProjectCard from "@/components/work/ProjectCard";

interface WorkProps {
  projects?: ProjectDto[];
}

export default function Work({ projects }: WorkProps) {
  const typography = useTypographyResolver();
  const copy = useSiteCopy();
  const containerRef = useRef<HTMLElement>(null);

  const data = projects && projects.length > 0 ? projects : DEFAULT_PROJECTS;

  return (
    <section id="work" ref={containerRef} className="w-full py-32 md:py-48 px-4 md:px-12 lg:px-24 bg-background text-foreground">
      <div className="max-w-7xl mx-auto w-full">

        {/* Header */}
        <div className="flex flex-col gap-4 mb-24">
          <div className="flex items-center gap-4">
            <span className="text-electric font-bold tracking-widest text-sm" style={typography("work.number")}>{copy.work.number}</span>
            <span className="tracking-[0.2em] uppercase text-xs font-bold text-secondary" style={typography("work.label")}>{copy.work.label}</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight uppercase" style={typography("work.title")}>
            {copy.work.heading.split("\n").map((line, i) => (
              <span key={i}>
                {i > 0 && <br />}
                <span className={i % 2 === 1 ? "text-secondary" : undefined}>{line}</span>
              </span>
            ))}
          </h2>
        </div>

        {/* Project List */}
        <div className="flex flex-col gap-32 md:gap-48 mt-16">
          {data.map((project, i) => (
            <ProjectCard key={project.slug || project.id || i} project={project} index={i} />
          ))}
        </div>

      </div>
    </section>
  );
}
