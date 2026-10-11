import React from "react";
import Link from "next/link";
import { Shield, Clock, AlertTriangle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TermsPage() {
  return (
    <div className="py-12 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-2 text-xs text-forest-800 hover:underline mb-8">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>

        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-xs text-gray-500 mb-8">Last Updated: October 2026 • EcoAddis Technologies, Addis Ababa, Ethiopia</p>

        <div className="prose prose-sm text-gray-700 space-y-6 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">1. Scope of Service</h2>
            <p>
              EcoAddis provides digital coordination, logistics matching, and verifiable tracking for municipal solid waste collection, recyclable materials pickup, and commercial waste subscriptions across designated sub-cities of Addis Ababa, Ethiopia.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">2. Booking, Pricing & Quotations</h2>
            <p>
              All collection quotes provided on the EcoAddis platform are denominated in Ethiopian Birr (ETB). Price quotes are based upon selected sub-city logistics transport fees and customer-estimated material weights. Final charges are verified on-site by authorized collectors using calibrated scales.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">3. Cancellation & Rescheduling Rules</h2>
            <p>
              Customers may cancel or reschedule a scheduled collection free of charge while the request status remains in <strong>Pending</strong> or <strong>Confirmed</strong>. If an assignment is already <strong>In Progress</strong> and the collector has arrived at the designated address, a 50 ETB trip mobilization fee may apply.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">4. Prohibited Materials & Hazardous Waste</h2>
            <p>
              Customers must not place prohibited hazardous materials (such as live explosives, uncontained industrial chemical acids, or untreated hospital biohazards) into standard residential waste bins. Electronic waste (e-waste) must be explicitly flagged during booking to ensure compliance with certified handling standards.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">5. Collector Safety & Property Access</h2>
            <p>
              Customers must ensure safe compound access and secure domestic animals during the scheduled collection window. If a collector cannot safely access the site, the job will be marked as Failed/Inaccessible with documented reason.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
