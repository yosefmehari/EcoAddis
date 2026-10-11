"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldAlert,
  BarChart3,
  Truck,
  Users,
  Settings,
  Shield,
  LifeBuoy,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navLinks = [
    { label: "Overview & Analytics", href: "/admin", icon: BarChart3 },
    { label: "Dispatcher & Requests", href: "/admin/requests", icon: Truck },
    { label: "User Management", href: "/admin/users", icon: Users },
    { label: "Security & Audit Logs", href: "/admin/audit", icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-gray-50/70 pb-16">
      {/* Top Admin Header */}
      <div className="bg-forest-950 text-white p-4 sm:p-5 shadow-sm border-b border-forest-900">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-600 flex items-center justify-center text-white">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base font-bold flex items-center gap-2">
                <span>EcoAddis Command Center</span>
                <span className="text-[10px] font-semibold bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded border border-rose-500/30">
                  Operations Admin
                </span>
              </div>
              <div className="text-xs text-forest-200">
                Citywide dispatching, pricing control, and audit logs
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Admin Sidebar */}
          <aside className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm sticky top-28 space-y-1.5">
              <div className="px-3 py-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Management Modules
              </div>
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-forest-800 text-white shadow-sm"
                        : "text-gray-600 hover:text-gray-950 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </aside>

          {/* Main Workspace */}
          <main className="lg:col-span-9">{children}</main>
        </div>
      </div>
    </div>
  );
}
