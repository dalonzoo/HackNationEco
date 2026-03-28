"use client";

import { ChoiceChips } from "@/components/ui/ecosignal-kit";
import type { DataSourceEntry, OnboardingData } from "@/lib/types";
import { useRef, useState } from "react";

export function PanelScanner({
  sector,
  employeeValue,
  electricityKwh,
  carbonTotal,
  scopeValues,
  percentileLabel,
  ingestionNotice,
  sources,
  sectors,
  onSectorChange,
  onEmployeeChange,
  onElectricityChange,
  onLoadDemo,
  onFilesAdded,
  onGoOrbita
}: {
  sector: string;
  employeeValue: number;
  electricityKwh: number;
  carbonTotal: number;
  scopeValues: { label: string; value: number; width: number }[];
  percentileLabel: string;
  ingestionNotice: string;
  sources: DataSourceEntry[];
  sectors: readonly string[];
  onSectorChange: (value: OnboardingData["sector"]) => void;
  onEmployeeChange: (value: number) => void;
  onElectricityChange: (value: number) => void;
  onLoadDemo: () => void;
  onFilesAdded: (files: File[]) => Promise<void>;
  onGoOrbita: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  async function handleDrop(files: FileList | null) {
    if (!files?.length) return;
    await onFilesAdded(Array.from(files));
  }

  return (
    <div className="grid h-full min-h-0 gap-6 lg:grid-cols-[0.46fr_0.54fr]">
      <div className="min-h-0 space-y-6 overflow-y-auto p-6 lg:p-8">
        <div>
          <div className="mono-font text-xs uppercase tracking-[0.32em] text-muted">SCANNER LIVE</div>
          <h2 className="display-font mt-3 text-[clamp(2.8rem,6vw,5rem)] leading-[0.92] text-text">
            DATI IN CHIARO.
            <br />
            CALCOLO TRACCIABILE.
          </h2>
        </div>

        <div className="grid gap-4">
          <div
            data-interactive="true"
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragActive(true);
            }}
            onDragLeave={() => setIsDragActive(false)}
            onDrop={async (event) => {
              event.preventDefault();
              setIsDragActive(false);
              await handleDrop(event.dataTransfer.files);
            }}
            className={`border p-4 transition ${
              isDragActive
                ? "border-accent bg-[rgba(0,255,136,0.08)]"
                : "border-[rgba(0,255,136,0.12)] bg-[rgba(255,255,255,0.02)]"
            }`}
          >
            <div className="mono-font text-xs uppercase tracking-[0.22em] text-accent">DRAG AND DROP DOCUMENTI</div>
            <div className="mt-3 text-sm leading-7 text-muted">
              Carica CSV, JSON o TXT con bollette, consumi o KPI aziendali. I campi riconosciuti aggiornano subito il modello.
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <button type="button" onClick={() => fileInputRef.current?.click()} className="mono-font border border-[rgba(74,158,255,0.28)] px-3 py-2 text-[10px] uppercase tracking-[0.24em] text-[var(--blue-data)]">
                Carica file
              </button>
              <button type="button" onClick={onLoadDemo} className="mono-font border border-[rgba(240,160,48,0.28)] px-3 py-2 text-[10px] uppercase tracking-[0.24em] text-[var(--amber)]">
                Usa dataset demo
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".csv,.json,.txt,.pdf,.xlsx"
              onChange={async (event) => await handleDrop(event.target.files)}
              className="hidden"
            />
          </div>

          <div className="border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.015)] p-4">
            <div className="mono-font text-xs uppercase tracking-[0.22em] text-muted">ALTRI MODI DI INSERIMENTO</div>
            <div className="mt-3 text-sm leading-7 text-muted">
              Puoi anche usare input manuale sotto, ricaricare il dataset demo oppure trascinare un documento strutturato.
            </div>
          </div>
        </div>

        <div className="space-y-5 border-t border-[rgba(0,255,136,0.08)] pt-6">
          <div className="space-y-3">
            <div className="hud-label">SETTORE</div>
            <ChoiceChips options={sectors} value={sector} onChange={onSectorChange} />
          </div>

          <label className="block space-y-3">
            <span className="hud-label">DIPENDENTI</span>
            <input
              type="range"
              min="20"
              max="500"
              step="10"
              value={employeeValue}
              onChange={(event) => onEmployeeChange(Number(event.target.value))}
              className="w-full accent-accent"
            />
            <div className="mono-font text-sm text-text">{employeeValue} risorse presidiate</div>
          </label>

          <label className="block space-y-3">
            <span className="hud-label">ELETTRICITA&apos; ANNUA</span>
            <input
              type="number"
              min="0"
              value={electricityKwh}
              onChange={(event) => onElectricityChange(Number(event.target.value))}
              className="mono-font w-full border border-[rgba(0,255,136,0.16)] bg-transparent px-4 py-3 text-sm text-text outline-none"
            />
          </label>
        </div>
      </div>

      <div className="min-h-0 overflow-y-auto border-l border-[rgba(0,255,136,0.08)] p-6 lg:p-8">
        <div className="mono-font text-xs uppercase tracking-[0.32em] text-muted">OUTPUT LIVE</div>
        <div className="mono-font mt-6 text-[clamp(3rem,8vw,5.5rem)] leading-none text-accent">
          {carbonTotal.toFixed(0)} t
        </div>
        <div className="mono-font mt-2 text-xs uppercase tracking-[0.28em] text-muted">CO2 / anno</div>

        <div className="mt-8 space-y-5">
          {scopeValues.map((scope) => (
            <div key={scope.label} className="space-y-2">
              <div className="mono-font flex items-center justify-between text-xs uppercase tracking-[0.26em] text-muted">
                <span>{scope.label}</span>
                <span className="text-text">{scope.value.toFixed(0)} t</span>
              </div>
              <div className="h-3 bg-[rgba(255,255,255,0.04)]">
                <div className="h-full bg-accent transition-[width] duration-500 ease-out" style={{ width: `${scope.width}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.015)] p-4">
          <div className="mono-font text-xs uppercase tracking-[0.22em] text-[var(--amber)]">TRACCIABILITA&apos; ATTIVA</div>
          <div className="mt-3 text-sm leading-7 text-muted">{ingestionNotice}</div>
          <div className="mt-4 space-y-3">
            {sources.map((source) => (
              <div key={source.id} className="border border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.015)] p-3">
                <div className="mono-font flex items-center justify-between text-[10px] uppercase tracking-[0.22em] text-text">
                  <span>{source.label}</span>
                  <span className="text-muted">{source.updatedAt}</span>
                </div>
                <div className="mt-2 text-xs uppercase tracking-[0.18em] text-muted">{source.origin}</div>
                <div className="mt-2 text-sm leading-6 text-muted">{source.note}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.015)] p-4">
          <div className="mono-font text-xs uppercase tracking-[0.22em] text-muted">{percentileLabel}</div>
          <button type="button" onClick={onGoOrbita} className="custom-cta mt-5 text-left text-sm text-text">
            <span className="custom-cta-arrow mono-font text-accent">-&gt;</span>
            SCOPRI LE AZIONI CHE TI PORTANO NEL TOP 20%
          </button>
        </div>
      </div>
    </div>
  );
}
