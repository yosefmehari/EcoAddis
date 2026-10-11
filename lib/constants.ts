export const ADDIS_ABABA_SUB_CITIES = [
  { id: "bole", name: "Bole", baseFeeETB: 120, woredas: ["Woreda 01", "Woreda 02", "Woreda 03", "Woreda 04", "Woreda 05", "Woreda 06", "Woreda 07"] },
  { id: "kirkos", name: "Kirkos", baseFeeETB: 110, woredas: ["Woreda 01", "Woreda 02", "Woreda 03", "Woreda 04"] },
  { id: "yeka", name: "Yeka", baseFeeETB: 110, woredas: ["Woreda 01", "Woreda 02", "Woreda 03", "Woreda 04", "Woreda 05", "Woreda 06"] },
  { id: "arada", name: "Arada", baseFeeETB: 100, woredas: ["Woreda 01", "Woreda 02", "Woreda 03", "Woreda 04"] },
  { id: "lideta", name: "Lideta", baseFeeETB: 100, woredas: ["Woreda 01", "Woreda 02", "Woreda 03", "Woreda 04"] },
  { id: "nifas_silk_lafto", name: "Nifas Silk-Lafto", baseFeeETB: 110, woredas: ["Woreda 01", "Woreda 02", "Woreda 03", "Woreda 04", "Woreda 05"] },
  { id: "gullele", name: "Gullele", baseFeeETB: 110, woredas: ["Woreda 01", "Woreda 02", "Woreda 03", "Woreda 04"] },
  { id: "addis_ketema", name: "Addis Ketema", baseFeeETB: 100, woredas: ["Woreda 01", "Woreda 02", "Woreda 03", "Woreda 04"] },
  { id: "akaky_kaliti", name: "Akaky Kaliti", baseFeeETB: 130, woredas: ["Woreda 01", "Woreda 02", "Woreda 03", "Woreda 04", "Woreda 05"] },
  { id: "kolfe_keranio", name: "Kolfe Keranio", baseFeeETB: 120, woredas: ["Woreda 01", "Woreda 02", "Woreda 03", "Woreda 04"] },
  { id: "lemi_kura", name: "Lemi Kura", baseFeeETB: 125, woredas: ["Woreda 01", "Woreda 02", "Woreda 03", "Woreda 04", "Woreda 05"] },
] as const;

export const INITIAL_WASTE_CATEGORIES = [
  {
    slug: "plastic",
    name: "Plastic & Packaging",
    description: "PET bottles, HDPE containers, plastic packaging, and clean bags.",
    baseRatePerKgETB: 15,
    requiresSpecialHandling: false,
    badgeColor: "#10b981", // Emerald
  },
  {
    slug: "paper",
    name: "Paper & Cardboard",
    description: "Cartons, newspapers, office paper, and clean packaging boxes.",
    baseRatePerKgETB: 12,
    requiresSpecialHandling: false,
    badgeColor: "#3b82f6", // Blue
  },
  {
    slug: "glass",
    name: "Glass Bottles & Jars",
    description: "Beverage bottles, food jars, and unbroken glassware.",
    baseRatePerKgETB: 14,
    requiresSpecialHandling: false,
    badgeColor: "#8b5cf6", // Purple
  },
  {
    slug: "metal",
    name: "Metals & Cans",
    description: "Aluminum cans, tin cans, scrap metal, and wiring.",
    baseRatePerKgETB: 20,
    requiresSpecialHandling: false,
    badgeColor: "#f59e0b", // Amber
  },
  {
    slug: "organic",
    name: "Organic & Kitchen Waste",
    description: "Fruit and vegetable peelings, food scraps, and garden waste for composting.",
    baseRatePerKgETB: 10,
    requiresSpecialHandling: false,
    badgeColor: "#84cc16", // Lime
  },
  {
    slug: "e_waste",
    name: "Electronic Waste (E-Waste)",
    description: "Computers, phones, cables, small electronics, and broken appliances. Requires certified hazardous-safe handling.",
    baseRatePerKgETB: 45,
    requiresSpecialHandling: true,
    badgeColor: "#ef4444", // Red
  },
  {
    slug: "mixed",
    name: "General Mixed Waste",
    description: "Non-recyclable household residuals that require municipal transfer station disposal.",
    baseRatePerKgETB: 18,
    requiresSpecialHandling: false,
    badgeColor: "#6b7280", // Gray
  },
] as const;

export const TIME_SLOTS = [
  { id: "MORNING_8_12", label: "Morning (8:00 AM – 12:00 PM)", description: "Best for early pickups" },
  { id: "AFTERNOON_1_5", label: "Afternoon (1:00 PM – 5:00 PM)", description: "Best for afternoon collections" },
] as const;

export const STATUS_CONFIG = {
  PENDING: { label: "Pending", bg: "bg-amber-100", text: "text-amber-800", border: "border-amber-300" },
  CONFIRMED: { label: "Confirmed", bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-300" },
  ASSIGNED: { label: "Assigned", bg: "bg-indigo-100", text: "text-indigo-800", border: "border-indigo-300" },
  IN_PROGRESS: { label: "In Progress", bg: "bg-purple-100", text: "text-purple-800", border: "border-purple-300" },
  COMPLETED: { label: "Completed", bg: "bg-emerald-100", text: "text-emerald-800", border: "border-emerald-300" },
  CANCELLED: { label: "Cancelled", bg: "bg-rose-100", text: "text-rose-800", border: "border-rose-300" },
  FAILED: { label: "Failed / Inaccessible", bg: "bg-red-100", text: "text-red-800", border: "border-red-300" },
} as const;

export const PAYMENT_STATUS_CONFIG = {
  UNPAID: { label: "Unpaid", bg: "bg-gray-100", text: "text-gray-700" },
  PAID_CASH_ON_COLLECTION: { label: "Paid (Cash on Collection)", bg: "bg-emerald-100", text: "text-emerald-800" },
  DIRECT_TRANSFER: { label: "Direct Bank Transfer", bg: "bg-blue-100", text: "text-blue-800" },
  PENDING_VERIFICATION: { label: "Pending Admin Verification", bg: "bg-amber-100", text: "text-amber-800" },
} as const;
