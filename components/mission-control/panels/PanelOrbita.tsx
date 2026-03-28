"use client";

import type { ActionRecommendation, BriefingResponse } from "@/lib/types";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const orbitPositions = [
  { x: "18%", y: "28%" },
  { x: "80%", y: "28%" },
  { x: "74%", y: "78%" },
  { x: "24%", y: "76%" }
];

const fallbackActionColors = [
  { core: "#00ff88", glow: "rgba(0,255,136,0.35)" },
  { core: "#4a9eff", glow: "rgba(74,158,255,0.35)" },
  { core: "#f0a030", glow: "rgba(240,160,48,0.34)" },
  { core: "#ff6b6b", glow: "rgba(255,107,107,0.3)" }
];

function getActionVisual(action: ActionRecommendation, index: number) {
  if (action.id === "renewable-energy") {
    return { symbol: "EN", core: "#00ff88", glow: "rgba(0,255,136,0.35)" };
  }

  if (action.id === "fleet-optimization") {
    return { symbol: "FLT", core: "#4a9eff", glow: "rgba(74,158,255,0.35)" };
  }

  if (action.id === "local-procurement") {
    return { symbol: "SUP", core: "#f0a030", glow: "rgba(240,160,48,0.34)" };
  }

  if (action.id === "travel-planning") {
    return { symbol: "TRV", core: "#ff6b6b", glow: "rgba(255,107,107,0.3)" };
  }

  if (action.id === "waste-recovery") {
    return { symbol: "WST", core: "#a2ff5e", glow: "rgba(162,255,94,0.28)" };
  }

  return {
    symbol: "AI",
    core: fallbackActionColors[index]?.core ?? "#00ff88",
    glow: fallbackActionColors[index]?.glow ?? "rgba(0,255,136,0.35)"
  };
}

export function PanelOrbita({
  score,
  actions,
  briefing,
  isBriefingLoading,
  canGenerateBriefing,
  onGenerateBriefing
}: {
  score: number;
  actions: ActionRecommendation[];
  briefing: BriefingResponse | null;
  isBriefingLoading: boolean;
  canGenerateBriefing: boolean;
  onGenerateBriefing: () => void;
}) {
  const [hovered, setHovered] = useState<ActionRecommendation | null>(actions[0] ?? null);

  useEffect(() => {
    setHovered(actions[0] ?? null);
  }, [actions]);

  const generatedLabel = briefing?.generatedAt
    ? new Date(briefing.generatedAt).toLocaleString("it-IT", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      })
    : null;

  return (
    <div className="grid h-full gap-6 overflow-hidden p-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:p-8">
      <div className="min-h-0">
        <div className="mono-font text-xs uppercase tracking-[0.32em] text-muted">ORBITA AZIONI AI</div>
        <div className="relative mt-8 h-[520px] overflow-hidden">
          <div className="orbital-ring h-[72%] w-[84%] rounded-[50%]" />
          <div className="orbital-ring h-[56%] w-[64%] rounded-[50%]" />
          <div className="orbital-ring h-[38%] w-[44%] rounded-[50%]" />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,136,0.08),transparent_40%)]" />

          <div className="absolute left-1/2 top-1/2 flex h-36 w-36 -translate-x-1/2 -translate-y-1/2 items-center justify-center border border-[rgba(0,255,136,0.3)] bg-[linear-gradient(180deg,rgba(0,255,136,0.14),rgba(74,158,255,0.06))] [clip-path:polygon(24%_6%,76%_6%,100%_50%,76%_94%,24%_94%,0_50%)]">
            <div className="text-center">
              <div className="mono-font text-xs uppercase tracking-[0.22em] text-muted">ESG SCORE</div>
              <div className="display-font mt-2 text-6xl leading-none text-text">{score}</div>
            </div>
          </div>

          {actions.slice(0, 4).map((action, index) => {
            const visual = getActionVisual(action, index);

            return (
              <motion.button
                key={action.id}
                type="button"
                data-interactive="true"
                onMouseEnter={() => setHovered(action)}
                className="planet-sphere absolute flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden border border-white/10 mono-font text-xs uppercase tracking-[0.2em] text-white"
                style={{
                  left: orbitPositions[index].x,
                  top: orbitPositions[index].y,
                  background: `radial-gradient(circle at 30% 28%, rgba(255,255,255,0.38), transparent 0 24%), radial-gradient(circle at 65% 70%, ${visual.glow}, transparent 0 68%), linear-gradient(180deg, rgba(255,255,255,0.12), rgba(0,0,0,0.06))`,
                  boxShadow: `0 0 0 1px rgba(255,255,255,0.06), 0 0 28px ${visual.glow}`
                }}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4 + index, repeat: Infinity, ease: "easeInOut" }}
              >
                <span
                  className="absolute inset-[10px] planet-sphere"
                  style={{
                    background: `radial-gradient(circle at 35% 35%, rgba(255,255,255,0.55), ${visual.core} 60%, rgba(2,10,8,0.9) 100%)`
                  }}
                />
                <span className="relative z-10 text-[11px]">{visual.symbol}</span>
              </motion.button>
            );
          })}

          {hovered ? (
            <div className="absolute right-0 top-0 max-w-xs border border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(6,12,8,0.72),rgba(10,16,22,0.78))] p-4">
              <div className="mono-font text-xs uppercase tracking-[0.24em] text-accent">{hovered.title}</div>
              <div className="mt-3 text-sm leading-7 text-muted">{hovered.description}</div>
              <div className="mono-font mt-4 text-xs uppercase tracking-[0.22em] text-text">
                impatto -{hovered.reductionTco2.toFixed(1)} tCO2eq
              </div>
              <div className="mono-font mt-2 text-xs uppercase tracking-[0.22em] text-muted">
                saving {hovered.annualSavingEur.toLocaleString("it-IT")} eur / anno
              </div>
              <div className="mono-font mt-2 text-xs uppercase tracking-[0.22em] text-muted">
                payback {hovered.paybackMonths} mesi
              </div>
              <div className="mt-3 text-xs leading-6 text-[#f2c574]">{hovered.incentive}</div>
            </div>
          ) : null}
        </div>
      </div>

      <aside className="flex min-h-0 flex-col gap-4">
        <div className="mission-section flex min-h-0 flex-1 flex-col p-5">
          <div className="mono-font text-xs uppercase tracking-[0.24em] text-muted">BRIEFING GIORNALIERO AUDIO</div>
          <div className="mt-3 display-font text-3xl leading-none text-text">DAILY ESG PULSE</div>
          <div className="mt-4 text-sm leading-7 text-muted">
            Genera un briefing vocale con il quadro del giorno, le priorita' ESG e le azioni piu' urgenti.
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="border border-[rgba(255,255,255,0.08)] p-3">
              <div className="hud-label">STATO</div>
              <div className="mono-font mt-2 text-sm text-text">
                {isBriefingLoading ? "GENERAZIONE" : briefing?.audioUrl ? "PRONTO" : "STANDBY"}
              </div>
            </div>
            <div className="border border-[rgba(255,255,255,0.08)] p-3">
              <div className="hud-label">DURATA</div>
              <div className="mono-font mt-2 text-sm text-text">
                {briefing?.estimatedDurationSec ?? 78} SEC
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onGenerateBriefing}
            disabled={!canGenerateBriefing || isBriefingLoading}
            className="custom-cta mt-6 text-left text-sm text-text disabled:cursor-not-allowed disabled:opacity-45"
          >
            <span className="custom-cta-arrow mono-font text-accent">-&gt;</span>
            {isBriefingLoading
              ? "GENERAZIONE BRIEFING IN CORSO"
              : briefing?.audioUrl
                ? "RIGENERA IL BRIEFING DI OGGI"
                : "GENERA IL BRIEFING DI OGGI"}
          </button>

          {briefing ? (
            <>
              <div className="mt-5 border border-[rgba(255,255,255,0.08)] bg-[rgba(3,8,6,0.42)] p-4">
                <div className="hud-label">SORGENTE AUDIO</div>
                <div className="mono-font mt-2 text-sm text-text">
                  {briefing.source === "elevenlabs" ? "ELEVENLABS LIVE" : "DEMO"}
                  {briefing.voiceName ? ` - ${briefing.voiceName}` : ""}
                </div>
                {generatedLabel ? (
                  <div className="mono-font mt-2 text-[11px] uppercase tracking-[0.18em] text-muted">
                    Generato il {generatedLabel}
                  </div>
                ) : null}
                {briefing.audioUrl ? (
                  <audio controls preload="metadata" src={briefing.audioUrl} className="mt-4 w-full opacity-90" />
                ) : null}
              </div>

              {briefing.warning ? (
                <div className="mt-4 border border-[rgba(240,160,48,0.25)] bg-[rgba(240,160,48,0.08)] p-3 text-xs leading-6 text-[#f2c574]">
                  {briefing.warning}
                </div>
              ) : null}

              <div className="mt-4 min-h-0 flex-1 overflow-hidden border border-[rgba(255,255,255,0.08)] bg-[rgba(4,10,8,0.55)] p-4">
                <div className="hud-label">TRASCRIZIONE OPERATIVA</div>
                <div className="mt-3 max-h-[220px] overflow-auto pr-2 text-sm leading-7 text-muted">
                  {briefing.transcript}
                </div>
              </div>
            </>
          ) : (
            <div className="mt-5 border border-dashed border-[rgba(255,255,255,0.1)] p-4 text-sm leading-7 text-muted">
              Il briefing usa score, open data e azioni generate dal motore multi-agent. Premi il comando sopra per creare
              l&apos;audio del giorno.
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
