"use client";

import type { ComplianceSummary } from "@/lib/ai/insights-orchestrator";
import type { BriefingResponse } from "@/lib/types";
import { motion } from "framer-motion";

export function PanelCompliance({
  countdown,
  score,
  actionsCount,
  complianceSummary,
  orchestrationMode,
  briefing,
  isBriefingLoading,
  canGenerateBriefing,
  onGenerateBriefing,
  onPrimaryAction
}: {
  countdown: { days: number; hours: number; minutes: number; seconds: number };
  score: number;
  actionsCount: number;
  complianceSummary: ComplianceSummary;
  orchestrationMode: "multi-agent-llm" | "multi-agent-fallback";
  briefing: BriefingResponse | null;
  isBriefingLoading: boolean;
  canGenerateBriefing: boolean;
  onGenerateBriefing: () => void;
  onPrimaryAction: () => void;
}) {
  const generatedLabel = briefing?.generatedAt
    ? new Date(briefing.generatedAt).toLocaleString("it-IT", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      })
    : null;
  const briefingStatusLabel = briefing ? "Generato" : canGenerateBriefing ? "Pronto" : "In attesa";

  return (
    <div className="scrollbar-hidden grid min-h-full gap-6 overflow-y-auto p-5 lg:p-6">
      <div className="grid gap-6 lg:grid-cols-[0.58fr_0.42fr]">
        <div className="space-y-5">
          <div className="mono-font text-xs uppercase tracking-[0.32em] text-muted">CSRD - READINESS OPERATIVA</div>
          <h2 className="display-font text-[clamp(2.8rem,6vw,5rem)] leading-[0.92] text-text">
            IL TIMER
            <br />
            STA GIRANDO.
          </h2>

          <motion.div
            animate={{ opacity: [0.55, 1, 0.55] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="border border-[rgba(0,255,136,0.16)] p-5 lg:p-6"
          >
            <div className="mono-font text-xs uppercase tracking-[0.26em] text-muted">COUNTDOWN TERMINALE</div>
            <div className="mono-font mt-6 text-[clamp(2.2rem,6vw,4.6rem)] leading-none text-accent">
              {countdown.days} GIORNI - {countdown.hours} ORE
            </div>
            <div className="mono-font mt-4 text-2xl uppercase tracking-[0.18em] text-text">
              {countdown.minutes} MIN - {countdown.seconds} SEC
            </div>
          </motion.div>

          <div className="mission-section overflow-hidden p-5 lg:p-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="mono-font text-xs uppercase tracking-[0.22em] text-muted">READINESS TRACK</div>
                <div className="mt-2 text-sm leading-6 text-muted">Stato della preparazione CSRD rispetto al dossier iniziale.</div>
              </div>
              <div className="mono-font text-3xl text-accent">{complianceSummary.readinessPct}%</div>
            </div>

            <div className="mt-5 h-3 overflow-hidden bg-[rgba(255,255,255,0.05)]">
              <div
                className="h-full bg-[linear-gradient(90deg,rgba(74,158,255,0.92),rgba(0,255,136,0.92))] shadow-[0_0_24px_rgba(0,255,136,0.2)]"
                style={{ width: `${complianceSummary.readinessPct}%` }}
              />
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <div className="border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-3">
                <div className="mono-font text-[10px] uppercase tracking-[0.2em] text-muted">Focus attuale</div>
                <div className="mt-2 text-sm leading-6 text-text">{complianceSummary.focus}</div>
              </div>
              <div className="border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-3">
                <div className="mono-font text-[10px] uppercase tracking-[0.2em] text-muted">Prossimo passo</div>
                <div className="mt-2 text-sm leading-6 text-text">Raccogliere i dati mancanti e formalizzare i presidi necessari per completare la lettura CSRD.</div>
              </div>
            </div>

            <div className="mt-5">
              <div className="mono-font text-[10px] uppercase tracking-[0.22em] text-muted">Dati e presidi ancora mancanti</div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {complianceSummary.missingItems.map((item) => (
                <div
                  key={item}
                  className="mono-font border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-text"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mission-section flex flex-col p-4">
          <div className="mono-font text-xs uppercase tracking-[0.24em] text-muted">AUDIO BRIEFING</div>
          <div className="mt-2 display-font text-2xl leading-none text-text">DAILY ESG PULSE</div>
          <div className="mt-3 text-sm leading-6 text-muted">
            Briefing vocale con priorita' ESG della giornata e azioni piu' urgenti.
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
            <div className="mono-font mt-3 text-[11px] uppercase tracking-[0.18em] text-muted">Generato il {generatedLabel}</div>
          ) : null}

          {briefing ? (
            <>
              <div className="mt-4 border border-[rgba(255,255,255,0.08)] bg-[rgba(3,8,6,0.42)] p-3">
                <div className="hud-label">SORGENTE AUDIO</div>
                <div className="mono-font mt-2 text-sm text-text">
                  {briefing.source === "elevenlabs" ? "ELEVENLABS LIVE" : "DEMO"}
                  {briefing.voiceName ? ` - ${briefing.voiceName}` : ""}
                </div>
                {briefing.audioUrl ? <audio controls preload="metadata" src={briefing.audioUrl} className="mt-3 w-full opacity-90" /> : null}
              </div>

              {briefing.warning ? (
                <div className="mt-4 border border-[rgba(240,160,48,0.25)] bg-[rgba(240,160,48,0.08)] p-3 text-xs leading-6 text-[#f2c574]">
                  {briefing.warning}
                </div>
              ) : null}

              <div className="mt-3 min-h-0 border border-[rgba(255,255,255,0.08)] bg-[rgba(4,10,8,0.55)] p-3">
                <div className="hud-label">TRASCRIZIONE OPERATIVA</div>
                <div className="scrollbar-hidden mt-2 max-h-[120px] overflow-auto pr-2 text-sm leading-6 text-muted">
                  {briefing.transcript}
                </div>
              </div>
            </>
          ) : (
            <div className="mt-4 border border-dashed border-[rgba(255,255,255,0.1)] p-3 text-sm leading-6 text-muted">
              Usa score, open data e azioni del motore multi-agent per generare l&apos;audio del giorno.
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.56fr_0.44fr]">
        <div className="mission-section p-5 lg:p-6">
          <div className="mono-font text-xs uppercase tracking-[0.22em] text-muted">SINTESI COMPLIANCE</div>
          <div className="mt-4 border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.015)] p-4">
            <div className="mono-font text-[10px] uppercase tracking-[0.2em] text-muted">Messaggio principale AI</div>
            <div className="mt-2 text-base leading-7 text-text">{complianceSummary.headline}</div>
          </div>
          {complianceSummary.detail ? (
            <div className="mt-3 border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.015)] p-4">
              <div className="mono-font text-[10px] uppercase tracking-[0.2em] text-muted">Perche' conta</div>
              <div className="mt-2 text-sm leading-7 text-muted">{complianceSummary.detail}</div>
            </div>
          ) : null}
        </div>

        <div className="grid gap-3">
          <div className="mission-section p-4">
            <div className="hud-label">GAP RILEVATI</div>
            <div className="mono-font mt-2 text-3xl text-text">{complianceSummary.missingItems.length}</div>
            <div className="mono-font mt-3 text-[10px] uppercase tracking-[0.18em] text-muted">dati o presidi ancora mancanti</div>
          </div>
          <div className="mission-section p-4">
            <div className="hud-label">AUDIO BRIEFING</div>
            <div className="mono-font mt-2 text-3xl text-accent">{briefingStatusLabel}</div>
            <div className="mono-font mt-3 text-[10px] uppercase tracking-[0.18em] text-muted">
              {briefing ? "briefing della giornata disponibile" : "generazione collegata ai risultati AI"}
            </div>
          </div>
          <div className="mission-section p-4">
            <div className="hud-label">MISSION STATUS</div>
            <div className="mono-font mt-2 text-xs uppercase tracking-[0.18em] text-text">
              ESG {score} - {actionsCount} azioni
            </div>
            <div className="mono-font mt-3 text-[10px] uppercase tracking-[0.18em] text-muted">
              {orchestrationMode === "multi-agent-llm" ? "Compliance da motore llm" : "Compliance da fallback strutturato"}
            </div>
          </div>
        </div>
      </div>

      <button type="button" onClick={onPrimaryAction} className="custom-cta text-left text-sm text-text">
        <span className="custom-cta-arrow mono-font text-accent">-&gt;</span>
        COMPLETA IL TUO REPORT IN 30 GIORNI
      </button>
    </div>
  );
}
