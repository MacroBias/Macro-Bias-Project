"use client";

import { useState, useEffect } from "react";
import { StatCard } from "@/components/ui/stat-card";
import { cn } from "@/lib/utils";

type DashboardMetrics = {
  dailyMacroScore: number;
  monthlyMacroScore: number;
  regimeExplanation: string;
};

type Position = {
  id: string;
  exposureType: string;
  instrument: string;
  entryPrice: number;
  stopLoss: number;
  positionSize: number;
  unrealizedPnL: number;
  isActive: boolean;
  isInRunProgression: boolean;
  runProgressionOrder: number | null;
  createdAt?: string;
};

type Product = {
  id: string;
  exposureType: "Long" | "Short";
  name: string;
  isin: string;
  liquidity: string;
  factsheetLink: string;
  leverage: string;
};

function leverageRank(leverage: string): number {
  const value = Number.parseFloat(leverage.replace(/[^0-9.]/g, ""));
  return Number.isFinite(value) ? value : Number.POSITIVE_INFINITY;
}

function normalizeLiquidityLabel(liquidity: string): string {
  const normalized = liquidity.trim().toLowerCase();
  return normalized === "very low liquidity" ? "Very low liquidity" : liquidity;
}

function liquidityRank(liquidity: string): number {
  const label = normalizeLiquidityLabel(liquidity).trim().toLowerCase();
  if (label === "high") return 0;
  if (label === "medium") return 1;
  if (label === "low") return 2;
  if (label === "very low liquidity") return 3;
  return 4;
}

const defaultDashboardMetrics: DashboardMetrics = {
  dailyMacroScore: 0.68,
  monthlyMacroScore: 0.71,
  regimeExplanation:
    "Current macro conditions favor equity exposure. Liquidity conditions are supportive, volatility is contained, and economic indicators suggest continued growth momentum. Consider maintaining or increasing leveraged long positions according to your risk parameters.",
};

function PositionsTable({
  positions,
}: {
  positions: Position[];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px]">
        <thead>
          <tr className="border-b border-border">
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Exposure Type
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Instrument / Product
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Entry Price
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Stop Loss
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Position Size
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Unrealized P&L
            </th>
          </tr>
        </thead>
        <tbody>
          {positions.map((position) => {
            return (
              <tr
                key={position.id}
                className="border-b border-border/50 transition-colors hover:bg-secondary/30"
              >
                <td className="px-4 py-3 text-sm text-foreground">
                  {position.exposureType}
                </td>
                <td className="px-4 py-3 text-sm text-foreground">
                  {position.instrument}
                </td>
                <td className="px-4 py-3 text-right font-mono text-sm text-foreground">
                  ${position.entryPrice.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-right font-mono text-sm text-foreground">
                  ${position.stopLoss.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-right font-mono text-sm text-foreground">
                  ${position.positionSize.toLocaleString()}
                </td>
                <td
                  className={cn(
                    "px-4 py-3 text-right font-mono text-sm font-semibold",
                    position.unrealizedPnL >= 0 ? "text-positive" : "text-negative"
                  )}
                >
                  {position.unrealizedPnL >= 0 ? "+" : ""}$
                  {position.unrealizedPnL.toFixed(2)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function ProductsTable({ products, type }: { products: Product[]; type: string }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px]">
        <thead>
          <tr className="border-b border-border">
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Name
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              ISIN
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Leverage
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Liquidity
            </th>
            <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Factsheet
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr
              key={product.id}
              className="border-b border-border/50 transition-colors hover:bg-secondary/30"
            >
              <td className="px-4 py-3 text-sm text-foreground">
                {product.name}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                {product.isin}
              </td>
              <td className="px-4 py-3">
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs font-medium",
                    type === "Long"
                      ? "bg-positive/20 text-positive"
                      : "bg-negative/20 text-negative"
                  )}
                >
                  {type} {product.leverage}
                </span>
              </td>
              <td className="px-4 py-3">
                <span
                  className={cn(
                    "text-sm",
                    product.liquidity === "High" && "text-positive",
                    product.liquidity === "Medium" && "text-amber-400",
                    product.liquidity === "Low" && "text-orange-400",
                    normalizeLiquidityLabel(product.liquidity) ===
                      "Very low liquidity" && "text-negative"
                  )}
                >
                  {normalizeLiquidityLabel(product.liquidity)}
                </span>
              </td>
              <td className="px-4 py-3 text-center">
                <a
                  href={product.factsheetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-400 transition-colors hover:text-blue-300"
                >
                  View
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function DashboardPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [metrics, setMetrics] = useState<DashboardMetrics>(defaultDashboardMetrics);
  const [metricsError, setMetricsError] = useState<string | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [positionsError, setPositionsError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [activeProductTab, setActiveProductTab] = useState<"Long" | "Short">("Long");

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const loadMetrics = async () => {
      const response = await fetch("/api/admin/dashboard-metrics");
      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        setMetricsError(payload?.message || "Unable to load dashboard metrics.");
        return;
      }
      const payload = await response.json().catch(() => null);
      if (payload?.metrics) {
        setMetrics({
          dailyMacroScore: payload.metrics.dailyMacroScore,
          monthlyMacroScore: payload.metrics.monthlyMacroScore,
          regimeExplanation: payload.metrics.regimeExplanation,
        });
        setMetricsError(null);
      }
    };

    const loadPositions = async () => {
      const response = await fetch("/api/admin/positions");
      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        setPositionsError(payload?.message || "Unable to load positions.");
        return;
      }
      const payload = await response.json().catch(() => null);
      setPositions(payload?.positions ?? []);
      setPositionsError(null);
    };

    const loadProducts = async () => {
      const response = await fetch("/api/admin/products");
      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        setProductsError(payload?.message || "Unable to load products.");
        return;
      }
      const payload = await response.json().catch(() => null);
      setProducts(payload?.products ?? []);
      setProductsError(null);
    };

    loadMetrics();
    loadPositions();
    loadProducts();
  }, []);

  const scoreVariant = (score: number) => {
    if (score > 0.5) return "positive";
    if (score < -0.5) return "negative";
    return "default";
  };
  const activePosition = positions.find((position) => position.isActive) ?? null;
  const orderedRunProgression = [...positions]
    .filter((position) => position.isInRunProgression)
    .sort((a, b) => {
      const aOrder = a.runProgressionOrder ?? Number.POSITIVE_INFINITY;
      const bOrder = b.runProgressionOrder ?? Number.POSITIVE_INFINITY;
      if (aOrder !== bOrder) return aOrder - bOrder;
      return (a.createdAt ?? "").localeCompare(b.createdAt ?? "");
    });
  const runProgression = activePosition
    ? [activePosition, ...orderedRunProgression.filter((p) => p.id !== activePosition.id)]
    : orderedRunProgression;
  const sortedProducts = [...products].sort((a, b) => {
    if (a.exposureType === b.exposureType) {
      const leverageDiff = leverageRank(a.leverage) - leverageRank(b.leverage);
      if (leverageDiff !== 0) return leverageDiff;
      return liquidityRank(a.liquidity) - liquidityRank(b.liquidity);
    }
    return a.exposureType.localeCompare(b.exposureType);
  });

  return (
    <div
      className={`space-y-8 transition-all duration-500 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
    >
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Operational Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage positions and monitor exposure across instruments
        </p>
      </div>

      {/* Score cards and regime explanation */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Daily Macro Score"
          value={metrics.dailyMacroScore.toFixed(2)}
          subtitle="Updated daily"
          variant={scoreVariant(metrics.dailyMacroScore)}
        />
        <StatCard
          title="Monthly Macro Score"
          value={metrics.monthlyMacroScore.toFixed(2)}
          subtitle="30-day average"
          variant={scoreVariant(metrics.monthlyMacroScore)}
        />
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Regime Explanation
          </h3>
          <p className="text-sm leading-relaxed text-foreground">
            {metrics.regimeExplanation}
          </p>
          {metricsError ? (
            <p className="mt-2 text-xs text-negative">{metricsError}</p>
          ) : null}
        </div>
      </div>

      {/* Current positioning table */}
      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border p-6">
          <h2 className="text-lg font-semibold text-foreground">
            Current Active Position
          </h2>
          <p className="text-sm text-muted-foreground">
            One active position is shown at a time. Earlier runs stay visible below.
          </p>
        </div>
        <PositionsTable positions={activePosition ? [activePosition] : []} />
        <div className="border-t border-border px-6 py-4">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Run progression
          </h3>
          <div className="mt-3 space-y-2">
            {runProgression.map((position) => (
              <p key={position.id} className="text-sm text-foreground">
                <span className="font-medium">{position.exposureType}</span> opened at{" "}
                <span className="font-mono">${position.entryPrice.toFixed(2)}</span>, stop at{" "}
                <span className="font-mono">${position.stopLoss.toFixed(2)}</span>, profit:{" "}
                <span
                  className={cn(
                    "font-mono font-semibold",
                    position.unrealizedPnL >= 0 ? "text-positive" : "text-negative"
                  )}
                >
                  {position.unrealizedPnL >= 0 ? "+" : ""}$
                  {position.unrealizedPnL.toFixed(2)}
                </span>
              </p>
            ))}
            {!activePosition && !positionsError ? (
              <p className="text-sm text-muted-foreground">No active position selected.</p>
            ) : null}
            {runProgression.length === 0 && !positionsError ? (
              <p className="text-sm text-muted-foreground">
                No run progression positions selected.
              </p>
            ) : null}
          </div>
        </div>
        {positionsError ? (
          <p className="px-6 pb-6 text-xs text-negative">{positionsError}</p>
        ) : null}
      </div>

      {/* Product lists */}
      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border p-6">
          <h2 className="text-lg font-semibold text-foreground">
            Products by Exposure Type
          </h2>
          <p className="text-sm text-muted-foreground">
            Leveraged products ordered from 2x to 6x within each side
          </p>
        </div>

        <div className="flex border-b border-border">
          <button
            type="button"
            onClick={() => setActiveProductTab("Long")}
            className={cn(
              "min-h-11 flex-1 px-4 py-3 text-sm font-medium transition-colors touch-manipulation sm:flex-none sm:px-6",
              activeProductTab === "Long"
                ? "border-b-2 border-positive text-positive"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Long Products
          </button>
          <button
            type="button"
            onClick={() => setActiveProductTab("Short")}
            className={cn(
              "min-h-11 flex-1 px-4 py-3 text-sm font-medium transition-colors touch-manipulation sm:flex-none sm:px-6",
              activeProductTab === "Short"
                ? "border-b-2 border-negative text-negative"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Short Products
          </button>
        </div>

        <ProductsTable
          products={sortedProducts.filter(
            (product) => product.exposureType === activeProductTab
          )}
          type={activeProductTab}
        />
        {productsError ? (
          <p className="px-6 pb-6 text-xs text-negative">{productsError}</p>
        ) : null}
      </div>
    </div>
  );
}
