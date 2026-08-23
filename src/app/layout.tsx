import type { Metadata } from "next";
import { fontInstances } from "@/lib/typography/fonts";
import { getSiteContent } from "@/lib/content";
import { DEFAULT_META_DESCRIPTION, DEFAULT_META_TITLE } from "@/lib/contentDefaults";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  return {
    title: content.settings?.metaTitle ?? DEFAULT_META_TITLE,
    description: content.settings?.metaDescription ?? DEFAULT_META_DESCRIPTION,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fontInstances.map((f) => f.variable).join(" ")} antialiased`}>
      <body className="min-h-screen flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
