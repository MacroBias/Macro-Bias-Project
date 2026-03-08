"use client";

import React from "react";
import { useState, useEffect, createContext, useContext } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { setSession, validateEmail } from "@/lib/auth";

// Context to manage modal state globally
const ModalContext = createContext<{
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
} | null>(null);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <ModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
      <AccessModal />
    </ModalContext.Provider>
  );
}

export function useAccessModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useAccessModal must be used within ModalProvider");
  }
  return context;
}

function AccessModal() {
  const context = useContext(ModalContext);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const { isOpen, closeModal } = context || { isOpen: false, closeModal: () => {} };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
    }
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, closeModal]);

  useEffect(() => {
    if (!isOpen) {
      setEmail("");
      setIsLoading(false);
      setError("");
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/access-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(payload?.message || "Unable to save your email right now.");
      }

      const isAdmin = Boolean(payload?.isAdmin);
      setSession(email);
      closeModal();
      router.push(isAdmin ? "/admin" : "/app/home");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{
        paddingTop: "max(1rem, env(safe-area-inset-top))",
        paddingRight: "max(1rem, env(safe-area-inset-right))",
        paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
        paddingLeft: "max(1rem, env(safe-area-inset-left))",
      }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#030712]/95 backdrop-blur-sm animate-fade-in"
        onClick={closeModal}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-[400px] animate-fade-in-up max-h-dvh overflow-y-auto">
        {/* Subtle glow behind modal */}
        <div className="absolute -inset-4 bg-[#3b82f6]/5 blur-3xl rounded-full" />
        
        <div className="relative bg-[#0a1628] border border-slate-700/50 overflow-hidden">
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#3b82f6] to-transparent" />
          
          {/* Close button - min 44px touch target */}
          <button
            type="button"
            onClick={closeModal}
            aria-label="Close"
            className="absolute top-4 right-4 flex min-h-11 min-w-11 items-center justify-center p-2 text-slate-500 hover:text-white transition-colors touch-manipulation"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="p-8 pt-10">
            {/* Logo - Same as navbar */}
            <div className="flex justify-center mb-6">
              <div className="flex items-center gap-2.5">
                <div className="relative h-[54px] w-[66px] shrink-0">
                  <Image
                    src="/logo.png"
                    alt=""
                    width={66}
                    height={54}
                    className="object-contain"
                    aria-hidden="true"
                  />
                </div>
                <span className="text-base font-semibold tracking-wide text-white">
                  MACRO BIAS
                </span>
              </div>
            </div>

            {/* Title */}
            <div className="text-center mb-8">
              <h2 className="text-lg font-medium text-white mb-1.5">
                Get Access
              </h2>
              <p className="text-slate-400 text-sm">
                Enter your email to continue
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email input */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-xs font-medium text-slate-400">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 bg-[#030712] border border-slate-700/70 text-white text-base placeholder:text-slate-600 focus:outline-none focus:border-[#3b82f6]/70 focus:ring-1 focus:ring-[#3b82f6]/30 transition-all min-h-11"
                  autoFocus
                />
                {error && (
                  <p className="text-xs text-red-400 mt-1.5">{error}</p>
                )}
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full min-h-11 py-3 bg-[#3b82f6] hover:bg-[#2563eb] text-white text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 touch-manipulation"
              >
                {isLoading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Saving access...
                  </>
                ) : (
                  "Continue"
                )}
              </button>

                {/* Divider */}
                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-800" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-3 bg-[#0a1628] text-[10px] text-slate-500 uppercase tracking-wider">
                      What you get
                    </span>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-2.5">
                  {[
                    { label: "Regime detection signals", desc: "Real-time macro regime identification" },
                    { label: "Live market feeds", desc: "Institutional-grade data streams" },
                    { label: "Analytics dashboard", desc: "Comprehensive portfolio insights" },
                  ].map((feature) => (
                    <div key={feature.label} className="flex items-start gap-3 py-2">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#3b82f6]/10 flex items-center justify-center mt-0.5">
                        <svg className="w-3 h-3 text-[#60a5fa]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm text-white">{feature.label}</div>
                        <div className="text-xs text-slate-500">{feature.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </form>
          </div>

          {/* Bottom accent line */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
        </div>
      </div>
    </div>
  );
}
