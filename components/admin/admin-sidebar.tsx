"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export const adminNavItems = [
  { name: "Overview", href: "/admin" },
  { name: "Homepage Metrics", href: "/admin/homepage-metrics" },
  { name: "Dashboard Metrics", href: "/admin/dashboard-metrics" },
  { name: "Performance", href: "/admin/performance" },
  { name: "Positions", href: "/admin/positions" },
  { name: "Products", href: "/admin/products" },
  { name: "Framework Page", href: "/admin/framework" },
  { name: "Legal Page", href: "/admin/legal" },
  {
    name: "Navigation Guide",
    href: "/admin/navigation-guides",
  },
  { name: "Admins & Users", href: "/admin/admins-users" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-800/60 bg-[#0a1322] md:w-72 lg:block">
      <div className="flex h-20 items-center border-b border-slate-800/60 px-6">
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-[0.4em] text-slate-500">
            Admin Console
          </span>
          <span className="text-base font-semibold text-white">Macro Bias</span>
        </div>
      </div>

      <nav className="p-4">
        <p className="px-3 pb-3 text-xs uppercase tracking-[0.3em] text-slate-600">
          Manage
        </p>
        <ul className="space-y-1">
          {adminNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-slate-800/70 text-white"
                      : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"
                  )}
                >
                  <span>{item.name}</span>
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      isActive ? "bg-blue-400" : "bg-transparent"
                    )}
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
