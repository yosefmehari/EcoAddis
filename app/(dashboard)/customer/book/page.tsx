"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarPlus,
  MapPin,
  Clock,
  Layers,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Info,
  ShieldCheck,
} from "lucide-react";
import { ADDIS_ABABA_SUB_CITIES, INITIAL_WASTE_CATEGORIES, TIME_SLOTS } from "@/lib/constants";
import { calculateQuote } from "@/lib/pricing";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatETB } from "@/lib/utils";

export default function BookPickupPage() {
  const router = useRouter();

  // Location state
  const [subCity, setSubCity] = useState("Bole");
  const [woreda, setWoreda] = useState("Woreda 03");
  const [specificArea, setSpecificArea] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  // Scheduling state
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  const [scheduledDate, setScheduledDate] = useState(tomorrowStr);
  const [timeSlot, setTimeSlot] = useState<"MORNING_8_12" | "AFTERNOON_1_5">("MORNING_8_12");
  const [serviceType, setServiceType] = useState<
    "ONE_TIME" | "RECURRING_WEEKLY" | "RECURRING_BIWEEKLY" | "RECURRING_MONTHLY"
  >("ONE_TIME");

  // Material weights
  const [weights, setWeights] = useState<Record<string, number>>({
    plastic: 5,
    paper: 3,
    glass: 0,
    metal: 0,
    organic: 0,
    e_waste: 0,
    mixed: 0,
  });

  const [customerNotes, setCustomerNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch saved profile location
  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          const profile = data.user?.customerProfile || data.user?.businessProfile;
          if (profile?.savedLocations?.[0]) {
            const loc = profile.savedLocations[0];
            setSubCity(loc.subCity);
            setWoreda(loc.woreda);
            setSpecificArea(loc.specificArea);
            setContactPhone(loc.contactPhone || data.user.phone || "");
          } else if (data.user?.phone) {
            setContactPhone(data.user.phone);
          }
        }
      } catch (err) {
        console.error("Profile load err", err);
      }
    }
    loadProfile();
  }, []);

  const handleWeightChange = (slug: string, val: number) => {
    setWeights((prev) => ({
      ...prev,
      [slug]: Math.max(0, val),
    }));
  };

  const selectedSubCityData = ADDIS_ABABA_SUB_CITIES.find(
    (sc) => sc.name.toLowerCase() === subCity.toLowerCase()
  );

  const activeItems = Object.entries(weights)
    .filter(([_, w]) => w > 0)
    .map(([slug, weightKg]) => ({ categorySlug: slug, weightKg }));

  const quote = calculateQuote(subCity, activeItems, serviceType);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (activeItems.length === 0) {
      setError("Please specify an estimated weight for at least one waste category.");
      return;
    }

    if (!specificArea.trim()) {
      setError("Please provide a neighborhood or landmark address for the collector.");
      return;
    }

    if (!contactPhone.trim()) {
      setError("Please provide a valid contact phone number.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        subCity,
        woreda,
        specificArea,
        contactPhone,
        scheduledDate: new Date(scheduledDate).toISOString(),
        timeSlot,
        serviceType,
        items: activeItems,
        customerNotes: customerNotes.trim() || undefined,
      };

      const res = await fetch("/api/pickups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to schedule pickup");
      }

      router.push("/customer/requests");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Schedule Waste Pickup</h1>
        <p className="text-xs text-gray-500 mt-1">
          Select collection location, material categories, and preferred time window in Addis Ababa.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Inputs Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Location Details */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-900 uppercase tracking-wider">
                <MapPin className="w-4 h-4 text-forest-700" />
                <span>1. Pickup Location (Addis Ababa)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Sub-City
                  </label>
                  <select
                    value={subCity}
                    onChange={(e) => {
                      setSubCity(e.target.value);
                      setWoreda("Woreda 01");
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white"
                  >
                    {ADDIS_ABABA_SUB_CITIES.map((sc) => (
                      <option key={sc.id} value={sc.name}>
                        {sc.name} Sub-City (Base: {sc.baseFeeETB} ETB)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Woreda
                  </label>
                  <select
                    value={woreda}
                    onChange={(e) => setWoreda(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white"
                  >
                    {selectedSubCityData?.woredas.map((w) => (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    )) || <option value="Woreda 01">Woreda 01</option>}
                  </select>
                </div>
              </div>

              <Input
                label="Neighborhood / Street / Compound Landmark"
                required
                placeholder="e.g. Near Edna Mall, House #204, compound gate opposite nursery"
                value={specificArea}
                onChange={(e) => setSpecificArea(e.target.value)}
                helperText="Detailed landmarks help your collector locate the gate quickly."
              />

              <Input
                label="Contact Phone for Arrival"
                required
                placeholder="0911223344"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
              />
            </CardContent>
          </Card>

          {/* 2. Waste Categories & Estimated Weights */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-900 uppercase tracking-wider">
                  <Layers className="w-4 h-4 text-forest-700" />
                  <span>2. Waste Categories & Weight (kg)</span>
                </div>
                <span className="text-[11px] text-gray-400">Estimate weight per category</span>
              </div>

              <div className="space-y-3 pt-1">
                {INITIAL_WASTE_CATEGORIES.map((cat) => {
                  const currentWeight = weights[cat.slug] || 0;
                  return (
                    <div
                      key={cat.slug}
                      className="p-3 rounded-xl border border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: cat.badgeColor }}
                        />
                        <div>
                          <span className="font-bold text-xs text-gray-900">{cat.name}</span>
                          <span className="text-[10px] text-gray-500 block">
                            {cat.baseRatePerKgETB} ETB/kg {cat.requiresSpecialHandling && "• E-waste protocol"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min="0"
                          max="40"
                          step="0.5"
                          value={currentWeight}
                          onChange={(e) => handleWeightChange(cat.slug, parseFloat(e.target.value))}
                          className="w-28 accent-forest-700 cursor-pointer"
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

          {/* 3. Date & Time Window */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-900 uppercase tracking-wider">
                <Clock className="w-4 h-4 text-forest-700" />
                <span>3. Preferred Schedule & Time Slot</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Pickup Date
                  </label>
                  <input
                    type="date"
                    min={tomorrowStr}
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Frequency
                  </label>
                  <select
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white"
                  >
                    <option value="ONE_TIME">One-Time Collection</option>
                    <option value="RECURRING_WEEKLY">Weekly Recurring (15% Off)</option>
                    <option value="RECURRING_BIWEEKLY">Bi-Weekly Recurring (10% Off)</option>
                    <option value="RECURRING_MONTHLY">Monthly Recurring (5% Off)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Time Window
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => setTimeSlot(slot.id as any)}
                      className={`p-3 rounded-xl border text-left text-xs transition-all ${
                        timeSlot === slot.id
                          ? "bg-forest-800 text-white border-forest-800 shadow-sm"
                          : "bg-white text-gray-700 border-gray-200 hover:border-forest-300"
                      }`}
                    >
                      <div className="font-bold">{slot.label}</div>
                      <div className={timeSlot === slot.id ? "text-meadow-300 text-[10px]" : "text-gray-400 text-[10px]"}>
                        {slot.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Optional Collector Instructions
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Please call 10 minutes before arrival; waste bags are near the inner garage door."
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pricing Summary & Confirmation Sticky Column */}
        <div className="lg:col-span-5 sticky top-28 space-y-4">
          <Card className="border-forest-200 shadow-lg overflow-hidden">
            <div className="bg-forest-900 p-6 text-white">
              <span className="text-[10px] font-bold uppercase tracking-wider text-meadow-400">
                Transparent Upfront Quote
              </span>
              <div className="text-3xl font-extrabold text-white mt-1">
                {formatETB(quote.totalPriceETB)}
              </div>
              <p className="text-xs text-forest-200 mt-1">
                Estimated weight: {quote.totalEstimatedWeightKg.toFixed(1)} kg • {quote.subCity}
              </p>
            </div>

            <CardContent className="p-6 space-y-4">
              <div className="space-y-2 text-xs text-gray-700">
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-500">Sub-City Logistics Base:</span>
                  <span className="font-semibold">{formatETB(quote.subCityBaseFeeETB)}</span>
                </div>

                {quote.items.map((it) => (
                  <div key={it.categorySlug} className="flex justify-between py-1 border-b border-gray-100">
                    <span className="text-gray-500">
                      {it.name} ({it.weightKg} kg):
                    </span>
                    <span className="font-semibold">{formatETB(it.subtotalETB)}</span>
                  </div>
                ))}

                {quote.specialHandlingSurchargeETB > 0 && (
                  <div className="flex justify-between py-1 border-b border-gray-100 text-rose-700">
                    <span>E-Waste Safe Disposal Surcharge:</span>
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
                <span>Total Upfront Quote:</span>
                <span className="text-base font-extrabold text-forest-800">
                  {formatETB(quote.totalPriceETB)}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-[11px] text-gray-500 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-forest-700 shrink-0 mt-0.5" />
                <span>
                  Payment is made upon collector verification on-site (Cash or Direct Bank Transfer/Telebirr).
                </span>
              </div>

              <Button
                type="submit"
                isLoading={isSubmitting}
                className="w-full bg-forest-800 hover:bg-forest-900 text-white font-bold py-3 shadow-md gap-2"
              >
                <span>Confirm & Schedule Request</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
