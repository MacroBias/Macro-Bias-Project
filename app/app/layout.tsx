import React from "react"
import { AuthGuard } from "@/components/auth/auth-guard";
import { AppHeader } from "@/components/app/app-header";
import { AppSidebar } from "@/components/app/app-sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex min-h-dvh bg-background overflow-x-hidden">
        <AppSidebar />
        <div className="flex min-h-dvh flex-1 flex-col overflow-hidden overflow-x-hidden">
          <AppHeader />
          <main className="flex-1 overflow-y-auto overflow-x-hidden">
            <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
