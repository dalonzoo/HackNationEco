import type { OnboardingData, OpenDataContext } from "@/lib/types";

export type InsightsAgentId = "planner" | "benchmark" | "compliance" | "action";

export interface InsightsBaselineContext {
  companyName: string;
  sector: string;
  city: string;
  employeesRange: OnboardingData["employeesRange"];
  budgetRange: OnboardingData["budgetRange"];
  carbonTotal: number;
  scope1: number;
  scope2: number;
  scope3: number;
  benchmark: number;
  topSource: string;
  openData: OpenDataContext;
}

export interface InsightsAgentDefinition {
  id: InsightsAgentId;
  title: string;
  instruction: string;
  fallback: (context: InsightsBaselineContext) => string;
}

export const insightsAgents: InsightsAgentDefinition[] = [
  {
    id: "planner",
    title: "Planner",
    instruction: "Definisci focus, rischi e priorita' in 3 punti per una PMI italiana.",
    fallback: (context) =>
      `Priorita': ridurre ${context.topSource}, migliorare il posizionamento nel benchmark ${context.sector} e collegare il piano ESG al budget ${context.budgetRange}.`
  },
  {
    id: "benchmark",
    title: "Benchmark Analyst",
    instruction: "Confronta azienda e benchmark di settore in 2 frasi operative.",
    fallback: (context) =>
      `${context.companyName} si confronta con un benchmark di ${context.benchmark.toFixed(1)} tCO2eq/anno. Serve accelerare su efficienza energetica e fornitori per ridurre il gap di intensita'.`
  },
  {
    id: "compliance",
    title: "Compliance Analyst",
    instruction:
      'Restituisci SOLO JSON valido con questo shape: {"headline":"string","detail":"string","focus":"string","missingItems":["string","string","string"],"readinessPct":number}. Usa italiano chiaro, missingItems concisi e readinessPct come intero 0-100.',
    fallback: (context) => {
      const missingItems = [
        context.scope3 >= Math.max(context.scope1, context.scope2) ? "Mappatura emissioni fornitori e acquisti" : null,
        `Valutazione resilienza su ${context.openData.climateRiskLabel.toLowerCase()}`,
        "Struttura KPI e reporting ESG periodico"
      ].filter((item): item is string => Boolean(item));

      return JSON.stringify({
        headline: `${context.companyName} deve consolidare la base informativa ESG per sostenere un dossier CSRD credibile e difendibile.`,
        detail: `I gap principali riguardano la tracciabilita' delle emissioni, la raccolta KPI sugli standard ambientali e una narrativa di transizione coerente con il contesto territoriale di ${context.city}.`,
        focus:
          context.scope3 >= Math.max(context.scope1, context.scope2)
            ? "Copertura Scope 3 e qualita' del dato fornitori"
            : "Consolidamento KPI ambientali e reporting ESG",
        missingItems,
        readinessPct: Math.max(40, Math.min(88, Math.round((context.benchmark / Math.max(context.carbonTotal, 1)) * 26 + 44)))
      });
    }
  },
  {
    id: "action",
    title: "Action Strategist",
    instruction: "Suggerisci azioni ad alto impatto con tono consulenziale.",
    fallback: () =>
      "Azioni favorite: energia rinnovabile, ottimizzazione flotta e fornitori locali, con impatto combinato su CO2, saving economico e tempi di payback."
  }
];
