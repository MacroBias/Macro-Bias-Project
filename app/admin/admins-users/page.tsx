"use client";

import { useState } from "react";
import {
  useAccessRequests,
  useAdminSession,
  useAdmins,
} from "@/components/admin/admin-hooks";
import {
  inputClass,
  labelClass,
  panelClass,
  sectionHeaderClass,
} from "@/components/admin/admin-styles";
import { format } from "date-fns";
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

export default function AdminsUsersPage() {
  const email = useAdminSession();
  const { requests, error, isLoading, refreshedAt } = useAccessRequests(email);
  const { admins, adminsError, isLoadingAdmins, isSavingAdmin, addAdmin, removeAdmin } =
    useAdmins(email);
  const [newAdminEmail, setNewAdminEmail] = useState("");

  const handleAddAdmin = async () => {
    const trimmed = newAdminEmail.trim().toLowerCase();
    if (!trimmed) return;
    await addAdmin(trimmed);
    setNewAdminEmail("");
  };

  const handleExportCsv = () => {
    if (!requests || requests.length === 0) return;
    const header = ["email", "created_at"];
    const rows = requests.map((request) => [
      request.email,
      request.created_at ?? "",
    ]);
    const csv = [header, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value).replaceAll('"', '""')}"`)
          .join(",")
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `users-email-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className={sectionHeaderClass}>
        <div>
          <h2 className="text-lg font-semibold text-white">Admins & Users</h2>
          <p className="text-sm text-slate-400">
            Review access requests and manage admin access.
          </p>
        </div>
        <div className="text-xs text-slate-500">Updated {refreshedAt}</div>
      </div>

      <div className="grid gap-6">
        <div className={panelClass}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-white">Users Email</p>
              <p className="text-xs text-slate-500">Total: {requests?.length ?? 0}</p>
            </div>
            <button
              type="button"
              onClick={handleExportCsv}
              disabled={isLoading || !requests?.length}
              className="rounded-xl border border-slate-800/60 bg-[#111827] px-4 py-2 text-xs text-slate-200 transition hover:border-slate-700/80 hover:bg-[#0b1527] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Export CSV
            </button>
          </div>
          <div className="mt-4 overflow-hidden rounded-xl border border-slate-800/60">
            <table className="min-w-full divide-y divide-slate-800 text-sm">
              <thead className="bg-[#0f1d33] text-left text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Requested At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-[#0a1628]">
                {isLoading ? (
                  <tr>
                      <td colSpan={2} className="px-4 py-6 text-center text-sm text-slate-400">
                        Loading emails...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={2} className="px-4 py-6 text-center text-sm text-red-400">
                      {error}
                    </td>
                  </tr>
                ) : requests && requests.length > 0 ? (
                  requests.map((request) => (
                    <tr key={`${request.email}-${request.created_at}`}>
                      <td className="px-4 py-3 text-slate-200">{request.email}</td>
                      <td className="px-4 py-3 text-slate-400">
                        {request.created_at
                          ? format(new Date(request.created_at), "MMM dd, yyyy • HH:mm")
                          : "Unknown"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="px-4 py-8 text-center text-sm text-slate-500">
                        No emails yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className={panelClass}>
          <div>
            <p className="text-sm font-medium text-white">Admin Access</p>
            <p className="mt-2 text-sm text-slate-400">
              Assign admin access to approved emails.
            </p>
          </div>
          <div className="mt-4">
            <label className={labelClass}>
              Admin Email
              <input
                type="email"
                value={newAdminEmail}
                onChange={(event) => setNewAdminEmail(event.target.value)}
                placeholder="name@domain.com"
                className={inputClass}
              />
            </label>
            <div className="mt-3 flex items-center justify-end">
              <button
                type="button"
                onClick={handleAddAdmin}
                disabled={isSavingAdmin || !newAdminEmail.trim()}
                className="rounded-xl border border-slate-800/60 bg-[#111827] px-4 py-2 text-xs text-slate-200 transition hover:border-slate-700/80 hover:bg-[#0b1527] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSavingAdmin ? "Saving..." : "Add admin"}
              </button>
            </div>
            {adminsError ? (
              <div className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {adminsError}
              </div>
            ) : null}
          </div>
          <div className="mt-6">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
              Current Admins
            </p>
            <div className="mt-3 overflow-hidden rounded-xl border border-slate-800/60">
              <table className="min-w-full table-auto divide-y divide-slate-800 text-sm">
                <thead className="bg-[#0f1d33] text-left text-xs uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Added</th>
                    <th className="px-4 py-3 font-medium text-right whitespace-nowrap">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-[#0a1628]">
                  {isLoadingAdmins ? (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-4 py-6 text-center text-sm text-slate-400"
                      >
                        Loading admins...
                      </td>
                    </tr>
                  ) : admins.length === 0 ? (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-4 py-6 text-center text-sm text-slate-500"
                      >
                        No admins found.
                      </td>
                    </tr>
                  ) : (
                    admins.map((admin) => (
                      <tr key={admin.id}>
                        <td className="px-4 py-3 text-slate-200">{admin.email}</td>
                        <td className="px-4 py-3 text-slate-400">
                          {admin.created_at
                            ? format(new Date(admin.created_at), "MMM dd, yyyy")
                            : "Unknown"}
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          {admin.email === email ? (
                            <span className="text-xs text-slate-500">You</span>
                          ) : (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <button
                                  type="button"
                                  className="rounded-lg border border-red-500/40 px-2 py-1 text-xs text-red-300 hover:border-red-400"
                                  disabled={isSavingAdmin}
                                >
                                  Remove
                                </button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="border-slate-800/60 bg-[#0a1628] text-slate-100">
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Remove admin access?</AlertDialogTitle>
                                  <AlertDialogDescription className="text-slate-400">
                                    This will revoke admin access for {admin.email}.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="border-slate-700/60 bg-transparent text-slate-200 hover:bg-slate-800/40">
                                    Cancel
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => removeAdmin(admin.email)}
                                    className="bg-red-500 text-white hover:bg-red-400"
                                  >
                                    Remove
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
