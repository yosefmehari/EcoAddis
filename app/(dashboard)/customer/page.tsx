"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CalendarPlus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  ArrowRight,
  Scale,
  Receipt,
  Recycle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { STATUS_CONFIG } from "@/lib/constants";
import { formatETB, formatDate } from "@/lib/utils";

interface PickupItem {
  id: string;
  requestNumber: string;
  scheduledDate: string;
  timeSlot: string;
  collectionStatus: keyof typeof STATUS_CONFIG;
  paymentStatus: string;
  quotedPriceETB: number;
  totalEstimatedWeightKg: number;
  location: { subCity: string; specificArea: string };
  items: { category: { name: string }; estimatedWeightKg: number }[];
}

export default function CustomerDashboardPage() {
  const [requests, setRequests] = useState<PickupItem[]>([]);
  const [userName, setUserName] = useState("Resident");
  const [accountType, setAccountType] = useState("HOUSEHOLD");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [meRes, pickupRes] = await Promise.all([
          fetch("/api/auth/me"),
          fetch("/api/pickups"),
        ]);

        if (meRes.ok) {
          const meData = await meRes.json();
          if (meData.user) {
            setUserName(meData.user.name || "Customer");
            setAccountType(meData.user.accountType);
          }
        }

        if (pickupRes.ok) {
          const pickupData = await pickupRes.json();
          setRequests(pickupData.requests || []);
        }
      } catch (err) {
        console.error("Dashboard load error", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  const activeCount = requests.filter(
    (r) =>
      r.collectionStatus === "PENDING" ||
      r.collectionStatus === "CONFIRMED" ||
      r.collectionStatus === "ASSIGNED" ||
      r.collectionStatus === "IN_PROGRESS"
  ).length;

  const completedCount = requests.filter((r) => r.collectionStatus === "COMPLETED").length;
  const totalWeightKg = requests.reduce((acc, r) => acc + (r.totalEstimatedWeightKg || 0), 0);
  const totalSpentETB = requests
    .filter((r) => r.collectionStatus === "COMPLETED")
    .reduce((acc, r) => acc + (r.quotedPriceETB || 0), 0);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-forest-900 to-forest-800 rounded-3xl p-6 sm:p-8 text-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-800/80 text-meadow-400 text-xs font-semibold mb-2 border border-forest-700">
            <Recycle className="w-3.5 h-3.5" />
            <span>{accountType === "BUSINESS" ? "Commercial Business Account" : "Household Resident Account"}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome, {userName}
          </h1>
          <p className="text-xs sm:text-sm text-forest-200 mt-1 max-w-xl">
            Track your waste collections across Addis Ababa, view transparent ETB weight receipts, and maintain a cleaner neighborhood.
          </p>
        </div>

        <Link href="/customer/book" className="shrink-0 w-full sm:w-auto">
          <Button size="lg" className="w-full bg-meadow-500 hover:bg-meadow-600 text-forest-950 font-bold gap-2 shadow-md">
            <CalendarPlus className="w-4 h-4" />
            <span>Book New Pickup</span>
          </Button>
        </Link>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between text-gray-500 text-xs font-semibold mb-2">
              <span>Active Requests</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{activeCount}</div>
            <p className="text-[11px] text-gray-400 mt-1">Pending or in transit</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between text-gray-500 text-xs font-semibold mb-2">
              <span>Completed Pickups</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{completedCount}</div>
            <p className="text-[11px] text-gray-400 mt-1">Successfully collected</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between text-gray-500 text-xs font-semibold mb-2">
              <span>Weight Diverted</span>
              <Scale className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{totalWeightKg.toFixed(1)} kg</div>
            <p className="text-[11px] text-gray-400 mt-1">Total materials collected</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between text-gray-500 text-xs font-semibold mb-2">
              <span>Collection Spend</span>
              <Receipt className="w-4 h-4 text-forest-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{formatETB(totalSpentETB)}</div>
            <p className="text-[11px] text-gray-400 mt-1">Verified receipts total</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Requests Section */}
      <Card>
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-900">Recent Collection Requests</h2>
            <p className="text-xs text-gray-500 mt-0.5">Your latest scheduled waste pickups and current statuses</p>
          </div>
          <Link href="/customer/requests" className="text-xs font-semibold text-forest-800 hover:underline">
            View All History →
          </Link>
        </div>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="text-center py-12 text-gray-500 text-xs">Loading requests...</div>
          ) : requests.length === 0 ? (
            <div className="text-center py-16 px-4">
              <Truck className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-gray-800">No Pickup Requests Yet</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                Ready to schedule your first waste pickup? Select your sub-city, choose waste categories, and view your upfront ETB quote.
              </p>
              <Link href="/customer/book" className="inline-block mt-4">
                <Button size="sm" className="bg-forest-800 hover:bg-forest-900 text-white gap-2">
                  <CalendarPlus className="w-3.5 h-3.5" />
                  <span>Book First Collection</span>
                </Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {requests.slice(0, 5).map((req) => {
                const statusStyle = STATUS_CONFIG[req.collectionStatus] || STATUS_CONFIG.PENDING;
                return (
                  <div
                    key={req.id}
                    className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-gray-900 font-mono">
                          {req.requestNumber}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                        >
                          {statusStyle.label}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600">
                        {req.location.subCity} • {req.location.specificArea}
                      </div>
                      <div className="text-[11px] text-gray-400">
                        Scheduled: {formatDate(req.scheduledDate)} ({req.timeSlot.includes("MORNING") ? "Morning 8-12" : "Afternoon 1-5"})
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 text-right">
                      <div>
                        <div className="text-xs font-bold text-forest-900">
                          {formatETB(req.quotedPriceETB)}
                        </div>
                        <div className="text-[11px] text-gray-400">
                          {req.totalEstimatedWeightKg} kg est.
                        </div>
                      </div>

                      <Link href={`/customer/requests`}>
                        <Button variant="outline" size="sm" className="text-xs py-1 px-3">
                          Track Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
