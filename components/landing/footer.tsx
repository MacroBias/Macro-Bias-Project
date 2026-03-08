"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSessionEventName, isSessionValid } from "@/lib/auth";
import { useAccessModal } from "./access-modal";

export function Footer() {
  const { openModal } = useAccessModal();
  const [hasSession, setHasSession] = useState(false);
  const router = useRouter();

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
    <footer
      id="contact"
      className="relative w-full overflow-x-clip bg-[#0a1628] pt-10 pb-20 sm:pt-16 sm:pb-24 md:py-32 touch-pan-y"
      style={{
        paddingBottom: "max(5rem, calc(5rem + env(safe-area-inset-bottom)))",
      }}
    >
      {/* Dot pattern background */}
      <div className="absolute inset-0 opacity-30">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="footer-dots"
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1" fill="rgba(59, 130, 246, 0.3)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#footer-dots)" />
        </svg>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-8">
        <div className="flex flex-col items-center text-center">
          {/* Logo */}
          <div className="relative mb-3 h-12 w-[60px] shrink-0 sm:mb-4">
            <Image
              src="/logo.png"
              alt=""
              width={60}
              height={48}
              className="object-contain"
              aria-hidden="true"
            />
          </div>

          <span className="mb-8 text-2xl font-semibold tracking-wider text-white sm:mb-12">
            MACRO BIAS
          </span>

          {/* Info */}
          <div className="mb-8 space-y-1 font-mono text-sm uppercase tracking-wider text-slate-400">
            <p>Macro Bias Research</p>
            <p>Systematic Regime Analysis</p>
            <p>Research & Educational Content</p>
          </div>

          {/* Coordinates style text */}
          <p className="mb-12 font-mono text-sm tracking-wider text-slate-500">
            EST. 2025 | BACKTESTED METHODOLOGY
          </p>

          {/* Get Access / Login Button */}
          <div className="w-full max-w-md">
            <button
              type="button"
              onClick={handleCtaClick}
              className="group flex mx-auto min-h-11 items-center justify-center gap-3 border-b-2 border-[#3b82f6] px-6 py-4 text-sm font-medium uppercase tracking-[0.18em] sm:tracking-widest text-[#60a5fa] transition-all hover:bg-[#3b82f6] hover:text-white cursor-pointer touch-manipulation"
            >
              {ctaLabel}
              <svg
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
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

            <p className="mt-8 text-xs leading-relaxed text-slate-500">
              By continuing, you acknowledge that this platform provides
              research and educational content only. Nothing herein constitutes
              investment advice.
            </p>
          </div>

          {/* Copyright */}
          <div className="mt-16 flex flex-col items-center gap-4 border-t border-slate-700 pt-8">
            <p className="text-sm text-slate-500">
              {new Date().getFullYear()} Macro Bias. Research purposes only.
            </p>
            <div className="flex items-center gap-6 text-xs text-slate-600">
              <a href="/app/legal" className="transition-colors hover:text-slate-400">
                Legal
              </a>
              <a href="/app/framework" className="transition-colors hover:text-slate-400">
                Framework
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
