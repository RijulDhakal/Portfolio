"use client";

import { useState, useEffect, useLayoutEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useLenis } from "lenis/react";
import { useTypographyResolver } from "@/components/typography/TypographyProvider";
import { useSiteCopy } from "@/components/sitecopy/SiteCopyProvider";
import SmartLink, { sectionIdFromHref } from "@/components/layout/SmartLink";

export default function Navigation() {
  const typography = useTypographyResolver();
  const copy = useSiteCopy();
  const lenis = useLenis();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const navLinks = copy.navigation.links;
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(isHome ? "home" : null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      if (!isHome) {
        setActiveSection(null);
        return;
      }

      const sections = navLinks
        .map((link) => sectionIdFromHref(link.href))
        .filter((id): id is string => Boolean(id));

      let currentSection = "home";
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            currentSection = section;
          }
        }
      }
      // The last section can never cover the viewport midline at max scroll,
      // so pin it as active once the page reaches the bottom.
      if (
        sections.length > 0 &&
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2
      ) {
        currentSection = sections[sections.length - 1];
      }
      setActiveSection(currentSection);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    // Lenis animates scrollTop without emitting native window scroll events,
    // so the spy must also subscribe to Lenis's own scroll emission.
    lenis?.on("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      lenis?.off("scroll", handleScroll);
    };
  }, [navLinks, isHome, lenis]);

  // Cross-page anchor navigation: landing on home via /#section must end up
  // scrolled to the section even though Lenis took over after the native jump.
  useEffect(() => {
    if (!isHome || !lenis) return;
    const hash = window.location.hash.replace(/^#/, "");
    if (!hash) return;
    const raf = requestAnimationFrame(() => {
      lenis.scrollTo(`#${hash}`, { offset: 0, immediate: true });
    });
    return () => cancelAnimationFrame(raf);
  }, [isHome, lenis]);

  // Back/Forward across pushed anchor entries: restore the scrolled position.
  useEffect(() => {
    if (!isHome) return;
    const onPopState = () => {
      const hash = window.location.hash.replace(/^#/, "");
      requestAnimationFrame(() => {
        if (lenis) {
          lenis.scrollTo(hash ? `#${hash}` : 0, { offset: 0 });
        } else if (hash) {
          document.getElementById(hash)?.scrollIntoView({ block: "start" });
        } else {
          window.scrollTo({ top: 0 });
        }
      });
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [isHome, lenis]);

  useLayoutEffect(() => {
    const root = document.documentElement;
    if (menuOpen) {
      root.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      lenis?.stop();
    } else {
      root.style.overflow = "";
      document.body.style.overflow = "";
      lenis?.start();
    }
    return () => {
      root.style.overflow = "";
      document.body.style.overflow = "";
      lenis?.start();
    };
  }, [menuOpen, lenis]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setMenuOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // Same-page anchors scroll via lenis (desktop and mobile); everything else
  // closes the menu and lets SmartLink navigate (Next lands on home, the
  // hash effect above finishes the scroll).
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    const targetId = sectionIdFromHref(href);
    const isHomeTop = isHome && href === "/";
    const isSamePageAnchor = isHome && targetId !== null && !href.startsWith("http");
    if (!isSamePageAnchor && !isHomeTop) {
      closeMenu();
      return;
    }

    e.preventDefault();
    closeMenu();

    // Anchor scrolls bypass the browser's own navigation, so push a history
    // entry manually to keep Back/Forward working between sections.
    window.history.pushState(null, "", isHomeTop ? window.location.pathname : `#${targetId}`);

    requestAnimationFrame(() => {
      if (isHomeTop) {
        if (lenis) lenis.scrollTo(0, { offset: 0 });
        else window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      if (!targetId) return;
      if (lenis) {
        lenis.scrollTo(`#${targetId}`, { offset: 0 });
      } else {
        document.getElementById(targetId)?.scrollIntoView({ block: "start" });
      }
    });
  };

  const isLinkActive = (href: string) => {
    const targetId = sectionIdFromHref(href);
    if (targetId !== null) return isHome && activeSection === targetId;
    if (href === "/") return isHome && activeSection === "home";
    return pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
  };

  return (
    <header className={cn(
      "fixed top-0 left-0 w-full z-50 transition-all duration-500 flex justify-center py-6 px-4 md:px-12",
      isScrolled ? "py-4" : ""
    )}>
      <div className={cn(
        "flex items-center justify-between w-full max-w-7xl transition-all duration-500",
        isScrolled
          ? "bg-surface/80 backdrop-blur-md border border-border rounded-full px-6 py-3 shadow-lg max-w-4xl"
          : "bg-transparent border-transparent px-0"
      )}>
        <SmartLink href="#home" className="text-2xl font-display font-bold tracking-tight z-50 relative" data-cursor={copy.globalUi.cursorHome} style={typography("navigation.brand")}>
          {copy.navigation.brand}<span className="text-electric">.</span>
        </SmartLink>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <SmartLink
              key={link.label}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className={cn(
                "text-sm font-medium transition-colors hover:text-foreground",
                isLinkActive(link.href) ? "text-electric" : "text-secondary"
              )}
              style={typography("navigation.link")}
            >
              {link.label}
            </SmartLink>
          ))}
        </nav>

        <SmartLink
          href="#contact"
          className="hidden md:inline-flex items-center justify-center px-6 py-2 text-sm font-bold bg-foreground text-background rounded-full hover:bg-electric transition-colors"
          data-cursor={copy.globalUi.cursorLetsTalk}
          style={typography("navigation.cta")}
        >
          {copy.navigation.hireMe}
        </SmartLink>

        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="md:hidden relative z-50 w-11 h-11 rounded-full bg-surface/80 border border-border backdrop-blur-sm flex items-center justify-center"
        >
          <span className={cn(
            "absolute w-5 h-[2px] rounded-full bg-foreground transition-all duration-300",
            menuOpen ? "rotate-45" : "-translate-y-[4px]"
          )} />
          <span className={cn(
            "absolute w-5 h-[2px] rounded-full bg-foreground transition-all duration-300",
            menuOpen ? "-rotate-45" : "translate-y-[4px]"
          )} />
        </button>
      </div>

      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label={copy.navigation.brand}
        aria-hidden={!menuOpen}
        className={cn(
          "fixed inset-0 z-40 md:hidden transition-opacity duration-500 ease-out",
          menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={closeMenu} />

        <div
          data-lenis-prevent
          className={cn(
            "relative bg-surface/95 backdrop-blur-md border-b border-border px-8 pt-28 pb-10 flex flex-col gap-2 max-h-screen overflow-y-auto transition-transform duration-500 ease-out",
            menuOpen ? "translate-y-0" : "-translate-y-6"
          )}
        >
          {navLinks.map((link) => (
            <SmartLink
              key={link.label}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className={cn(
                "py-3 font-display font-bold text-3xl tracking-tight transition-colors duration-300",
                isLinkActive(link.href)
                  ? "text-electric"
                  : "text-foreground hover:text-electric"
              )}
              style={typography("navigation.link")}
            >
              {link.label}
            </SmartLink>
          ))}

          <SmartLink
            href="#contact"
            onClick={(e) => handleLinkClick(e, "#contact")}
            className="mt-6 inline-flex items-center justify-center px-8 py-3 w-fit text-sm font-bold bg-foreground text-background rounded-full hover:bg-electric transition-colors"
            style={typography("navigation.cta")}
          >
            {copy.navigation.hireMe}
          </SmartLink>
        </div>
      </div>
    </header>
  );
}
