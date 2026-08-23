import LenisProvider from "@/components/layout/LenisProvider";
import Navigation from "@/components/layout/Navigation";
import CustomCursor from "@/components/layout/CustomCursor";
import Footer from "@/components/sections/Footer";
import { TypographyProvider } from "@/components/typography/TypographyProvider";
import { SiteCopyProvider } from "@/components/sitecopy/SiteCopyProvider";
import { getSiteChrome, type SiteChrome } from "@/lib/content";

interface PublicShellProps {
  children: React.ReactNode;
  chrome?: SiteChrome;
}

/**
 * Shared public-site frame: providers + floating navbar + footer.
 * Pages that already loaded chrome data (e.g. home) pass it in to avoid
 * duplicate API calls; other pages let the shell fetch it.
 */
export default async function PublicShell({ children, chrome }: PublicShellProps) {
  const resolved = chrome ?? (await getSiteChrome());

  return (
    <LenisProvider>
      <CustomCursor />
      <SiteCopyProvider copy={resolved.siteCopy}>
        <TypographyProvider settings={resolved.typography}>
          <Navigation />
          <main className="flex flex-col min-h-screen">
            {children}
            <Footer settings={resolved.settings ?? undefined} socialLinks={resolved.socialLinks} />
          </main>
        </TypographyProvider>
      </SiteCopyProvider>
    </LenisProvider>
  );
}
