"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Calculator, Check, ArrowRight, Shield, Info, Sparkles } from "lucide-react";
import { ADDIS_ABABA_SUB_CITIES, INITIAL_WASTE_CATEGORIES } from "@/lib/constants";
import { calculateQuote } from "@/lib/pricing";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatETB } from "@/lib/utils";

export default function PricingPage() {
  const [selectedSubCity, setSelectedSubCity] = useState<string>("Bole");
  const [serviceType, setServiceType] = useState<"ONE_TIME" | "RECURRING_WEEKLY" | "RECURRING_BIWEEKLY" | "RECURRING_MONTHLY">("ONE_TIME");
  const [weights, setWeights] = useState<Record<string, number>>({
    plastic: 5,
    paper: 3,
    glass: 0,
    metal: 0,
    organic: 0,
    e_waste: 0,
    mixed: 0,
  });

  const handleWeightChange = (slug: string, val: number) => {
    setWeights((prev) => ({
      ...prev,
      [slug]: Math.max(0, val),
    }));
  };

  const activeItems = Object.entries(weights)
    .filter(([_, w]) => w > 0)
    .map(([slug, weightKg]) => ({ categorySlug: slug, weightKg }));

  const quote = calculateQuote(selectedSubCity, activeItems, serviceType);

  return (
    <div className="py-12 bg-gray-50/60 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-100 text-forest-800 text-xs font-semibold uppercase tracking-wider mb-3">
            <Calculator className="w-3.5 h-3.5" />
            <span>Transparent Pricing in ETB</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-forest-950">
            Real-Time Collection Price Calculator
          </h1>
          <p className="text-gray-600 text-sm mt-3">
            Calculate your exact waste collection price before booking. No surprise fees. Every sub-city has a transparent base logistics rate plus per-kilogram sorting rates.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls column */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Sub-city selector */}
            <Card>
              <CardContent className="p-6">
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  1. Select Your Addis Ababa Sub-City
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {ADDIS_ABABA_SUB_CITIES.map((sc) => (
                    <button
                      key={sc.id}
                      type="button"
                      onClick={() => setSelectedSubCity(sc.name)}
                      className={`p-3 rounded-xl border text-left text-xs font-medium transition-all ${
                        selectedSubCity.toLowerCase() === sc.name.toLowerCase()
                          ? "bg-forest-800 text-white border-forest-800 shadow-sm"
                          : "bg-white text-gray-700 border-gray-200 hover:border-forest-300"
                      }`}
                    >
                      <div className="font-bold">{sc.name}</div>
                      <div className={selectedSubCity.toLowerCase() === sc.name.toLowerCase() ? "text-meadow-300" : "text-gray-500"}>
                        Base: {sc.baseFeeETB} ETB
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 2. Service frequency */}
            <Card>
              <CardContent className="p-6">
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  2. Collection Frequency
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: "ONE_TIME", label: "One-Time", discount: "Standard" },
                    { id: "RECURRING_WEEKLY", label: "Weekly", discount: "15% Off" },
                    { id: "RECURRING_BIWEEKLY", label: "Bi-Weekly", discount: "10% Off" },
                    { id: "RECURRING_MONTHLY", label: "Monthly", discount: "5% Off" },
                  ].map((freq) => (
                    <button
                      key={freq.id}
                      type="button"
                      onClick={() => setServiceType(freq.id as any)}
                      className={`p-3 rounded-xl border text-center text-xs transition-all ${
                        serviceType === freq.id
                          ? "bg-forest-800 text-white border-forest-800"
                          : "bg-white text-gray-700 border-gray-200 hover:border-forest-300"
                      }`}
                    >
                      <div className="font-bold">{freq.label}</div>
                      <div className={serviceType === freq.id ? "text-meadow-300" : "text-emerald-600 font-medium"}>
                        {freq.discount}
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 3. Materials weight inputs */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-bold text-gray-900">
                    3. Estimated Material Weights (kg)
                  </label>
                  <span className="text-xs text-gray-500">Slide or type kg amounts</span>
                </div>

                <div className="space-y-4">
                  {INITIAL_WASTE_CATEGORIES.map((cat) => {
                    const currentWeight = weights[cat.slug] || 0;
                    return (
                      <div
                        key={cat.slug}
                        className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-3.5 h-3.5 rounded-full shrink-0"
                            style={{ backgroundColor: cat.badgeColor }}
                          />
                          <div>
                            <div className="text-xs font-bold text-gray-900">{cat.name}</div>
                            <div className="text-[11px] text-gray-500">
                              {cat.baseRatePerKgETB} ETB/kg {cat.requiresSpecialHandling && "• Special handling"}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <input
                            type="range"
                            min="0"
                            max="50"
                            step="0.5"
                            value={currentWeight}
                            onChange={(e) => handleWeightChange(cat.slug, parseFloat(e.target.value))}
                            className="w-32 accent-forest-700 cursor-pointer"
                          />
                          <div className="flex items-center gap-1 w-20">
                            <input
                              type="number"
                              min="0"
                              max="500"
                              value={currentWeight}
                              onChange={(e) => handleWeightChange(cat.slug, parseFloat(e.target.value) || 0)}
                              className="w-14 px-2 py-1 text-xs border border-gray-300 rounded-md text-right font-medium"
                            />
                            <span className="text-xs text-gray-500">kg</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quote output card */}
          <div className="lg:col-span-5 sticky top-28">
            <Card className="border-forest-200 shadow-lg overflow-hidden ring-1 ring-forest-900/5">
              <div className="bg-forest-900 p-6 text-white">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-meadow-400 font-bold">
                    Official ETB Quote
                  </span>
                  <span className="text-xs bg-forest-800 text-forest-200 px-2 py-0.5 rounded-md">
                    Instant Calculation
                  </span>
                </div>
                <div className="mt-3">
                  <div className="text-3xl sm:text-4xl font-extrabold text-white">
                    {formatETB(quote.totalPriceETB)}
                  </div>
                  <div className="text-xs text-forest-200 mt-1">
                    Estimated {quote.totalEstimatedWeightKg.toFixed(1)} kg • {quote.subCity} Sub-City
                  </div>
                </div>
              </div>

              <CardContent className="p-6 space-y-4">
                <div className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Cost Breakdown
                </div>

                <div className="space-y-2 text-xs text-gray-700">
                  <div className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-600">Base Transport ({quote.subCity}):</span>
                    <span className="font-semibold">{formatETB(quote.subCityBaseFeeETB)}</span>
                  </div>

                  {quote.items.map((item) => (
                    <div key={item.categorySlug} className="flex justify-between py-1 border-b border-gray-100">
                      <span className="text-gray-600">
                        {item.name} ({item.weightKg} kg × {item.ratePerKgETB} ETB):
                      </span>
                      <span className="font-semibold">{formatETB(item.subtotalETB)}</span>
                    </div>
                  ))}

                  {quote.specialHandlingSurchargeETB > 0 && (
                    <div className="flex justify-between py-1 border-b border-gray-100 text-rose-700">
                      <span>Certified E-Waste Handling Surcharge:</span>
                      <span className="font-semibold">+{formatETB(quote.specialHandlingSurchargeETB)}</span>
                    </div>
                  )}

                  {quote.discountETB > 0 && (
                    <div className="flex justify-between py-1 border-b border-gray-100 text-emerald-700">
                      <span>Recurring Schedule Discount:</span>
                      <span className="font-semibold">-{formatETB(quote.discountETB)}</span>
                    </div>
                  )}
                </div>

                <div className="pt-2 flex justify-between items-center text-sm font-bold text-forest-950">
                  <span>Total Payable:</span>
                  <span className="text-lg text-forest-800 font-extrabold">
                    {formatETB(quote.totalPriceETB)}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-[11px] text-gray-500 flex items-start gap-2">
                  <Info className="w-4 h-4 text-forest-700 shrink-0 mt-0.5" />
                  <span>
                    Payment is made upon collector verification on-site (Cash or Direct Bank Transfer/Telebirr).
                  </span>
                </div>

                <Link href="/register" className="block w-full">
                  <Button className="w-full bg-forest-800 hover:bg-forest-900 text-white font-bold py-3 shadow-md gap-2">
                    <span>Book This Collection Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
