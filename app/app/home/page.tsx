"use client";

import { useEffect, useState } from "react";
import { StatCard } from "@/components/ui/stat-card";
import { EquityCurveChart } from "@/components/charts/equity-curve-chart";

function RegimeBadgeLarge({
  regime,
}: {
  regime: "RISK-ON" | "NEUTRAL" | "RISK-OFF";
}) {
  const colors = {
    "RISK-ON": "bg-positive/20 text-positive border-positive/30",
    NEUTRAL: "bg-slate-500/20 text-slate-300 border-slate-500/30",
    "RISK-OFF": "bg-negative/20 text-negative border-negative/30",
  };

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 ${colors[regime]}`}
    >
      <div
        className={`h-2 w-2 rounded-full ${
          regime === "RISK-ON"
            ? "bg-positive"
            : regime === "RISK-OFF"
              ? "bg-negative"
              : "bg-slate-300"
        }`}
      />
      <span className="text-lg font-bold tracking-wide">{regime}</span>
    </div>
  );
}

type HomepageMetrics = {
  macroBiasScore: number;
  sp500Ytd: number;
  macroBiasYtd: number;
  tenYearCagr: number;
  fiveYearCagr: number;
  twoYearCagr: number;
  maxDrawdownMacroBias: number;
  maxDrawdownSp500: number;
  atAGlance: string;
};

const defaultMetrics: HomepageMetrics = {
  macroBiasScore: 0.73,
  sp500Ytd: 15.3,
  macroBiasYtd: 27.8,
  tenYearCagr: 18.4,
  fiveYearCagr: 22.1,
  twoYearCagr: 31.2,
  maxDrawdownMacroBias: -18.7,
  maxDrawdownSp500: -33.9,
  atAGlance:
    "Current macro conditions favor equity exposure. Liquidity conditions are supportive, volatility is contained, and economic indicators suggest continued growth momentum. Consider maintaining or increasing leveraged long positions according to your risk parameters.",
};

const deriveRegime = (score: number) => {
  if (score > 0.5) return "RISK-ON";
  if (score < -0.5) return "RISK-OFF";
  return "NEUTRAL";
};

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);
  const [metrics, setMetrics] = useState<HomepageMetrics>(defaultMetrics);
  const [metricsError, setMetricsError] = useState<string | null>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const loadMetrics = async () => {
      const response = await fetch("/api/admin/metrics");
      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        setMetricsError(payload?.message || "Unable to load metrics.");
        return;
      }

      const payload = await response.json().catch(() => null);
      if (payload?.metrics) {
        setMetrics({
          macroBiasScore: payload.metrics.macroBiasScore,
          sp500Ytd: payload.metrics.sp500Ytd,
          macroBiasYtd: payload.metrics.macroBiasYtd,
          tenYearCagr: payload.metrics.tenYearCagr,
          fiveYearCagr: payload.metrics.fiveYearCagr,
          twoYearCagr: payload.metrics.twoYearCagr,
          maxDrawdownMacroBias: payload.metrics.maxDrawdownMacroBias,
          maxDrawdownSp500: payload.metrics.maxDrawdownSp500,
          atAGlance: payload.metrics.atAGlance,
        });
        setMetricsError(null);
      }
    };

    loadMetrics();
  }, []);

  const formatPercent = (value: number) =>
    `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
  const formatScore = (value: number) => value.toFixed(2);
  const currentRegime = deriveRegime(metrics.macroBiasScore);
  const alpha = metrics.macroBiasYtd - metrics.sp500Ytd;
  const regimeVariant =
    currentRegime === "RISK-ON"
      ? "positive"
      : currentRegime === "RISK-OFF"
        ? "negative"
        : "default";

  return (
    <div
      className={`space-y-8 transition-all duration-500 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
    >
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Executive Overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          30-second snapshot of current macro regime and performance metrics
        </p>
      </div>

      {/* Current regime and score */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-6">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Current Regime
          </p>
          <div className="mt-3">
            <RegimeBadgeLarge regime={currentRegime} />
          </div>
        </div>

        <StatCard
          title="Macro Bias Score"
          value={formatScore(metrics.macroBiasScore)}
          subtitle="Scale: -1 to +1"
          variant={regimeVariant}
        />

        <StatCard
          title="S&P 500 YTD"
          value={formatPercent(metrics.sp500Ytd)}
          subtitle="Benchmark"
        />

        <StatCard
          title="Macro Bias YTD"
          value={formatPercent(metrics.macroBiasYtd)}
          subtitle={`Alpha: ${formatPercent(alpha)}`}
          variant={regimeVariant}
        />
      </div>

      {/* Compound returns */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="10-Year CAGR"
          value={formatPercent(metrics.tenYearCagr)}
          subtitle="Compound Annual Growth"
          variant={regimeVariant}
        />
        <StatCard
          title="5-Year CAGR"
          value={formatPercent(metrics.fiveYearCagr)}
          subtitle="Compound Annual Growth"
          variant={regimeVariant}
        />
        <StatCard
          title="2-Year CAGR"
          value={formatPercent(metrics.twoYearCagr)}
          subtitle="Compound Annual Growth"
          variant={regimeVariant}
        />
      </div>

      {/* Chart and at a glance */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6">
          <h2 className="mb-1 text-lg font-semibold text-foreground">
            Macro Bias vs S&P 500 – Equity Curve
          </h2>
          <p className="mb-4 text-xs text-muted-foreground">
            Backtested index levels starting at 100 (2009–2025)
          </p>
          <EquityCurveChart />
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground">
              At a Glance
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {metrics.atAGlance}
            </p>
            {metricsError ? (
              <p className="mt-2 text-xs text-negative">{metricsError}</p>
            ) : null}
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground">
              Max Drawdown Comparison
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Macro Bias</span>
                <span className="font-mono text-sm font-semibold text-positive">
                  {metrics.maxDrawdownMacroBias}%
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-positive"
                  style={{
                    width: `${Math.abs(metrics.maxDrawdownMacroBias)}%`,
                  }}
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-sm text-muted-foreground">S&P 500</span>
                <span className="font-mono text-sm font-semibold text-negative">
                  {metrics.maxDrawdownSp500}%
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-negative"
                  style={{
                    width: `${Math.abs(metrics.maxDrawdownSp500)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
