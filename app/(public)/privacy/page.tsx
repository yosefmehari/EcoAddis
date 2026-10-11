import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="py-12 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-2 text-xs text-forest-800 hover:underline mb-8">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>

        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Privacy & Data Protection</h1>
        <p className="text-xs text-gray-500 mb-8">Effective: October 2026 • EcoAddis Technologies, Addis Ababa, Ethiopia</p>

        <div className="prose prose-sm text-gray-700 space-y-6 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">1. Information We Collect</h2>
            <p>
              To provide waste collection and recycling matching in Addis Ababa, we collect customer names, phone numbers, email addresses, and neighborhood locations (Sub-city, Woreda, and specific landmark directions). For commercial enterprises, we collect company names, TIN numbers, and contact coordinator details.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">2. How Your Information Is Used</h2>
            <p>
              Your contact information and address are shared strictly with authorized EcoAddis collection personnel dispatched to your specific pickup job to ensure accurate on-time arrival. We never sell or share customer contact records with third-party advertisers.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">3. Role-Based Access Isolation</h2>
            <p>
              Our database architecture strictly segregates customer records. Other households or businesses cannot view your pickup requests, invoices, or address details. System administrators access operational records only for dispatching, fraud prevention, and customer complaint resolution.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-2">4. Data Retention & Account Deletion</h2>
            <p>
              You may request account deactivation or the deletion of saved pickup locations at any time by contacting our support team at <a href="mailto:support@ecoaddis.et" className="text-forest-800 underline">support@ecoaddis.et</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
