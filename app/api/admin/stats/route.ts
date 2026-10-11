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

    // 1. Basic counts
    const [userCount, requestCount, completedCount, activeCount, collectors] = await Promise.all([
      prisma.user.count(),
      prisma.pickupRequest.count(),
      prisma.pickupRequest.count({ where: { collectionStatus: "COMPLETED" } }),
      prisma.pickupRequest.count({
        where: {
          collectionStatus: {
            in: ["PENDING", "CONFIRMED", "ASSIGNED", "IN_PROGRESS"],
          },
        },
      }),
      prisma.user.findMany({
        where: { role: "COLLECTOR" },
        include: { customerProfile: true },
      }),
    ]);

    // 2. Total weight & revenue
    const allRequests = await prisma.pickupRequest.findMany({
      select: {
        quotedPriceETB: true,
        totalEstimatedWeightKg: true,
        collectionStatus: true,
      },
    });

    const totalRevenueETB = allRequests
      .filter((r) => r.collectionStatus === "COMPLETED")
      .reduce((acc, r) => acc + r.quotedPriceETB, 0);

    const totalWeightKg = allRequests.reduce((acc, r) => acc + r.totalEstimatedWeightKg, 0);

    // 3. Category volume breakdown from RequestItem
    const items = await prisma.requestItem.findMany({
      include: { category: true },
    });

    const categoryMap: Record<string, number> = {};
    for (const item of items) {
      const catName = item.category.name;
      categoryMap[catName] = (categoryMap[catName] || 0) + item.estimatedWeightKg;
    }

    const categoryChartData = Object.entries(categoryMap).map(([name, weight]) => ({
      name,
      weight: Math.round(weight * 10) / 10,
    }));

    // 4. Status breakdown
    const statusMap: Record<string, number> = {};
    for (const req of allRequests) {
      statusMap[req.collectionStatus] = (statusMap[req.collectionStatus] || 0) + 1;
    }

    const statusChartData = Object.entries(statusMap).map(([status, count]) => ({
      status,
      count,
    }));

    return NextResponse.json({
      metrics: {
        totalUsers: userCount,
        totalRequests: requestCount,
        completedCollections: completedCount,
        activePickups: activeCount,
        totalRevenueETB,
        totalWeightKg: Math.round(totalWeightKg * 10) / 10,
      },
      categoryChartData,
      statusChartData,
      collectors: collectors.map((c) => ({
        id: c.id,
        email: c.email,
        name: c.customerProfile?.fullName || c.email,
      })),
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json({ error: "Failed to load admin stats" }, { status: 500 });
  }
}
