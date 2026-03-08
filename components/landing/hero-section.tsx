"use client";

import { useEffect, useRef, useState } from "react";

function DotPattern() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
      draw();
    };

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      // Create mountain-like halftone pattern
      const spacing = 8;
      const maxRadius = 2.5;

      for (let x = 0; x < w; x += spacing) {
        for (let y = 0; y < h; y += spacing) {
          // Create multiple "peaks"
          const peak1 = Math.exp(-Math.pow((x - w * 0.5) / 200, 2) - Math.pow((y - h * 0.4) / 150, 2));
          const peak2 = Math.exp(-Math.pow((x - w * 0.35) / 150, 2) - Math.pow((y - h * 0.5) / 120, 2));
          const peak3 = Math.exp(-Math.pow((x - w * 0.65) / 180, 2) - Math.pow((y - h * 0.45) / 140, 2));
          const peak4 = Math.exp(-Math.pow((x - w * 0.8) / 100, 2) - Math.pow((y - h * 0.55) / 80, 2));

          const intensity = Math.max(peak1, peak2, peak3, peak4);

          if (intensity > 0.05) {
            const radius = maxRadius * intensity;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            // Blue-tinted dots
            ctx.fillStyle = `rgba(59, 130, 246, ${intensity * 0.5})`;
            ctx.fill();
          }
        }
      }
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full opacity-70"
      style={{ width: "100%", height: "100%" }}
    />
  );
}

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-dvh overflow-hidden bg-[#030712]">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-[#030712] via-[#030712] to-[#0a1628]" />
      
      {/* Dot pattern background */}
      <div className="absolute inset-0 top-20">
        <DotPattern />
      </div>

      {/* Content - safe area for notched devices */}
      <div
        className="relative z-10 mx-auto flex min-h-dvh max-w-7xl flex-col justify-center px-4 pb-12 pt-32 sm:px-6 sm:pb-20 sm:pt-40 lg:px-8 lg:pb-24 lg:pt-56"
        style={{
          paddingTop: "max(8rem, calc(8rem + env(safe-area-inset-top)))",
          paddingLeft: "max(1rem, env(safe-area-inset-left))",
          paddingRight: "max(1rem, env(safe-area-inset-right))",
        }}
      >
        <div
          className={`max-w-3xl transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
          }`}
        >
          <h1 className="mb-6 text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="font-serif italic text-[#60a5fa]">Regime-Driven</span> Exposure
            <br />
            for Modern
            <br />
            <span className="font-serif italic text-[#60a5fa]">Portfolios</span>
          </h1>

          <div
            className={`mt-4 flex items-center gap-3 transition-all delay-300 duration-1000 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <div className="flex h-5 w-7 items-center justify-center rounded-sm bg-[#3b82f6] text-[8px] font-bold text-white">
              MB
            </div>
            <span className="text-sm font-medium uppercase tracking-widest text-slate-400">
              Systematic Macro Overlay
            </span>
          </div>
        </div>
      </div>

      {/* Scroll indicator - Animated Mouse */}
      <div className="absolute bottom-14 left-1/2 -translate-x-1/2">
        <div className="flex flex-col items-center gap-4">
          {/* Mouse shape */}
          <div className="relative w-6 h-10 rounded-full border-2 border-slate-500/70 flex justify-center">
            {/* Scroll wheel/dot - animated */}
            <div className="absolute top-2 w-1 h-2 rounded-full bg-slate-400 animate-scroll-mouse" />
          </div>
          <span className="text-[10px] uppercase tracking-widest text-slate-500">Scroll</span>
        </div>
      </div>
    </section>
  );
}
