"use client";

import { motion } from "framer-motion";

export interface FeedMetric {
  id: string;
  label: string;
  value: string;
  detail: string;
  tone: "accent" | "blue" | "amber" | "red";
  bar: number;
}

const toneClassMap: Record<FeedMetric["tone"], string> = {
  accent: "text-accent border-accent/25",
  blue: "text-[var(--blue-data)] border-[rgba(74,158,255,0.25)]",
  amber: "text-[var(--amber)] border-[rgba(240,160,48,0.25)]",
  red: "text-[var(--red-alert)] border-[rgba(255,74,74,0.25)]"
};

const toneBarMap: Record<FeedMetric["tone"], string> = {
  accent: "bg-accent",
  blue: "bg-[var(--blue-data)]",
  amber: "bg-[var(--amber)]",
  red: "bg-[var(--red-alert)]"
};

export function LiveFeed({ metrics }: { metrics: FeedMetric[] }) {
  return (
    <aside className="mission-section flex min-h-0 flex-col overflow-hidden p-4">
      <div className="mono-font text-[10px] uppercase tracking-[0.3em] text-muted">Feed ambientale - IT</div>
      <div className="mono-font mt-2 text-[10px] uppercase tracking-[0.2em] text-ghost">
        sorgenti: open data live/demo - refresh 30s
      </div>
      <div className="mt-4 flex flex-1 flex-col gap-3 overflow-y-auto pr-1">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.24, delay: index * 0.05 }}
            className="relative overflow-hidden border border-[rgba(0,255,136,0.08)] bg-[rgba(6,12,8,0.55)] p-3"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_90%_20%,rgba(255,255,255,0.06),transparent_22%)]" />
            <div className="mono-font text-[10px] uppercase tracking-[0.24em] text-muted">{metric.label}</div>
            <motion.div
              key={`${metric.id}-${metric.value}`}
              initial={{ opacity: 0.4, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-2 mono-font text-lg uppercase ${toneClassMap[metric.tone]}`}
            >
              {metric.value}
            </motion.div>
            <div className="mono-font mt-1 text-[10px] uppercase tracking-[0.2em] text-muted">{metric.detail}</div>
            <div className="mt-3 h-1 bg-[rgba(255,255,255,0.05)]">
              <motion.div
                className={`h-full ${toneBarMap[metric.tone]}`}
                animate={{ width: `${metric.bar}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </aside>
  );
}
