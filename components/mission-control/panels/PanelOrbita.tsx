"use client";

import type { ActionRecommendation, BriefingResponse } from "@/lib/types";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const orbitPositions = [
  { x: 18, y: 28 },
  { x: 80, y: 28 },
  { x: 74, y: 78 },
  { x: 24, y: 76 }
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

const actionKindLabelMap = {
  calendar: "CALENDAR",
  search: "SEARCH",
  maps: "MAPS",
  workflow: "WORKFLOW"
} as const;

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
  const [selectedActionId, setSelectedActionId] = useState<string | null>(null);

  useEffect(() => {
    setSelectedActionId((current) => {
      if (current && actions.some((action) => action.id === current)) {
        return current;
      }

      return actions[0]?.id ?? null;
    });
  }, [actions]);

  const selectedAction = actions.find((action) => action.id === selectedActionId) ?? actions[0] ?? null;

  const generatedLabel = briefing?.generatedAt
    ? new Date(briefing.generatedAt).toLocaleString("it-IT", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      })
    : null;

  return (
    <div className="grid h-full gap-6 overflow-hidden p-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,380px)] lg:p-8">
      <div className="mission-section min-h-0 p-5 lg:p-6">
        <div className="mono-font text-xs uppercase tracking-[0.32em] text-muted">ORBITA AZIONI AI</div>
        <div className="mt-3 text-sm leading-7 text-muted">
          Le sfere restano al centro dell&apos;orbita. Il dettaglio completo appare sempre nella colonna destra.
        </div>

        <div className="relative mt-8 h-[420px] overflow-hidden rounded-[28px] border border-[rgba(255,255,255,0.06)] bg-[linear-gradient(180deg,rgba(7,12,9,0.9),rgba(6,10,14,0.94))] lg:h-[calc(100%-4.5rem)] lg:min-h-[480px]">
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
                aria-pressed={selectedActionId === action.id}
                onClick={() => setSelectedActionId(action.id)}
                className="planet-sphere absolute flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden border border-white/10 mono-font text-xs uppercase tracking-[0.2em] text-white"
                style={{
                  left: `${orbitPositions[index].x}%`,
                  top: `${orbitPositions[index].y}%`,
                  background: `radial-gradient(circle at 30% 28%, rgba(255,255,255,0.38), transparent 0 24%), radial-gradient(circle at 65% 70%, ${visual.glow}, transparent 0 68%), linear-gradient(180deg, rgba(255,255,255,0.12), rgba(0,0,0,0.06))`,
                  boxShadow:
                    selectedActionId === action.id
                      ? `0 0 0 1px rgba(255,255,255,0.18), 0 0 42px ${visual.glow}`
                      : `0 0 0 1px rgba(255,255,255,0.06), 0 0 28px ${visual.glow}`
                }}
                animate={{ y: [0, -8, 0], scale: selectedActionId === action.id ? 1.08 : 1 }}
                whileHover={{ scale: 1.04 }}
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
        </div>
      </div>

      <aside className="flex min-h-0 flex-col gap-4">
        <div className="mission-section flex min-h-[320px] flex-1 flex-col overflow-hidden p-5">
          <div className="mono-font text-xs uppercase tracking-[0.24em] text-muted">DETTAGLIO AZIONE</div>

          <div className="mt-4 min-h-0 flex-1 overflow-y-auto pr-1">
            {selectedAction ? (
              <>
                <div className="text-sm leading-6 text-text">{selectedAction.title}</div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <div className="mono-font border border-[rgba(255,255,255,0.08)] px-2 py-1 text-[11px] uppercase tracking-[0.18em] text-text">
                    priorita&apos; {selectedAction.priority}
                  </div>
                  <div className="mono-font border border-[rgba(255,255,255,0.08)] px-2 py-1 text-[11px] uppercase tracking-[0.18em] text-muted">
                    difficolta&apos; {selectedAction.difficulty}/5
                  </div>
                </div>

                <div className="mt-3 text-sm leading-7 text-muted">{selectedAction.description}</div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="border border-[rgba(255,255,255,0.08)] p-3">
                    <div className="hud-label">IMPATTO</div>
                    <div className="mono-font mt-2 text-xs uppercase tracking-[0.18em] text-text">
                      -{selectedAction.reductionTco2.toFixed(1)} tCO2eq
                    </div>
                  </div>
                  <div className="border border-[rgba(255,255,255,0.08)] p-3">
                    <div className="hud-label">PAYBACK</div>
                    <div className="mono-font mt-2 text-xs uppercase tracking-[0.18em] text-text">
                      {selectedAction.paybackMonths} MESI
                    </div>
                  </div>
                </div>

                <div className="mono-font mt-3 text-xs uppercase tracking-[0.2em] text-muted">
                  saving {selectedAction.annualSavingEur.toLocaleString("it-IT")} eur / anno
                </div>
                <div className="mt-2 text-xs leading-6 text-[#f2c574]">{selectedAction.incentive}</div>

                {selectedAction.directActions?.length ? (
                  <div className="mt-4 space-y-2">
                    {selectedAction.directActions.map((directAction) => (
                      <a
                        key={directAction.id}
                        href={directAction.href}
                        target="_blank"
                        rel="noreferrer"
                        className="block border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-3 transition hover:border-[rgba(0,255,136,0.25)] hover:bg-[rgba(0,255,136,0.05)]"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="mono-font text-[11px] uppercase tracking-[0.2em] text-text">{directAction.label}</div>
                          <div className="mono-font text-[10px] uppercase tracking-[0.18em] text-muted">
                            {actionKindLabelMap[directAction.kind]}
                          </div>
                        </div>
                        <div className="mt-2 text-xs leading-6 text-muted">{directAction.description}</div>
                      </a>
                    ))}
                  </div>
                ) : null}
              </>
            ) : (
              <div className="border border-dashed border-[rgba(255,255,255,0.1)] p-4 text-sm leading-7 text-muted">
                Nessuna azione selezionata.
              </div>
            )}
          </div>
        </div>

        <div className="mission-section flex shrink-0 flex-col p-4 lg:max-h-[34%]">
          <div className="mono-font text-xs uppercase tracking-[0.24em] text-muted">BRIEFING GIORNALIERO AUDIO</div>
          <div className="mt-2 display-font text-2xl leading-none text-text">DAILY ESG PULSE</div>
          <div className="mt-3 text-sm leading-6 text-muted">
            Genera un briefing vocale con il quadro del giorno, le priorita' ESG e le azioni piu' urgenti.
          </div>

          <button
            type="button"
            onClick={onGenerateBriefing}
            disabled={!canGenerateBriefing || isBriefingLoading}
            className="custom-cta mt-4 text-left text-sm text-text disabled:cursor-not-allowed disabled:opacity-45"
          >
            <span className="custom-cta-arrow mono-font text-accent">-&gt;</span>
            {isBriefingLoading
              ? "GENERAZIONE BRIEFING IN CORSO"
              : briefing?.audioUrl
                ? "RIGENERA IL BRIEFING DI OGGI"
                : "GENERA IL BRIEFING DI OGGI"}
          </button>

          {generatedLabel ? (
            <div className="mono-font mt-3 text-[11px] uppercase tracking-[0.18em] text-muted">
              Generato il {generatedLabel}
            </div>
          ) : null}

          {briefing ? (
            <>
              <div className="mt-4 border border-[rgba(255,255,255,0.08)] bg-[rgba(3,8,6,0.42)] p-3">
                <div className="hud-label">SORGENTE AUDIO</div>
                <div className="mono-font mt-2 text-sm text-text">
                  {briefing.source === "elevenlabs" ? "ELEVENLABS LIVE" : "DEMO"}
                  {briefing.voiceName ? ` - ${briefing.voiceName}` : ""}
                </div>
                {briefing.audioUrl ? (
                  <audio controls preload="metadata" src={briefing.audioUrl} className="mt-3 w-full opacity-90" />
                ) : null}
              </div>

              {briefing.warning ? (
                <div className="mt-4 border border-[rgba(240,160,48,0.25)] bg-[rgba(240,160,48,0.08)] p-3 text-xs leading-6 text-[#f2c574]">
                  {briefing.warning}
                </div>
              ) : null}

              <div className="mt-3 min-h-0 border border-[rgba(255,255,255,0.08)] bg-[rgba(4,10,8,0.55)] p-3">
                <div className="hud-label">TRASCRIZIONE OPERATIVA</div>
                <div className="mt-2 max-h-[96px] overflow-auto pr-2 text-sm leading-6 text-muted">
                  {briefing.transcript}
                </div>
              </div>
            </>
          ) : (
            <div className="mt-4 border border-dashed border-[rgba(255,255,255,0.1)] p-3 text-sm leading-6 text-muted">
              Il briefing usa score, open data e azioni generate dal motore multi-agent. Premi il comando sopra per creare
              l&apos;audio del giorno.
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
