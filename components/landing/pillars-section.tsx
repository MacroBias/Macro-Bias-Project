"use client";

import { useEffect, useRef, useState } from "react";

const pillars = [
  {
    number: "1",
    title: "Macro Signals",
    description:
      "Quantitative analysis of macroeconomic indicators including yield curves, credit spreads, and economic momentum to assess the broader market environment.",
  },
  {
    number: "2",
    title: "Liquidity Analysis",
    description:
      "Monitoring of central bank policies, money supply metrics, and market liquidity conditions that often precede significant market moves.",
  },
  {
    number: "3",
    title: "Volatility Regimes",
    description:
      "Assessment of market volatility patterns and term structure to identify periods of elevated risk and potential regime transitions.",
  },
];

function DotMapBackground() {
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

      const spacing = 10;
      const maxRadius = 1.5;

      // Create world map-like pattern
      for (let x = 0; x < w; x += spacing) {
        for (let y = 0; y < h; y += spacing) {
          // Create abstract continental shapes
          const noise1 = Math.sin(x * 0.01) * Math.cos(y * 0.015);
          const noise2 = Math.cos(x * 0.008 + 1) * Math.sin(y * 0.012 + 2);
          const noise3 = Math.sin((x + y) * 0.005);
          
          const intensity = (noise1 + noise2 + noise3 + 3) / 6;

          if (intensity > 0.4 && Math.random() > 0.3) {
            const radius = maxRadius * Math.min(intensity, 0.8);
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(96, 165, 250, ${intensity * 0.25})`;
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
      className="absolute inset-0 h-full w-full"
      style={{ width: "100%", height: "100%" }}
    />
  );
}

function useScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.15 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

function PillarCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isAutoReady, setIsAutoReady] = useState(false);
  const { ref, isVisible } = useScrollAnimation();

  const next = () => setActiveIndex((i) => (i + 1) % pillars.length);
  const prev = () => setActiveIndex((i) => (i - 1 + pillars.length) % pillars.length);

  useEffect(() => {
    if (!isVisible) return;
    setActiveIndex(0);
    setIsAutoReady(false);

    // Keep point 1 stable briefly before auto-rotation starts.
    const timer = window.setTimeout(() => {
      setIsAutoReady(true);
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [isVisible]);

  // Auto-scroll every 2.5 seconds, only while visible
  useEffect(() => {
    if (!isVisible || isPaused || !isAutoReady) return;

    const interval = setInterval(() => {
      setActiveIndex((i) => (i + 1) % pillars.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [isVisible, isPaused, isAutoReady]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
      }`}
    >
      <div 
        className="grid items-start gap-12 md:grid-cols-2"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div>
          <h2 className="mb-8 text-4xl font-bold leading-tight text-white md:text-5xl">
            <span className="font-serif italic text-[#60a5fa]">Time-tested</span> principles
            <br />
            with <span className="font-serif italic text-[#60a5fa]">forward-thinking</span>
            <br />
            analytical approaches.
          </h2>
        </div>

        <div className="relative">
          {/* Large number */}
          <div className="absolute -left-4 top-0 text-8xl font-light text-[#3b82f6]/20 md:-left-12">
            {pillars[activeIndex].number}.
          </div>

          <div className="pl-16 pt-12">
            <h3 className="mb-2 text-lg font-semibold text-white">
              {pillars[activeIndex].title}
            </h3>
            <p className="mb-8 leading-relaxed text-slate-400">
              {pillars[activeIndex].description}
            </p>

            {/* Navigation arrows */}
            <div className="flex items-center gap-4">
              <button
                onClick={prev}
                className="flex h-10 w-10 items-center justify-center text-slate-500 transition-colors hover:text-white"
                aria-label="Previous"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 12H5m0 0l6-6m-6 6l6 6"
                  />
                </svg>
              </button>
              <button
                onClick={next}
                className="flex h-10 w-10 items-center justify-center text-slate-500 transition-colors hover:text-white"
                aria-label="Next"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M5 12h14m0 0l-6-6m6 6l-6 6"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PillarsSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <>
      {/* Dark blue section with carousel */}
      <section className="relative overflow-hidden bg-[#0a1628] py-24 sm:py-32">
        <DotMapBackground />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <PillarCarousel />
        </div>
      </section>

      {/* Dark section with pillars grid */}
      <section id="pillars" className="bg-[#030712] py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            ref={ref}
            className={`mb-16 text-center transition-all duration-1000 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <h2 className="text-4xl font-bold text-white md:text-5xl">
              Our Pillars <span className="font-serif italic text-[#60a5fa]">of</span> Analysis
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {pillars.map((pillar, i) => (
              <PillarCard key={pillar.number} pillar={pillar} index={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function PillarCard({
  pillar,
  index,
}: {
  pillar: (typeof pillars)[0];
  index: number;
}) {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={`group relative overflow-hidden border-t-2 border-[#3b82f6]/20 pt-8 transition-all duration-700 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <div className="mb-4 text-6xl font-light text-[#3b82f6]/15 transition-colors group-hover:text-[#3b82f6]/30">
        {pillar.number}
      </div>
      <h3 className="mb-3 text-xl font-semibold text-white">
        {pillar.title}
      </h3>
      <p className="leading-relaxed text-slate-400">{pillar.description}</p>
    </div>
  );
}
