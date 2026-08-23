import {
  Archivo,
  Fraunces,
  Inter,
  JetBrains_Mono,
  Outfit,
  Playfair_Display,
  Sora,
  Space_Grotesk,
  Syne,
  Unbounded,
} from "next/font/google";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const fontInstances = [
  inter,
  spaceGrotesk,
  archivo,
  sora,
  outfit,
  playfairDisplay,
  fraunces,
  syne,
  unbounded,
  jetbrainsMono,
];

export type FontKey =
  | "inter"
  | "space-grotesk"
  | "archivo"
  | "sora"
  | "outfit"
  | "playfair-display"
  | "fraunces"
  | "syne"
  | "unbounded"
  | "jetbrains-mono";

export interface FontDefinition {
  key: FontKey;
  label: string;
  /** CSS custom property that resolves to this font's family. */
  variable: string;
}

export const fonts: FontDefinition[] = [
  { key: "inter", label: "Inter", variable: "var(--font-inter)" },
  { key: "space-grotesk", label: "Space Grotesk", variable: "var(--font-space-grotesk)" },
  { key: "archivo", label: "Archivo", variable: "var(--font-archivo)" },
  { key: "sora", label: "Sora", variable: "var(--font-sora)" },
  { key: "outfit", label: "Outfit", variable: "var(--font-outfit)" },
  { key: "playfair-display", label: "Playfair Display", variable: "var(--font-playfair-display)" },
  { key: "fraunces", label: "Fraunces", variable: "var(--font-fraunces)" },
  { key: "syne", label: "Syne", variable: "var(--font-syne)" },
  { key: "unbounded", label: "Unbounded", variable: "var(--font-unbounded)" },
  { key: "jetbrains-mono", label: "JetBrains Mono", variable: "var(--font-jetbrains-mono)" },
];

export function isFontKey(value: string | null | undefined): value is FontKey {
  return value !== null && value !== undefined && fonts.some((f) => f.key === value);
}
