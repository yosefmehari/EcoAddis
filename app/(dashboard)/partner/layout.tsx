"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, Layers, ShieldCheck, ArrowLeft } from "lucide-react";

export default function PartnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50/70 pb-16">
      <div className="bg-forest-950 text-white p-4 sm:p-6 shadow-sm border-b border-forest-900">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-forest-800 flex items-center justify-center text-meadow-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base font-bold">Recycling Partner Portal</div>
              <div className="text-xs text-forest-200">Manage accepted materials, buying rates & center profile</div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <Link
              href="/partner"
              className={`px-3.5 py-2 rounded-xl font-semibold transition-all ${
                pathname === "/partner" ? "bg-forest-800 text-white shadow-sm" : "text-forest-200 hover:text-white"
              }`}
            >
              Enterprise Overview
            </Link>
            <Link
              href="/partner/materials"
              className={`px-3.5 py-2 rounded-xl font-semibold transition-all ${
                pathname === "/partner/materials" ? "bg-forest-800 text-white shadow-sm" : "text-forest-200 hover:text-white"
              }`}
            >
              Material Listings
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">{children}</div>
    </div>
  );
}
