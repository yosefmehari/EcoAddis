import React from "react";
import Link from "next/link";
import {
  Recycle,
  Target,
  ShieldCheck,
  Users,
  Building,
  HeartHandshake,
  ArrowRight,
  Leaf,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="py-12 bg-gray-50/50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-forest-800 bg-forest-100 px-3 py-1 rounded-full">
            Our Purpose & Vision
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-forest-950 mt-3">
            Building a Greener, Cleaner Addis Ababa
          </h1>
          <p className="text-gray-600 text-sm sm:text-base mt-4 leading-relaxed">
            EcoAddis is dedicated to transforming municipal waste logistics across Addis Ababa. We empower residents and enterprises with transparent technology, reliable collection schedules, and direct access to recycling infrastructure.
          </p>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="border-forest-100 shadow-sm">
            <CardContent className="p-8 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-forest-800 text-white flex items-center justify-center">
                <Target className="w-6 h-6 text-meadow-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Zero Open Dumping</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                We believe no community in Addis Ababa should have to live next to overflowing trash mounds. Our on-demand and recurring pickups route waste into organized, licensed recovery facilities.
              </p>
            </CardContent>
          </Card>

          <Card className="border-forest-100 shadow-sm">
            <CardContent className="p-8 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-forest-800 text-white flex items-center justify-center">
                <HeartHandshake className="w-6 h-6 text-meadow-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Fair Dignified Work</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Collection workers and micro-enterprises form the backbone of urban sanitation. EcoAddis equips them with smart digital routing, verified jobs, and reliable compensation tracking.
              </p>
            </CardContent>
          </Card>

          <Card className="border-forest-100 shadow-sm">
            <CardContent className="p-8 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-forest-800 text-white flex items-center justify-center">
                <Recycle className="w-6 h-6 text-meadow-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Circular Material Flow</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Plastic bottles, paper cartons, and scrap metals are valuable resources. By connecting producers directly with certified recyclers, we turn discarded materials into local economic output.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Local Commitment Banner */}
        <div className="bg-forest-900 rounded-3xl p-8 sm:p-12 text-white text-center max-w-4xl mx-auto mb-16">
          <Leaf className="w-10 h-10 text-meadow-400 mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Rooted in Addis Ababa, Engineered for Scalability
          </h2>
          <p className="text-forest-200 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto mb-6">
            From the bustling commercial avenues of Bole and Kazanchis to historic neighborhoods in Arada and expanding districts in Lemi Kura, our platform is tailored specifically to Addis Ababa’s unique geography and community needs.
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-meadow-500 hover:bg-meadow-600 text-forest-950 font-bold px-8 shadow-md">
              Join EcoAddis Today
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
