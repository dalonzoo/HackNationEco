import type { CarbonFootprint, EmployeesRange, OnboardingData } from "@/lib/types";

const employeeMedianMap: Record<EmployeesRange, number> = {
  "10-49": 30,
  "50-99": 75,
  "100-249": 175,
  "250-500": 375,
  "500+": 650
};

function round(value: number, digits = 2) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

export function getEmployeeMedian(range: EmployeesRange): number {
  return employeeMedianMap[range] ?? 75;
}

export function calculateCarbonFootprint(data: OnboardingData): CarbonFootprint {
  const scope1 = data.gasM3 * 0.0019 + data.dieselKm * 0.00024 + data.petrolKm * 0.00019;
  const scope2 = data.electricityKwh * 0.00023;
  const scope3 =
    data.flightsKm * 0.00021 +
    data.trainKm * 0.000035 +
    data.wasteKg * 0.00042 +
    Math.max(0, (100 - data.localSuppliersPct) * 0.65);

  const total = scope1 + scope2 + scope3;
  const benchmarkFactor =
    data.sector.toLowerCase().includes("log")
      ? 1.08
      : data.sector.toLowerCase().includes("serv")
        ? 0.82
        : 0.94;

  return {
    scope1: round(scope1),
    scope2: round(scope2),
    scope3: round(scope3),
    total: round(total),
    benchmarkTotal: round(total * benchmarkFactor)
  };
}
