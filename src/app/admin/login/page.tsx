"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authApi, tokenStore } from "@/lib/api";
import { Button, ErrorBanner, Field, Input } from "@/components/admin/ui";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (tokenStore.getAccessToken()) {
      router.replace("/admin");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await authApi.login({ email: email.trim(), password });
      router.replace("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <p className="font-display text-4xl font-bold uppercase tracking-tight">
            Rijul<span className="text-electric">.</span>
          </p>
          <p className="text-xs font-bold tracking-widest text-secondary uppercase mt-2">
            Portfolio CMS — Sign in
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-surface border border-border rounded-2xl p-8 flex flex-col gap-5"
        >
          <Field label="Email">
            <Input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@rijuldhakal.com"
            />
          </Field>
          <Field label="Password">
            <Input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </Field>

          {error && <ErrorBanner message={error} />}

          <Button type="submit" disabled={submitting} className="mt-2">
            {submitting ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <p className="text-xs text-secondary/70 text-center mt-6">
          Access is restricted to authorized administrators.
        </p>
      </div>
    </div>
  );
}
