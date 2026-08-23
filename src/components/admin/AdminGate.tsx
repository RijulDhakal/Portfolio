"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authApi, tokenStore } from "@/lib/api";

export default function AdminGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function verify() {
      if (!tokenStore.getAccessToken()) {
        router.replace("/admin/login");
        return;
      }
      try {
        // Validate the stored token with the backend; a stale/forged
        // localStorage token must not render the admin shell.
        const user = await authApi.me();
        if (!cancelled) {
          tokenStore.setUser(user);
          setChecked(true);
        }
      } catch {
        tokenStore.clear();
        router.replace("/admin/login");
      }
    }
    verify();
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (!checked) return null;
  return <>{children}</>;
}
