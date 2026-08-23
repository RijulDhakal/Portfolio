import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center gap-8 px-4 text-center">
      <span className="font-display text-8xl md:text-9xl font-bold tracking-tighter text-electric">404</span>
      <h1 className="font-display text-2xl md:text-4xl font-bold uppercase tracking-tight">
        This page doesn&apos;t exist.
      </h1>
      <p className="text-secondary max-w-md">
        The page you are looking for may have been moved or never existed.
      </p>
      <Link
        href="/"
        className="px-8 py-3 rounded-full bg-electric text-background font-bold tracking-wide hover:bg-electric/90 transition-colors"
      >
        Back to Home
      </Link>
    </main>
  );
}
