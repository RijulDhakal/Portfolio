import type {
  SiteCopyDto,
  SiteCopyUpsertDto,
} from "./api";

export const DEFAULT_SITE_COPY: SiteCopyUpsertDto = {
  navigation: {
    brand: "Rijul",
    hireMe: "Hire Me",
    links: [
      { label: "Home", href: "/" },
      { label: "Services", href: "#services" },
      { label: "Work", href: "#work" },
      { label: "About", href: "#about" },
      { label: "Contact", href: "#contact" },
    ],
  },
  intro: {
    line1: "I DESIGN.",
    line2: "I BUILD.",
    line3: "I EXPERIMENT.",
    body: "I'm {name}, a UI/UX Designer and Developer focused on creating thoughtful digital experiences and modern web applications.",
  },
  about: {
    number: "01 /",
    label: "About",
    stat1Label: "Years Experience",
    stat2Label: "Projects",
    stat3Label: "Technologies",
    statSuffix: "+",
  },
  skills: {
    number: "02 /",
    label: "Skills",
    heading: "Tools I\nWork With.",
    centerLabel: "RIJUL",
  },
  services: {
    number: "03 /",
    label: "Services",
    heading: "What I\nCan Do.",
  },
  work: {
    number: "04 /",
    label: "Selected Work",
    heading: "Things\nI've Built.",
    viewProjectLabel: "View Project",
    separator: "|",
  },
  experience: {
    number: "05 /",
    label: "Experience",
    heading: "The Journey\nSo Far.",
  },
  education: {
    number: "06 /",
    label: "Education",
    heading: "Where I\nLearned.",
    ofConnector: "of",
    dash: "—",
  },
  personal: {
    label: "Beyond the Screen.",
    heading: "Design ✦ Code ✦ Business",
    marqueeWords: ["Design", "Code", "Business"],
    marqueeSeparator: "✦",
    body: "I enjoy working at the intersection of design, technology and business — creating experiences that aren't only visually engaging, but {highlight}useful and practical{/highlight}.",
  },
  contact: {
    number: "07 /",
    label: "Contact",
    headingLine1: "LET'S",
    headingLine2: "MAKE",
    headingLine3: "SOMETHING.",
    body: "Have an idea, project or collaboration in mind? Let's talk.",
    emailLabel: "Email",
    phoneLabel: "Phone",
    phoneNumber: "+977 9746254793",
    formNameLabel: "Your Name",
    formEmailLabel: "Your Email",
    formMessageLabel: "Your Message",
    namePlaceholder: "John Doe",
    emailPlaceholder: "john@example.com",
    messagePlaceholder: "Tell me about your project...",
    submitLabel: "SEND MESSAGE",
    sendingLabel: "SENDING...",
    successTitle: "Message Sent",
    successBody: "Thanks for reaching out! I'll get back to you as soon as possible.",
    sendAnotherLabel: "SEND ANOTHER",
    errorFallback: "Something went wrong. Please try again.",
  },
  footer: {
    navigationHeading: "Navigation",
    contactHeading: "Contact",
    navLinks: [
      { label: "Home", href: "#home" },
      { label: "Intro", href: "#intro" },
      { label: "About", href: "#about" },
      { label: "Skills", href: "#skills" },
      { label: "Services", href: "#services" },
      { label: "Work", href: "#work" },
      { label: "Experience", href: "#experience" },
      { label: "Education", href: "#education" },
      { label: "Contact", href: "#contact" },
    ],
    builtWith: "Built with curiosity.",
  },
  globalUi: {
    cursorDefault: "VIEW",
    cursorHome: "HOME",
    cursorLetsTalk: "LET'S TALK",
    cursorView: "VIEW",
    cursorDownload: "DOWNLOAD",
    cursorDesign: "DESIGN",
    cursorBuild: "BUILD",
    cursorCreate: "CREATE",
    cursorExplore: "EXPLORE",
    cursorOpen: "OPEN",
    cursorBolt: "⚡️",
    heroImageAlt: "Rijul Dhakal Portrait",
  },
};

/**
 * Merges the CMS SiteCopy (which always contains full groups) with the
 * central defaults. Empty strings from the CMS pass through; only missing
 * groups fall back to the default values.
 */
export function resolveSiteCopy(copy: SiteCopyDto | null): SiteCopyUpsertDto {
  if (!copy) return DEFAULT_SITE_COPY;
  return {
    navigation: copy.navigation ?? DEFAULT_SITE_COPY.navigation,
    intro: copy.intro ?? DEFAULT_SITE_COPY.intro,
    about: copy.about ?? DEFAULT_SITE_COPY.about,
    skills: copy.skills ?? DEFAULT_SITE_COPY.skills,
    services: copy.services ?? DEFAULT_SITE_COPY.services,
    work: copy.work ?? DEFAULT_SITE_COPY.work,
    experience: copy.experience ?? DEFAULT_SITE_COPY.experience,
    education: copy.education ?? DEFAULT_SITE_COPY.education,
    personal: copy.personal ?? DEFAULT_SITE_COPY.personal,
    contact: copy.contact ?? DEFAULT_SITE_COPY.contact,
    footer: copy.footer ?? DEFAULT_SITE_COPY.footer,
    globalUi: copy.globalUi ?? DEFAULT_SITE_COPY.globalUi,
  };
}
