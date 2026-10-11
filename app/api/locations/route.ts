import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const locations = await prisma.pickupLocation.findMany({
      where: {
        OR: [
          { customerProfile: { userId: session.userId } },
          { businessProfile: { userId: session.userId } },
        ],
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ locations });
  } catch (err) {
    console.error("Locations GET error:", err);
    return NextResponse.json({ error: "Failed to fetch locations" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { label, subCity, woreda, specificArea, contactPhone } = body;

    if (!subCity || !specificArea || !contactPhone) {
      return NextResponse.json({ error: "Required fields missing" }, { status: 400 });
    }

    const customerProf = await prisma.customerProfile.findUnique({
      where: { userId: session.userId },
    });
    const businessProf = await prisma.businessProfile.findUnique({
      where: { userId: session.userId },
    });

    const newLoc = await prisma.pickupLocation.create({
      data: {
        customerProfileId: customerProf ? customerProf.id : undefined,
        businessProfileId: businessProf ? businessProf.id : undefined,
        label: label || "Branch Location",
        subCity,
        woreda: woreda || "Woreda 01",
        specificArea,
        contactPhone,
      },
    });

    return NextResponse.json({ location: newLoc }, { status: 201 });
  } catch (err: any) {
    console.error("Location creation error:", err);
    return NextResponse.json({ error: "Failed to create location" }, { status: 500 });
  }
}
