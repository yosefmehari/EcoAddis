import React from "react";
import Link from "next/link";
import { Recycle, MapPin, Phone, Mail, ShieldCheck } from "lucide-react";
import { ADDIS_ABABA_SUB_CITIES } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-forest-950 text-white border-t border-forest-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand & mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-forest-800 flex items-center justify-center text-white">
                <Recycle className="w-5 h-5 text-meadow-400" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                Eco<span className="text-meadow-400">Addis</span>
              </span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed max-w-sm">
              Connecting Addis Ababa households, businesses, collectors, and verified recycling facilities to build a cleaner, greener capital through reliable waste management and material recovery.
            </p>
            <div className="flex items-center gap-3 text-xs text-forest-200 bg-forest-900/60 p-3 rounded-xl border border-forest-800/80 max-w-sm">
              <ShieldCheck className="w-4 h-4 text-meadow-400 shrink-0" />
              <span>Transparent ETB pricing • Verified collection partners • Sub-city coverage</span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Services
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-300">
              <li>
                <Link href="/register" className="hover:text-meadow-400 transition-colors">
                  Household Pickup
                </Link>
              </li>
              <li>
                <Link href="/register?type=business" className="hover:text-meadow-400 transition-colors">
                  Business Contracts
                </Link>
              </li>
              <li>
                <Link href="/recycling-centers" className="hover:text-meadow-400 transition-colors">
                  Recycling Directory
                </Link>
              </li>
              <li>
                <Link href="/waste-guide" className="hover:text-meadow-400 transition-colors">
                  Waste Sorting Guide
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-meadow-400 transition-colors">
                  ETB Price Calculator
                </Link>
              </li>
            </ul>
          </div>

          {/* Sub-Cities Coverage */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Service Areas
            </h4>
            <div className="flex flex-wrap gap-1.5 text-xs text-gray-300">
              {ADDIS_ABABA_SUB_CITIES.map((area) => (
                <span
                  key={area.id}
                  className="px-2 py-1 bg-forest-900/80 rounded-md border border-forest-800/60 text-forest-100"
                >
                  {area.name}
                </span>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Contact Us
            </h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-meadow-400 shrink-0 mt-0.5" />
                <span>Bole Medhanialem Area, Addis Ababa, Ethiopia</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-meadow-400 shrink-0" />
                <span>+251 911 00 22 33</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-meadow-400 shrink-0" />
                <span>support@ecoaddis.et</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-forest-900/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} EcoAddis Technologies Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
