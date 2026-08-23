/**
 * Central default-data layer.
 *
 * This is the ONLY place in the public site that may hold fallback content
 * values. Components must never hardcode user-visible strings inline; when CMS
 * data is missing they fall back to these shared defaults instead.
 */
import type {
  EducationDto,
  ExperienceDto,
  HeroDto,
  ProjectDto,
  ServiceDto,
  SkillDto,
  SocialLinkDto,
} from "./api";

export const DEFAULT_HERO_NAME = "Rijul Dhakal";
export const DEFAULT_FIRST_NAME = "RIJUL";
export const DEFAULT_LAST_NAME = "DHAKAL";
export const DEFAULT_HERO_TITLE = "UI/UX Designer & Developer";
export const DEFAULT_HERO_DESCRIPTION =
  "I design elegant digital experiences and build modern web applications.";
export const DEFAULT_PRIMARY_BUTTON_TEXT = "VIEW MY WORK";
export const DEFAULT_PRIMARY_BUTTON_URL = "#work";
export const DEFAULT_SECONDARY_BUTTON_TEXT = "DOWNLOAD CV";
export const DEFAULT_PORTRAIT = "/images/rijul-placeholder.jpg";
export const DEFAULT_CONTACT_EMAIL = "mailto:rijuldhakal95@gmail.com";
export const DEFAULT_SITE_NAME = "Rijul";
export const DEFAULT_SITE_TITLE = "UI/UX Designer & Developer";
export const DEFAULT_COPYRIGHT = "© 2026 Rijul Dhakal";

export const DEFAULT_ABOUT_HEADING = "Designing with purpose.\nBuilding with code.";
export const DEFAULT_ABOUT_DESCRIPTION =
  "I'm a UI/UX Designer and Developer who enjoys turning ideas into intuitive interfaces and functional digital products. My work combines design thinking, frontend development, backend development, and business understanding.";

export const DEFAULT_HERO: HeroDto = {
  id: "",
  greeting: "",
  name: DEFAULT_HERO_NAME,
  title: DEFAULT_HERO_TITLE,
  description: DEFAULT_HERO_DESCRIPTION,
  profilePhoto: null,
  cvFile: null,
  cvFileName: null,
  primaryButtonText: DEFAULT_PRIMARY_BUTTON_TEXT,
  primaryButtonUrl: DEFAULT_PRIMARY_BUTTON_URL,
  secondaryButtonText: DEFAULT_SECONDARY_BUTTON_TEXT,
  secondaryButtonUrl: null,
  availabilityText: "",
  isActive: true,
  updatedAt: "",
};

export const DEFAULT_STATS = [
  { value: 2, suffix: "+", label: "Years Experience" },
  { value: 10, suffix: "+", label: "Projects" },
  { value: 15, suffix: "+", label: "Technologies" },
];

export const DEFAULT_SKILLS: SkillDto[] = [
  { id: "", name: "Figma", category: "UI / UX", description: "Interface Design, Collaborative Prototyping", icon: null, positionX: "20.00%", positionY: "50.00%", displayOrder: 0, isActive: true },
  { id: "", name: "Wireframing", category: "UI / UX", description: "Layout Planning, User Flow Mapping", icon: null, positionX: "30.50%", positionY: "27.00%", displayOrder: 1, isActive: true },
  { id: "", name: "Entrepreneurship", category: "BUSINESS", description: "Business Strategy, Product Validation", icon: null, positionX: "69.50%", positionY: "27.00%", displayOrder: 2, isActive: true },
  { id: "", name: "React", category: "DEVELOPMENT", description: "Frontend Development, Component Architecture, Interactive Interfaces", icon: null, positionX: "80.00%", positionY: "50.00%", displayOrder: 3, isActive: true },
  { id: "", name: "Next.js", category: "DEVELOPMENT", description: "Server-side Rendering, Static Site Generation, API Routes", icon: null, positionX: "67.00%", positionY: "73.00%", displayOrder: 4, isActive: true },
  { id: "", name: "UX Research", category: "UI / UX", description: "User Interviews, Usability Testing", icon: null, positionX: "50.00%", positionY: "12.00%", displayOrder: 5, isActive: true },
  { id: "", name: "Journey Maps", category: "UI / UX", description: "Experience Mapping, Pain Point Identification", icon: null, positionX: "33.00%", positionY: "14.50%", displayOrder: 6, isActive: true },
  { id: "", name: "UI/UX Training", category: "BUSINESS", description: "Mentorship, Curriculum Design, Workshops", icon: null, positionX: "67.00%", positionY: "14.50%", displayOrder: 7, isActive: true },
  { id: "", name: "Prototyping", category: "UI / UX", description: "Interactive Mockups, Micro-interactions", icon: null, positionX: "13.00%", positionY: "33.00%", displayOrder: 8, isActive: true },
  { id: "", name: "Visual Design", category: "UI / UX", description: "Typography, Color Theory, Brand Identity", icon: null, positionX: "12.00%", positionY: "67.00%", displayOrder: 9, isActive: true },
  { id: "", name: "Food Distribution", category: "BUSINESS", description: "Logistics, Supply Chain, Operations", icon: null, positionX: "87.00%", positionY: "33.00%", displayOrder: 10, isActive: true },
  { id: "", name: "TypeScript", category: "DEVELOPMENT", description: "Static Typing, Interface Design, Scalable Codebases", icon: null, positionX: "50.00%", positionY: "85.00%", displayOrder: 11, isActive: true },
  { id: "", name: "Saptarishi Group", category: "BUSINESS", description: "Business Management, Strategic Planning", icon: null, positionX: "83.00%", positionY: "16.00%", displayOrder: 12, isActive: true },
  { id: "", name: "PostgreSQL", category: "DEVELOPMENT", description: "Relational Databases, Complex Queries, Data Integrity", icon: null, positionX: "91.00%", positionY: "50.00%", displayOrder: 13, isActive: true },
  { id: "", name: "JavaScript", category: "DEVELOPMENT", description: "Dynamic Interactions, ES6+, Async Programming", icon: null, positionX: "85.00%", positionY: "71.00%", displayOrder: 14, isActive: true },
  { id: "", name: "FastAPI", category: "DEVELOPMENT", description: "Python, High-performance APIs, Async", icon: null, positionX: "70.00%", positionY: "91.00%", displayOrder: 15, isActive: true },
  { id: "", name: "ASP.NET Core", category: "DEVELOPMENT", description: "Web APIs, MVC, High-performance Backends", icon: null, positionX: "50.00%", positionY: "96.00%", displayOrder: 16, isActive: true },
  { id: "", name: "Tailwind CSS", category: "DEVELOPMENT", description: "Utility-first Styling, Responsive Design", icon: null, positionX: "30.00%", positionY: "91.00%", displayOrder: 17, isActive: true },
  { id: "", name: "Node.js", category: "DEVELOPMENT", description: "Server-side JavaScript, REST APIs, Microservices", icon: null, positionX: "15.00%", positionY: "83.00%", displayOrder: 18, isActive: true },
];

export const DEFAULT_SERVICES: ServiceDto[] = [
  { id: "", title: "UI/UX DESIGN", description: "Designing intuitive and visually engaging digital experiences that balance user needs with business goals.", icon: null, features: ["Wireframing", "Prototyping", "UX Research", "Visual Design", "Interaction Design"], displayOrder: 0, isActive: true },
  { id: "", title: "WEB DEVELOPMENT", description: "Building modern, scalable web applications from interface to backend.", icon: null, features: ["Frontend Development", "Backend Development", "REST APIs", "Database Integration", "Responsive Applications"], displayOrder: 1, isActive: true },
  { id: "", title: "DIGITAL PRODUCT DESIGN", description: "Turning product ideas into structured, usable and engaging digital experiences.", icon: null, features: ["User Flows", "Design Systems", "Responsive Interfaces", "Interaction Design"], displayOrder: 2, isActive: true },
  { id: "", title: "TRAINING", description: "Helping learners build practical UI/UX and digital skills through focused training.", icon: null, features: ["UI/UX Crash Courses", "30-Day Courses", "1-Week Intensive", "Workshops", "Training Sessions"], displayOrder: 3, isActive: true },
];

export const DEFAULT_PROJECTS: ProjectDto[] = [
  {
    id: "", title: "SAPTARISHI PLATFORM", slug: "saptarishi-platform", shortDescription: null, fullDescription: null,
    category: "Full-Stack Web App", technologies: ["React", ".NET", "PostgreSQL"],
    thumbnail: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=2000&auto=format&fit=crop",
    featuredImage: null, liveUrl: null, githubUrl: null, figmaUrl: null, caseStudyUrl: null,
    year: null, role: null, client: null, problem: null, goal: null, contribution: null, process: null,
    features: [], challenges: null, solution: null, results: null,
    displayOrder: 0, isFeatured: false, isPublished: true, createdAt: "", updatedAt: "", images: [],
  },
  {
    id: "", title: "DIGITAL EXHIBITION", slug: "digital-exhibition", shortDescription: null, fullDescription: null,
    category: "3D Experience", technologies: ["Next.js", "Three.js", "GSAP"],
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop",
    featuredImage: null, liveUrl: null, githubUrl: null, figmaUrl: null, caseStudyUrl: null,
    year: null, role: null, client: null, problem: null, goal: null, contribution: null, process: null,
    features: [], challenges: null, solution: null, results: null,
    displayOrder: 1, isFeatured: false, isPublished: true, createdAt: "", updatedAt: "", images: [],
  },
];

export const DEFAULT_EXPERIENCES: ExperienceDto[] = [
  { id: "", year: "2024 — PRESENT", role: "Freelance UI/UX Designer & Developer", description: "Designing and building digital products for various clients. Focusing on full-stack development with React, Next.js, and .NET.", displayOrder: 0 },
  { id: "", year: "2023 — 2024", role: "Saptarishi Business Group", description: "Involved in entrepreneurship, strategic planning, and operational management. Developed internal tools and platforms.", displayOrder: 1 },
  { id: "", year: "2022 — 2023", role: "UI/UX Training Instructor", description: "Conducted workshops, 30-day crash courses, and 1-week intensive sessions to help learners build practical digital skills.", displayOrder: 2 },
];

export const DEFAULT_EDUCATION: EducationDto[] = [
  { id: "1", institution: "Nepal Commerce Campus", degree: "Bachelor", field: "Information Management", startYear: "2018", endYear: "2023", description: "Focus on business management principles combined with modern information technology. Blended coursework in UI/UX, software engineering, and business strategy.", displayOrder: 0 },
];

export const DEFAULT_SOCIALS: SocialLinkDto[] = [
  { id: "", platform: "IN", label: null, shortLabel: "IN", url: "#", icon: null, displayOrder: 0, isActive: true },
  { id: "", platform: "GH", label: null, shortLabel: "GH", url: "#", icon: null, displayOrder: 1, isActive: true },
  { id: "", platform: "FI", label: null, shortLabel: "FI", url: "#", icon: null, displayOrder: 2, isActive: true },
];
export const DEFAULT_META_DESCRIPTION =
  "I design elegant digital experiences and develop modern web applications. I combine UI/UX creativity with strong frontend and backend skills to deliver impactful digital products.";

export const DEFAULT_META_TITLE = "Rijul Dhakal — UI/UX Designer & Developer";
