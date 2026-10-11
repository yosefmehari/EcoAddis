"use client";

import React, { useState, useEffect } from "react";
import { LifeBuoy, AlertCircle, Plus, CheckCircle2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/utils";

interface ComplaintItem {
  id: string;
  subject: string;
  description: string;
  status: "OPEN" | "INVESTIGATING" | "RESOLVED" | "CLOSED";
  adminResponse?: string;
  createdAt: string;
  request?: { requestNumber: string };
}

export default function CustomerComplaintsPage() {
  const [complaints, setComplaints] = useState<ComplaintItem[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [requestId, setRequestId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchComplaints = async () => {
    try {
      const res = await fetch("/api/complaints");
      if (res.ok) {
        const data = await res.json();
        setComplaints(data.complaints || []);
      }
    } catch (err) {
      console.error("Fetch complaints err", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, description, requestId }),
      });
      if (res.ok) {
        setShowAdd(false);
        setSubject("");
        setDescription("");
        setRequestId("");
        await fetchComplaints();
      }
    } catch (err) {
      console.error("Create ticket err", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (st: string) => {
    switch (st) {
      case "RESOLVED":
        return <Badge variant="success">Resolved</Badge>;
      case "INVESTIGATING":
        return <Badge variant="warning">Investigating</Badge>;
      case "CLOSED":
        return <Badge variant="neutral">Closed</Badge>;
      default:
        return <Badge variant="default">Open Ticket</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Support & Service Complaints</h1>
          <p className="text-xs text-gray-500 mt-1">
            Report missed collections, delayed arrivals, or improper weighing disputes.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setShowAdd(!showAdd)}
          className="bg-forest-800 hover:bg-forest-900 text-white gap-2"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Open Support Ticket</span>
        </Button>
      </div>

      {showAdd && (
        <Card className="border-forest-200">
          <CardContent className="p-6">
            <form onSubmit={handleCreate} className="space-y-4">
              <h3 className="font-bold text-sm text-gray-900">File a Service Complaint</h3>

              <Input
                label="Subject / Issue Summary"
                required
                placeholder="e.g. Collector arrived outside scheduled window, or incorrect weight recorded"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />

              <Input
                label="Related Request Number (Optional)"
                placeholder="e.g. EA-2026-0001"
                value={requestId}
                onChange={(e) => setRequestId(e.target.value)}
              />

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Detailed Explanation
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Please provide details of what happened, time of incident, and your phone contact..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowAdd(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" isLoading={isSubmitting} className="bg-forest-800 text-white">
                  Submit Ticket
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Complaints List */}
      {isLoading ? (
        <div className="text-center py-12 text-xs text-gray-500">Loading tickets...</div>
      ) : complaints.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-xs text-gray-500">
            No complaints filed. We strive to maintain excellent service quality across all collections!
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {complaints.map((c) => (
            <Card key={c.id} className="border-gray-200">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-sm text-gray-900">{c.subject}</h3>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Filed on {formatDateTime(c.createdAt)} {c.request && `• Request #${c.request.requestNumber}`}
                    </p>
                  </div>
                  {getStatusBadge(c.status)}
                </div>

                <p className="text-xs text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  {c.description}
                </p>

                {c.adminResponse && (
                  <div className="p-3 rounded-xl bg-forest-50 border border-forest-100 text-xs text-forest-900 space-y-1">
                    <div className="font-bold flex items-center gap-1.5 text-forest-800">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>EcoAddis Operations Response:</span>
                    </div>
                    <p className="text-forest-800/90">{c.adminResponse}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
