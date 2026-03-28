"use client";

import type { PanelKey } from "@/hooks/usePanelNav";

export function NavVertical({
  panels,
  activePanel,
  city,
  coordinates,
  onChange
}: {
  panels: PanelKey[];
  activePanel: PanelKey;
  city: string;
  coordinates: string;
  onChange: (panel: PanelKey) => void;
}) {
  return (
    <aside className="mission-section flex flex-row gap-6 p-4 lg:flex-col lg:justify-between">
      <div className="space-y-2">
        {panels.map((panel) => {
          const isActive = panel === activePanel;

          return (
            <button
              key={panel}
              type="button"
              onClick={() => onChange(panel)}
              className={`mono-font flex w-full items-center gap-3 border-l-2 pl-3 text-left text-xs uppercase tracking-[0.3em] ${
                isActive ? "border-accent text-text" : "border-transparent text-muted"
              }`}
            >
              <span className={`${isActive ? "text-accent" : "text-ghost"}`}>{isActive ? "*" : "."}</span>
              {panel}
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
