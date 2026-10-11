"use client";

import React, { useState, useEffect } from "react";
import { Layers, Plus, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { INITIAL_WASTE_CATEGORIES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function PartnerMaterialsPage() {
  const [materials, setMaterials] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [categorySlug, setCategorySlug] = useState("plastic");
  const [minQuantityKg, setMinQuantityKg] = useState("5");
  const [buyingPricePerKgETB, setBuyingPricePerKgETB] = useState("12");
  const [dropOffOrPickup, setDropOffOrPickup] = useState("BOTH");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchMaterials = async () => {
    try {
      const res = await fetch("/api/partner/materials");
      if (res.ok) {
        const json = await res.json();
        setMaterials(json.materials || []);
      }
    } catch (err) {
      console.error("Fetch err", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Find category id or slug
      const selected = INITIAL_WASTE_CATEGORIES.find((c) => c.slug === categorySlug);
      const res = await fetch("/api/partner/materials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryId: categorySlug, // will match slug or id in handler
          minQuantityKg,
          buyingPricePerKgETB,
          dropOffOrPickup,
        }),
      });
      if (res.ok) {
        setShowAdd(false);
        await fetchMaterials();
      }
    } catch (err) {
      console.error("Add mat err", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Accepted Recyclables & Buying Rates</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Set which recyclable categories your facility buys from residents and collectors
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setShowAdd(!showAdd)}
          className="bg-forest-800 hover:bg-forest-900 text-white gap-2"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Material Listing</span>
        </Button>
      </div>

      {showAdd && (
        <Card className="border-forest-200">
          <CardContent className="p-6">
            <form onSubmit={handleAdd} className="space-y-4">
              <h3 className="font-bold text-sm text-gray-900">Add New Recyclable Stream</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Waste Material Category
                  </label>
                  <select
                    value={categorySlug}
                    onChange={(e) => setCategorySlug(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white"
                  >
                    {INITIAL_WASTE_CATEGORIES.map((cat) => (
                      <option key={cat.slug} value={cat.slug}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Drop-off / Pickup Modality
                  </label>
                  <select
                    value={dropOffOrPickup}
                    onChange={(e) => setDropOffOrPickup(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white"
                  >
                    <option value="BOTH">Both Facility Drop-Off & On-Site Pickup</option>
                    <option value="DROP_OFF">Depot Drop-Off Only</option>
                    <option value="PICKUP_AVAILABLE">Collector Bulk Pickup Only</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Buying Price (ETB per kg)"
                  type="number"
                  step="0.5"
                  required
                  placeholder="e.g. 15"
                  value={buyingPricePerKgETB}
                  onChange={(e) => setBuyingPricePerKgETB(e.target.value)}
                  helperText="Enter 0 if material is accepted as free civic drop-off."
                />
                <Input
                  label="Minimum Quantity (kg)"
                  type="number"
                  step="0.5"
                  required
                  placeholder="e.g. 5"
                  value={minQuantityKg}
                  onChange={(e) => setMinQuantityKg(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowAdd(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" isLoading={isSubmitting} className="bg-forest-800 text-white">
                  Publish Material Rate
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Materials List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {materials.map((m: any) => (
          <Card key={m.id} className="border-gray-200">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <div className="font-bold text-sm text-gray-900">{m.category?.name || "Material"}</div>
                <div className="text-xs text-gray-500">
                  Minimum accepted: <strong>{m.minQuantityKg} kg</strong>
                </div>
                <div className="text-[11px] text-forest-700">Method: {m.dropOffOrPickup}</div>
              </div>

              <div className="text-right">
                <div className="text-base font-extrabold text-forest-800">
                  {m.buyingPricePerKgETB > 0 ? `${m.buyingPricePerKgETB} ETB` : "Free Drop"}
                </div>
                <div className="text-[10px] text-gray-400">per kilogram</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
