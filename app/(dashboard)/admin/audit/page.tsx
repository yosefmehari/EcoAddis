"use client";

import React, { useState, useEffect } from "react";
import { Shield, Clock, Search, RefreshCw, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/utils";

interface AuditLogItem {
  id: string;
  action: string;
  targetEntity: string;
  targetId: string;
  details?: string;
  timestamp: string;
  user?: { email: string; role: string };
}

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const res = await fetch("/api/admin/audit");
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
      }
    } catch (err) {
      console.error("Fetch audit logs err", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Security & Audit Logs</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Immutable log of sensitive administrative interventions, role modifications, and assignments
          </p>
        </div>

        <Button size="sm" variant="outline" onClick={fetchLogs} className="text-xs gap-1.5">
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Logs</span>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="text-center py-12 text-xs text-gray-500">Loading audit trail...</div>
          ) : logs.length === 0 ? (
            <div className="text-center py-12 text-xs text-gray-500">
              No administrative security events recorded yet.
            </div>
          ) : (
            <div className="divide-y divide-gray-100 text-xs">
              {logs.map((log) => (
                <div key={log.id} className="p-4 sm:p-5 space-y-1 hover:bg-gray-50/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900 font-mono">{log.action}</span>
                      <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-mono">
                        {log.targetEntity} #{log.targetId.slice(0, 8)}
                      </span>
                    </div>

                    <span className="text-[10px] text-gray-400">
                      {formatDateTime(log.timestamp)}
                    </span>
                  </div>

                  <p className="text-gray-600">{log.details}</p>

                  <div className="text-[11px] text-gray-400">
                    Executed by: {log.user?.email || "System"} ({log.user?.role || "SYSTEM"})
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
