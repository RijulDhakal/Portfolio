"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useTypographyResolver } from "@/components/typography/TypographyProvider";
import { useSiteCopy } from "@/components/sitecopy/SiteCopyProvider";
import { HighlightToken } from "@/components/sitecopy/Tokens";

export default function Personal() {
  const typography = useTypographyResolver();
  const copy = useSiteCopy();
  const containerRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const marqueeItems: string[] = [];
  copy.personal.marqueeWords.forEach((word, idx) => {
    if (idx === copy.personal.marqueeWords.length - 1) {
      marqueeItems.push(word);
    } else {
      marqueeItems.push(word, copy.personal.marqueeSeparator);
    }
  });
  marqueeItems.push(copy.personal.marqueeSeparator);
  copy.personal.marqueeWords.slice(0, -1).forEach((word, idx) => {
    marqueeItems.push(word);
    if (idx < copy.personal.marqueeWords.length - 2) {
      marqueeItems.push(copy.personal.marqueeSeparator);
    }
  });

  useGSAP(() => {
    if (!containerRef.current || !textRef.current) return;

    gsap.to(textRef.current, {
      xPercent: -30,
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
    <section ref={containerRef} className="w-full py-32 md:py-48 px-4 bg-electric text-background overflow-hidden flex flex-col items-center justify-center text-center">
      <h2 className="text-sm font-bold tracking-[0.3em] uppercase mb-16 border-b border-background/20 pb-4" style={typography("personal.label")}>
        {copy.personal.label}
      </h2>
      
      <div className="w-full overflow-visible flex whitespace-nowrap mb-16 md:mb-24 px-4">
        <div ref={textRef} className="font-display font-bold text-[15vw] leading-none tracking-tighter uppercase flex gap-8 md:gap-16 will-change-transform" style={typography("personal.heading")}>
          {marqueeItems.map((item, i) =>
            i % 2 === 1 ? (
              <span key={i} className="text-background/30">{item}</span>
            ) : (
              <span key={i}>{item}</span>
            )
          )}
        </div>
      </div>

      <p className="max-w-3xl text-xl md:text-3xl lg:text-4xl font-medium leading-tight" style={typography("personal.body")}>
        <HighlightToken text={copy.personal.body} />
      </p>
    </section>
  );
}
