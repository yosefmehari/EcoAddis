"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Recycle, Lock, Mail, ArrowRight, ShieldCheck, KeyRound, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to log in");
      }

      // Redirect according to user role
      const role = data.user.role;
      if (role === "ADMIN") router.push("/admin");
      else if (role === "COLLECTOR") router.push("/collector");
      else if (role === "PARTNER") router.push("/partner");
      else router.push("/customer");

      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const setDemoCredentials = (roleEmail: string) => {
    setEmail(roleEmail);
    setPassword("EcoAddis2026!");
    setError(null);
  };

  return (
    <div className="py-16 bg-gradient-to-b from-forest-50/50 to-white min-h-[calc(100vh-80px)] flex flex-col justify-center">
      <div className="max-w-md w-full mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-forest-800 text-white flex items-center justify-center mx-auto mb-3 shadow-md">
            <Recycle className="w-6 h-6 text-meadow-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Sign In to EcoAddis</h1>
          <p className="text-xs text-gray-500 mt-1">
            Access your waste collection requests, assigned routes, or operations portal
          </p>
        </div>

        <Card className="border-gray-200 shadow-md">
          <CardContent className="p-6 sm:p-8 space-y-6">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Input
                label="Password"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button
                type="submit"
                isLoading={isLoading}
                className="w-full bg-forest-800 hover:bg-forest-900 text-white py-2.5 shadow-sm"
              >
                Sign In
              </Button>
            </form>

            {/* Quick Demo Credentials */}
            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2.5">
                <KeyRound className="w-3.5 h-3.5 text-forest-700" />
                <span>Quick Role Demo Logins</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setDemoCredentials("admin@ecoaddis.et")}
                  className="p-2 rounded-lg bg-gray-50 hover:bg-forest-50 border border-gray-200 text-gray-700 text-left transition-colors"
                >
                  <div className="font-bold text-gray-900">Admin</div>
                  <div className="text-[10px] text-gray-500">Full operations control</div>
                </button>

                <button
                  type="button"
                  onClick={() => setDemoCredentials("collector@ecoaddis.et")}
                  className="p-2 rounded-lg bg-gray-50 hover:bg-forest-50 border border-gray-200 text-gray-700 text-left transition-colors"
                >
                  <div className="font-bold text-gray-900">Lead Collector</div>
                  <div className="text-[10px] text-gray-500">Mobile collection routes</div>
                </button>

                <button
                  type="button"
                  onClick={() => setDemoCredentials("household@ecoaddis.et")}
                  className="p-2 rounded-lg bg-gray-50 hover:bg-forest-50 border border-gray-200 text-gray-700 text-left transition-colors"
                >
                  <div className="font-bold text-gray-900">Household</div>
                  <div className="text-[10px] text-gray-500">Residential requests</div>
                </button>

                <button
                  type="button"
                  onClick={() => setDemoCredentials("business@ecoaddis.et")}
                  className="p-2 rounded-lg bg-gray-50 hover:bg-forest-50 border border-gray-200 text-gray-700 text-left transition-colors"
                >
                  <div className="font-bold text-gray-900">Business</div>
                  <div className="text-[10px] text-gray-500">Commercial cafe/roastery</div>
                </button>

                <button
                  type="button"
                  onClick={() => setDemoCredentials("partner@ecoaddis.et")}
                  className="p-2 rounded-lg bg-gray-50 hover:bg-forest-50 border border-gray-200 text-gray-700 text-left transition-colors col-span-2"
                >
                  <div className="font-bold text-gray-900">Recycling Partner</div>
                  <div className="text-[10px] text-gray-500">Material buyer portal</div>
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-gray-500 mt-6">
          Don&apos;t have an EcoAddis account yet?{" "}
          <Link href="/register" className="font-bold text-forest-800 hover:underline">
            Register now
          </Link>
        </p>
      </div>
    </div>
  );
}
