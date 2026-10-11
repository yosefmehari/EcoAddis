import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSession } from "@/lib/auth";
import { updatePickupStatusSchema } from "@/lib/validations/pickup";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const pickup = await prisma.pickupRequest.findUnique({
      where: { id: params.id },
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
        paymentRecords: true,
      },
    });

    if (!pickup) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    // Authorization check
    if (
      session.role === "CUSTOMER" &&
      pickup.customerId !== session.userId
    ) {
      return NextResponse.json({ error: "Forbidden access" }, { status: 403 });
    }

    if (session.role === "COLLECTOR") {
      const isAssigned = pickup.assignments.some(
        (a) => a.collectorId === session.userId
      );
      if (!isAssigned) {
        return NextResponse.json(
          { error: "Forbidden: You are not assigned to this pickup" },
          { status: 403 }
        );
      }
    }

    return NextResponse.json({ pickup });
  } catch (error) {
    console.error("Fetch pickup detail error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = updatePickupStatusSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { status, notes, failureReason, collectedWeightKg, collectorId } = result.data;

    const existingPickup = await prisma.pickupRequest.findUnique({
      where: { id: params.id },
      include: { assignments: true },
    });

    if (!existingPickup) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    // Role-based transition enforcement:
    // 1. Customer can only CANCEL and only if PENDING or CONFIRMED
    if (session.role === "CUSTOMER") {
      if (existingPickup.customerId !== session.userId) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      if (status !== "CANCELLED") {
        return NextResponse.json(
          { error: "Customers can only cancel requests" },
          { status: 403 }
        );
      }
      if (
        existingPickup.collectionStatus !== "PENDING" &&
        existingPickup.collectionStatus !== "CONFIRMED"
      ) {
        return NextResponse.json(
          {
            error:
              "Cannot cancel request once assigned or in progress. Please contact dispatch support.",
          },
          { status: 400 }
        );
      }
    }

    // 2. Collector can only update jobs assigned to them
    if (session.role === "COLLECTOR") {
      const assignment = existingPickup.assignments.find(
        (a) => a.collectorId === session.userId
      );
      if (!assignment) {
        return NextResponse.json(
          { error: "You are not assigned to this job" },
          { status: 403 }
        );
      }
    }

    // Execute update in transaction
    const updated = await prisma.$transaction(async (tx) => {
      const updateData: any = {
        collectionStatus: status,
      };

      if (status === "CANCELLED") {
        updateData.cancellationReason = notes || "Cancelled by user";
      }

      const pickup = await tx.pickupRequest.update({
        where: { id: params.id },
        data: updateData,
      });

      // Update assignment if collector / admin
      if (session.role === "COLLECTOR") {
        const assignmentStatus =
          status === "IN_PROGRESS"
            ? "IN_PROGRESS"
            : status === "COMPLETED"
            ? "COMPLETED"
            : status === "FAILED"
            ? "CANCELLED"
            : "ACCEPTED";

        await tx.collectionAssignment.updateMany({
          where: {
            requestId: params.id,
            collectorId: session.userId,
          },
          data: {
            status: assignmentStatus,
            acknowledgedAt: new Date(),
            completedAt: status === "COMPLETED" ? new Date() : undefined,
            completionNotes: notes,
            collectedWeightKg: collectedWeightKg,
            failureReason: failureReason,
          },
        });
      }

      // If admin assigned a collector
      if (session.role === "ADMIN" && collectorId) {
        // Remove prior active assignment if any
        await tx.collectionAssignment.deleteMany({
          where: { requestId: params.id },
        });

        await tx.collectionAssignment.create({
          data: {
            requestId: params.id,
            collectorId,
            status: "ASSIGNED",
          },
        });
      }

      // Record immutable StatusHistory
      await tx.statusHistory.create({
        data: {
          requestId: params.id,
          changedById: session.userId,
          previousStatus: existingPickup.collectionStatus,
          newStatus: status,
          changeReason: notes || (failureReason ? `Failure: ${failureReason}` : `Updated to ${status}`),
        },
      });

      // Notify customer of status change
      await tx.notification.create({
        data: {
          userId: existingPickup.customerId,
          title: `Pickup ${existingPickup.requestNumber} Updated`,
          message: `Your waste collection request status changed to: ${status}.`,
          type: "STATUS_CHANGE",
          link: `/customer/requests`,
        },
      });

      return pickup;
    });

    return NextResponse.json({
      message: `Pickup status updated to ${status}`,
      pickup: updated,
    });
  } catch (error: any) {
    console.error("Update pickup error:", error);
    return NextResponse.json(
      { error: "Failed to update pickup: " + error.message },
      { status: 500 }
    );
  }
}
