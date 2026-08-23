"use client";

import type { SiteSettingDto, SocialLinkDto } from "@/lib/api";
import SmartLink from "@/components/layout/SmartLink";
import { useTypographyResolver } from "@/components/typography/TypographyProvider";
import { useSiteCopy } from "@/components/sitecopy/SiteCopyProvider";
import {
  DEFAULT_CONTACT_EMAIL,
  DEFAULT_COPYRIGHT,
  DEFAULT_SITE_NAME,
  DEFAULT_SITE_TITLE,
  DEFAULT_SOCIALS,
} from "@/lib/contentDefaults";

interface FooterProps {
  settings?: SiteSettingDto;
  socialLinks?: SocialLinkDto[];
}

export default function Footer({ settings, socialLinks }: FooterProps) {
  const typography = useTypographyResolver();
  const copy = useSiteCopy();
  const brandName = settings?.siteName?.split(" ")[0] ?? DEFAULT_SITE_NAME;
  const tagline = settings?.siteTitle ?? DEFAULT_SITE_TITLE;
  const copyright = settings?.copyrightText ?? DEFAULT_COPYRIGHT;
  const emailLink =
    socialLinks?.find((l) => l.platform.toLowerCase() === "email")?.url ??
    DEFAULT_CONTACT_EMAIL;

  const socials =
    socialLinks && socialLinks.length > 0
      ? socialLinks
          .filter((l) => l.isActive)
          .sort((a, b) => a.displayOrder - b.displayOrder)
          .slice(0, 3)
          .map((l) => ({
            label: l.shortLabel ?? l.platform.slice(0, 2).toUpperCase(),
            url: l.url,
          }))
      : DEFAULT_SOCIALS.map((s) => ({ label: s.shortLabel ?? s.platform, url: s.url }));
  return (
    <footer className="w-full py-16 px-4 md:px-12 lg:px-24 bg-background border-t border-border text-secondary">
      <div className="max-w-7xl mx-auto flex flex-col gap-16">
        
        <div className="flex flex-col md:flex-row justify-between gap-12">
          {/* Left */}
          <div className="flex flex-col gap-4">
            <h2 className="font-display font-bold text-3xl text-foreground" style={typography("footer.name")}>
              {brandName}<span className="text-electric">.</span>
            </h2>
            <p className="tracking-wide" style={typography("footer.tagline")}>{tagline}</p>
          </div>

          {/* Nav */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold tracking-widest uppercase text-foreground mb-2">{copy.footer.navigationHeading}</span>
            {copy.footer.navLinks.map(link => (
              <SmartLink
                key={link.label}
                href={link.href}
                className="hover:text-electric transition-colors w-fit text-sm"
                style={typography("footer.navLink")}
              >
                {link.label}
              </SmartLink>
            ))}
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold tracking-widest uppercase text-foreground mb-2">{copy.footer.contactHeading}</span>
            <a href={emailLink} className="hover:text-electric transition-colors w-fit text-sm">
              {emailLink.replace(/^mailto:/, "")}
            </a>
            <div className="flex gap-4 mt-4">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:border-electric hover:text-electric transition-all text-xs font-bold"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-border text-sm">
          <span style={typography("footer.copyright")}>{copyright}</span>
          <span className="hover:text-electric transition-colors cursor-default" data-cursor={copy.globalUi.cursorBolt}>{copy.footer.builtWith}</span>
        </div>

      </div>
    </footer>
  );
}
