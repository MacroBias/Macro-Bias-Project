"use client";

import Link from "next/link";
import { useAdminSession } from "@/components/admin/admin-hooks";
import { panelClass, sectionHeaderClass } from "@/components/admin/admin-styles";

const cards = [
  {
    title: "Homepage Metrics",
    description: "Update the executive overview values shown on the homepage.",
    href: "/admin/homepage-metrics",
  },
  {
    title: "Dashboard Metrics",
    description: "Update daily/monthly scores and regime explanation copy.",
    href: "/admin/dashboard-metrics",
  },
  {
    title: "Framework Page",
    description: "Edit Framework & Methodology sections and copy.",
    href: "/admin/framework",
  },
  {
    title: "Legal Page",
    description: "Edit Legal & Disclosures sections and copy.",
    href: "/admin/legal",
  },
  {
    title: "Performance",
    description: "Manage yearly performance rows shown in the app.",
    href: "/admin/performance",
  },
  {
    title: "Positions",
    description: "Add, edit, or delete current positioning rows.",
    href: "/admin/positions",
  },
  {
    title: "Products",
    description: "Manage long/short products used on the dashboard.",
    href: "/admin/products",
  },
  {
    title: "Nagivation Guide",
    description: "Create and edit user-facing dashboard navigation documents.",
    href: "/admin/navigation-guides",
  },
  {
    title: "Admins & Users",
    description: "Review access requests and manage admin access.",
    href: "/admin/admins-users",
  },
];

export default function AdminOverviewPage() {
  useAdminSession();

  return (
    <div className="space-y-6">
      <div className={sectionHeaderClass}>
        <div>
          <h2 className="text-lg font-semibold text-white">Admin Overview</h2>
          <p className="text-sm text-slate-400">
            Jump directly to any admin section and manage your data.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {cards.map((card) => (
          <Link key={card.href} href={card.href} className="group">
            <div className={`${panelClass} transition hover:border-slate-700/80`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-base font-semibold text-white">{card.title}</h3>
                  <p className="mt-2 text-sm text-slate-400">{card.description}</p>
                </div>
                <span className="rounded-full border border-slate-700/60 px-3 py-1 text-xs text-slate-300 transition group-hover:border-slate-500/80">
                  Open
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
