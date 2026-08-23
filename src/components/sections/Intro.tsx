"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useTypographyResolver } from "@/components/typography/TypographyProvider";
import { useSiteCopy } from "@/components/sitecopy/SiteCopyProvider";
import { NameToken } from "@/components/sitecopy/Tokens";
import { DEFAULT_HERO_NAME } from "@/lib/contentDefaults";

interface IntroProps {
  name?: string;
}

export default function Intro({ name }: IntroProps) {
  const typography = useTypographyResolver();
  const copy = useSiteCopy();
  const personName = name ?? DEFAULT_HERO_NAME;
  const containerRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current || !textRef.current) return;

    const lines = gsap.utils.toArray('.intro-line');

    gsap.from(lines, {
      y: "100%",
      opacity: 0,
      stagger: 0.15,
      duration: 1.5,
      ease: "power4.out",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 75%",
      }
    });

    // Subtle parallax on the large text block
    gsap.to(textRef.current, {
      y: -80,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });
  }, { scope: containerRef });

  return (
    <section id="intro" ref={containerRef} className="w-full min-h-screen flex flex-col justify-center py-32 px-4 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto w-full">
        <div ref={textRef} className="flex flex-col mb-24 md:mb-32 font-display font-bold text-6xl md:text-[8rem] lg:text-[10rem] xl:text-[12rem] leading-[0.85] tracking-tighter uppercase" style={typography("intro.heading")}>
          <div className="overflow-hidden pb-4">
            <span className="intro-line block text-secondary hover:text-electric transition-colors duration-500 cursor-default" data-cursor={copy.globalUi.cursorDesign}>{copy.intro.line1}</span>
          </div>
          <div className="overflow-hidden pb-4">
            <span className="intro-line block text-secondary hover:text-electric transition-colors duration-500 cursor-default" data-cursor={copy.globalUi.cursorBuild}>{copy.intro.line2}</span>
          </div>
          <div className="overflow-hidden pb-4">
            <span className="intro-line block text-foreground hover:text-electric transition-colors duration-500 cursor-default" data-cursor={copy.globalUi.cursorCreate}>{copy.intro.line3}</span>
          </div>
        </div>

        <div className="max-w-3xl ml-auto mt-12 md:mt-24">
          <p className="text-xl md:text-3xl lg:text-4xl leading-tight text-secondary font-medium" style={typography("intro.body")}>
            <NameToken text={copy.intro.body} name={personName} />
          </p>
        </div>
      </div>
    </section>
  );
}
