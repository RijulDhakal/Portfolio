"use client";

import { useRef } from "react";
import type { ServiceDto } from "@/lib/api";
import { useTypographyResolver } from "@/components/typography/TypographyProvider";
import { useSiteCopy } from "@/components/sitecopy/SiteCopyProvider";
import { DEFAULT_SERVICES } from "@/lib/contentDefaults";

interface ServiceEntry {
  id: string;
  title: string;
  features: string[];
  desc: string;
}

interface ServicesProps {
  services?: ServiceDto[];
}

export default function Services({ services }: ServicesProps) {
  const typography = useTypographyResolver();
  const copy = useSiteCopy();
  const containerRef = useRef<HTMLElement>(null);

  const data: ServiceEntry[] =
    services && services.length > 0
      ? services.map((s, i) => ({
          id: String(i + 1).padStart(2, "0"),
          title: s.title,
          features: s.features,
          desc: s.description ?? "",
        }))
      : DEFAULT_SERVICES.map((s, i) => ({
          id: String(i + 1).padStart(2, "0"),
          title: s.title,
          features: s.features,
          desc: s.description ?? "",
        }));

  return (
    <section id="services" ref={containerRef} className="w-full py-32 md:py-48 px-4 md:px-12 lg:px-24 bg-surface text-foreground">
      <div className="max-w-7xl mx-auto w-full">
        
        {/* Header */}
        <div className="flex flex-col gap-4 mb-24">
          <div className="flex items-center gap-4">
            <span className="text-electric font-bold tracking-widest text-sm" style={typography("services.number")}>{copy.services.number}</span>
            <span className="tracking-[0.2em] uppercase text-xs font-bold text-secondary" style={typography("services.label")}>{copy.services.label}</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight uppercase" style={typography("services.title")}>
            {copy.services.heading.split("\n").map((line, i) => (
              <span key={i}>
                {i > 0 && <br />}
                <span className={i % 2 === 1 ? "text-secondary" : undefined}>{line}</span>
              </span>
            ))}
          </h2>
        </div>

        {/* Services List */}
        <div className="flex flex-col border-t border-border">
          {data.map((service) => (
            <div 
              key={service.id}
              className="group relative flex flex-col md:flex-row md:items-center justify-between py-12 md:py-16 border-b border-border hover:bg-background/50 transition-colors duration-500 cursor-pointer overflow-hidden"
              data-cursor={copy.globalUi.cursorExplore}
            >
              {/* Animated Accent Line */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-electric transform -translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
              
              {/* Left: Number & Title */}
              <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-16 pl-6 md:pl-12 relative z-10 w-full md:w-1/2">
                <span className="font-display font-bold text-3xl md:text-5xl text-secondary group-hover:-translate-y-2 group-hover:text-electric transition-all duration-500">
                  {service.id}
                </span>
                <h3 className="font-display font-bold text-3xl md:text-4xl tracking-tight group-hover:translate-x-4 transition-transform duration-500" style={typography("services.card.title")}>
                  {service.title}
                </h3>
              </div>

              {/* Right: Features & Desc */}
              <div className="flex flex-col gap-6 pl-6 md:pl-0 mt-8 md:mt-0 relative z-10 w-full md:w-1/2 md:pr-12">
                <div className="flex flex-wrap gap-2">
                  {service.features.map(feature => (
                    <span key={feature} className="text-xs font-bold tracking-widest text-secondary uppercase px-3 py-1 rounded-full border border-border bg-surface group-hover:border-electric/30 transition-colors duration-500" style={typography("services.card.feature")}>
                      {feature}
                    </span>
                  ))}
                </div>
                
                <p className="text-secondary text-lg md:text-xl leading-relaxed opacity-60 md:opacity-0 md:transform md:translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100" style={typography("services.card.description")}>
                  {service.desc}
                </p>
              </div>

              {/* Arrow Indicator (Mobile/Desktop) */}
              <div className="hidden md:flex absolute right-12 top-1/2 -translate-y-1/2 opacity-0 -translate-x-8 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-electric">
                  <path d="M8.33331 20H31.6666" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21.6666 10L31.6666 20L21.6666 30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
