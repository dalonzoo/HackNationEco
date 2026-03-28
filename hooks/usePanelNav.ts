"use client";

import { useEffect, useState } from "react";

export type PanelKey = "TERRA" | "SCANNER" | "ORBITA" | "COMPLIANCE";

const PANELS: PanelKey[] = ["SCANNER", "TERRA", "ORBITA", "COMPLIANCE"];

export function usePanelNav(initialPanel: PanelKey = "SCANNER", availablePanels: PanelKey[] = PANELS) {
  const [activePanel, setActivePanel] = useState<PanelKey>(initialPanel);

  useEffect(() => {
    if (availablePanels.includes(activePanel)) return;
    setActivePanel(availablePanels[0] ?? PANELS[0]);
  }, [activePanel, availablePanels]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

      const panels = availablePanels.length ? availablePanels : PANELS;
      const currentIndex = panels.indexOf(activePanel);
      if (currentIndex === -1) return;
      const direction = event.key === "ArrowRight" ? 1 : -1;
      const nextIndex = (currentIndex + direction + panels.length) % panels.length;
      setActivePanel(panels[nextIndex]);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activePanel, availablePanels]);

  const panels = availablePanels.length ? availablePanels : PANELS;
  const activeIndex = panels.indexOf(activePanel);

  return {
    activePanel,
    panels: PANELS,
    setActivePanel,
    canGoPrevious: activeIndex > 0,
    canGoNext: activeIndex !== -1 && activeIndex < panels.length - 1,
    goToPrevious: () => {
      if (activeIndex <= 0) return;
      setActivePanel(panels[activeIndex - 1]);
    },
    goToNext: () => {
      if (activeIndex === -1 || activeIndex >= panels.length - 1) return;
      setActivePanel(panels[activeIndex + 1]);
    }
  };
}
