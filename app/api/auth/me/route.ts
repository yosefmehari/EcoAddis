import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        email: true,
        phone: true,
        role: true,
        accountType: true,
        status: true,
        customerProfile: {
          include: { savedLocations: true },
        },
        businessProfile: {
          include: { savedLocations: true },
        },
        _count: {
          select: {
            notifications: { where: { isRead: false } },
            pickupRequests: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        ...session,
        phone: user.phone,
        unreadNotifications: user._count.notifications,
        totalRequests: user._count.pickupRequests,
        customerProfile: user.customerProfile,
        businessProfile: user.businessProfile,
      },
    });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
