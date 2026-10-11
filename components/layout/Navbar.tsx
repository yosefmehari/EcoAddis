"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Recycle, Menu, X, ArrowRight, User as UserIcon, LogOut, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserSession {
  userId: string;
  email: string;
  role: "CUSTOMER" | "COLLECTOR" | "PARTNER" | "ADMIN";
  accountType: "HOUSEHOLD" | "BUSINESS";
  name?: string;
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }
    fetchUser();
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Logout error", err);
    }
  };

  const getDashboardLink = () => {
    if (!user) return "/login";
    switch (user.role) {
      case "COLLECTOR":
        return "/collector";
      case "PARTNER":
        return "/partner";
      case "ADMIN":
        return "/admin";
      default:
        return "/customer";
    }
  };

  const navLinks = [
    { label: "How It Works", href: "/how-it-works" },
    { label: "Recycling Centers", href: "/recycling-centers" },
    { label: "Waste Guide", href: "/waste-guide" },
    { label: "Pricing", href: "/pricing" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-forest-800 flex items-center justify-center text-white shadow-sm group-hover:bg-forest-900 transition-colors">
              <Recycle className="w-5 h-5 text-meadow-400 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-forest-900">
                Eco<span className="text-meadow-600">Addis</span>
              </span>
              <span className="text-[10px] tracking-wider uppercase text-gray-500 font-medium">
                Addis Ababa Clean City
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === link.href ? "text-forest-800 font-semibold" : "text-gray-600 hover:text-forest-800"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* User actions */}
          <div className="hidden md:flex items-center gap-3">
            {!isLoading && (
              <>
                {user ? (
                  <div className="flex items-center gap-3">
                    <Link href={getDashboardLink()}>
                      <Button variant="outline" size="sm" className="gap-2">
                        {user.role === "ADMIN" ? (
                          <Shield className="w-3.5 h-3.5 text-rose-600" />
                        ) : (
                          <UserIcon className="w-3.5 h-3.5 text-forest-700" />
                        )}
                        <span>Dashboard ({user.role})</span>
                      </Button>
                    </Link>
                    <button
                      onClick={handleLogout}
                      title="Log Out"
                      className="p-2 text-gray-500 hover:text-rose-600 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Link href="/login">
                      <Button variant="ghost" size="sm">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button variant="primary" size="sm" className="gap-1.5">
                        <span>Book Pickup</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="md:hidden border-b border-gray-100 bg-white px-4 pt-2 pb-6 space-y-3">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-lg text-base font-medium ${
                  pathname === link.href ? "bg-forest-50 text-forest-900 font-semibold" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
            {user ? (
              <>
                <Link href={getDashboardLink()} onClick={() => setIsOpen(false)}>
                  <Button variant="primary" className="w-full">
                    Go to Dashboard ({user.role})
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-rose-600"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setIsOpen(false)}>
                  <Button variant="primary" className="w-full">
                    Book Pickup / Register
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
