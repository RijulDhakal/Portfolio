"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import type { AboutDto } from "@/lib/api";
import { useTypographyResolver } from "@/components/typography/TypographyProvider";
import { useSiteCopy } from "@/components/sitecopy/SiteCopyProvider";
import {
  DEFAULT_ABOUT_DESCRIPTION,
  DEFAULT_ABOUT_HEADING,
  DEFAULT_STATS,
} from "@/lib/contentDefaults";

interface AboutProps {
  about?: AboutDto;
}

export default function About({ about }: AboutProps) {
  const typography = useTypographyResolver();
  const copy = useSiteCopy();
  const containerRef = useRef<HTMLElement>(null);

  const description = about?.description ?? DEFAULT_ABOUT_DESCRIPTION;
  const headingLines = (about?.heading ?? DEFAULT_ABOUT_HEADING).split("\n");

  const stats = about
    ? [
        { value: about.experienceYears, suffix: copy.about.statSuffix, label: copy.about.stat1Label },
        { value: about.projectsCompleted, suffix: copy.about.statSuffix, label: copy.about.stat2Label },
        { value: about.technologiesCount, suffix: copy.about.statSuffix, label: copy.about.stat3Label },
      ]
    : DEFAULT_STATS;

  useGSAP(() => {
    if (!containerRef.current) return;

    // Number counting animation
    const statNumbers = gsap.utils.toArray<HTMLElement>('.stat-number');
    
    statNumbers.forEach(stat => {
      const targetValue = parseInt(stat.dataset.value || "0", 10);
      
      gsap.to(stat, {
        innerHTML: targetValue,
        duration: 2.5,
        ease: "power3.out",
        snap: { innerHTML: 1 },
        onUpdate: function() {
          stat.innerHTML = Math.round(this.targets()[0].innerHTML).toString().padStart(2, '0');
        },
        scrollTrigger: {
          trigger: stat,
          start: "top 85%",
          once: true
        }
      });
    });

  }, { scope: containerRef });

  return (
    <section id="about" ref={containerRef} className="w-full py-32 md:py-48 px-4 md:px-12 lg:px-24 bg-surface text-foreground">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 md:gap-24">
        
        {/* Left Column: Heading & Intro */}
        <div className="w-full md:w-1/2 flex flex-col gap-12">
          <div className="flex items-center gap-4">
            <span className="text-electric font-bold tracking-widest text-sm" style={typography("about.number")}>{copy.about.number}</span>
            <span className="tracking-[0.2em] uppercase text-xs font-bold text-secondary" style={typography("about.label")}>{copy.about.label}</span>
          </div>

          <h2 className="font-display text-4xl md:text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight uppercase" style={typography("about.title")}>
            {headingLines.map((line, i) => (
              <span key={i} className={i % 2 === 1 ? "text-secondary" : undefined}>
                {line}
                {i < headingLines.length - 1 && <br />}
              </span>
            ))}
          </h2>
        </div>

        {/* Right Column: Bio & Stats */}
        <div className="w-full md:w-1/2 flex flex-col justify-end gap-16">
          <p className="text-lg md:text-2xl leading-relaxed text-secondary font-medium" style={typography("about.description")}>
            {description}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-12 border-t border-border">
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col gap-3">
                <div className="font-display font-bold text-5xl md:text-6xl text-foreground flex items-center" style={typography("about.statsValue")}>
                  <span className="stat-number" data-value={stat.value}>00</span>
                  <span className="text-electric">{stat.suffix}</span>
                </div>
                <span className="text-xs uppercase tracking-widest text-secondary font-bold" style={typography("about.statsLabel")}>
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
