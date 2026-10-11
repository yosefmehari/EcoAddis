import React from "react";
import Link from "next/link";
import {
  Recycle,
  Check,
  X,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
} from "lucide-react";
import { INITIAL_WASTE_CATEGORIES } from "@/lib/constants";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function WasteGuidePage() {
  const guideDetails: Record<
    string,
    { accepted: string[]; prohibited: string[]; tip: string }
  > = {
    plastic: {
      accepted: [
        "High-density bottles (shampoo, milk, cooking oil)",
        "Clear PET water and soft-drink bottles",
        "Clean plastic buckets and containers",
        "HDPE shopping bags and packaging film",
      ],
      prohibited: [
        "Plastics contaminated with grease or motor oil",
        "Medical tubing or biohazard syringes",
        "Single-use plastic straws or thin unrecyclable wraps",
      ],
      tip: "Rinse beverage bottles and squash them flat to minimize volume in your storage area.",
    },
    paper: {
      accepted: [
        "Cardboard shipping and packaging boxes",
        "Office printing papers and notebooks",
        "Old newspapers, magazines, and flyers",
        "Clean paper bags and egg cartons",
      ],
      prohibited: [
        "Wet, moldy, or food-greasy pizza boxes",
        "Wax-coated papers or carbon receipts",
        "Used hygiene tissues or napkins",
      ],
      tip: "Flatten all cardboard cartons so they stack neatly and occupy minimal space.",
    },
    glass: {
      accepted: [
        "Beer and beverage glass bottles",
        "Food preserve and condiment jars",
        "Clean cosmetic glass containers",
      ],
      prohibited: [
        "Broken windshields or tempered automotive glass",
        "Mirrors and window pane shards",
        "Ceramic mugs, plates, or porcelain",
        "Incandescent or fluorescent light bulbs",
      ],
      tip: "Keep glass intact; whole bottles can often be reused or returned directly.",
    },
    metal: {
      accepted: [
        "Aluminum beverage cans",
        "Tin food cans (rinsed)",
        "Scrap metal pieces, pipes, and rebar offcuts",
        "Clean copper cables and wiring",
      ],
      prohibited: [
        "Pressurized aerosol cans containing hazardous gas",
        "Containers contaminated with toxic paint or pesticides",
      ],
      tip: "Aluminum cans carry high recycling value in Addis Ababa—keep them sorted separately.",
    },
    organic: {
      accepted: [
        "Fruit and vegetable scraps and peelings",
        "Injera and bread leftovers",
        "Coffee grounds (buna grounds) and tea leaves",
        "Garden cuttings, leaves, and lawn clippings",
      ],
      prohibited: [
        "Raw meat bones or plastic-wrapped food packaging",
        "Pet waste or cat litter",
        "Chemically treated wood or plastics",
      ],
      tip: "Keep organic bins covered and in a shaded spot to prevent odors and insect pests.",
    },
    e_waste: {
      accepted: [
        "Mobile phones, tablets, and chargers",
        "Desktop computers, laptops, and hard drives",
        "Printers, monitors, keyboards, and mice",
        "Small kitchen appliances (irons, blenders, kettles)",
      ],
      prohibited: [
        "Leaking industrial lead-acid car batteries",
        "Broken CRT tubes with hazardous exposed phosphors",
        "Radioactive or industrial hospital medical electronics",
      ],
      tip: "Never throw e-waste into regular bins; heavy metals pollute the local groundwater.",
    },
    mixed: {
      accepted: [
        "Sanitary residuals and general non-recyclable trash",
        "Dust and sweepings from compound cleaning",
        "Broken miscellaneous plastic-composite items",
      ],
      prohibited: [
        "Industrial toxic chemical drums",
        "Explosives or flammable petroleum products",
      ],
      tip: "Aim to minimize mixed waste by separating organic and recyclable items early.",
    },
  };

  return (
    <div className="py-12 bg-gray-50/60 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-meadow-700 bg-meadow-50 px-3 py-1 rounded-full">
            Knowledge Base
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-forest-950 mt-3">
            Addis Ababa Waste Sorting & Recycling Guide
          </h1>
          <p className="text-gray-600 text-sm mt-3">
            Learn what materials can be recycled, how to prepare them for collection, and how to safely dispose of special waste categories.
          </p>
        </div>

        {/* Categories Detail Cards */}
        <div className="space-y-8 max-w-5xl mx-auto">
          {INITIAL_WASTE_CATEGORIES.map((cat) => {
            const details = guideDetails[cat.slug];
            return (
              <Card key={cat.slug} className="overflow-hidden border-gray-200">
                <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full shrink-0"
                      style={{ backgroundColor: cat.badgeColor }}
                    />
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">{cat.name}</h2>
                      <p className="text-xs text-gray-500">{cat.description}</p>
                    </div>
                  </div>
                  <Badge variant={cat.requiresSpecialHandling ? "danger" : "default"}>
                    {cat.requiresSpecialHandling ? "Special Protocol" : "Standard Sorting"}
                  </Badge>
                </div>

                <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Accepted */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>What We Accept</span>
                    </div>
                    <ul className="space-y-2 text-xs text-gray-600">
                      {details?.accepted.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-emerald-500 font-bold mt-0.5">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Prohibited */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-rose-800 uppercase tracking-wider">
                      <X className="w-4 h-4 text-rose-600" />
                      <span>Not Accepted in This Stream</span>
                    </div>
                    <ul className="space-y-2 text-xs text-gray-600">
                      {details?.prohibited.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-rose-500 font-bold mt-0.5">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Preparation Tip */}
                  <div className="md:col-span-2 pt-4 border-t border-gray-100 flex items-start gap-2.5 text-xs text-gray-700 bg-forest-50/50 p-3 rounded-xl border border-forest-100">
                    <Lightbulb className="w-4 h-4 text-forest-800 shrink-0 mt-0.5" />
                    <span>
                      <strong>EcoAddis Tip:</strong> {details?.tip}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Link href="/register">
            <Button size="lg" className="bg-forest-800 hover:bg-forest-900 text-white px-8 py-3 shadow-md gap-2">
              <span>Start Sorting: Book a Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
