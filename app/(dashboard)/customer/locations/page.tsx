"use client";

import React, { useState, useEffect } from "react";
import { MapPin, Plus, Phone, Trash2, Building } from "lucide-react";
import { ADDIS_ABABA_SUB_CITIES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface LocationItem {
  id: string;
  label: string;
  subCity: string;
  woreda: string;
  specificArea: string;
  contactPhone: string;
  isDefault: boolean;
}

export default function CustomerLocationsPage() {
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({
    label: "",
    subCity: "Bole",
    woreda: "Woreda 03",
    specificArea: "",
    contactPhone: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchLocations = async () => {
    try {
      const res = await fetch("/api/locations");
      if (res.ok) {
        const data = await res.json();
        setLocations(data.locations || []);
      }
    } catch (err) {
      console.error("Fetch locs error", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/locations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setShowAdd(false);
        setFormData({
          label: "",
          subCity: "Bole",
          woreda: "Woreda 03",
          specificArea: "",
          contactPhone: "",
        });
        await fetchLocations();
      }
    } catch (err) {
      console.error("Create loc err", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedSubCityData = ADDIS_ABABA_SUB_CITIES.find(
    (sc) => sc.name.toLowerCase() === formData.subCity.toLowerCase()
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Saved Pickup Locations</h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage compound addresses, store branches, or warehouse pickup points in Addis Ababa.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setShowAdd(!showAdd)}
          className="bg-forest-800 hover:bg-forest-900 text-white gap-2"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Location</span>
        </Button>
      </div>

      {showAdd && (
        <Card className="border-forest-200">
          <CardContent className="p-6">
            <form onSubmit={handleCreate} className="space-y-4">
              <h3 className="font-bold text-sm text-gray-900">Add New Pickup Location</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <Input
                  label="Label / Location Name"
                  required
                  placeholder="e.g. Home, Kazanchis Branch, Bole Workshop"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                />
                <Input
                  label="Contact Phone for Gate Access"
                  required
                  placeholder="0911223344"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Sub-City
                  </label>
                  <select
                    value={formData.subCity}
                    onChange={(e) =>
                      setFormData({ ...formData, subCity: e.target.value, woreda: "Woreda 01" })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white"
                  >
                    {ADDIS_ABABA_SUB_CITIES.map((sc) => (
                      <option key={sc.id} value={sc.name}>
                        {sc.name} Sub-City
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Woreda
                  </label>
                  <select
                    value={formData.woreda}
                    onChange={(e) => setFormData({ ...formData, woreda: e.target.value })}
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
                label="Detailed Landmark / Compound Description"
                required
                placeholder="e.g. Next to Zemen Bank, Building 4B, 2nd compound gate"
                value={formData.specificArea}
                onChange={(e) => setFormData({ ...formData, specificArea: e.target.value })}
              />

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowAdd(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" isLoading={isSubmitting} className="bg-forest-800 text-white">
                  Save Location
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Locations List */}
      {isLoading ? (
        <div className="text-center py-12 text-xs text-gray-500">Loading locations...</div>
      ) : locations.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-xs text-gray-500">
            No saved locations found. Add your first address above.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {locations.map((loc) => (
            <Card key={loc.id} className="border-gray-200">
              <CardContent className="p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-forest-700" />
                    <span className="font-bold text-sm text-gray-900">{loc.label}</span>
                  </div>
                  {loc.isDefault && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      Primary
                    </span>
                  )}
                </div>

                <div className="text-xs text-gray-600">
                  <strong>{loc.subCity}</strong> ({loc.woreda})
                </div>

                <p className="text-xs text-gray-500">{loc.specificArea}</p>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    <span>{loc.contactPhone}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
