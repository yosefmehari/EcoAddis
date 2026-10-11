"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CalendarPlus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Truck,
  MapPin,
  ChevronDown,
  ChevronUp,
  FileText,
  User,
  History,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { STATUS_CONFIG, PAYMENT_STATUS_CONFIG } from "@/lib/constants";
import { formatETB, formatDate, formatDateTime } from "@/lib/utils";

interface RequestDetail {
  id: string;
  requestNumber: string;
  scheduledDate: string;
  timeSlot: string;
  serviceType: string;
  collectionStatus: keyof typeof STATUS_CONFIG;
  paymentStatus: keyof typeof PAYMENT_STATUS_CONFIG;
  quotedPriceETB: number;
  totalEstimatedWeightKg: number;
  customerNotes?: string;
  cancellationReason?: string;
  createdAt: string;
  location: {
    subCity: string;
    woreda: string;
    specificArea: string;
    contactPhone: string;
  };
  items: {
    category: { name: string; slug: string; baseRatePerKgETB: number };
    estimatedWeightKg: number;
    notes?: string;
  }[];
  assignments: {
    collector: {
      email: string;
      customerProfile?: { fullName: string };
    };
    status: string;
    collectedWeightKg?: number;
    completionNotes?: string;
  }[];
  statusHistory: {
    id: string;
    previousStatus: string;
    newStatus: string;
    changeReason?: string;
    timestamp: string;
    changedBy: { email: string; role: string };
  }[];
}

export default function CustomerRequestsPage() {
  const [requests, setRequests] = useState<RequestDetail[]>([]);
  const [filter, setFilter] = useState("ALL");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchRequests = async () => {
    try {
      const res = await fetch(`/api/pickups?status=${filter}`);
      if (res.ok) {
        const data = await res.json();
        setRequests(data.requests || []);
      }
    } catch (err) {
      console.error("Fetch requests err", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [filter]);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleCancelRequest = async (id: string) => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/pickups/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "CANCELLED",
          notes: cancelReason || "Customer cancelled request",
        }),
      });

      if (res.ok) {
        setCancellingId(null);
        setCancelReason("");
        await fetchRequests();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to cancel request");
      }
    } catch (err) {
      console.error("Cancel err", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Pickup History & Tracking</h1>
          <p className="text-xs text-gray-500 mt-1">
            Monitor real-time status transitions, assigned collectors, and verified receipts.
          </p>
        </div>

        <Link href="/customer/book">
          <Button size="sm" className="bg-forest-800 hover:bg-forest-900 text-white gap-2">
            <CalendarPlus className="w-3.5 h-3.5" />
            <span>Book New Pickup</span>
          </Button>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {["ALL", "PENDING", "ASSIGNED", "IN_PROGRESS", "COMPLETED", "CANCELLED"].map((st) => (
          <button
            key={st}
            type="button"
            onClick={() => setFilter(st)}
            className={`px-3 py-1.5 rounded-xl font-medium transition-colors shrink-0 ${
              filter === st
                ? "bg-forest-800 text-white shadow-sm"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            {st === "ALL" ? "All Requests" : STATUS_CONFIG[st as keyof typeof STATUS_CONFIG]?.label || st}
          </button>
        ))}
      </div>

      {/* Requests List */}
      {isLoading ? (
        <div className="text-center py-16 text-gray-500 text-xs">Loading requests...</div>
      ) : requests.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Truck className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-gray-800">No requests found</h3>
            <p className="text-xs text-gray-500 mt-1">There are no pickups matching the selected filter.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => {
            const isExpanded = expandedId === req.id;
            const statusStyle = STATUS_CONFIG[req.collectionStatus] || STATUS_CONFIG.PENDING;
            const paymentStyle = PAYMENT_STATUS_CONFIG[req.paymentStatus] || PAYMENT_STATUS_CONFIG.UNPAID;
            const canCancel = req.collectionStatus === "PENDING" || req.collectionStatus === "CONFIRMED";
            const leadCollector = req.assignments?.[0]?.collector;

            return (
              <Card key={req.id} className="border-gray-200 overflow-hidden">
                <div
                  className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-gray-50/50 transition-colors"
                  onClick={() => toggleExpand(req.id)}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <span className="font-bold text-sm text-gray-900 font-mono">
                        {req.requestNumber}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                      >
                        {statusStyle.label}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${paymentStyle.bg} ${paymentStyle.text}`}
                      >
                        {paymentStyle.label}
                      </span>
                    </div>

                    <div className="text-xs text-gray-600 flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-forest-700 shrink-0" />
                      <span>
                        {req.location.subCity} ({req.location.woreda}) • {req.location.specificArea}
                      </span>
                    </div>

                    <div className="text-[11px] text-gray-400">
                      Scheduled: <strong>{formatDate(req.scheduledDate)}</strong> • Window:{" "}
                      {req.timeSlot.includes("MORNING") ? "Morning (8-12)" : "Afternoon (1-5)"}
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6">
                    <div className="text-right">
                      <div className="text-sm font-bold text-forest-900">
                        {formatETB(req.quotedPriceETB)}
                      </div>
                      <div className="text-[11px] text-gray-500">
                        {req.totalEstimatedWeightKg} kg est.
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
                        aria-label="Toggle details"
                      >
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Details Accordion */}
                {isExpanded && (
                  <div className="p-6 pt-2 border-t border-gray-100 bg-gray-50/40 space-y-6 text-xs">
                    {/* Items Grid */}
                    <div>
                      <h4 className="font-bold text-gray-900 uppercase tracking-wider text-[11px] mb-2.5">
                        Items & Waste Categories
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {req.items.map((it, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-xl bg-white border border-gray-200 flex justify-between items-center"
                          >
                            <div>
                              <div className="font-bold text-gray-800">{it.category.name}</div>
                              <div className="text-[10px] text-gray-400">
                                Rate: {it.category.baseRatePerKgETB} ETB/kg
                              </div>
                            </div>
                            <span className="font-bold text-forest-800 text-sm">
                              {it.estimatedWeightKg} kg
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Collector Info */}
                    {leadCollector && (
                      <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <User className="w-4 h-4 text-indigo-700" />
                          <div>
                            <span className="text-indigo-900 font-bold">Assigned Collector: </span>
                            <span className="text-indigo-800">
                              {leadCollector.customerProfile?.fullName || leadCollector.email}
                            </span>
                          </div>
                        </div>
                        <Badge variant="info">On Route</Badge>
                      </div>
                    )}

                    {/* Customer Notes */}
                    {req.customerNotes && (
                      <div className="p-3 rounded-xl bg-white border border-gray-200">
                        <span className="font-bold text-gray-700">Special Instructions: </span>
                        <span className="text-gray-600">{req.customerNotes}</span>
                      </div>
                    )}

                    {/* Status History Timeline */}
                    <div>
                      <div className="flex items-center gap-2 font-bold text-gray-900 uppercase tracking-wider text-[11px] mb-3">
                        <History className="w-3.5 h-3.5 text-forest-700" />
                        <span>Audit & Timeline Log</span>
                      </div>
                      <div className="space-y-2 border-l-2 border-forest-200 pl-4 ml-2">
                        {req.statusHistory.map((sh) => (
                          <div key={sh.id} className="relative">
                            <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-forest-700 ring-4 ring-white" />
                            <div className="flex items-baseline justify-between gap-4">
                              <span className="font-bold text-gray-900">
                                {sh.newStatus}
                              </span>
                              <span className="text-[10px] text-gray-400">
                                {formatDateTime(sh.timestamp)}
                              </span>
                            </div>
                            <div className="text-gray-600 text-[11px]">
                              {sh.changeReason || "Status updated"} ({sh.changedBy.role})
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions bar */}
                    <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
                      <div className="text-[11px] text-gray-500">
                        Booked on {formatDateTime(req.createdAt)}
                      </div>

                      {canCancel && (
                        <div>
                          {cancellingId === req.id ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                placeholder="Reason for cancellation..."
                                value={cancelReason}
                                onChange={(e) => setCancelReason(e.target.value)}
                                className="px-2.5 py-1 text-xs border border-gray-300 rounded-lg w-48"
                              />
                              <Button
                                size="sm"
                                variant="danger"
                                isLoading={isSubmitting}
                                onClick={() => handleCancelRequest(req.id)}
                              >
                                Confirm Cancel
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setCancellingId(null)}
                              >
                                Back
                              </Button>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setCancellingId(req.id)}
                              className="text-rose-600 border-rose-200 hover:bg-rose-50"
                            >
                              Cancel Request
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
