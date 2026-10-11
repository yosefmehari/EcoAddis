import React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  return (
    <div className="py-20 min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-50/50">
      <div className="max-w-md w-full mx-auto px-4 text-center space-y-5">
        <div className="w-16 h-16 rounded-3xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Access Restricted</h1>
        <p className="text-sm text-gray-600 leading-relaxed">
          You do not have administrative authorization to view this section of the EcoAddis platform. Access is restricted according to your assigned user role.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link href="/login">
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              Switch Account
            </Button>
          </Link>
          <Link href="/">
            <Button size="sm" className="w-full sm:w-auto bg-forest-800 hover:bg-forest-900 text-white gap-2">
              <Home className="w-4 h-4" />
              <span>Return Home</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
