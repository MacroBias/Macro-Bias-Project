"use client";

import {
  useAdminSession,
  usePositions,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

export default function PositionsPage() {
  const email = useAdminSession();
  const {
    positions,
    positionsError,
    isSavingPosition,
    positionDraft,
    editingPositionId,
    editingPosition,
    setEditingPosition,
    setEditingPositionId,
    handlePositionDraftChange,
    handleAddPosition,
    handleEditPosition,
    handleSavePosition,
    handleDeletePosition,
  } = usePositions(email);

  return (
    <div className="space-y-6">
      <div className={sectionHeaderClass}>
        <div>
          <h2 className="text-lg font-semibold text-white">Positions</h2>
          <p className="text-sm text-slate-400">
            Add, edit, or delete current positioning rows.
          </p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,280px)_minmax(0,1.7fr)]">
        <div className={panelClass}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">New Position</p>
              <p className="text-xs text-slate-500">Create a new exposure entry.</p>
            </div>
          </div>
          <div className="mt-4 grid gap-4">
            <label className={labelClass}>
              Exposure Type
              <input
                type="text"
                value={positionDraft.exposureType}
                onChange={(event) =>
                  handlePositionDraftChange("exposureType", event.target.value)
                }
                className={inputClass}
              />
            </label>
            <label className={labelClass}>
              Instrument
              <input
                type="text"
                value={positionDraft.instrument}
                onChange={(event) =>
                  handlePositionDraftChange("instrument", event.target.value)
                }
                className={inputClass}
              />
            </label>
            <label className={labelClass}>
              Entry Price
              <input
                type="number"
                step="0.01"
                value={positionDraft.entryPrice}
                onChange={(event) =>
                  handlePositionDraftChange("entryPrice", event.target.value)
                }
                className={inputClass}
              />
            </label>
            <label className={labelClass}>
              Stop Loss
              <input
                type="number"
                step="0.01"
                value={positionDraft.stopLoss}
                onChange={(event) =>
                  handlePositionDraftChange("stopLoss", event.target.value)
                }
                className={inputClass}
              />
            </label>
            <label className={labelClass}>
              Position Size
              <input
                type="number"
                step="1"
                value={positionDraft.positionSize}
                onChange={(event) =>
                  handlePositionDraftChange("positionSize", event.target.value)
                }
                className={inputClass}
              />
            </label>
            <label className={labelClass}>
              Unrealized P&L
              <input
                type="number"
                step="0.01"
                value={positionDraft.unrealizedPnL}
                onChange={(event) =>
                  handlePositionDraftChange("unrealizedPnL", event.target.value)
                }
                className={inputClass}
              />
            </label>
            <label className={`${labelClass} flex-row items-center justify-between`}>
              <span>Active Position</span>
              <input
                type="checkbox"
                checked={positionDraft.isActive}
                onChange={(event) =>
                  handlePositionDraftChange("isActive", event.target.checked)
                }
                className="h-4 w-4 accent-slate-300"
              />
            </label>
            <label className={`${labelClass} flex-row items-center justify-between`}>
              <span>Include In Run Progression</span>
              <input
                type="checkbox"
                checked={positionDraft.isInRunProgression}
                onChange={(event) =>
                  handlePositionDraftChange("isInRunProgression", event.target.checked)
                }
                className="h-4 w-4 accent-slate-300"
              />
            </label>
          </div>
          <div className="mt-4 flex items-center justify-end">
            <button
              type="button"
              onClick={handleAddPosition}
              disabled={isSavingPosition}
              className="rounded-xl border border-slate-800/60 bg-[#111827] px-4 py-3 text-sm text-slate-200 transition hover:border-slate-700/80 hover:bg-[#0b1527] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSavingPosition ? "Saving..." : "Add position"}
            </button>
          </div>
          {positionsError ? (
            <div className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {positionsError}
            </div>
          ) : null}
        </div>

        <div className={panelClass}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Open Positions</p>
              <p className="text-xs text-slate-500">
                Review and manage existing positions.
              </p>
            </div>
          </div>
          <div className="mt-4 overflow-hidden rounded-xl border border-slate-800/60">
            <table className="min-w-full table-fixed divide-y divide-slate-800 text-xs">
              <thead className="bg-[#0f1d33] text-left text-[11px] uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="w-[10%] px-2 py-2 font-medium">Exposure</th>
                  <th className="w-[18%] px-2 py-2 font-medium">Instrument</th>
                  <th className="w-[8%] px-2 py-2 font-medium">Entry</th>
                  <th className="hidden w-[8%] px-2 py-2 font-medium lg:table-cell">Stop</th>
                  <th className="w-[9%] px-2 py-2 font-medium">Size</th>
                  <th className="hidden w-[10%] px-2 py-2 font-medium xl:table-cell">
                    Unrealized
                  </th>
                  <th className="hidden w-[8%] px-2 py-2 font-medium lg:table-cell">Active</th>
                  <th className="hidden w-[11%] px-2 py-2 font-medium xl:table-cell">
                    Run Progression
                  </th>
                  <th className="w-[11%] px-2 py-2 font-medium text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-[#0a1628]">
                {positions.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-2 py-4 text-center text-slate-500">
                      No positions yet.
                    </td>
                  </tr>
                ) : (
                  positions.map((position) => {
                    const isEditing = editingPositionId === position.id;
                    return (
                      <tr key={position.id}>
                        <td className="px-2 py-2 text-slate-200">
                          {isEditing ? (
                            <input
                              value={editingPosition?.exposureType ?? ""}
                              onChange={(event) =>
                                setEditingPosition((prev) =>
                                  prev
                                    ? { ...prev, exposureType: event.target.value }
                                    : prev
                                )
                              }
                              className={compactInputClass}
                            />
                          ) : (
                            position.exposureType
                          )}
                        </td>
                        <td className="px-2 py-2 text-slate-200">
                          {isEditing ? (
                            <input
                              value={editingPosition?.instrument ?? ""}
                              onChange={(event) =>
                                setEditingPosition((prev) =>
                                  prev
                                    ? { ...prev, instrument: event.target.value }
                                    : prev
                                )
                              }
                              className={compactInputClass}
                            />
                          ) : (
                            <span className="block truncate">{position.instrument}</span>
                          )}
                        </td>
                        <td className="px-2 py-2 text-slate-200">
                          {isEditing ? (
                            <input
                              type="text"
                              inputMode="decimal"
                              value={editingPosition?.entryPrice ?? ""}
                              onChange={(event) =>
                                setEditingPosition((prev) =>
                                  prev
                                    ? { ...prev, entryPrice: event.target.value }
                                    : prev
                                )
                              }
                              className={compactInputClass}
                            />
                          ) : (
                            position.entryPrice
                          )}
                        </td>
                        <td className="hidden px-2 py-2 text-slate-200 lg:table-cell">
                          {isEditing ? (
                            <input
                              type="text"
                              inputMode="decimal"
                              value={editingPosition?.stopLoss ?? ""}
                              onChange={(event) =>
                                setEditingPosition((prev) =>
                                  prev
                                    ? { ...prev, stopLoss: event.target.value }
                                    : prev
                                )
                              }
                              className={compactInputClass}
                            />
                          ) : (
                            position.stopLoss
                          )}
                        </td>
                        <td className="px-2 py-2 text-slate-200">
                          {isEditing ? (
                            <input
                              type="text"
                              inputMode="numeric"
                              value={editingPosition?.positionSize ?? ""}
                              onChange={(event) =>
                                setEditingPosition((prev) =>
                                  prev
                                    ? { ...prev, positionSize: event.target.value }
                                    : prev
                                )
                              }
                              className={compactInputClass}
                            />
                          ) : (
                            position.positionSize
                          )}
                        </td>
                        <td className="hidden px-2 py-2 text-slate-200 xl:table-cell">
                          {isEditing ? (
                            <input
                              type="text"
                              inputMode="decimal"
                              value={editingPosition?.unrealizedPnL ?? ""}
                              onChange={(event) =>
                                setEditingPosition((prev) =>
                                  prev
                                    ? { ...prev, unrealizedPnL: event.target.value }
                                    : prev
                                )
                              }
                              className={compactInputClass}
                            />
                          ) : (
                            position.unrealizedPnL
                          )}
                        </td>
                        <td className="hidden px-2 py-2 text-slate-200 lg:table-cell">
                          {isEditing ? (
                            <input
                              type="checkbox"
                              checked={editingPosition?.isActive ?? false}
                              onChange={(event) =>
                                setEditingPosition((prev) =>
                                  prev ? { ...prev, isActive: event.target.checked } : prev
                                )
                              }
                              className="h-4 w-4 accent-slate-300"
                            />
                          ) : position.isActive ? (
                            <span className="rounded-full bg-green-500/15 px-2 py-1 text-xs text-green-300">
                              Active
                            </span>
                          ) : (
                            <span className="text-xs text-slate-500">No</span>
                          )}
                        </td>
                        <td className="hidden px-2 py-2 text-slate-200 xl:table-cell">
                          {isEditing ? (
                            <input
                              type="checkbox"
                              checked={editingPosition?.isInRunProgression ?? false}
                              onChange={(event) =>
                                setEditingPosition((prev) =>
                                  prev
                                    ? {
                                        ...prev,
                                        isInRunProgression: event.target.checked,
                                      }
                                    : prev
                                )
                              }
                              className="h-4 w-4 accent-slate-300"
                            />
                          ) : position.isInRunProgression ? (
                            <span className="rounded-full bg-blue-500/15 px-2 py-1 text-xs text-blue-300">
                              Included
                            </span>
                          ) : (
                            <span className="text-xs text-slate-500">No</span>
                          )}
                        </td>
                        <td className="px-2 py-2 text-right align-middle">
                          {isEditing ? (
                            <div className="flex flex-wrap items-center justify-end gap-1">
                              <button
                                type="button"
                                onClick={() => handleSavePosition(position.id)}
                                className="rounded-lg border border-slate-700/60 px-2 py-1 text-[11px] text-slate-200 hover:border-slate-600/80"
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingPositionId(null);
                                  setEditingPosition(null);
                                }}
                                className="rounded-lg border border-slate-700/60 px-2 py-1 text-[11px] text-slate-400 hover:text-slate-200"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-end">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button
                                    type="button"
                                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700/60 text-slate-200 hover:border-slate-600/80"
                                    aria-label="Open position actions"
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  className="min-w-36 bg-[#030712] text-slate-100"
                                >
                                  <DropdownMenuItem
                                    onSelect={() => handleEditPosition(position)}
                                  >
                                    <Pencil className="h-3.5 w-3.5" />
                                    <span>Edit</span>
                                  </DropdownMenuItem>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <DropdownMenuItem
                                        onSelect={(event) => event.preventDefault()}
                                        variant="destructive"
                                      >
                                        <Trash2 className="h-3.5 w-3.5" />
                                        <span>Delete</span>
                                      </DropdownMenuItem>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="border-slate-800/60 bg-[#0a1628] text-slate-100">
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>
                                          Delete this position?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription className="text-slate-400">
                                          This action cannot be undone. The
                                          position will be removed from the
                                          dashboard immediately.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel className="border-slate-700/60 bg-transparent text-slate-200 hover:bg-slate-800/40">
                                          Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() =>
                                            handleDeletePosition(position.id)
                                          }
                                          className="bg-red-500 text-white hover:bg-red-400"
                                        >
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </DropdownMenuContent>
                              </DropdownMenu>
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
