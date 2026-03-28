"use client";

import type { BriefingResponse } from "@/lib/types";
import { motion } from "framer-motion";

export function PanelCompliance({
  countdown,
  score,
  actionsCount,
  complianceTrace,
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
  complianceTrace: string;
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
        </div>

        <div className="mission-section flex flex-col p-4">
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
              Il briefing usa score, open data e azioni generate dal motore multi-agent. Premi il comando sopra per creare l&apos;audio del giorno.
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.56fr_0.44fr]">
        <div className="space-y-4">
          <div className="mono-font text-xs uppercase tracking-[0.22em] text-muted">73% completato</div>
          <div className="h-4 bg-[rgba(255,255,255,0.05)]">
            <div className="h-full w-[73%] bg-accent" />
          </div>
          <div className="mono-font text-xs uppercase tracking-[0.2em] text-muted">Mancano: ESRS E1 - ESRS E2 - GRI 305</div>

          <div className="border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.015)] p-4 text-sm leading-7 text-muted">
            {complianceTrace}
          </div>
        </div>

        <div className="grid gap-3">
          <div className="mission-section p-4">
            <div className="hud-label">AZIENDE NELLA TUA SITUAZIONE</div>
            <div className="mono-font mt-2 text-3xl text-text">127.000</div>
          </div>
          <div className="mission-section p-4">
            <div className="hud-label">GIA' ATTIVATE CON ECOSIGNAL</div>
            <div className="mono-font mt-2 text-3xl text-accent">3.400</div>
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
