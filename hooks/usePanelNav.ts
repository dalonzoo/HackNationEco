"use client";

import { useEffect, useState } from "react";

export type PanelKey = "TERRA" | "SCANNER" | "ORBITA" | "COMPLIANCE";

const PANELS: PanelKey[] = ["TERRA", "SCANNER", "ORBITA", "COMPLIANCE"];

export function usePanelNav(initialPanel: PanelKey = "TERRA") {
  const [activePanel, setActivePanel] = useState<PanelKey>(initialPanel);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

      const currentIndex = PANELS.indexOf(activePanel);
      const direction = event.key === "ArrowRight" ? 1 : -1;
      const nextIndex = (currentIndex + direction + PANELS.length) % PANELS.length;
      setActivePanel(PANELS[nextIndex]);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activePanel]);

  return {
    activePanel,
    panels: PANELS,
    setActivePanel
  };
}
