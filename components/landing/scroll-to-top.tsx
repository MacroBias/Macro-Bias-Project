"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled more than 400px
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={cn(
        "fixed z-50 flex min-h-11 min-w-11 items-center justify-center rounded-full p-3",
        "bg-primary/90 hover:bg-primary text-primary-foreground",
        "shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30",
        "backdrop-blur-sm border border-primary/20",
        "transition-all duration-300 ease-out touch-manipulation",
        "hover:scale-110 active:scale-95",
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none"
      )}
      style={{
        bottom: "max(1.5rem, env(safe-area-inset-bottom))",
        right: "max(1.5rem, env(safe-area-inset-right))",
      }}
    >
      <ArrowUp className="size-5" />
    </button>
  );
}
