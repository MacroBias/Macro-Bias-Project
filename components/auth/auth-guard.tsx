"use client";

import React from "react"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clearSession, getSessionEmail, isSessionValid } from "@/lib/auth";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      setIsChecking(true);
      if (!isSessionValid()) {
        setIsAuthenticated(false);
        setIsChecking(false);
        clearSession();
        router.push("/");
        return;
      }

      const email = getSessionEmail();
      if (!email) {
        setIsAuthenticated(false);
        setIsChecking(false);
        clearSession();
        router.push("/");
        return;
      }

      const response = await fetch("/api/access-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        clearSession();
        setIsAuthenticated(false);
        setIsChecking(false);
        router.push("/");
        return;
      }

      const payload = await response.json().catch(() => null);
      if (!payload?.ok) {
        clearSession();
        setIsAuthenticated(false);
        setIsChecking(false);
        router.push("/");
        return;
      }

      setIsAuthenticated(true);
      setIsChecking(false);
    };

    run();
  }, [router]);

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted-foreground border-t-foreground" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
