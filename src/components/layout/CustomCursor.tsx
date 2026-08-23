"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";
import { useSiteCopy } from "@/components/sitecopy/SiteCopyProvider";

export default function CustomCursor() {
  const copy = useSiteCopy();
  const cursorRef = useRef<HTMLDivElement>(null);
  const [hoverText, setHoverText] = useState("");
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if device supports hover and respects reduced motion
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    
    if (isTouchDevice || prefersReducedMotion) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    // Use quickTo for fast, responsive tracking with subtle inertia
    const xTo = gsap.quickTo(cursor, "x", { duration: 0.05, ease: "power2.out" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.05, ease: "power2.out" });

    const onMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      xTo(e.clientX);
      yTo(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Look for data-cursor attribute up the tree
      const interactiveEl = target.closest('[data-cursor]');
      const linkEl = target.closest('a, button');

      if (interactiveEl) {
        const text = interactiveEl.getAttribute('data-cursor') || copy.globalUi.cursorDefault;
        setHoverText(text);
        setIsHovering(true);
      } else if (linkEl) {
        setHoverText("");
        setIsHovering(true);
      } else {
        setHoverText("");
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
    };
  }, [isVisible, copy.globalUi.cursorDefault]);

  return (
    <div
      ref={cursorRef}
      className={cn(
        "fixed top-0 left-0 pointer-events-none z-[100] transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-all duration-300 overflow-hidden",
        !isVisible ? "opacity-0" : "opacity-100",
        isHovering 
          ? "w-20 h-20 rounded-full bg-electric text-background font-bold text-[10px] tracking-widest mix-blend-normal" 
          : "w-4 h-4 rounded-full bg-foreground mix-blend-difference"
      )}
    >
      <span 
        className={cn(
          "transition-opacity duration-200 block text-center uppercase leading-none",
          isHovering && hoverText ? "opacity-100" : "opacity-0"
        )}
      >
        {hoverText}
      </span>
    </div>
  );
}
