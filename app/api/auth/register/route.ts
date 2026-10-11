import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { registerSchema } from "@/lib/validations/auth";
import { hashPassword, signToken, setSessionCookie } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = result.data;

    // Check existing email
    const existingEmail = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });
    if (existingEmail) {
      return NextResponse.json(
        { error: "An account with this email address already exists." },
        { status: 409 }
      );
    }

    // Check existing phone
    if (data.phone) {
      const existingPhone = await prisma.user.findUnique({
        where: { phone: data.phone },
      });
      if (existingPhone) {
        return NextResponse.json(
          { error: "An account with this phone number already exists." },
          { status: 409 }
        );
      }
    }

    const passwordHash = await hashPassword(data.password);

    // Transaction to create user + profile + default location
    const newUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: data.email.toLowerCase(),
          phone: data.phone,
          passwordHash,
          role: data.role,
          accountType: data.accountType,
        },
      });

      if (data.accountType === "BUSINESS") {
        const businessProfile = await tx.businessProfile.create({
          data: {
            userId: user.id,
            companyName: data.companyName || "Commercial Client",
            tinNumber: data.tinNumber,
            contactPersonName: data.fullName,
            contactPersonPhone: data.phone,
          },
        });

        await tx.pickupLocation.create({
          data: {
            businessProfileId: businessProfile.id,
            label: `${data.companyName || "Head"} Office`,
            subCity: data.subCity,
            woreda: data.woreda,
            specificArea: data.specificArea,
            contactPhone: data.phone,
            isDefault: true,
          },
        });
      } else {
        const customerProfile = await tx.customerProfile.create({
          data: {
            userId: user.id,
            fullName: data.fullName || "Customer",
          },
        });

        await tx.pickupLocation.create({
          data: {
            customerProfileId: customerProfile.id,
            label: "Home Residence",
            subCity: data.subCity,
            woreda: data.woreda,
            specificArea: data.specificArea,
            contactPhone: data.phone,
            isDefault: true,
          },
        });
      }

      // Welcome notification
      await tx.notification.create({
        data: {
          userId: user.id,
          title: "Welcome to EcoAddis!",
          message:
            "Your account has been registered. You can now request waste pickups and connect with local recycling centers.",
          type: "SYSTEM",
        },
      });

      return user;
    });

    const token = signToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
      accountType: newUser.accountType,
      name: data.fullName || data.companyName,
    });

    setSessionCookie(token);

    return NextResponse.json(
      {
        message: "Registration successful",
        user: {
          id: newUser.id,
          email: newUser.email,
          role: newUser.role,
          accountType: newUser.accountType,
          name: data.fullName || data.companyName,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error occurred during registration." },
      { status: 500 }
    );
  }
}
