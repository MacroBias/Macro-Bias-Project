"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AdminSidebar, adminNavItems } from "@/components/admin/admin-sidebar";
import { clearSession, getSessionEmail } from "@/lib/auth";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const email = getSessionEmail();
  const [isNavOpen, setIsNavOpen] = useState(false);

  const handleLogout = () => {
    clearSession();
    router.push("/");
  };

  const handleNav = (href: string) => {
    setIsNavOpen(false);
    router.push(href);
  };

  return (
    <div className="flex min-h-screen bg-[#070f1d] text-slate-100">
      <AdminSidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-40 border-b border-slate-800/60 bg-[#0a1322]/90 backdrop-blur">
          <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4">
            <div className="flex items-center gap-3">
              <Sheet open={isNavOpen} onOpenChange={setIsNavOpen}>
                <SheetTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-slate-800/70 bg-[#030712] text-slate-200 shadow-sm lg:hidden touch-manipulation"
                    aria-label="Open admin navigation"
                  >
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      fill="none"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="w-[80vw] max-w-xs border-slate-800/60 bg-[#0a1322] p-0 text-slate-100"
                >
                  <div className="border-b border-slate-800/60 px-4 py-4">
                    <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500">
                      Admin Console
                    </p>
                    <h1 className="mt-1 text-base font-semibold text-white">
                      Macro Bias
                    </h1>
                  </div>
                  <nav className="p-4">
                    <ul className="space-y-1">
                      {adminNavItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                          <li key={item.href}>
                            <button
                              type="button"
                              onClick={() => handleNav(item.href)}
                              className={`flex w-full min-h-11 items-center justify-between rounded-lg px-3 py-2 text-sm text-left transition-colors touch-manipulation ${
                                isActive
                                  ? "bg-slate-800/70 text-white"
                                  : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"
                              }`}
                            >
                              <span>{item.name}</span>
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  isActive ? "bg-blue-400" : "bg-transparent"
                                }`}
                              />
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                    <div className="mt-4 border-t border-slate-800/60 pt-4">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="inline-flex w-full items-center justify-center rounded-xl border border-slate-800/60 bg-[#111827] px-3 py-2 text-[11px] text-slate-200 transition hover:border-slate-700/80 hover:bg-[#0b1527]"
                      >
                        Logout
                      </button>
                    </div>
                  </nav>
                </SheetContent>
              </Sheet>

              <div>
                <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500 sm:text-xs sm:tracking-[0.4em]">
                  Admin Console
                </p>
                <h1 className="text-base font-semibold text-white sm:text-lg">
                  Macro Bias
                </h1>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-xl border border-slate-800/60 bg-[#030712] px-3 py-2 text-[11px] text-slate-300 sm:px-4 sm:text-xs">
                Signed in as{" "}
                <span className="font-medium text-white">
                  {email ?? "Loading..."}
                </span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl border border-slate-800/60 bg-[#111827] px-3 py-2 text-[11px] text-slate-200 transition hover:border-slate-700/80 hover:bg-[#0b1527] sm:px-4 sm:text-xs"
              >
                Logout
              </button>
            </div>
          </div>
        </header>
        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
