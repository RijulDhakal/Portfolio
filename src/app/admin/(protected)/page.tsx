"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  FileText,
  FolderOpen,
  Inbox,
  PenLine,
  Settings,
  Sparkles,
  Upload,
} from "lucide-react";
import { useApi } from "@/components/admin/useApi";
import { adminDashboardApi } from "@/lib/api";
import { resolveAssetUrl } from "@/lib/api";
import { btnPrimary, btnSecondary, Card, ErrorBanner, PageHeader, Spinner } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

function StatCard({
  label,
  value,
  href,
  accent = false,
}: {
  label: string;
  value: number;
  href: string;
  accent?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group rounded-xl border p-5 flex flex-col gap-2.5 transition-colors",
        accent ? "bg-electric border-electric" : "bg-surface border-border hover:border-electric/50"
      )}
    >
      <span
        className={cn(
          "font-display text-3xl font-bold tracking-tight leading-none",
          accent ? "text-background" : "text-foreground"
        )}
      >
        {value}
      </span>
      <span
        className={cn(
          "text-[11px] font-bold tracking-widest uppercase",
          accent ? "text-background/60" : "text-secondary"
        )}
      >
        {label}
      </span>
    </Link>
  );
}

function SectionCard({
  title,
  actionHref,
  actionLabel,
  children,
}: {
  title: string;
  actionHref?: string;
  actionLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="rounded-xl p-6">
      <div className="flex items-center justify-between gap-4 mb-5">
        <h2 className="text-xs font-bold tracking-widest uppercase text-foreground">{title}</h2>
        {actionHref && actionLabel && (
          <Link
            href={actionHref}
            className="inline-flex items-center gap-1 text-xs font-bold tracking-widest uppercase text-electric hover:text-electric/80 transition-colors"
          >
            {actionLabel}
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>
      {children}
    </Card>
  );
}

const quickActions = [
  { href: "/admin/projects/new", label: "New project", icon: FileText },
  { href: "/admin/media", label: "Upload media", icon: Upload },
  { href: "/admin/messages", label: "Check messages", icon: Inbox },
  { href: "/admin/hero", label: "Edit hero", icon: PenLine },
  { href: "/admin/typography", label: "Typography", icon: Sparkles },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

function StatusRow({
  label,
  value,
  ok = true,
  attention = false,
}: {
  label: string;
  value: string;
  ok?: boolean;
  attention?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <span className="flex items-center gap-2.5 text-xs text-secondary">
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full shrink-0",
            ok ? "bg-electric" : attention ? "bg-electric" : "bg-red-500"
          )}
        />
        {label}
      </span>
      <span
        className={cn(
          "text-xs font-bold text-foreground",
          attention && "text-electric"
        )}
      >
        {value}
      </span>
    </div>
  );
}

export default function AdminDashboardPage() {
  const { data, loading, error } = useApi(() => adminDashboardApi.stats(), []);

  if (loading) return <Spinner label="Loading dashboard" />;
  if (error || !data) return <ErrorBanner message={error ?? "Failed to load dashboard."} />;

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your portfolio content, recent activity, and site status."
        actions={
          <>
            <Link
              href="/"
              target="_blank"
              className={cn(btnSecondary, "inline-flex items-center gap-2")}
            >
              View site
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link href="/admin/projects/new" className={cn(btnPrimary, "inline-flex items-center gap-2")}>
              New project
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <StatCard label="Projects" value={data.projectsCount} href="/admin/projects" />
        <StatCard label="Published" value={data.publishedProjects} href="/admin/projects" />
        <StatCard label="Skills" value={data.skillsCount} href="/admin/skills" />
        <StatCard label="Services" value={data.servicesCount} href="/admin/services" />
        <StatCard label="Unread messages" value={data.unreadMessages} href="/admin/messages" accent />
        <StatCard label="Media files" value={data.mediaCount} href="/admin/media" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <SectionCard title="Recent projects" actionHref="/admin/projects" actionLabel="View all">
            {data.recentProjects.length === 0 ? (
              <p className="text-sm text-secondary">No projects yet.</p>
            ) : (
              <ul className="flex flex-col divide-y divide-border">
                {data.recentProjects.map((project) => (
                  <li key={project.id} className="py-3 first:pt-0 last:pb-0 flex items-center gap-4">
                    {project.thumbnail ? (
                      <img
                        src={resolveAssetUrl(project.thumbnail) ?? ""}
                        alt={project.title}
                        className="w-10 h-10 rounded-md object-cover bg-background border border-border shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-md bg-background border border-border flex items-center justify-center shrink-0">
                        <FolderOpen className="w-4 h-4 text-secondary" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate">{project.title}</p>
                      <p className="text-xs text-secondary truncate">
                        {project.category ?? "Uncategorized"}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded shrink-0",
                        project.isPublished
                          ? "bg-electric/10 text-electric"
                          : "bg-background border border-border text-secondary"
                      )}
                    >
                      {project.isPublished ? "Live" : "Draft"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>

          <SectionCard title="Recent messages" actionHref="/admin/messages" actionLabel="View all">
            {data.recentMessages.length === 0 ? (
              <p className="text-sm text-secondary">No messages yet.</p>
            ) : (
              <ul className="flex flex-col divide-y divide-border">
                {data.recentMessages.map((message) => (
                  <li key={message.id} className="py-3 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "w-1.5 h-1.5 rounded-full shrink-0",
                          message.isRead ? "bg-border" : "bg-electric"
                        )}
                      />
                      <p className="text-sm font-bold truncate flex-1">{message.name}</p>
                      <span className="text-xs text-secondary shrink-0">
                        {new Date(message.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-secondary mt-1 line-clamp-2">{message.message}</p>
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>
        </div>

        <div className="flex flex-col gap-6">
          <SectionCard title="Quick actions">
            <div className="flex flex-col gap-0.5">
              {quickActions.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="group flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-secondary hover:text-foreground hover:bg-white/5 transition-colors"
                >
                  <Icon className="w-4 h-4 shrink-0 text-secondary group-hover:text-electric transition-colors" />
                  <span className="flex-1">{label}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Site status">
            <div className="flex flex-col divide-y divide-border">
              <StatusRow label="API connection" value="Connected" />
              <StatusRow
                label="Published projects"
                value={`${data.publishedProjects} of ${data.projectsCount}`}
                ok={data.projectsCount > 0 ? data.publishedProjects > 0 : true}
                attention={data.projectsCount > 0 && data.publishedProjects === 0}
              />
              <StatusRow
                label="Unread messages"
                value={String(data.unreadMessages)}
                ok={data.unreadMessages === 0}
                attention={data.unreadMessages > 0}
              />
              <StatusRow label="Media files" value={String(data.mediaCount)} />
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
