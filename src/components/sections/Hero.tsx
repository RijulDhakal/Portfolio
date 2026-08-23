"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";
import { resolveAssetUrl, type HeroDto } from "@/lib/api";
import SmartLink, { sectionIdFromHref } from "@/components/layout/SmartLink";
import { useTypographyResolver } from "@/components/typography/TypographyProvider";
import { useSiteCopy } from "@/components/sitecopy/SiteCopyProvider";
import {
  DEFAULT_FIRST_NAME,
  DEFAULT_HERO,
  DEFAULT_LAST_NAME,
  DEFAULT_PORTRAIT,
  DEFAULT_PRIMARY_BUTTON_TEXT,
  DEFAULT_PRIMARY_BUTTON_URL,
  DEFAULT_SECONDARY_BUTTON_TEXT,
} from "@/lib/contentDefaults";

interface HeroProps {
  hero?: HeroDto;
}

export default function Hero({ hero }: HeroProps) {
  const typography = useTypographyResolver();
  const copy = useSiteCopy();
  const lenis = useLenis();
  const pathname = usePathname();
  const heroName = hero?.name ?? DEFAULT_HERO.name;
  const firstName = heroName.trim().split(/\s+/)[0] || DEFAULT_FIRST_NAME;
  const lastName = heroName.trim().split(/\s+/).slice(1).join(" ") || DEFAULT_LAST_NAME;
  const title = hero?.title ?? DEFAULT_HERO.title;
  const description = hero?.description ?? DEFAULT_HERO.description;
  const primaryText = hero?.primaryButtonText ?? DEFAULT_HERO.primaryButtonText ?? DEFAULT_PRIMARY_BUTTON_TEXT;
  const primaryUrl = resolveAssetUrl(hero?.primaryButtonUrl) ?? DEFAULT_PRIMARY_BUTTON_URL;
  const secondaryText = hero?.secondaryButtonText ?? DEFAULT_HERO.secondaryButtonText ?? DEFAULT_SECONDARY_BUTTON_TEXT;
  const secondaryUrl = resolveAssetUrl(hero?.secondaryButtonUrl) ?? resolveAssetUrl(hero?.cvFile);
  const portrait = resolveAssetUrl(hero?.profilePhoto) ?? DEFAULT_PORTRAIT;

  const [hoveredChar, setHoveredChar] = useState<string | null>(null);
  const [isHeroHovered, setIsHeroHovered] = useState(false);
  const [scrollOpacity, setScrollOpacity] = useState(1);
  const sectionRef = useRef<HTMLElement>(null);

  // Hero lives on the home page, so anchor buttons scroll in place instead of
  // relying on the browser's instant hash jump.
  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    const targetId = sectionIdFromHref(href);
    if (!targetId || pathname !== "/") return;
    e.preventDefault();
    window.history.pushState(null, "", `#${targetId}`);
    if (lenis) {
      lenis.scrollTo(`#${targetId}`, { offset: 0 });
    } else {
      document.getElementById(targetId)?.scrollIntoView({ block: "start" });
    }
  };

  // 1. Smooth scroll-fade transition as user scrolls down into the next section
  useEffect(() => {
    const handleScroll = () => {
      const h = window.innerHeight;
      const scrolled = window.scrollY;
      const fade = Math.max(0, 1 - scrolled / (h * 0.7));
      setScrollOpacity(fade);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 2. Mouse tracking for torch spotlight
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    sectionRef.current.style.setProperty('--torch-x', `${x}px`);
    sectionRef.current.style.setProperty('--torch-y', `${y}px`);
  };

  const handleMouseLeave = () => {
    setIsHeroHovered(false);
    setHoveredChar(null);
  };

  // Helper to render letter with stable color-only hover transition
  const renderLetter = (char: string, id: string) => {
    const isHovered = hoveredChar === id;
    
    return (
      <span 
        key={id} 
        className="relative inline-block pointer-events-auto cursor-default drop-shadow-xl select-none transition-colors duration-300 ease-out"
        style={{
          color: isHovered ? '#B8E600' : '#F5F5F0' // White by default, Muted Electric Lime (#B8E600) when hovered
        }}
        onMouseEnter={() => setHoveredChar(id)}
        onMouseLeave={() => setHoveredChar(null)}
      >
        {char}
      </span>
    );
  };

  return (
    <section 
      ref={sectionRef}
      id="home" 
      className="relative w-full min-h-screen min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden bg-background select-none"
      onMouseEnter={() => setIsHeroHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {/* 1. SUBTLE FILM GRAIN OVERLAY (Cinematic Tactile Dark Texture) */}
      <div 
        className="fixed inset-0 z-[2] pointer-events-none opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      {/* 2. BASE DARK PORTRAIT LAYER (Hidden Second Layer, Fades out smoothly on Scroll) */}
      <div 
        className="fixed inset-0 z-0 w-full h-screen pointer-events-none overflow-hidden flex items-center justify-center transition-opacity duration-300 ease-out"
        style={{ opacity: scrollOpacity }}
      >
        <Image 
          src={portrait}
          alt={copy.globalUi.heroImageAlt}
          fill
          unoptimized
          sizes="100%"
          className="object-contain object-center grayscale contrast-[1.1] brightness-[0.7] opacity-[0.25] pointer-events-none"
          aria-hidden="true"
          priority
        />
      </div>

      {/* 3. SHARP TORCH LIGHT REVEAL LAYER (Reveals Facial Details sharply inside 460px feathered beam) */}
      <div 
        className="fixed inset-0 z-0 w-full h-screen pointer-events-none overflow-hidden flex items-center justify-center transition-opacity duration-700 ease-out"
        style={{ 
          opacity: isHeroHovered ? scrollOpacity : 0,
          maskImage: 'radial-gradient(circle 260px at var(--torch-x, 50%) var(--torch-y, 50%), black 0%, rgba(0,0,0,0.5) 55%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(circle 260px at var(--torch-x, 50%) var(--torch-y, 50%), black 0%, rgba(0,0,0,0.5) 55%, transparent 100%)'
        }}
      >
        <Image 
          src={portrait}
          alt=""
          fill
          unoptimized
          sizes="100%"
          className="object-contain object-center grayscale contrast-[1.35] brightness-[1.05] opacity-[0.75] pointer-events-none"
          aria-hidden="true"
          priority
        />
      </div>

      {/* 4. BLACK VIGNETTE & EDGE DISSOLVE GRADIENT OVERLAY */}
      <div 
        className="fixed inset-0 z-[1] pointer-events-none transition-opacity duration-300 ease-out"
        style={{
          opacity: scrollOpacity,
          background: 'radial-gradient(ellipse 70% 70% at 50% 50%, transparent 15%, #0A0A0A 85%)'
        }}
      />

      {/* 5. HERO CONTENT OVERLAY */}
      <div className="relative z-10 w-full h-full min-h-screen min-h-[100dvh] flex flex-col items-center justify-between py-12 md:py-16 lg:py-20 px-4 pointer-events-none [@media(max-height:850px)]:py-8 [@media(max-height:700px)]:py-6">
        
        {/* Top Subtitle Pill */}
        <div className="mt-8 md:mt-12 lg:mt-14 [@media(max-height:850px)]:mt-6 [@media(max-height:700px)]:mt-2 text-center pointer-events-auto bg-background/50 backdrop-blur-sm px-6 py-2 rounded-full border border-border/50">
          <span
            className="text-xs md:text-sm font-bold tracking-[0.2em] text-secondary uppercase"
            style={typography("hero.title")}
          >
            {title}
          </span>
        </div>

        {/* Stable Interactive Typography Container */}
        <div
          className="relative hero-title font-display font-bold text-[clamp(2.5rem,min(9vw,12vh),7.5rem)] leading-none tracking-tighter flex flex-col items-center justify-center pointer-events-none cursor-default py-4 md:py-6 px-2 sm:px-12 [@media(max-height:850px)]:py-2"
          style={typography("hero.name")}
        >
          {/* First Name */}
          <div className="relative z-10 flex gap-1 sm:gap-4 md:gap-8">
            {firstName.toUpperCase().split("").map((char, i) => renderLetter(char, `f-${i}`))}
          </div>
          
          {/* Last Name */}
          <div className="relative z-10 flex gap-1 sm:gap-4 md:gap-8 mt-1 md:mt-2 items-baseline">
            {lastName.toUpperCase().split("").map((char, i) => renderLetter(char, `l-${i}`))}
            
            {/* Signature Muted Lime Dot */}
            <span 
              key="dot"
              className="inline-block text-[clamp(2.5rem,min(9vw,12vh),7.5rem)] leading-[0] pointer-events-auto transition-colors duration-300 ml-[-0.2em] cursor-default select-none"
              style={{ 
                color: '#B8E600'
              }}
            >
              .
            </span>
          </div>
        </div>

        {/* Bottom Description & Actions */}
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-6 md:gap-8 [@media(max-height:850px)]:gap-4 [@media(max-height:700px)]:gap-3 pointer-events-auto">
          <p className="text-center text-secondary text-sm sm:text-base md:text-lg max-w-lg" style={typography("hero.description")}>
            {description}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
            {primaryUrl ? (
              <SmartLink
                href={primaryUrl}
                onClick={(e) => handleAnchorClick(e, primaryUrl)}
                className="px-8 py-3 rounded-full bg-electric text-background font-bold tracking-wide hover:bg-electric/90 transition-colors"
                style={typography("hero.primaryButton")}
                data-cursor={copy.globalUi.cursorView}
              >
                {primaryText}
              </SmartLink>
            ) : (
              <button
                className="px-8 py-3 rounded-full bg-electric text-background font-bold tracking-wide hover:bg-electric/90 transition-colors"
                style={typography("hero.primaryButton")}
                data-cursor={copy.globalUi.cursorView}
              >
                {primaryText}
              </button>
            )}
            {secondaryUrl ? (
              <SmartLink
                href={secondaryUrl}
                onClick={(e) => handleAnchorClick(e, secondaryUrl)}
                className="px-8 py-3 rounded-full bg-surface border border-border text-foreground font-bold tracking-wide hover:bg-border transition-colors"
                style={typography("hero.secondaryButton")}
                data-cursor={copy.globalUi.cursorDownload}
              >
                {secondaryText}
              </SmartLink>
            ) : (
              <button
                className="px-8 py-3 rounded-full bg-surface border border-border text-foreground font-bold tracking-wide hover:bg-border transition-colors"
                style={typography("hero.secondaryButton")}
                data-cursor={copy.globalUi.cursorDownload}
              >
                {secondaryText}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
