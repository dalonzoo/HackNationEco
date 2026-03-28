"use client";

import { motion } from "framer-motion";

export function PanelCompliance({
  countdown,
  onPrimaryAction
}: {
  countdown: { days: number; hours: number; minutes: number; seconds: number };
  onPrimaryAction: () => void;
}) {
  return (
    <div className="grid h-full gap-8 p-6 lg:p-8">
      <div className="space-y-5">
        <div className="mono-font text-xs uppercase tracking-[0.32em] text-muted">CSRD - READINESS OPERATIVA</div>
        <h2 className="display-font text-[clamp(3rem,7vw,5.4rem)] leading-[0.9] text-text">
          IL TIMER
          <br />
          STA GIRANDO.
        </h2>
      </div>

      <motion.div
        animate={{ opacity: [0.55, 1, 0.55] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="border border-[rgba(0,255,136,0.16)] p-6"
      >
        <div className="mono-font text-xs uppercase tracking-[0.26em] text-muted">COUNTDOWN TERMINALE</div>
        <div className="mono-font mt-6 text-[clamp(2.2rem,6vw,4.6rem)] leading-none text-accent">
          {countdown.days} GIORNI - {countdown.hours} ORE
        </div>
        <div className="mono-font mt-4 text-2xl uppercase tracking-[0.18em] text-text">
          {countdown.minutes} MIN - {countdown.seconds} SEC
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-[0.56fr_0.44fr]">
        <div className="space-y-4">
          <div className="mono-font text-xs uppercase tracking-[0.22em] text-muted">73% completato</div>
          <div className="h-4 bg-[rgba(255,255,255,0.05)]">
            <div className="h-full w-[73%] bg-accent" />
          </div>
          <div className="mono-font text-xs uppercase tracking-[0.2em] text-muted">Mancano: ESRS E1 - ESRS E2 - GRI 305</div>
        </div>
        <div className="grid gap-3">
          <div className="mission-section p-4">
            <div className="hud-label">AZIENDE NELLA TUA SITUAZIONE</div>
            <div className="mono-font mt-2 text-3xl text-text">127.000</div>
          </div>
          <div className="mission-section p-4">
            <div className="hud-label">GIA&apos; ATTIVATE CON ECOSIGNAL</div>
            <div className="mono-font mt-2 text-3xl text-accent">3.400</div>
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
