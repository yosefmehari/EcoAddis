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

    const logs = await prisma.auditLog.findMany({
      include: {
        user: {
          select: { email: true, role: true },
        },
      },
      orderBy: { timestamp: "desc" },
      take: 50,
    });

    return NextResponse.json({ logs });
  } catch (err) {
    console.error("Audit log GET err:", err);
    return NextResponse.json({ error: "Failed to fetch audit logs" }, { status: 500 });
  }
}
