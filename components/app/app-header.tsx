"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getEmail, getInitials, logout } from "@/lib/auth";
import { macroData } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AppSidebar } from "@/components/app/app-sidebar";
import { deriveRegime } from "@/components/admin/admin-utils";

function RegimeBadge({ regime }: { regime: string }) {
  const colors = {
    "RISK-ON": "bg-positive/20 text-positive border-positive/30",
    NEUTRAL: "bg-slate-500/20 text-slate-300 border-slate-500/30",
    "RISK-OFF": "bg-negative/20 text-negative border-negative/30",
  };

  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
        colors[regime as keyof typeof colors] || colors.NEUTRAL
      }`}
    >
      {regime}
    </span>
  );
}

export function AppHeader() {
  const router = useRouter();
  const email = getEmail() || "user@example.com";
  const initials = getInitials(email);
  const [currentRegime, setCurrentRegime] = useState<string>(() =>
    deriveRegime(macroData.macroBiasScore)
  );
  const [isNavOpen, setIsNavOpen] = useState(false);

  useEffect(() => {
    const loadRegime = async () => {
      const response = await fetch("/api/admin/metrics");
      if (!response.ok) return;
      const payload = await response.json().catch(() => null);
      if (payload?.metrics?.macroBiasScore != null) {
        setCurrentRegime(deriveRegime(payload.metrics.macroBiasScore));
      }
    };
    loadRegime();
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 items-center justify-between px-4 sm:h-16 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Sheet open={isNavOpen} onOpenChange={setIsNavOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-border bg-background text-foreground shadow-sm lg:hidden touch-manipulation"
                aria-label="Open navigation"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  fill="none"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="p-0 w-[80vw] max-w-xs"
            >
              <AppSidebar mobile onNavigate={() => setIsNavOpen(false)} />
            </SheetContent>
          </Sheet>

          <Link
            href="/"
            className="flex items-center gap-2 transition-opacity hover:opacity-90 lg:hidden"
          >
            <div className="relative h-8 w-10 shrink-0">
              <Image
                src="/logo.png"
                alt=""
                width={40}
                height={32}
                className="object-contain"
                aria-hidden="true"
              />
            </div>
            <span className="text-sm font-semibold tracking-wide text-foreground">
              MACRO BIAS
            </span>
          </Link>

          <div className="hidden items-center gap-3 lg:flex">
            <span className="text-xs text-muted-foreground">
              Current Regime:
            </span>
            <RegimeBadge regime={currentRegime} />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-xs font-medium text-foreground">
              {initials}
            </div>
            <span className="hidden text-sm text-muted-foreground sm:block">
              {email}
            </span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-muted-foreground hover:text-foreground"
          >
            Log out
          </Button>
        </div>
      </div>
    </header>
  );
}
