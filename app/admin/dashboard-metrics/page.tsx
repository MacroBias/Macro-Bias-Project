"use client";

import { format } from "date-fns";
import { useAdminSession, useDashboardMetrics } from "@/components/admin/admin-hooks";
import {
  inputClass,
  labelClass,
  panelClass,
  sectionHeaderClass,
} from "@/components/admin/admin-styles";

export default function DashboardMetricsPage() {
  const email = useAdminSession();
  const {
    dashboardMetrics,
    dashboardMetricsError,
    isSavingDashboardMetrics,
    dashboardMetricsSavedAt,
    handleDashboardMetricsChange,
    handleSaveDashboardMetrics,
  } = useDashboardMetrics(email);

  return (
    <div className="space-y-6">
      <div className={sectionHeaderClass}>
        <div>
          <h2 className="text-lg font-semibold text-white">Dashboard Metrics</h2>
          <p className="text-sm text-slate-400">
            Update daily/monthly scores and the dashboard regime explanation.
          </p>
        </div>
        <div className="text-xs text-slate-500">
          {dashboardMetricsSavedAt
            ? `Last saved ${format(new Date(dashboardMetricsSavedAt), "MMM dd, yyyy • HH:mm")}`
            : "Not saved yet"}
        </div>
      </div>

      <div className={panelClass}>
        <div className="grid gap-4 md:grid-cols-3">
          <label className={labelClass}>
            Daily Macro Score
            <input
              type="number"
              step="0.01"
              value={dashboardMetrics?.dailyMacroScore ?? ""}
              onChange={(event) =>
                handleDashboardMetricsChange("dailyMacroScore", event.target.value)
              }
              className={inputClass}
            />
          </label>
          <label className={labelClass}>
            Monthly Macro Score
            <input
              type="number"
              step="0.01"
              value={dashboardMetrics?.monthlyMacroScore ?? ""}
              onChange={(event) =>
                handleDashboardMetricsChange("monthlyMacroScore", event.target.value)
              }
              className={inputClass}
            />
          </label>
        </div>

        <div className="mt-4">
          <label className={labelClass}>
            Regime Explanation
            <textarea
              rows={4}
              value={dashboardMetrics?.regimeExplanation ?? ""}
              onChange={(event) =>
                handleDashboardMetricsChange("regimeExplanation", event.target.value)
              }
              className={inputClass}
            />
          </label>
        </div>

        <div className="mt-4 flex items-center justify-end">
          <button
            type="button"
            onClick={handleSaveDashboardMetrics}
            disabled={isSavingDashboardMetrics || !dashboardMetrics}
            className="rounded-xl border border-slate-800/60 bg-[#111827] px-4 py-3 text-sm text-slate-200 transition hover:border-slate-700/80 hover:bg-[#0b1527] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSavingDashboardMetrics ? "Saving..." : "Save dashboard metrics"}
          </button>
        </div>

        {dashboardMetricsError ? (
          <div className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {dashboardMetricsError}
          </div>
        ) : null}
      </div>
    </div>
  );
}
