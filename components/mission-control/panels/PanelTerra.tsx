"use client";

import { LiveFeed, type FeedMetric } from "@/components/mission-control/LiveFeed";
import type { OpenDataContext } from "@/lib/types";

export function PanelTerra({
  openData,
  carbonTotal,
  benchmarkTotal,
  score,
  actionsCount,
  orchestrationMode,
  nationalCounter,
  liveFeedMetrics
}: {
  openData: OpenDataContext;
  carbonTotal: number;
  benchmarkTotal: number;
  score: number;
  actionsCount: number;
  orchestrationMode: "multi-agent-llm" | "multi-agent-fallback";
  nationalCounter: number;
  liveFeedMetrics: FeedMetric[];
}) {
  const delta = carbonTotal - benchmarkTotal;
  const deltaLabel = delta > 0 ? `+${delta.toFixed(0)} t` : `${delta.toFixed(0)} t`;

  return (
    <div className="scrollbar-hidden grid min-h-full gap-6 overflow-y-auto p-5 lg:grid-cols-[0.5fr_0.5fr] lg:p-6">
      <div className="flex min-h-0 flex-col gap-5">
        <div>
          <div className="mono-font text-xs uppercase tracking-[0.32em] text-muted">TERRA SIGNALS</div>
          <h2 className="display-font mt-3 text-[clamp(2.6rem,5.6vw,4.8rem)] leading-[0.92] text-text">
            IL CONTESTO
            <br />
            ENTRA NEL MODELLO.
          </h2>
          <p className="mt-4 max-w-xl text-base leading-8 text-muted">
            Feed territoriali, rischio climatico e benchmark di settore entrano nella stessa corsa dati della tua azienda.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="mission-section p-4">
            <div className="hud-label">ARIA - {openData.city.toUpperCase()}</div>
            <div className="mono-font mt-3 text-4xl text-accent">{openData.airQualityIndex}</div>
            <div className="mono-font mt-2 text-xs uppercase tracking-[0.18em] text-muted">{openData.airQualityLabel}</div>
          </div>
          <div className="mission-section p-4">
            <div className="hud-label">TREND CLIMATICO</div>
            <div className="mono-font mt-3 text-4xl text-text">+{openData.weeklyTemperatureDelta.toFixed(1)} C</div>
            <div className="mono-font mt-2 text-xs uppercase tracking-[0.18em] text-muted">
              rischio {openData.climateRiskLabel}
            </div>
          </div>
        </div>

        <div className="mission-section min-h-0 p-5">
          <div className="hud-label">NOTE DAL TERRITORIO</div>
          <div className="mt-4 space-y-3">
            {openData.notes.map((note) => (
              <div key={note} className="border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] p-3 text-sm leading-6 text-muted">
                {note}
              </div>
            ))}
          </div>

          <div className="mt-5">
            <LiveFeed metrics={liveFeedMetrics} />
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {openData.incentives.map((item) => (
              <div key={item} className="border border-[rgba(240,160,48,0.18)] bg-[rgba(240,160,48,0.06)] p-3">
                <div className="mono-font text-[10px] uppercase tracking-[0.2em] text-[var(--amber)]">Incentivo</div>
                <div className="mt-2 text-sm leading-6 text-text">{item}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex min-h-0 flex-col gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="mission-section p-4">
            <div className="hud-label">BASELINE AZIENDA</div>
            <div className="mono-font mt-3 text-4xl text-text">{carbonTotal.toFixed(0)} t</div>
            <div className="mono-font mt-2 text-xs uppercase tracking-[0.18em] text-muted">CO2eq / anno</div>
          </div>
          <div className="mission-section p-4">
            <div className="hud-label">VS BENCHMARK</div>
            <div className={`mono-font mt-3 text-4xl ${delta > 0 ? "text-[var(--amber)]" : "text-accent"}`}>{deltaLabel}</div>
            <div className="mono-font mt-2 text-xs uppercase tracking-[0.18em] text-muted">
              media settore {benchmarkTotal.toFixed(0)} t
            </div>
          </div>
        </div>

        <div className="mission-section p-5">
          <div className="hud-label">MISSION SNAPSHOT</div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="border border-[rgba(255,255,255,0.06)] p-3">
              <div className="mono-font text-[10px] uppercase tracking-[0.2em] text-muted">ESG score</div>
              <div className="display-font mt-2 text-4xl leading-none text-text">{score}</div>
            </div>
            <div className="border border-[rgba(255,255,255,0.06)] p-3">
              <div className="mono-font text-[10px] uppercase tracking-[0.2em] text-muted">Azioni AI</div>
              <div className="display-font mt-2 text-4xl leading-none text-text">{actionsCount}</div>
            </div>
            <div className="border border-[rgba(255,255,255,0.06)] p-3">
              <div className="mono-font text-[10px] uppercase tracking-[0.2em] text-muted">Orchestrazione</div>
              <div className="mono-font mt-3 text-xs uppercase tracking-[0.18em] text-accent">
                {orchestrationMode === "multi-agent-llm" ? "LLM MULTI-AGENT" : "FALLBACK MULTI-AGENT"}
              </div>
            </div>
          </div>
        </div>

        <div className="mission-section p-5">
          <div className="hud-label">COUNTER NAZIONALE CO2</div>
          <div className="mono-font mt-4 text-[clamp(2.6rem,7vw,5rem)] leading-none text-accent">
            {nationalCounter.toLocaleString("it-IT")}
          </div>
          <div className="mono-font mt-3 text-xs uppercase tracking-[0.18em] text-muted">
            tCO2eq emesse in Italia oggi
          </div>

          
        </div>
      </div>
    </div>
  );
}
