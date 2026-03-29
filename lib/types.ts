export type EmployeesRange = "10-49" | "50-99" | "100-249" | "250-500" | "500+";

export interface TravelPlanningData {
  annualTrips: number;
  employeeTravelers: number;
  shortHaulFlightSharePct: number;
  railEligibleTripSharePct: number;
  advanceBookingDays: number;
  virtualMeetingSharePct: number;
  hotelPolicyCoveragePct: number;
  approvalWorkflowCoveragePct: number;
  lastMinuteBookingSharePct: number;
  weekendExtensionRiskPct: number;
  hotelNightsAnnual: number;
  preferredRailCorridors: string[];
  topTripReasons: string[];
}

export interface OnboardingData {
  companyName: string;
  sector: string;
  atecoCode: string;
  city: string;
  employeesRange: EmployeesRange;
  revenueRange: string;
  budgetRange: string;
  facilities: number;
  electricityKwh: number;
  gasM3: number;
  waterM3: number;
  dieselKm: number;
  petrolKm: number;
  electricKm: number;
  flightsKm: number;
  trainKm: number;
  localSuppliersPct: number;
  wasteKg: number;
  recyclingPct: number;
  travelPlanning: TravelPlanningData;
}

export interface CarbonFootprint {
  scope1: number;
  scope2: number;
  scope3: number;
  total: number;
  benchmarkTotal: number;
}

export interface EsgScoreBreakdown {
  total: number;
  environment: number;
  social: number;
  governance: number;
}

export type DirectActionKind = "calendar" | "search" | "maps" | "workflow";

export interface DirectAction {
  id: string;
  label: string;
  description: string;
  href: string;
  kind: DirectActionKind;
}

export interface ActionRecommendation {
  id: string;
  title: string;
  description: string;
  priority: number;
  difficulty: number;
  reductionTco2: number;
  annualSavingEur: number;
  paybackMonths: number;
  incentive: string;
  directActions?: DirectAction[];
}

export interface OpenDataContext {
  source: "live" | "demo";
  city: string;
  sector: string;
  airQualityIndex: number;
  airQualityLabel: string;
  weeklyTemperatureDelta: number;
  climateRiskLabel: string;
  notes: string[];
  incentives: string[];
}

export type DataSourceKind = "demo" | "manual" | "open-data" | "ai" | "document";

export interface DataSourceEntry {
  id: string;
  label: string;
  kind: DataSourceKind;
  origin: string;
  updatedAt: string;
  fields: string[];
  note: string;
}

export interface BriefingResponse {
  source: "demo" | "elevenlabs";
  transcript: string;
  audioUrl?: string;
  warning?: string;
  voiceName?: string;
  voiceId?: string;
  generatedAt?: string;
}
