"use client";

import React, { useState, useEffect } from "react";
import { History, CheckCircle2, AlertTriangle, Scale, Calendar, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { STATUS_CONFIG } from "@/lib/constants";
import { formatETB, formatDate, formatDateTime } from "@/lib/utils";

interface CompletedJob {
  id: string;
  requestNumber: string;
  scheduledDate: string;
  collectionStatus: keyof typeof STATUS_CONFIG;
  quotedPriceETB: number;
  totalEstimatedWeightKg: number;
  location: { subCity: string; specificArea: string };
  assignments: {
    completedAt?: string;
    collectedWeightKg?: number;
    completionNotes?: string;
    failureReason?: string;
  }[];
}

export default function CollectorHistoryPage() {
  const [jobs, setJobs] = useState<CompletedJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      try {
        const res = await fetch("/api/pickups");
        if (res.ok) {
          const data = await res.json();
          const past = (data.requests || []).filter(
            (j: CompletedJob) =>
              j.collectionStatus === "COMPLETED" ||
              j.collectionStatus === "FAILED" ||
              j.collectionStatus === "CANCELLED"
          );
          setJobs(past);
        }
      } catch (err) {
        console.error("Load collector history err", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadHistory();
  }, []);

  const totalCompletedKg = jobs
    .filter((j) => j.collectionStatus === "COMPLETED")
    .reduce((acc, j) => acc + (j.assignments?.[0]?.collectedWeightKg || j.totalEstimatedWeightKg || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Collection History & Performance</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Log of all completed collections and reported access exceptions
          </p>
        </div>

        <div className="text-right">
          <div className="text-xs text-gray-400 font-semibold uppercase">Total Recovered</div>
          <div className="text-base font-extrabold text-forest-900">{totalCompletedKg.toFixed(1)} kg</div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-xs text-gray-500">Loading history...</div>
      ) : jobs.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-xs text-gray-500">
            No completed collections recorded yet.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => {
            const isCompleted = job.collectionStatus === "COMPLETED";
            const assignment = job.assignments?.[0];

            return (
              <Card key={job.id} className="border-gray-200">
                <CardContent className="p-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900 font-mono">{job.requestNumber}</span>
                      <Badge variant={isCompleted ? "success" : "danger"}>
                        {isCompleted ? "Completed" : "Failed / Cancelled"}
                      </Badge>
                    </div>

                    <div className="font-bold text-forest-900">
                      {isCompleted
                        ? `${assignment?.collectedWeightKg || job.totalEstimatedWeightKg} kg collected`
                        : "0 kg"}
                    </div>
                  </div>

                  <div className="text-gray-600 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-forest-700 shrink-0" />
                    <span>
                      {job.location.subCity} • {job.location.specificArea}
                    </span>
                  </div>

                  {assignment?.completionNotes && (
                    <div className="text-[11px] text-gray-500 bg-gray-50 p-2 rounded-lg">
                      <strong>Notes:</strong> {assignment.completionNotes}
                    </div>
                  )}

                  {assignment?.failureReason && (
                    <div className="text-[11px] text-rose-700 bg-rose-50 p-2 rounded-lg">
                      <strong>Reason:</strong> {assignment.failureReason}
                    </div>
                  )}

                  <div className="text-[10px] text-gray-400 pt-1 border-t border-gray-100 flex justify-between">
                    <span>Scheduled: {formatDate(job.scheduledDate)}</span>
                    {assignment?.completedAt && <span>Completed: {formatDateTime(assignment.completedAt)}</span>}
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
