"use client";

import { LiveFeed } from "@/components/mission-control/LiveFeed";
import { LoadingScreen } from "@/components/mission-control/LoadingScreen";
import { NavVertical } from "@/components/mission-control/NavVertical";
import { ParticleField } from "@/components/mission-control/ParticleField";
import { StatusBar } from "@/components/mission-control/StatusBar";
import { TopBar } from "@/components/mission-control/TopBar";
import { PanelCompliance } from "@/components/mission-control/panels/PanelCompliance";
import { PanelOrbita } from "@/components/mission-control/panels/PanelOrbita";
import { PanelScanner } from "@/components/mission-control/panels/PanelScanner";
import { PanelTerra } from "@/components/mission-control/panels/PanelTerra";
import { getEmployeeMedian } from "@/lib/carbon";
import { calculateCarbonFootprint } from "@/lib/carbon";
import { parseDataDocument } from "@/lib/document-ingestion";
import { cityProfiles, defaultOnboardingData } from "@/lib/mock-data";
import type {
  ActionRecommendation,
  BriefingResponse,
  CarbonFootprint,
  DataSourceEntry,
  EsgScoreBreakdown,
  OnboardingData,
  OpenDataContext
} from "@/lib/types";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { PanelKey, usePanelNav } from "@/hooks/usePanelNav";
import { useLiveData } from "@/hooks/useLiveData";

interface InsightsResponse {
  carbon: CarbonFootprint;
  score: EsgScoreBreakdown;
  actions: ActionRecommendation[];
  summary: string[];
  source: string;
  orchestrationMode: "multi-agent-llm" | "multi-agent-fallback";
  agentTrace: { agent: string; title: string; content: string; mode: "llm" | "fallback" }[];
  warning?: string;
}

interface AudioBriefingState extends BriefingResponse {}

function employeeCountToRange(value: number): OnboardingData["employeesRange"] {
  if (value < 50) return "10-49";
  if (value < 100) return "50-99";
  if (value < 250) return "100-249";
  if (value < 500) return "250-500";
  return "500+";
}

export function MissionControlHome() {
  const reduceMotion = useReducedMotion();
  const { activePanel, panels, setActivePanel } = usePanelNav("TERRA");
  const [data, setData] = useState<OnboardingData>(defaultOnboardingData);
  const [openData, setOpenData] = useState<OpenDataContext | null>(null);
  const [insights, setInsights] = useState<InsightsResponse | null>(null);
  const [audioBriefing, setAudioBriefing] = useState<AudioBriefingState | null>(null);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [countdown, setCountdown] = useState({ days: 487, hours: 14, minutes: 32, seconds: 18 });
  const [ingestionNotice, setIngestionNotice] = useState("Dataset demo attivo. Puoi passare a input manuale o caricare un file.");
  const [dataSources, setDataSources] = useState<DataSourceEntry[]>([
    {
      id: "demo-seed",
      label: "DATASET DEMO",
      kind: "demo",
      origin: "Seed iniziale mission control",
      updatedAt: new Date().toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      fields: ["companyName", "sector", "electricityKwh", "flightsKm", "trainKm"],
      note: `${defaultOnboardingData.companyName} - baseline demo con travel planning pronta all'uso.`
    }
  ]);

  const localCarbon = calculateCarbonFootprint(data);
  const carbon = insights?.carbon ?? localCarbon;
  const score = insights?.score ?? { environmental: 68, social: 76, governance: 71, total: 72, benchmark: 64, deltaVsBenchmark: 8 };
  const actions = insights?.actions ?? [];
  const { feed, counter, updatedAt } = useLiveData(openData);
  const aiMode = insights?.orchestrationMode ?? "loading";

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
    setOpenData(null);
    let cancelled = false;

    async function loadOpenData() {
      const response = await fetch(`/api/open-data/context?city=${encodeURIComponent(data.city)}&sector=${encodeURIComponent(data.sector)}`);
      if (!response.ok) return;
      if (cancelled) return;
      setOpenData((await response.json()) as OpenDataContext);
    }

    void loadOpenData();

    return () => {
      cancelled = true;
    };
  }, [data.city, data.sector]);

  useEffect(() => {
    setInsights(null);
  }, [data]);

  useEffect(() => {
    if (!openData) return;

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
  }, [data, openData]);

  useEffect(() => {
    setAudioBriefing(null);
  }, [data, openData, insights]);

  useEffect(() => {
    const target = new Date("2027-07-28T23:59:59+02:00").getTime();
    const interval = window.setInterval(() => {
      const diff = Math.max(0, target - Date.now());
      setCountdown({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000)
      });
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

  const profile = cityProfiles[data.city] ?? cityProfiles.Milano;
  const coordinates = `${profile.lat.toFixed(2)}N  ${profile.lon.toFixed(2)}E`;
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
        origin: insights.source.startsWith("regolo") ? "Regolo AI multi-agent" : "Motore locale multi-agent",
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
      updatedAt: new Date().toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      fields: ["sector", "employeesRange", "electricityKwh"],
      note: `Ultimo campo modificato: ${fieldLabel}`
    });
  }

  async function handleReportDownload() {
    const response = await fetch("/api/reports/csrd", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data, carbon, score, actions })
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
          openData
        })
      });

      if (!response.ok) return;
      setAudioBriefing((await response.json()) as AudioBriefingState);
    } finally {
      setIsAudioLoading(false);
    }
  }

  function renderPanel(panel: PanelKey) {
    if (panel === "TERRA") {
      return <PanelTerra nationalCounter={counter} onPrimaryAction={() => setActivePanel("SCANNER")} />;
    }

    if (panel === "SCANNER") {
      return (
        <PanelScanner
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
            setIngestionNotice("Dataset demo ricaricato.");
            upsertDataSource({
              id: "demo-seed",
              label: "DATASET DEMO",
              kind: "demo",
              origin: "Seed iniziale mission control",
              updatedAt: new Date().toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
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
          onGoOrbita={() => setActivePanel("ORBITA")}
        />
      );
    }

    if (panel === "ORBITA") {
      return (
        <PanelOrbita
          score={score.total}
          actions={actions}
          briefing={audioBriefing}
          isBriefingLoading={isAudioLoading}
          canGenerateBriefing={Boolean(openData && insights)}
          onGenerateBriefing={() => void handleGenerateAudioBriefing()}
        />
      );
    }

    return <PanelCompliance countdown={countdown} onPrimaryAction={() => void handleReportDownload()} />;
  }

  return (
    <main className="mission-shell">
      <ParticleField />
      <LoadingScreen visible={showLoading} />

      <div className="relative z-10 flex h-full min-h-0 flex-col overflow-hidden">
        <TopBar
          company={data.companyName}
          aiMode={aiMode}
          updatedAt={updatedAt}
          onPrimaryAction={() => setActivePanel("SCANNER")}
        />

        <div
          className={`grid min-h-0 flex-1 grid-cols-1 gap-px overflow-hidden px-2 py-2 lg:px-3 lg:py-3 ${
            activePanel === "ORBITA" ? "lg:grid-cols-[150px_minmax(0,1fr)]" : "lg:grid-cols-[150px_minmax(0,1fr)_240px]"
          }`}
        >
          <NavVertical
            panels={panels}
            activePanel={activePanel}
            city={data.city}
            coordinates={coordinates}
            onChange={setActivePanel}
          />

          <section aria-live="polite" className="mission-panel relative min-h-0 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePanel}
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, filter: "blur(6px)", scale: 0.985 }}
                animate={reduceMotion ? { opacity: 1 } : { opacity: 1, filter: "blur(0px)", scale: 1 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, filter: "blur(4px)", scale: 0.98 }}
                transition={{ duration: reduceMotion ? 0.16 : 0.24, ease: "easeOut" }}
                className="relative h-full min-h-0"
              >
                {!reduceMotion ? (
                  <div className="strip-grid">
                    {Array.from({ length: 20 }, (_, index) => (
                      <motion.div
                        key={`${activePanel}-strip-${index}`}
                        className="strip-row h-[5%]"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.025, duration: 0.16 }}
                      />
                    ))}
                  </div>
                ) : null}

                {renderPanel(activePanel)}
              </motion.div>
            </AnimatePresence>
          </section>

          {activePanel === "ORBITA" ? null : <LiveFeed metrics={feed} />}
        </div>

        <StatusBar updatedAt={updatedAt} aiMode={aiMode} />
      </div>
    </main>
  );
}
