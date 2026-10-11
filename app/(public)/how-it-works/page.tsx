import React from "react";
import Link from "next/link";
import {
  Calendar,
  Truck,
  Recycle,
  Building,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ArrowRight,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function HowItWorksPage() {
  return (
    <div className="py-12 bg-gray-50/50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-forest-800 bg-forest-100 px-3 py-1 rounded-full">
            Simple, Transparent Steps
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-forest-950 mt-3">
            How EcoAddis Waste Collection Works
          </h1>
          <p className="text-gray-600 text-sm mt-3">
            Whether booking an on-demand household pickup or configuring a recurring commercial collection plan, our platform ensures timely service and transparent pricing across Addis Ababa.
          </p>
        </div>

        {/* 4 Detailed Stages */}
        <div className="space-y-12 max-w-4xl mx-auto">
          {/* Step 1 */}
          <div className="flex flex-col md:flex-row gap-6 items-start bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-forest-800 text-white flex items-center justify-center font-bold text-xl shrink-0">
              01
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-gray-900">
                1. Specify Location & Estimate Materials
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Log into your EcoAddis account and submit a collection request. Choose your Addis Ababa sub-city (e.g. Bole, Kirkos, Yeka), input your woreda and landmark instructions, and select the waste categories you have prepared (such as PET plastics, scrap metals, or organic food scraps).
              </p>
              <div className="pt-2 flex flex-wrap gap-2 text-xs font-medium text-forest-800">
                <span className="bg-forest-50 px-2.5 py-1 rounded-md">Instant ETB Quote</span>
                <span className="bg-forest-50 px-2.5 py-1 rounded-md">Morning or Afternoon Slot</span>
                <span className="bg-forest-50 px-2.5 py-1 rounded-md">Special Handling Options</span>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col md:flex-row gap-6 items-start bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-blue-700 text-white flex items-center justify-center font-bold text-xl shrink-0">
              02
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-gray-900">
                2. Smart Routing & Collector Assignment
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Our central operations dispatch team verifies your request and matches it to an authorized, background-checked collection team operating in your neighborhood. You can track the status in your live dashboard as it moves from Confirmed to Assigned.
              </p>
              <div className="pt-2 flex flex-wrap gap-2 text-xs font-medium text-blue-800">
                <span className="bg-blue-50 px-2.5 py-1 rounded-md">Collector Identification</span>
                <span className="bg-blue-50 px-2.5 py-1 rounded-md">Direct Contact Option</span>
                <span className="bg-blue-50 px-2.5 py-1 rounded-md">No Double Bookings</span>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col md:flex-row gap-6 items-start bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-bold text-xl shrink-0">
              03
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-gray-900">
                3. On-Site Weighing & Collection
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                The collector arrives within your chosen window, reviews your sorted materials, and weighs them using calibrated scales. The final weight is recorded into the collector’s mobile portal, and your verified receipt is updated instantly.
              </p>
              <div className="pt-2 flex flex-wrap gap-2 text-xs font-medium text-amber-800">
                <span className="bg-amber-50 px-2.5 py-1 rounded-md">Cash on Collection</span>
                <span className="bg-amber-50 px-2.5 py-1 rounded-md">Direct Bank Transfer</span>
                <span className="bg-amber-50 px-2.5 py-1 rounded-md">Timestamped Audit History</span>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex flex-col md:flex-row gap-6 items-start bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold text-xl shrink-0">
              04
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-gray-900">
                4. Delivery to Certified Recycling Facilities
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Recovered materials bypass municipal open landfills. Plastics, metals, paper, and glass are routed directly to licensed recycling and reprocessing plants in Addis Ababa, contributing to a cleaner circular economy.
              </p>
              <div className="pt-2 flex flex-wrap gap-2 text-xs font-medium text-emerald-800">
                <span className="bg-emerald-50 px-2.5 py-1 rounded-md">Landfill Diversion</span>
                <span className="bg-emerald-50 px-2.5 py-1 rounded-md">Local Value Creation</span>
                <span className="bg-emerald-50 px-2.5 py-1 rounded-md">Verified Environmental Impact</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Link href="/register">
            <Button size="lg" className="bg-forest-800 hover:bg-forest-900 text-white px-8 py-3 shadow-md gap-2">
              <span>Ready? Book Your Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
