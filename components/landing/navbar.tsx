"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSessionEventName, isSessionValid } from "@/lib/auth";
import { useAccessModal } from "./access-modal";

export function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const { openModal } = useAccessModal();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const syncSession = () => setHasSession(isSessionValid());
    const sessionEvent = getSessionEventName();
    syncSession();

    window.addEventListener("focus", syncSession);
    window.addEventListener("storage", syncSession);
    window.addEventListener(sessionEvent, syncSession);
    document.addEventListener("visibilitychange", syncSession);

    return () => {
      window.removeEventListener("focus", syncSession);
      window.removeEventListener("storage", syncSession);
      window.removeEventListener(sessionEvent, syncSession);
      document.removeEventListener("visibilitychange", syncSession);
    };
  }, []);

  const ctaLabel = hasSession ? "Login" : "Get Access";

  const handleCtaClick = () => {
    if (hasSession) {
      router.push("/app/home");
      return;
    }
    openModal();
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#030712]/90 backdrop-blur-md border-b border-slate-800" : "bg-transparent"
      }`}
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <nav className="mx-auto flex h-14 min-h-14 max-w-7xl items-center justify-between px-4 sm:h-20 sm:min-h-20 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-90"
        >
          <div className="relative h-8 w-10 shrink-0 sm:h-10 sm:w-[52px] md:h-12 md:w-[60px]">
            <Image
              src="/logo.png"
              alt=""
              width={60}
              height={48}
              className="object-contain"
              aria-hidden="true"
            />
          </div>
          <span className="text-base font-semibold tracking-wide text-white sm:text-lg">
            MACRO BIAS
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {/* Mobile CTA - always visible on small screens */}
          <button
            type="button"
            onClick={handleCtaClick}
            className="inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-full border border-[#1f2937] bg-[#020617]/80 px-4 py-2.5 text-xs font-medium text-[#e5e7eb] shadow-sm backdrop-blur-sm transition-colors hover:border-[#3b82f6] hover:text-white md:hidden touch-manipulation"
          >
            {ctaLabel}
            <svg
              className="h-3 w-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </button>

          {/* Desktop navigation & CTA */}
          <div className="hidden items-center gap-6 md:flex md:gap-10">
            <a
              href="#methodology"
              className="text-sm font-medium text-slate-400 transition-colors hover:text-white"
            >
              Methodology
            </a>
            <a
              href="#pillars"
              className="text-sm font-medium text-slate-400 transition-colors hover:text-white"
            >
              Pillars
            </a>
            <button
              onClick={handleCtaClick}
              className="group flex items-center gap-2 text-sm font-medium text-[#60a5fa] transition-colors hover:text-[#93c5fd] cursor-pointer"
            >
              {ctaLabel}
              <svg
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
