import { calculateCarbonFootprint } from "@/lib/carbon";
import { calculateEsgScore } from "@/lib/esg";
import type {
  ActionRecommendation,
  CarbonFootprint,
  EsgScoreBreakdown,
  OnboardingData,
  OpenDataContext
} from "@/lib/types";

export interface ComplianceSummary {
  headline: string;
  detail: string;
  focus: string;
  missingItems: string[];
  readinessPct: number;
}

type AgentMode = "llm" | "fallback";

type AgentTrace = {
  agent: string;
  title: string;
  content: string;
  mode: AgentMode;
};

type LlmRunner = (params: {
  agent: string;
  instruction: string;
  context: Record<string, unknown>;
}) => Promise<string>;

type OrchestratorParams = {
  data: OnboardingData;
  openData: OpenDataContext;
  runner?: LlmRunner;
};

type OrchestratorResult = {
  carbon: CarbonFootprint;
  score: EsgScoreBreakdown;
  actions: ActionRecommendation[];
  summary: string[];
  complianceSummary: ComplianceSummary;
  orchestrationMode: "multi-agent-llm" | "multi-agent-fallback";
  agentTrace: AgentTrace[];
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function buildFallbackActions(data: OnboardingData, carbon: CarbonFootprint): ActionRecommendation[] {
  const travelPotential = clamp(Math.round(data.flightsKm * 0.00012), 6, 42);
  const renewablePotential = clamp(Math.round(data.electricityKwh * 0.00005), 8, 65);

  return [
    {
      id: "renewable-energy",
      title: "Contratto energia rinnovabile e load shifting",
      description:
        "Rinegoziare il mix elettrico con quota rinnovabile certificata e pianificare i carichi energivori nelle fasce meno emissive.",
      priority: 1,
      difficulty: 2,
      reductionTco2: renewablePotential,
      annualSavingEur: Math.round(data.electricityKwh * 0.028),
      paybackMonths: 7,
      incentive: "Transizione 5.0 su efficientamento e monitoraggio",
      directActions: [
        {
          id: "renewable-calendar",
          label: "Prenota allineamento energy team",
          description: "Imposta un kickoff operativo con acquisti e operations.",
          href: "https://calendar.google.com/",
          kind: "calendar"
        },
        {
          id: "renewable-search",
          label: "Ricerca fornitori PPA PMI",
          description: "Confronta offerte energia green con garanzie d'origine.",
          href: "https://www.google.com/search?q=fornitore+energia+rinnovabile+pmi",
          kind: "search"
        }
      ]
    },
    {
      id: "travel-planning",
      title: "Travel policy rail-first e booking anticipato",
      description:
        "Ridurre trasferte aeree brevi e incrementare prenotazioni anticipate con regole di approvazione centralizzate.",
      priority: 2,
      difficulty: 2,
      reductionTco2: travelPotential,
      annualSavingEur: Math.round(data.travelPlanning.annualTrips * 185),
      paybackMonths: 4,
      incentive: "Voucher digitalizzazione processi travel e workflow",
      directActions: [
        {
          id: "travel-workflow",
          label: "Definisci workflow approvativo",
          description: "Formalizza policy e soglie di eccezione per trasferte.",
          href: "https://workspace.google.com/",
          kind: "workflow"
        },
        {
          id: "travel-maps",
          label: "Analizza tratte rail alternative",
          description: "Valuta connessioni ad alta frequenza sulle rotte principali.",
          href: "https://www.google.com/maps",
          kind: "maps"
        }
      ]
    },
    {
      id: "local-procurement",
      title: "Piano fornitori locali e procurement tracciato",
      description:
        "Aumentare quota fornitori locali e imporre requisiti minimi ESG su categorie ad alta intensita' emissiva.",
      priority: 3,
      difficulty: 3,
      reductionTco2: clamp(Math.round((100 - data.localSuppliersPct) * 0.22), 4, 28),
      annualSavingEur: Math.round((100 - data.localSuppliersPct) * 740),
      paybackMonths: 9,
      incentive: "Bandi filiera sostenibile e supporto consulenziale regionale"
    },
    {
      id: "waste-recovery",
      title: "Recovery rifiuti e tracciabilita' frazioni",
      description: "Rafforzare la raccolta dati su frazioni di rifiuto e target di riciclo per ridurre Scope 3 operativo.",
      priority: 4,
      difficulty: 3,
      reductionTco2: clamp(Math.round(carbon.scope3 * 0.09), 3, 24),
      annualSavingEur: Math.round(data.wasteKg * 0.21),
      paybackMonths: 10,
      incentive: "Contributi economia circolare e recupero materiali"
    }
  ];
}

function buildComplianceSummary(data: OnboardingData, score: EsgScoreBreakdown, openData: OpenDataContext): ComplianceSummary {
  const missingItems = [
    data.travelPlanning.approvalWorkflowCoveragePct < 70 ? "Workflow approvativo trasferte con policy formalizzata" : null,
    data.localSuppliersPct < 55 ? "Mappatura rischio fornitori e KPI filiera" : null,
    `Valutazione resilienza climatica su ${openData.climateRiskLabel.toLowerCase()}`,
    "Evidenze periodiche per reporting ESG e governance dati"
  ].filter((item): item is string => Boolean(item));

  return {
    headline: `${data.companyName} ha basi solide ma richiede un consolidamento delle evidenze per una readiness CSRD robusta.`,
    detail:
      "La priorita' e' integrare governance dati, filiera e rischio climatico in un tracciato unico, con ownership e scadenze operative.",
    focus:
      missingItems[0] ??
      "Consolidare controllo operativo, raccolta evidenze e monitoraggio periodico delle metriche ESG.",
    missingItems,
    readinessPct: clamp(Math.round(score.total * 0.78), 42, 90)
  };
}

function buildSummaryLines(
  data: OnboardingData,
  carbon: CarbonFootprint,
  score: EsgScoreBreakdown,
  openData: OpenDataContext
): string[] {
  const delta = carbon.total - carbon.benchmarkTotal;
  const deltaLabel = delta >= 0 ? `+${delta.toFixed(1)}` : `${delta.toFixed(1)}`;
  return [
    `${data.companyName} presenta una baseline di ${carbon.total.toFixed(1)} tCO2eq, con scostamento ${deltaLabel} t rispetto al benchmark settore.`,
    `Score ESG complessivo ${score.total}/100, trainato da Environment ${score.environment} e Governance ${score.governance}.`,
    `Nel territorio di ${openData.city} il rischio prevalente e' ${openData.climateRiskLabel.toLowerCase()}: integrare il segnale nel piano trimestrale.`
  ];
}

async function runAgent(
  runner: LlmRunner,
  agent: string,
  instruction: string,
  context: Record<string, unknown>
): Promise<AgentTrace> {
  const content = await runner({ agent, instruction, context });
  return {
    agent,
    title: `${agent} completed`,
    content,
    mode: "llm"
  };
}

export async function runInsightsOrchestration(params: OrchestratorParams): Promise<OrchestratorResult> {
  const { data, openData, runner } = params;
  const carbon = calculateCarbonFootprint(data);
  const score = calculateEsgScore(data, carbon);
  const actions = buildFallbackActions(data, carbon);
  const summary = buildSummaryLines(data, carbon, score, openData);
  const complianceSummary = buildComplianceSummary(data, score, openData);

  if (!runner) {
    return {
      carbon,
      score,
      actions,
      summary,
      complianceSummary,
      orchestrationMode: "multi-agent-fallback",
      agentTrace: [
        {
          agent: "planner",
          title: "planner fallback",
          content: "Piano costruito da heuristics locali.",
          mode: "fallback"
        },
        {
          agent: "benchmark",
          title: "benchmark fallback",
          content: "Benchmark calcolato da modello interno.",
          mode: "fallback"
        },
        {
          agent: "compliance",
          title: "compliance fallback",
          content: "Readiness stimata con regole deterministiche.",
          mode: "fallback"
        },
        {
          agent: "action",
          title: "action fallback",
          content: "Azioni prioritarie generate localmente.",
          mode: "fallback"
        }
      ]
    };
  }

  try {
    const planner = await runAgent(runner, "planner", "Costruisci piano operativo ESG", { data, openData });
    const [benchmark, compliance, action] = await Promise.all([
      runAgent(runner, "benchmark", "Valuta baseline contro benchmark", { data, carbon, openData }),
      runAgent(runner, "compliance", "Stima readiness CSRD", { data, score, openData }),
      runAgent(runner, "action", "Definisci le 3-4 azioni con payoff", { data, carbon, score, openData })
    ]);

    return {
      carbon,
      score,
      actions,
      summary,
      complianceSummary,
      orchestrationMode: "multi-agent-llm",
      agentTrace: [planner, benchmark, compliance, action]
    };
  } catch {
    return {
      carbon,
      score,
      actions,
      summary,
      complianceSummary,
      orchestrationMode: "multi-agent-fallback",
      agentTrace: [
        {
          agent: "planner",
          title: "planner fallback",
          content: "Errore provider, fallback locale attivato.",
          mode: "fallback"
        },
        {
          agent: "benchmark",
          title: "benchmark fallback",
          content: "Errore provider, fallback locale attivato.",
          mode: "fallback"
        },
        {
          agent: "compliance",
          title: "compliance fallback",
          content: "Errore provider, fallback locale attivato.",
          mode: "fallback"
        },
        {
          agent: "action",
          title: "action fallback",
          content: "Errore provider, fallback locale attivato.",
          mode: "fallback"
        }
      ]
    };
  }
}
