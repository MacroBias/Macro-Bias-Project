"use client";

import { useEffect, useRef, useState } from "react";

function useScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15, rootMargin: "-50px" }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

function DotPortrait({ position }: { position: "left" | "right" }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maskDataRef = useRef<{
    data: Uint8ClampedArray;
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const maskCanvas = document.createElement("canvas");
    const maskCtx = maskCanvas.getContext("2d");
    if (!maskCtx) return;

    let animationId = 0;

    const drawSP500 = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      const centerX = w * 0.5;
      const centerY = h * 0.5;
      const size = Math.min(w, h) * 0.28;
      
      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      
      // "S&P" text - large and bold
      ctx.font = `900 ${size}px "Arial Black", "Segoe UI", sans-serif`;
      ctx.fillText("S&P", centerX, centerY - size * 0.35);
      
      // "500" text - slightly smaller below
      ctx.font = `900 ${size * 0.9}px "Arial Black", "Segoe UI", sans-serif`;
      ctx.fillText("500", centerX, centerY + size * 0.45);
    };

    const drawMask = (w: number, h: number) => {
      maskCanvas.width = w;
      maskCanvas.height = h;

      maskCtx.setTransform(1, 0, 0, 1, 0, 0);
      maskCtx.clearRect(0, 0, w, h);

      if (position === "left") {
        // Bitcoin logo
        const centerX = w * 0.5 + -w * 0.04;
        const centerY = h * 0.52;
        const size = Math.min(w, h) * 0.72;

        maskCtx.fillStyle = "#fff";
        maskCtx.textAlign = "center";
        maskCtx.textBaseline = "middle";
        maskCtx.font = `900 ${size}px "Arial Black", "Segoe UI", sans-serif`;
        maskCtx.fillText("B", centerX, centerY);

        const barWidth = size * 0.08;
        const barHeight = size * 1.06;
        const barOffset = size * 0.18;
        const barTop = centerY - barHeight / 2;

        maskCtx.fillRect(centerX - barOffset - barWidth / 2, barTop, barWidth, barHeight);
        maskCtx.fillRect(centerX + barOffset - barWidth / 2, barTop, barWidth, barHeight);
      } else {
        // S&P 500 text
        drawSP500(maskCtx, w, h);
      }

      const mask = maskCtx.getImageData(0, 0, w, h);
      maskDataRef.current = { data: mask.data, width: w, height: h };
    };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawMask(width, height);
    };

    const draw = (time: number) => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      const maskData = maskDataRef.current;
      if (!maskData) return;

      ctx.clearRect(0, 0, w, h);

      const spacing = 5;
      const maxRadius = 2.2;
      const colorAlpha = position === "left" ? 0.45 : 0.5;

      for (let x = 0; x < w; x += spacing) {
        for (let y = 0; y < h; y += spacing) {
          const sampleX = Math.min(maskData.width - 1, Math.max(0, Math.round(x)));
          const sampleY = Math.min(maskData.height - 1, Math.max(0, Math.round(y)));
          const idx = (sampleY * maskData.width + sampleX) * 4 + 3;
          const alpha = maskData.data[idx] / 255;

          if (alpha > 0.08) {
            const wave = (Math.sin(time * 0.002 + x * 0.1 + y * 0.06) + 1) * 0.5;
            const intensity = alpha * (0.65 + wave * 0.35);
            const radius = maxRadius * intensity;

            if (radius > 0.3) {
              ctx.beginPath();
              ctx.arc(x, y, radius, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(59, 130, 246, ${intensity * colorAlpha})`;
              ctx.fill();
            }
          }
        }
      }
    };

    const animate = (time: number) => {
      draw(time);
      animationId = window.requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener("resize", resize);
    animationId = window.requestAnimationFrame(animate);
    return () => {
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(animationId);
    };
  }, [position]);

  return (
    <canvas
      ref={canvasRef}
      className="h-64 w-52 md:h-96 md:w-80"
      style={{ width: "100%", maxWidth: "320px", height: "clamp(260px, 72vw, 400px)" }}
    />
  );
}

export function MethodologySection() {
  const section1 = useScrollAnimation();
  const section2 = useScrollAnimation();

  return (
    <section id="methodology" className="bg-[#030712] pt-20 pb-24 sm:pt-28 sm:pb-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* First block - Framework Origin */}
        <div
          ref={section1.ref}
          className="mb-24 grid items-center gap-10 md:mb-40 md:grid-cols-2"
        >
          <div
            className={`transition-all duration-1000 ${
              section1.isVisible
                ? "translate-x-0 opacity-100"
                : "-translate-x-16 opacity-0"
            }`}
          >
            <DotPortrait position="left" />
          </div>

          <div
            className={`transition-all duration-1000 delay-200 ${
              section1.isVisible
                ? "translate-x-0 opacity-100"
                : "translate-x-16 opacity-0"
            }`}
          >
            <div className="mb-6 flex items-baseline gap-4">
              <span className="text-sm text-slate-500">Since</span>
              <span className="font-serif text-4xl text-[#60a5fa]">2025</span>
            </div>

            <div className="border-l-2 border-[#3b82f6]/30 pl-8">
              <h3 className="mb-2 text-2xl font-bold text-white">
                The Macro Bias Framework
              </h3>
              <p className="mb-6 text-xs font-medium uppercase tracking-widest text-slate-500">
                Systematic regime analysis for modern markets
              </p>

              <p className="mb-8 leading-relaxed text-slate-400">
                The Macro Bias methodology combines quantitative macro signals
                with liquidity analysis to identify market regimes. The
                framework provides systematic exposure management through
                Risk-On, Neutral, and Risk-Off classifications, helping
                investors navigate changing market conditions.
              </p>

              <blockquote className="border-l-4 border-[#3b82f6]/40 pl-6">
                <p className="font-serif text-lg italic text-slate-300">
                  {'"'}The goal is not to predict markets, but to adapt to them
                  systematically.{'"'}
                </p>
              </blockquote>
            </div>
          </div>
        </div>

        {/* Second block - Regime Philosophy */}
        <div
          ref={section2.ref}
          className="grid items-center gap-10 md:grid-cols-2"
        >
          <div
            className={`order-2 md:order-1 transition-all duration-1000 delay-200 ${
              section2.isVisible
                ? "translate-x-0 opacity-100"
                : "-translate-x-16 opacity-0"
            }`}
          >
            <h3 className="mb-2 text-2xl font-bold text-white">
              Regime-Based Positioning
            </h3>
            <p className="mb-6 text-xs font-medium uppercase tracking-widest text-slate-500">
              Systematic overlay for portfolio management
            </p>

            <p className="mb-6 leading-relaxed text-slate-400">
              Rather than attempting to time individual market moves, the Macro
              Bias approach focuses on identifying the prevailing regime state.
              By classifying environments into Risk-On, Neutral, and Risk-Off,
              the framework provides a systematic basis for adjusting portfolio
              exposure.
            </p>

            <p className="mb-8 leading-relaxed text-slate-400">
              The methodology synthesizes signals from macro indicators,
              liquidity conditions, and volatility patterns to generate a
              composite score. This score is then translated into actionable
              regime classifications.
            </p>

            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">16+</div>
                <div className="text-xs text-slate-500">Years Backtested</div>
              </div>
              <div className="h-12 w-px bg-slate-700" />
              <div className="text-center">
                <div className="text-3xl font-bold text-white">3</div>
                <div className="text-xs text-slate-500">Regime States</div>
              </div>
              <div className="h-12 w-px bg-slate-700" />
              <div className="text-center">
                <div className="text-3xl font-bold text-white">Daily</div>
                <div className="text-xs text-slate-500">Score Updates</div>
              </div>
            </div>
          </div>

          <div
            className={`order-1 flex justify-end md:order-2 transition-all duration-1000 ${
              section2.isVisible
                ? "translate-x-0 opacity-100"
                : "translate-x-16 opacity-0"
            }`}
          >
            <DotPortrait position="right" />
          </div>
        </div>
      </div>
    </section>
  );
}
