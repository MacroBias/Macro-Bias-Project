"use client";

import { useAdminSession, useLegalSections } from "@/components/admin/admin-hooks";
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

export default function LegalAdminPage() {
  const email = useAdminSession();
  const {
    sections,
    sectionsError,
    isSavingSection,
    sectionDraft,
    editingSectionId,
    editingSection,
    setEditingSection,
    setEditingSectionId,
    handleSectionDraftChange,
    handleAddSection,
    handleEditSection,
    handleSaveSection,
    handleDeleteSection,
  } = useLegalSections(email);

  const lastUpdated =
    sections.length > 0
      ? sections
          .map((section) => section.updatedAt || section.createdAt || "")
          .filter(Boolean)
          .sort()
          .at(-1)
      : null;

  return (
    <div className="space-y-6">
      <div className={sectionHeaderClass}>
        <div>
          <h2 className="text-lg font-semibold text-white">Legal Page</h2>
          <p className="text-sm text-slate-400">
            Manage sections and copy for the Legal &amp; Disclosures page.
          </p>
        </div>
        {lastUpdated ? (
          <p className="text-xs text-slate-500">
            Last updated {new Date(lastUpdated).toLocaleString()}
          </p>
        ) : null}
      </div>

      <div className={panelClass}>
        <h3 className="text-base font-semibold text-white">Add New Section</h3>
        <p className="mt-1 text-sm text-slate-400">
          Slugs become anchor IDs and order controls the section sequence on the Legal
          page. Body supports markdown for paragraphs and lists.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className={labelClass}>
            Slug
            <input
              type="text"
              value={sectionDraft.slug}
              onChange={(event) =>
                handleSectionDraftChange("slug", event.target.value)
              }
              className={inputClass}
              placeholder="e.g. research-only-disclaimer"
            />
          </label>
          <label className={labelClass}>
            Title
            <input
              type="text"
              value={sectionDraft.title}
              onChange={(event) =>
                handleSectionDraftChange("title", event.target.value)
              }
              className={inputClass}
              placeholder="Section heading"
            />
          </label>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1fr)_180px]">
          <label className={labelClass}>
            Body (markdown)
            <textarea
              rows={6}
              value={sectionDraft.body}
              onChange={(event) =>
                handleSectionDraftChange("body", event.target.value)
              }
              className={inputClass}
              placeholder="Write the section content using markdown..."
            />
          </label>
          <label className={labelClass}>
            Sort Order
            <input
              type="number"
              value={sectionDraft.sortOrder}
              onChange={(event) =>
                handleSectionDraftChange("sortOrder", event.target.value)
              }
              className={inputClass}
              placeholder="1"
            />
          </label>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={handleAddSection}
            disabled={isSavingSection}
            className="rounded-xl border border-slate-800/60 bg-[#111827] px-4 py-3 text-sm text-slate-200 transition hover:border-slate-700/80 hover:bg-[#0b1527] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSavingSection ? "Saving..." : "Add section"}
          </button>
        </div>
      </div>

      <div className={panelClass}>
        <h3 className="text-base font-semibold text-white">Existing Sections</h3>
        <p className="mt-1 text-sm text-slate-400">
          Edit or remove sections shown on the public Legal &amp; Disclosures page.
        </p>

        <div className="mt-4 space-y-4">
          {sections.length === 0 ? (
            <div className="rounded-xl border border-slate-800/60 bg-[#0b1527] p-4 text-sm text-slate-400">
              No sections defined yet.
            </div>
          ) : null}

          {sections.map((section) => {
            const isEditing = editingSectionId === section.id;
            const current = isEditing && editingSection ? editingSection : null;

            return (
              <div
                key={section.id}
                className="rounded-xl border border-slate-800/60 bg-[#0b1527] p-5"
              >
                {isEditing && current ? (
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <label className={labelClass}>
                        Slug
                        <input
                          type="text"
                          value={current.slug}
                          onChange={(event) =>
                            setEditingSection((prev) =>
                              prev ? { ...prev, slug: event.target.value } : prev
                            )
                          }
                          className={inputClass}
                        />
                      </label>
                      <label className={labelClass}>
                        Title
                        <input
                          type="text"
                          value={current.title}
                          onChange={(event) =>
                            setEditingSection((prev) =>
                              prev ? { ...prev, title: event.target.value } : prev
                            )
                          }
                          className={inputClass}
                        />
                      </label>
                    </div>
                    <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_180px]">
                      <label className={labelClass}>
                        Body (markdown)
                        <textarea
                          rows={6}
                          value={current.body}
                          onChange={(event) =>
                            setEditingSection((prev) =>
                              prev ? { ...prev, body: event.target.value } : prev
                            )
                          }
                          className={inputClass}
                        />
                      </label>
                      <label className={labelClass}>
                        Sort Order
                        <input
                          type="number"
                          value={current.sortOrder}
                          onChange={(event) =>
                            setEditingSection((prev) =>
                              prev
                                ? { ...prev, sortOrder: event.target.value }
                                : prev
                            )
                          }
                          className={inputClass}
                        />
                      </label>
                    </div>
                    <div className="flex flex-wrap items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingSectionId(null);
                          setEditingSection(null);
                        }}
                        className="rounded-xl border border-slate-800/60 bg-transparent px-4 py-2 text-sm text-slate-300 transition hover:border-slate-700/80 hover:bg-slate-900/30"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveSection(section.id)}
                        disabled={isSavingSection}
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
                        <h3 className="text-base font-semibold text-white">
                          {section.title}
                        </h3>
                        <p className="mt-1 text-xs font-mono text-slate-500">
                          slug: <span className="text-slate-300">{section.slug}</span>{" "}
                          • sort order:{" "}
                          <span className="text-slate-300">
                            {section.sortOrder}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="rounded-xl border border-slate-800/60 bg-[#091224] p-4">
                      <p className="text-sm text-slate-300 line-clamp-6 whitespace-pre-wrap">
                        {section.body}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => handleEditSection(section)}
                        className="rounded-xl border border-slate-800/60 bg-transparent px-4 py-2 text-sm text-slate-300 transition hover:border-slate-700/80 hover:bg-slate-900/30"
                      >
                        Edit
                      </button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button
                            type="button"
                            disabled={isSavingSection}
                            className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-300 transition hover:border-red-500/70 hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            Delete
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="border-slate-800/60 bg-[#0a1628] text-slate-100">
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Delete this legal section?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-slate-400">
                              This action cannot be undone. The section will be removed
                              from the public Legal page.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="border-slate-700/60 bg-transparent text-slate-200 hover:bg-slate-800/40">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteSection(section.id)}
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

      {sectionsError ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {sectionsError}
        </div>
      ) : null}
    </div>
  );
}

