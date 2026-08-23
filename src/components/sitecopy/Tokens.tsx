"use client";

import type { ReactNode } from "react";

interface NameTokenProps {
  text: string;
  name: string;
}

/**
 * Renders a body string, replacing the {name} token with the person's name
 * styled with the foreground color (matches the original inline span).
 */
export function NameToken({ text, name }: NameTokenProps) {
  const parts = text.split("{name}");
  if (parts.length <= 1) return <>{text}</>;
  const nodes: ReactNode[] = [];
  parts.forEach((part, i) => {
    if (i > 0) {
      nodes.push(
        <span key={`n-${i}`} className="text-foreground">
          {name}
        </span>
      );
    }
    if (part) nodes.push(<span key={`t-${i}`}>{part}</span>);
  });
  return <>{nodes}</>;
}

interface HighlightTokenProps {
  text: string;
}

/**
 * Renders a body string, replacing the {highlight}...{/highlight} token with
 * a bold + underlined span (matches the original inline span).
 */
export function HighlightToken({ text }: HighlightTokenProps) {
  const parts = text.split(/\{highlight\}([\s\S]*?)\{\/highlight\}/g);
  if (parts.length <= 1) return <>{text}</>;
  const nodes: ReactNode[] = [];
  parts.forEach((part, i) => {
    if (i % 2 === 1) {
      nodes.push(
        <span key={`h-${i}`} className="font-bold underline decoration-4 underline-offset-8">
          {part}
        </span>
      );
    } else if (part) {
      nodes.push(<span key={`t-${i}`}>{part}</span>);
    }
  });
  return <>{nodes}</>;
}
