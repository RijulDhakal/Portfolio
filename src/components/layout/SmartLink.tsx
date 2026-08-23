"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties, MouseEvent, ReactNode } from "react";

/**
 * Single-page architecture: the main nav uses home-section anchors ("#work",
 * rendered as "/#work" off home); dedicated routes exist only for project
 * case studies ("/work/[slug]"). CMS content may also store absolute URLs.
 */
export function resolveHref(href: string, pathname: string | null): string {
  if (!href) return "/";
  if (href.startsWith("/")) return href;
  if (href.startsWith("#")) return pathname === "/" ? href : `/${href}`;
  return href;
}

export function sectionIdFromHref(href: string): string | null {
  const hashIndex = href.indexOf("#");
  if (hashIndex === -1) return null;
  const id = href.slice(hashIndex + 1);
  return id || null;
}

export function isInternalHash(href: string): boolean {
  return href.startsWith("#") && href.length > 1;
}

const EXTERNAL_PATTERN = /^(https?:)?\/\//i;

interface SmartLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  "data-cursor"?: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  ariaLabel?: string;
}

export default function SmartLink({ href, children, onClick, ariaLabel, ...rest }: SmartLinkProps) {
  const pathname = usePathname();
  const resolved = resolveHref(href, pathname);

  if (EXTERNAL_PATTERN.test(resolved) || resolved.startsWith("mailto:") || resolved.startsWith("tel:")) {
    return (
      <a
        href={resolved}
        target={EXTERNAL_PATTERN.test(resolved) ? "_blank" : undefined}
        rel={EXTERNAL_PATTERN.test(resolved) ? "noopener noreferrer" : undefined}
        onClick={onClick}
        aria-label={ariaLabel}
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={resolved} onClick={onClick} aria-label={ariaLabel} {...rest}>
      {children}
    </Link>
  );
}
