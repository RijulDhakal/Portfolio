"use client";

import { useState, useEffect } from "react";

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    const media = window.matchMedia(query);
    // Initialize if different (in case of hydration mismatch)
    if (media.matches !== matches) {
      // Using setTimeout defers it to avoid synchronous effect warning, 
      // though lazy initialization above usually handles it.
      setTimeout(() => setMatches(media.matches), 0);
    }

    const listener = () => setMatches(media.matches);
    window.addEventListener("resize", listener);
    
    return () => window.removeEventListener("resize", listener);
  }, [matches, query]);

  return matches;
}
