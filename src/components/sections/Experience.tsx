"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import type { ExperienceDto } from "@/lib/api";
import { useTypographyResolver } from "@/components/typography/TypographyProvider";
import { useSiteCopy } from "@/components/sitecopy/SiteCopyProvider";
import { DEFAULT_EXPERIENCES } from "@/lib/contentDefaults";

interface ExperienceEntry {
  year: string;
  role: string;
  desc: string;
}

interface ExperienceProps {
  experiences?: ExperienceDto[];
}

export default function Experience({ experiences }: ExperienceProps) {
  const typography = useTypographyResolver();
  const copy = useSiteCopy();
  const containerRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const data: ExperienceEntry[] =
    experiences && experiences.length > 0
      ? experiences.map((e) => ({
          year: e.year,
          role: e.role,
          desc: e.description ?? "",
        }))
      : DEFAULT_EXPERIENCES.map((e) => ({
          year: e.year,
          role: e.role,
          desc: e.description ?? "",
        }));

  useGSAP(() => {
    if (!containerRef.current || !lineRef.current || !progressRef.current) return;

    // Timeline progress animation
    gsap.to(progressRef.current, {
      scaleY: 1,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top center",
        end: "bottom center",
        scrub: true,
      }
    });

    // Fade in timeline items
    const items = gsap.utils.toArray<HTMLElement>('.timeline-item');
    items.forEach((item: HTMLElement) => {
      gsap.from(item, {
        opacity: 0,
        x: -50,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: item,
          start: "top 80%",
        }
      });
    });

  }, { scope: containerRef });

  return (
    <section id="experience" ref={containerRef} className="w-full py-32 md:py-48 px-4 md:px-12 lg:px-24 bg-surface text-foreground">
      <div className="max-w-4xl mx-auto w-full">
        
        {/* Header */}
        <div className="flex flex-col gap-4 mb-24 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4">
            <span className="text-electric font-bold tracking-widest text-sm" style={typography("experience.number")}>{copy.experience.number}</span>
            <span className="tracking-[0.2em] uppercase text-xs font-bold text-secondary" style={typography("experience.label")}>{copy.experience.label}</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight uppercase" style={typography("experience.title")}>
            {copy.experience.heading.split("\n").map((line, i) => (
              <span key={i}>
                {i > 0 && <br />}
                <span className={i % 2 === 1 ? "text-secondary" : undefined}>{line}</span>
              </span>
            ))}
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative pl-8 md:pl-0">
          
          {/* Main Line Background */}
          <div 
            ref={lineRef}
            className="absolute left-[15px] md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-[2px] bg-border"
          >
            {/* Progress Line */}
            <div 
              ref={progressRef}
              className="absolute top-0 left-0 w-full bg-electric origin-top"
              style={{ transform: "scaleY(0)" }}
            />
          </div>

          <div className="flex flex-col gap-16 md:gap-32 py-12">
            {data.map((exp, i) => {
              const isEven = i % 2 === 0;
              return (
                <div key={i} className="timeline-item relative flex flex-col md:flex-row items-start justify-between w-full">
                  
                  {/* Dot */}
                  <div className="absolute left-[-15px] md:left-1/2 md:-translate-x-1/2 mt-[6px] md:mt-2 w-4 h-4 rounded-full bg-surface border-2 border-electric z-10" />

                  {/* Desktop Layout: Alternate sides */}
                  <div className={`hidden md:flex w-full ${isEven ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className="w-[45%] flex flex-col gap-4 text-right pr-12">
                      <span className="text-sm font-bold tracking-widest text-electric uppercase" style={typography("experience.year")}>{exp.year}</span>
                      <h3 className="font-display text-2xl font-bold" style={typography("experience.jobTitle")}>{exp.role}</h3>
                    </div>
                    <div className="w-[10%]" /> {/* Spacer for line */}
                    <div className="w-[45%] pl-12 pt-1 text-left">
                      <p className="text-secondary leading-relaxed" style={typography("experience.description")}>{exp.desc}</p>
                    </div>
                  </div>

                  {/* Mobile Layout: Left aligned */}
                  <div className="md:hidden w-full pl-8 flex flex-col gap-3">
                    <span className="text-xs font-bold tracking-widest text-electric uppercase" style={typography("experience.year")}>{exp.year}</span>
                    <h3 className="font-display text-xl font-bold" style={typography("experience.jobTitle")}>{exp.role}</h3>
                    <p className="text-secondary text-sm leading-relaxed" style={typography("experience.description")}>{exp.desc}</p>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
