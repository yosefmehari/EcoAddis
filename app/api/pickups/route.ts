import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSession } from "@/lib/auth";
import { pickupRequestSchema } from "@/lib/validations/pickup";
import { calculateQuote } from "@/lib/pricing";

export const dynamic = "force-dynamic";

// GET /api/pickups - list user requests (or all if admin/collector)
export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    let where: any = {};

    // Role-based visibility
    if (session.role === "CUSTOMER") {
      where.customerId = session.userId;
    } else if (session.role === "COLLECTOR") {
      // Collector sees requests assigned to them
      where.assignments = {
        some: {
          collectorId: session.userId,
        },
      };
    }
    // ADMIN sees all

    if (status && status !== "ALL") {
      where.collectionStatus = status;
    }

    const requests = await prisma.pickupRequest.findMany({
      where,
      include: {
        location: true,
        items: {
          include: { category: true },
        },
        assignments: {
          include: {
            collector: {
              include: { customerProfile: true },
            },
          },
        },
        statusHistory: {
          orderBy: { timestamp: "desc" },
          include: {
            changedBy: {
              select: { email: true, role: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ requests });
  } catch (error) {
    console.error("Fetch pickups error:", error);
    return NextResponse.json(
      { error: "Failed to fetch pickup requests" },
      { status: 500 }
    );
  }
}

// POST /api/pickups - create new waste pickup request
export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = pickupRequestSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = result.data;

    // Calculate server-side verified quote
    const quote = calculateQuote(data.subCity, data.items, data.serviceType);

    // Generate readable sequential request number: EA-YYYY-XXXX
    const count = await prisma.pickupRequest.count();
    const requestNumber = `EA-${new Date().getFullYear()}-${String(count + 1).padStart(4, "0")}`;

    const newRequest = await prisma.$transaction(async (tx) => {
      // 1. Get or create pickup location
      let location = await tx.pickupLocation.findFirst({
        where: {
          subCity: data.subCity,
          woreda: data.woreda,
          specificArea: data.specificArea,
          OR: [
            { customerProfile: { userId: session.userId } },
            { businessProfile: { userId: session.userId } },
          ],
        },
      });

      if (!location) {
        const customerProf = await tx.customerProfile.findUnique({
          where: { userId: session.userId },
        });
        const businessProf = await tx.businessProfile.findUnique({
          where: { userId: session.userId },
        });

        location = await tx.pickupLocation.create({
          data: {
            customerProfileId: customerProf ? customerProf.id : undefined,
            businessProfileId: businessProf ? businessProf.id : undefined,
            label: "Pickup Location",
            subCity: data.subCity,
            woreda: data.woreda,
            specificArea: data.specificArea,
            contactPhone: data.contactPhone,
          },
        });
      }

      // 2. Create the pickup request
      const pickup = await tx.pickupRequest.create({
        data: {
          requestNumber,
          customerId: session.userId,
          locationId: location.id,
          serviceType: data.serviceType,
          collectionStatus: "PENDING",
          paymentStatus: "UNPAID",
          scheduledDate: new Date(data.scheduledDate),
          timeSlot: data.timeSlot,
          totalEstimatedWeightKg: quote.totalEstimatedWeightKg,
          quotedPriceETB: quote.totalPriceETB,
          customerNotes: data.customerNotes,
        },
      });

      // 3. Create items linked to categories
      for (const item of data.items) {
        const category = await tx.wasteCategory.findUnique({
          where: { slug: item.categorySlug },
        });

        if (category) {
          await tx.requestItem.create({
            data: {
              requestId: pickup.id,
              categoryId: category.id,
              estimatedWeightKg: item.weightKg,
              notes: item.notes,
            },
          });
        }
      }

      // 4. Log status history
      await tx.statusHistory.create({
        data: {
          requestId: pickup.id,
          changedById: session.userId,
          previousStatus: "NONE",
          newStatus: "PENDING",
          changeReason: "Customer booked pickup via portal",
        },
      });

      // 5. In-app notification for the customer
      await tx.notification.create({
        data: {
          userId: session.userId,
          title: `Pickup Request Submitted (${requestNumber})`,
          message: `Your waste collection for ${data.subCity} has been scheduled for ${new Date(
            data.scheduledDate
          ).toLocaleDateString()}. Upfront quote: ${quote.totalPriceETB} ETB.`,
          type: "PICKUP_CONFIRMED",
          link: `/customer/requests`,
        },
      });

      return pickup;
    });

    return NextResponse.json(
      {
        message: "Pickup request created successfully",
        request: newRequest,
        quote,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Create pickup error:", error);
    return NextResponse.json(
      { error: "Failed to create pickup request: " + error.message },
      { status: 500 }
    );
  }
}
