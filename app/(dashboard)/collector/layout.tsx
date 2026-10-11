"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Truck, CheckCircle2, History, AlertCircle } from "lucide-react";

export default function CollectorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-100/70 pb-12">
      {/* Mobile-friendly top banner */}
      <div className="bg-forest-900 text-white p-4 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-forest-800 flex items-center justify-center text-meadow-400">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold leading-none">Collector Field Portal</div>
              <div className="text-[10px] text-forest-200 mt-0.5">Addis Ababa Routes & On-Site Actions</div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <Link
              href="/collector"
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                pathname === "/collector" ? "bg-forest-800 text-white" : "text-forest-200 hover:text-white"
              }`}
            >
              Active Jobs
            </Link>
            <Link
              href="/collector/history"
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                pathname === "/collector/history" ? "bg-forest-800 text-white" : "text-forest-200 hover:text-white"
              }`}
            >
              Completed History
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">{children}</div>
    </div>
  );
}
