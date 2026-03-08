"use client";

import { format } from "date-fns";
import { useAdminSession, useHomepageMetrics } from "@/components/admin/admin-hooks";
import { deriveRegime } from "@/components/admin/admin-utils";
import {
  inputClass,
  labelClass,
  panelClass,
  sectionHeaderClass,
} from "@/components/admin/admin-styles";

export default function HomepageMetricsPage() {
  const email = useAdminSession();
  const {
    metrics,
    metricsError,
    isSavingMetrics,
    metricsSavedAt,
    handleMetricsChange,
    handleSaveMetrics,
  } = useHomepageMetrics(email);

  return (
    <div className="space-y-6">
      <div className={sectionHeaderClass}>
        <div>
          <h2 className="text-lg font-semibold text-white">Homepage Metrics</h2>
          <p className="text-sm text-slate-400">
            Update the executive overview values shown on the homepage.
          </p>
        </div>
        <div className="text-xs text-slate-500">
          {metricsSavedAt
            ? `Last saved ${format(new Date(metricsSavedAt), "MMM dd, yyyy • HH:mm")}`
            : "Not saved yet"}
        </div>
      </div>

      <div className={panelClass}>
        <div className="grid gap-4 md:grid-cols-3">
          <label className={labelClass}>
            Macro Bias Score
            <input
              type="number"
              step="0.01"
              value={metrics?.macroBiasScore ?? ""}
              onChange={(event) =>
                handleMetricsChange("macroBiasScore", event.target.value)
              }
              className={inputClass}
            />
          </label>
          <label className={labelClass}>
            S&P 500 YTD
            <input
              type="number"
              step="0.1"
              value={metrics?.sp500Ytd ?? ""}
              onChange={(event) => handleMetricsChange("sp500Ytd", event.target.value)}
              className={inputClass}
            />
          </label>
          <label className={labelClass}>
            Macro Bias YTD
            <input
              type="number"
              step="0.1"
              value={metrics?.macroBiasYtd ?? ""}
              onChange={(event) =>
                handleMetricsChange("macroBiasYtd", event.target.value)
              }
              className={inputClass}
            />
          </label>
          <label className={labelClass}>
            10-Year CAGR
            <input
              type="number"
              step="0.1"
              value={metrics?.tenYearCagr ?? ""}
              onChange={(event) =>
                handleMetricsChange("tenYearCagr", event.target.value)
              }
              className={inputClass}
            />
          </label>
          <label className={labelClass}>
            5-Year CAGR
            <input
              type="number"
              step="0.1"
              value={metrics?.fiveYearCagr ?? ""}
              onChange={(event) =>
                handleMetricsChange("fiveYearCagr", event.target.value)
              }
              className={inputClass}
            />
          </label>
          <label className={labelClass}>
            2-Year CAGR
            <input
              type="number"
              step="0.1"
              value={metrics?.twoYearCagr ?? ""}
              onChange={(event) =>
                handleMetricsChange("twoYearCagr", event.target.value)
              }
              className={inputClass}
            />
          </label>
          <label className={labelClass}>
            Max Drawdown (Macro Bias)
            <input
              type="number"
              step="0.1"
              value={metrics?.maxDrawdownMacroBias ?? ""}
              onChange={(event) =>
                handleMetricsChange("maxDrawdownMacroBias", event.target.value)
              }
              className={inputClass}
            />
          </label>
          <label className={labelClass}>
            Max Drawdown (S&P 500)
            <input
              type="number"
              step="0.1"
              value={metrics?.maxDrawdownSp500 ?? ""}
              onChange={(event) =>
                handleMetricsChange("maxDrawdownSp500", event.target.value)
              }
              className={inputClass}
            />
          </label>
        </div>

        <div className="mt-4">
          <label className={labelClass}>
            At a Glance
            <textarea
              rows={4}
              value={metrics?.atAGlance ?? ""}
              onChange={(event) => handleMetricsChange("atAGlance", event.target.value)}
              className={inputClass}
            />
          </label>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            Derived regime:{" "}
            <span className="font-semibold text-white">
              {metrics ? deriveRegime(Number(metrics.macroBiasScore)) : "Loading..."}
            </span>
          </div>
          <button
            type="button"
            onClick={handleSaveMetrics}
            disabled={isSavingMetrics || !metrics}
            className="rounded-xl border border-slate-800/60 bg-[#111827] px-4 py-3 text-sm text-slate-200 transition hover:border-slate-700/80 hover:bg-[#0b1527] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSavingMetrics ? "Saving..." : "Save metrics"}
          </button>
        </div>

        {metricsError ? (
          <div className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {metricsError}
          </div>
        ) : null}
      </div>
    </div>
  );
}
