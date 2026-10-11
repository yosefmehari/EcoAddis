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

    const where: any = {};
    if (session.role === "CUSTOMER") {
      where.userId = session.userId;
    }

    const complaints = await prisma.complaint.findMany({
      where,
      include: {
        request: {
          select: { requestNumber: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ complaints });
  } catch (err) {
    console.error("Complaints GET err:", err);
    return NextResponse.json({ error: "Failed to fetch complaints" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { subject, description, requestId } = body;

    if (!subject || !description) {
      return NextResponse.json({ error: "Subject and description required" }, { status: 400 });
    }

    const complaint = await prisma.complaint.create({
      data: {
        userId: session.userId,
        requestId: requestId || undefined,
        subject,
        description,
        status: "OPEN",
      },
    });

    return NextResponse.json({ complaint }, { status: 201 });
  } catch (err: any) {
    console.error("Complaint creation err:", err);
    return NextResponse.json({ error: "Failed to create complaint" }, { status: 500 });
  }
}
