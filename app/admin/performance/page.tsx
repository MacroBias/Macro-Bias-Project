"use client";

import {
  useAdminSession,
  usePerformanceYearly,
} from "@/components/admin/admin-hooks";
import {
  compactInputClass,
  inputClass,
  labelClass,
  panelClass,
  sectionHeaderClass,
} from "@/components/admin/admin-styles";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function PerformanceAdminPage() {
  const email = useAdminSession();
  const {
    performanceYearly,
    performanceYearlyError,
    isSavingPerformanceYearly,
    performanceDraft,
    editingPerformanceId,
    editingPerformance,
    setEditingPerformance,
    setEditingPerformanceId,
    handlePerformanceDraftChange,
    handleAddPerformanceYearly,
    handleEditPerformance,
    handleSavePerformance,
    handleDeletePerformance,
  } = usePerformanceYearly(email);

  return (
    <div className="space-y-6">
      <div className={sectionHeaderClass}>
        <div>
          <h2 className="text-lg font-semibold text-white">Performance</h2>
          <p className="text-sm text-slate-400">
            Add, edit, or delete yearly performance rows.
          </p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
        <div className={panelClass}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">New Yearly Row</p>
              <p className="text-xs text-slate-500">
                Enter the annual Macro Bias and S&P 500 performance.
              </p>
            </div>
          </div>
          <div className="mt-4 grid gap-4">
            <label className={labelClass}>
              Year
              <input
                type="number"
                step="1"
                value={performanceDraft.year}
                onChange={(event) =>
                  handlePerformanceDraftChange("year", event.target.value)
                }
                className={inputClass}
              />
            </label>
            <label className={labelClass}>
              Macro Bias (%)
              <input
                type="number"
                step="0.01"
                value={performanceDraft.macroBias}
                onChange={(event) =>
                  handlePerformanceDraftChange("macroBias", event.target.value)
                }
                className={inputClass}
              />
            </label>
            <label className={labelClass}>
              S&P 500 (%)
              <input
                type="number"
                step="0.01"
                value={performanceDraft.sp500}
                onChange={(event) =>
                  handlePerformanceDraftChange("sp500", event.target.value)
                }
                className={inputClass}
              />
            </label>
            <label className={labelClass}>
              Alpha (%)
              <input
                type="number"
                step="0.01"
                value={performanceDraft.alpha}
                onChange={(event) =>
                  handlePerformanceDraftChange("alpha", event.target.value)
                }
                className={inputClass}
              />
            </label>
          </div>
          <div className="mt-4 flex items-center justify-end">
            <button
              type="button"
              onClick={handleAddPerformanceYearly}
              disabled={isSavingPerformanceYearly}
              className="rounded-xl border border-slate-800/60 bg-[#111827] px-4 py-3 text-sm text-slate-200 transition hover:border-slate-700/80 hover:bg-[#0b1527] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSavingPerformanceYearly ? "Saving..." : "Add row"}
            </button>
          </div>
          {performanceYearlyError ? (
            <div className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {performanceYearlyError}
            </div>
          ) : null}
        </div>

        <div className={panelClass}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Yearly Performance</p>
              <p className="text-xs text-slate-500">
                Review and manage existing yearly rows.
              </p>
            </div>
          </div>
          <div className="mt-4 overflow-hidden rounded-xl border border-slate-800/60">
            <table className="min-w-full table-fixed divide-y divide-slate-800 text-sm">
              <thead className="bg-[#0f1d33] text-left text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Year</th>
                  <th className="px-4 py-3 font-medium">Macro Bias</th>
                  <th className="px-4 py-3 font-medium">S&P 500</th>
                  <th className="px-4 py-3 font-medium">Alpha</th>
                  <th className="px-4 py-3 font-medium text-right whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-[#0a1628]">
                {performanceYearly.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                      No performance rows yet.
                    </td>
                  </tr>
                ) : (
                  performanceYearly.map((row) => {
                    const isEditing = editingPerformanceId === row.id;
                    return (
                      <tr key={row.id}>
                        <td className="px-4 py-3 text-slate-200">
                          {isEditing ? (
                            <input
                              type="number"
                              step="1"
                              value={editingPerformance?.year ?? ""}
                              onChange={(event) =>
                                setEditingPerformance((prev) =>
                                  prev ? { ...prev, year: event.target.value } : prev
                                )
                              }
                              className={compactInputClass}
                            />
                          ) : (
                            row.year
                          )}
                        </td>
                        <td className="px-4 py-3 text-slate-200">
                          {isEditing ? (
                            <input
                              type="number"
                              step="0.01"
                              value={editingPerformance?.macroBias ?? ""}
                              onChange={(event) =>
                                setEditingPerformance((prev) =>
                                  prev
                                    ? { ...prev, macroBias: event.target.value }
                                    : prev
                                )
                              }
                              className={compactInputClass}
                            />
                          ) : (
                            row.macroBias
                          )}
                        </td>
                        <td className="px-4 py-3 text-slate-200">
                          {isEditing ? (
                            <input
                              type="number"
                              step="0.01"
                              value={editingPerformance?.sp500 ?? ""}
                              onChange={(event) =>
                                setEditingPerformance((prev) =>
                                  prev ? { ...prev, sp500: event.target.value } : prev
                                )
                              }
                              className={compactInputClass}
                            />
                          ) : (
                            row.sp500
                          )}
                        </td>
                        <td className="px-4 py-3 text-slate-200">
                          {isEditing ? (
                            <input
                              type="number"
                              step="0.01"
                              value={editingPerformance?.alpha ?? ""}
                              onChange={(event) =>
                                setEditingPerformance((prev) =>
                                  prev ? { ...prev, alpha: event.target.value } : prev
                                )
                              }
                              className={compactInputClass}
                            />
                          ) : (
                            row.alpha
                          )}
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          {isEditing ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => handleSavePerformance(row.id)}
                                className="rounded-lg border border-slate-700/60 px-2 py-1 text-xs text-slate-200 hover:border-slate-600/80"
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingPerformanceId(null);
                                  setEditingPerformance(null);
                                }}
                                className="rounded-lg border border-slate-700/60 px-2 py-1 text-xs text-slate-400 hover:text-slate-200"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => handleEditPerformance(row)}
                                className="rounded-lg border border-slate-700/60 px-2 py-1 text-xs text-slate-200 hover:border-slate-600/80"
                              >
                                Edit
                              </button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <button
                                    type="button"
                                    className="rounded-lg border border-red-500/40 px-2 py-1 text-xs text-red-300 hover:border-red-400"
                                  >
                                    Delete
                                  </button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="border-slate-800/60 bg-[#0a1628] text-slate-100">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Delete this row?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription className="text-slate-400">
                                      This action cannot be undone. The yearly performance
                                      row will be removed.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel className="border-slate-700/60 bg-transparent text-slate-200 hover:bg-slate-800/40">
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeletePerformance(row.id)}
                                      className="bg-red-500 text-white hover:bg-red-400"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
