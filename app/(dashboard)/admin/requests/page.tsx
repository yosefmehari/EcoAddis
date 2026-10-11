"use client";

import React, { useState, useEffect } from "react";
import {
  Truck,
  MapPin,
  Calendar,
  Clock,
  UserCheck,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ADDIS_ABABA_SUB_CITIES, STATUS_CONFIG } from "@/lib/constants";
import { formatETB, formatDate } from "@/lib/utils";

export default function AdminDispatcherPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [collectors, setCollectors] = useState<any[]>([]);
  const [selectedCollector, setSelectedCollector] = useState<Record<string, string>>({});
  const [subCityFilter, setSubCityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [reqRes, statsRes] = await Promise.all([
        fetch("/api/pickups"),
        fetch("/api/admin/stats"),
      ]);

      if (reqRes.ok) {
        const data = await reqRes.json();
        setRequests(data.requests || []);
      }

      if (statsRes.ok) {
        const stats = await statsRes.json();
        setCollectors(stats.collectors || []);
      }
    } catch (err) {
      console.error("Dispatcher load error", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAssignCollector = async (requestId: string) => {
    const collectorId = selectedCollector[requestId];
    if (!collectorId) {
      alert("Please select a collector from the dropdown first.");
      return;
    }

    setUpdatingId(requestId);
    try {
      const res = await fetch(`/api/pickups/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "ASSIGNED",
          collectorId,
          notes: "Assigned by central dispatcher",
        }),
      });

      if (res.ok) {
        await loadData();
      } else {
        const err = await res.json();
        alert(err.error || "Assignment failed");
      }
    } catch (err) {
      console.error("Assign err", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleStatusChange = async (requestId: string, newStatus: string) => {
    setUpdatingId(requestId);
    try {
      const res = await fetch(`/api/pickups/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          notes: `Updated to ${newStatus} by admin`,
        }),
      });

      if (res.ok) {
        await loadData();
      }
    } catch (err) {
      console.error("Status update err", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredRequests = requests.filter((r) => {
    const matchesSearch =
      r.requestNumber.toLowerCase().includes(search.toLowerCase()) ||
      r.location.subCity.toLowerCase().includes(search.toLowerCase()) ||
      r.location.specificArea.toLowerCase().includes(search.toLowerCase());

    const matchesSubCity =
      subCityFilter === "all" || r.location.subCity.toLowerCase() === subCityFilter.toLowerCase();

    const matchesStatus = statusFilter === "all" || r.collectionStatus === statusFilter;

    return matchesSearch && matchesSubCity && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Dispatch & Request Management
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Review pending customer requests across Addis Ababa and assign authorized local collectors
        </p>
      </div>

      {/* Filter and Search Bar */}
      <Card>
        <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search request #, landmark, or sub-city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-forest-500"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={subCityFilter}
              onChange={(e) => setSubCityFilter(e.target.value)}
              aria-label="Filter by Sub-City"
              className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-forest-500"
            >
              <option value="all">All Sub-Cities</option>
              {ADDIS_ABABA_SUB_CITIES.map((sc) => (
                <option key={sc.id} value={sc.name}>
                  {sc.name}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter by Request Status"
              className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-forest-500"
            >
              <option value="all">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="FAILED">Failed</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Requests List */}
      {isLoading ? (
        <div className="text-center py-12 text-xs text-gray-500">Loading requests...</div>
      ) : filteredRequests.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center text-xs text-gray-500">
            No requests matching filter criteria.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((req) => {
            const statusStyle =
              (STATUS_CONFIG as Record<string, any>)[req.collectionStatus] || STATUS_CONFIG.PENDING;
            const currentCollector = req.assignments?.[0]?.collector;

            return (
              <Card key={req.id} className="border-gray-200">
                <CardContent className="p-5 space-y-4 text-xs">
                  {/* Top line */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-2.5">
                      <span className="font-bold text-sm text-gray-900 font-mono">
                        {req.requestNumber}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                      >
                        {statusStyle.label}
                      </span>
                      <span className="text-gray-400 font-medium">
                        {req.serviceType}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-right">
                      <div>
                        <span className="font-bold text-forest-900 text-sm">
                          {formatETB(req.quotedPriceETB)}
                        </span>
                        <span className="text-[10px] text-gray-500 block">
                          {req.totalEstimatedWeightKg} kg est.
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Address and timing info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                    <div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                        Location & Contact
                      </div>
                      <div className="text-gray-800 font-medium">
                        {req.location.subCity} ({req.location.woreda})
                      </div>
                      <div className="text-gray-600">{req.location.specificArea}</div>
                      <div className="text-forest-800 font-bold mt-1">
                        Phone: {req.location.contactPhone}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                        Scheduled Window
                      </div>
                      <div className="text-gray-800">
                        Date: <strong>{formatDate(req.scheduledDate)}</strong>
                      </div>
                      <div className="text-gray-600">
                        Slot: {req.timeSlot.includes("MORNING") ? "Morning (8:00 AM – 12:00 PM)" : "Afternoon (1:00 PM – 5:00 PM)"}
                      </div>
                      {req.customerNotes && (
                        <div className="text-amber-800 mt-1 italic">
                          Note: &quot;{req.customerNotes}&quot;
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Dispatch / Assignment Section */}
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 font-medium">Collector:</span>
                      {currentCollector ? (
                        <span className="font-bold text-indigo-900 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200">
                          {currentCollector.customerProfile?.fullName || currentCollector.email}
                        </span>
                      ) : (
                        <span className="text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded text-[11px]">
                          Unassigned
                        </span>
                      )}
                    </div>

                    {/* Assignment controls */}
                    <div className="flex items-center gap-2">
                      <select
                        value={selectedCollector[req.id] || ""}
                        onChange={(e) =>
                          setSelectedCollector({
                            ...selectedCollector,
                            [req.id]: e.target.value,
                          })
                        }
                        aria-label="Select Collector"
                        className="px-2.5 py-1.5 text-xs rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-forest-500"
                      >
                        <option value="">Select Collector...</option>
                        {collectors.map((col) => (
                          <option key={col.id} value={col.id}>
                            {col.name}
                          </option>
                        ))}
                      </select>

                      <Button
                        size="sm"
                        isLoading={updatingId === req.id}
                        onClick={() => handleAssignCollector(req.id)}
                        className="bg-forest-800 hover:bg-forest-900 text-white text-xs px-3"
                      >
                        Assign Job
                      </Button>

                      {req.collectionStatus === "PENDING" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(req.id, "CONFIRMED")}
                          className="text-xs text-blue-700 border-blue-200 hover:bg-blue-50"
                        >
                          Confirm
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
