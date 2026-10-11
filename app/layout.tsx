import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "EcoAddis | Modern Waste Collection & Recycling in Addis Ababa",
  description:
    "EcoAddis connects households, businesses, collectors, and certified recycling facilities across Addis Ababa for cleaner neighborhoods and sustainable material recovery.",
  keywords: [
    "waste management Addis Ababa",
    "recycling Ethiopia",
    "EcoAddis",
    "trash pickup Bole",
    "recyclable plastic Addis Ababa",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-white text-gray-900 selection:bg-meadow-100 selection:text-forest-900">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
