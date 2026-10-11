import { ADDIS_ABABA_SUB_CITIES, INITIAL_WASTE_CATEGORIES } from "./constants";

export interface QuoteInputItem {
  categorySlug: string;
  weightKg: number;
}

export interface QuoteBreakdown {
  subCity: string;
  subCityBaseFeeETB: number;
  items: {
    categorySlug: string;
    name: string;
    weightKg: number;
    ratePerKgETB: number;
    subtotalETB: number;
    requiresSpecialHandling: boolean;
  }[];
  specialHandlingSurchargeETB: number;
  discountETB: number;
  totalEstimatedWeightKg: number;
  totalPriceETB: number;
}

/**
 * Calculates transparent ETB pricing for a waste collection request
 */
export function calculateQuote(
  subCityName: string,
  items: QuoteInputItem[],
  serviceType: "ONE_TIME" | "RECURRING_WEEKLY" | "RECURRING_BIWEEKLY" | "RECURRING_MONTHLY" = "ONE_TIME"
): QuoteBreakdown {
  // Find sub-city base fee
  const subCity = ADDIS_ABABA_SUB_CITIES.find(
    (sc) => sc.name.toLowerCase() === subCityName.toLowerCase() || sc.id === subCityName.toLowerCase()
  );
  const subCityBaseFeeETB = subCity ? subCity.baseFeeETB : 100;

  let totalWeight = 0;
  let itemsSubtotal = 0;
  let hasSpecialHandling = false;

  const itemBreakdowns = items.map((item) => {
    const category = INITIAL_WASTE_CATEGORIES.find((c) => c.slug === item.categorySlug);
    const ratePerKg = category ? category.baseRatePerKgETB : 15;
    const name = category ? category.name : item.categorySlug;
    const special = category ? category.requiresSpecialHandling : false;
    
    if (special) {
      hasSpecialHandling = true;
    }

    const subtotal = Math.round(item.weightKg * ratePerKg);
    totalWeight += item.weightKg;
    itemsSubtotal += subtotal;

    return {
      categorySlug: item.categorySlug,
      name,
      weightKg: item.weightKg,
      ratePerKgETB: ratePerKg,
      subtotalETB: subtotal,
      requiresSpecialHandling: special,
    };
  });

  // Special handling fee (e.g., electronic or hazardous certified gear)
  const specialHandlingSurchargeETB = hasSpecialHandling ? 50 : 0;

  // Recurring plan discount: weekly 15% off, bi-weekly 10% off
  let discountPercent = 0;
  if (serviceType === "RECURRING_WEEKLY") discountPercent = 0.15;
  else if (serviceType === "RECURRING_BIWEEKLY") discountPercent = 0.10;
  else if (serviceType === "RECURRING_MONTHLY") discountPercent = 0.05;

  const preDiscountTotal = subCityBaseFeeETB + itemsSubtotal + specialHandlingSurchargeETB;
  const discountETB = Math.round(preDiscountTotal * discountPercent);
  const totalPriceETB = Math.max(preDiscountTotal - discountETB, 50); // Minimum 50 ETB floor

  return {
    subCity: subCity ? subCity.name : subCityName,
    subCityBaseFeeETB,
    items: itemBreakdowns,
    specialHandlingSurchargeETB,
    discountETB,
    totalEstimatedWeightKg: totalWeight,
    totalPriceETB,
  };
}
