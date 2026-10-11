"use client";

import React, { useState, useEffect } from "react";
import {
  Truck,
  MapPin,
  Phone,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Play,
  Check,
  X,
  Scale,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { STATUS_CONFIG } from "@/lib/constants";
import { formatETB, formatDate } from "@/lib/utils";

interface CollectorJob {
  id: string;
  requestNumber: string;
  scheduledDate: string;
  timeSlot: string;
  collectionStatus: keyof typeof STATUS_CONFIG;
  quotedPriceETB: number;
  totalEstimatedWeightKg: number;
  customerNotes?: string;
  location: {
    subCity: string;
    woreda: string;
    specificArea: string;
    contactPhone: string;
  };
  items: {
    category: { name: string; slug: string };
    estimatedWeightKg: number;
  }[];
}

export default function CollectorActiveJobsPage() {
  const [jobs, setJobs] = useState<CollectorJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<CollectorJob | null>(null);
  const [actionType, setActionType] = useState<"COMPLETE" | "FAIL" | null>(null);
  const [actualWeightKg, setActualWeightKg] = useState<number>(0);
  const [notes, setNotes] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchJobs = async () => {
    try {
      const res = await fetch("/api/pickups");
      if (res.ok) {
        const data = await res.json();
        // Filter jobs assigned or in progress
        const active = (data.requests || []).filter(
          (j: CollectorJob) =>
            j.collectionStatus === "ASSIGNED" || j.collectionStatus === "IN_PROGRESS"
        );
        setJobs(active);
      }
    } catch (err) {
      console.error("Fetch collector jobs err", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleStartJob = async (id: string) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/pickups/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "IN_PROGRESS",
          notes: "Collector started journey to customer address",
        }),
      });
      if (res.ok) {
        await fetchJobs();
      }
    } catch (err) {
      console.error("Start job err", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCompleteOrFail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;

    setIsUpdating(true);
    try {
      const isComplete = actionType === "COMPLETE";
      const payload: any = {
        status: isComplete ? "COMPLETED" : "FAILED",
        notes: notes.trim(),
      };

      if (isComplete) {
        payload.collectedWeightKg = actualWeightKg > 0 ? actualWeightKg : selectedJob.totalEstimatedWeightKg;
      } else {
        payload.failureReason = notes || "Access issue or client unavailable";
      }

      const res = await fetch(`/api/pickups/${selectedJob.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSelectedJob(null);
        setActionType(null);
        setNotes("");
        setActualWeightKg(0);
        await fetchJobs();
      }
    } catch (err) {
      console.error("Complete/Fail job err", err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Assigned Collection Stops</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {jobs.length} active collection {jobs.length === 1 ? "stop" : "stops"} awaiting completion today
          </p>
        </div>

        <Button size="sm" variant="outline" onClick={fetchJobs} className="text-xs">
          Refresh List
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-xs text-gray-500">Loading collection routes...</div>
      ) : jobs.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-gray-900">All Scheduled Pickups Completed!</h3>
            <p className="text-xs text-gray-500 mt-1">
              No pending jobs currently assigned. Check back when dispatchers assign new neighborhood requests.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => {
            const isAssigned = job.collectionStatus === "ASSIGNED";
            const isInProgress = job.collectionStatus === "IN_PROGRESS";

            return (
              <Card key={job.id} className="border-gray-200 overflow-hidden shadow-sm">
                <div className="bg-white p-5 space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-gray-900 font-mono">
                          {job.requestNumber}
                        </span>
                        <Badge variant={isAssigned ? "info" : "warning"}>
                          {isAssigned ? "Assigned (Ready)" : "In Progress"}
                        </Badge>
                      </div>
                      <div className="text-[11px] text-gray-500 mt-1 flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-forest-700" />
                        <span>Scheduled: {formatDate(job.scheduledDate)}</span>
                        <span>•</span>
                        <span>{job.timeSlot.includes("MORNING") ? "Morning (8-12)" : "Afternoon (1-5)"}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-bold text-forest-900">
                        {formatETB(job.quotedPriceETB)}
                      </div>
                      <div className="text-[10px] text-gray-500">
                        {job.totalEstimatedWeightKg} kg est.
                      </div>
                    </div>
                  </div>

                  {/* Location & Contact Box */}
                  <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
                    <div className="flex items-start gap-2 text-xs text-gray-800">
                      <MapPin className="w-4 h-4 text-forest-700 shrink-0 mt-0.5" />
                      <div>
                        <strong>{job.location.subCity}</strong> ({job.location.woreda})
                        <p className="text-gray-600 font-normal mt-0.5">{job.location.specificArea}</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-200/60 flex items-center justify-between">
                      <span className="text-[11px] text-gray-500">Customer Phone:</span>
                      <a
                        href={`tel:${job.location.contactPhone}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-forest-800 text-white text-xs font-bold hover:bg-forest-900 shadow-sm"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call {job.location.contactPhone}</span>
                      </a>
                    </div>
                  </div>

                  {/* Customer Notes if any */}
                  {job.customerNotes && (
                    <div className="text-xs text-gray-600 bg-amber-50/70 p-3 rounded-xl border border-amber-200/60">
                      <strong className="text-amber-900">Client Note:</strong> {job.customerNotes}
                    </div>
                  )}

                  {/* Materials List */}
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                      Expected Sorted Materials
                    </span>
                    <div className="flex flex-wrap gap-2 text-xs">
                      {job.items.map((it, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-md bg-white border border-gray-200 text-gray-700 font-medium"
                        >
                          {it.category.name}: <strong>{it.estimatedWeightKg} kg</strong>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-2 border-t border-gray-100 flex flex-wrap gap-2">
                    {isAssigned && (
                      <Button
                        size="sm"
                        isLoading={isUpdating}
                        onClick={() => handleStartJob(job.id)}
                        className="w-full bg-forest-800 hover:bg-forest-900 text-white gap-2 font-bold py-2.5"
                      >
                        <Play className="w-4 h-4 text-meadow-400" />
                        <span>Acknowledge & Start Route</span>
                      </Button>
                    )}

                    {isInProgress && (
                      <div className="w-full grid grid-cols-2 gap-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedJob(job);
                            setActionType("COMPLETE");
                            setActualWeightKg(job.totalEstimatedWeightKg);
                          }}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-1.5 py-2.5"
                        >
                          <Check className="w-4 h-4" />
                          <span>Complete & Issue Receipt</span>
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedJob(job);
                            setActionType("FAIL");
                          }}
                          className="text-rose-600 border-rose-200 hover:bg-rose-50 font-bold gap-1.5 py-2.5"
                        >
                          <AlertTriangle className="w-4 h-4" />
                          <span>Report Access Problem</span>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Completion or Failure Modal Dialog */}
      {selectedJob && actionType && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-base text-gray-900">
                {actionType === "COMPLETE" ? "Confirm Completed Collection" : "Report Failed Collection"}
              </h3>
              <button
                onClick={() => {
                  setSelectedJob(null);
                  setActionType(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCompleteOrFail} className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                <span className="font-bold text-gray-900">Request:</span> {selectedJob.requestNumber} •{" "}
                {selectedJob.location.subCity} ({selectedJob.location.specificArea})
              </div>

              {actionType === "COMPLETE" ? (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-1">
                      Verified Total Weight on Calibrated Scale (kg)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0.5"
                      required
                      value={actualWeightKg}
                      onChange={(e) => setActualWeightKg(parseFloat(e.target.value) || 0)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm font-bold text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-500"
                    />
                    <p className="text-[10px] text-gray-400 mt-1">
                      Customer estimate was {selectedJob.totalEstimatedWeightKg} kg.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Collector Completion Notes
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Collected 3 bags of plastic and 1 carton box. Cash received."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-forest-500"
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-rose-800 mb-1">
                    Reason for Inaccessible / Failed Pickup
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="e.g. Compound gate padlocked, phoned resident 3 times with no answer, waited 15 minutes."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedJob(null);
                    setActionType(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  isLoading={isUpdating}
                  className={actionType === "COMPLETE" ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"}
                >
                  {actionType === "COMPLETE" ? "Verify & Close Job" : "Submit Failure Report"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
