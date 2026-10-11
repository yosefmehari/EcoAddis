import React from "react";
import Link from "next/link";
import {
  Recycle,
  Truck,
  Building2,
  Calendar,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  MapPin,
  Leaf,
  Clock,
  Sparkles,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { INITIAL_WASTE_CATEGORIES, ADDIS_ABABA_SUB_CITIES } from "@/lib/constants";
import { formatETB } from "@/lib/utils";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-forest-50/70 via-white to-white pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Hero Text */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-100 text-forest-800 text-xs font-semibold uppercase tracking-wider border border-forest-200">
                <Leaf className="w-3.5 h-3.5 text-meadow-600" />
                <span>Environmental Cleanliness in Addis Ababa</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-forest-950 tracking-tight leading-[1.15]">
                Modern, Reliable Waste Collection &{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest-800 via-meadow-600 to-forest-700">
                  Recycling for Addis
                </span>
              </h1>

              <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Connect households and businesses with authorized waste collectors and certified recycling facilities across all 11 sub-cities. Clear pricing in Ethiopian Birr, verified pickups, and zero guesswork.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link href="/register" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto gap-2 bg-forest-800 hover:bg-forest-900 shadow-md">
                    <span>Book a Waste Pickup</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/pricing" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2">
                    <span>Calculate ETB Quote</span>
                  </Button>
                </Link>
                <Link href="/recycling-centers" className="w-full sm:w-auto">
                  <Button variant="ghost" size="lg" className="w-full sm:w-auto gap-2 text-forest-800">
                    <span>Find Recycling Centers</span>
                  </Button>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-gray-100 grid grid-cols-3 gap-4 text-left">
                <div className="flex items-start gap-2.5">
                  <div className="p-2 rounded-lg bg-emerald-50 text-meadow-700">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">Verified Personnel</h4>
                    <p className="text-[11px] text-gray-500">Authorized collectors</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">Fair ETB Rates</h4>
                    <p className="text-[11px] text-gray-500">Upfront weight quotes</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="p-2 rounded-lg bg-amber-50 text-amber-700">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">11 Sub-Cities</h4>
                    <p className="text-[11px] text-gray-500">Bole, Kirkos, Yeka & more</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md bg-white rounded-3xl p-6 shadow-xl border border-gray-100 ring-1 ring-black/5">
                {/* Header preview */}
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-forest-800 flex items-center justify-center text-white">
                      <Recycle className="w-5 h-5 text-meadow-400" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-900">Live Collection Flow</div>
                      <div className="text-[10px] text-gray-500">Bole Woreda 03 • Request #EA-2026</div>
                    </div>
                  </div>
                  <Badge variant="success">Assigned</Badge>
                </div>

                {/* Simulated Order Items */}
                <div className="py-4 space-y-3">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span className="font-medium text-gray-800">PET Plastic & Bottles</span>
                    </div>
                    <span className="text-gray-500">5.0 kg</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                      <span className="font-medium text-gray-800">Paper & Cardboard Boxes</span>
                    </div>
                    <span className="text-gray-500">3.5 kg</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <span className="font-medium text-gray-800">Scrap Metal & Cans</span>
                    </div>
                    <span className="text-gray-500">2.0 kg</span>
                  </div>
                </div>

                {/* Price Summary Breakdown */}
                <div className="p-3.5 rounded-2xl bg-forest-50/80 border border-forest-100 text-xs space-y-1.5">
                  <div className="flex justify-between text-gray-600">
                    <span>Sub-City Base Transport (Bole):</span>
                    <span className="font-semibold text-gray-900">120 ETB</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Materials Weight Fee:</span>
                    <span className="font-semibold text-gray-900">147 ETB</span>
                  </div>
                  <div className="pt-2 border-t border-forest-200/60 flex justify-between text-sm font-bold text-forest-900">
                    <span>Total Upfront Quote:</span>
                    <span className="text-forest-800 font-extrabold">267 ETB</span>
                  </div>
                </div>

                {/* Progress Tracker */}
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                  <div className="flex items-center gap-1.5 text-meadow-700 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Pickup Window: 8:00 AM – 12:00 PM</span>
                  </div>
                  <span className="text-forest-700 font-semibold">Cash / Mobile Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. REAL CITY IMPACT & CONTEXT */}
      <section className="py-16 bg-forest-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs uppercase tracking-widest text-meadow-400 font-bold mb-2">
              Clean City Vision
            </h2>
            <p className="text-3xl font-extrabold text-white">
              The Reality of Waste in Addis Ababa
            </p>
            <p className="text-forest-200 text-sm mt-3">
              Addis Ababa produces thousands of metric tons of waste daily. EcoAddis replaces open dumping with structured collection and recovery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div className="p-6 rounded-2xl bg-forest-800/80 border border-forest-700/60">
              <div className="text-4xl font-extrabold text-meadow-400 mb-1">~3,000</div>
              <div className="text-xs uppercase tracking-wider text-forest-200 font-semibold">Tons Daily Waste</div>
              <p className="text-xs text-gray-300 mt-2">Municipal solid waste generated daily across Addis Ababa</p>
            </div>

            <div className="p-6 rounded-2xl bg-forest-800/80 border border-forest-700/60">
              <div className="text-4xl font-extrabold text-meadow-400 mb-1">65%</div>
              <div className="text-xs uppercase tracking-wider text-forest-200 font-semibold">Organic Fraction</div>
              <p className="text-xs text-gray-300 mt-2">Food and garden residuals ideal for local composting & biogas</p>
            </div>

            <div className="p-6 rounded-2xl bg-forest-800/80 border border-forest-700/60">
              <div className="text-4xl font-extrabold text-meadow-400 mb-1">11</div>
              <div className="text-xs uppercase tracking-wider text-forest-200 font-semibold">Sub-Cities Connected</div>
              <p className="text-xs text-gray-300 mt-2">Structured routes from Arada & Lideta to Akaki & Lemi Kura</p>
            </div>

            <div className="p-6 rounded-2xl bg-forest-800/80 border border-forest-700/60">
              <div className="text-4xl font-extrabold text-meadow-400 mb-1">100%</div>
              <div className="text-xs uppercase tracking-wider text-forest-200 font-semibold">Traceable Jobs</div>
              <p className="text-xs text-gray-300 mt-2">Every collection is assigned, tracked, and logged with receipts</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section className="py-20 bg-gray-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-forest-700 bg-forest-100 px-3 py-1 rounded-full">
              Seamless Workflow
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mt-3">
              How EcoAddis Operates
            </h2>
            <p className="text-gray-600 text-sm mt-2">
              Four verified stages connecting you directly to collectors and recycling facilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="relative p-6 rounded-2xl bg-white border border-gray-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-forest-100 text-forest-800 flex items-center justify-center font-bold text-lg mb-4">
                  01
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">Book & Get Quote</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Choose your sub-city, select waste categories (plastic, paper, organic, e-waste), and view an instant transparent ETB quote.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-1.5 text-xs text-forest-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-meadow-600" />
                <span>Instant price calculation</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative p-6 rounded-2xl bg-white border border-gray-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-lg mb-4">
                  02
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">Collector Assigned</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  EcoAddis dispatchers match your pickup with an authorized collector operating in your sub-city and designated time slot.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-1.5 text-xs text-blue-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <span>Local route optimization</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative p-6 rounded-2xl bg-white border border-gray-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-lg mb-4">
                  03
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">On-Site Collection</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  The collector arrives at your location, weighs sorted categories, updates the job to Completed, and issues your receipt.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-1.5 text-xs text-amber-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-amber-600" />
                <span>Verified digital receipt</span>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative p-6 rounded-2xl bg-white border border-gray-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg mb-4">
                  04
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">Recycle & Divert</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Recovered plastics, metals, and cardboard are delivered to certified recycling enterprises, keeping them out of open landfills.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Diverted from dump sites</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WASTE CATEGORIES & GUIDELINES */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-meadow-700 bg-meadow-50 px-3 py-1 rounded-full">
                Proper Waste Sorting
              </span>
              <h2 className="text-3xl font-bold text-gray-900 mt-3">
                Accepted Waste Categories
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Sort your recyclables to qualify for discounted collection rates and prevent environmental contamination.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link href="/waste-guide">
                <Button variant="outline" size="sm" className="gap-2">
                  <span>View Detailed Sorting Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {INITIAL_WASTE_CATEGORIES.map((cat) => (
              <Card key={cat.slug} className="hover:border-forest-300 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: cat.badgeColor }}
                    />
                    <Badge variant={cat.requiresSpecialHandling ? "danger" : "default"}>
                      {cat.requiresSpecialHandling ? "Special Handling" : "Recyclable"}
                    </Badge>
                  </div>
                  <h3 className="font-bold text-gray-900 text-base mb-1.5">{cat.name}</h3>
                  <p className="text-xs text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                    {cat.description}
                  </p>
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                    <span className="text-gray-500">Base Rate:</span>
                    <span className="font-bold text-forest-800">{cat.baseRatePerKgETB} ETB / kg</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 5. HOUSEHOLD VS BUSINESS PLANS */}
      <section className="py-20 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              Flexible Plans for Every Producer
            </h2>
            <p className="text-gray-600 text-sm mt-2">
              Whether you are an individual household or a multi-branch commercial enterprise in Addis Ababa.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Household Plan */}
            <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="p-3 rounded-2xl bg-forest-100 text-forest-800 inline-block">
                    <Recycle className="w-6 h-6" />
                  </span>
                  <Badge variant="default">Households & Apartments</Badge>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Household On-Demand</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Perfect for residential compounds, condominiums, and families looking for clean, scheduled disposal without neighborhood bin overflow.
                </p>

                <ul className="space-y-3 text-xs text-gray-700 mb-8">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-meadow-600 shrink-0" />
                    <span>Pay-as-you-go per collection or bi-weekly pickup</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-meadow-600 shrink-0" />
                    <span>Morning or Afternoon preferred time windows</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-meadow-600 shrink-0" />
                    <span>Transparent weight quotes before booking</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-meadow-600 shrink-0" />
                    <span>Cash on collection or direct bank transfer</span>
                  </li>
                </ul>
              </div>

              <Link href="/register?type=household">
                <Button className="w-full bg-forest-800 hover:bg-forest-900">
                  Register as Household
                </Button>
              </Link>
            </div>

            {/* Business Plan */}
            <div className="bg-white rounded-3xl p-8 border-2 border-forest-800 shadow-md flex flex-col justify-between relative">
              <div className="absolute -top-3.5 right-8 bg-forest-800 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Commercial Contract
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="p-3 rounded-2xl bg-forest-800 text-white inline-block">
                    <Building2 className="w-6 h-6 text-meadow-400" />
                  </span>
                  <Badge variant="success">Businesses & Institutions</Badge>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Commercial & Corporate</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Tailored for cafes, restaurants, hotels, corporate offices, and manufacturing units needing recurring scheduled pickups and TIN receipts.
                </p>

                <ul className="space-y-3 text-xs text-gray-700 mb-8">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-meadow-600 shrink-0" />
                    <span>Support for multiple branch locations in Addis</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-meadow-600 shrink-0" />
                    <span>Weekly / customized scheduled collection contracts</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-meadow-600 shrink-0" />
                    <span>Formal monthly invoices and TIN documentation</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-meadow-600 shrink-0" />
                    <span>Dedicated account coordinator & priority dispatch</span>
                  </li>
                </ul>
              </div>

              <Link href="/register?type=business">
                <Button className="w-full bg-forest-800 hover:bg-forest-900">
                  Register as Business
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="py-16 bg-gradient-to-r from-forest-900 via-forest-800 to-forest-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-700/60 text-meadow-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Join Hundreds of Responsible Citizens</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold max-w-2xl mx-auto">
            Ready to Keep Addis Ababa Clean and Sustainable?
          </h2>

          <p className="text-forest-200 text-sm max-w-xl mx-auto">
            Book your first waste collection in under two minutes or locate your nearest recycling depot today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link href="/register">
              <Button size="lg" className="bg-meadow-500 hover:bg-meadow-600 text-forest-950 font-bold px-8 shadow-lg">
                Get Started Now
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="border-forest-500 text-white hover:bg-forest-800/80">
                Contact Our Team
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
