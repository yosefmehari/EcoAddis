"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Clock,
  Search,
  CheckCircle,
  Filter,
  Recycle,
  Building,
  ShieldCheck,
} from "lucide-react";
import { ADDIS_ABABA_SUB_CITIES, INITIAL_WASTE_CATEGORIES } from "@/lib/constants";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface RecyclingCenterItem {
  id: string;
  name: string;
  subCity: string;
  woreda: string;
  address: string;
  phone: string;
  operatingHours: string;
  isVerified: boolean;
  acceptedMaterials?: {
    category: { name: string; slug: string };
    minQuantityKg: number;
    buyingPricePerKgETB: number;
    dropOffOrPickup: string;
  }[];
}

export default function RecyclingCentersPage() {
  const [centers, setCenters] = useState<RecyclingCenterItem[]>([]);
  const [search, setSearch] = useState("");
  const [subCityFilter, setSubCityFilter] = useState("all");
  const [materialFilter, setMaterialFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCenters() {
      try {
        const res = await fetch("/api/recycling");
        if (res.ok) {
          const data = await res.json();
          setCenters(data.centers || []);
        }
      } catch (err) {
        console.error("Failed to load centers", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCenters();
  }, []);

  const filteredCenters = centers.filter((center) => {
    const matchesSearch =
      center.name.toLowerCase().includes(search.toLowerCase()) ||
      center.address.toLowerCase().includes(search.toLowerCase()) ||
      center.subCity.toLowerCase().includes(search.toLowerCase());

    const matchesSubCity =
      subCityFilter === "all" || center.subCity.toLowerCase() === subCityFilter.toLowerCase();

    const matchesMaterial =
      materialFilter === "all" ||
      center.acceptedMaterials?.some(
        (m) => m.category.slug.toLowerCase() === materialFilter.toLowerCase()
      );

    return matchesSearch && matchesSubCity && matchesMaterial;
  });

  return (
    <div className="py-12 bg-gray-50/60 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-forest-100 text-forest-800 text-xs font-semibold uppercase tracking-wider mb-3">
            <Recycle className="w-3.5 h-3.5 text-meadow-600" />
            <span>Addis Ababa Recycling Directory</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-forest-950">
            Verified Recycling Centers & Material Buyers
          </h1>
          <p className="text-gray-600 text-sm mt-3">
            Find certified facilities accepting sorted plastics, cardboard, glass, scrap metals, and electronics. Drop off materials directly or view verified buying prices per kg.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <Card className="mb-8">
          <CardContent className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-center">
            <div className="sm:col-span-5 relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search by facility name, landmark, or street..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
              />
            </div>

            <div className="sm:col-span-4">
              <select
                value={subCityFilter}
                onChange={(e) => setSubCityFilter(e.target.value)}
                aria-label="Filter by Sub-City"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white"
              >
                <option value="all">All Addis Ababa Sub-Cities</option>
                {ADDIS_ABABA_SUB_CITIES.map((sc) => (
                  <option key={sc.id} value={sc.name}>
                    {sc.name} Sub-City
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-3">
              <select
                value={materialFilter}
                onChange={(e) => setMaterialFilter(e.target.value)}
                aria-label="Filter by Accepted Material"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white"
              >
                <option value="all">All Material Categories</option>
                {INITIAL_WASTE_CATEGORIES.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Centers Grid */}
        {isLoading ? (
          <div className="text-center py-20 text-gray-500">
            <Recycle className="w-8 h-8 mx-auto animate-spin text-forest-700 mb-2" />
            <p className="text-sm">Loading verified recycling centers...</p>
          </div>
        ) : filteredCenters.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 p-8 max-w-lg mx-auto">
            <Building className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-800">No centers found matching criteria</h3>
            <p className="text-xs text-gray-500 mt-1">
              Try adjusting your sub-city or material filter, or book a scheduled pickup through EcoAddis directly.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCenters.map((center) => (
              <Card key={center.id} className="hover:shadow-md transition-shadow flex flex-col justify-between">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h3 className="font-bold text-base text-gray-900 leading-snug">{center.name}</h3>
                    {center.isVerified && (
                      <span className="shrink-0 inline-flex items-center gap-1 text-[11px] font-bold text-meadow-700 bg-meadow-50 px-2 py-0.5 rounded-md border border-meadow-200">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Verified</span>
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 text-xs text-gray-600 mb-4">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-forest-700 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-gray-900">{center.subCity}</strong> ({center.woreda}) • {center.address}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-forest-700 shrink-0" />
                      <span>{center.operatingHours}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-forest-700 shrink-0" />
                      <span className="font-medium text-gray-800">{center.phone}</span>
                    </div>
                  </div>

                  {/* Accepted Materials List */}
                  <div className="pt-3 border-t border-gray-100">
                    <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Accepted Recyclables & Buying Rates
                    </div>
                    {center.acceptedMaterials && center.acceptedMaterials.length > 0 ? (
                      <div className="space-y-1.5">
                        {center.acceptedMaterials.map((mat, idx) => (
                          <div
                            key={idx}
                            className="p-2 rounded-lg bg-gray-50 flex items-center justify-between text-xs"
                          >
                            <span className="font-medium text-gray-800">{mat.category.name}</span>
                            <span className="text-forest-800 font-bold">
                              {mat.buyingPricePerKgETB > 0
                                ? `${mat.buyingPricePerKgETB} ETB/kg`
                                : "Free Drop-off"}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">Accepts mixed clean recyclables</span>
                    )}
                  </div>
                </CardContent>

                <div className="p-4 pt-0 border-t border-gray-50 bg-gray-50/50 flex items-center justify-between">
                  <span className="text-[11px] text-gray-500">Drop-off & Bulk Recovery</span>
                  <a
                    href={`tel:${center.phone}`}
                    className="text-xs font-semibold text-forest-800 hover:text-forest-950 underline"
                  >
                    Call Center
                  </a>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
