"use client";

import type { PanelKey } from "@/hooks/usePanelNav";

export function NavVertical({
  panels,
  activePanel,
  city,
  coordinates,
  statuses,
  onChange
}: {
  panels: PanelKey[];
  activePanel: PanelKey;
  city: string;
  coordinates: string;
  statuses: Record<PanelKey, "ready" | "loading" | "locked">;
  onChange: (panel: PanelKey) => void;
}) {
  return (
    <aside className="mission-section flex flex-row gap-6 p-4 lg:flex-col lg:justify-between">
      <div className="space-y-2">
        {panels.map((panel) => {
          const isActive = panel === activePanel;
          const status = statuses[panel];
          const isReady = status === "ready";

          return (
            <button
              key={panel}
              type="button"
              onClick={() => {
                if (!isReady) return;
                onChange(panel);
              }}
              disabled={!isReady}
              className={`mono-font flex w-full items-center justify-between gap-3 border-l-2 pl-3 text-left text-xs uppercase tracking-[0.3em] ${
                isActive
                  ? "border-accent text-text"
                  : isReady
                    ? "border-transparent text-muted"
                    : "border-transparent text-ghost"
              }`}
            >
              <span className="flex items-center gap-3">
                <span className={`${isActive ? "text-accent" : status === "loading" ? "animate-pulse text-[var(--blue-data)]" : "text-ghost"}`}>
                  {isActive ? "*" : status === "ready" ? "+" : status === "loading" ? "~" : "."}
                </span>
                {panel}
              </span>
              <span className="text-[9px] tracking-[0.2em] text-muted">
                {status === "ready" ? "OK" : status === "loading" ? "..." : "--"}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mono-font hidden space-y-2 text-[10px] uppercase tracking-[0.26em] text-muted lg:block">
        <div>SYS STATUS</div>
        <div className="text-accent">ONLINE</div>
        <div>v2.5.1</div>
        <div className="mt-6">{coordinates}</div>
        <div>{city.toUpperCase()} - IT</div>
      </div>
    </aside>
  );
}
