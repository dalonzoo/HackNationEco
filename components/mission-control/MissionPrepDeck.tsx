"use client";

import type { PanelKey } from "@/hooks/usePanelNav";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type CardStatus = "ready" | "loading" | "locked";
type AgentStatus = "queued" | "running" | "done";

export interface MissionPrepCard {
  panel: PanelKey;
  title: string;
  description: string;
  detail: string;
  status: CardStatus;
}

export interface MissionAgentIndicator {
  id: string;
  label: string;
  detail: string;
  status: AgentStatus;
}

const statusLabelMap: Record<CardStatus, string> = {
  ready: "Pronta",
  loading: "In caricamento",
  locked: "In attesa"
};

const statusClassMap: Record<CardStatus, string> = {
  ready: "border-[rgba(0,255,136,0.2)] text-accent",
  loading: "border-[rgba(74,158,255,0.24)] text-[var(--blue-data)]",
  locked: "border-[rgba(255,255,255,0.08)] text-muted"
};

const agentStatusLabelMap: Record<AgentStatus, string> = {
  queued: "queued",
  running: "running",
  done: "done"
};

export function MissionPrepDeck({
  cards,
  agents,
  activePanel,
  variant = "full",
  onSelect
}: {
  cards: MissionPrepCard[];
  agents: MissionAgentIndicator[];
  activePanel: PanelKey;
  variant?: "full" | "deck-only";
  onSelect: (panel: PanelKey) => void;
}) {
  const reduceMotion = useReducedMotion();
  const deckOnly = variant === "deck-only";

  return (
    <div className={`${deckOnly ? "w-full p-6 lg:p-8" : "mission-section overflow-hidden p-4 lg:p-5"}`}>
      {!deckOnly ? (
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="mono-font text-[10px] uppercase tracking-[0.3em] text-muted">
              Mission deck
            </div>
            <div className="display-font mt-2 text-[clamp(1.5rem,2vw,2rem)] uppercase tracking-[0.12em] text-text">
              Quattro viste, una sola corsa dati
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className={`mono-font flex min-w-[140px] items-center justify-between gap-3 border px-3 py-2 text-[10px] uppercase tracking-[0.2em] ${
                  agent.status === "done"
                    ? "border-[rgba(0,255,136,0.18)] text-text"
                    : agent.status === "running"
                      ? "border-[rgba(74,158,255,0.24)] text-[var(--blue-data)]"
                      : "border-[rgba(255,255,255,0.08)] text-muted"
                }`}
              >
                <span>{agent.label}</span>
                <span className="flex items-center gap-2">
                  <span
                    className={`inline-flex h-2 w-2 rounded-full ${
                      agent.status === "done"
                        ? "bg-accent"
                        : agent.status === "running"
                          ? "animate-pulse bg-[var(--blue-data)]"
                          : "bg-[rgba(255,255,255,0.18)]"
                    }`}
                  />
                  {agentStatusLabelMap[agent.status]}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className={`${deckOnly ? "grid h-full content-center gap-4 md:grid-cols-2 xl:grid-cols-4" : "mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4"}`}>
        {cards.map((card, index) => {
          const isReady = card.status === "ready";
          const isActive = card.panel === activePanel;

          return (
            <motion.button
              key={card.panel}
              type="button"
              disabled={!isReady}
              data-interactive="true"
              onClick={() => onSelect(card.panel)}
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: reduceMotion ? 0 : index * 0.06, duration: 0.22 }}
              className={`group relative overflow-hidden border p-4 text-left transition ${
                isReady
                  ? "border-[rgba(0,255,136,0.14)] bg-[linear-gradient(180deg,rgba(8,14,10,0.92),rgba(7,12,9,0.96))]"
                  : "border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(7,11,9,0.84),rgba(6,10,8,0.92))]"
              } ${isActive ? "shadow-[0_0_0_1px_rgba(0,255,136,0.14),0_14px_30px_rgba(0,255,136,0.08)]" : ""} ${
                isReady ? "hover:-translate-y-1 hover:border-[rgba(0,255,136,0.22)]" : "cursor-not-allowed"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="mono-font text-[10px] uppercase tracking-[0.28em] text-muted">{card.panel}</div>
                  <div className="mt-2 display-font text-2xl uppercase tracking-[0.1em] text-text">{card.title}</div>
                </div>

                <span className={`mono-font border px-2 py-1 text-[10px] uppercase tracking-[0.18em] ${statusClassMap[card.status]}`}>
                  {statusLabelMap[card.status]}
                </span>
              </div>

              <div className="mt-4 text-sm leading-6 text-muted">{card.description}</div>
              <div className="mt-4 mono-font text-[11px] uppercase tracking-[0.18em] text-text">{card.detail}</div>

              <div className="mt-4 h-px overflow-hidden bg-[rgba(255,255,255,0.06)]">
                <AnimatePresence mode="wait">
                  {card.status === "loading" ? (
                    <motion.div
                      key="loading"
                      className="h-full bg-[var(--blue-data)]"
                      initial={{ width: "18%", x: "-100%" }}
                      animate={{ width: "38%", x: "260%" }}
                      exit={{ opacity: 0 }}
                      transition={{ repeat: Infinity, duration: reduceMotion ? 0.8 : 1.4, ease: "easeInOut" }}
                    />
                  ) : (
                    <motion.div
                      key={card.status}
                      className={`h-full ${card.status === "ready" ? "bg-accent" : "bg-[rgba(255,255,255,0.1)]"}`}
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: reduceMotion ? 0 : 0.28 }}
                    />
                  )}
                </AnimatePresence>
              </div>

              {isActive ? (
                <motion.div
                  layoutId="active-panel-card"
                  className="pointer-events-none absolute inset-0 border border-[rgba(0,255,136,0.2)]"
                />
              ) : null}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
