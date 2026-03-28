"use client";

import { LoadingScreen } from "@/components/mission-control/LoadingScreen";
import {
  MissionPrepDeck,
  type MissionAgentIndicator,
  type MissionPrepCard
} from "@/components/mission-control/MissionPrepDeck";
import { PanelPager } from "@/components/mission-control/PanelPager";
import { ParticleField } from "@/components/mission-control/ParticleField";
import { TopBar } from "@/components/mission-control/TopBar";
import { PanelCompliance } from "@/components/mission-control/panels/PanelCompliance";
import { PanelOrbita } from "@/components/mission-control/panels/PanelOrbita";
import { PanelScanner } from "@/components/mission-control/panels/PanelScanner";
import { PanelTerra } from "@/components/mission-control/panels/PanelTerra";
import { PanelKey, usePanelNav } from "@/hooks/usePanelNav";
import { useLiveData } from "@/hooks/useLiveData";
import { calculateCarbonFootprint, getEmployeeMedian } from "@/lib/carbon";
import { parseDataDocument } from "@/lib/document-ingestion";
import { calculateEsgScore } from "@/lib/esg";
import { defaultOnboardingData } from "@/lib/mock-data";
import type {
  ActionRecommendation,
  BriefingResponse,
  CarbonFootprint,
  DataSourceEntry,
  EsgScoreBreakdown,
  OnboardingData,
  OpenDataContext
} from "@/lib/types";
import type { ComplianceSummary } from "@/lib/ai/insights-orchestrator";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

interface InsightsResponse {
  carbon: CarbonFootprint;
  score: EsgScoreBreakdown;
  actions: ActionRecommendation[];
  summary: string[];
  complianceSummary: ComplianceSummary;
  source: string;
  orchestrationMode: "multi-agent-llm" | "multi-agent-fallback";
  agentTrace: { agent: string; title: string; content: string; mode: "llm" | "fallback" }[];
  warning?: string;
}

interface AudioBriefingState extends BriefingResponse {}

type CardStatus = "ready" | "loading" | "locked";
type ViewStage = "intake" | "deck" | "panel";

const panelTitles: Record<PanelKey, string> = {
  SCANNER: "Scanner",
  TERRA: "Terra",
  ORBITA: "Orbita",
  COMPLIANCE: "Compliance"
};

function formatNowLabel() {
  return new Date().toLocaleTimeString("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}

function employeeCountToRange(value: number): OnboardingData["employeesRange"] {
  if (value < 50) return "10-49";
  if (value < 100) return "50-99";
  if (value < 250) return "100-249";
  if (value < 500) return "250-500";
  return "500+";
}

function getCountdownTargetTime() {
  const configured = process.env.NEXT_PUBLIC_CSRD_DEADLINE;
  const parsed = configured ? new Date(configured).getTime() : Number.NaN;

  if (Number.isFinite(parsed)) {
    return parsed;
  }

  const fallback = new Date();
  fallback.setFullYear(fallback.getFullYear() + 1);
  fallback.setHours(23, 59, 59, 999);
  return fallback.getTime();
}

function buildCountdownState(targetTime: number) {
  const diff = Math.max(0, targetTime - Date.now());
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000)
  };
}

function buildFallbackComplianceSummary(params: {
  data: OnboardingData;
  carbon: CarbonFootprint;
  score: EsgScoreBreakdown;
  openData: OpenDataContext | null;
}): ComplianceSummary {
  const { data, carbon, score, openData } = params;
  const missingItems = [
    carbon.scope3 >= Math.max(carbon.scope1, carbon.scope2) ? "Mappatura emissioni fornitori e acquisti" : null,
    openData ? `Valutazione resilienza su ${openData.climateRiskLabel.toLowerCase()}` : "Valutazione rischio climatico operativo",
    "Struttura KPI e reporting ESG periodico"
  ].filter((item): item is string => Boolean(item));

  return {
    headline: `${data.companyName} ha una base ESG gia' leggibile, ma il dossier richiede ancora alcune evidenze per diventare completo e difendibile.`,
    detail: `Le priorita' riguardano soprattutto la qualita' del dato, la copertura della filiera e la formalizzazione del reporting rispetto al profilo attuale di score ${score.total}/100.`,
    focus:
      carbon.scope3 >= Math.max(carbon.scope1, carbon.scope2)
        ? "Copertura Scope 3 e qualita' del dato fornitori"
        : "Consolidamento KPI ambientali e reporting ESG",
    missingItems,
    readinessPct: Math.max(40, Math.min(88, Math.round(score.total * 0.72)))
  };
}

export function MissionControlHome() {
  const reduceMotion = useReducedMotion();
  const [analysisStarted, setAnalysisStarted] = useState(false);
  const [viewStage, setViewStage] = useState<ViewStage>("intake");
  const [data, setData] = useState<OnboardingData>(defaultOnboardingData);
  const [openData, setOpenData] = useState<OpenDataContext | null>(null);
  const [insights, setInsights] = useState<InsightsResponse | null>(null);
  const [audioBriefing, setAudioBriefing] = useState<AudioBriefingState | null>(null);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [countdown, setCountdown] = useState(() => buildCountdownState(getCountdownTargetTime()));
  const [ingestionNotice, setIngestionNotice] = useState("Tracciabilita' attiva sulle sorgenti dati.");
  const [dataSources, setDataSources] = useState<DataSourceEntry[]>([
    {
      id: "demo-seed",
      label: "DATASET DEMO",
      kind: "demo",
      origin: "Seed iniziale mission control",
      updatedAt: "--:--:--",
      fields: ["companyName", "sector", "electricityKwh", "flightsKm", "trainKm"],
      note: `${defaultOnboardingData.companyName} - baseline demo con travel planning pronta all'uso.`
    }
  ]);

  const localCarbon = calculateCarbonFootprint(data);
  const carbon = insights?.carbon ?? localCarbon;
  const localScore = calculateEsgScore(data, localCarbon);
  const score = insights?.score ?? localScore;
  const actions = insights?.actions ?? [];
  const { feed, counter, updatedAt } = useLiveData(openData);
  const aiMode = analysisStarted ? insights?.orchestrationMode ?? "loading" : "loading";

  const panelStatuses = useMemo<Record<PanelKey, CardStatus>>(() => {
    if (!analysisStarted) {
      return {
        SCANNER: "ready",
        TERRA: "locked",
        ORBITA: "locked",
        COMPLIANCE: "locked"
      };
    }

    return {
      SCANNER: "ready",
      TERRA: openData ? "ready" : "loading",
      ORBITA: insights ? "ready" : openData ? "loading" : "locked",
      COMPLIANCE: insights ? "ready" : openData ? "loading" : "locked"
    };
  }, [analysisStarted, insights, openData]);

  const availablePanels = useMemo<PanelKey[]>(() => {
    return (["SCANNER", "TERRA", "ORBITA", "COMPLIANCE"] as PanelKey[]).filter((panel) => panelStatuses[panel] === "ready");
  }, [panelStatuses]);

  const {
    activePanel,
    setActivePanel,
    canGoPrevious,
    canGoNext,
    goToPrevious,
    goToNext
  } = usePanelNav("SCANNER", availablePanels);

  useEffect(() => {
    const seen = window.sessionStorage.getItem("ecosignal-loading-seen");
    if (seen) return;
    setShowLoading(true);
    const timeout = window.setTimeout(() => {
      setShowLoading(false);
      window.sessionStorage.setItem("ecosignal-loading-seen", "true");
    }, 1800);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!analysisStarted) return;

    setOpenData(null);
    let cancelled = false;

    async function loadOpenData() {
      const response = await fetch(`/api/open-data/context?city=${encodeURIComponent(data.city)}&sector=${encodeURIComponent(data.sector)}`);
      if (!response.ok || cancelled) return;
      setOpenData((await response.json()) as OpenDataContext);
    }

    void loadOpenData();

    return () => {
      cancelled = true;
    };
  }, [analysisStarted, data.city, data.sector]);

  useEffect(() => {
    if (!analysisStarted) return;
    setInsights(null);
  }, [analysisStarted, data]);

  useEffect(() => {
    if (!analysisStarted || !openData) return;

    const timeout = window.setTimeout(async () => {
      const response = await fetch("/api/ai/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data, openData })
      });

      if (response.ok) {
        setInsights((await response.json()) as InsightsResponse);
      }
    }, 400);

    return () => window.clearTimeout(timeout);
  }, [analysisStarted, data, openData]);

  useEffect(() => {
    setAudioBriefing(null);
  }, [data, openData, insights]);

  useEffect(() => {
    const target = getCountdownTargetTime();
    const interval = window.setInterval(() => {
      setCountdown(buildCountdownState(target));
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  const employeeValue = getEmployeeMedian(data.employeesRange);
  const percentileLabel = useMemo(() => {
    const ratio = carbon.total / Math.max(carbon.benchmarkTotal, 1);
    if (ratio > 1.25) return "Sei nel 34% piu` emissivo del tuo settore.";
    if (ratio > 1.05) return "Sei appena sopra la media del tuo settore.";
    return "Sei gia` nella fascia piu` efficiente del tuo settore.";
  }, [carbon.benchmarkTotal, carbon.total]);

  const scopeValues = [
    { label: "Scope 1", value: carbon.scope1, width: Math.min(100, (carbon.scope1 / carbon.total) * 100 + 8) },
    { label: "Scope 2", value: carbon.scope2, width: Math.min(100, (carbon.scope2 / carbon.total) * 100 + 8) },
    { label: "Scope 3", value: carbon.scope3, width: Math.min(100, (carbon.scope3 / carbon.total) * 100 + 8) }
  ];

  const provenanceEntries = useMemo<DataSourceEntry[]>(() => {
    const derived = [...dataSources];

    if (openData) {
      derived.push({
        id: "open-data-feed",
        label: "OPEN DATA FEED",
        kind: "open-data",
        origin: openData.source === "live" ? "Open-Meteo + dataset territoriali" : "Fallback territoriale demo",
        updatedAt,
        fields: ["airQualityIndex", "weeklyTemperatureDelta", "climateRiskLabel"],
        note: `${openData.city} - qualita' aria ${openData.airQualityLabel}`
      });
    }

    if (insights) {
      const llmAgents = insights.agentTrace.filter((agent) => agent.mode === "llm").length;
      derived.push({
        id: "ai-insights",
        label: "AI INSIGHTS",
        kind: "ai",
        origin: insights.source.startsWith("gemini")
          ? "Gemini AI multi-agent"
          : insights.source.startsWith("regolo")
            ? "Regolo AI multi-agent"
            : "Motore locale multi-agent",
        updatedAt,
        fields: ["scope1", "scope2", "scope3", "actions"],
        note:
          llmAgents > 0
            ? `${llmAgents}/${insights.agentTrace.length} agenti eseguiti via LLM. Orchestrazione ${insights.orchestrationMode}.`
            : `Orchestrazione ${insights.orchestrationMode}. Azioni e benchmark rigenerati in fallback strutturato.`
      });
    }

    return derived;
  }, [dataSources, insights, openData, updatedAt]);

  const missionCards = useMemo<MissionPrepCard[]>(() => {
    return [
      {
        panel: "SCANNER",
        title: "Scanner",
        description: "Dati aziendali, upload documenti e provenienza delle sorgenti.",
        detail: analysisStarted ? ingestionNotice : "Intake pronto al lancio",
        status: panelStatuses.SCANNER
      },
      {
        panel: "TERRA",
        title: "Terra",
        description: "Contesto territoriale, rischio climatico e benchmark locale.",
        detail: openData ? `${openData.city} - aria ${openData.airQualityLabel}` : "Connessione ai feed territoriali",
        status: panelStatuses.TERRA
      },
      {
        panel: "ORBITA",
        title: "Orbita",
        description: "Azioni AI, payoff economico e briefing operativo.",
        detail: insights ? `${actions.length} azioni pronte - ESG ${score.total}` : "Planner, benchmark e action in esecuzione",
        status: panelStatuses.ORBITA
      },
      {
        panel: "COMPLIANCE",
        title: "Compliance",
        description: "Readiness CSRD, trace compliance e report PDF.",
        detail: insights ? "Dossier CSRD pronto alla navigazione" : "Composizione readiness e report",
        status: panelStatuses.COMPLIANCE
      }
    ];
  }, [actions.length, analysisStarted, ingestionNotice, insights, openData, panelStatuses, score.total]);

  const missionAgents = useMemo<MissionAgentIndicator[]>(() => {
    if (insights?.agentTrace.length) {
      return insights.agentTrace.map((agent) => ({
        id: agent.agent,
        label: agent.agent,
        detail: agent.mode,
        status: "done"
      }));
    }

    if (!analysisStarted) {
      return [
        { id: "planner", label: "planner", detail: "standby", status: "queued" },
        { id: "benchmark", label: "benchmark", detail: "standby", status: "queued" },
        { id: "compliance", label: "compliance", detail: "standby", status: "queued" },
        { id: "action", label: "action", detail: "standby", status: "queued" }
      ];
    }

    if (!openData) {
      return [
        { id: "planner", label: "planner", detail: "warming up", status: "running" },
        { id: "benchmark", label: "benchmark", detail: "queued", status: "queued" },
        { id: "compliance", label: "compliance", detail: "queued", status: "queued" },
        { id: "action", label: "action", detail: "queued", status: "queued" }
      ];
    }

    return [
      { id: "planner", label: "planner", detail: "running", status: "running" },
      { id: "benchmark", label: "benchmark", detail: "running", status: "running" },
      { id: "compliance", label: "compliance", detail: "running", status: "running" },
      { id: "action", label: "action", detail: "running", status: "running" }
    ];
  }, [analysisStarted, insights, openData]);

  function upsertDataSource(source: DataSourceEntry) {
    setDataSources((current) => {
      const next = current.filter((entry) => entry.id !== source.id);
      return [source, ...next].slice(0, 6);
    });
  }

  function registerManualUpdate(fieldLabel: string) {
    upsertDataSource({
      id: "manual-scanner",
      label: "INSERIMENTO MANUALE",
      kind: "manual",
      origin: "Scanner live del pannello centrale",
      updatedAt: formatNowLabel(),
      fields: ["sector", "employeesRange", "electricityKwh"],
      note: `Ultimo campo modificato: ${fieldLabel}`
    });
  }

  function handleStartMission() {
    setAnalysisStarted(true);
    setViewStage("deck");
    setActivePanel("SCANNER");
  }

  async function handleReportDownload() {
    const response = await fetch("/api/reports/csrd", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data,
        carbon,
        score,
        actions,
        openData,
        complianceSummary: insights?.complianceSummary
      })
    });

    if (!response.ok) return;
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ecosignal-csrd-${data.companyName.toLowerCase().replaceAll(" ", "-")}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function handleGenerateAudioBriefing() {
    if (!openData || !insights) return;

    setIsAudioLoading(true);

    try {
      const response = await fetch("/api/audio/briefing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: data.companyName,
          summary: insights.summary,
          actions: insights.actions,
          openData,
          complianceSummary: insights.complianceSummary
        })
      });

      if (!response.ok) return;
      setAudioBriefing((await response.json()) as AudioBriefingState);
    } finally {
      setIsAudioLoading(false);
    }
  }

  function renderPanel(panel: PanelKey) {
    if (panel === "SCANNER") {
      return (
        <PanelScanner
          mode={analysisStarted ? "workspace" : "intake"}
          isFlowLaunching={analysisStarted && !insights}
          sector={data.sector}
          employeeValue={employeeValue}
          electricityKwh={data.electricityKwh}
          carbonTotal={carbon.total}
          scopeValues={scopeValues}
          percentileLabel={percentileLabel}
          ingestionNotice={ingestionNotice}
          sources={provenanceEntries}
          sectors={["Manifattura", "Logistica", "Retail", "Food & Beverage", "Edilizia", "Servizi"]}
          onSectorChange={(value) => {
            setData((current) => ({ ...current, sector: value }));
            registerManualUpdate("settore");
          }}
          onEmployeeChange={(value) => {
            setData((current) => ({ ...current, employeesRange: employeeCountToRange(value) }));
            registerManualUpdate("dipendenti");
          }}
          onElectricityChange={(value) => {
            setData((current) => ({ ...current, electricityKwh: Number.isFinite(value) ? value : 0 }));
            registerManualUpdate("elettricita'");
          }}
          
          onLoadDemo={() => {
            setData(defaultOnboardingData);
            setIngestionNotice("Baseline aggiornata.");
            upsertDataSource({
              id: "demo-seed",
              label: "DATASET DEMO",
              kind: "demo",
              origin: "Seed iniziale mission control",
              updatedAt: formatNowLabel(),
              fields: ["companyName", "sector", "electricityKwh", "flightsKm", "trainKm"],
              note: `Baseline demo riallineata su ${defaultOnboardingData.companyName}.`
            });
          }}
          
          onFilesAdded={async (files) => {
            for (const file of files) {
              try {
                const parsed = await parseDataDocument(file);
                if (parsed.applyMode === "replace" && parsed.data) {
                  setData(parsed.data);
                } else if (Object.keys(parsed.patch).length) {
                  setData((current) => ({ ...current, ...parsed.patch }));
                }
                upsertDataSource(parsed.source);
                setIngestionNotice(parsed.notice);
              } catch {
                setIngestionNotice(`${file.name} non e' stato importato correttamente.`);
              }
            }
          }}
          onStartFlow={handleStartMission}
        />
      );
    }

    if (panel === "TERRA" && openData) {
      return (
        <PanelTerra
          openData={openData}
          carbonTotal={carbon.total}
          benchmarkTotal={carbon.benchmarkTotal}
          score={score.total}
          actionsCount={actions.length}
          orchestrationMode={insights?.orchestrationMode ?? "multi-agent-fallback"}
          nationalCounter={counter}
          liveFeedMetrics={feed}
        />
      );
    }

    if (panel === "ORBITA") {
      return (
        <PanelOrbita
          score={score.total}
          actions={actions}
        />
      );
    }

    if (panel === "COMPLIANCE") {
      const complianceSummary =
        insights?.complianceSummary ??
        buildFallbackComplianceSummary({
          data,
          carbon: localCarbon,
          score: localScore,
          openData
        });

      return (
        <PanelCompliance
          countdown={countdown}
          score={score.total}
          actionsCount={actions.length}
          complianceSummary={complianceSummary}
          orchestrationMode={insights?.orchestrationMode ?? "multi-agent-fallback"}
          briefing={audioBriefing}
          isBriefingLoading={isAudioLoading}
          canGenerateBriefing={Boolean(openData && insights)}
          onGenerateBriefing={() => void handleGenerateAudioBriefing()}
          onPrimaryAction={() => void handleReportDownload()}
        />
      );
    }

    return (
      <div className="flex h-full items-center justify-center p-6 text-sm leading-7 text-muted">
        La vista si sblocca appena il suo dataset e&apos; pronto.
      </div>
    );
  }

  const currentPanelIndex = Math.max(1, availablePanels.indexOf(activePanel) + 1);
  const isIntakeStage = viewStage === "intake";
  const isDeckStage = viewStage === "deck";
  const isPanelStage = viewStage === "panel";

  return (
    <main className="mission-shell">
      <ParticleField />
      <LoadingScreen visible={showLoading} />

      <div className="relative z-10 flex h-full min-h-0 flex-col overflow-hidden">
        <TopBar
          company={data.companyName}
          aiMode={aiMode}
          updatedAt={updatedAt}
          primaryLabel={isDeckStage ? "Vista scanner ->" : isPanelStage ? "Torna alle viste ->" : ""}
          showPrimaryAction={!isIntakeStage}
          onPrimaryAction={() => {
            if (isDeckStage) {
              setActivePanel("SCANNER");
              setViewStage("panel");
              return;
            }

            setViewStage("deck");
          }}
        />

        {isIntakeStage ? (
          <div className="flex min-h-0 flex-1 overflow-hidden px-2 py-2 lg:px-4 lg:py-4">
            <section aria-live="polite" className="mission-panel relative mx-auto min-h-0 w-full max-w-[1240px] overflow-hidden">
              <motion.div
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, filter: "blur(6px)", scale: 0.985 }}
                animate={reduceMotion ? { opacity: 1 } : { opacity: 1, filter: "blur(0px)", scale: 1 }}
                transition={{ duration: reduceMotion ? 0.16 : 0.28, ease: "easeOut" }}
                className="scrollbar-hidden relative h-full min-h-0 overflow-y-auto"
              >
                {renderPanel("SCANNER")}
              </motion.div>
            </section>
          </div>
        ) : isDeckStage ? (
          <div className="flex min-h-0 flex-1 overflow-hidden px-2 py-2 lg:px-4 lg:py-4">
            <section aria-live="polite" className="mission-panel relative mx-auto flex min-h-0 w-full max-w-[1400px] overflow-hidden">
              <motion.div
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, filter: "blur(8px)", scale: 0.99 }}
                animate={reduceMotion ? { opacity: 1 } : { opacity: 1, filter: "blur(0px)", scale: 1 }}
                transition={{ duration: reduceMotion ? 0.16 : 0.28, ease: "easeOut" }}
                className="flex h-full min-h-0 flex-1 items-center"
              >
                <MissionPrepDeck
                  cards={missionCards}
                  agents={missionAgents}
                  activePanel={activePanel}
                  variant="deck-only"
                  onSelect={(panel) => {
                    if (panelStatuses[panel] !== "ready") return;
                    setActivePanel(panel);
                    setViewStage("panel");
                  }}
                />
              </motion.div>
            </section>
          </div>
        ) : (
          <div className="flex min-h-0 flex-1 overflow-hidden px-2 py-2 lg:px-4 lg:py-4">
            <section aria-live="polite" className="mission-panel relative mx-auto flex min-h-0 w-full max-w-[1400px] flex-1 flex-col overflow-hidden">
              <div className="relative min-h-0 flex-1 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activePanel}
                    initial={reduceMotion ? { opacity: 0 } : { opacity: 0, filter: "blur(6px)", scale: 0.985, y: 22 }}
                    animate={reduceMotion ? { opacity: 1 } : { opacity: 1, filter: "blur(0px)", scale: 1, y: 0 }}
                    exit={reduceMotion ? { opacity: 0 } : { opacity: 0, filter: "blur(4px)", scale: 0.98, y: -10 }}
                    transition={{ duration: reduceMotion ? 0.16 : 0.26, ease: "easeOut" }}
                    className="scrollbar-hidden relative h-full min-h-0 overflow-y-auto"
                  >
                    {!reduceMotion ? (
                      <div className="strip-grid">
                        {Array.from({ length: 20 }, (_, index) => (
                          <motion.div
                            key={`${activePanel}-strip-${index}`}
                            className="strip-row h-[5%]"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.02, duration: 0.16 }}
                          />
                        ))}
                      </div>
                    ) : null}

                    {renderPanel(activePanel)}
                  </motion.div>
                </AnimatePresence>
              </div>

              <PanelPager
                currentLabel={panelTitles[activePanel]}
                currentIndex={currentPanelIndex}
                total={availablePanels.length}
                onPrevious={goToPrevious}
                onNext={goToNext}
                canGoPrevious={canGoPrevious}
                canGoNext={canGoNext}
              />
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
