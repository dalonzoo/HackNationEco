"use client";

export function StatusBar({
  updatedAt,
  aiMode
}: {
  updatedAt: string;
  aiMode: "multi-agent-llm" | "multi-agent-fallback" | "loading";
}) {
  return (
    <div className="mission-section relative z-10 h-8 overflow-hidden px-4">
      <div className="status-marquee mono-font flex h-full items-center gap-8 text-[10px] uppercase tracking-[0.26em] text-ghost">
        <span>* ECOSYNCHRO AI ONLINE</span>
        <span>
          ORCHESTRAZIONE:{" "}
          {aiMode === "multi-agent-llm"
            ? "LLM MULTI-AGENT"
            : aiMode === "multi-agent-fallback"
              ? "FALLBACK MULTI-AGENT"
              : "BOOT IN CORSO"}
        </span>
        <span>ULTIMO AGGIORNAMENTO: {updatedAt}</span>
        <span>DATI: ISPRA - GSE - OPENMETEO</span>
        <span>GDPR COMPLIANT</span>
        <span>COPYRIGHT 2026</span>
        <span>* ECOSYNCHRO AI ONLINE</span>
        <span>
          ORCHESTRAZIONE:{" "}
          {aiMode === "multi-agent-llm"
            ? "LLM MULTI-AGENT"
            : aiMode === "multi-agent-fallback"
              ? "FALLBACK MULTI-AGENT"
              : "BOOT IN CORSO"}
        </span>
        <span>ULTIMO AGGIORNAMENTO: {updatedAt}</span>
        <span>DATI: ISPRA - GSE - OPENMETEO</span>
        <span>GDPR COMPLIANT</span>
        <span>COPYRIGHT 2026</span>
      </div>
    </div>
  );
}
