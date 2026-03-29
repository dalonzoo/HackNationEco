import type { ActionRecommendation, BriefingResponse, OpenDataContext } from "@/lib/types";

function topActions(actions: ActionRecommendation[]) {
  return [...actions].sort((a, b) => a.priority - b.priority).slice(0, 3);
}

export function buildBriefing(
  companyName: string,
  summary: string[],
  actions: ActionRecommendation[],
  openData: OpenDataContext,
  complianceFocus?: string
): BriefingResponse {
  const keyActions = topActions(actions);
  const highlights = summary.slice(0, 2).join(" ");
  const actionLine =
    keyActions.length > 0
      ? keyActions
          .map((action) => `${action.title} con riduzione stimata ${action.reductionTco2.toFixed(1)} tonnellate`) 
          .join("; ")
      : "nessuna azione prioritaria ancora disponibile";

  const transcript = [
    `Briefing EcoSignal per ${companyName}.`,
    `Contesto territoriale ${openData.city}: aria ${openData.airQualityLabel}, rischio ${openData.climateRiskLabel}.`,
    highlights || "L'analisi iniziale e' completa e pronta per la fase operativa.",
    `Azioni prioritarie: ${actionLine}.`,
    complianceFocus ? `Focus compliance: ${complianceFocus}.` : null,
    "Prossima azione consigliata: confermare ownership interna e timeline di esecuzione entro 7 giorni."
  ]
    .filter((line): line is string => Boolean(line))
    .join(" ");

  return {
    source: "demo",
    transcript
  };
}
