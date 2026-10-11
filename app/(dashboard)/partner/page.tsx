"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Building2,
  ShieldCheck,
  MapPin,
  Phone,
  Clock,
  Layers,
  Plus,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PartnerDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPartner() {
      try {
        const res = await fetch("/api/partner/materials");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error("Partner load err", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadPartner();
  }, []);

  const org = data?.organization;
  const center = data?.center;
  const materials = data?.materials || [];

  return (
    <div className="space-y-6">
      {/* Enterprise Header */}
      <Card className="border-gray-200">
        <CardContent className="p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="font-bold text-xl sm:text-2xl text-gray-900">
                {org?.name || "Addis Green Eco-Recycling Enterprise"}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-meadow-700 bg-meadow-50 px-2 py-0.5 rounded-md border border-meadow-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Facility</span>
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Registration No: <strong>{org?.registrationNumber || "ET-AA-REC-2024-88"}</strong> • Addis Ababa Municipal Partner
            </p>
          </div>

          <Link href="/partner/materials">
            <Button size="sm" className="bg-forest-800 hover:bg-forest-900 text-white gap-2">
              <Plus className="w-4 h-4" />
              <span>Add Accepted Material</span>
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Facility Details & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardContent className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              Primary Facility Depot
            </h3>

            <div className="space-y-2.5 text-xs text-gray-700">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-forest-700 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-gray-900">
                    {center?.name || "Bole Central PET & Plastics Recovery Center"}
                  </div>
                  <div className="text-gray-500">
                    {center?.subCity || "Bole"} Sub-City ({center?.woreda || "Woreda 05"}) • {center?.address || "Bole Atlas road, near Desalegn Hotel"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-forest-700 shrink-0" />
                <span>{center?.phone || "+251911223344"}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-forest-700 shrink-0" />
                <span>{center?.operatingHours || "Mon-Sat: 8:00 AM - 6:00 PM"}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              Active Streams
            </h3>
            <div className="text-3xl font-extrabold text-forest-900">
              {materials.length}
            </div>
            <p className="text-xs text-gray-500">
              Recyclable material categories currently listed for drop-off or collection in Addis Ababa.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Accepted Materials List */}
      <Card>
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-gray-900">Live Material Buying Rates</h3>
            <p className="text-xs text-gray-500 mt-0.5">Rates visible to customers and collectors across Addis</p>
          </div>
          <Link href="/partner/materials" className="text-xs font-semibold text-forest-800 hover:underline">
            Manage Streams →
          </Link>
        </div>

        <CardContent className="p-0">
          {materials.length === 0 ? (
            <div className="p-8 text-center text-xs text-gray-500">
              No materials listed yet. Add your accepted materials and purchase rates.
            </div>
          ) : (
            <div className="divide-y divide-gray-100 text-xs">
              {materials.map((m: any) => (
                <div key={m.id} className="p-4 sm:p-5 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-bold text-gray-900">{m.category?.name || "Material"}</div>
                    <div className="text-[11px] text-gray-500">
                      Minimum quantity: {m.minQuantityKg} kg • Method: {m.dropOffOrPickup}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-bold text-sm text-forest-800">
                      {m.buyingPricePerKgETB > 0 ? `${m.buyingPricePerKgETB} ETB / kg` : "Free Drop-off"}
                    </span>
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
