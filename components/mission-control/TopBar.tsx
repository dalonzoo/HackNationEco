"use client";

import { motion, useReducedMotion } from "framer-motion";

export function TopBar({
  company,
  aiMode,
  updatedAt,
  primaryLabel,
  showPrimaryAction = true,
  onPrimaryAction
}: {
  company: string;
  aiMode: "multi-agent-llm" | "multi-agent-fallback" | "loading";
  updatedAt: string;
  primaryLabel: string;
  showPrimaryAction?: boolean;
  onPrimaryAction: () => void;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <header className="mission-section topbar-glow relative z-10 flex h-12 items-center justify-between gap-3 px-3 lg:px-4">
      <div className="flex min-w-0 items-center gap-2 lg:gap-3">
        <div className="display-font flex items-center gap-2 text-2xl uppercase tracking-[0.18em] text-text">
          <span className="signal-dot" />
          EcoSignal
        </div>
        <span className="mono-font hidden border border-[rgba(0,255,136,0.2)] px-2 py-1 text-[10px] uppercase tracking-[0.22em] text-muted sm:inline-flex">
          Enterprise
        </span>
        <span
          className={`mono-font hidden border px-2 py-1 text-[10px] uppercase tracking-[0.2em] lg:inline-flex ${
            aiMode === "multi-agent-llm"
              ? "border-[rgba(0,255,136,0.26)] text-accent"
              : aiMode === "multi-agent-fallback"
                ? "border-[rgba(240,160,48,0.3)] text-[var(--amber)]"
                : "border-[rgba(255,255,255,0.12)] text-muted"
          }`}
        >
          {aiMode === "multi-agent-llm"
            ? "LLM multi-agent"
            : aiMode === "multi-agent-fallback"
              ? "Fallback multi-agent"
              : "AI boot"}
        </span>
      </div>

      <div className="mono-font hidden min-w-0 items-center gap-4 truncate text-[10px] uppercase tracking-[0.22em] text-muted xl:flex">
        <span>Sistema attivo</span>
        <span>Dati agg. {updatedAt}</span>
        <span>{company}</span>
      </div>

      {showPrimaryAction ? (
        <motion.button
          type="button"
          onClick={onPrimaryAction}
          whileHover={reduceMotion ? undefined : { y: -1 }}
          whileTap={reduceMotion ? undefined : { scale: 0.985 }}
          className="nav-button data-sheen mono-font border border-[rgba(0,255,136,0.28)] bg-[rgba(0,255,136,0.04)] px-3 py-2 text-[10px] uppercase tracking-[0.26em] text-accent"
        >
          {primaryLabel}
        </motion.button>
      ) : null}
    </header>
  );
}
