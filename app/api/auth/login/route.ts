import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { loginSchema } from "@/lib/validations/auth";
import { verifyPassword, signToken, setSessionCookie } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid credentials format", issues: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { email, password } = result.data;

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        customerProfile: true,
        businessProfile: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    if (user.status === "SUSPENDED") {
      return NextResponse.json(
        { error: "Your account has been suspended. Please contact EcoAddis operations support." },
        { status: 403 }
      );
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const displayName =
      user.customerProfile?.fullName ||
      user.businessProfile?.companyName ||
      user.email.split("@")[0];

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      accountType: user.accountType,
      name: displayName,
    });

    setSessionCookie(token);

    return NextResponse.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        accountType: user.accountType,
        name: displayName,
      },
    });
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error occurred during login." },
      { status: 500 }
    );
  }
}
