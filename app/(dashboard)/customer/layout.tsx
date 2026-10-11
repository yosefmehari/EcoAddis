"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarPlus,
  History,
  MapPin,
  LifeBuoy,
  ArrowLeft,
  Recycle,
} from "lucide-react";

export default function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const links = [
    { label: "Overview", href: "/customer", icon: LayoutDashboard },
    { label: "Book Pickup", href: "/customer/book", icon: CalendarPlus },
    { label: "Request History", href: "/customer/requests", icon: History },
    { label: "Saved Locations", href: "/customer/locations", icon: MapPin },
    { label: "Support & Issues", href: "/customer/complaints", icon: LifeBuoy },
  ];

  return (
    <div className="min-h-screen bg-gray-50/70 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm sticky top-28 space-y-2">
              <div className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                Customer Portal
              </div>
              <nav className="space-y-1">
                {links.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? "bg-forest-800 text-white shadow-sm"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="pt-4 border-t border-gray-100 px-3">
                <Link
                  href="/recycling-centers"
                  className="flex items-center gap-2 text-[11px] text-forest-700 font-semibold hover:underline"
                >
                  <Recycle className="w-3.5 h-3.5" />
                  <span>Find Recycling Depots</span>
                </Link>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="lg:col-span-9">{children}</main>
        </div>
      </div>
    </div>
  );
}
