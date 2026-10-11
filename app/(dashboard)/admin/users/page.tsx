"use client";

import React, { useState, useEffect } from "react";
import { Users, Shield, UserCheck, AlertTriangle, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/utils";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error("Fetch users error", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateRole = async (userId: string, newRole: string) => {
    setUpdatingId(userId);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });
      if (res.ok) {
        await fetchUsers();
      }
    } catch (err) {
      console.error("Update role err", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    setUpdatingId(userId);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, status: nextStatus }),
      });
      if (res.ok) {
        await fetchUsers();
      }
    } catch (err) {
      console.error("Toggle status err", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const name = u.customerProfile?.fullName || u.businessProfile?.companyName || "";
    return (
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      name.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">User & Role Management</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Administer customer accounts, authorized field collectors, and certified recycling partners
          </p>
        </div>

        <div className="w-full sm:w-64">
          <input
            type="text"
            placeholder="Search email, name or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white"
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="text-center py-12 text-xs text-gray-500">Loading users...</div>
          ) : (
            <div className="divide-y divide-gray-100 text-xs">
              {filteredUsers.map((u) => {
                const displayName =
                  u.customerProfile?.fullName ||
                  u.businessProfile?.companyName ||
                  u.email.split("@")[0];

                return (
                  <div
                    key={u.id}
                    className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/50"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 text-sm">{displayName}</span>
                        <Badge
                          variant={
                            u.role === "ADMIN"
                              ? "danger"
                              : u.role === "COLLECTOR"
                              ? "info"
                              : u.role === "PARTNER"
                              ? "warning"
                              : "default"
                          }
                        >
                          {u.role}
                        </Badge>
                        <span className="text-[10px] text-gray-400 font-mono">
                          ({u.accountType})
                        </span>
                      </div>

                      <div className="text-gray-500">
                        {u.email} {u.phone && `• ${u.phone}`}
                      </div>

                      <div className="text-[11px] text-gray-400">
                        Joined {formatDateTime(u.createdAt)} • {u._count?.pickupRequests || 0} requests
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Role selection dropdown */}
                      <select
                        value={u.role}
                        disabled={updatingId === u.id}
                        onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                        aria-label="Change Role"
                        className="px-2.5 py-1.5 text-xs rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-forest-500 disabled:opacity-50"
                      >
                        <option value="CUSTOMER">Customer</option>
                        <option value="COLLECTOR">Collector</option>
                        <option value="PARTNER">Partner</option>
                        <option value="ADMIN">Admin</option>
                      </select>

                      <Button
                        size="sm"
                        variant={u.status === "ACTIVE" ? "ghost" : "primary"}
                        isLoading={updatingId === u.id}
                        onClick={() => handleToggleStatus(u.id, u.status)}
                        className={`text-xs py-1 px-3 ${
                          u.status === "ACTIVE"
                            ? "text-rose-600 hover:bg-rose-50"
                            : "bg-emerald-600 text-white"
                        }`}
                      >
                        {u.status === "ACTIVE" ? "Suspend" : "Activate"}
                      </Button>
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
