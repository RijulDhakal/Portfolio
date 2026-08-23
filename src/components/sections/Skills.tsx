"use client";

import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import type { SkillDto } from "@/lib/api";
import { useTypographyResolver } from "@/components/typography/TypographyProvider";
import { useSiteCopy } from "@/components/sitecopy/SiteCopyProvider";
import { DEFAULT_SKILLS } from "@/lib/contentDefaults";

interface SkillEntry {
  name: string;
  category: string;
  desc: string;
  left: string;
  top: string;
}

interface SkillsProps {
  skills?: SkillDto[];
}

export default function Skills({ skills }: SkillsProps) {
  const typography = useTypographyResolver();
  const copy = useSiteCopy();
  const skillData: SkillEntry[] =
    skills && skills.length > 0
      ? skills.map((s) => ({
          name: s.name,
          category: s.category,
          desc: s.description ?? "",
          left: s.positionX ?? "50%",
          top: s.positionY ?? "50%",
        }))
      : DEFAULT_SKILLS.map((s) => ({
          name: s.name,
          category: s.category,
          desc: s.description ?? "",
          left: s.positionX ?? "50%",
          top: s.positionY ?? "50%",
        }));

  const preferredCategories = ["DEVELOPMENT", "UI / UX", "BUSINESS"];
  const categories = Array.from(new Set(skillData.map((s) => s.category))).sort(
    (a, b) => {
      const ia = preferredCategories.indexOf(a);
      const ib = preferredCategories.indexOf(b);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    }
  );

  const [hoveredSkill, setHoveredSkill] = useState<SkillEntry | null>(null);
  const containerRef = useRef<HTMLElement>(null);

  return (
    <section id="skills" ref={containerRef} className="w-full py-32 px-4 md:px-12 lg:px-24 bg-background text-foreground overflow-hidden">
      <div className="max-w-7xl mx-auto w-full">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-16 md:mb-24 relative z-20">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <span className="text-electric font-bold tracking-widest text-sm" style={typography("skills.number")}>{copy.skills.number}</span>
              <span className="tracking-[0.2em] uppercase text-xs font-bold text-secondary" style={typography("skills.label")}>{copy.skills.label}</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight uppercase" style={typography("skills.title")}>
              {copy.skills.heading.split("\n").map((line, i) => (
                <span key={i}>
                  {i > 0 && <br />}
                  <span className={i % 2 === 1 ? "text-secondary" : undefined}>{line}</span>
                </span>
              ))}
            </h2>
          </div>
        </div>

        {/* Desktop Interactive Universe */}
        <div className="hidden md:flex relative w-full aspect-square max-h-[800px] items-center justify-center">
          
          {/* Center Label */}
          <div className="absolute z-10 font-display font-bold text-3xl tracking-[0.3em] text-secondary/30 pointer-events-none" style={typography("skills.centerLabel")}>
            {copy.skills.centerLabel}
          </div>

          {/* Orbit Rings (Decorative) */}
          <div className="absolute inset-0 border border-border/30 rounded-full scale-[0.6] pointer-events-none" />
          <div className="absolute inset-0 border border-border/20 rounded-full scale-[0.8] pointer-events-none" />
          <div className="absolute inset-0 border border-border/10 rounded-full scale-[1.0] pointer-events-none" />

          {/* Skills */}
          {skillData.map((skill, i) => {
            const isHovered = hoveredSkill?.name === skill.name;
            const isOtherHovered = hoveredSkill !== null && hoveredSkill?.name !== skill.name;
            
            return (
              <div
                key={i}
                className={cn(
                  "absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 cursor-pointer",
                  isHovered ? "z-30 scale-110" : "z-20",
                  isOtherHovered ? "opacity-30 blur-[1px]" : "opacity-100"
                )}
                style={{ left: skill.left, top: skill.top }}
                onMouseEnter={() => setHoveredSkill(skill)}
                onMouseLeave={() => setHoveredSkill(null)}
                data-cursor={copy.globalUi.cursorExplore}
              >
                <span className={cn(
                  "whitespace-nowrap px-4 py-2 rounded-full border backdrop-blur-md transition-colors duration-300 font-medium text-sm",
                  isHovered 
                    ? "bg-electric border-electric text-black" 
                    : "bg-surface/50 border-border text-secondary hover:text-foreground"
                )} style={typography("skills.item")}>
                  {skill.name}
                </span>
                
                {/* Hover Description Tooltip */}
                {isHovered && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 w-48 bg-surface border border-border p-4 rounded-xl shadow-2xl animate-in fade-in zoom-in duration-300 pointer-events-none">
                    <span className="block text-[10px] font-bold tracking-widest text-electric mb-2 uppercase">{skill.category}</span>
                    <p className="text-xs text-secondary leading-relaxed">{skill.desc}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile List View */}
        <div className="flex md:hidden flex-col gap-12 mt-12">
          {categories.map((category) => (
            <div key={category} className="flex flex-col gap-6">
              <h3 className="text-sm font-bold tracking-widest text-electric uppercase border-b border-border pb-4">
                {category}
              </h3>
              <div className="flex flex-wrap gap-3">
                {skillData
                  .filter(s => s.category === category)
                  .map((skill, i) => (
                    <div key={i} className="flex flex-col gap-2 p-4 bg-surface border border-border rounded-xl">
                      <span className="font-bold text-foreground">{skill.name}</span>
                      <span className="text-xs text-secondary">{skill.desc}</span>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
