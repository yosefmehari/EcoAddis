import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || (session.role !== "PARTNER" && session.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find center associated with partner organization
    const membership = await prisma.organizationMembership.findFirst({
      where: { userId: session.userId },
      include: {
        organization: {
          include: {
            recyclingCenters: {
              include: {
                acceptedMaterials: {
                  include: { category: true },
                },
              },
            },
          },
        },
      },
    });

    const center = membership?.organization?.recyclingCenters?.[0];

    return NextResponse.json({
      organization: membership?.organization,
      center,
      materials: center?.acceptedMaterials || [],
    });
  } catch (err) {
    console.error("Partner materials GET err:", err);
    return NextResponse.json({ error: "Failed to fetch materials" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "PARTNER" && session.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { categoryId, minQuantityKg, buyingPricePerKgETB, dropOffOrPickup } = body;

    const membership = await prisma.organizationMembership.findFirst({
      where: { userId: session.userId },
      include: {
        organization: {
          include: { recyclingCenters: true },
        },
      },
    });

    let center = membership?.organization?.recyclingCenters?.[0];

    if (!center) {
      return NextResponse.json(
        { error: "No recycling center registered under this partner account" },
        { status: 404 }
      );
    }

    const material = await prisma.acceptedMaterial.create({
      data: {
        centerId: center.id,
        categoryId,
        minQuantityKg: parseFloat(minQuantityKg) || 1.0,
        buyingPricePerKgETB: parseFloat(buyingPricePerKgETB) || 0.0,
        dropOffOrPickup: dropOffOrPickup || "BOTH",
      },
      include: { category: true },
    });

    return NextResponse.json({ material }, { status: 201 });
  } catch (err: any) {
    console.error("Partner material creation err:", err);
    return NextResponse.json({ error: "Failed to create material listing" }, { status: 500 });
  }
}
