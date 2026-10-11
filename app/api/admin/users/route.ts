import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const users = await prisma.user.findMany({
      include: {
        customerProfile: true,
        businessProfile: true,
        _count: {
          select: { pickupRequests: true, assignedJobs: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ users });
  } catch (err) {
    console.error("Admin users GET err:", err);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { userId, role, status } = body;

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        role: role || undefined,
        status: status || undefined,
      },
    });

    // Record audit log
    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: "UPDATE_USER_PERMISSIONS",
        targetEntity: "User",
        targetId: userId,
        details: `Updated role to ${role || "unchanged"} and status to ${status || "unchanged"}`,
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (err: any) {
    console.error("Admin user update err:", err);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
