"use client";

import { useAdminSession, useNavigationGuides } from "@/components/admin/admin-hooks";
import {
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

export default function NavigationGuidesAdminPage() {
  const email = useAdminSession();
  const {
    guides,
    guidesError,
    isSavingGuide,
    guideDraft,
    editingGuideId,
    editingGuide,
    setEditingGuide,
    setEditingGuideId,
    handleGuideDraftChange,
    handleAddGuide,
    handleEditGuide,
    handleSaveGuide,
    handleDeleteGuide,
  } = useNavigationGuides(email);

  return (
    <div className="space-y-6">
      <div className={sectionHeaderClass}>
        <div>
          <h2 className="text-lg font-semibold text-white">
            Operational Dashboard Navigation Guide
          </h2>
          <p className="text-sm text-slate-400">
            Create and manage guide documents shown to users in the app.
          </p>
        </div>
      </div>

      <div className={panelClass}>
        <h3 className="text-base font-semibold text-white">Add New Document</h3>
        <div className="mt-4">
          <label className={labelClass}>
            Title
            <input
              type="text"
              value={guideDraft.title}
              onChange={(event) => handleGuideDraftChange("title", event.target.value)}
              className={inputClass}
            />
          </label>
        </div>
        <div className="mt-4">
          <label className={labelClass}>
            Description
            <textarea
              rows={3}
              value={guideDraft.description}
              onChange={(event) =>
                handleGuideDraftChange("description", event.target.value)
              }
              className={inputClass}
            />
          </label>
        </div>
        <div className="mt-4">
          <label className={labelClass}>
            Document File (PDF, Word, Excel)
            <input
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              onChange={(event) =>
                handleGuideDraftChange("file", event.target.files?.[0] ?? null)
              }
              className={inputClass}
            />
          </label>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={handleAddGuide}
            disabled={isSavingGuide}
            className="rounded-xl border border-slate-800/60 bg-[#111827] px-4 py-3 text-sm text-slate-200 transition hover:border-slate-700/80 hover:bg-[#0b1527] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSavingGuide ? "Saving..." : "Add document"}
          </button>
        </div>
      </div>

      <div className={panelClass}>
        <h3 className="text-base font-semibold text-white">
          Operational Dashboard Navigation Guide Documents
        </h3>
        <p className="mt-1 text-sm text-slate-400">
          All guide documents are grouped under this section.
        </p>

        <div className="mt-4 space-y-4">
          {guides.length === 0 ? (
            <div className="rounded-xl border border-slate-800/60 bg-[#0b1527] p-4 text-sm text-slate-400">
              No guide documents added yet.
            </div>
          ) : null}

          {guides.map((guide) => {
            const isEditing = editingGuideId === guide.id;
            const current = isEditing && editingGuide ? editingGuide : null;

            return (
              <div
                key={guide.id}
                className="rounded-xl border border-slate-800/60 bg-[#0b1527] p-5"
              >
                {isEditing && current ? (
                  <div className="space-y-4">
                    <div>
                      <label className={labelClass}>
                        Title
                        <input
                          type="text"
                          value={current.title}
                          onChange={(event) =>
                            setEditingGuide((prev) =>
                              prev ? { ...prev, title: event.target.value } : prev
                            )
                          }
                          className={inputClass}
                        />
                      </label>
                    </div>
                    <label className={labelClass}>
                      Description
                      <textarea
                        rows={3}
                        value={current.description}
                        onChange={(event) =>
                          setEditingGuide((prev) =>
                            prev ? { ...prev, description: event.target.value } : prev
                          )
                        }
                        className={inputClass}
                      />
                    </label>
                    <label className={labelClass}>
                      Replace Document File (optional)
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.xls,.xlsx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        onChange={(event) =>
                          setEditingGuide((prev) =>
                            prev ? { ...prev, file: event.target.files?.[0] ?? null } : prev
                          )
                        }
                        className={inputClass}
                      />
                    </label>
                    <div className="flex flex-wrap items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingGuideId(null);
                          setEditingGuide(null);
                        }}
                        className="rounded-xl border border-slate-800/60 bg-transparent px-4 py-2 text-sm text-slate-300 transition hover:border-slate-700/80 hover:bg-slate-900/30"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveGuide(guide.id)}
                        disabled={isSavingGuide}
                        className="rounded-xl border border-slate-800/60 bg-[#111827] px-4 py-2 text-sm text-slate-200 transition hover:border-slate-700/80 hover:bg-[#0b1527] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base font-semibold text-white">{guide.title}</h3>
                        <p className="mt-1 text-sm text-slate-400">{guide.description}</p>
                      </div>
                    </div>
                    <div className="rounded-xl border border-slate-800/60 bg-[#091224] p-4">
                      <p className="text-sm text-slate-300">
                        {guide.fileName ? (
                          <>
                            Current file:{" "}
                            <span className="font-medium text-white">{guide.fileName}</span>
                          </>
                        ) : (
                          "No file uploaded yet."
                        )}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => handleEditGuide(guide)}
                        className="rounded-xl border border-slate-800/60 bg-transparent px-4 py-2 text-sm text-slate-300 transition hover:border-slate-700/80 hover:bg-slate-900/30"
                      >
                        Edit
                      </button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button
                            type="button"
                            disabled={isSavingGuide}
                            className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-300 transition hover:border-red-500/70 hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            Delete
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="border-slate-800/60 bg-[#0a1628] text-slate-100">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete this document?</AlertDialogTitle>
                            <AlertDialogDescription className="text-slate-400">
                              This action cannot be undone. The guide document and its file
                              will be removed.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="border-slate-700/60 bg-transparent text-slate-200 hover:bg-slate-800/40">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteGuide(guide.id)}
                              className="bg-red-500 text-white hover:bg-red-400"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {guidesError ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {guidesError}
        </div>
      ) : null}
    </div>
  );
}
