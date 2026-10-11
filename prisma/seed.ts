import { PrismaClient, Role, AccountType, CollectionStatus, PaymentStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting EcoAddis database seeding...");

  const defaultPasswordHash = await bcrypt.hash("EcoAddis2026!", 10);

  // 1. Seed Service Areas
  const serviceAreas = [
    { subCity: "Bole", baseFeeETB: 120 },
    { subCity: "Kirkos", baseFeeETB: 110 },
    { subCity: "Yeka", baseFeeETB: 110 },
    { subCity: "Arada", baseFeeETB: 100 },
    { subCity: "Lideta", baseFeeETB: 100 },
    { subCity: "Nifas Silk-Lafto", baseFeeETB: 110 },
    { subCity: "Gullele", baseFeeETB: 110 },
    { subCity: "Addis Ketema", baseFeeETB: 100 },
    { subCity: "Akaky Kaliti", baseFeeETB: 130 },
    { subCity: "Kolfe Keranio", baseFeeETB: 120 },
    { subCity: "Lemi Kura", baseFeeETB: 125 },
  ];

  for (const area of serviceAreas) {
    await prisma.serviceArea.upsert({
      where: { subCity: area.subCity },
      update: { baseFeeETB: area.baseFeeETB },
      create: { subCity: area.subCity, baseFeeETB: area.baseFeeETB, isActive: true },
    });
  }
  console.log("✅ Seeded 11 Addis Ababa service areas.");

  // 2. Seed Waste Categories
  const categories = [
    {
      slug: "plastic",
      name: "Plastic & Packaging",
      description: "PET bottles, HDPE containers, plastic packaging, and clean bags.",
      baseRatePerKgETB: 15,
      requiresSpecialHandling: false,
      badgeColor: "#10b981",
    },
    {
      slug: "paper",
      name: "Paper & Cardboard",
      description: "Cartons, newspapers, office paper, and clean packaging boxes.",
      baseRatePerKgETB: 12,
      requiresSpecialHandling: false,
      badgeColor: "#3b82f6",
    },
    {
      slug: "glass",
      name: "Glass Bottles & Jars",
      description: "Beverage bottles, food jars, and unbroken glassware.",
      baseRatePerKgETB: 14,
      requiresSpecialHandling: false,
      badgeColor: "#8b5cf6",
    },
    {
      slug: "metal",
      name: "Metals & Cans",
      description: "Aluminum cans, tin cans, scrap metal, and wiring.",
      baseRatePerKgETB: 20,
      requiresSpecialHandling: false,
      badgeColor: "#f59e0b",
    },
    {
      slug: "organic",
      name: "Organic & Kitchen Waste",
      description: "Fruit and vegetable peelings, food scraps, and garden waste for composting.",
      baseRatePerKgETB: 10,
      requiresSpecialHandling: false,
      badgeColor: "#84cc16",
    },
    {
      slug: "e_waste",
      name: "Electronic Waste (E-Waste)",
      description: "Computers, phones, cables, small electronics, and broken appliances. Handled with certified hazardous protocols.",
      baseRatePerKgETB: 45,
      requiresSpecialHandling: true,
      badgeColor: "#ef4444",
    },
    {
      slug: "mixed",
      name: "General Mixed Waste",
      description: "Non-recyclable household residuals that require municipal transfer station disposal.",
      baseRatePerKgETB: 18,
      requiresSpecialHandling: false,
      badgeColor: "#6b7280",
    },
  ];

  for (const cat of categories) {
    await prisma.wasteCategory.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        baseRatePerKgETB: cat.baseRatePerKgETB,
        requiresSpecialHandling: cat.requiresSpecialHandling,
        badgeColor: cat.badgeColor,
      },
      create: cat,
    });
  }
  console.log("✅ Seeded 7 waste categories.");

  // 3. Seed Users
  // Admin
  const admin = await prisma.user.upsert({
    where: { email: "admin@ecoaddis.et" },
    update: {},
    create: {
      email: "admin@ecoaddis.et",
      phone: "+251911000001",
      passwordHash: defaultPasswordHash,
      role: Role.ADMIN,
      accountType: AccountType.BUSINESS,
      customerProfile: {
        create: { fullName: "Abebe Bekele (EcoAddis Ops)" },
      },
    },
  });

  // Collector
  const collector = await prisma.user.upsert({
    where: { email: "collector@ecoaddis.et" },
    update: {},
    create: {
      email: "collector@ecoaddis.et",
      phone: "+251911000002",
      passwordHash: defaultPasswordHash,
      role: Role.COLLECTOR,
      accountType: AccountType.HOUSEHOLD,
      customerProfile: {
        create: { fullName: "Dawit Haile (Lead Collector)" },
      },
    },
  });

  // Household Customer
  const householdCustomer = await prisma.user.upsert({
    where: { email: "household@ecoaddis.et" },
    update: {},
    create: {
      email: "household@ecoaddis.et",
      phone: "+251911000003",
      passwordHash: defaultPasswordHash,
      role: Role.CUSTOMER,
      accountType: AccountType.HOUSEHOLD,
      customerProfile: {
        create: {
          fullName: "Selamawit Tadesse",
          savedLocations: {
            create: {
              label: "Home Residence",
              subCity: "Bole",
              woreda: "Woreda 03",
              specificArea: "Near Edna Mall, behind Medhanialem Church",
              contactPhone: "+251911000003",
              isDefault: true,
            },
          },
        },
      },
    },
    include: {
      customerProfile: {
        include: { savedLocations: true },
      },
    },
  });

  // Business Customer
  const businessCustomer = await prisma.user.upsert({
    where: { email: "business@ecoaddis.et" },
    update: {},
    create: {
      email: "business@ecoaddis.et",
      phone: "+251911000004",
      passwordHash: defaultPasswordHash,
      role: Role.CUSTOMER,
      accountType: AccountType.BUSINESS,
      businessProfile: {
        create: {
          companyName: "Addis Bloom Specialty Cafe & Roastery",
          tinNumber: "0048291048",
          contactPersonName: "Yonas Mekonnen",
          contactPersonPhone: "+251911000004",
          businessType: "RESTAURANT",
          savedLocations: {
            create: {
              label: "Kazanchis Flagship Branch",
              subCity: "Kirkos",
              woreda: "Woreda 02",
              specificArea: "Kazanchis, next to Inter Luxury Hotel",
              contactPhone: "+251911000004",
              isDefault: true,
            },
          },
        },
      },
    },
    include: {
      businessProfile: {
        include: { savedLocations: true },
      },
    },
  });

  // Partner User & Organization
  const partnerUser = await prisma.user.upsert({
    where: { email: "partner@ecoaddis.et" },
    update: {},
    create: {
      email: "partner@ecoaddis.et",
      phone: "+251911000005",
      passwordHash: defaultPasswordHash,
      role: Role.PARTNER,
      accountType: AccountType.BUSINESS,
      customerProfile: {
        create: { fullName: "Tewodros Kassahun" },
      },
    },
  });

  // 4. Seed Recycling Centers
  const org = await prisma.organization.upsert({
    where: { id: "org-addis-green-recycle" },
    update: {},
    create: {
      id: "org-addis-green-recycle",
      name: "Addis Green Eco-Recycling Enterprise",
      registrationNumber: "ET-AA-REC-2024-88",
      isVerified: true,
      members: {
        create: {
          userId: partnerUser.id,
          role: "DIRECTOR",
        },
      },
    },
  });

  const center1 = await prisma.recyclingCenter.create({
    data: {
      organizationId: org.id,
      name: "Bole Central PET & Plastics Recovery Center",
      subCity: "Bole",
      woreda: "Woreda 05",
      address: "Bole Atlas road, near Desalegn Hotel",
      phone: "+251911223344",
      operatingHours: "Mon-Sat: 8:00 AM - 6:00 PM",
      isVerified: true,
      latitude: 9.0054,
      longitude: 38.7831,
    },
  });

  const center2 = await prisma.recyclingCenter.create({
    data: {
      name: "Akaki Kaliti Metal & Industrial Scrap Reclaim",
      subCity: "Akaky Kaliti",
      woreda: "Woreda 01",
      address: "Akaki industrial zone, Main Debrezeit Road",
      phone: "+251922334455",
      operatingHours: "Mon-Fri: 8:30 AM - 5:30 PM",
      isVerified: true,
      latitude: 8.8921,
      longitude: 38.7612,
    },
  });

  const center3 = await prisma.recyclingCenter.create({
    data: {
      name: "Yeka Paper & Cardboard Pulping Station",
      subCity: "Yeka",
      woreda: "Woreda 04",
      address: "Signal Area, near British Embassy turnoff",
      phone: "+251933445566",
      operatingHours: "Mon-Sat: 9:00 AM - 5:00 PM",
      isVerified: true,
      latitude: 9.0312,
      longitude: 38.7995,
    },
  });

  console.log("✅ Seeded verified recycling centers across Addis Ababa.");

  // 5. Seed Accepted Materials
  const plasticCat = await prisma.wasteCategory.findUnique({ where: { slug: "plastic" } });
  const paperCat = await prisma.wasteCategory.findUnique({ where: { slug: "paper" } });
  const metalCat = await prisma.wasteCategory.findUnique({ where: { slug: "metal" } });

  if (plasticCat) {
    await prisma.acceptedMaterial.create({
      data: {
        centerId: center1.id,
        categoryId: plasticCat.id,
        minQuantityKg: 5,
        buyingPricePerKgETB: 12,
        dropOffOrPickup: "BOTH",
      },
    });
  }
  if (paperCat) {
    await prisma.acceptedMaterial.create({
      data: {
        centerId: center3.id,
        categoryId: paperCat.id,
        minQuantityKg: 10,
        buyingPricePerKgETB: 8,
        dropOffOrPickup: "DROP_OFF",
      },
    });
  }
  if (metalCat) {
    await prisma.acceptedMaterial.create({
      data: {
        centerId: center2.id,
        categoryId: metalCat.id,
        minQuantityKg: 15,
        buyingPricePerKgETB: 25,
        dropOffOrPickup: "BOTH",
      },
    });
  }

  // 6. Seed Sample Pickup Requests
  const householdLoc = householdCustomer.customerProfile?.savedLocations[0];
  if (householdLoc && plasticCat && paperCat) {
    const existingReq = await prisma.pickupRequest.findUnique({
      where: { requestNumber: "EA-2026-0001" },
    });

    if (!existingReq) {
      const scheduledTomorrow = new Date();
      scheduledTomorrow.setDate(scheduledTomorrow.getDate() + 1);

      const req1 = await prisma.pickupRequest.create({
        data: {
          requestNumber: "EA-2026-0001",
          customerId: householdCustomer.id,
          locationId: householdLoc.id,
          collectionStatus: CollectionStatus.ASSIGNED,
          paymentStatus: PaymentStatus.PAID_CASH_ON_COLLECTION,
          scheduledDate: scheduledTomorrow,
          timeSlot: "MORNING_8_12",
          totalEstimatedWeightKg: 8.5,
          quotedPriceETB: 245,
          customerNotes: "Plastic bottles are bagged separately from paper boxes.",
          items: {
            create: [
              { categoryId: plasticCat.id, estimatedWeightKg: 5.0 },
              { categoryId: paperCat.id, estimatedWeightKg: 3.5 },
            ],
          },
          assignments: {
            create: {
              collectorId: collector.id,
              status: "ASSIGNED",
            },
          },
          statusHistory: {
            create: [
              {
                changedById: householdCustomer.id,
                previousStatus: "NONE",
                newStatus: "PENDING",
                changeReason: "Customer booked pickup via website",
              },
              {
                changedById: admin.id,
                previousStatus: "PENDING",
                newStatus: "ASSIGNED",
                changeReason: "Admin assigned Dawit Haile (Lead Collector)",
              },
            ],
          },
        },
      });
    }
  }

  console.log("🎉 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
