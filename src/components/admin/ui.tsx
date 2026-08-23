"use client";

import { cn } from "@/lib/utils";

export const inputCls =
  "w-full bg-surface border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-secondary/50 focus:outline-none focus:border-electric/60 transition-colors";

export const btnPrimary =
  "px-5 py-2.5 rounded-md bg-electric text-background font-bold text-sm tracking-wide hover:bg-electric/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

export const btnSecondary =
  "px-5 py-2.5 rounded-md bg-surface border border-border text-foreground font-bold text-sm hover:border-electric/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

export const btnDanger =
  "px-5 py-2.5 rounded-md bg-red-500/10 border border-red-500/30 text-red-400 font-bold text-sm hover:bg-red-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

export const labelCls =
  "block text-xs font-bold tracking-widest text-secondary uppercase mb-2";

export function Field({
  label,
  hint,
  action,
  children,
}: {
  label: string;
  hint?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between gap-2">
        <label className={cn(labelCls, "mb-0")}>{label}</label>
        {action}
      </div>
      {children}
      {hint && <p className="text-xs text-secondary/70 mt-1">{hint}</p>}
    </div>
  );
}

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(inputCls, className)} {...props} />;
}

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(inputCls, "resize-y min-h-24", className)} {...props} />;
}

export function Button({
  variant = "primary",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
}) {
  const base = variant === "primary" ? btnPrimary : variant === "danger" ? btnDanger : btnSecondary;
  return <button className={cn(base, className)} {...props} />;
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center gap-3 group"
      aria-pressed={checked}
    >
      <span
        className={cn(
          "w-10 h-6 rounded-full transition-colors relative shrink-0",
          checked ? "bg-electric" : "bg-border"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 w-5 h-5 rounded-full bg-background shadow transition-transform",
            checked ? "left-[18px]" : "left-0.5"
          )}
        />
      </span>
      {label && (
        <span className="text-sm text-secondary group-hover:text-foreground transition-colors">
          {label}
        </span>
      )}
    </button>
  );
}

export function Spinner({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24">
      <div className="w-8 h-8 rounded-full border-2 border-border border-t-electric animate-spin" />
      <span className="text-xs font-bold tracking-widest text-secondary uppercase">{label}</span>
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight uppercase">
          {title}
        </h1>
        {subtitle && <p className="text-secondary max-w-xl">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}

export function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="w-full bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg px-4 py-3 text-sm">
      {message}
    </div>
  );
}

export function SuccessBanner({ message }: { message: string }) {
  return (
    <div className="w-full bg-electric/10 border border-electric/30 text-electric rounded-lg px-4 py-3 text-sm">
      {message}
    </div>
  );
}

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("bg-surface border border-border rounded-xl p-6", className)}>
      {children}
    </div>
  );
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-20 text-center">
      <p className="font-display font-bold text-xl text-secondary">{title}</p>
      {hint && <p className="text-sm text-secondary/70">{hint}</p>}
    </div>
  );
}

export function ConfirmButton({
  onConfirm,
  children,
  className,
}: {
  onConfirm: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={cn(btnDanger, className)}
      onClick={() => {
        if (window.confirm("Are you sure? This cannot be undone.")) onConfirm();
      }}
    >
      {children}
    </button>
  );
}
