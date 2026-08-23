"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authApi, tokenStore } from "@/lib/api";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", num: "01" },
  { href: "/admin/hero", label: "Hero", num: "02" },
  { href: "/admin/about", label: "About", num: "03" },
  { href: "/admin/skills", label: "Skills", num: "04" },
  { href: "/admin/services", label: "Services", num: "05" },
  { href: "/admin/projects", label: "Projects", num: "06" },
  { href: "/admin/experiences", label: "Experience", num: "07" },
  { href: "/admin/educations", label: "Education", num: "08" },
  { href: "/admin/navigation", label: "Navigation", num: "09" },
  { href: "/admin/intro", label: "Intro", num: "10" },
  { href: "/admin/personal", label: "Personal", num: "11" },
  { href: "/admin/contact", label: "Contact", num: "12" },
  { href: "/admin/media", label: "Media", num: "13" },
  { href: "/admin/messages", label: "Messages", num: "14" },
  { href: "/admin/settings", label: "Settings", num: "15" },
  { href: "/admin/social-links", label: "Social Links", num: "16" },
  { href: "/admin/typography", label: "Typography", num: "17" },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      tokenStore.clear();
    }
    router.push("/admin/login");
  };

  const user = tokenStore.getUser();

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 py-5 border-b border-border">
        <Link href="/admin" className="font-display text-xl font-bold uppercase tracking-tight">
          Rijul<span className="text-electric">.</span>
        </Link>
        <p className="text-[10px] font-bold tracking-widest text-secondary uppercase mt-1">CMS</p>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-5 flex flex-col gap-0.5">
        {navItems.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "group flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                active
                  ? "bg-electric text-background"
                  : "text-secondary hover:text-foreground hover:bg-white/5"
              )}
            >
              <span
                className={cn(
                  "text-[10px] tracking-widest font-bold",
                  active ? "text-background/60" : "text-secondary/50 group-hover:text-secondary/80"
                )}
              >
                {item.num}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-5 py-5 border-t border-border flex flex-col gap-4">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-bold tracking-widest text-secondary uppercase">
            Signed in
          </span>
          <span className="text-sm text-foreground truncate">{user?.email ?? "admin"}</span>
        </div>
        <div className="flex gap-2">
          <Link
            href="/"
            target="_blank"
            className="flex-1 text-center px-3 py-2 rounded-md bg-surface border border-border text-foreground text-xs font-bold hover:border-electric/50 transition-colors"
          >
            View Site
          </Link>
          <button
            onClick={handleLogout}
            className="flex-1 px-3 py-2 rounded-md bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold hover:bg-red-500/20 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-64 bg-surface border-r border-border">
        <SidebarContent />
      </aside>

      <div className="lg:hidden sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border px-4 py-3.5 flex items-center justify-between">
        <Link href="/admin" className="font-display text-lg font-bold uppercase tracking-tight">
          Rijul<span className="text-electric">.</span>{" "}
          <span className="text-[10px] font-bold text-secondary tracking-widest">CMS</span>
        </Link>
        <button
          onClick={() => setMenuOpen(true)}
          className="px-4 py-2 rounded-md bg-surface border border-border text-xs font-bold uppercase tracking-widest"
        >
          Menu
        </button>
      </div>

      {menuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/70" onClick={() => setMenuOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 bg-surface border-r border-border">
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-4 right-4 px-3 py-1 rounded-md bg-background border border-border text-xs font-bold"
            >
              Close
            </button>
            <SidebarContent onNavigate={() => setMenuOpen(false)} />
          </div>
        </div>
      )}

      <main className="lg:pl-64">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">{children}</div>
      </main>
    </div>
  );
}
