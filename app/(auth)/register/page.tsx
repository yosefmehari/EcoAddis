"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Recycle,
  User,
  Building2,
  MapPin,
  Phone,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { ADDIS_ABABA_SUB_CITIES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialType = searchParams.get("type") === "business" ? "BUSINESS" : "HOUSEHOLD";

  const [accountType, setAccountType] = useState<"HOUSEHOLD" | "BUSINESS">(initialType);
  const [role, setRole] = useState<"CUSTOMER" | "PARTNER">("CUSTOMER");

  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    tinNumber: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    subCity: "Bole",
    woreda: "Woreda 03",
    specificArea: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(false);

  const selectedSubCityData = ADDIS_ABABA_SUB_CITIES.find(
    (sc) => sc.name.toLowerCase() === formData.subCity.toLowerCase()
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: role,
        accountType: accountType,
        fullName: formData.fullName || (accountType === "HOUSEHOLD" ? "Resident" : undefined),
        companyName: accountType === "BUSINESS" ? formData.companyName : undefined,
        tinNumber: accountType === "BUSINESS" ? formData.tinNumber : undefined,
        subCity: formData.subCity,
        woreda: formData.woreda,
        specificArea: formData.specificArea,
      };

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.issues) {
          setFieldErrors(data.issues);
          throw new Error("Please correct the form fields highlighted below.");
        }
        throw new Error(data.error || "Registration failed");
      }

      // Redirect upon success
      if (role === "PARTNER") {
        router.push("/partner");
      } else {
        router.push("/customer");
      }
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-12 bg-gradient-to-b from-forest-50/40 to-white min-h-[calc(100vh-80px)] flex flex-col justify-center">
      <div className="max-w-xl w-full mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-forest-800 text-white flex items-center justify-center mx-auto mb-3 shadow-md">
            <Recycle className="w-6 h-6 text-meadow-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Create an EcoAddis Account
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Join Addis Ababa&apos;s clean city waste and recycling network
          </p>
        </div>

        <Card className="border-gray-200 shadow-md">
          <CardContent className="p-6 sm:p-8 space-y-6">
            {/* Account Type Toggle */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Select Account Classification
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setAccountType("HOUSEHOLD");
                    setRole("CUSTOMER");
                  }}
                  className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                    accountType === "HOUSEHOLD"
                      ? "bg-forest-800 text-white border-forest-800 shadow-sm"
                      : "bg-white text-gray-700 border-gray-200 hover:border-forest-300"
                  }`}
                >
                  <User className="w-5 h-5" />
                  <div>
                    <div className="font-bold text-xs sm:text-sm">Household</div>
                    <div className={accountType === "HOUSEHOLD" ? "text-meadow-300 text-[10px]" : "text-gray-500 text-[10px]"}>
                      Residents & families
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setAccountType("BUSINESS")}
                  className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                    accountType === "BUSINESS"
                      ? "bg-forest-800 text-white border-forest-800 shadow-sm"
                      : "bg-white text-gray-700 border-gray-200 hover:border-forest-300"
                  }`}
                >
                  <Building2 className="w-5 h-5" />
                  <div>
                    <div className="font-bold text-xs sm:text-sm">Commercial</div>
                    <div className={accountType === "BUSINESS" ? "text-meadow-300 text-[10px]" : "text-gray-500 text-[10px]"}>
                      Offices, cafes, hotels
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {accountType === "BUSINESS" ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <Input
                      label="Company / Enterprise Name"
                      required
                      placeholder="e.g. Tomoca Coffee Roastery"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      error={fieldErrors.companyName?.[0]}
                    />
                    <Input
                      label="TIN Number (Optional)"
                      placeholder="e.g. 0048291048"
                      value={formData.tinNumber}
                      onChange={(e) => setFormData({ ...formData, tinNumber: e.target.value })}
                    />
                  </div>
                  <Input
                    label="Authorized Representative Name"
                    required
                    placeholder="e.g. Daniel Worku (Facility Manager)"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    error={fieldErrors.fullName?.[0]}
                  />
                </>
              ) : (
                <Input
                  label="Full Name"
                  required
                  placeholder="e.g. Selamawit Tadesse"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  error={fieldErrors.fullName?.[0]}
                />
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <Input
                  label="Email Address"
                  type="email"
                  required
                  placeholder="you@domain.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  error={fieldErrors.email?.[0]}
                />
                <Input
                  label="Phone Number"
                  required
                  placeholder="0911223344 or +251..."
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  error={fieldErrors.phone?.[0]}
                />
              </div>

              {/* Addis Ababa Location Fields */}
              <div className="pt-2 border-t border-gray-100">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">
                  Default Pickup Address (Addis Ababa)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-3.5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Sub-City
                    </label>
                    <select
                      value={formData.subCity}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          subCity: e.target.value,
                          woreda: "Woreda 01",
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white"
                    >
                      {ADDIS_ABABA_SUB_CITIES.map((sc) => (
                        <option key={sc.id} value={sc.name}>
                          {sc.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Woreda
                    </label>
                    <select
                      value={formData.woreda}
                      onChange={(e) => setFormData({ ...formData, woreda: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white"
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
                  label="Specific Neighborhood / Landmark"
                  required
                  placeholder="e.g. Bole Atlas, behind Desalegn Hotel, House #402"
                  value={formData.specificArea}
                  onChange={(e) => setFormData({ ...formData, specificArea: e.target.value })}
                  error={fieldErrors.specificArea?.[0]}
                />
              </div>

              {/* Password Fields */}
              <div className="pt-2 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <Input
                  label="Password"
                  type="password"
                  required
                  placeholder="Min. 8 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  error={fieldErrors.password?.[0]}
                />
                <Input
                  label="Confirm Password"
                  type="password"
                  required
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
              </div>

              <Button
                type="submit"
                isLoading={isLoading}
                className="w-full bg-forest-800 hover:bg-forest-900 text-white py-2.5 shadow-sm mt-2"
              >
                Create Account & Proceed
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-gray-500 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-forest-800 hover:underline">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-xs text-gray-500">
          Loading registration...
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
