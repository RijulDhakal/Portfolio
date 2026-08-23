import PublicShell from "@/components/layout/PublicShell";
import Hero from "@/components/sections/Hero";
import Intro from "@/components/sections/Intro";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Services from "@/components/sections/Services";
import Work from "@/components/sections/Work";
import Experience from "@/components/sections/Experience";
import Education from "@/components/sections/Education";
import Personal from "@/components/sections/Personal";
import Contact from "@/components/sections/Contact";
import { getSiteContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await getSiteContent();

  return (
    <PublicShell
      chrome={{
        siteCopy: content.siteCopy,
        typography: content.typography,
        settings: content.settings,
        socialLinks: content.socialLinks,
      }}
    >
      <Hero hero={content.hero ?? undefined} />
      <Intro name={content.hero?.name} />
      <About about={content.about ?? undefined} />
      <Skills skills={content.skills} />
      <Services services={content.services} />
      <Work projects={content.projects} />
      <Experience experiences={content.experiences} />
      <Education educations={content.educations} />
      <Personal />
      <Contact socialLinks={content.socialLinks} />
    </PublicShell>
  );
}
