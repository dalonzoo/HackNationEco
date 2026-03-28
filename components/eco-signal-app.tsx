"use client";

import { BenchmarkBarChart } from "@/components/charts/benchmark-bar-chart";
import { EmissionDonutChart } from "@/components/charts/emission-donut-chart";
import { TrendLineChart } from "@/components/charts/trend-line-chart";
import {
  ChoiceChips,
  InsightSkeleton,
  NumericField,
  SectionHeading,
  SmallMetric,
  TextField
} from "@/components/ui/ecosignal-kit";
import { calculateCarbonFootprint, simulateFleetSwap } from "@/lib/carbon";
import { buildTrendSeries, calculateEsgScore } from "@/lib/esg";
import { currencyFormatter, formatSignedNumber, integerFormatter, numberFormatter } from "@/lib/format";
import { defaultOnboardingData } from "@/lib/mock-data";
import type {
  ActionRecommendation,
  BriefingResponse,
  CarbonFootprint,
  EsgScoreBreakdown,
  OnboardingData,
  OpenDataContext
} from "@/lib/types";
import { useEffect, useState } from "react";

type NumericFieldKey =
  | "facilities"
  | "electricityKwh"
  | "gasM3"
  | "waterM3"
  | "dieselKm"
  | "petrolKm"
  | "electricKm"
  | "flightsKm"
  | "trainKm"
  | "localSuppliersPct"
  | "wasteKg"
  | "recyclingPct";

interface InsightsResponse {
  carbon: CarbonFootprint;
  score: EsgScoreBreakdown;
  actions: ActionRecommendation[];
  summary: string[];
  source: string;
  warning?: string;
}

const STORAGE_KEY = "ecosignal-enterprise-demo";
const steps = [
  { title: "Profilo", caption: "Anagrafica ESG essenziale" },
  { title: "Energia", caption: "Consumi e siti produttivi" },
  { title: "Mobilita`", caption: "Flotta e trasferte" },
  { title: "Filiera", caption: "Supply chain e rifiuti" },
  { title: "Review", caption: "Priorita` e budget" }
] as const;
const sectors = ["Manifattura", "Logistica", "Retail", "Food & Beverage", "Edilizia", "Servizi"] as const;
const employeeRanges: OnboardingData["employeesRange"][] = ["10-49", "50-99", "100-249", "250-500", "500+"];
const revenueRanges: OnboardingData["revenueRange"][] = ["0-2M", "2-10M", "10-25M", "25-50M", "50M+"];
const budgetRanges: OnboardingData["budgetRange"][] = ["Fino a 10k", "10k-50k", "50k-150k", "150k+"];

function downloadBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function EcoSignalApp() {
  const [data, setData] = useState<OnboardingData>(defaultOnboardingData);
  const [activeStep, setActiveStep] = useState(0);
  const [openData, setOpenData] = useState<OpenDataContext | null>(null);
  const [insights, setInsights] = useState<InsightsResponse | null>(null);
  const [briefing, setBriefing] = useState<BriefingResponse | null>(null);
  const [simulationVehicles, setSimulationVehicles] = useState(3);
  const [isLoadingInsights, setIsLoadingInsights] = useState(true);
  const [isGeneratingBriefing, setIsGeneratingBriefing] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const localCarbon = calculateCarbonFootprint(data);
  const localScore = calculateEsgScore(data, localCarbon);
  const carbon = insights?.carbon ?? localCarbon;
  const score = insights?.score ?? localScore;
  const actions = insights?.actions ?? [];
  const summary = insights?.summary ?? [];
  const trendData = buildTrendSeries(localCarbon, localCarbon.benchmarkTotal);
  const simulator = simulateFleetSwap(data, simulationVehicles);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    try {
      setData(JSON.parse(stored) as OnboardingData);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    let cancelled = false;

    async function loadOpenData() {
      try {
        const response = await fetch(
          `/api/open-data/context?city=${encodeURIComponent(data.city)}&sector=${encodeURIComponent(data.sector)}`
        );
        const payload = (await response.json()) as OpenDataContext;
        if (!cancelled) setOpenData(payload);
      } catch {
        if (!cancelled) setNotice("Open data non raggiungibili: uso benchmark demo locali.");
      }
    }

    void loadOpenData();
    return () => {
      cancelled = true;
    };
  }, [data.city, data.sector]);

  useEffect(() => {
    if (!openData) return;

    const timeout = window.setTimeout(async () => {
      setIsLoadingInsights(true);

      try {
        const response = await fetch("/api/ai/insights", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data, openData })
        });

        if (!response.ok) throw new Error("Insights non disponibili");
        const payload = (await response.json()) as InsightsResponse;
        setInsights(payload);
        setNotice(payload.warning ?? null);
      } catch {
        setInsights(null);
        setNotice("Insight AI non disponibili: la dashboard usa i KPI locali.");
      } finally {
        setIsLoadingInsights(false);
      }
    }, 650);

    return () => window.clearTimeout(timeout);
  }, [data, openData]);

  function updateTextField<K extends keyof OnboardingData>(field: K, value: OnboardingData[K]) {
    setData((current) => ({ ...current, [field]: value }));
  }

  function updateNumericField(field: NumericFieldKey, value: string) {
    setData((current) => ({ ...current, [field]: Number.isFinite(Number(value)) ? Number(value) : 0 }));
  }

  async function generateBriefing() {
    if (!openData || !summary.length) return;

    setIsGeneratingBriefing(true);
    try {
      const response = await fetch("/api/audio/briefing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName: data.companyName, summary, actions, openData })
      });
      if (!response.ok) throw new Error("Briefing non disponibile");
      setBriefing((await response.json()) as BriefingResponse);
    } catch {
      setNotice("Briefing audio non disponibile al momento.");
    } finally {
      setIsGeneratingBriefing(false);
    }
  }

  async function generateReport() {
    setIsGeneratingReport(true);
    try {
      const response = await fetch("/api/reports/csrd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data, carbon, score, actions })
      });
      if (!response.ok) throw new Error("Report non disponibile");
      downloadBlob(`ecosignal-csrd-${data.companyName.toLowerCase().replaceAll(" ", "-")}.pdf`, await response.blob());
      setNotice("Report CSRD generato correttamente.");
    } catch {
      setNotice("Errore nella generazione del report PDF.");
    } finally {
      setIsGeneratingReport(false);
    }
  }

  function resetDemoData() {
    setData(defaultOnboardingData);
    setBriefing(null);
    setActiveStep(0);
    setNotice("Dataset demo ripristinato.");
  }

  return (
    <main className="overflow-x-hidden">
      <section className="hero-grid relative isolate border-b border-white/5 bg-hero-grid">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 sm:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:px-10">
          <div className="space-y-8 fade-up">
            <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.32em] text-accent">
              EcoSignal Enterprise
            </div>
            <div className="space-y-5">
              <h1 className="display-font max-w-4xl text-5xl font-semibold leading-[1.02] text-white sm:text-6xl lg:text-7xl">
                ESG intelligence per PMI italiane, dai dati al gesto.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-[rgba(237,245,240,0.76)] sm:text-lg">
                Onboarding rapido, carbon footprint live, insight AI, briefing audio e report CSRD scaricabile.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a href="#workspace" className="glow-ring inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-[#04110b]">
                Apri la dashboard demo
              </a>
              <button type="button" onClick={resetDemoData} className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white">
                Ripristina dataset demo
              </button>
            </div>
          </div>

          <div className="panel rounded-[32px] p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-muted">Snapshot live</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">{data.companyName}</h2>
              </div>
              <div className="rounded-full border border-accent/30 bg-[rgba(0,200,150,0.12)] px-3 py-2 text-xs text-accent">
                {data.city} - {data.sector}
              </div>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <SmallMetric label="Footprint" value={`${numberFormatter.format(carbon.total)} tCO2eq`} hint="Calcolo in tempo reale mentre compili il wizard." />
              <SmallMetric label="ESG Score" value={`${score.total}/100`} hint={`Delta benchmark ${formatSignedNumber(score.deltaVsBenchmark)} punti.`} />
              <SmallMetric label="Top action" value={actions[0]?.title.split(" ").slice(0, 3).join(" ") ?? "In arrivo"} hint={actions[0]?.description ?? "Le azioni AI si aggiornano automaticamente."} />
              <SmallMetric label="Rischio locale" value={openData?.climateRiskLabel ?? "In analisi"} hint={`Sorgente ${openData?.source ?? "demo"} con incentivi italiani.`} />
            </div>
          </div>
        </div>
      </section>

      <section id="workspace" className="mx-auto max-w-7xl space-y-14 px-6 py-16 sm:px-8 lg:px-10">
        <SectionHeading
          eyebrow="Onboarding wizard"
          title="Inserisci pochi dati, ottieni subito metriche presentabili."
          description="Niente blocchi: ogni step si aggiorna in tempo reale e alimenta dashboard, simulator e report."
        />

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="panel rounded-[32px] p-6">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-muted">
                  Step {activeStep + 1}/{steps.length}
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-white">{steps[activeStep].title}</h3>
                <p className="mt-2 text-sm text-muted">{steps[activeStep].caption}</p>
              </div>
              <div className="w-full max-w-xs rounded-full bg-white/5 p-1">
                <div className="h-2 rounded-full bg-accent" style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }} />
              </div>
            </div>

            <div className="mb-8 flex flex-wrap gap-2">
              {steps.map((step, index) => (
                <button
                  key={step.title}
                  type="button"
                  onClick={() => setActiveStep(index)}
                  className={`rounded-full px-4 py-2 text-xs uppercase tracking-[0.22em] ${
                    index === activeStep ? "bg-[rgba(0,200,150,0.16)] text-white" : "bg-white/5 text-muted"
                  }`}
                >
                  {step.title}
                </button>
              ))}
            </div>

            <div className="space-y-8">
              {activeStep === 0 && (
                <div className="grid gap-5 md:grid-cols-2">
                  <TextField label="Nome azienda" value={data.companyName} onChange={(value) => updateTextField("companyName", value)} />
                  <TextField label="Codice ATECO" value={data.atecoCode} onChange={(value) => updateTextField("atecoCode", value)} />
                  <TextField label="Citta` principale" value={data.city} onChange={(value) => updateTextField("city", value)} />
                  <NumericField label="Sedi operative" value={data.facilities} suffix="n." onChange={(value) => updateNumericField("facilities", value)} />
                  <div className="space-y-3 md:col-span-2">
                    <span className="text-sm font-medium text-white">Settore</span>
                    <ChoiceChips options={sectors} value={data.sector} onChange={(value) => updateTextField("sector", value)} />
                  </div>
                  <div className="space-y-3">
                    <span className="text-sm font-medium text-white">Dipendenti</span>
                    <ChoiceChips options={employeeRanges} value={data.employeesRange} onChange={(value) => updateTextField("employeesRange", value)} />
                  </div>
                  <div className="space-y-3">
                    <span className="text-sm font-medium text-white">Fatturato</span>
                    <ChoiceChips options={revenueRanges} value={data.revenueRange} onChange={(value) => updateTextField("revenueRange", value)} />
                  </div>
                </div>
              )}

              {activeStep === 1 && (
                <div className="grid gap-5 md:grid-cols-2">
                  <NumericField label="Consumo elettrico annuo" value={data.electricityKwh} suffix="kWh" onChange={(value) => updateNumericField("electricityKwh", value)} />
                  <NumericField label="Consumo gas annuo" value={data.gasM3} suffix="m3" onChange={(value) => updateNumericField("gasM3", value)} />
                  <NumericField label="Consumo idrico annuo" value={data.waterM3} suffix="m3" onChange={(value) => updateNumericField("waterM3", value)} />
                  <div className="rounded-3xl border border-white/10 bg-[rgba(10,16,26,0.76)] p-5 text-sm leading-7 text-muted">
                    Tooltip demo: puoi lasciare anche stime. EcoSignal aggiorna Scope 1, 2 e 3 in diretta.
                  </div>
                </div>
              )}

              {activeStep === 2 && (
                <div className="grid gap-5 md:grid-cols-2">
                  <NumericField label="Km flotta diesel" value={data.dieselKm} suffix="km" onChange={(value) => updateNumericField("dieselKm", value)} />
                  <NumericField label="Km flotta benzina" value={data.petrolKm} suffix="km" onChange={(value) => updateNumericField("petrolKm", value)} />
                  <NumericField label="Km flotta elettrica" value={data.electricKm} suffix="km" onChange={(value) => updateNumericField("electricKm", value)} />
                  <NumericField label="Trasferte aeree annue" value={data.flightsKm} suffix="km" onChange={(value) => updateNumericField("flightsKm", value)} />
                  <NumericField label="Trasferte treno annue" value={data.trainKm} suffix="km" onChange={(value) => updateNumericField("trainKm", value)} />
                  <div className="rounded-3xl border border-white/10 bg-[rgba(10,16,26,0.76)] p-5 text-sm leading-7 text-muted">
                    Piu` sotto puoi simulare il passaggio di parte della flotta all&apos;elettrico.
                  </div>
                </div>
              )}

              {activeStep === 3 && (
                <div className="grid gap-5 md:grid-cols-2">
                  <NumericField label="Fornitori locali" value={data.localSuppliersPct} suffix="%" onChange={(value) => updateNumericField("localSuppliersPct", value)} />
                  <NumericField label="Rifiuti annui" value={data.wasteKg} suffix="kg" onChange={(value) => updateNumericField("wasteKg", value)} />
                  <NumericField label="Raccolta differenziata" value={data.recyclingPct} suffix="%" onChange={(value) => updateNumericField("recyclingPct", value)} />
                  <div className="rounded-3xl border border-white/10 bg-[rgba(10,16,26,0.76)] p-5 text-sm leading-7 text-muted md:col-span-2">
                    La filiera pesa sullo Scope 3: aumentare fornitori locali e tracciati migliora emissioni e resilienza.
                  </div>
                </div>
              )}

              {activeStep === 4 && (
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-3 md:col-span-2">
                    <span className="text-sm font-medium text-white">Budget disponibile</span>
                    <ChoiceChips options={budgetRanges} value={data.budgetRange} onChange={(value) => updateTextField("budgetRange", value)} />
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-[rgba(10,16,26,0.76)] p-5">
                    <p className="text-xs uppercase tracking-[0.26em] text-muted">Emissioni totali</p>
                    <p className="mt-3 text-3xl font-semibold text-white">{numberFormatter.format(localCarbon.total)} tCO2eq</p>
                    <p className="mt-2 text-sm leading-7 text-muted">
                      Scope 1 {numberFormatter.format(localCarbon.scope1)} - Scope 2 {numberFormatter.format(localCarbon.scope2)} - Scope 3 {numberFormatter.format(localCarbon.scope3)}
                    </p>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-[rgba(10,16,26,0.76)] p-5">
                    <p className="text-xs uppercase tracking-[0.26em] text-muted">Prontezza ESG</p>
                    <p className="mt-3 text-3xl font-semibold text-white">{localScore.total}/100</p>
                    <p className="mt-2 text-sm leading-7 text-muted">
                      Ambiente {localScore.environmental}/100 - Sociale {localScore.social}/100 - Governance {localScore.governance}/100
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
              <button type="button" onClick={() => setActiveStep((current) => Math.max(0, current - 1))} disabled={activeStep === 0} className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white disabled:opacity-35">
                Step precedente
              </button>
              <button type="button" onClick={() => setActiveStep((current) => Math.min(steps.length - 1, current + 1))} disabled={activeStep === steps.length - 1} className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-[#04110b] disabled:opacity-35">
                Step successivo
              </button>
            </div>
          </div>

          <div className="panel sticky top-6 h-fit rounded-[32px] p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-muted">Live scorecard</p>
            <div className="mt-6 grid gap-4">
              <SmallMetric label="Totale annuo" value={`${numberFormatter.format(localCarbon.total)} tCO2eq`} hint={`${numberFormatter.format(localCarbon.perEmployee)} tCO2eq per dipendente.`} />
              <SmallMetric label="Benchmark" value={`${numberFormatter.format(localCarbon.benchmarkTotal)} tCO2eq`} hint="Stima settoriale per PMI italiane comparabili." />
              <SmallMetric label="Potenziale saving" value={currencyFormatter.format(actions.reduce((sum, action) => sum + action.annualSavingEur, 0))} hint="Valore economico cumulato delle prime tre azioni." />
              <SmallMetric label="Open data" value={openData ? `AQI ${openData.airQualityIndex}` : "Sync"} hint={openData ? `${openData.airQualityLabel} - ${openData.climateRiskLabel}` : "Aggiornamento contesto territoriale."} />
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl space-y-14 px-6 pb-16 sm:px-8 lg:px-10">
        <SectionHeading eyebrow="Dashboard ESG" title="Una vista unica per score, benchmark e azioni prioritarie." description="La dashboard traduce i dati grezzi in KPI leggibili da CFO, CEO e sustainability manager." />

        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="panel rounded-[32px] p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-muted">ESG score globale</p>
                <div className="mt-3 flex items-end gap-3">
                  <h3 className="text-5xl font-semibold text-white">{score.total}</h3>
                  <p className="mb-1 text-sm text-muted">/100</p>
                </div>
              </div>
              <div className="rounded-2xl border border-accent/20 bg-[rgba(0,200,150,0.08)] px-4 py-3 text-sm text-accent">
                {score.deltaVsBenchmark >= 0 ? "Sopra media" : "Sotto media"} {formatSignedNumber(score.deltaVsBenchmark)} punti
              </div>
            </div>
            <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
              <div>
                <EmissionDonutChart data={carbon.categories} total={carbon.total} />
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {carbon.categories.map((item) => (
                    <div key={item.key} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.22em] text-muted">{item.label}</p>
                      <p className="mt-2 text-lg font-semibold text-white">{numberFormatter.format(item.value)} t</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <SmallMetric label="Ambiente" value={`${score.environmental}/100`} hint="Emissioni, rifiuti e supply chain." />
                <SmallMetric label="Sociale" value={`${score.social}/100`} hint="Mobilita` sostenibile e prossimita` di filiera." />
                <SmallMetric label="Governance" value={`${score.governance}/100`} hint="Prontezza operativa, KPI e budget." />
              </div>
            </div>
          </div>

          <div className="panel rounded-[32px] p-6">
            <p className="text-xs uppercase tracking-[0.32em] text-muted">Benchmark settoriale</p>
            <div className="mt-6">
              <BenchmarkBarChart total={carbon.total} benchmark={carbon.benchmarkTotal} />
            </div>
            <div className="mt-4 rounded-3xl border border-white/10 bg-[rgba(10,16,26,0.76)] p-5 text-sm leading-7 text-muted">
              La baseline annua e` <span className="font-semibold text-white">{carbon.total <= carbon.benchmarkTotal ? "piu` efficiente" : "piu` intensa"}</span> rispetto al benchmark del settore {data.sector}. KPI chiave: {numberFormatter.format(carbon.perEmployee)} tCO2eq per dipendente, {integerFormatter.format(data.localSuppliersPct)}% fornitori locali, {integerFormatter.format(data.recyclingPct)}% differenziata.
            </div>
          </div>
        </div>

        <div className="panel rounded-[32px] p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-muted">Trend 12 mesi</p>
              <h3 className="mt-2 text-2xl font-semibold text-white">Andamento emissioni vs benchmark</h3>
            </div>
            <p className="text-sm text-muted">Visuale da demo per mostrare progressione trimestrale e impatto delle azioni.</p>
          </div>
          <div className="mt-6">
            <TrendLineChart data={trendData} />
          </div>
        </div>

        <div className="space-y-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-muted">AI action engine</p>
              <h3 className="mt-2 text-2xl font-semibold text-white">Top 3 azioni a maggior impatto</h3>
            </div>
            <div className="text-sm text-muted">
              Fonte insight: <span className="text-white">{insights?.source ?? "calcolo locale"}</span>
            </div>
          </div>
          {isLoadingInsights ? (
            <InsightSkeleton />
          ) : (
            <div className="grid gap-4 lg:grid-cols-3">
              {actions.map((action) => (
                <article key={action.id} className="panel rounded-[28px] p-5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full border border-accent/20 bg-[rgba(0,200,150,0.12)] px-3 py-1 text-xs uppercase tracking-[0.2em] text-accent">
                      Priorita` {action.priority}
                    </span>
                    <span className="text-xs uppercase tracking-[0.22em] text-muted">Payback {action.paybackMonths} mesi</span>
                  </div>
                  <h4 className="mt-5 text-xl font-semibold text-white">{action.title}</h4>
                  <p className="mt-3 text-sm leading-7 text-muted">{action.description}</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <SmallMetric label="Riduzione" value={`-${numberFormatter.format(action.reductionTco2)} t`} hint="Impatto emissivo annuo." />
                    <SmallMetric label="Saving" value={currencyFormatter.format(action.annualSavingEur)} hint="Risparmio economico annuo." />
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-6 px-6 pb-20 sm:px-8 lg:px-10">
        <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
          <div className="panel rounded-[32px] p-6">
            <p className="text-xs uppercase tracking-[0.32em] text-muted">Open data e contesto</p>
            <h3 className="mt-2 text-2xl font-semibold text-white">Segnali territoriali utili al decision making</h3>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <SmallMetric label="Qualita` aria" value={openData ? openData.airQualityLabel : "In caricamento"} hint={openData ? `AQI ${openData.airQualityIndex} - sorgente ${openData.source}.` : "Sincronizzazione fonti territoriali."} />
              <SmallMetric label="Trend meteo" value={openData ? `${openData.weeklyTemperatureDelta} gradi / 7gg` : "In caricamento"} hint={openData ? openData.climateRiskLabel : "Rilevazione rischio climatico locale."} />
            </div>
            <div className="mt-5 rounded-3xl border border-white/10 bg-[rgba(10,16,26,0.76)] p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-muted">Incentivi applicabili</p>
              <ul className="mt-3 space-y-3 text-sm leading-7 text-white">
                {(openData?.incentives ?? ["Caricamento incentivi di settore."]).map((incentive) => (
                  <li key={incentive}>- {incentive}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <div className="panel rounded-[32px] p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.32em] text-muted">What-if simulator</p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">Cosa succede se sostituisci parte della flotta?</h3>
                </div>
                <div className="rounded-full border border-white/10 px-4 py-2 text-sm text-muted">{simulationVehicles} veicoli</div>
              </div>
              <input type="range" min="1" max="8" step="1" value={simulationVehicles} onChange={(event) => setSimulationVehicles(Number(event.target.value))} className="mt-6 w-full accent-accent" />
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <SmallMetric label="Km convertiti" value={`${integerFormatter.format(simulator.kmShifted)} km`} hint="Porzione diesel elettrificabile." />
                <SmallMetric label="Riduzione CO2" value={`-${numberFormatter.format(simulator.reductionTco2)} t`} hint="Risparmio emissivo annuo stimato." />
                <SmallMetric label="Saving" value={currencyFormatter.format(simulator.annualSavingEur)} hint="Stima tra carburante e manutenzione." />
              </div>
            </div>

            <div className="panel rounded-[32px] p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.32em] text-muted">Audio briefing</p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">Aggiornamento vocale di 90 secondi</h3>
                </div>
                <button type="button" onClick={() => void generateBriefing()} disabled={isGeneratingBriefing || !summary.length} className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-[#04110b] disabled:opacity-35">
                  {isGeneratingBriefing ? "Generazione in corso..." : "Genera briefing"}
                </button>
              </div>
              {briefing ? (
                <div className="mt-6 rounded-3xl border border-white/10 bg-[rgba(10,16,26,0.76)] p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-muted">Modalita` {briefing.source} - durata stimata {briefing.estimatedDurationSec}s</p>
                    {briefing.audioUrl ? <audio controls src={briefing.audioUrl} className="w-full max-w-xs" /> : <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-muted">Transcript demo</span>}
                  </div>
                  <p className="mt-4 text-sm leading-7 text-white">{briefing.transcript}</p>
                </div>
              ) : (
                <div className="mt-6 rounded-3xl border border-dashed border-white/15 bg-[rgba(10,16,26,0.4)] p-5 text-sm leading-7 text-muted">
                  Genera il briefing per ottenere uno script vocale pronto per la demo.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="panel rounded-[32px] p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-muted">Report engine</p>
              <h3 className="mt-2 text-2xl font-semibold text-white">Generatore CSRD demo pronto per il pitch</h3>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">Il PDF include governance, strategia, rischi, KPI e piano di transizione.</p>
            </div>
            <button type="button" onClick={() => void generateReport()} disabled={isGeneratingReport} className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#04110b] disabled:opacity-35">
              {isGeneratingReport ? "Generazione PDF..." : "Scarica report PDF"}
            </button>
          </div>
          {notice ? <div className="mt-5 rounded-2xl border border-[rgba(245,177,76,0.25)] bg-[rgba(245,177,76,0.08)] px-4 py-3 text-sm text-[rgba(255,220,170,0.92)]">{notice}</div> : null}
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <SmallMetric label="Compliance" value="CSRD + GRI" hint="Template demo strutturato sui blocchi di reporting piu` richiesti." />
            <SmallMetric label="Tempo" value="< 10 sec" hint="Generazione PDF locale con jsPDF via API route." />
            <SmallMetric label="Fallback" value="Demo-first" hint="Il progetto resta presentabile anche senza chiavi o servizi terzi." />
          </div>
        </div>
      </section>
    </main>
  );
}
