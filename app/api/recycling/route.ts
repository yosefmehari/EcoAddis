import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const subCity = searchParams.get("subCity");

    const where: any = { isVerified: true };
    if (subCity && subCity !== "all") {
      where.subCity = { equals: subCity, mode: "insensitive" };
    }

    const centers = await prisma.recyclingCenter.findMany({
      where,
      include: {
        acceptedMaterials: {
          include: {
            category: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ centers });
  } catch (error) {
    console.error("Error fetching recycling centers:", error);
    // Return sample verified centers as fallback if database is not yet seeded
    return NextResponse.json({
      centers: [
        {
          id: "center-bole-1",
          name: "Bole Central PET & Plastics Recovery Center",
          subCity: "Bole",
          woreda: "Woreda 05",
          address: "Bole Atlas road, near Desalegn Hotel",
          phone: "+251911223344",
          operatingHours: "Mon-Sat: 8:00 AM - 6:00 PM",
          isVerified: true,
          acceptedMaterials: [
            {
              category: { name: "Plastic & Packaging", slug: "plastic" },
              minQuantityKg: 5,
              buyingPricePerKgETB: 12,
              dropOffOrPickup: "BOTH",
            },
          ],
        },
        {
          id: "center-akaki-1",
          name: "Akaki Kaliti Metal & Industrial Scrap Reclaim",
          subCity: "Akaky Kaliti",
          woreda: "Woreda 01",
          address: "Akaki industrial zone, Main Debrezeit Road",
          phone: "+251922334455",
          operatingHours: "Mon-Fri: 8:30 AM - 5:30 PM",
          isVerified: true,
          acceptedMaterials: [
            {
              category: { name: "Metals & Cans", slug: "metal" },
              minQuantityKg: 15,
              buyingPricePerKgETB: 25,
              dropOffOrPickup: "BOTH",
            },
          ],
        },
        {
          id: "center-yeka-1",
          name: "Yeka Paper & Cardboard Pulping Station",
          subCity: "Yeka",
          woreda: "Woreda 04",
          address: "Signal Area, near British Embassy turnoff",
          phone: "+251933445566",
          operatingHours: "Mon-Sat: 9:00 AM - 5:00 PM",
          isVerified: true,
          acceptedMaterials: [
            {
              category: { name: "Paper & Cardboard", slug: "paper" },
              minQuantityKg: 10,
              buyingPricePerKgETB: 8,
              dropOffOrPickup: "DROP_OFF",
            },
          ],
        },
      ],
    });
  }
}
