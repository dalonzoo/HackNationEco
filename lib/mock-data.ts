import type { OnboardingData } from "@/lib/types";

export const defaultOnboardingData: OnboardingData = {
  companyName: "Metalmeccanica Aurora S.p.A.",
  sector: "Manifattura",
  atecoCode: "25.62",
  city: "Bologna",
  employeesRange: "250-500",
  revenueRange: "25-50M",
  budgetRange: "50k-150k",
  facilities: 3,
  electricityKwh: 735000,
  gasM3: 41800,
  waterM3: 6900,
  dieselKm: 84500,
  petrolKm: 9500,
  electricKm: 22000,
  flightsKm: 26500,
  trainKm: 16400,
  localSuppliersPct: 44,
  wasteKg: 58600,
  recyclingPct: 71,
  travelPlanning: {
    annualTrips: 188,
    employeeTravelers: 54,
    shortHaulFlightSharePct: 62,
    railEligibleTripSharePct: 68,
    advanceBookingDays: 8,
    virtualMeetingSharePct: 22,
    hotelPolicyCoveragePct: 46,
    approvalWorkflowCoveragePct: 55,
    lastMinuteBookingSharePct: 38,
    weekendExtensionRiskPct: 29,
    hotelNightsAnnual: 420,
    preferredRailCorridors: ["Bologna-Milano", "Bologna-Torino", "Bologna-Roma"],
    topTripReasons: [
      "visite commerciali clienti automotive",
      "audit fornitori e qualita'",
      "fiere tecniche e trasferte manageriali"
    ]
  }
};
