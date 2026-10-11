"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Truck,
  CheckCircle2,
  Scale,
  Receipt,
  TrendingUp,
  BarChart2,
  RefreshCw,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatETB } from "@/lib/utils";

const COLORS = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#84cc16", "#ef4444", "#6b7280"];

export default function AdminOverviewPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error("Admin stats err", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const metrics = data?.metrics || {
    totalUsers: 0,
    totalRequests: 0,
    completedCollections: 0,
    activePickups: 0,
    totalRevenueETB: 0,
    totalWeightKg: 0,
  };

  const categoryChart = data?.categoryChartData || [];
  const statusChart = data?.statusChartData || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Citywide Operational Overview
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Real-time statistics sourced directly from the EcoAddis PostgreSQL database
          </p>
        </div>

        <Button size="sm" variant="outline" onClick={fetchStats} className="text-xs gap-1.5">
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Analytics</span>
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between text-gray-500 text-xs font-semibold mb-2">
              <span>Platform Users</span>
              <Users className="w-4 h-4 text-forest-700" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{metrics.totalUsers}</div>
            <p className="text-[11px] text-gray-400 mt-1">Customers, collectors, partners</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between text-gray-500 text-xs font-semibold mb-2">
              <span>Active Requests</span>
              <Truck className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{metrics.activePickups}</div>
            <p className="text-[11px] text-gray-400 mt-1">In dispatch / collection route</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between text-gray-500 text-xs font-semibold mb-2">
              <span>Completed Pickups</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{metrics.completedCollections}</div>
            <p className="text-[11px] text-gray-400 mt-1">
              Of {metrics.totalRequests} total requests
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between text-gray-500 text-xs font-semibold mb-2">
              <span>Collection Revenue</span>
              <Receipt className="w-4 h-4 text-meadow-600" />
            </div>
            <div className="text-2xl font-bold text-forest-900">
              {formatETB(metrics.totalRevenueETB)}
            </div>
            <p className="text-[11px] text-gray-400 mt-1">Completed orders total</p>
          </CardContent>
        </Card>
      </div>

      {/* Recharts Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Volume Bar Chart */}
        <Card className="lg:col-span-8">
          <div className="p-6 pb-2 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-gray-900">
                Material Recovery by Category (kg)
              </h3>
              <p className="text-xs text-gray-500">
                Total weight logged across all collected and active request items
              </p>
            </div>
            <div className="text-xs font-bold text-forest-800">
              Total: {metrics.totalWeightKg} kg
            </div>
          </div>

          <CardContent className="p-6 h-72">
            {categoryChart.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-gray-400">
                No material collection data logged yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryChart} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10, fill: "#64748b" }}
                    interval={0}
                    angle={-20}
                    textAnchor="end"
                  />
                  <YAxis tick={{ fontSize: 10, fill: "#64748b" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e3a2f",
                      borderRadius: "12px",
                      color: "#fff",
                      fontSize: "12px",
                      border: "none",
                    }}
                    formatter={(value: any) => [`${value} kg`, "Weight"]}
                  />
                  <Bar dataKey="weight" fill="#10b981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Status Breakdown */}
        <Card className="lg:col-span-4">
          <div className="p-6 pb-2 border-b border-gray-100">
            <h3 className="font-bold text-sm text-gray-900">Requests by Status</h3>
            <p className="text-xs text-gray-500">Current operational distribution</p>
          </div>

          <CardContent className="p-6">
            {statusChart.length === 0 ? (
              <div className="h-60 flex items-center justify-center text-xs text-gray-400">
                No status data available
              </div>
            ) : (
              <div className="space-y-3 pt-2">
                {statusChart.map((item: any, idx: number) => (
                  <div key={item.status} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                      />
                      <span className="font-medium text-gray-700">{item.status}</span>
                    </div>
                    <span className="font-bold text-gray-900">{item.count}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
