import type { ComplianceSummary } from "@/lib/ai/insights-orchestrator";
import type {
  ActionRecommendation,
  CarbonFootprint,
  EsgScoreBreakdown,
  OnboardingData,
  OpenDataContext
} from "@/lib/types";

export type ReportSection = {
  title: string;
  bullets: string[];
};

function topActionBullets(actions: ActionRecommendation[]) {
  return actions.slice(0, 4).map((action) => {
    return `${action.title}: -${action.reductionTco2.toFixed(1)} tCO2eq, payback ${action.paybackMonths} mesi, saving ${action.annualSavingEur.toLocaleString("it-IT")} eur/anno.`;
  });
}

export function buildCsrReportSections(
  data: OnboardingData,
  carbon: CarbonFootprint,
  score: EsgScoreBreakdown,
  actions: ActionRecommendation[],
  openData?: OpenDataContext,
  complianceSummary?: ComplianceSummary
): ReportSection[] {
  return [
    {
      title: "Profilo Aziendale",
      bullets: [
        `${data.companyName} - settore ${data.sector} - sede ${data.city}.`,
        `Dipendenti ${data.employeesRange}, siti operativi ${data.facilities}.`,
        `Consumo elettrico annuale dichiarato: ${data.electricityKwh.toLocaleString("it-IT")} kWh.`
      ]
    },
    {
      title: "Baseline Emissioni",
      bullets: [
        `Totale emissioni: ${carbon.total.toFixed(2)} tCO2eq.`,
        `Scope 1 ${carbon.scope1.toFixed(2)} | Scope 2 ${carbon.scope2.toFixed(2)} | Scope 3 ${carbon.scope3.toFixed(2)}.`,
        `Benchmark settore stimato: ${carbon.benchmarkTotal.toFixed(2)} tCO2eq.`
      ]
    },
    {
      title: "Valutazione ESG",
      bullets: [
        `Punteggio totale ${score.total}/100.`,
        `Environment ${score.environment}, Social ${score.social}, Governance ${score.governance}.`,
        complianceSummary?.headline ?? "Valutazione compliance in aggiornamento."
      ]
    },
    {
      title: "Azioni Prioritarie",
      bullets: topActionBullets(actions).length
        ? topActionBullets(actions)
        : ["Nessuna azione automatica disponibile: eseguire una nuova analisi AI."]
    },
    {
      title: "Contesto Territoriale",
      bullets: openData
        ? [
            `Sorgente ${openData.source} - ${openData.city}.`,
            `Qualita' aria ${openData.airQualityLabel} (indice ${openData.airQualityIndex}).`,
            `Rischio climatico prevalente: ${openData.climateRiskLabel}.`
          ]
        : ["Contesto territoriale non disponibile nel payload corrente."]
    },
    {
      title: "Roadmap 30 Giorni",
      bullets: [
        "Settimana 1: conferma ownership KPI ESG, baseline e perimetro dati.",
        "Settimana 2: avvio 1-2 azioni ad alto impatto con misure di risultato.",
        "Settimana 3: raccolta evidenze e presidio tracciabilita' fonti.",
        "Settimana 4: pre-dossier CSRD e allineamento stakeholder interni."
      ]
    }
  ];
}
