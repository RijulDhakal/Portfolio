"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import type { EducationDto } from "@/lib/api";
import { useTypographyResolver } from "@/components/typography/TypographyProvider";
import { useSiteCopy } from "@/components/sitecopy/SiteCopyProvider";
import { DEFAULT_EDUCATION } from "@/lib/contentDefaults";

interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startYear: string;
  endYear: string;
  desc: string;
}

interface EducationProps {
  educations?: EducationDto[];
}

export default function Education({ educations }: EducationProps) {
  const typography = useTypographyResolver();
  const copy = useSiteCopy();
  const containerRef = useRef<HTMLElement>(null);

  const data: EducationEntry[] =
    educations && educations.length > 0
      ? educations.map((e) => ({
          id: e.id,
          institution: e.institution,
          degree: e.degree,
          field: e.field ?? "",
          startYear: e.startYear ?? "",
          endYear: e.endYear ?? "",
          desc: e.description ?? "",
        }))
      : DEFAULT_EDUCATION.map((e) => ({
          id: e.id,
          institution: e.institution,
          degree: e.degree,
          field: e.field ?? "",
          startYear: e.startYear ?? "",
          endYear: e.endYear ?? "",
          desc: e.description ?? "",
        }));

  useGSAP(() => {
    if (!containerRef.current) return;

    gsap.from(".edu-block", {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 75%",
      }
    });

  }, { scope: containerRef });

  return (
    <section id="education" ref={containerRef} className="w-full py-32 px-4 md:px-12 lg:px-24 bg-background text-foreground">
      <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row gap-16 md:gap-24">
        
        {/* Header */}
        <div className="w-full md:w-1/3 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <span className="text-electric font-bold tracking-widest text-sm" style={typography("education.number")}>{copy.education.number}</span>
            <span className="tracking-[0.2em] uppercase text-xs font-bold text-secondary" style={typography("education.label")}>{copy.education.label}</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight uppercase" style={typography("education.title")}>
            {copy.education.heading.split("\n").map((line, i) => (
              <span key={i}>
                {i > 0 && <br />}
                <span className={i % 2 === 1 ? "text-secondary" : undefined}>{line}</span>
              </span>
            ))}
          </h2>
        </div>

        {/* Content */}
        <div className="w-full md:w-2/3 flex flex-col gap-12 pt-4 border-t md:border-t-0 border-border">
          {data.map((edu) => (
            <div key={edu.id} className="edu-block flex flex-col gap-8 p-8 md:p-12 border border-border bg-surface/30 rounded-2xl hover:border-electric/30 transition-colors duration-500">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col gap-2">
                  <h3 className="font-display text-2xl md:text-4xl font-bold text-foreground" style={typography("education.degree")}>
                    {edu.degree} {copy.education.ofConnector} <span className="text-electric">{edu.field}</span>
                  </h3>
                  <span className="text-lg text-secondary font-medium tracking-wide" style={typography("education.institution")}>
                    {edu.institution}
                  </span>
                </div>
                <div className="flex items-center gap-3 bg-surface border border-border px-4 py-2 rounded-full self-start" style={typography("education.years")}>
                  <span className="text-sm font-bold text-foreground">{edu.startYear}</span>
                  <span className="text-electric">{copy.education.dash}</span>
                  <span className="text-sm font-bold text-foreground">{edu.endYear}</span>
                </div>
              </div>

              <p className="text-secondary leading-relaxed max-w-2xl" style={typography("education.description")}>
                {edu.desc}
              </p>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
