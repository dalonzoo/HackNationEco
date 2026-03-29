import type { CarbonFootprint, EsgScoreBreakdown, OnboardingData } from "@/lib/types";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function calculateEsgScore(data: OnboardingData, carbon: CarbonFootprint): EsgScoreBreakdown {
  const benchmarkRatio = carbon.total / Math.max(carbon.benchmarkTotal, 1);
  const emissionScore = clamp(Math.round(70 - (benchmarkRatio - 1) * 45), 25, 92);
  const recyclingScore = clamp(Math.round(40 + data.recyclingPct * 0.45), 25, 95);
  const supplierScore = clamp(Math.round(35 + data.localSuppliersPct * 0.5), 20, 95);
  const travelGovernance = clamp(
    Math.round(
      40 +
        data.travelPlanning.virtualMeetingSharePct * 0.3 +
        data.travelPlanning.approvalWorkflowCoveragePct * 0.35 +
        data.travelPlanning.hotelPolicyCoveragePct * 0.2
    ),
    20,
    95
  );

  const environment = clamp(Math.round(emissionScore * 0.55 + recyclingScore * 0.45), 20, 95);
  const social = clamp(
    Math.round(supplierScore * 0.6 + (100 - data.travelPlanning.weekendExtensionRiskPct) * 0.4),
    20,
    95
  );
  const governance = clamp(Math.round(travelGovernance), 20, 95);
  const total = clamp(Math.round(environment * 0.5 + social * 0.25 + governance * 0.25), 20, 95);

  return {
    total,
    environment,
    social,
    governance
  };
}
